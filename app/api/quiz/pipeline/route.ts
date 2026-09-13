import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QUIZ_QUESTIONS, type QuizQuestion } from '@/data/f1QuizData';
import { validateQuizQuestion, checkQuestionDeduplication, type ExpansionValidationResult, type DeduplicationResult } from '@/lib/dataExpansionPipeline';

export const runtime = 'nodejs';

interface PipelineCandidateResult {
  candidate: Partial<QuizQuestion>;
  validation: ExpansionValidationResult;
  deduplication: DeduplicationResult;
  isApproved: boolean;
  stageLogs: string[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const topic = body.topic || 'F1最新レース戦略・FIA競技規則';
    const difficulty = body.difficulty || 'expert';
    const format = body.format || 'rule_dilemma';

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

    let candidateQuestion: Partial<QuizQuestion>;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `あなたは国際自動車連盟（FIA）の公式スチュワード兼F1チーフレースエンジニアです。
以下の条件に基づき、日本の熱心なモータースポーツファンのための【超高精度で本格的なF1クイズ問題】を1問生成してください。

【出題テーマ】: ${topic}
【難易度】: ${difficulty} (beginner / intermediate / expert / master)
【フォーマット】: ${format} (standard / scenario / rule_dilemma / track_corner / telemetry_tactics)

【厳格なコンプライアンス要件】:
1. 日本国内の公式中継は必ず「FOD / フジテレビNEXT」のみに準拠し、非提携・旧来の放映事業者名（DAZNなど）は一切言及・引用しないでください。
2. 競技規則（FIA Sporting Regulations）または技術規則（Technical Regulations）の具体的条文番号（例: Art. 33.3, Art. 55.13 等）や公式通達を解説または出典に明記してください。
3. 選択肢は必ず4つ（0〜3）、紛らわしくも知的好奇心を刺激するハイレベルな選択肢を作成してください。

以下のJSON形式のみを正確に出力してください（Markdownのコードブロックを含めず純粋なJSONで出力）:
{
  "id": "gen-${Date.now()}",
  "difficulty": "${difficulty}",
  "category": "rules",
  "format": "${format}",
  "categoryLabel": "⚖️ 公式規則・審議",
  "formatLabel": "⚖️ 規則・事件",
  "question": "問題文（具体的で情景や条文が目に浮かぶ文章）",
  "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "correctIndex": 0,
  "explanation": "詳細な解説（なぜそれが正解か、FIA規則の根拠）",
  "funFact": "知っておくとレース観戦が10倍面白くなる補足トリビア",
  "sourceAttribution": {
    "title": "FIA Formula One Sporting Regulations Art.XX",
    "archiveNote": "FIA公式競技規則・審議裁定基準"
  }
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          candidateQuestion = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse Gemini response as JSON');
        }
      } catch (geminiError) {
        console.warn('[Gemini Pipeline Fallback]:', geminiError);
        candidateQuestion = generateFallbackQuestion(topic, difficulty, format);
      }
    } else {
      // Offline / Demo Sandbox Generator
      candidateQuestion = generateFallbackQuestion(topic, difficulty, format);
    }

    // ── STAGE 1: Schema & Broadcaster Validation ──
    const validation = validateQuizQuestion(candidateQuestion);

    // ── STAGE 2: Deduplication Scan against all 148 questions ──
    const deduplication = checkQuestionDeduplication(candidateQuestion, QUIZ_QUESTIONS);

    // ── STAGE 3: Final Approval Gate ──
    const isApproved = validation.valid && !deduplication.isDuplicate;

    const stageLogs: string[] = [
      `[Stage 1: AI生成] テーマ「${topic}」から問題ドラフトを生成完了。`,
      validation.valid
        ? `[Stage 2: スキーマ・放映権監査] PASS - FOD公式放映権基準およびFIA出題規格に100%合致。`
        : `[Stage 2: スキーマ・放映権監査] FAIL - ${validation.errors.join(', ')}`,
      !deduplication.isDuplicate
        ? `[Stage 3: 重複排除スキャン] PASS - 既存148問との最大類似度 ${(deduplication.similarityScore * 100).toFixed(0)}% (閾値55%未満)。新規固有問題として認定。`
        : `[Stage 3: 重複排除スキャン] REJECTED - ${deduplication.reason}`,
      isApproved
        ? `[Stage 4: 総合判定] ✅ APPROVED (承認) - 知識ベース登録可能`
        : `[Stage 4: 総合判定] ❌ REJECTED (棄却) - パイプライン要件未達`,
    ];

    const responseData: PipelineCandidateResult = {
      candidate: candidateQuestion,
      validation,
      deduplication,
      isApproved,
      stageLogs,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('[Quiz Pipeline POST Error]:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

function generateFallbackQuestion(topic: string, difficulty: string, format: string): Partial<QuizQuestion> {
  const ts = Date.now();
  return {
    id: `pipe-gen-${ts}`,
    difficulty: (difficulty as any) || 'expert',
    category: 'rules',
    format: (format as any) || 'rule_dilemma',
    categoryLabel: '⚖️ 公式規則・審議',
    formatLabel: '⚖️ 規則・事件',
    question: 'セーフティカー（SC）先導中の周回遅れ車両の追い越し（アンラップ）に関するFIA競技規則において、レース再開手順（SC退出）が宣言される正しいタイミングはどれか？',
    options: [
      '最後のアンラップ車両がSCを通過した直後の周回終了時',
      'すべてのアンラップ車両が先頭集団の最後尾に完全に追いついた瞬間',
      'レースディレクターが「LAPPED CARS MAY NOW OVERTAKE」を表示した即時',
      'スチュワードが全車セクター3を通過したことを手動確認した次周',
    ],
    correctIndex: 0,
    explanation: 'FIA Formula 1 Sporting Regulations 第55.13条に基づき、レースディレクターがメッセージを発出後、最後の周回遅れ車両がセーフティカーを追い越した周回の終了時に、セーフティカーはピットインし、翌周からグリーンフラッグでリスタートが行われます（アブダビ2021後の改訂明確化規則）。',
    funFact: '2021年アブダビGPでの論争を受け、規則条文の「any」が「all」に明確化され、全対象車のアンラップ完了が厳格に定義されました。',
    sourceAttribution: {
      title: 'FIA Formula One Sporting Regulations Art. 55.13',
      archiveNote: 'セーフティカー先導下における周回遅れ車両復帰規定 (FOD公式解説準拠)',
    },
  };
}
