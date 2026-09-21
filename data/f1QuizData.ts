/**
 * data/f1QuizData.ts
 * Interactive Formula 1 Quiz & Trivia Question Bank (Quiz 2.0).
 * 120 Curated Questions across 4 Difficulty Tiers & 4 Learning Categories.
 * Supports Scenario Decisions, FIA Rule Dilemmas, Track Corner Mastery, and Telemetry Tactics.
 */

export type QuizDifficulty = 'beginner' | 'intermediate' | 'expert' | 'master';
export type QuizCategory = 'rules' | 'history' | 'circuits' | 'racecraft';
export type QuestionFormat =
  | 'standard'
  | 'scenario'
  | 'rule_dilemma'
  | 'track_corner'
  | 'telemetry_tactics'
  | 'audio_radio'
  | 'circuit_shape'
  | 'driver_visual';

export interface AudioSnippetInfo {
  radioQuote: string;
  speakerName?: string;
  speakerCode?: string;
  year?: number;
  gpName?: string;
  audioUrl?: string;
  transcriptJa?: string;
}

export interface CircuitVisualInfo {
  circuitId: string;
  svgMapUrl: string;
  circuitNameJa: string;
  cornerName?: string;
}

export interface DriverVisualInfo {
  imagePath: string;
  driverNameJa: string;
  teamName?: string;
}

export interface SourceAttributionInfo {
  title: string;
  archiveNote?: string;
  url?: string;
}

export interface QuizQuestion {
  id: string;
  difficulty: QuizDifficulty;
  category: QuizCategory;
  format: QuestionFormat;
  categoryLabel: string;
  formatLabel: string;
  question: string;
  options: string[];
  correctIndex: number; // 0-3
  explanation: string;
  funFact?: string;
  linkSubTab?: string;
  audioSnippet?: AudioSnippetInfo;
  circuitVisual?: CircuitVisualInfo;
  driverVisual?: DriverVisualInfo;
  sourceAttribution?: SourceAttributionInfo;
}

export const QUIZ_FORMAT_CONFIG: Record<
  'all' | 'audio_radio' | 'circuit_shape' | 'driver_visual' | 'rule_dilemma' | 'standard',
  { label: string; icon: string; description: string }
> = {
  all: { label: 'すべて', icon: '🌐', description: '全フォーマットからバランスよく出題' },
  audio_radio: { label: '🎙️ 音声無線', icon: '🎙️', description: '無線通信音を聞いて当てるブラインドテスト' },
  circuit_shape: { label: '🏁 コース形状', icon: '🏁', description: 'SVGシルエットやコーナーから当てる視覚クイズ' },
  driver_visual: { label: '👤 顔写真', icon: '👤', description: '顔写真・ポートレートから当てるビジュアルクイズ' },
  rule_dilemma: { label: '⚖️ 規則・事件', icon: '⚖️', description: '歴史的審議事件とFIA国際競技規則条項' },
  standard: { label: '🏎️ 戦術・知識', icon: '🏎️', description: 'テレメトリー・タイヤ戦略・F1基本知識' },
};

export const QUIZ_DIFFICULTY_CONFIG: Record<
  QuizDifficulty,
  { label: string; icon: string; badgeColor: string; description: string; targetScore: number }
> = {
  beginner: {
    label: '🔰 初級 (ビギナー級)',
    icon: '🔰',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    description: 'F1観戦を始めたばかりの方へ！タイヤ色や旗、基本ルールの基礎知識',
    targetScore: 5,
  },
  intermediate: {
    label: '🧭 中級 (パドックファン級)',
    icon: '🧭',
    badgeColor: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    description: 'アンダーカット戦術、名物コーナー、歴代名場面の知識をチェック',
    targetScore: 5,
  },
  expert: {
    label: '🔬 上級 (ストラテジスト級)',
    icon: '🔬',
    badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    description: 'テレメトリー工学、FIA裁定、名車技術史まで網羅した難関問題集',
    targetScore: 5,
  },
  master: {
    label: '🟣 超玄人 (神域・チーフエンジニア級)',
    icon: '🟣',
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    description: 'FIAスチュワードの審議判断、熱力学、極限のピット決断に挑む最難関',
    targetScore: 5,
  },
};

export const QUIZ_CATEGORY_CONFIG: Record<
  QuizCategory,
  { label: string; icon: string; description: string; badgeBg: string }
> = {
  rules: {
    label: '📜 ルール・規定',
    icon: '📜',
    description: 'FIA競技規則・ペナルティ・SC/VSC・フラッグ判定',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  circuits: {
    label: '🏁 コース完全攻略',
    icon: '🏁',
    description: '名物コーナー・Gフォース・高低差・サーキット特性',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  history: {
    label: '🏛️ 選手・チーム・歴史',
    icon: '🏛️',
    description: '伝説の名勝負・歴代王者・名門チームの栄光とドラマ',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  racecraft: {
    label: '🔭 観戦・戦術力UP',
    icon: '🔭',
    description: 'アンダーカット・タイヤ科学・テレメトリー解析・ピット戦略',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    "id": "r-b-1",
    "difficulty": "beginner",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🏁 基本ルール",
    "question": "レースの勝者がフィニッシュラインを越えた際、セッション終了を合図するために振られる白と黒の市松模様の旗は？",
    "options": [
      "イエローフラッグ",
      "チェッカーフラッグ",
      "グリーンフラッグ",
      "ブラックフラッグ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「チェッカーフラッグ」です！トップのマシンがこれを受けた周回でレースはフィニッシュとなります。",
    "funFact": "歴史上、ゲスト旗手が周回数を間違えて1周早くチェッカーを振ってしまい、規定によりその前周が正式結果になったハプニング（2018年カナダGP等）もあります。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-b-2",
    "difficulty": "beginner",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🏁 基本ルール",
    "question": "コース上で危険が発生した際、ドライバーに対して「追越し禁止＆減速」を指示するために振られる旗は？",
    "options": [
      "レッドフラッグ",
      "イエローフラッグ",
      "ブルーフラッグ",
      "ホワイトフラッグ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「イエローフラッグ」です！1本旗は減速と追越し禁止、2本同時に振られる「ダブルイエロー」は即座に停止できる速度までの大幅な減速が義務付けられます。",
    "funFact": "イエロー区間内でタイム短縮（パープル/グリーンセクター）を記録すると、厳重なグリッド降格ペナルティが科されます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-b-3",
    "difficulty": "beginner",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🏁 基本ルール",
    "question": "完全なドライコンディションの決勝レースにおいて、各マシンに義務付けられているタイヤ交換ルールは？",
    "options": [
      "最低2種類（コンパウンド）以上の異なるドライタイヤを使用しなければならない",
      "最低3回以上のピットストップを行わなければならない",
      "全チームが同じ周回数で一斉にタイヤを交換しなければならない",
      "ソフトタイヤを必ず20周以上走らせなければならない"
    ],
    "correctIndex": 0,
    "explanation": "正解は「最低2種類の異なるドライタイヤを使用する義務」です！例えばソフトとミディアム、あるいはミディアムとハードなど、異なる仕様を最低1回ずつ決勝で履く必要があります。",
    "funFact": "レース中に一度でも雨が降り、インターミディエイトかフルウェットタイヤを装着した場合は、この2コンパウンド義務は免除されます。",
    "linkSubTab": "tyres"
  },
  {
    "id": "r-b-4",
    "difficulty": "beginner",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ ペナルティ",
    "question": "ピットレーン走行時の最高制限速度は、一般的なサーキット（安全確保時）で原則として何km/hに制限されている？",
    "options": [
      "40 km/h",
      "60 km/h",
      "80 km/h",
      "120 km/h"
    ],
    "correctIndex": 2,
    "explanation": "正解は「80 km/h」です！ドライバーはピット入口の制限ライン手前でピットリミッターボタンを押し、厳密に速度を守ります。わずか0.1km/hオーバーでも罰金やペナルティが科されます。",
    "funFact": "モナコやシンガポール、ザントフォールトなどピットレーンが狭小な市街地・旧式コースでは60 km/hに制限されます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-b-5",
    "difficulty": "beginner",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🏁 基本ルール",
    "question": "周回遅れ（バックマーカー）になりそうなマシンに対して、後方から迫る先頭集団へ速やかに進路を譲るよう警告する旗は？",
    "options": [
      "ブルーフラッグ",
      "ブラックフラッグ",
      "グリーンフラッグ",
      "イエローフラッグ"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ブルーフラッグ」です！後続の首位マシンが1.2秒以内に接近すると振られ、3つのマーシャルポストを通過するまでに安全に進路を譲らないとペナルティとなります。",
    "funFact": "コックピット内のステアリング液晶やダッシュボードのLEDインジケーターにも青い光が点滅してドライバーに知らせます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-b-6",
    "difficulty": "beginner",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🏁 基本ルール",
    "question": "F1決勝レースの総走行距離は、原則として最短で「何kmを超えた最初の周回」と規定されている？（※モナコGPを除く）",
    "options": [
      "200 km",
      "250 km",
      "305 km",
      "500 km"
    ],
    "correctIndex": 2,
    "explanation": "正解は「305 km」です！F1の決勝は305kmを走破するのに必要な周回数（コース長によって44〜78周程度）で競われます。例外はモナコGPで、コースが狭く平均速度が低いため約260kmで争われます。",
    "funFact": "また、レースの最大制限時間はグリーンフラッグ点灯から「2時間」（赤旗中断を含めると最長3時間）です。",
    "linkSubTab": "circuits"
  },
  {
    "id": "r-b-7",
    "difficulty": "beginner",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🏁 基本ルール",
    "question": "F1決勝レースにおいて、1位フィニッシュ（優勝）のドライバーに与えられるチャンピオンシップポイントは何点？",
    "options": [
      "10点",
      "15点",
      "20点",
      "25点"
    ],
    "correctIndex": 3,
    "explanation": "正解は「25点」です！現行の配点は1位25点、2位18点、3位15点、4位12点、5位10点、6位8点、7位6点、8位4点、9位2点、10位1点となっています。",
    "funFact": "2019年から導入されていた「ファステストラップ記録者（10位以内）へのボーナス1点」は、2025年シーズンから廃止されます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-b-8",
    "difficulty": "beginner",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ ペナルティ",
    "question": "重大なコースコンディション悪化や大クラッシュ発生時に出され、全車即座にピットレーンへ退避・セッション中断となる合図は？",
    "options": [
      "セーフティカー",
      "レッドフラッグ（赤旗）",
      "ブラック＆ホワイトフラッグ",
      "バーチャルセーフティカー"
    ],
    "correctIndex": 1,
    "explanation": "正解は「レッドフラッグ（赤旗）」です！赤旗が掲示されたら全ドライバーは安全に減速し、指示に従ってピットレーンにマシンを整列させて中断に入ります。",
    "funFact": "赤旗中断中、チームはマシンに触ることができ、タイヤ交換や破損パーツの同仕様交換がペナルティなしで認められます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-i-1",
    "difficulty": "intermediate",
    "category": "rules",
    "format": "rule_dilemma",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ FIA規則判定",
    "question": "決勝レース中、ドライバーAがピットストップを終えてコースに復帰する際、ピット出口の白線を4輪すべて踏み越えてコースに合流しました。FIA競技規則における扱いは？",
    "options": [
      "安全に合流できていれば何の問題もない",
      "ピット出口白線越え違反として審議対象となり、通常ペナルティ（5秒加算等）が科される",
      "即座に黒旗失格となる",
      "白線ではなく黄色い線を越えた場合のみ違反となる"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ピット出口白線越え違反として審議・ペナルティ対象」です！ピット出口のラインは本コースを走行する高速マシンとの衝突を防ぐ安全境界線であり、いかなる場合もタイヤ全体で越えてはなりません。",
    "funFact": "2022年のモナコGPではフェルスタッペンがピット出口ラインに触れたかどうかが大論争となり、以降「タイヤが完全にライン外側の路面に接地したか」が明確化されました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-i-2",
    "difficulty": "intermediate",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "📜 FIA公式規定",
    "question": "バーチャルセーフティカー（VSC）導入時、ドライバーがステアリングディスプレイ上で厳格に遵守しなければならない表示は？",
    "options": [
      "現在のギヤ段数を常に5速以上に保つ",
      "FIA基準タイムに対する「デルタタイム（差分）」をプラス（正）に維持して走行する",
      "エンジン回転数を7,000rpm以下に制限する",
      "ピットレーンに直ちに進入しなければならない"
    ],
    "correctIndex": 1,
    "explanation": "正解は「デルタタイムをプラス（正）に維持する」です！VSC中は全区間で通常ラップタイムの約30〜40%遅い基準ペースが設定され、ドライバーは規定ペースより速くならないよう（デルタがマイナスにならないよう）電子制御で監視されます。",
    "funFact": "デルタがマイナス（規定より速い）のまま計測ポイントを通過すると、タイム加算ペナルティが機械的に科されます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-i-3",
    "difficulty": "intermediate",
    "category": "rules",
    "format": "rule_dilemma",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ FIA規則判定",
    "question": "ドライバーが前車をオーバーテイクする際、サーキットの白線外側（コース外）を4輪すべて通過して前に出ました。この場合の正しい対処は？",
    "options": [
      "そのまま走行を続けて良い",
      "直ちに得たアドバンテージを返上（相手に順位を戻す）しなければ、タイムペナルティが科される",
      "次の周回でDRSを使用してはならない",
      "相手ドライバーが承諾すれば順位を返さなくても良い"
    ],
    "correctIndex": 1,
    "explanation": "正解は「直ちに得たアドバンテージを返上（順位を戻す）する」です！コース外走行で持続的なアドバンテージを得ることは禁止されており、自発的にポジションを返さないと通常5秒〜10秒のペナルティが科されます。",
    "funFact": "チームラジオでエンジニアが「Give the position back, please（ポジションを返せ）」と指示を出すのは、このペナルティを回避するためです。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-i-4",
    "difficulty": "intermediate",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "📜 FIA公式規定",
    "question": "「パルクフェルメ（車両保管）規定」が適用されるタイミングと、その制限内容は？",
    "options": [
      "決勝当日の朝から適用され、燃料の補給が禁止される",
      "予選Q1開始時から適用され、主要なセッティング変更やパーツ交換が厳しく制限される",
      "フリー走行FP1開始時から適用され、一切の工具使用が禁じられる",
      "チェッカーフラッグ後のみ適用され、ドライバーの計量のみが行われる"
    ],
    "correctIndex": 1,
    "explanation": "正解は「予選開始時から適用され、主要パーツ変更やセッティング変更が禁止される」です！パルクフェルメ下でサスペンションジオメトリ変更やスペックの異なるパーツに交換した場合、ピットレーンスタートのペナルティとなります。",
    "funFact": "許可されている作業はフロントウイングの角度微調整、タイヤ空気圧調整、クーリング冷却ファンの取り付け、燃料補給などごく一部に限られます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-i-5",
    "difficulty": "intermediate",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "📜 FIA公式規定",
    "question": "予選Q1において、トップタイムに対して何％以内のタイムを記録できなければ原則として決勝出走が認められない？",
    "options": [
      "103% ルール",
      "105% ルール",
      "107% ルール",
      "110% ルール"
    ],
    "correctIndex": 2,
    "explanation": "正解は「107% ルール」です！極端にペースの遅い危険なマシンを決勝から排除するための規定で、Q1のトップタイムの107%以内でラップを完了する必要があります。",
    "funFact": "悪天候やマシントラブルでQ1に出走できなかった場合でも、フリー走行で十分なペースを示していればスチュワードの特例措置で決勝出走が許可されることがほとんどです。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-i-6",
    "difficulty": "intermediate",
    "category": "rules",
    "format": "rule_dilemma",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ FIA規則判定",
    "question": "ピットストップ作業において、ドライバーに科された「5秒タイムペナルティ」を消化する際、ピットクルーが遵守しなければならない必須条件は？",
    "options": [
      "ピット作業をすべて完了した後に、クルー全員が5秒間手を挙げなければならない",
      "マシンが停止してから最初の5秒間、メカニックはマシンに一切触れてはならない",
      "エンジンを5秒間完全に停止させなければならない",
      "フロントタイヤのみを外して5秒間静止しなければならない"
    ],
    "correctIndex": 1,
    "explanation": "正解は「マシン停止後の最初の5秒間、マシンに一切触れてはならない」です！ジャッキを当てたりホイールガンをナットに接触させるだけで「作業開始」と見なされ、ペナルティ不履行違反となります。",
    "funFact": "2023年サウジアラビアGPでアストンマーティンのリアジャッキが触れたかどうかが物議を醸し、FIAガイダンスで「ジャッキがマシンに接触すること自体も作業と見なす」と明確化されました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-i-7",
    "difficulty": "intermediate",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "📜 FIA公式規定",
    "question": "F1ドライバーが年間を通じて違反を重ねた場合に累積される「ペナルティポイント」のルールで正しいものは？",
    "options": [
      "1シーズンで累計12点に達すると、次戦自動的に1レース出場停止となる",
      "累計20点に達するとスーパーライセンスが永久剥奪される",
      "1点累積するごとに100万円の罰金が自動的に科される",
      "予選でポールポジションを獲るごとにペナルティポイントが1点相殺される"
    ],
    "correctIndex": 0,
    "explanation": "正解は「12ヶ月間で累計12点に達すると、次戦1レース出場停止」です！各インシデントで1〜3点程度加算され、付与されてから12ヶ月経過すると消滅します。2024年にはケビン・マグヌッセンが12点に達し、アゼルバイジャンGPで出場停止となりました。",
    "funFact": "この制度は2014年に導入され、ドライバーの過激なドライビングに対する抑止力として機能しています。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-e-1",
    "difficulty": "expert",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🔬 レギュレーション工学",
    "question": "現在のF1レギュレーションにおいて、ドライバーを含むマシン全体の「最低乾燥重量（ドライバー装備およびバラスト込み）」は何kgと規定されている？",
    "options": [
      "752 kg",
      "775 kg",
      "798 kg",
      "820 kg"
    ],
    "correctIndex": 2,
    "explanation": "正解は「798 kg」です！2022年のグラウンドエフェクト規定導入に伴い引き上げられました。このうちドライバー自身の体重（スーツ・ヘルメット・シートクッション含む）は最低80kgと規定され、満たない分はシート下へバラストを積載します。",
    "funFact": "2024年ベルギーGPでジョージ・ラッセルがトップチェッカーを受けたものの、レース後の車検で燃料を抜ききった状態の重量が796.5kg（1.5kgアンダー）と判明し、無念の失格処分となりました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-e-2",
    "difficulty": "expert",
    "category": "rules",
    "format": "rule_dilemma",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ FIA規則判定",
    "question": "「トラックリミット違反」において、決勝レース中に科される段階的な警告とペナルティのシークエンスとして正確なものは？",
    "options": [
      "1回目で5秒ペナルティ、2回目で10秒ペナルティ、3回目で失格",
      "3回違反で黒白旗警告（ファイナルワーニング）、4回目で5秒ペナルティ、5回目で10秒ペナルティ",
      "違反回数は関係なく、前を抜いた時のみ審議される",
      "5回目まではお咎めなしで、6回目でピットスルーペナルティ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「3回違反で黒白旗（警告）、4回目で5秒ペナルティ、5回目で10秒ペナルティ」です！白線を4輪すべてはみ出すとカウントされ、3回目で白黒の警告旗が振られます。",
    "funFact": "2023年オーストリアGPでは全車で1,200件以上のトラックリミット疑義が発生し、レース後に12件以上のタイムペナルティが大量追加されて順位が激変しました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-e-3",
    "difficulty": "expert",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "📜 コストキャップ規定",
    "question": "F1チームの財務公平化を図る「コストキャップ（予算制限）レギュレーション」において、制限対象外（除外）として認められている費用は？",
    "options": [
      "フロントウイングおよび空力開発のCFD電気代",
      "レースドライバーの年俸およびチーム内で高給上位3名の役員報酬",
      "レース用燃料およびピレリタイヤの購入費用",
      "風洞実験施設の模型製作費"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ドライバーの年俸および上位3名の給与」です！これに加え、マーケティング活動費、従業員の育児休業費用、歴史的遺産イベント費用などは予算制限の上限（約1億3500万ドル）から除外されています。",
    "funFact": "2021年の軽微なコストキャップ超過により、レッドブル・レーシングは700万ドルの罰金と風洞実験時間10%削減のペナルティを受けました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-e-4",
    "difficulty": "expert",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🔬 PU技術規定",
    "question": "現行の1.6L V6ターボ・パワーユニット（PU）を構成する6つの主要エレメントのうち、年間使用基数制限を超えるとグリッド降格ペナルティの対象となるパーツの組み合わせは？",
    "options": [
      "ICE、TC、MGU-K、MGU-H、ES、CE",
      "シャシー、フロア、フロントウイング、リアウイング、サスペンション、モノコック",
      "ステアリング、ブレーキディスク、ラジエーター、燃料ポンプ、ホイール、ペダル",
      "ピロボール、ドライブシャフト、ディフューザー、ヘイロー、ECU、シート"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ICE（内燃機関）、TC（ターボ）、MGU-K（運動エネルギー回生）、MGU-H（熱エネルギー回生）、ES（エナジーストア）、CE（コントロールエレクトロニクス）」の6コンポーネントです！",
    "funFact": "2026年新レギュレーションからはMGU-Hが廃止され、MGU-Kの出力が約3倍（350kW = 約475馬力）へと大幅拡大されます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-e-5",
    "difficulty": "expert",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "📜 スプリント規定",
    "question": "2024年に改定された「スプリント週末」のスケジュール構成とパルクフェルメ解除の正しい順序は？",
    "options": [
      "金曜予選→土曜決勝→日曜スプリント（パルクフェルメは一切解除されない）",
      "金曜FP1＆スプリント予選→土曜スプリント決勝＆本戦予選→日曜本戦（スプリント後〜本戦予選前にパルクフェルメが一旦再解除される）",
      "土曜に本戦予選とスプリントを一括で行う",
      "日曜にスプリントと本戦の2レースを連続で行う"
    ],
    "correctIndex": 1,
    "explanation": "正解は「金曜にスプリント予選、土曜午前にスプリント決勝、土曜午後に本戦予選、日曜に本戦」です！2024年の新ルールでは、土曜スプリント終了から本戦予選開始までの間、パルクフェルメが解除されてセッティング変更が再び可能となりました。",
    "funFact": "これによりスプリントでセットアップミスが判明しても、日曜決勝に向けてマシンを根本から修正できるようになりました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-e-6",
    "difficulty": "expert",
    "category": "rules",
    "format": "rule_dilemma",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ FIA規則判定",
    "question": "セーフティカー（SC）先導中の解除プロセスにおいて、競技規程上「LAPPED CARS MAY NOW OVERTAKE（周回遅れ車両の追い越し許可）」のメッセージが出された際、周回遅れ車両が取らなければならない行動は？",
    "options": [
      "直ちにピットインしてタイヤを新品に交換しなければならない",
      "SCと首位車両列を安全に追い抜き、コースを1周走って隊列の最後尾に追いつかなければならない",
      "その場でコース脇にマシンを停止させ、全車通過を待たなければならない",
      "先頭車両の真後ろにポジションをキープしてリスタートを迎えなければならない"
    ],
    "correctIndex": 1,
    "explanation": "正解は「SCと首位列を追い抜き、コースを1周して隊列最後尾に加わる」です！リスタート時に上位争いに周回遅れが混ざる危険を避け、クリーンなバトルを演出するために定められています。",
    "funFact": "2021年アブダビGP最終周では、首位ハミルトンと2位フェルスタッペンの間の数台のみがアンラップを許可されたことが歴史的大論争を巻き起こし、規程文言が厳密に改定されました。",
    "linkSubTab": "drama"
  },
  {
    "id": "r-e-7",
    "difficulty": "expert",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🔬 空力試験制限規定",
    "question": "F1の「空力テスト規制（ATR: Aerodynamic Testing Restrictions）」において、各チームの風洞実験時間やCFDシミュレーション枠を決定する基準は？",
    "options": [
      "前年度のコンストラクターズ選手権順位（下位チームほど多くの開発時間が割り当てられる）",
      "各チームの年間売上高",
      "マシンの最高速度記録",
      "年間のリタイア回数"
    ],
    "correctIndex": 0,
    "explanation": "正解は「コンストラクターズ選手権の順位に応じたスライド方式」です！首位（王者）チームは基準値の70%しか風洞を使えない一方、最下位（10位）チームには115%が与えられ、戦力差の均衡を図るハンディキャップ制度となっています。",
    "funFact": "ランキング査定は年2回（6月30日時点とシーズン終了時）行われ、後半戦の開発リソースが変動します。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-m-1",
    "difficulty": "master",
    "category": "rules",
    "format": "rule_dilemma",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ FIAスチュワード判定",
    "question": "【FIA公式裁定シナリオ】ドライバーAとBがコーナーに並んで進入。アウト側のドライバーAがエイペックス（頂点）時点でフロントタイヤを相手のフロントアクスル（前軸）より前に出していました。イン側のドライバーBが立ち上がりでアウト側にスペースを1車身残さず押し出した場合、FIAドライビングガイドラインにおける判定は？",
    "options": [
      "イン側のドライバーBにコーナーの優先権があり、スペースを残す義務はない（お咎めなし）",
      "エイペックス時点でアウト側が前にいたため、ドライバーBには1車身分のレーシングルームを残す義務があり、押し出し（Forcing another driver off track）でペナルティ対象となる",
      "アウト側のドライバーAがコース外へ出たため、Aにトラックリミット違反が科される",
      "双方が接触していない場合はいかなる場合も審議されない"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ドライバーBに押し出しペナルティが科される」です！FIAドライビングスタンダードガイドラインでは、アウト側からのオーバーテイク時、エイペックス手前〜エイペックスで相手の前軸より前に出ている場合、アウト側マシンに権利が認められ、立ち上がりで1台分の幅を残さなければなりません。",
    "funFact": "逆にエイペックスでイン側マシンが前軸を並べていた場合は、イン側が優先権を持ち、アウト側が引く義務があると判断されるケースが多く、数センチの前後関係が審議を分けます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-m-2",
    "difficulty": "master",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🔬 超玄人レギュレーション",
    "question": "FIA技術規則における「燃料流量（フューエル・フロー）制限」および「決勝レース中の燃料総搭載量」の厳密な上限値は？",
    "options": [
      "最大流量: 80 kg/h、最大総搭載量: 90 kg",
      "最大流量: 100 kg/h（10,500rpm以上）、最大総搭載量: 110 kg",
      "最大流量: 120 kg/h、最大総搭載量: 130 kg",
      "最大流量: 150 kg/h、最大総搭載量: 無制限"
    ],
    "correctIndex": 1,
    "explanation": "正解は「最大流量 100 kg/h、最大搭載量 110 kg」です！FIA公認の超音波フューエル・フロー・センサーによってミリ秒単位で監視されており、一瞬でも100kg/hを超えると即座に失格対象となります（2014年豪州GPのリカルド失格など）。",
    "funFact": "2019年フェラーリPUのセンサーパルス干渉疑惑を受け、FIAは暗号化された2基目の独立流量センサーを義務付けました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-m-3",
    "difficulty": "master",
    "category": "rules",
    "format": "rule_dilemma",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ FIAスチュワード判定",
    "question": "【パルクフェルメ・極限事例】予選終了後、スチュワードによる車検でリアウイングのDRS開口時フラップ隙間が規定値（最大85mm）を右端のみ0.2mm超過（85.2mm）していることが判明しました。不可抗力のボルト緩みと判明した場合のFIA判例上の処分は？",
    "options": [
      "不可抗力であるため、部品の締め直しのみで無罰",
      "技術規則違反には情状酌量の余地がなく、予選セッション全体からの失格処分（最後尾スタート）となる",
      "3グリッド降格ペナルティ",
      "500万円の罰金のみ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「技術規則違反には情状酌量がなく、予選失格処分」です！2021年サンパウロGP（ブラジル）でルイス・ハミルトンのDRS開口部がわずか0.2mm超過した際、意図せぬ部品破損であったにもかかわらずスチュワードは「技術規則は白か黒かであり、寸法の不適合は即失格」として予選失格を科しました。",
    "funFact": "この時ハミルトンはスプリントで最後尾から5位、決勝で10位から奇跡の逆転優勝を飾りました。",
    "linkSubTab": "drama"
  },
  {
    "id": "r-m-4",
    "difficulty": "master",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🔬 超玄人レギュレーション",
    "question": "パワーユニット（PU）エレメント交換ペナルティにおいて、規定割り当て基数を初めて超過した際のグリッド降格数と、同シーズン内で2基目以降の超過時のグリッド降格数はそれぞれ何グリッド？",
    "options": [
      "初回超過: 5グリッド降格、2回目以降: 3グリッド降格",
      "初回超過: 10グリッド降格、2回目以降: 5グリッド降格",
      "初回超過: 15グリッド降格、2回目以降: 10グリッド降格",
      "初回超過: 最後尾スタート、2回目以降: ピットスタート"
    ],
    "correctIndex": 1,
    "explanation": "正解は「初回超過は10グリッド降格、2回目以降は5グリッド降格」です！また、同一グランプリで累積ペナルティが15グリッドを超えた場合、自動的にグリッド最後尾（Back of the Grid）からのスタートとなります。",
    "funFact": "かつては30グリッド降格などの天文学的数字が存在しましたが、現在は15グリッド超で一律「最後尾」に整理されました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-m-5",
    "difficulty": "master",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🔬 FIA競技規則条項",
    "question": "決勝レース中、赤旗中断のままセッションが再開できず途中で終了（中止）となった場合、フルポイント（100%の選手権得点）が付与されるための最低走行周回数の要件は？",
    "options": [
      "予定周回数の50%以上",
      "予定周回数の75%以上",
      "予定周回数の90%以上",
      "最低30周以上走っていれば常にフルポイント"
    ],
    "correctIndex": 1,
    "explanation": "正解は「予定周回数の75%以上を消化した場合」です！2021年スパの雨中2周中止問題を受け、2022年以降は「25%未満（6点制）」「25%〜50%未満（13点制）」「50%〜75%未満（19点制）」「75%以上（フルポイント25点）」の4段階スライド制に改正されました。",
    "funFact": "2022年日本GP鈴鹿ではチェッカーフラッグが振られたため、規定の文言の隙間（「レースが中断のまま終了した場合」という条項）により53%消化でもフルポイントが付与され、フェルスタッペンの王座決定が確定しました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-m-6",
    "difficulty": "master",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🔬 超玄人レギュレーション",
    "question": "「ジャンプスタート（フライング）」の機械的判定において、FIAがグリッドアスファルト内部に埋設している検知センサーの仕組みは？",
    "options": [
      "光電管レーザーによるフロントウイング遮断測定",
      "各マシン底部に装着された公式トランスポンダーと、路面グリッド枠内の磁気誘導ループコイルによるミリ秒単位の微小移動検知",
      "スタートシグナル上部に設置された超高解像度ハイスピードカメラのAI画像解析",
      "ステアリングのクラッチパドルのテレメトリー信号受信"
    ],
    "correctIndex": 1,
    "explanation": "正解は「トランスポンダーと路面埋設の磁気ループ」です！グリッド枠内に規定された許容範囲を超えてシグナル消灯前にトランスポンダーが移動した場合、システムが自動的にスチュワードへアラートを発信します。",
    "funFact": "センサーの不感帯内でわずかにマシンが揺れた程度では検知されず、肉眼で動いて見えてもペナルティにならない（2019年日本GPのベッテルなど）珍事も起きます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-m-7",
    "difficulty": "master",
    "category": "rules",
    "format": "standard",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "🔬 FIAライセンス規定",
    "question": "F1公式セッション（決勝）に出場するために必須の「FIAスーパーライセンス」を取得するために、ドライバーが過去3年間の下位カテゴリーで積み上げなければならない最低ライセンスポイント数は？",
    "options": [
      "25 ポイント",
      "30 ポイント",
      "40 ポイント",
      "50 ポイント"
    ],
    "correctIndex": 2,
    "explanation": "正解は「40 ポイント」です！FIA F2やF3、スーパーフォーミュラ、インディカーなどの成績に応じてポイントが付与され、直近3年間で累計40ポイントを獲得し、さらにF1マシンでの300km走行テストを完了する必要があります。",
    "funFact": "マックス・フェルスタッペンが17歳でF1デビューした翌年、若すぎる昇格を防止するために年齢制限（18歳以上）とこの40点基準が厳格化されました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "r-m-8",
    "difficulty": "master",
    "category": "rules",
    "format": "rule_dilemma",
    "categoryLabel": "📜 ルール・規定",
    "formatLabel": "⚖️ FIAスチュワード判定",
    "question": "【ピットインシデント判定】ピットストップ作業を終えて発進したマシンが、ピットレーンを直進走行してきた他車の目の前に合流し、他車が急ブレーキを踏んで回避しました。この「アンセーフ・リリース（Unsafe Release）」に対するFIA標準ペナルティは？",
    "options": [
      "ドライバーの過失ではなくチームの指示ミスであるため、チームへの罰金のみでタイムペナルティは科されない",
      "コース上の競技結果に直接影響を及ぼした危険行為として、原則としてドライバーに5秒タイムペナルティ（またはピットスルー）が科される",
      "即座の黒旗失格",
      "次のセッションでピットレーン制限速度が40km/hに引き下げられる"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ドライバーに5秒タイムペナルティ」です！かつてはチームへの罰金のみの時代もありましたが、安全上の重大リスクおよび順位への不当な影響を排除するため、現在は決勝レース中であればドライバーへの5秒（または10秒）タイム加算が標準適用されます。",
    "funFact": "フリー走行でのアンセーフリリースはチームへの罰金（通常5,000〜10,000ユーロ）となるのが通例です。",
    "linkSubTab": "glossary"
  },
  {
    "id": "c-b-1",
    "difficulty": "beginner",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名門サーキット",
    "question": "日本の三重県に位置し、立体交差を持つ世界屈指のテクニカルコース「鈴鹿サーキット」のレイアウト形状の特徴は？",
    "options": [
      "完全なオーバル（楕円形）",
      "8の字（フィギュア・エイト）交差レイアウト",
      "三角形レイアウト",
      "直線のみのドラッグコース"
    ],
    "correctIndex": 1,
    "explanation": "正解は「8の字（立体交差）レイアウト」です！F1カレンダーの中で唯一、立体交差によって右回りと左回りの両方の特性を兼ね備えた、ドライバーの腕が試される世界最高峰のコースです。",
    "funFact": "鈴鹿サーキットは1962年、ホンダ創業者・本田宗一郎の号令によってオランダ人設計者ジョン・フーゲンホルツが設計しました。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-b-2",
    "difficulty": "beginner",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名物コーナー",
    "question": "ベルギーのスパ・フランコルシャンに存在する、急激な下り坂から一気に約40mの高低差を駆け上がる世界一有名な超高速コーナーの名前は？",
    "options": [
      "パラボリカ",
      "オールージュ 〜 ラディオン",
      "モントレー・コークスクリュー",
      "ラスカス"
    ],
    "correctIndex": 1,
    "explanation": "正解は「オールージュ（Eau Rouge）〜 ラディオン（Raidillon）」です！時速300km以上で圧縮Gを受けながらブラインドの丘を駆け抜ける、モータースポーツ界で最もスリリングなコーナーです。",
    "funFact": "「オールージュ」はフランス語で「赤い水」を意味し、コーナーの地下を流れる鉄分を含んだ小川に由来しています。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-b-3",
    "difficulty": "beginner",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名物コーナー",
    "question": "世界で最も低速なF1コーナーとして知られ、ステアリングを最大舵角（フルロック）まで切り込むモナコ市街地コースの名物ヘアピンは？",
    "options": [
      "スズカ・スプーンカーブ",
      "フェアモント（ロウズ）・ヘアピン",
      "ボーセ・コーナー",
      "ターザン・コーナー"
    ],
    "correctIndex": 1,
    "explanation": "正解は「フェアモント・ヘアピン（旧称ロウズ・ヘアピン）」です！通過速度はわずか時速約45〜50kmで、F1マシンが最もゆっくり走る瞬間です。チームはこのコーナーのためにステアリングの切れ角を特別に改造します。",
    "funFact": "ヘアピンの目の前に建つ高級ホテル「フェアモント・モンテカルロ」のバルコニーからは真上からマシンを見下ろせます。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-b-4",
    "difficulty": "beginner",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名門サーキット",
    "question": "「モンツァ・サーキット（イタリアGP）」がその圧倒的な平均速度から長年呼ばれている伝統的な異名は？",
    "options": [
      "スピードの殿堂（Temple of Speed）",
      "砂漠の要塞",
      "緑の地獄",
      "東洋の真珠"
    ],
    "correctIndex": 0,
    "explanation": "正解は「スピードの殿堂（Temple of Speed）」です！1周の約80%が全開区間で、最高速度は時速350kmを超え、全サーキット中最速の平均時速約260km以上で周回します。",
    "funFact": "各チームは空気抵抗を極限まで削るため、ウイング角がほぼ水平に寝た専用の超低ダウンフォース仕様を持ち込みます。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-b-5",
    "difficulty": "beginner",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名門サーキット",
    "question": "1950年5月13日にF1世界選手権の「史上最初の第1戦」が開催された、イギリス・モータースポーツの聖地は？",
    "options": [
      "ブランズハッチ",
      "シルバーストン・サーキット",
      "ドニントンパーク",
      "グッドウッド"
    ],
    "correctIndex": 1,
    "explanation": "正解は「シルバーストン・サーキット」です！第二次世界大戦時の軍用飛行場跡地を利用して作られたサーキットで、マゴッツ、ベケッツ、チャペルなどの超高速S字コーナーが有名です。",
    "funFact": "飛行場の名残として、現在でも広大な敷地と強い吹きさらしの横風がマシンの空力バランスに影響を与えます。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-b-6",
    "difficulty": "beginner",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名門サーキット",
    "question": "F1史上初の「フルナイトレース（夜間照明下での決勝）」として2008年に初開催されたグランプリは？",
    "options": [
      "アブダビGP",
      "シンガポールGP（マリーナベイ）",
      "バーレーンGP",
      "ラスベガスGP"
    ],
    "correctIndex": 1,
    "explanation": "正解は「シンガポールGP（マリーナベイ市街地サーキット）」です！赤道直下の高温多湿な気候の中、約1,600基の特設高輝度プロジェクターで照らされた公道を駆け抜けます。",
    "funFact": "ドライバーはレース中に最大3〜4kgの体重（発汗）を失うほど、年間で最も肉体的に過酷なグランプリと言われます。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-b-7",
    "difficulty": "beginner",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名物コーナー",
    "question": "カナダGP（ジル・ヴィルヌーヴ・サーキット）の最終シケイン立ち上がりにある、歴代世界王者が次々にクラッシュしたことで名付けられたコンクリート壁の通称は？",
    "options": [
      "チャンピオンの壁（Wall of Champions）",
      "死の壁",
      "デグナー・ウォール",
      "ルーキー・バリア"
    ],
    "correctIndex": 0,
    "explanation": "正解は「チャンピオンの壁（Wall of Champions）」です！1999年の決勝レースで、デイモン・ヒル、ミハエル・シューマッハ、ジャック・ヴィルヌーヴの3名の世界王者が次々と接触・大破したことから命名されました。",
    "funFact": "シケインの縁石をアグレッシブに攻めてタイムを削ろうとすると、マシンの挙動が乱れて吸い寄せられるように壁にヒットします。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-i-1",
    "difficulty": "intermediate",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 コーナー攻略",
    "question": "鈴鹿サーキットの西コースに位置する超高速左コーナー「130R」の「130」という数字が元々意味している設計値は？",
    "options": [
      "コーナーの全長が130メートル",
      "コーナーの曲率半径（カーブの半径）が130メートル",
      "想定された進入制限速度が130km/h",
      "バンク傾斜角が13.0度"
    ],
    "correctIndex": 1,
    "explanation": "正解は「曲率半径（R）が130メートル」です！かつては単一の半径130mの超高速左コーナーでしたが、安全性向上のため現在は前半R85、後半R340の複合コーナーへと改修されています。",
    "funFact": "現代のF1マシンは強烈なダウンフォースにより、この130Rを7速・時速300km以上の全開（フラットアウト）で駆け抜けます。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-i-2",
    "difficulty": "intermediate",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "アゼルバイジャンの首都に設けられた「バクー市街地サーキット」において、全幅わずか7.6mしかなくF1カレンダーで最も狭い名物区間は？",
    "options": [
      "城壁セクション（ターン8〜10）",
      "港湾シケイン",
      "オールドバザールヘアピン",
      "オリーブロード"
    ],
    "correctIndex": 0,
    "explanation": "正解は「城壁セクション（ターン8〜10）」です！世界遺産に登録されている12世紀の旧市街の城壁に沿って走る区間で、F1マシン2台が並ぶことは不可能な道幅7.6mのタイトな上り坂です。",
    "funFact": "シャルル・ルクレールが予選でここにクラッシュした際、チーム無線で「I am stupid, I am stupid」と叫んだ名無線が有名です。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-i-3",
    "difficulty": "intermediate",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "メキシコシティのエルマノス・ロドリゲス・サーキットは標高約2,285mの高地にあります。この極端な高地環境がF1マシンに与える特異な現象は？",
    "options": [
      "空気密度が海抜0mより約20%以上薄いため、最大ダウンフォースのウイングをつけてもモンツァ並みの空気抵抗しか発生しない",
      "重力が小さいためマシンの最低重量を50kg増やさなければならない",
      "雨が絶対に降らないためインターミディエイトタイヤの持ち込みが禁止される",
      "タイヤの内圧が走行中に低下し続ける"
    ],
    "correctIndex": 0,
    "explanation": "正解は「空気が薄いため最大ウイングでもドラッグが低く、ストレートで時速350km超に達する」です！また、空気が薄いことでラジエーターやブレーキの冷却効率が著しく悪化し、エンジンの冷却が極めて厳しくなります。",
    "funFact": "野球場（旧スタジアム）をそのままコースにした「フォロ・ソル」セクションは、数万人のファンがスタンドから見下ろす熱狂スポットです。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-i-4",
    "difficulty": "intermediate",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名門サーキット",
    "question": "オランダの「ザントフォールト・サーキット」が2021年のF1復帰に向けて導入した、アメリカのインディアナポリスに匹敵する独特のコース改修は？",
    "options": [
      "コース全面へのスプリンクラー散水装置",
      "最大18〜19度の急激なバンク（傾斜）角を持つすり鉢状コーナー",
      "コースを横断する地下トンネル",
      "全面ダートのグラベルトラップ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「最大18〜19度のバンク（傾斜）コーナー」です！ターン3（フーゲンホルツ）と最終ターン14（アリー・ルイエンダイク）に設置され、通常のオーバルコースを上回る急傾斜により、高い横Gを路面で支えながら全開で立ち上がることができます。",
    "funFact": "バンク角が急すぎるため、ピレリは特別な高負荷耐性を持つタイヤ構造を用意して臨みます。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-i-5",
    "difficulty": "intermediate",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名物コーナー",
    "question": "モンツァ・サーキットの最終コーナー「パラボリカ」は、2021年にイタリア人F1ドライバーを追悼して正式名称が改名されました。そのドライバーは誰？",
    "options": [
      "ミケーレ・アルボレート（クルヴァ・アルボレート）",
      "ジャン・アレジ",
      "エリオ・デ・アンジェリス",
      "アルベルト・アスカリ"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ミケーレ・アルボレート」です！フェラーリ等で活躍した伝説のイタリア人ドライバーを称え、没後20年の2021年に「クルヴァ・アルボレート（Curva Alboreto）」と改名されました。",
    "funFact": "コーナーの曲率が徐々に緩くなる放物線（パラボラ）を描いていることから長年「パラボリカ」と呼ばれ親しまれていました。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-i-6",
    "difficulty": "intermediate",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 コーナー攻略",
    "question": "アメリカ・オースティンの「サーキット・オブ・ジ・アメリカズ（COTA）」のターン1は、ドライバーにとってどのような特徴を持つ難所？",
    "options": [
      "急激な下り坂のブラインドコーナー",
      "約41mを一気に駆け上がる急勾配の上り坂の頂点にある、出口が見えないブラインドエイペックス",
      "水たまりが常にある逆バンクコーナー",
      "全面石畳のクラシックロード"
    ],
    "correctIndex": 1,
    "explanation": "正解は「41mの急坂の頂点にあるワイドな上り坂ブラインドコーナー」です！上り坂の強い傾斜がブレーキングの減速を助けるため極めて深い飛び込みが可能で、スタート直後の大混乱やオーバーテイクの名所となっています。",
    "funFact": "コース幅が非常に広く取られているため、複数のライン取りが可能でバトルが白熱します。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-i-7",
    "difficulty": "intermediate",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "ブラジルのインテルラゴス（アウトドローモ・ホセ・カルロス・パーチェ）のレイアウト特性で、F1カレンダーの中で珍しい特徴は？",
    "options": [
      "完全な時計回りレイアウト",
      "反時計回り（左回り）サーキット",
      "1周の直線が3kmある",
      "一切の縁石が存在しない"
    ],
    "correctIndex": 1,
    "explanation": "正解は「反時計回り（左回り）サーキット」です！多くのサーキットが時計回りであるのに対し、左回りは左方向の強いGが長時間首にかかるため、普段使わない首の筋肉に極度の疲労をもたらします。",
    "funFact": "ターン1〜2の「セナS字」はアイルトン・セナのアドバイスによってレイアウトが改良された名物コーナーです。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-e-1",
    "difficulty": "expert",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 コーナー攻略",
    "question": "鈴鹿サーキットの「デグナーカーブ（デグナー1・デグナー2）」の名前の由来となった歴史的事実は？",
    "options": [
      "鈴鹿建設時にトンネル工事を指揮したドイツ人技師エルンスト・デグナー",
      "1962年第1回全日本ロードレースでトップ走行中にここで転倒・クラッシュした名ライダー、エルンスト・デグナー",
      "コース周辺に生息していた野生植物の学名",
      "ホンダの初期F1エンジンの開発コードネーム"
    ],
    "correctIndex": 1,
    "explanation": "正解は「東ドイツ出身の名二輪ライダー、エルンスト・デグナーの転倒事故」です！鈴鹿の完成記念レースでトップを快走中にこの複合コーナーで大クラッシュしたことから、敬意を込めて「デグナーカーブ」と命名されました。",
    "funFact": "デグナー1は時速240km超で鋭く飛び込む右コーナー、デグナー2は内側の深い縁石を跨ぐタイトな直角コーナーで、ミスが即クラッシュにつながる名所です。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-e-2",
    "difficulty": "expert",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "全24戦あるF1カレンダーの中で、「1周のラップタイムが最も短い（予選最速タイムが63〜64秒台）」サーキットはどこ？",
    "options": [
      "モナコGP",
      "レッドブル・リンク（オーストリアGP）",
      "モンツァ（イタリアGP）",
      "ザントフォールト（オランダGP）"
    ],
    "correctIndex": 1,
    "explanation": "正解は「レッドブル・リンク（オーストリアGP）」です！全長わずか4.318km、コーナー数が実質わずか10個しかなく、高低差のある3本の直線が繋がっているため、予選ラップタイムは1分04秒前後の驚異的な短時間で完了します。",
    "funFact": "タイム差が極めて出にくいため、予選ではトップ10台がわずか0.2〜0.3秒以内にひしめく超接近戦となります。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-e-3",
    "difficulty": "expert",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 コーナー攻略",
    "question": "シルバーストン・サーキットの伝説の連続高速S字「マゴッツ（Maggotts）〜 ベケッツ（Becketts）〜 チャペル（Chapel）」において、マシンの挙動とドライバーにかかる負荷で正しいものは？",
    "options": [
      "時速100km以下で低速ギアを使うトラクション重視セクション",
      "時速280〜300kmの超高速で左右に切り返し、最大5Gを超える強烈な横Gが連続して発生する空力効率の究極テスト区間",
      "全面が逆バンクになっておりスリップ事故が多発する低速ヘアピン群",
      "路面が濡れやすいためDRSゾーンが2重に設定されている"
    ],
    "correctIndex": 1,
    "explanation": "正解は「時速280〜300kmの高速切り返しで5G以上の横Gがかかる空力テスト区間」です！現代のF1マシンの卓越したフロント追従性とグラウンドエフェクトが最も美しく視覚化される名セクターです。",
    "funFact": "マゴッツ、ベケッツ、チャペルの名前は、中世この地域にあった古い教区や聖堂（聖トマス・ベケット礼拝堂）に由来しています。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-e-4",
    "difficulty": "expert",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "アブダビのヤス・マリーナ・サーキットのピットレーン出口に存在する、世界中のサーキットでも極めて珍しい構造的特徴は？",
    "options": [
      "本コースの下をくぐる地下トンネルを通過してコース外側へ合流する",
      "ピット出口で必ず一時停止して青信号を待たなければならない",
      "立体交差橋の上を走って本コースに合流する",
      "ピット出口がターン1のイン側エイペックスに直結している"
    ],
    "correctIndex": 0,
    "explanation": "正解は「本コースの下をくぐる地下トンネル構造」です！ピットを出たマシンは地下通路に入り、ターン1の本コース下をアンダーパスしてターン2の外側へ安全に合流します。",
    "funFact": "トンネル内は道幅が狭く壁が近いため、冷えたタイヤでプッシュしすぎると壁に接触するリスクがあります。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-e-5",
    "difficulty": "expert",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "バーレーン・インターナショナル・サーキット（サヒール）のアスファルト舗装が、F1全コース中でも屈指の「強烈なタイヤデグラデーション（摩耗）」を引き起こす理由は？",
    "options": [
      "イギリスのウェールズからわざわざ輸入された硬質花崗岩（グラナイト）を骨材に使用しており、路面摩擦係数が極めて高いため",
      "砂漠の砂が常に路面に堆積して紙ヤスリのようにタイヤを削るため",
      "路面温度が常に70度を超えているため",
      "タイヤ空気圧が強制的に高められているため"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ウェールズ産の硬質花崗岩（砕石）を路面骨材に配合しているため」です！高いグリップ力と耐久性を得るために採用された特殊アスファルトですが、タイヤに対する攻撃性が極めて高く、特にリアタイヤの熱劣化が激しい特性を持ちます。",
    "funFact": "そのためバーレーンGPでは、予選の1発の速さよりも決勝でのタイヤマネジメント能力が勝敗を完全に分けます。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-e-6",
    "difficulty": "expert",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名物コーナー",
    "question": "モナコ市街地コースの最終セクションにある「ラスカス（La Rascasse）」コーナーの名称の由来となったものは？",
    "options": [
      "モナコ公国の初代大統領の名前",
      "コーナーのすぐ脇にある歴史的な老舗レストラン＆バー「ラ・ラスカス」",
      "地中海に生息するカサゴ類（スコーピオンフィッシュ）を意味するモナコの方言",
      "かつて存在したカジノの別館名"
    ],
    "correctIndex": 1,
    "explanation": "正解は「コーナーの目の前にある有名なバー・レストラン（La Rascasse）」です！ピットビルに向かうタイトな右コーナーで、2006年予選でミハエル・シューマッハが意図的にマシンをストップさせた疑惑の「ラスカス事件」の舞台としても有名です。",
    "funFact": "レストラン名のラスカス自体は地中海のカサゴ（魚）を意味するプロヴァンス語です。",
    "linkSubTab": "drama"
  },
  {
    "id": "c-e-7",
    "difficulty": "expert",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "カタールのロサイル・インターナショナル・サーキットで開催された2023年カタールGPにおいて、FIAが前代未聞の「1セットあたりのタイヤ最大走行周回数を18周に制限」した原因は？",
    "options": [
      "強烈な横Gと新設されたピラミッド型「50mm縁石」を高速通過する衝撃で、ピレリタイヤ内部のカーカスコードが微小剥離を起こしたため",
      "ピレリが持参したコンパウンドの配合を誤ったため",
      "路面温度が高すぎてタイヤが自然発火したため",
      "カタール政府からの要望によるもの"
    ],
    "correctIndex": 0,
    "explanation": "正解は「新設縁石の衝撃と高負荷によるタイヤ内部構造（カーカス）の剥離リスク」です！時速270km以上の高速コーナーが連続する中、縁石の角に乗る衝撃でタイヤ内部に微小な亀裂が発見されたため、FIAは安全を期して1セット最大18周（全車最低3回ストップ義務）の異例措置を命じました。",
    "funFact": "このレースは灼熱と湿気、スプリント並みの全開走行が重なり、ドライバーが嘔吐や脱水症状で失神寸前になる壮絶なサバイバル戦となりました。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-m-1",
    "difficulty": "master",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 チーフエンジニア解析",
    "question": "【鈴鹿セクター1のテレメトリー工学】鈴鹿のS字コーナー（ターン3〜6）において、予選最速タイムを記録するトップドライバーのペダルワークと荷重移動の特徴として最も的確なものは？",
    "options": [
      "各コーナーのエイペックスごとにブレーキを強く踏み込んで車速を落とし、V字ラインで立ち上がる",
      "ブレーキペダルはほぼ踏まず、ミリ単位のスロットルリフト（アクセルオフ）によるフロントへの繊細な荷重移動だけでマシンの回頭性をコントロールし、リズミカルにボトムスピードを維持する",
      "左足ブレーキをフルに踏みながらアクセルも全開で踏み続ける",
      "すべてのコーナーを同じギア段数（4速）の一定レブリミットで周回する"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ブレーキをほぼ使わず、繊細なアクセルオフの荷重移動でボトムスピードを極限まで保つ」です！鈴鹿のS字はリズムが命であり、1つのコーナーで突っ込みすぎると次のコーナーのラインが破綻してセクター全体で0.5秒以上失います。プロはスロットルを抜く量とタイミングでフロントタイヤに荷重を乗せ、向きを変えています。",
    "funFact": "フェルスタッペンやアロンソのテレメトリーを見ると、S字区間のアクセル開度はサイン波のように滑らかに連続しています。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-m-2",
    "difficulty": "master",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 コース完全攻略",
    "question": "ベルギー・スパの「ケメル・ストレート（Kemmel Straight）」エンドのブレーキングゾーン（レ・コーム進入）において、現代のF1マシンが記録する減速データの数値として最も妥当なものは？",
    "options": [
      "時速約250kmから時速180kmへ減速（約2G、減速距離150m）",
      "時速約345kmから時速約140kmへ減速（最大減速G約5.5G、ペダル踏力150kg以上、約1.8秒で完了）",
      "時速約300kmから時速約50kmへ減速（最大8G、減速距離30m）",
      "時速約380kmから時速約200kmへ減速（回生ブレーキのみで減速）"
    ],
    "correctIndex": 1,
    "explanation": "正解は「時速約345kmから約140kmへ減速、最大5.5G超、ペダル踏力150kg」です！DRSとスリップストリームで最高速に達した直後、ドライバーは150kg以上の凄まじい力でカーボンブレーキペダルを踏み込み、内臓が飛び出るような5.5Gの減速Gに耐えながら右・左・右の複合コーナーへと飛び込みます。",
    "funFact": "この強烈な減速時、カーボンブレーキローターの表面温度は瞬間的に1,000℃を超えて白熱します。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-m-3",
    "difficulty": "master",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 コース完全攻略",
    "question": "モナコGPの予選Q3において、トンネルを抜けた後の「ヌーベル・シケイン」進入ブレーキングが全F1カレンダー中最もトリッキーでタイヤロックを起こしやすい物理的理由は？",
    "options": [
      "路面が石畳でグリップがないため",
      "トンネル出口の急激な下り勾配によるフロント抜けと、暗闇から太陽光へ飛び出す視覚変化、さらにトンネル内の右カーブで左側タイヤに偏った荷重のまま直線ブレーキングに入る複合要因のため",
      "海水が路面に飛沫としてかかっているため",
      "ブレーキディスクが冷え切っているため"
    ],
    "correctIndex": 1,
    "explanation": "正解は「下り勾配による荷重抜け、光の明暗変化、そして右カーブ直後のブレーキングによる車体の不均衡」です！下り坂ではフロントタイヤにかかる接地圧が抜けやすく、左フロントタイヤが瞬間的にロックして白煙を上げるシーンが頻発します。",
    "funFact": "1994年のカール・ヴェンドリンガーの大クラッシュなど重大事故も起きたため、シケインの形状とランオフエリアは度々改修されています。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-m-4",
    "difficulty": "master",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット工学",
    "question": "シンガポールGPのマリーナベイ市街地コースが2023年に改修され、ラップタイムが一気に約10秒短縮されたレイアウト変更の詳細は？",
    "options": [
      "トンネルセクションを丸ごと撤去した",
      "旧ターン16〜19（フロートスタンド下の低速直角シケイン4つ）を取り壊し、ターン15からターン16へ直結する390mのロングストレートへ変更した",
      "アンダーソン橋の通過を取りやめ、新しい高架道路を通した",
      "ピットレーンをコース反対側へ移設した"
    ],
    "correctIndex": 1,
    "explanation": "正解は「旧スタンド下の直角シケイン4つを撤去し、ロングストレート化した」です！市街地再開発（NSスクエア建設工事）に伴う措置でしたが、低速シケインが減ったことでタイヤへの負担が軽減し、ラップタイムが約10秒も高速化しました。",
    "funFact": "コーナー数が23から19へと減少し、追い越しのチャンスも増加したことでドライバーからも大好評の改修となりました。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-m-5",
    "difficulty": "master",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "上海インターナショナル・サーキット（中国GP）のターン1からターン4にかけて続く名物「カタツムリコーナー」の走行ライン取りの技術的特徴は？",
    "options": [
      "時速300kmの全開で単一のエイペックスをかすめる",
      "右回りに270度以上回り込みながら半径が徐々に小さくなる減速コーナーで、オーバースピードを抑えつつイン側を長くキープし、急激な左のターン4へ向けた立ち上がりラインを作る複合テクニックが要求される",
      "右に曲がったあと直ちにピットレーンへ進入する",
      "縁石の外側を走る方がグリップが高い"
    ],
    "correctIndex": 1,
    "explanation": "正解は「270度回り込みながら半径が狭まり、急激な切り返しの左へ繋ぐ複合旋回」です！漢字の「上」の文字をモチーフにした設計で、フロント左タイヤに極めて高い負荷がかかり、アンダーステアとの戦いになります。",
    "funFact": "ターン1へ時速320km以上で進入し、ターン3のエイペックスでは時速約75kmまで落ちるという、極端な速度変化を伴います。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-m-6",
    "difficulty": "master",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 チーフエンジニア解析",
    "question": "ラスベガスGP（ストリップ市街地サーキット）において、全チームのエンジニアがタイヤの作動温度（ワーキングレンジ）確保に極度に苦しめられる独特の環境要因は？",
    "options": [
      "砂漠の熱風によるオーバーヒート",
      "深夜22時〜24時スタートによる「極度の低温路面（10℃〜15℃前後）」と、約1.9kmの超ロングストレートによる「タイヤ冷却効果」の二重苦",
      "路面に散布されたカジノの洗浄用洗剤",
      "ホテルのネオン看板による路面反射熱"
    ],
    "correctIndex": 1,
    "explanation": "正解は「深夜の極端な低路面温度とロングストレートによるタイヤ冷却」です！時速350kmで2km近く直進するとタイヤ表面の熱が外気に奪われ、ストレートエンドのターン14ブレーキを踏んだ瞬間にフロントタイヤが完全に冷え切って大ロックアップを起こします。",
    "funFact": "タイヤが冷えるとゴムがガラスのように硬化しグリップが喪失するため、ブレーキングゾーンの手前で蛇行して必死に熱を入れます。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-m-7",
    "difficulty": "master",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 サーキット特性",
    "question": "インテルラゴス（ブラジル）のピットエントリー（ピット入口）が危険と評され、過去に数々のクラッシュを生んだ幾何学的理由は？",
    "options": [
      "急激な上り坂の死角に位置しているため",
      "最終コーナー（スビダ・ド・ボックス）の高速左旋回の全開区間の真っただ中にピット入口の分岐線が存在するため",
      "ピット入口に信号機がないため",
      "雨天時にピットレーン全体が川になるため"
    ],
    "correctIndex": 1,
    "explanation": "正解は「超高速左コーナーの旋回Gと全開加速の最中にピット分岐があるため」です！時速240km以上で外側へ流れる横Gに耐えながら、ピットに入るマシンは急激に左イン側へ切れ込まなければならず、後続の全開アタック車両との速度差が極めて危険でした（現在は破線ガイド等の安全対策が強化）。",
    "funFact": "2003年の豪雨のブラジルGPでは、この手前のコーナーでマーク・ウェバーとフェルナンド・アロンソが大クラッシュし赤旗終了となりました。",
    "linkSubTab": "circuits"
  },
  {
    "id": "c-m-8",
    "difficulty": "master",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 チーフエンジニア解析",
    "question": "ハンガロリンク（ハンガリーGP）が別名「壁のないモナコ（Monaco without walls）」と呼ばれるサーキット工学的理由は？",
    "options": [
      "モナコと同じ公道を使用しているため",
      "ストレートがメインストレート1本しかなく、中低速コーナーが連続するためオーバーテイクが極めて困難で、最大ダウンフォースの空力セットアップが必須となるため",
      "コース脇に観客が立っているため",
      "ピットレーンがモナコより狭いため"
    ],
    "correctIndex": 1,
    "explanation": "正解は「中低速コーナーが息つく暇なく連続し、抜けないため最大ダウンフォースが要求される」からです！埃っぽくグリップが低い路面、短いストレート、連続するターンによってタイヤとドライバーを休ませる暇がなく、予選順位が決勝結果をほぼ決定づけます。",
    "funFact": "すり鉢状の地形にあるため、スタンドのどの位置からでもコース全体の約70〜80%を見渡せる観戦向きのサーキットです。",
    "linkSubTab": "circuits"
  },
  {
    "id": "h-b-1",
    "difficulty": "beginner",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 レジェンド記録",
    "question": "F1史上最多タイ記録となる「通算7度のドライバーズ世界チャンピオン」を獲得している2名のドライバーは？",
    "options": [
      "アイルトン・セナ と アラン・プロスト",
      "ミハエル・シューマッハ と ルイス・ハミルトン",
      "セバスチャン・ベッテル と マックス・フェルスタッペン",
      "ニキ・ラウダ と ジャッキー・スチュワート"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ミハエル・シューマッハ（1994, 1995, 2000-2004）と ルイス・ハミルトン（2008, 2014, 2015, 2017-2020）」です！",
    "funFact": "ハミルトンは歴代単独最多の通算100勝以上、ポールポジション100回以上の大記録も保持しています。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-b-2",
    "difficulty": "beginner",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🏎️ 名門チーム",
    "question": "「跳ね馬（カヴァッリーノ・ランパンテ）」をシンボルとし、1950年のF1開幕から唯一参戦し続ける最古の名門チームは？",
    "options": [
      "マクラーレン",
      "メルセデス",
      "スクーデリア・フェラーリ",
      "ウィリアムズ"
    ],
    "correctIndex": 2,
    "explanation": "正解は「スクーデリア・フェラーリ」です！F1の歴史そのものと呼ばれるチームで、最多のコンストラクターズタイトル（16回）とドライバーズタイトル（15回）を誇ります。",
    "funFact": "フェラーリの赤（ロッソ・コルサ）は、かつての国際レースにおけるイタリアの国別ナショナルカラーに由来します。",
    "linkSubTab": "teams"
  },
  {
    "id": "h-b-3",
    "difficulty": "beginner",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 レジェンド記録",
    "question": "「音速の貴公子」の愛称で日本でも熱狂的人気を誇り、モナコGPで前人未到の6勝（5連勝）を挙げた伝説のブラジル人王者は？",
    "options": [
      "ネルソン・ピケ",
      "アイルトン・セナ",
      "エマーソン・フィッティパルディ",
      "フェリペ・マッサ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「アイルトン・セナ」です！マクラーレン・ホンダ黄金期のエースとして3度の世界王者に輝き、予選での神がかり的なアタックラップと雨天での圧倒的な速さで世界中を魅了しました。",
    "funFact": "1988年モナコGP予選では、2位のチームメイト（プロスト）に1.427秒差をつける歴史的ラップを記録しました。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-b-4",
    "difficulty": "beginner",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🇯🇵 日本人F1の歴史",
    "question": "日本人F1ドライバーとして史上初めて「F1決勝レースの表彰台（3位）」に登壇したドライバーは誰？（1990年日本GP）",
    "options": [
      "中嶋悟",
      "鈴木亜久里",
      "佐藤琢磨",
      "小林可夢偉"
    ],
    "correctIndex": 1,
    "explanation": "正解は「鈴木亜久里」です！1990年日本GP（鈴鹿）において、ラルース・ランボルギーニを駆り、日本人として、またアジア人ドライバーとして史上初となる3位表彰台を獲得しました。",
    "funFact": "鈴鹿のホームストレートで大観衆の「アグリコール」に迎えられたシーンは日本モータースポーツ史の至宝です。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-b-5",
    "difficulty": "beginner",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 レジェンド記録",
    "question": "2023年シーズンに「年間22戦中19勝（勝率86.4%）」というF1史上最も圧倒的な単年最多勝記録を樹立したドライバーは？",
    "options": [
      "ルイス・ハミルトン",
      "マックス・フェルスタッペン",
      "シャルル・ルクレール",
      "セバスチャン・ベッテル"
    ],
    "correctIndex": 1,
    "explanation": "正解は「マックス・フェルスタッペン（レッドブル・レーシング）」です！マシン「RB19」とともに史上初の10連勝を含む19勝を挙げ、シーズン1000周以上リードという空前絶後の支配を見せました。",
    "funFact": "フェルスタッペンは自身ひとりの獲得ポイントだけで、2位チーム（メルセデス）のチーム合計ポイントを上回りました。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-b-6",
    "difficulty": "beginner",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🏎️ 名門チーム",
    "question": "1988年シーズン、16戦中15勝（勝率93.8%）という驚異の勝率を記録したマクラーレンの名車「MP4/4」に搭載されていたエンジンメーカーは？",
    "options": [
      "フェラーリ",
      "ルノー",
      "ホンダ（Honda）",
      "フォード・コスワース"
    ],
    "correctIndex": 2,
    "explanation": "正解は「ホンダ（Honda）」です！アイルトン・セナとアラン・プロストのコンビが駆るホンダV6ツインターボエンジン（RA168E）はライバルを完全に圧倒し、開幕11連勝を達成しました。",
    "funFact": "唯一勝利を逃したイタリアGP（モンツァ）では、フェラーリ創設者エンツォ・フェラーリの死去直後にフェラーリが奇跡の1-2フィニッシュを飾りました。",
    "linkSubTab": "teams"
  },
  {
    "id": "h-b-7",
    "difficulty": "beginner",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 レジェンド記録",
    "question": "F1史上最年少で世界チャンピオンを獲得したドライバーは？（2010年、23歳134日）",
    "options": [
      "フェルナンド・アロンソ",
      "ルイス・ハミルトン",
      "セバスチャン・ベッテル",
      "マックス・フェルスタッペン"
    ],
    "correctIndex": 2,
    "explanation": "正解は「セバスチャン・ベッテル」です！2010年のアブダビGPで劇的な逆転劇を演じ、23歳134日という史上最年少戴冠記録を樹立しました。その後2013年まで4年連続で世界王者に輝きました。",
    "funFact": "ベッテルはトロロッソ時代（2008年イタリアGP・雨のモンツァ）に最年少ポールポジションと最年少優勝（当時）も記録しました。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-i-1",
    "difficulty": "intermediate",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🏎️ 奇跡のチーム物語",
    "question": "ホンダのF1撤退直後の2009年、チームを1ポンドで買収して誕生し、革新的な「ダブルディフューザー」で参戦初年度（唯一の年）にドライバー＆コンストラクターズの両王座を獲得した伝説のチームは？",
    "options": [
      "ブラウンGP（Brawn GP）",
      "スーパーアグリ",
      "レッドブル・レーシング",
      "レーシングポイント"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ブラウンGP」です！ロス・ブラウンが率いたチームはジェンソン・バトンとともに開幕7戦中6勝を飾り、シーズン終了後にメルセデスに買収されて現在のメルセデスワークスチームの母体となりました。",
    "funFact": "スポンサーロゴがほとんどない真っ白と蛍光イエローのマシンで開幕戦を1-2フィニッシュした瞬間はF1史最大の童話と言われます。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-i-2",
    "difficulty": "intermediate",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 ライバル列伝",
    "question": "冷静沈着なレース計算とタイヤマネジメントから「プロフェッサー（教授）」の異名を持ち、セナと壮絶な王座争いを繰り広げた4タイムズ世界王者は？",
    "options": [
      "ナイジェル・マンセル",
      "アラン・プロスト",
      "ネルソン・ピケ",
      "ゲルハルト・ベルガー"
    ],
    "correctIndex": 1,
    "explanation": "正解は「アラン・プロスト」です！ポールポジションの速さよりも決勝レースでの勝利を緻密に組み立てる頭脳派ドライバーで、通算51勝、4度のワールドチャンピオンに輝きました。",
    "funFact": "1989年と1990年の鈴鹿日本GPにおけるセナとの接触劇は、F1史上で最もドラマチックな遺恨とライバル関係として今も語り継がれます。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-i-3",
    "difficulty": "intermediate",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🇯🇵 日本人F1の歴史",
    "question": "2004年アメリカGP（インディアナポリス）において、予選2番手から決勝で見事3位に入り、日本人14年ぶりとなる表彰台を獲得したドライバーは？",
    "options": [
      "中野信治",
      "高木虎之介",
      "佐藤琢磨",
      "中嶋一貴"
    ],
    "correctIndex": 2,
    "explanation": "正解は「佐藤琢磨（B・A・R Honda）」です！インディアナポリスの難関バンクを全開で駆け抜け、幾度ものオーバーテイクを成功させて日本人2人目となる3位表彰台の快挙を成し遂げました。",
    "funFact": "佐藤琢磨はその後インディ500でもアジア人初制覇（通算2回優勝）という金字塔を打ち立てました。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-i-4",
    "difficulty": "intermediate",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 伝説のドラマ",
    "question": "2011年カナダGPで、雨による赤旗中断、他車との接触、パンク、ドライブスルーペナルティ、計6回のピットストップを経験しながら最後尾から最終ラップで大逆転優勝を果たしたドライバーは？",
    "options": [
      "ルイス・ハミルトン",
      "フェルナンド・アロンソ",
      "ジェンソン・バトン",
      "キミ・ライコネン"
    ],
    "correctIndex": 2,
    "explanation": "正解は「ジェンソン・バトン（マクラーレン）」です！レース総時間4時間4分（史上最長レース）の中、最終ラップで首位ベッテルがプレッシャーで濡れた路面でミスした瞬間を突いて奇跡の勝利を収めました。",
    "funFact": "バトンはこのレースで通算6回ピットに入り、時速換算平均速度で最も遅い優勝記録（中断含む）も保持しています。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-i-5",
    "difficulty": "intermediate",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 レジェンド記録",
    "question": "2007年シーズン、新人のハミルトンと王者アロンソ（共にマクラーレン）が激しい内紛を繰り広げる中、残り2戦で17点差を大逆転してわずか1ポイント差でフェラーリにドライバーズ王座をもたらした「アイスマン」は？",
    "options": [
      "フェリペ・マッサ",
      "キミ・ライコネン",
      "ジャンカルロ・フィジケラ",
      "ルーベンス・バリチェロ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「キミ・ライコネン」です！寡黙でクールな性格から「アイスマン」と呼ばれ、フェラーリ移籍初年度に最終戦ブラジルGPで劇的な大逆転チャンピオンを獲得しました。",
    "funFact": "ライコネンはフェラーリにとって現時点で「最後のドライバーズワールドチャンピオン」となっています。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-i-6",
    "difficulty": "intermediate",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 伝説のドラマ",
    "question": "1976年ニュルブルクリンク（ノルドシュライフェ）で瀕死の火傷を負う大事故に遭いながら、わずか6週間後のイタリアGPで奇跡の復帰を果たした「不死鳥」と呼ばれる王者は？",
    "options": [
      "ジェームス・ハント",
      "ニキ・ラウダ",
      "ヨッヘン・リント",
      "ロニー・ピーターソン"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ニキ・ラウダ」です！顔面に重度の火傷を負い神父に終油の秘跡（死の宣告）を受けながら驚異的な精神力で生還し、ライバルのジェームス・ハントと富士スピードウェイでの最終戦までタイトルを争いました。",
    "funFact": "この1976年の壮絶なライバル対決は、ハリウッド映画『RUSH（ラッシュ/プライドと友情）』として映画化されました。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-i-7",
    "difficulty": "intermediate",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🇯🇵 日本人F1の歴史",
    "question": "2012年日本GP（鈴鹿）において、終盤ジェンソン・バトンの猛追をミリ単位のブロックで凌ぎ切り、日本人として鈴木亜久里、佐藤琢磨に続く3人目の表彰台（3位）を獲得したドライバーは？",
    "options": [
      "中嶋一貴",
      "山本左近",
      "小林可夢偉",
      "角田裕毅"
    ],
    "correctIndex": 2,
    "explanation": "正解は「小林可夢偉（ザウバー）」です！母国ファンの大声援が響く中、完璧なドライビングで表彰台を守り切り、表彰台で10万人の大観衆から「カ・ム・イ！」コールが湧き起こりました。",
    "funFact": "小林可夢偉はその後WEC世界耐久選手権で世界王者となり、ル・マン24時間レースでも総合優勝を果たしました。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-e-1",
    "difficulty": "expert",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 レジェンド記録",
    "question": "1950年代にアルファロメオ、マセラティ、メルセデス、フェラーリという「4つの異なるコンストラクター」で世界チャンピオンを獲得したアルゼンチンの伝説的ドライバーは？",
    "options": [
      "ファン・マヌエル・ファンジオ",
      "アルベルト・アスカリ",
      "フロイラン・ゴンザレス",
      "ジュゼッペ・ファリーナ"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ファン・マヌエル・ファンジオ」です！通算5度の世界タイトルを獲得し、生涯勝率は約47%（51戦24勝）という前人未到の記録を打ち立てたF1草創期の至高の皇帝です。",
    "funFact": "ファンジオの「4つの異なるチームでチャンピオン」という記録は、70年以上のF1史において未だに誰にも破られていません。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-e-2",
    "difficulty": "expert",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🔬 伝説の空力デザイナー",
    "question": "ウィリアムズ（FW14B）、マクラーレン（MP4/13）、レッドブル（RB6〜RB9、RB18〜RB19）でチャンピオンマシンを生み出し続けた「空気の流れが見える男」と呼ばれる希代の天才デザイナーは？",
    "options": [
      "ロス・ブラウン",
      "エイドリアン・ニューウェイ",
      "ジョン・バーナード",
      "コリン・チャップマン"
    ],
    "correctIndex": 1,
    "explanation": "正解 is 「エイドリアン・ニューウェイ」です！CADが主流の現代でも製図板と鉛筆で手描き設計を行い、グラウンドエフェクトやディフューザーの空力パッケージでF1界を30年以上にわたり席巻しています。",
    "funFact": "2025年からはアストンマーティンF1チームにマネージング・テクニカル・パートナーとして移籍することが決定しました。",
    "linkSubTab": "teams"
  },
  {
    "id": "h-e-3",
    "difficulty": "expert",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 歴史的記録",
    "question": "F1史上、自らが設立し「自らの名前を冠したチーム（シャシー）」のマシンに乗ってドライバーズ世界チャンピオンを獲得した唯一の人物は誰？",
    "options": [
      "ブルース・マクラーレン",
      "サー・ジャック・ブラバム",
      "コーリン・チャップマン",
      "ダン・ガーニー"
    ],
    "correctIndex": 1,
    "explanation": "正解は「サー・ジャック・ブラバム（1966年）」です！ブラバム（Brabham BT19）を自らドライブして年間王者に輝き、コンストラクターズタイトルもダブルで制覇する不滅の記録を残しました。",
    "funFact": "マクラーレン創始者のブルース・マクラーレンも自チームでレースに勝利していますが、ドライバーズタイトル獲得には至りませんでした。",
    "linkSubTab": "teams"
  },
  {
    "id": "h-e-4",
    "difficulty": "expert",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 伝説のオーバーテイク",
    "question": "2000年ベルギーGP（スパ）のケメルストレートで、ミハエル・シューマッハとミカ・ハッキネンが周回遅れのリカルド・ゾンタを左右から時速320km超で挟み込みながら抜き去った歴史的パッシングの勝者は？",
    "options": [
      "ミハエル・シューマッハ",
      "ミカ・ハッキネン",
      "リカルド・ゾンタ",
      "デイビッド・クルサード"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ミカ・ハッキネン」です！ゾンタの左イン側に飛び込んだシューマッハに対し、ハッキネンは瞬時の判断でゾンタの右アウト側へ飛び出し、コーナー進入でシューマッハの前に出るというF1史上最も美しい伝説の追い越しを決めました。",
    "funFact": "挟まれたゾンタは「バックミラーを見たら2台が左右から矢のように消えていった。生涯で最も恐ろしく感動的な瞬間だった」と語っています。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-e-5",
    "difficulty": "expert",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 レジェンド記録",
    "question": "1960年代にロータスで活躍し、ポールポジション・ファステストラップ・全周回リード・優勝をすべて独占する「グランドスラム」を史上最多の通算8回記録した孤高の天才は？",
    "options": [
      "スターリング・モス",
      "ジム・クラーク",
      "グラハム・ヒル",
      "ジャッキー・スチュワート"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ジム・クラーク」です！スコットランドの羊飼い出身の天才ドライバーで、圧倒的な速さとスムーズなマシンコントロールで通算25勝を挙げ、2度の世界王者に輝きました。",
    "funFact": "クラークのグランドスラム通算8回という記録は、ハミルトン（6回）やシューマッハ（5回）も抜くことができていません。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-e-6",
    "difficulty": "expert",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🏎️ 名車技術史",
    "question": "1992年にナイジェル・マンセルが開幕5連勝を飾り圧倒的強さで王座を獲得したウィリアムズ「FW14B」に搭載されていた、ライバルを圧倒したハイテク電子制御兵器は？",
    "options": [
      "ツインクラッチトランスミッション",
      "フルアクティブサスペンション",
      "無段変速CVT",
      "4輪操舵（4WS）システム"
    ],
    "correctIndex": 1,
    "explanation": "正解は「アクティブサスペンション」です！油圧アクチュエータで車高と姿勢をコンピュータ制御し、あらゆる速度域とコーナーでグラウンドエフェクト空力を常に100%最適に保つことで、異次元のコーナリングスピードを実現しました。",
    "funFact": "翌1993年のプロスト（FW15C）の王座獲得後、ハイテク戦争の過熱とコスト高騰を理由に1994年からハイテク電子制御は全面禁止されました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "h-e-7",
    "difficulty": "expert",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 記録の歴史",
    "question": "F1史上、「初優勝までに要した決勝スタート数」が最も多い（最も遅咲きの初優勝）記録を持つドライバーは？（190戦目での初優勝）",
    "options": [
      "マーク・ウェバー",
      "セルジオ・ペレス",
      "カルロス・サインツ",
      "ジャンカルロ・フィジケラ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「セルジオ・ペレス」です！2020年サヒールGP（バーレーン外周コース）において、1周目の接触で最後尾に落ちながらレーシングポイントで驚異の追い上げを見せ、デビュー190戦目にして涙の初優勝を飾りました。",
    "funFact": "この歴史的勝利が評価され、シートを失いかけていたペレスは翌年のレッドブルのレギュラーシートを射止めました。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-m-1",
    "difficulty": "master",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 神域のヒストリア",
    "question": "【F1草創期の悲運】「無冠の帝王（The greatest driver never to win the world championship）」と称され、通算16勝を挙げながら一度も世界王者に届かなかったイギリスの至宝は誰？",
    "options": [
      "スターリング・モス",
      "トニー・ブルックス",
      "ピーター・コリンズ",
      "マイク・ホーソーン"
    ],
    "correctIndex": 0,
    "explanation": "正解は「サー・スターリング・モス」です！4度のランキング2位、3度のランキング3位を記録。1958年にはライバルのマイク・ホーソーンの失格処分を取り消すようスチュワードに証言したことでフェアプレー精神を示し、結果的に1点差でタイトルを逃した逸話が有名です。",
    "funFact": "モスの「スポーツマンシップをタイトルよりも重んじる美学」は、モータースポーツの永遠の気品として讃えられています。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-m-2",
    "difficulty": "master",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 神域のヒストリア",
    "question": "F1史上唯一、「死後にワールドチャンピオンが確定した（ポストヒューマス・チャンピオン）」ドライバーは誰？（1970年）",
    "options": [
      "ヨッヘン・リント",
      "フランソワ・セベール",
      "ロニー・ピーターソン",
      "エリオ・デ・アンジェリス"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ヨッヘン・リント（ロータス）」です！1970年イタリアGP（モンツァ）の予選で事故死しましたが、それまでに築いたポイントリード（45点）を後続のジャッキー・イクスが逆転できず、死後に世界タイトルが確定しました。",
    "funFact": "タイトル授与式では、未亡人のニーナ・リントにチャンピオンのトロフィーが手渡されました。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-m-3",
    "difficulty": "master",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🔬 奇想天外な技術史",
    "question": "1978年スウェーデンGPでニキ・ラウダが駆り、車体後部に巨大な冷却用ファンを取り付けてフロア下の空気を強制排出することで圧倒的ダウンフォースを生み出し、1戦出走しただけで即座に禁止となった伝説の「ファン・カー」は？",
    "options": [
      "ティレル P34",
      "ブラバム BT46B",
      "ロータス 79",
      "マーチ 761"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ブラバム BT46B」です！天才設計者ゴードン・マーレーが考案し、「ファンの目的はラジエーターの冷却である」と強弁してレギュレーションの抜け穴を突きましたが、ライバルチームの猛抗議により即座に自主撤退・禁止となりました。",
    "funFact": "コーナーでマシンが路面に張り付くためドライバーにかかる横Gが尋常ではなく、コース上の小石を後方へマシンガンのように撒き散らしたと言われます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "h-m-4",
    "difficulty": "master",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 神域のヒストリア",
    "question": "1982年シーズン、ケケ・ロズベルグ（ウィリアムズ）がドライバーズ世界チャンピオンを獲得した際に記録した「年間勝利数」は？",
    "options": [
      "わずか1勝",
      "3勝",
      "5勝",
      "0勝（未勝利）"
    ],
    "correctIndex": 0,
    "explanation": "正解は「わずか1勝」です！1982年は全16戦で11人もの異なる勝者が誕生する大混戦となり、ターボ勢がマシントラブルや事故で脱落する中、信頼性の高い自然吸気DFVエンジンで着実にポイントを重ねたケケ・ロズベルグが1勝だけで世界王者に輝きました。",
    "funFact": "年間1勝でのワールドチャンピオンは、1958年のマイク・ホーソーンとケケ・ロズベルグの2名のみです。",
    "linkSubTab": "drivers"
  },
  {
    "id": "h-m-5",
    "difficulty": "master",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 神域のヒストリア",
    "question": "1997年ヨーロッパGP（ヘレス）の予選において、F1公式計時史上唯一発生した前代未聞の珍事とは？",
    "options": [
      "上位3名（ヴィルヌーヴ、シューマッハ、フレンツェン）が「1分21秒072」という1/1000秒まで全く同じ同タイムを記録した",
      "全車が107%ルールに抵触した",
      "コース上に霧が出て全員ノータイムに終わった",
      "全員がスリックタイヤではなくウェットタイヤでアタックした"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ジャック・ヴィルヌーヴ、ミハエル・シューマッハ、ハインツ＝ハラルド・フレンツェンの3名が1分21秒072の同タイムを記録した」です！計時システムの故障が疑われましたが正常と確認され、規則通り最初にそのタイムを出したヴィルヌーヴがポールを獲得しました。",
    "funFact": "この決勝でシューマッハがヴィルヌーヴに体当たりしてリタイアし、年間ランキングから全剥奪される大事件へと繋がりました。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-m-6",
    "difficulty": "master",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "🔬 奇想天外な技術史",
    "question": "1976年に登場したティレル（Tyrrell）P34の最大の特徴である「前輪4輪・後輪2輪の6輪車」レイアウトが採用された本来の技術的狙いは？",
    "options": [
      "ブレーキを4つ増やして制動力を倍にするため",
      "小型の10インチ前輪をフロントウイングの背後に隠すことで前面空気抵抗（ドラッグ）を大幅に減らし、かつ4輪でタイヤ接地面積を確保するため",
      "前輪がパンクしても走り続けられるようにするため",
      "ステアリングの操舵力を軽くするため"
    ],
    "correctIndex": 1,
    "explanation": "正解は「小径前輪をウイングの後ろに隠して空気抵抗を減らしつつ、4輪で接地面積を確保する」です！デレク・ガードナーが設計し、1976年スウェーデンGPでジョディ・シェクターが1-2フィニッシュで見事優勝を飾りました。",
    "funFact": "しかしグッドイヤーが特注の10インチ専用タイヤの開発を続けられず、後輪の開発スピードに取り残されて短期間で姿を消しました。",
    "linkSubTab": "glossary"
  },
  {
    "id": "h-m-7",
    "difficulty": "master",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 神域のヒストリア",
    "question": "ルイス・ハミルトンが2008年ブラジルGPで劇的な自身初タイトルを獲得した際、最終ラップの最終コーナー手前で抜いて王座決定に必要な「5位」に浮上した相手のドライバーは？",
    "options": [
      "フェリペ・マッサ",
      "ティモ・グロック",
      "セバスチャン・ベッテル",
      "ヤルノ・トゥルーリ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ティモ・グロック（トヨタ）」です！雨が降り始める中、ドライタイヤのままステイアウトしていたグロックが最終周で急激にグリップを失い、ハミルトンが最終コーナー手前で交わして5位に浮上。マッサ陣営の歓喜が一転して悲鳴に変わりました。",
    "funFact": "フジテレビの実況「Is that Glock?!（あれはグロックか?!）」は世界中のF1実況史で最も有名な瞬間のひとつです。",
    "linkSubTab": "drama"
  },
  {
    "id": "h-m-8",
    "difficulty": "master",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 神域のヒストリア",
    "question": "1955年のル・マン大惨事を受け、翌1955年末をもってモータースポーツ活動から完全撤退したメルセデスが、「ワークスチームとしてF1に正式復帰」するまでに要した空白期間は何年？",
    "options": [
      "25年",
      "35年",
      "45年",
      "55年（2010年復帰）"
    ],
    "correctIndex": 3,
    "explanation": "正解は「55年（2010年）」です！1955年のファンジオのタイトル獲得後、レース界から去っていたメルセデスは、エンジン供給者としての活動を経て、2009年王者ブラウンGPを買収し、2010年にミハエル・シューマッハとニコ・ロズベルグを擁して55年ぶりにワークス復帰を果たしました。",
    "funFact": "復帰後、2014年のハイブリッド時代到来とともに前人未到のコンストラクターズ7連覇を達成しました。",
    "linkSubTab": "teams"
  },
  {
    "id": "t-b-1",
    "difficulty": "beginner",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 基本戦略",
    "question": "ライバルよりも「1周〜数周早くピットイン」して新品タイヤの強烈なグリップで速いタイムを出し、相手がピットインした際に前に出る代表的な逆転戦術は？",
    "options": [
      "オーバーカット（Overcut）",
      "アンダーカット（Undercut）",
      "スリップストリーム",
      "リフト＆コースト"
    ],
    "correctIndex": 1,
    "explanation": "正解は「アンダーカット（Undercut）」です！摩耗したタイヤで走る相手に対し、新品タイヤのアウトラップで1周あたり1〜2秒以上速く走ることで、相手のピット出口で前に出る現代F1の最も基本的なピット戦略です。",
    "funFact": "ただし新品タイヤが温まりにくい寒い路面や、ピットアウト後にバックマーカーのトラフィックに引っかかるリスクがある場合は失敗します。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-b-2",
    "difficulty": "beginner",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 基本戦略",
    "question": "ストレートで前車の真後ろを走行することで空気抵抗（ドラッグ）を減らし、最高速度を伸ばして追いつく現象を何と呼ぶ？",
    "options": [
      "ダウンフォース",
      "スリップストリーム（トウ）",
      "ポーポイズ現象",
      "グラウンドエフェクト"
    ],
    "correctIndex": 1,
    "explanation": "正解は「スリップストリーム（Slipstream / Tow）」です！前車のボディが空気を切り裂くことで背後に気圧の低い空気のポケットが生じ、後続車は空気の壁を押すエネルギーが減って加速が伸びます。",
    "funFact": "予選Q3のモンツァなどでは、チームメイト同士でスリップストリームを使い合ってストレートスピードを稼ぐのが定石です。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-b-3",
    "difficulty": "beginner",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "🛞 タイヤ基礎",
    "question": "ピレリの雨天用タイヤのうち、路面に水たまり（スタンディングウォーター）がない「湿った路面（濡れ始め〜乾きかけ）」に最も適した緑色のタイヤは？",
    "options": [
      "スリック・ハード",
      "フルウェット（青）",
      "インターミディエイト（緑）",
      "ソフト（赤）"
    ],
    "correctIndex": 2,
    "explanation": "正解は「インターミディエイト（Intermediate）」です！トレッドに浅い溝が刻まれており、時速300km走行時に1秒あたり約30〜35リットルの水を排水します。",
    "funFact": "大雨用のフルウェット（青）は1秒間に約85リットルの水を排水する驚異的な性能を持ちます。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-b-4",
    "difficulty": "beginner",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 DRSの基礎",
    "question": "ストレートでの追い越しを促進する「DRS（ドラッグ・リダクション・システム）」を作動させるための必須条件は？",
    "options": [
      "検知ポイント（ディテクションポイント）通過時に、前車とのタイム差が「1.0秒以内」であること",
      "自分が前の車より馬力が低いこと",
      "レースの残り周回が5周以下であること",
      "タイヤ交換を2回以上終えていること"
    ],
    "correctIndex": 0,
    "explanation": "正解は「検知ポイントで前車から1.0秒以内」です！リアウイングのフラップを油圧で開いて空気抵抗を大幅に減らし、時速10〜15km前後のトップスピード向上が得られます。",
    "funFact": "雨天時やセーフティカー先導中、またはイエローフラッグ区間では、レースコントロールによりDRSは自動的に使用禁止（無効化）されます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-b-5",
    "difficulty": "beginner",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 基本戦略",
    "question": "前車に接近して走行した際、前車が乱した乱気流によって後続車のダウンフォースが失われ、コーナリングで滑ってタイヤが加熱する悪影響を何と呼ぶ？",
    "options": [
      "クリーンエア",
      "ダーティエア（乱気流）",
      "ターボラグ",
      "アンダーステア"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ダーティエア（Dirty Air）」です！前車の背後1〜2秒以内を追従するとフロントウイングに当たる空気が乱れ、最大30〜40%のダウンフォースを失ってタイヤ表面が激しくスライドし、摩耗が急加速します。",
    "funFact": "先頭を独走するドライバーが「クリーンエア（綺麗な空気）」の恩恵を受けて悠々とタイヤを保たせられるのはこのためです。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-b-6",
    "difficulty": "beginner",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "🛞 タイヤ基礎",
    "question": "ピレリタイヤのコンパウンド（硬さ）を表す記号「C1」から「C5（またはC6）」のうち、最も硬くて耐久性が高いコンパウンドはどれ？",
    "options": [
      "C1",
      "C3",
      "C5",
      "C6"
    ],
    "correctIndex": 0,
    "explanation": "正解は「C1」です！数字が小さいほど硬く摩耗に強いコンパウンド（C1が最も硬く、C5/C6が最も柔らかい）を意味します。ピレリはこの中から毎週末コース特性に合わせて3種類を選び、白（ハード）・黄（ミディアム）・赤（ソフト）に割り当てます。",
    "funFact": "例えば超高速のシルバーストンにはC1〜C3が、低速で路面の滑らかなモナコにはC3〜C5が選定されます。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-b-7",
    "difficulty": "beginner",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 観戦の知恵",
    "question": "レース中にセーフティカー（SC）が出動した際、多くのチームが一斉にピットストップを行う最大の戦略的理由は？",
    "options": [
      "SC先導中は全車が低速で走っているため、ピットインによる通常走行車に対するタイムロスが半分程度に圧縮されるから",
      "SC中はタイヤ交換の工賃が無料になるから",
      "ピットインしないとペナルティが科されるルールだから",
      "SC中はピットクルーの人数を2倍に増やせるから"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ピットイン時の実質的なタイムロスが大幅に小さくなるから」です！通常レース中のピットロスが約20〜25秒なのに対し、全車がゆっくり走るSC中は約10〜12秒程度しか失わないため、タダ同然でタイヤを新品にできる「チープ・ストップ」となります。",
    "funFact": "これに対し、直前にピットを済ませていたドライバーは順位を大きく落とす不運に見舞われることがあります。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-i-1",
    "difficulty": "intermediate",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 実戦シナリオ判断",
    "question": "【実戦ストラテジー】あなたは首位走行中。2位のマシンが2秒後方に迫り、先にピットインして「アンダーカット」を仕掛けてきました。相手のアウトラップが強烈な場合、首位を守るための最も定石とされる対応は？",
    "options": [
      "無視してあと10周ステイアウトする",
      "直後の周回（ネクストラップ）で直ちにピットインしてタイヤを交換し、カバーする（Covering the undercut）",
      "エンジン出力をセーブモードに落とす",
      "相手が追いつくまでコース脇で待つ"
    ],
    "correctIndex": 1,
    "explanation": "正解は「直後の周回で即座にピットインしてカバーする」です！相手に新品タイヤで何周も走られると差を完全に逆転されるため、1周以内の最小限のギャップロスにとどめてピットに入り、ピット作業とピット出口でのポジション防衛を試みます。",
    "funFact": "もしピットインが1周遅れると、アウトラップの差で一気にアンダーカットを許してしまうため、ピットウォールは電光石火の決断を迫られます。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-i-2",
    "difficulty": "intermediate",
    "category": "racecraft",
    "format": "telemetry_tactics",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "📊 テレメトリー観戦術",
    "question": "【ブレーキング解析】テレメトリーの速度・ブレーキトレースにおいて、コーナー進入時にブレーキペダルを徐々に緩めながらエイペックス（頂点）深くまでターンインを続ける高等技術「トレイルブレーキング」の主目的は？",
    "options": [
      "ブレーキディスクを早く冷やすため",
      "フロントタイヤに荷重を残してグリップを保ち、フロントの回頭性を高めて素早くマシンの向きを変えるため",
      "ABS（アンチロックブレーキ）を作動させるため",
      "燃料消費量を抑えるため"
    ],
    "correctIndex": 1,
    "explanation": "正解は「フロントに荷重を残して回頭性を高め、向きを早く変えるため」です！直線で100%踏んだブレーキを、ステアリングを切り込む量に合わせて80%→50%→20%と滑らかにリリースすることで、タイヤのグリップ円（摩擦円）を100%使い切ります。",
    "funFact": "マックス・フェルスタッペンは鋭いトレイルブレーキングでノーズを鋭角に向け、素早くスロットルを開けるスタイルを得意としています。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-i-3",
    "difficulty": "intermediate",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "🛞 タイヤの科学",
    "question": "タイヤの表面温度が低く路面が滑りやすい時に、トレッドゴムが路面との摩擦でちぎれて丸まり、タイヤ表面に付着してグリップが一時的に激減する現象は？",
    "options": [
      "ブリスター（Blistering）",
      "グレーニング（Graining / ささくれ立ち）",
      "ハイドロプレーニング",
      "フラットスポット"
    ],
    "correctIndex": 1,
    "explanation": "正解は「グレーニング（Graining）」です！冷えたタイヤで無理にスライドさせるとゴムが消しゴムのカスのように毛羽立ち、路面との接触面積が減って滑ります。ただし、数周丁寧に走って表面を摩耗させるとカスが取れてグリップが復活（クリーンアップ）することがあります。",
    "funFact": "これに対し「ブリスター」は内部の過熱によって内部ゴムが沸騰して剥離する現象で、一度発生すると回復しません。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-i-4",
    "difficulty": "intermediate",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 実戦シナリオ判断",
    "question": "【オーバーカットの成立条件】アンダーカットではなく、あえてピットインを遅らせてステイアウトする「オーバーカット（Overcut）」が劇的に成功する典型的な状況は？",
    "options": [
      "新品タイヤのウォームアップが非常に遅く、先行してピットインした車がアウトラップでタイヤを温められずペースが上がらない時（または前方の渋滞トラフィックに引っかかった時）",
      "雨が土砂降りになった時",
      "燃料タンクが満タンの時",
      "DRSが常時使える時"
    ],
    "correctIndex": 0,
    "explanation": "正解は「相手のアウトラップが温まり不足で遅い時、または相手がトラフィックに引っかかった時」です！モナコなどタイヤのデグラデーションが極めて小さく、かつピットアウト後に遅い車の後ろに引っかかりやすいコースでは、クリーンエアでステイアウトし続けた方が逆転できる「オーバーカット」が頻繁に発生します。",
    "funFact": "2021年モナコGPでベッテルがハミルトンとガスリーをオーバーカットで一気に2台抜き去ったシーンが有名です。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-i-5",
    "difficulty": "intermediate",
    "category": "racecraft",
    "format": "telemetry_tactics",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "📊 テレメトリー観戦術",
    "question": "ドライバーがステアリング上のダイヤルで走行中に頻繁に変更する「ブレーキバイアス（Brake Bias）」で、前後配分を「前寄り（Forward）」に移動させた場合の挙動変化は？",
    "options": [
      "リアタイヤがロックしやすくなりスピンしやすくなる",
      "直進制動時の安定性が高まるが、ターンインでアンダーステアが出やすくなり、フロントタイヤがロックしやすくなる",
      "トップスピードが5km/h向上する",
      "エンジンの回転数が上昇する"
    ],
    "correctIndex": 1,
    "explanation": "正解は「直進安定性は高まるがアンダーステアになりフロントがロックしやすくなる」です！逆に後ろ寄り（Rearward）にすると回頭性は向上しますが、ブレーキング初期にリアが流れてスピンする危険が増加します。ドライバーはコーナーごとに数パーセント刻みで調整しています。",
    "funFact": "雨天時やタイヤが冷えている時は、スピン防止のためにブレーキバイアスを数%前寄りに振るのが定石です。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-i-6",
    "difficulty": "intermediate",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 レースマネジメント",
    "question": "エンジニアがドライバーに指示する「リフト＆コースト（Lift and Coast）」走法の具体的な手順と目的は？",
    "options": [
      "ストレートエンドのブレーキングポイント手前で早めにアクセルを全開から離し（リフト）、空走（コースト）してからブレーキを踏むことで、燃料消費とブレーキ温度を抑制する",
      "コーナー進入でクラッチを切る",
      "ピットレーンでエンジンを切る",
      "縁石の上を走って車高を持ち上げる"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ブレーキング手前でアクセルを早く抜き、燃料節約とブレーキ・PU冷却を図る」です！全開時間を数十メートル削るだけでラップタイムの損失を0.1秒未満に抑えつつ、燃料消費量を大幅に削減し、ブレーキ温度を劇的に下げることができます。",
    "funFact": "テレメトリーを見ると、スロットルグラフがストンと0に落ちてから、約0.5〜1秒後にブレーキ圧力が立ち上がる特徴的な波形を描きます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-i-7",
    "difficulty": "intermediate",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 実戦シナリオ判断",
    "question": "【DRSトレイン現象】前方にペースの遅い車Aがおり、その後ろに車B、車C、車Dがそれぞれ0.7秒間隔で連なって走っています。この「DRSトレイン」状態において後続車が追い抜きを成功させるのが極めて困難な理由は？",
    "options": [
      "先頭の車A以外の全車（B、C、D）が同時にDRSを使用できるため、後続車同士のストレート速度差が相殺されて相殺状態になるから",
      "規則により4台並んだら追い越してはならないから",
      "ピットレーンが封鎖されるから",
      "コースの道幅が自動的に狭くなるから"
    ],
    "correctIndex": 0,
    "explanation": "正解は「先頭以外の全車が前の車に対してDRSを開けるため、ストレート速度差が相殺されるから」です！先頭の車Aさえ抑えられれば、2番手以降は全員DRSを得て時速330km以上で走るため、トレインの後ろから抜くことが事実上不可能になります。",
    "funFact": "この膠着状態を打破するには、誰かがピットインしてアンダーカットを狙うか、先頭車両のタイヤが破綻するのを待つしかありません。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-e-1",
    "difficulty": "expert",
    "category": "racecraft",
    "format": "telemetry_tactics",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "📊 テレメトリー観戦術",
    "question": "【ドライビングスタイル比較】フェルスタッペンとハミルトンのコーナリングアプローチのテレメトリー速度波形（Speed Trace）に見られる典型的な違いは？",
    "options": [
      "ハミルトンは長いトレイルブレーキでスムーズなU字型のボトムスピードを保つ傾向があり、フェルスタッペンは直線で鋭く止めて素早く向きを変えスロットルを早く全開にする鋭角なV字ラインを描く傾向がある",
      "フェルスタッペンは常にハミルトンより1速高いギアで曲がる",
      "ハミルトンはアクセルを小刻みにポンピングして加速する",
      "両者のテレメトリー波形は完全に同一で違いはない"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ハミルトンはスムーズなU字アプローチ、フェルスタッペンは鋭いV字アプローチ」です！フェルスタッペンはフロントのグリップ（回頭性）を極限まで尖らせ、短い時間でコーナーの頂点をクリアして直線加速に移るスタイルを得意とします。一方ハミルトンはロールを綺麗に使った美しい円弧ラインでタイヤをいたわります。",
    "funFact": "マシンのセットアップもこれに連動し、フェルスタッペンは極度のオーバーステア（敏感なフロント）を好み、チームメイトを苦戦させる要因となっています。",
    "linkSubTab": "drivers"
  },
  {
    "id": "t-e-2",
    "difficulty": "expert",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 実戦シナリオ判断",
    "question": "【雨天クロスオーバーポイント】ドライ路面が雨で濡れ始めた際、スリックタイヤからインターミディエイトタイヤへの「クロスオーバーポイント（交換判断の境目）」となるラップタイムの目安は一般に通常ドライタイムの何％前後？",
    "options": [
      "約102%（2秒落ち）",
      "約110〜112%（約8〜10秒落ち）",
      "約130%（25秒落ち）",
      "約150%（40秒落ち）"
    ],
    "correctIndex": 1,
    "explanation": "正解は「約110〜112%（ドライ比で約8〜10秒落ち）」です！スリックのラップタイムがドライ比で8〜10秒以上落ちた瞬間、インターミディエイトタイヤを履いた車両の方がセクター全体で圧倒的に速くなり、ピットインしてタイヤを履き替える決断が下されます。",
    "funFact": "逆にインターミディエイトからフルウェットへのクロスオーバーは、スリック比で約18〜20秒落ち以上、またはハイドロプレーニングの発生が目安となります。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-e-3",
    "difficulty": "expert",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "🔬 ERSハイブリッド戦術",
    "question": "現代F1マシンのエネルギー回生システム（ERS）において、1周あたりにバッテリー（エナジーストア）からMGU-Kを通じて駆動輪へ放出できるエネルギーの上限量は？",
    "options": [
      "2 MJ（メガジュール）",
      "4 MJ（メガジュール）",
      "8 MJ（メガジュール）",
      "無制限"
    ],
    "correctIndex": 1,
    "explanation": "正解は「4 MJ（メガジュール）」です！MGU-Kからの最大出力は120kW（約160馬力）に制限されており、1周あたり最大4MJを放出できます（約33秒間のフルアシストに相当）。一方、MGU-H（熱回生）からバッテリーへの充電量は無制限です。",
    "funFact": "ストレートエンドでバッテリーが切れると突然160馬力を失う「ディプロイメント切れ（クリッピング現象）」が発生し、ライバルに一瞬で並ばれます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-e-4",
    "difficulty": "expert",
    "category": "racecraft",
    "format": "telemetry_tactics",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "📊 テレメトリー観戦術",
    "question": "【トラクション限界の判定】テレメトリーのスロットル開度データにおいて、立ち上がりでドライバーがアクセルを踏み込んだ瞬間にスロットル開度がわずかに戻り（マイクロリフト）、同時にエンジン回転数（RPM）が跳ね上がっている波形が示す挙動は？",
    "options": [
      "エンジンが故障してストールしかけた",
      "リアタイヤがトラクションの限界を超えてホイールスピン（空転）し、ドライバーがカウンターステアを当てながらアクセルを微調整してマシンを立て直した瞬間",
      "ギアチェンジが早すぎた",
      "ピットリミッターが誤作動した"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ホイールスピン発生に対する反射的なアクセルコントロール（修正）」です！ドライバーはリアが滑り出した瞬間、脳で考える前にミリ秒単位でアクセルを数パーセント抜いてタイヤのグリップを回復させ、スピンを防いでいます。",
    "funFact": "トップドライバーほどこのマイクロリフトの量が極小で、トラクション限界ギリギリのグリップを維持し続けます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-e-5",
    "difficulty": "expert",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 実戦シナリオ判断",
    "question": "【フリーピットストップ（Free Pit Stop）】レース終盤、首位を走るマシンが2位に対して「何秒以上のタイム差」を築いていれば、順位を失うリスクなしでピットインして新品ソフトに履き替え、ファステストラップを狙う「フリーピットストップ」が可能になる？",
    "options": [
      "約10秒差",
      "約15秒差",
      "約24〜26秒差（当該コースの標準ピットロスタイム＋セーフティマージン）",
      "約45秒差"
    ],
    "correctIndex": 2,
    "explanation": "正解は「約24〜26秒差（ピットロスタイム＋数秒のマージン）」です！ピットレーン走行と作業で失う時間（例えば22秒）に、作業ミス等のマージンを加えた差があれば、ピットを出ても依然として2位の前で復帰できます。",
    "funFact": "レッドブルやメルセデスは、このギャップができた瞬間に迷わずピットインさせてボーナスポイントをもぎ取る冷徹な戦略を確立していました。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-e-6",
    "difficulty": "expert",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "🔬 デファレンシャル工学",
    "question": "ドライバーがステアリングで調整する「ディファレンシャル（デフ）のロック率」において、「入側デフ（Entry Diff）」の数値を高く（クローズド／ロック寄り）に設定した場合のマシン挙動は？",
    "options": [
      "ブレーキングおよびターンイン時の直進安定性が高まるが、マシンの回頭性が重くなりアンダーステア傾向になる",
      "ターンインで急激にスピンしやすくなる",
      "ブレーキペダルが奥まで入るようになる",
      "最高速度が10km/h低下する"
    ],
    "correctIndex": 0,
    "explanation": "正解は「減速・進入時の安定性が増すが、曲がりにくく（アンダーステア）になる」です！左右の車輪の回転差を抑えることでブレーキング時のリアのふらつきを防止できます。高速コーナー手前ではロック率を高め、タイトなヘアピン手前ではデフを開いて（オープン）曲がりやすくします。",
    "funFact": "コーナーの「進入（Entry）」「中間（Mid）」「脱出（Exit）」でそれぞれ独立してデフの効きをセットアップできます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-e-7",
    "difficulty": "expert",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 実戦シナリオ判断",
    "question": "【1ストップ vs 2ストップのクロスオーバー分析】チーフストラテジストが「2回ピットストップ戦略」を採用すべきと判断する、タイヤデグラデーションの数学的境界条件は？",
    "options": [
      "タイヤがパンクした時のみ",
      "1ストップでタイヤを温存しながら走るペースダウンの累積損失時間が、追加のピットストップによるタイムロス（約20〜22秒）を上回った時",
      "決勝の気温が30度を超えた時",
      "全チームが2ストップを選んだ時"
    ],
    "correctIndex": 1,
    "explanation": "正解は「タイヤ温存によるタイム損失の累積が、ピットストップ1回分の所要時間を超える時」です！タイヤの摩耗（デグラデーション）が1周あたり0.1秒以上悪化していくような高負荷コースでは、古いタイヤを労わりながら走るより、新品タイヤで全開プッシュして2回タイヤを変えた方がレース全体の所要時間が短くなります。",
    "funFact": "2021年フランスGPでレッドブルのフェルスタッペンが残り周回で2ストップへ切り替え、1ストップのハミルトンをラスト2周で大逆転したレースが代表例です。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-m-1",
    "difficulty": "master",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 チーフストラテジスト決断",
    "question": "【極限のピットウォール決断】レース残り15周、2位のマシンと3秒差で首位走行中に突然フルセーフティカー（SC）が導入されました。2位のチームはあなたのマシンの動きを見て「逆の行動（Box opposite）」を取る無線を入れています。あなたがピットに入れば相手はステイアウトして首位に立ち、あなたがステイアウトすれば相手は新品ソフトに換えて背後に張り付きます。あなたの現在のハードタイヤは25周走行済み。ストラテジストとしての最適解の判断基準は？",
    "options": [
      "どんな状況でも先頭を走っている車は絶対にピットに入ってはならない",
      "コースの「オーバーテイク難易度（トラックポジションの価値）」を評価し、抜きにくいコース（モナコ・ハンガリー等）ならステイアウトで首位死守、抜きやすいコース（スパ・モンツァ・オーストリア等）ならピットインして新品タイヤでのリスタート勝負を選ぶ",
      "ドライバーにコイントスをさせて決める",
      "セーフティカーの真後ろでマシンをわざと故障させて赤旗を出させる"
    ],
    "correctIndex": 1,
    "explanation": "正解は「トラックポジションの価値とコースの抜きやすさに基づき決断する」です！モナコのように抜けないコースでは古いタイヤでもイン側を塞げば抑え切れるため首位ポジションの維持が絶対着順となりますが、ストレートの長いコースではリスタート時に古いハードタイヤは新品ソフトの餌食となり簡単に抜き去られるため、ピットインしてタイヤ有利を取るのが定石となります。",
    "funFact": "2021年アブダビGP最終盤のハミルトン（ステイアウト）とフェルスタッペン（新品ソフトへピットイン）の歴史的攻防がまさにこの究極のジレンマでした。",
    "linkSubTab": "drama"
  },
  {
    "id": "t-m-2",
    "difficulty": "master",
    "category": "racecraft",
    "format": "telemetry_tactics",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "📊 チーフエンジニア解析",
    "question": "【テレメトリー・ポーポイズ＆バウンシングの波形識別】2022年グラウンドエフェクト規定導入時に発生した「ポーポイズ現象（Porpoising）」を車高センサー（Ride Height）と垂直加速度（Vertical G）のテレメトリーデータで識別する特徴的な波形パターンは？",
    "options": [
      "ストレートで車高が完全に一定のまま推移する",
      "時速280km以上の高速域で車高が空力ダウンフォースで極限まで下がり、フロア失速（ストール）による車高跳ね上がりと再ダウンフォース発生が約5〜8Hzの一定周期で激しく振動を繰り返す正弦波",
      "コーナー進入時のみ垂直Gが下がる",
      "リアサスペンションのストロークが完全にゼロに固定される"
    ],
    "correctIndex": 1,
    "explanation": "正解は「高速ストレート上で約5〜8Hzの周期的な車高と垂直Gの激しい正弦波振動」です！ベンチュリトンネルが吸い付けられてフロアが路面に底突きすると、空気の流れが遮断されてダウンフォースが急喪失し、スプリングで跳ね上がると再び空気が流れて吸い付けられるサイクルが高速で反復されます。",
    "funFact": "ハミルトンが2022年バクーで背骨に激痛を訴えてマシンから降りられなくなった主原因がこのポーポイズ現象でした。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-m-3",
    "difficulty": "master",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "🔬 タイヤ熱力学",
    "question": "ピレリのF1タイヤにおける「バルク温度（内部構造コア温度）」と「表面温度（トレッド表面）」の熱力学的管理において、予選アタックラップで最も理想的な温度バランスは？",
    "options": [
      "表面温度だけが150℃を超えていれば内部温度は0℃で良い",
      "アタック開始時に内部バルク温度が適正レンジ（約100〜110℃）まで均一に温まっており、コーナーごとに発生するスライド熱で表面温度がオーバーヒート域（130℃超）に達するのを最終セクターまで抑え込むバランス",
      "タイヤ全体を走行中常に60℃以下に保ち続けること",
      "フロントタイヤとリアタイヤの空気圧を完全にゼロに抜くこと"
    ],
    "correctIndex": 1,
    "explanation": "正解は「内部バルク温度を芯まで温めつつ、表面のオーバーヒートをセクター3まで防ぐ」です！アウトラップで表面だけを急激に熱しても内部が冷えていると剛性感が出ず、逆に攻めすぎると最終セクターに到達する前に表面温度が130℃を超えて熱ダレ（オーバーヒート）を起こし、最後のトラクションが完全に消失します。",
    "funFact": "アウトラップでドライバーが直線で急加減速（バーンアウト）やウィービング（蛇行）を行うのは、ブレーキ熱をホイールリム経由でタイヤ内部へ伝導させるためです。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-m-4",
    "difficulty": "master",
    "category": "racecraft",
    "format": "telemetry_tactics",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "📊 チーフエンジニア解析",
    "question": "【エンジンブレーキマッピングの極限調整】ステアリング上の「EB（エンジンブレーキ）」ダイヤルの数値を強めた（ハイエンジンブレーキ）場合、コーナー進入時のマシン挙動とタイヤへの影響は？",
    "options": [
      "スロットルオフ時のリアアクスルの回生／制動抵抗が強まり、マシンの減速を助け回頭性が鋭くなるが、進入でリアタイヤの横滑り（オーバーヒートや不安定）を誘発しやすくなる",
      "直進最高速が向上する",
      "フロントブレーキの摩耗が2倍になる",
      "燃料噴射量が倍増する"
    ],
    "correctIndex": 0,
    "explanation": "正解は「スロットルオフ時のリア制動が強まり回頭性を助けるが、リアが滑りやすくなる」です！スロットルを離した瞬間にMGU-Kの回生負荷とエンジンのポンピングロスで後輪に強い制動がかかるため、ピッチングが起きて素早く前輪に荷重が移りますが、強すぎるとブレーキング中にリアがロックしてスピンのリスクが高まります。",
    "funFact": "ドライバーは路面グリップの低いセッション序盤や雨天時にはEBを弱めてリアの安定性を確保します。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-m-5",
    "difficulty": "master",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 チーフストラテジスト決断",
    "question": "【タイヤブランケット温度規制とアウトラップの攻防】FIAの環境規制によりタイヤブランケットの設定上限温度が従来の100℃から「70℃」へと引き下げられた現代F1において、アンダーカットを仕掛けるドライバーのアウトラップで発生する重大な戦術的変化は？",
    "options": [
      "ピットアウト直後の第1コーナーからいきなり新品ソフトで全開グリップが得られるようになった",
      "ピットアウト直後のタイヤが適正作動温度（100℃以上）に達しておらず極めて滑りやすいため、アウトラップの最初の数コーナーでペースが上がらず、アンダーカットの成功率が大幅に低下する（アウトラップ・ウォームアップ・デフィシット）",
      "ピット作業時間が5秒短縮された",
      "全チームがスリックタイヤを使用しなくなった"
    ],
    "correctIndex": 1,
    "explanation": "正解は「タイヤが冷えた状態で出るためアウトラップの最初が遅く、アンダーカットの成功難易度が劇的に上がった」です！70℃で温められたタイヤはコースに出た瞬間路面に冷やされ、最初の数コーナーはグリップが極度に低くなります。このため、アウトラップで無理にプッシュしてタイヤを壊すか、温存して徐々に上げるかの緻密な駆け引きが必要になりました。",
    "funFact": "タイヤブランケット自体の全面廃止議論も進められており、ドライバーたちの安全面での熱い議論が続いています。",
    "linkSubTab": "tyres"
  },
  {
    "id": "t-m-6",
    "difficulty": "master",
    "category": "racecraft",
    "format": "standard",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "🔬 レースエンジニアリング",
    "question": "予選Q3のフライングラップにおいて、トップチームがストレート上でステアリング上にある「OT（オーバーテイク／パッシング）ボタン」を押さない（または使用を制限する）技術的理由は？",
    "options": [
      "予選セッションではOTボタンの使用がFIA規則で全面禁止されているから",
      "予選専用の「予選ホットラップモード（Qualifying Mode）」では、あらかじめサーキットのGPS座標とコーナー脱出位置に同期して最適な1周フル放電エネルギー展開（ディプロイメントマップ）が自動最適化されており、手動でブーストボタンを押すと後半ストレートでバッテリーが早期枯渇（デプロイ切れ）を起こすから",
      "OTボタンを押すとDRSが閉じてしまうから",
      "ステアリングのボタンが壊れやすいから"
    ],
    "correctIndex": 1,
    "explanation": "正解は「予選専用モードで1周のエネルギー配分が完全に自動計算されており、手動ブーストを使うと後半で電欠を起こすから」です！チーフパワーユニットエンジニアは、どのストレートで何秒間MGU-Kを吹かせば1周のラップタイムが最速になるかをシミュレーションでプログラミングしています。手動で前半に使いすぎると、最長ストレートの途中で160馬力を失い大タイムロスとなります。",
    "funFact": "決勝レース中はこの制限が緩やかで、オーバーテイクや防衛のために任意でバッテリーを一気に放出するバトルが行われます。",
    "linkSubTab": "glossary"
  },
  {
    "id": "t-m-7",
    "difficulty": "master",
    "category": "racecraft",
    "format": "telemetry_tactics",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "📊 チーフエンジニア解析",
    "question": "【スリップストリーム vs ダーティエアのトレードオフ】テレメトリー解析において、ストレートエンドでの最高速度を最大化する理想的な前車とのギャップ（距離）と、コーナリングでダウンフォースを失わないためのギャップの相反する関係として最も正しいものは？",
    "options": [
      "ストレートで前車から0.5秒以内に接近するとトウ効果で時速10km以上伸びるが、続く中高速コーナーでは前車の乱気流でフロントダウンフォースが約30%失われアンダーステアとタイヤ加熱が起きるため、トウの利益とコーナーの損失が表裏一体となる",
      "前車の真後ろを走る方がコーナーでもダウンフォースが増加する",
      "車間距離が3秒以上離れるとスリップストリーム効果が最大になる",
      "現代のF1マシンは乱気流の影響を1%も受けない"
    ],
    "correctIndex": 0,
    "explanation": "正解は「ストレートでのトウの利益と、コーナーでのダウンフォース喪失・タイヤ加熱の損失が表裏一体」です！ストレートで抜けないと判断した場合、賢明なドライバーはわざとコーナーで前車から1.5〜2.0秒ほど距離を空けてクリーンエアを浴び、タイヤの表面温度を冷却してから次のアタック機会を窺います。",
    "funFact": "2022年のグラウンドエフェクト規定導入の主眼は、この後方乱気流を上空へ跳ね上げ、追従時のダウンフォース損失を従来の50%から約20%へ低減させることでした。",
    "linkSubTab": "glossary"
  },
  {
    "id": "c-b-8",
    "difficulty": "beginner",
    "category": "circuits",
    "format": "track_corner",
    "categoryLabel": "🏁 コース完全攻略",
    "formatLabel": "🏁 名門サーキット",
    "question": "「緑の地獄（The Green Hell）」の異名で知られ、かつてドイツGPが開催された1周20km以上の過酷な旧コースは？",
    "options": [
      "ホッケンハイムリンク",
      "ニュルブルクリンク・ノルドシュライフェ（北コース）",
      "アウス（AVUS）",
      "ザクセンリンク"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ニュルブルクリンク・ノルドシュライフェ（北コース）」です！ジャッキー・スチュワートがその過酷さと危険性から「緑の地獄」と名付けました。1976年のニキ・ラウダの事故を最後にF1決勝は近代的なグランプリコースへ移行しました。",
    "funFact": "現在でも市販車の世界最速ラップ開発テストの聖地として世界中に知られています。",
    "linkSubTab": "circuits"
  },
  {
    "id": "h-i-8",
    "difficulty": "intermediate",
    "category": "history",
    "format": "standard",
    "categoryLabel": "🏛️ 選手・チーム・歴史",
    "formatLabel": "👑 伝説のドラマ",
    "question": "2024年モナコGPにおいて、悲願であった「母国グランプリでの初優勝」をポール・トゥ・ウィンで飾り、涙の表彰台に立ったモナコ人ドライバーは？",
    "options": [
      "ランド・ノリス",
      "シャルル・ルクレール",
      "オスカー・ピアストリ",
      "ピエール・ガスリー"
    ],
    "correctIndex": 1,
    "explanation": "正解は「シャルル・ルクレール（フェラーリ）」です！幼少期に通学路として見ていたモナコの市街地で、幾度ものリタイアや不運を乗り越え、モナコ人として93年ぶりとなる歴史的な母国優勝を果たしました。",
    "funFact": "チェッカーを受けた直後のチーム無線での歓喜の絶叫と、モナコ大公アルベール2世との涙の抱擁は世界中のF1ファンを感動させました。",
    "linkSubTab": "drama"
  },
  {
    "id": "t-i-8",
    "difficulty": "intermediate",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 実戦シナリオ判断",
    "question": "【2023年シンガポールGP・サインツの頭脳】カルロス・サインツが終盤、猛追するメルセデス2台（ラッセルとハミルトン）から首位を守り切るために、あえて2位のライバル（ノリス）に対して意図的に行った神業ストラテジーは？",
    "options": [
      "わざと急ブレーキを踏んでノリスを接触させた",
      "ノリスとのギャップをあえて0.8秒前後に調整して「ノリスにDRSを与え続け」、メルセデスに対する防壁として利用した",
      "ピットインして新品タイヤに交換した",
      "エンジン出力を下げてノリスに首位を譲った"
    ],
    "correctIndex": 1,
    "explanation": "正解は「ノリスにあえてDRS圏内（1秒以内）を走らせ、メルセデスへの防弾シールドにした」です！サインツは新品ミディアムで1周1秒以上速いメルセデスを抑え切れないと瞬時に判断し、2位ノリスにDRSを提供し続けることでメルセデスのオーバーテイクを防ぎ、見事優勝を飾りました。",
    "funFact": "無線でエンジニアから差を聞かれたサインツが「Yeah, it's on purpose（ああ、わざとDRSを与えているんだ）」と答えた無線は伝説となりました。",
    "linkSubTab": "drama"
  },
  {
    "id": "t-m-8",
    "difficulty": "master",
    "category": "racecraft",
    "format": "scenario",
    "categoryLabel": "🔭 観戦・戦術力UP",
    "formatLabel": "💡 チーフストラテジスト決断",
    "question": "【バーチャルセーフティカー（VSC）対 通常セーフティカー（SC）のピットデルタ比較】通常グリーンフラッグ時のピットストップによる実質タイムロスが22秒のサーキットにおいて、VSC導入中にピットインした場合の損失時間（ピットデルタ）として最も物理的に正しい数値は？",
    "options": [
      "通常時と全く同じ約22秒失う",
      "約10〜12秒程度に半減する（本コース走行車がVSCデルタで約35%減速している間、ピットレーン走行速度は一定のため）",
      "タイムロスが完全に0秒になる",
      "ピットインした方が逆にタイムが20秒早くなる"
    ],
    "correctIndex": 1,
    "explanation": "正解は「約10〜12秒程度に半減する」です！本コース上のマシンが通常時速300km以上のところを時速180km前後のVSC制限ペースで走っている間、ピットレーン制限速度（80km/h）は変わらないため、コース上で失う走行距離の差が小さくなり、ピットストップのコストが約半分に激減します。",
    "funFact": "これを利用してライバルがステイアウトしている間にVSC下でピットインを成功させることを「VSCチープストップ（Cheap Stop）」と呼び、レース展開を一瞬でひっくり返します。",
    "linkSubTab": "tyres"
  }
,
{
  "id": "radio-b-1",
  "difficulty": "beginner",
  "category": "racecraft",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・無線戦略クイズ】流れる本物のチーム無線をお聞きください。「Russell, one second behind. If you keep the pack bunched up, he cannot do two stops...（ラッセルは1秒後方。集団を団子状態にしておけば、彼は2ストップ作戦を採れない）」と指示を受け、後続のノリスに意図的にDRSを与え続けてラッセルの猛追を封じ込め、フェラーリに劇的勝利をもたらしたドライバーは誰？",
  "options": [
    "カルロス・サインツ (スクーデリア・フェラーリ)",
    "シャルル・ルクレール (スクーデリア・フェラーリ)",
    "ランド・ノリス (マクラーレン)",
    "ジョージ・ラッセル (メルセデスAMG)"
  ],
  "correctIndex": 0,
  "explanation": "正解は「カルロス・サインツ (2023年 シンガポールGP)」です！レース終盤、タイヤ交換で猛烈に追い上げるメルセデス勢（ラッセル＆ハミルトン）に対し、首位サインツはペースを敢えて落として2位ノリスを1秒以内のDRS圏内にキープ。「DRSトレイン」を形成してノリスを守りつつ自身の防壁とする天才的チェス戦略で見事ポール・トゥ・ウィンを飾りました。",
  "funFact": "サインツ自身がレース後に「意図的にペースをコントロールし、ランドにDRSを供給し続けた」と明かした、現代F1の戦術史に残るマスターピースです。",
  "linkSubTab": "drama",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_sainz_singapore.mp3",
    "radioQuote": "Russell, one second behind. If you keep the pack bunched up, he cannot do two stops. Russell cannot do two stops.",
    "transcriptJa": "ラッセルは1秒後方だ。集団を団子状態に詰まらせておけば、彼は2ストップ作戦を採ることはできない。ラッセルは2ストップできないぞ。",
    "speakerName": "リカルド・アダミ (サインツ担当エンジニア)",
    "speakerCode": "SAI",
    "year": 2023,
    "gpName": "シンガポールGP"
  },
  "sourceAttribution": {
    "title": "2023 F1シンガポールGP 公式チーム無線実音源アーカイブ",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "radio-b-2",
  "difficulty": "beginner",
  "category": "racecraft",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・戦術用語クイズ】流れる本物のピット無線をお聞きください。エンジニアから「And box opposite McLaren, box opposite McLaren」と指示が入りました。F1のピット戦略における定番指示「Box opposite [ライバルチーム名]」が意味する戦術行動として正しいものはどれ？",
  "options": [
    "指定チーム（マクラーレン）と「逆の行動」をとれ（相手がピットに入ればステイアウト、相手がコースに残ればピットイン）",
    "マクラーレンの直後について同時にピットインせよ",
    "マクラーレンのガレージの反対側（ファストレーン側）に停車せよ",
    "マクラーレンとは異なるタイヤコンパウンドを装着せよ"
  ],
  "correctIndex": 0,
  "explanation": "正解は「指定チームと逆の行動をとれ」です！ピットレーン入口直前でライバルの動きを見て、相手が入ればコースに留まり（オーバーカット狙い）、相手が入らなければ自車がピットに飛び込む（アンダーカット狙い）という、ピットストップタイミングを敢えてずらすためのF1の王道タクティクス指示です。",
  "funFact": "この指示はピット入口の直前（最終コーナー付近）でコールされることが多く、ドライバーはコンマ数秒の判断でピットレーンに飛び込むかステイアウトするかを決断します。",
  "linkSubTab": "pitstops",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_leclerc_suzuka.mp3",
    "radioQuote": "And box opposite McLaren, box opposite McLaren.",
    "transcriptJa": "そしてマクラーレンと逆の行動をとれ。マクラーレンと逆だ。",
    "speakerName": "レースエンジニア",
    "speakerCode": "ENG",
    "year": 2024,
    "gpName": "日本GP (鈴鹿)"
  },
  "sourceAttribution": {
    "title": "2024 F1日本GP 公式ピットウォール通信記録",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "radio-b-3",
  "difficulty": "beginner",
  "category": "racecraft",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・ピット無線クイズ】流れる本物のチーム無線をお聞きください。冷静沈着なトーンで「Okay, that's fine. Stay out.（了解、問題ない。そのままステイアウトしろ）」とドライバーに指示を出している、マックス・フェルスタッペンとの絶妙な掛け合いと信頼関係で知られるレッドブル・レーシングの名物チーフ・レースエンジニアは誰？",
  "options": [
    "ジャンピエロ・ランビアーゼ (通称GP)",
    "ピーター・ボニントン (通称ボノ)",
    "リカルド・アダミ",
    "ヒュー・バード"
  ],
  "correctIndex": 0,
  "explanation": "正解はレッドブルの「ジャンピエロ・ランビアーゼ（Gianpiero Lambiase、通称GP）」です！フェルスタッペンが2016年にレッドブルに昇格して以来一貫して担当し、過酷なレース展開でも決して動じず冷静な指示を飛ばす姿は、まさに現代F1最強のドライバー＆エンジニアコンビの象徴です。",
  "funFact": "フェルスタッペンは「もしGPが引退したり辞めたりするなら、僕もF1を辞める」と公言するほど、GPに対して絶対的な信頼を寄せています。",
  "linkSubTab": "drama",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_verstappen_suzuka.mp3",
    "radioQuote": "Okay, that's fine. Stay out.",
    "transcriptJa": "了解、問題ない。そのままコースにステイアウトしろ。",
    "speakerName": "ジャンピエロ・ランビアーゼ (GP)",
    "speakerCode": "VER",
    "year": 2024,
    "gpName": "日本GP (鈴鹿)"
  },
  "sourceAttribution": {
    "title": "2024 F1日本GP レッドブル・レーシング公式チーム無線",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "radio-i-1",
  "difficulty": "intermediate",
  "category": "racecraft",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・ピットセッティング無線】流れるMcLarenの本物ピット無線をお聞きください。エンジニアから「Oscar, what do you think about down two?（オスカー、ダウン2はどうだ？）」と聞かれ、ピアストリが「Yeah. Happy with that.」と答えています。この「down two（ダウン2）」が意味するピット作業時のメカニカル調整はどれ？",
  "options": [
    "フロントウイングのフラップ角度を2クリック（2段階）寝かせる（フロント荷重を抜いてアンダー気味に振る）",
    "エンジン出力をモード2まで下げて燃料をセーブする",
    "タイヤ空気圧（内圧）を前後ともに2psi下げる",
    "ブレーキバイアスをフロントからリアへ2%移行する"
  ],
  "correctIndex": 0,
  "explanation": "正解は「フロントウイングのフラップ角度を2段階寝かせる（ダウンフォース減）」です！F1のピット作業では専用のトルクレンチでフロントウイングのネジを回し、左右のフラップ角度を「Down two / Up two」などと微調整します。ドライバーのフィードバックに合わせて前後のグリップバランス（オーバーステア/アンダーステア）を即座に補正する重要なピット作業です。",
  "funFact": "鈴鹿のような高速S字区間があるサーキットでは、ウイング角度がわずか1クリック違うだけでマシンの回頭性とリアの安定性が劇的に変化します。",
  "linkSubTab": "aero",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_piastri_suzuka.mp3",
    "radioQuote": "Engineer: Oscar, what do you think about down two?\nOscar Piastri: Yeah. Happy with that.\nEngineer: Copy. Will box. We'll bring you back in the garage.",
    "transcriptJa": "エンジニア: オスカー、フロントウイングをダウン2（2クリック下げ）にするのはどうだ？\nピアストリ: ええ、それでいいです。満足です。\nエンジニア: 了解。ピットインしろ。ガレージに戻す。",
    "speakerName": "オスカー・ピアストリ ＆ エンジニア",
    "speakerCode": "PIA",
    "year": 2024,
    "gpName": "日本GP (鈴鹿)"
  },
  "sourceAttribution": {
    "title": "2024 F1日本GP マクラーレン公式チーム無線",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "radio-i-2",
  "difficulty": "intermediate",
  "category": "racecraft",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・ステアリング操作無線】流れるピット無線音声をお聞きください。「Lando suggests consistent use of red button into turn 15 for tires（ランドはタイヤのためにターン15で赤ボタンを一貫して使うことを提案している）」と言及されています。現代F1のステアリング上に配置される「赤ボタン（Red Button / OTボタン）」が持つ最も代表的な機能は何？",
  "options": [
    "オーバーテイクボタン（ERSバッテリーの最大120kW出力を瞬時に解放するデプロイメント）",
    "ピットリミッター（ピットレーン走行時の80km/h速度制限）",
    "無線ミュートボタン（ピットとの音声通信を完全に遮断する）",
    "ドリンクポンプボタン（ヘルメット内の給水チューブを作動させる）"
  ],
  "correctIndex": 0,
  "explanation": "正解は「オーバーテイクボタン（ERS最大出力展開）」です！ステアリング背面や側面に備わる目立つ赤色のボタンは、通常プッシュ・トゥ・パス（オーバーテイクモード）に設定されており、押している間バッテリーの最大出力をフル放出し、コーナー立ち上がりやストレートでの加速を最大化します。",
  "funFact": "鈴鹿のターン15（130R）の立ち上がりでERSパワーを効率的に使うことで、タイヤのトラクション負荷を低減しつつメインストレートへの車速を伸ばすことができます。",
  "linkSubTab": "energy",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_norris_suzuka.mp3",
    "radioQuote": "And Lando suggests consistent use of red button into turn 15 for tires.",
    "transcriptJa": "ランドはタイヤマネジメントのために、ターン15で赤ボタン（オーバーテイク/エネルギー展開）を一貫して使用することを提案しています。",
    "speakerName": "マクラーレン・ピットウォール通信",
    "speakerCode": "NOR",
    "year": 2024,
    "gpName": "日本GP (鈴鹿 130R)"
  },
  "sourceAttribution": {
    "title": "2024 F1日本GP マクラーレン公式チーム無線",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "radio-i-3",
  "difficulty": "intermediate",
  "category": "racecraft",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・ドライバー無線テスト】流れる本物のドライバー交信音声をお聞きください。「As you can see, it's actually a lot more slidey than previous days.（見ての通り、前の日よりもずっと滑りやすいよ）」と独特の落ち着いたアクセントで路面のグリップ低下をエンジニアへ詳細に報告している、フェラーリのエースドライバーは誰？",
  "options": [
    "シャルル・ルクレール (スクーデリア・フェラーリ)",
    "カルロス・サインツ (スクーデリア・フェラーリ)",
    "ピエール・ガスリー (アルピーヌ)",
    "角田裕毅 (レーシング・ブルズ)"
  ],
  "correctIndex": 0,
  "explanation": "正解は「シャルル・ルクレール」です！コースの路面コンディション（ラバーの乗り具合や路面温度によるグリップ変化）を的確に言語化し、セットアップや走行ラインの変更に活かすフィードバック能力の高さが伺える本物の無線通信です。",
  "funFact": "F1ドライバーは走行中、ステアリングを通じて手のひらに伝わる微細な振動やスリップアングルから路面の摩擦係数を感知し、即座にピットへ報告します。",
  "linkSubTab": "tyres",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_tsunoda_suzuka.mp3",
    "radioQuote": "As you can see, it's actually a lot more slidey than um, previous days.",
    "transcriptJa": "見ての通り、実際、前日よりもずっとマシンがスライドして滑りやすい状態だね。",
    "speakerName": "シャルル・ルクレール",
    "speakerCode": "LEC",
    "year": 2024,
    "gpName": "日本GP (鈴鹿)"
  },
  "sourceAttribution": {
    "title": "2024 F1日本GP フェラーリ公式チーム無線",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "radio-e-1",
  "difficulty": "expert",
  "category": "racecraft",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・タイヤ内圧＆熱入れ指示】流れる本物のエンジニア無線をお聞きください。「Can make a bit of space in 11. Just do some leaning on the tyre through 12.（ターン11で少しスペースを空けろ。ターン12でタイヤに荷重をしっかりかけていけ）」と指示が入っています。「leaning on the tyre（タイヤに荷重をかける）」という指示がセッション中に行われる主目的は何？",
  "options": [
    "高速コーナリングでタイヤのショルダー部に横G荷重をかけ、タイヤ表面とコア（深部）の温度を均一に作動温度領域（ワーキングレンジ）まで引き上げるため",
    "トレッド表面の左右偏摩耗を削り落としてフラットスポットを消すため",
    "タイヤ内圧を意図的に下げて空気漏れセンサーの校正を行うため",
    "縁石に勢いよく乗り上げてサスペンションのストローク限界を計測するため"
  ],
  "correctIndex": 0,
  "explanation": "正解は「横G荷重をかけてタイヤ表面とコア温度を作動温度域まで均一に引き上げるため」です！ピラニアのように激しいF1のタイヤ管理では、単なる蛇行（ウィービング）では表面温度しか上がらず、高速コーナーでマシンを「もたれかけさせる（leaning）」ことでタイヤの深部（カーカス/コア）まで熱を入れ、アタックラップの1コーナーから最大のメカニカルグリップを引き出します。",
  "funFact": "鈴鹿のターン12（200R・スプーンカーブの手前）は強烈な横Gがかかるため、アタック前のタイヤ内圧・温度コントロールに最適なセクターとされています。",
  "linkSubTab": "tyres",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_alonso_suzuka.mp3",
    "radioQuote": "Can make a bit of space in 11. Just do some leaning on the tyre through 12.",
    "transcriptJa": "ターン11で前とのスペースを少し空けていい。ターン12でタイヤにしっかり横荷重をかけて熱を入れていけ。",
    "speakerName": "アストンマーティン・レースエンジニア",
    "speakerCode": "ENG",
    "year": 2024,
    "gpName": "日本GP (鈴鹿 200R)"
  },
  "sourceAttribution": {
    "title": "2024 F1日本GP アストンマーティン公式チーム無線",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "radio-e-2",
  "difficulty": "expert",
  "category": "history",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・チーム代表無線】流れる本物のピットウォール通信音声をお聞きください。ピットウォールのインターコムから「I didn't hear by Perez」と明瞭なイギリス英語で指示・確認を行っている、レッドブル・レーシングのチーム代表（Team Principal）は誰？",
  "options": [
    "クリスチャン・ホーナー (レッドブル・レーシング)",
    "トト・ヴォルフ (メルセデスAMG F1)",
    "フレデリック・バスール (スクーデリア・フェラーリ)",
    "アンドレア・ステラ (マクラーレン)"
  ],
  "correctIndex": 0,
  "explanation": "正解はレッドブル・レーシングの「クリスチャン・ホーナー（Christian Horner）」代表です！2005年のチーム創設以来、長年にわたりピットウォールの司令塔として君臨し、数々のコンストラクターズ王座とドライバーズ王座を獲得した百戦錬磨のチーム代表です。",
  "funFact": "ホーナー代表のチーム無線コールは、ピットウォール中央のコンソールからダイレクトにレースエンジニアやFIAレースディレクターへ通達されます。",
  "linkSubTab": "drama",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_hamilton_suzuka.mp3",
    "radioQuote": "I didn't hear by Perez.",
    "transcriptJa": "ペレス側からの無線が聞き取れなかった。",
    "speakerName": "クリスチャン・ホーナー (レッドブル代表)",
    "speakerCode": "HOR",
    "year": 2024,
    "gpName": "日本GP (鈴鹿)"
  },
  "sourceAttribution": {
    "title": "2024 F1日本GP レッドブル・レーシング公式チーム代表無線",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "radio-m-1",
  "difficulty": "master",
  "category": "rules",
  "format": "audio_radio",
  "categoryLabel": "🎙️ 公式実音源クイズ",
  "formatLabel": "📻 実況無線アーカイブ",
  "question": "【公式FOM実況実音源・FIAデータ通信システム】流れる本物のピット無線をお聞きください。「Please check fast gear and Sargeant. Still aggressive.」とエンジニアが指示を出しています。F1レース中にピットウォールがドライバーへ「他車のアグレッシブ度やシフトギア・挙動」を瞬時にリアルタイム警告できるのは、FIAのレギュレーションによって全チーム・全車に搭載が義務付けられている何のシステムがあるから？",
  "options": [
    "FIA公式リアルタイム・テレメトリー＆GPSトラッキングシステム（全車の位置・車速・ギア・加速度データがレースコントロールおよび全チームにミリ秒単位で共有される）",
    "各ドライバーのヘルメットに取り付けられた脳波・脈拍センサー",
    "ピットレーンに配置された各チームの専任望遠スパイカメラ",
    "サーキット上空を旋回する偵察用小型ドローン中継"
  ],
  "correctIndex": 0,
  "explanation": "正解は「FIA公式リアルタイム・テレメトリー＆GPSトラッキングシステム」です！現代F1ではFIA指定の標準ECU（TAG 320）およびGPSトランスポンダーにより、全20台の車速、スロットル、ギア、コース上の絶対座標、タイヤ状態がリアルタイムで暗号化通信され、各チームの戦略エンジニアがライバルのペースやセクタータイム、ピットウインドウをミリ秒単位で解析しています。",
  "funFact": "このデータ共有システムはOpenF1や公式F1 TV Proのテレメトリーデータソースの根幹でもあり、現代F1のデータ革命を支える基盤技術です。",
  "linkSubTab": "telemetry",
  "audioSnippet": {
    "audioUrl": "/audio/radio/radio_russell_suzuka.mp3",
    "radioQuote": "Please check fast gear and Sargeant. Still aggressive.",
    "transcriptJa": "高速ギアとサージェントの動向を確認してくれ。彼はまだ非常にアグレッシブだ。",
    "speakerName": "メルセデス・レースエンジニア",
    "speakerCode": "ENG",
    "year": 2024,
    "gpName": "日本GP (鈴鹿)"
  },
  "sourceAttribution": {
    "title": "2024 F1日本GP メルセデスAMG公式チーム無線",
    "archiveNote": "FOD / フジテレビNEXT 中継アーカイブ & FOM公式ライブタイミング記録"
  }
},
{
  "id": "track-shape-suzuka",
  "difficulty": "beginner",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "鈴鹿サーキット",
    "富士スピードウェイ",
    "上海インターナショナル・サーキット",
    "セパン・インターナショナル・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「鈴鹿サーキット（日本・三重県）」です！全長5.807km、18のコーナーで構成される世界屈指のテクニカルコース。立体交差（8の字形状）によって右回りと左回りが組み合わされており、連続S字、デグナー、スプーンカーブ、超高速の130Rなど、ドライバーの腕とマシンの空力バランスが極限まで問われます。",
  "funFact": "1962年に本田宗一郎の号令で建設され、オランダの建築家ジョン・フーゲンホルツが設計を担当しました。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "suzuka",
    "svgMapUrl": "/images/circuits/maps/suzuka.svg",
    "circuitNameJa": "鈴鹿サーキット (Suzuka Circuit)"
  },
  "sourceAttribution": {
    "title": "FIA Grade 1 Circuit Documentation: Suzuka Circuit",
    "archiveNote": "FIA公式サーキット公認台帳 & FOD/フジテレビNEXT日本GP中継"
  }
},
{
  "id": "track-shape-monaco",
  "difficulty": "beginner",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "モンテカルロ市街地コース",
    "マリーナベイ市街地サーキット",
    "バクー市街地サーキット",
    "アルバート・パーク・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「モンテカルロ市街地コース（モナコGP）」です！全長3.337kmとF1カレンダー中最も短く、最低平均速度の伝統公道サーキット。サン・デボーテ、世界一低速なフェアモント（ロウズ）ヘアピン、トンネル、プールサイドシケイン、ラスカスなどをガードレールギリギリで駆け抜けます。",
  "funFact": "モナコ公国の公道をレース専用に閉鎖して開催され、インディ500・ル・マン24時間と並ぶ「世界三大レース」の一冠に位置付けられます。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "monaco",
    "svgMapUrl": "/images/circuits/maps/circuit-de-monaco.svg",
    "circuitNameJa": "モンテカルロ市街地コース (Circuit de Monaco)"
  },
  "sourceAttribution": {
    "title": "FIA Circuit Classification Grade 1: Monaco",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継アーカイブ"
  }
},
{
  "id": "track-shape-spa",
  "difficulty": "intermediate",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "スパ・フランコルシャン",
    "ニュルブルクリンク",
    "ホッケンハイムリンク",
    "カタロニア・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「スパ・フランコルシャン（ベルギーGP）」です！全長7.004kmとF1カレンダー最長。アルデンヌの深い森に作られ、高低差は100m以上。急激な下り坂から一気に駆け上がる「オールージュ〜ラディオン」、ケメルストレート、超高速左の「ブランシモン」など伝説のコーナーが連続します。",
  "funFact": "コースの一角では大雨が降り、別のセクションは完全ドライという「スパ・ウェザー（局地的な天候急変）」が幾多の名勝負と波乱を生み出してきました。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "spa",
    "svgMapUrl": "/images/circuits/maps/spa-francorchamps.svg",
    "circuitNameJa": "スパ・フランコルシャン (Circuit de Spa-Francorchamps)"
  },
  "sourceAttribution": {
    "title": "FIA Circuit Certification Grade 1: Spa-Francorchamps",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "track-shape-monza",
  "difficulty": "intermediate",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "モンツァ・サーキット",
    "イモラ・サーキット",
    "ムジェロ・サーキット",
    "ポール・リカール・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「モンツァ・サーキット（イタリアGP）」です！全長5.793km。コースの約80%がアクセル全開区間というF1最速の「スピードの殿堂（Temple of Speed）」。最高速は時速350kmを超え、直線を3つのタイトなシケインと高速コーナー（レズモ、アスカリ、パラボリカ）で繋ぐ超高速レイアウトです。",
  "funFact": "1922年に建設された世界で3番目に古い常設サーキットであり、イタリアの熱狂的フェラーリファン「ティフォシ」の聖地です。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "monza",
    "svgMapUrl": "/images/circuits/maps/monza.svg",
    "circuitNameJa": "モンツァ・サーキット (Autodromo Nazionale Monza)"
  },
  "sourceAttribution": {
    "title": "FIA Grade 1 Circuit Registry: Monza",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "track-shape-silverstone",
  "difficulty": "intermediate",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "シルバーストン・サーキット",
    "ブランズ・ハッチ",
    "ドニントン・パーク",
    "ヘレス・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「シルバーストン・サーキット（イギリスGP）」です！全長5.891km。第二次世界大戦中の英空軍（RAF）飛行場跡地に建設され、1950年にF1世界選手権の「史上最初のレース」が開催された発祥の地。コプス、時速280km/h超で駆け抜けるマゴッツ・ベケッツ・チャペルの連続高速S字、ストウなど中高速コーナーが連続します。",
  "funFact": "ほぼ全F1チームのファクトリーがシルバーストン周辺（モータースポーツ・バレー）に本拠地を置いています。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "silverstone",
    "svgMapUrl": "/images/circuits/maps/silverstone.svg",
    "circuitNameJa": "シルバーストン・サーキット (Silverstone Circuit)"
  },
  "sourceAttribution": {
    "title": "FIA Circuit Registry: Silverstone Circuit",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "track-shape-interlagos",
  "difficulty": "expert",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "インテルラゴス・サーキット",
    "エルマノス・ロドリゲス・サーキット",
    "アルバート・パーク・サーキット",
    "カタロニア・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「インテルラゴス・サーキット（正式名：アウトドローモ・ホセ・カルロス・パーチェ）」です！全長4.309km。2つの湖に挟まれたすり鉢状の天然地形を活かした反時計回りコース。スタート直後の「エス・ド・セナ」、インフィールドのタイトセクション、そして全開で駆け上がるジュンカオの登り坂など、数々のドラマチックなタイトル決定劇を生み出してきました。",
  "funFact": "反時計回りコースのためドライバーの首の左側に強烈なG負荷がかかる過酷なコースとして有名です。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "interlagos",
    "svgMapUrl": "/images/circuits/maps/interlagos.svg",
    "circuitNameJa": "インテルラゴス・サーキット (Autódromo José Carlos Pace)"
  },
  "sourceAttribution": {
    "title": "FIA Sporting Regulations Appendix O (Interlagos)",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継アーカイブ"
  }
},
{
  "id": "track-shape-redbull-ring",
  "difficulty": "expert",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "レッドブル・リンク",
    "ハンガロリンク",
    "ザントフォールト・サーキット",
    "イモラ・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「レッドブル・リンク（オーストリアGP）」です！全長4.318km、わずか10個のコーナーで構成されるコンパクトな山岳サーキット。シュピールベルクの丘陵地帯に位置し、急勾配のターン1、続く登り直線の先のターン3、そして下りながら曲がるターン4と、3つのDRSゾーンを繋ぐストップ＆ゴーのオーバーテイク激戦地です。",
  "funFact": "1周の予選ラップタイムが約63〜64秒台と、全F1カレンダー中で最も短時間で周回されるサーキットです。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "redbull-ring",
    "svgMapUrl": "/images/circuits/maps/redbull-ring.svg",
    "circuitNameJa": "レッドブル・リンク (Red Bull Ring)"
  },
  "sourceAttribution": {
    "title": "FIA Grade 1 Circuit Registry: Red Bull Ring",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "track-shape-villeneuve",
  "difficulty": "expert",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "ジル・ヴィルヌーヴ・サーキット",
    "アルバート・パーク・サーキット",
    "ソチ・オートドローム",
    "マイアミ・インターナショナル・オートドローム"
  ],
  "correctIndex": 0,
  "explanation": "正解は「ジル・ヴィルヌーヴ・サーキット（カナダGP）」です！全長4.361km。セント・ローレンス川に浮かぶ人工島（ノートルダム島）の公園道路を利用した半常設サーキット。ロングストレートとシケインが交互に現れる過酷なブレーキングサーキットで、最終シケイン立ち上がりには数々の王者を飲み込んだ「チャンピオンの壁（Wall of Champions）」が待ち受けます。",
  "funFact": "1978年に初開催され、地元カナダの英雄ジル・ヴィルヌーヴが初優勝を飾ったことを讃えて1982年に現在の名称に改名されました。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "villeneuve",
    "svgMapUrl": "/images/circuits/maps/villeneuve.svg",
    "circuitNameJa": "ジル・ヴィルヌーヴ・サーキット (Circuit Gilles-Villeneuve)"
  },
  "sourceAttribution": {
    "title": "FIA Grade 1 Circuit Documentation: Montreal",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "track-shape-singapore",
  "difficulty": "master",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "マリーナベイ市街地サーキット",
    "バクー市街地サーキット",
    "ジェッダ市街地サーキット",
    "ラスベガス・ストリップ・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「マリーナベイ市街地サーキット（シンガポールGP）」です！全長4.940km（2023年改修後）。2008年にF1史上初の「フルナイトレース」として誕生。強烈な熱帯の湿気と気温の中、投光器で照らされた高層ビル群の間を縫うように走る過酷なストリートコース。セーフティカー出動率が100%に近いことでも知られます。",
  "funFact": "2時間制限ルール（最大レース時間）に最も到達しやすい肉体的・精神的にF1最もしんどいグランプリと評されます。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "singapore",
    "svgMapUrl": "/images/circuits/maps/singapore.svg",
    "circuitNameJa": "マリーナベイ市街地サーキット (Marina Bay Street Circuit)"
  },
  "sourceAttribution": {
    "title": "FIA Circuit Homologation Grade 1: Marina Bay",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "track-shape-cota",
  "difficulty": "master",
  "category": "circuits",
  "format": "circuit_shape",
  "categoryLabel": "🏁 コース形状クイズ",
  "formatLabel": "🗺️ サーキット形状",
  "question": "【コース形状クイズ】表示されたコースレイアウト（SVGシルエット）をご覧ください。このサーキットはどこでしょう？",
  "options": [
    "サーキット・オブ・ジ・アメリカズ (COTA)",
    "上海インターナショナル・サーキット",
    "ヤス・マリーナ・サーキット",
    "ロサイル・インターナショナル・サーキット"
  ],
  "correctIndex": 0,
  "explanation": "正解は「サーキット・オブ・ジ・アメリカズ（COTA / アメリカ・オースティン）」です！全長5.513km、20個のコーナーを持つ反時計回りサーキット。スタート直後に一気に駆け上がる標高差41mの急勾配ブラインド左コーナー（ターン1）、シルバーストンのマゴッツ・ベケッツをオマージュした連続高速S字、ホッケンハイムを模したスタジアムセクションなど、世界の有名コーナーの要素を融合させた近代的超テクニカルコースです。",
  "funFact": "反時計回りで激しいバンプ（路面の凹凸）があり、2023年にはプランク摩耗による車検失格が相次ぐなどマシンの車高セッティングが極めてシビアなコースです。",
  "linkSubTab": "circuits",
  "circuitVisual": {
    "circuitId": "cota",
    "svgMapUrl": "/images/circuits/maps/cota.svg",
    "circuitNameJa": "サーキット・オブ・ジ・アメリカズ (Circuit of the Americas)"
  },
  "sourceAttribution": {
    "title": "FIA Grade 1 Circuit Registry: COTA",
    "archiveNote": "FIA公式サーキットガイド & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "driver-v-1-tsunoda",
  "difficulty": "beginner",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 ドライバー顔写真クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【ドライバー顔写真クイズ】写真のドライバーをご覧ください。日本人F1最長参戦記録を更新し、鋭いブレーキングと卓越した予選スピードで世界のトップチーム首脳陣から高い評価を受けるこの現役ドライバーは誰？",
  "options": [
    "角田裕毅",
    "小林可夢偉",
    "佐藤琢磨",
    "中嶋一貴"
  ],
  "correctIndex": 0,
  "explanation": "正解は「角田裕毅」です！ホンダ・レッドブル育成として2021年にアルファタウリからF1デビュー。ルーキーイヤー最終戦アブダビGPで4位入賞。粘り強いレース巧者へと進化し、日本モータースポーツ界を背負うトップドライバーです。",
  "funFact": "デビュー戦の2021年バーレーンGPでフェルナンド・アロンソをオーバーテイクして9位入賞し、日本人初のデビュー戦ポイント獲得を達成しました。",
  "linkSubTab": "drivers",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_tsunoda.jpg",
    "driverNameJa": "角田裕毅",
    "teamName": "VCARB / レッドブル・レーシング"
  },
  "sourceAttribution": {
    "title": "Formula 1 Official Driver Registry: Yuki Tsunoda",
    "archiveNote": "F1公式ドライバーズプロフィール"
  }
},
{
  "id": "driver-v-2-verstappen",
  "difficulty": "beginner",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 ドライバー顔写真クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【ドライバー顔写真クイズ】写真のドライバーをご覧ください。史上最年少の17歳でF1デビューを果たし、シーズン年間19勝（勝率86.4%）という前人未到の大記録を樹立したオランダの若き皇帝は誰？",
  "options": [
    "マックス・フェルスタッペン",
    "ルイス・ハミルトン",
    "シャルル・ルクレール",
    "ランド・ノリス"
  ],
  "correctIndex": 0,
  "explanation": "正解は「マックス・フェルスタッペン」です！2016年スペインGPで18歳7ヶ月での史上最年少優勝を記録。2021年に劇的な初戴冠を果たし、以降シーズン10連勝や年間最多勝などF1の歴史的記録を次々と塗り替えています。",
  "funFact": "彼の父親ヨス・フェルスタッペンも元F1ドライバーで、ミハエル・シューマッハのチームメイトを務めました。",
  "linkSubTab": "drivers",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_verstappen.jpg",
    "driverNameJa": "マックス・フェルスタッペン",
    "teamName": "レッドブル・レーシング"
  },
  "sourceAttribution": {
    "title": "FIA Formula 1 World Championship Hall of Fame: Max Verstappen",
    "archiveNote": "レッドブル・レーシング公式ドライバーアーカイブ"
  }
},
{
  "id": "driver-v-3-norris",
  "difficulty": "beginner",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 ドライバー顔写真クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【ドライバー顔写真クイズ】写真のドライバーをご覧ください。マクラーレンのエースとして2024年マイアミGPで待望の初優勝を飾り、卓越したコーナリングスピードで王座争いを演じるイギリス出身ドライバーは誰？",
  "options": [
    "ランド・ノリス",
    "ジョージ・ラッセル",
    "オスカー・ピアストリ",
    "アレクサンダー・アルボン"
  ],
  "correctIndex": 0,
  "explanation": "正解は「ランド・ノリス」です！2019年に19歳でマクラーレンからデビュー。表彰台常連となりながら惜しくも優勝を逃し続ける苦闘を乗り越え、2024年マイアミで見事初戴冠を果たしました。",
  "funFact": "シムレース（eスポーツ）の世界でもプロ級の腕前を持ち、ゲーム配信者としても世界中に数百万人のファンを持っています。",
  "linkSubTab": "drivers",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_norris.jpg",
    "driverNameJa": "ランド・ノリス",
    "teamName": "マクラーレン・フォーミュラ1チーム"
  },
  "sourceAttribution": {
    "title": "McLaren Racing Official Archives: Lando Norris",
    "archiveNote": "FOD / フジテレビNEXT F1中継選手名鑑"
  }
},
{
  "id": "driver-v-4-senna",
  "difficulty": "intermediate",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 ドライバー顔写真クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【ドライバー顔写真クイズ】写真のドライバーをご覧ください。「音速の貴公子」と称され、マクラーレン・ホンダの黄金期を牽引して3度の世界王者に輝いたブラジルの不世出の英雄は誰？",
  "options": [
    "アイルトン・セナ",
    "アラン・プロスト",
    "ネルソン・ピケ",
    "エマーソン・フィッティパルディ"
  ],
  "correctIndex": 0,
  "explanation": "正解は「アイルトン・セナ」です！神憑り的な予選一発のアタック力、雨のレースでの圧倒的なドライビング、そしてプロストとの歴史的ライバル関係など、日本をはじめ世界中で社会現象を巻き起こしました。",
  "funFact": "1988年日本GP（鈴鹿）ではスタートでエンジンストール寸前の最後尾近くまで落ちながら、驚異の猛追撃で大逆転優勝を飾り、自身初のワールドチャンピオンを決定づけました。",
  "linkSubTab": "drivers",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_senna.jpg",
    "driverNameJa": "アイルトン・セナ",
    "teamName": "マクラーレン・ホンダ / ロータス / ウィリアムズ"
  },
  "sourceAttribution": {
    "title": "Formula 1 Heritage Hall of Fame: Ayrton Senna da Silva",
    "archiveNote": "F1歴史遺産アーカイブ記録"
  }
},
{
  "id": "driver-v-5-schumacher",
  "difficulty": "intermediate",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 ドライバー顔写真クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【ドライバー顔写真クイズ】写真のドライバーをご覧ください。ベネトンとスクーデリア・フェラーリで通算7度の世界王座（歴代最多タイ）と通算91勝を誇り、『皇帝』と称されたドイツの偉大なレジェンドは誰？",
  "options": [
    "ミハエル・シューマッハ",
    "セバスチャン・ベッテル",
    "ニコ・ロズベルグ",
    "ミカ・ハッキネン"
  ],
  "correctIndex": 0,
  "explanation": "正解は「ミハエル・シューマッハ」です！1994-1995年にベネトンで連覇し、フェラーリへ移籍して2000年から前人未到のドライバーズ5連覇を達成。驚異的なフィジカルトレーニングと徹底したチームビルディングで現代F1のプロ意識の基準を打ち立てました。",
  "funFact": "弟のラルフ・シューマッハ、息子のミック・シューマッハもF1ドライバーとして活躍したF1一族です。",
  "linkSubTab": "drivers",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_schumacher.jpg",
    "driverNameJa": "ミハエル・シューマッハ",
    "teamName": "スクーデリア・フェラーリ / ベネトン / メルセデス"
  },
  "sourceAttribution": {
    "title": "Scuderia Ferrari Official Hall of Fame: Michael Schumacher",
    "archiveNote": "FIA殿堂入りドライバー記録"
  }
},
{
  "id": "incident-e-abu-dhabi",
  "difficulty": "expert",
  "category": "rules",
  "format": "rule_dilemma",
  "categoryLabel": "📜 ルール・規定",
  "formatLabel": "⚖️ FIA裁定事件",
  "question": "【FIA公式裁定事件】2021年アブダビGP最終周直前のSC解除プロセスにおいて、首位ハミルトンと2位フェルスタッペンの間の周回遅れ車両数台のみがアンラップを許可されたことが歴史的論争となりました。FIAはこの曖昧さを排除するため、競技規則条項の「ANY（任意の）」をどの単語へと公式改定した？",
  "options": [
    "ALL (すべての)",
    "EACH (それぞれの)",
    "SOME (いくつかの)",
    "REMAINING (残りの)"
  ],
  "correctIndex": 0,
  "explanation": "正解は「ALL（すべての）」です！当時の第48条12項には『any cars that have been lapped...』と書かれており、レースディレクターは『任意の一部の車両』と解釈して運用しました。激しい抗議と検証報告書を経て、FIAは条文を明確に『all cars that have been lapped』へと改定し、一部だけのアンラップを厳格に禁止しました。",
  "funFact": "この改定に伴い、セーフティカー解除手順の文言やレースコントロールの権限範囲が根本から見直されました。",
  "linkSubTab": "rules",
  "sourceAttribution": {
    "title": "FIA Sporting Regulations 第55条13項 (旧第48条12項 改定条項)",
    "archiveNote": "FIAアブダビGP公式調査最終報告書 (2022年3月発行) & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "incident-e-cota-plank",
  "difficulty": "expert",
  "category": "rules",
  "format": "rule_dilemma",
  "categoryLabel": "📜 ルール・規定",
  "formatLabel": "⚖️ FIA裁定事件",
  "question": "【FIA公式裁定事件】2023年アメリカGP（COTA）スプリント週末の決勝レース後、2位チェッカーのルイス・ハミルトン（メルセデス）と6位のシャルル・ルクレール（フェラーリ）が車検失格となった技術規則違反の原因は？",
  "options": [
    "マシン底部のスキッドブロック（プランク）の厚みが規定の最低9.0mmを下回って摩耗していたため",
    "最低乾燥重量（798kg）を1.5kg下回っていたため",
    "燃料サンプルの残量が規定の1.0リットルに満たなかったため",
    "DRSリアウイング開口部の隙間が規定値（85mm）を超過していたため"
  ],
  "correctIndex": 0,
  "explanation": "正解は「底部のスキッドブロック（プランク）の過剰摩耗」です！FIA技術規則第3条5項9号により、10mmの新品プランクはレース後に最低9.0mm（摩耗許容1.0mm以内）残っていなければなりません。COTAの激しいバンプと、スプリント週末で金曜1回しかフリー走行がなく車高セッティングを突き詰められなかったことが原因でした。",
  "funFact": "この失格により、角田裕毅は8位へと繰り上がり、自身初のファステストラップボーナスポイント（1点）と合わせて計5ポイントを獲得しました。",
  "linkSubTab": "rules",
  "sourceAttribution": {
    "title": "FIA Formula 1 Technical Regulations Article 3.5.9 (Plank Assembly)",
    "archiveNote": "FIA公式車検レポート (2023 US GP Doc 66 & 67)"
  }
},
{
  "id": "incident-m-spa-russell",
  "difficulty": "master",
  "category": "rules",
  "format": "rule_dilemma",
  "categoryLabel": "📜 ルール・規定",
  "formatLabel": "⚖️ FIA裁定事件",
  "question": "【FIA公式裁定事件】2024年ベルギーGP（スパ）において、ジョージ・ラッセルが見事な1ストップ作戦でトップチェッカーを受けたものの、レース後の車検計量で無念の失格処分となりました。車検で測定された重量と最低規定重量の差は？",
  "options": [
    "燃料全量抜き取り後の測定値が796.5kg（最低規定798.0kgより1.5kgアンダー）だった",
    "測定値が794.0kg（4.0kgアンダー）だった",
    "ドライバー体重が78kg（最低80kgより2kgアンダー）だった",
    "冷却水が蒸発して0.8kgアンダーだった"
  ],
  "correctIndex": 0,
  "explanation": "正解は「車両重量796.5kg（規定798kgより1.5kgアンダー）」です！FIA技術規則第4条1項に違反しました。予定外の1ストップを敢行したため、タイヤのトレッドゴムが想定以上に摩耗して削ぎ落とされ、さらにスパ特有の「レース後のインラップなし（ピットロード直行）」によりタイヤカス（マーブル）を拾って重量を稼ぐことができなかった複合的要因でした。",
  "funFact": "ラッセルの失格により、チームメイトのルイス・ハミルトンが繰り上がりでキャリア105勝目を飾りました。",
  "linkSubTab": "rules",
  "sourceAttribution": {
    "title": "FIA Technical Regulations Article 4.1 & Technical Delegate Report",
    "archiveNote": "2024 Belgian Grand Prix Doc 45 (Car 63 Infringement) & FOD/フジテレビNEXT中継"
  }
},
{
  "id": "incident-m-suzuka-points",
  "difficulty": "master",
  "category": "rules",
  "format": "rule_dilemma",
  "categoryLabel": "📜 ルール・規定",
  "formatLabel": "⚖️ FIA裁定事件",
  "question": "【FIA公式裁定事件】2022年日本GP（鈴鹿）において、悪天候でレース予定距離の約53%（28周）しか消化できなかったにもかかわらず、フェルスタッペンにハーフポイントではなくフルポイント（25点）が付与されて王座決定が確定した競技規則条文上の理由は？",
  "options": [
    "短縮レースの減点制を定めた規則条項が「レースが中断のまま再開されず終了した場合」にのみ適用される文言になっており、鈴鹿では赤旗中断後に再開されてチェッカーが振られたため",
    "鈴鹿サーキットはクラシックコース特例としてスチュワードに裁量権があったため",
    "ファステストラップを記録していたため自動的にフルポイントが適用された",
    "全チーム代表がレース終了後にピットウォールで満場一致の特例承認を出したため"
  ],
  "correctIndex": 0,
  "explanation": "正解は「規則文言が『中断のまま再開されず終了した場合』にのみ減点制が適用される規定になっており、再開されてチェッカーが振られた鈴鹿は除外されたため」です！2021年スパの雨中2周中止を受けて作られた新条項の文言の盲点であり、当のフェルスタッペンやレッドブル首脳陣もレース直後はハーフポイントだと思い込んでいました。",
  "funFact": "クールダウンルームで公式インタビュー中に「マックス、君がワールドチャンピオンだ！」と告げられ、フェルスタッペン本人が「本当に？確かなの？」と困惑する珍場面が全世界に放映されました。",
  "linkSubTab": "rules",
  "sourceAttribution": {
    "title": "FIA Formula 1 Sporting Regulations Article 6.5 (Points Allocations)",
    "archiveNote": "2022 F1日本GP FOD/フジテレビNEXT中継アーカイブ & FIA公式声明"
  }
}
,
{
  "id": "driver-v-hamilton",
  "difficulty": "beginner",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 ドライバー顔写真クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【ドライバー顔写真クイズ】写真のドライバーをご覧ください。通算104回以上のポールポジションと105勝以上を誇り、ミハエル・シューマッハと並ぶ史上最多タイの「7度のワールドチャンピオン」を獲得した生ける伝説は誰？",
  "options": [
    "ルイス・ハミルトン",
    "フェルナンド・アロンソ",
    "セバスチャン・ベッテル",
    "キミ・ライコネン"
  ],
  "correctIndex": 0,
  "explanation": "正解は「ルイス・ハミルトン」です！2007年の鮮烈なデビュー以来、マクラーレンとメルセデスで通算7度の世界王座、100勝・100ポールポジションを史上初めて達成。2025年からはフェラーリへ移籍し、8度目の戴冠を目指して戦い続ける現代F1の生ける伝説です。",
  "funFact": "2008年ブラジルGP最終周の最終コーナーでティモ・グロックをかわして史上最年少（当時）で劇的な初王座を獲得しました。",
  "linkSubTab": "drivers",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_hamilton.jpg",
    "driverNameJa": "ルイス・ハミルトン",
    "teamName": "メルセデスAMG / スクーデリア・フェラーリ"
  },
  "sourceAttribution": {
    "title": "FIA Formula 1 World Championship Hall of Fame: Lewis Hamilton",
    "archiveNote": "FOD / フジテレビNEXT F1中継アーカイブ選手名鑑"
  }
},
{
  "id": "driver-v-alonso",
  "difficulty": "intermediate",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 ドライバー顔写真クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【ドライバー顔写真クイズ】写真のドライバーをご覧ください。2005年・2006年にルノーでシューマッハの連覇を止めて2年連続王座に輝き、F1史上最多の400戦以上のグランプリ出走記録を持つスペインの闘将は誰？",
  "options": [
    "フェルナンド・アロンソ",
    "カルロス・サインツ",
    "ペドロ・デ・ラ・ロサ",
    "マーク・ウェバー"
  ],
  "correctIndex": 0,
  "explanation": "正解は「フェルナンド・アロンソ」です！アグレッシブなステアリング操作と比類なきレースクラフトで知られ、ルノー、マクラーレン、フェラーリ、アルピーヌ、アストンマーティンと第一線で走り続け、40歳を超えても表彰台争いを繰り広げる鉄人です。",
  "funFact": "ル・マン24時間レースでも総合優勝を2度飾り、世界三大レースの二冠（F1モナコGP＆ル・マン24時間）を達成しています。",
  "linkSubTab": "drivers",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_alonso.jpg",
    "driverNameJa": "フェルナンド・アロンソ",
    "teamName": "アストンマーティンF1チーム"
  },
  "sourceAttribution": {
    "title": "Formula 1 Official Driver Registry: Fernando Alonso",
    "archiveNote": "FOD / フジテレビNEXT F1中継アーカイブ"
  }
},
{
  "id": "driver-v-senna",
  "difficulty": "expert",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 レジェンド肖像クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【レジェンド肖像クイズ】写真のドライバーをご覧ください。1988年、1990年、1991年にホンダV10/V12エンジンを駆るマクラーレンで3度の世界王座を獲得し、「音速の貴公子」として日本でも社会現象を巻き起こしたブラジルのカリスマは誰？",
  "options": [
    "アイルトン・セナ",
    "アラン・プロスト",
    "ナイジェル・マンセル",
    "ネルソン・ピケ"
  ],
  "correctIndex": 0,
  "explanation": "正解は「アイルトン・セナ」です！神憑り的な予選一発アタック（通算65ポール）と雨中の驚異的なマシンコントロールで全世界のファンを熱狂させました。ホンダ技術陣との深い絆でも知られ、鈴鹿サーキットで数々の名勝負を刻みました。",
  "funFact": "1993年ヨーロッパGP（ドニントンパーク）のオープニングラップで、雨の路面をものともせず1周で5台をごぼう抜きした走りは「F1史上最高のオープニングラップ」と讃えられています。",
  "linkSubTab": "history",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_senna.jpg",
    "driverNameJa": "アイルトン・セナ",
    "teamName": "マクラーレン・ホンダ"
  },
  "sourceAttribution": {
    "title": "FIA Hall of Fame: Ayrton Senna",
    "archiveNote": "FOD / フジテレビNEXT F1歴史アーカイブ記録"
  }
},
{
  "id": "driver-v-piastri",
  "difficulty": "intermediate",
  "category": "history",
  "format": "driver_visual",
  "categoryLabel": "👤 ドライバー顔写真クイズ",
  "formatLabel": "📷 顔写真クイズ",
  "question": "【ドライバー顔写真クイズ】写真のドライバーをご覧ください。F3・F2をルーキーイヤーで連覇し、2024年ハンガリーGPで初優勝、アゼルバイジャンGPでは果敢な飛び込みで首位を奪取して勝利したマクラーレンのオーストラリア人新星は誰？",
  "options": [
    "オスカー・ピアストリ",
    "ダニエル・リカルド",
    "ジャック・ドゥーハン",
    "リアム・ローソン"
  ],
  "correctIndex": 0,
  "explanation": "正解は「オスカー・ピアストリ」です！極めて冷静沈着な無線応答（通称アイスマンJr.）と一切のプレッシャーを感じさせない正確無比なドライビングで、参戦2年目にしてトップドライバーへと飛躍しました。",
  "funFact": "元F1ドライバーのマーク・ウェバーがマネージャーを務めており、巧みなキャリアマネジメントでも知られます。",
  "linkSubTab": "drivers",
  "driverVisual": {
    "imagePath": "/images/drivers/driver_piastri.jpg",
    "driverNameJa": "オスカー・ピアストリ",
    "teamName": "マクラーレンF1チーム"
  },
  "sourceAttribution": {
    "title": "Formula 1 Official Profile: Oscar Piastri",
    "archiveNote": "FOD / フジテレビNEXT F1中継アーカイブ"
  }
},
{
  "id": "drama-h-1-senna-prost-1989",
  "difficulty": "expert",
  "category": "history",
  "format": "rule_dilemma",
  "categoryLabel": "📜 歴史的事件・審議",
  "formatLabel": "⚖️ FIA裁定事件",
  "question": "【F1歴史的事件簿】1989年日本GP（鈴鹿）の47周目、シケイン進入でトップ争い中のセナとプロストが接触。コースに復帰してトップチェッカーを受けたセナがレース後に失格処分となった、FIA（バレストル会長）が下した裁定の公式名目は？",
  "options": [
    "「マーシャルにマシンを押してもらい押し掛け再スタートしたこと」および「シケイン不通過（エスケープ直進によるコース短縮）」",
    "「ピットレーンでの制限速度超過」",
    "「危険な幅寄せ走行に対する黒旗判定」",
    "「最低車両重量違反（1.5kgアンダー）」"
  ],
  "correctIndex": 0,
  "explanation": "正解は「マーシャルによる押し掛け再スタートおよびシケイン不通過（エスケープ直進）」です！接触停止後、セナはオフィシャルの押し掛けで脱出路を抜けてコース復帰し、ノーズ交換を経て猛追・優勝しました。しかしFIAはシケインを正規に通過していないとして失格を下し、プロストの1989年王座が決定。翌1990年の鈴鹿1コーナー同士討ちへと因縁が続きました。",
  "funFact": "この裁定に対しセナは「政治的な不公正だ」と激しく反論し、一時はスーパーライセンスの剥奪危機にまで発展しました。",
  "linkSubTab": "history",
  "sourceAttribution": {
    "title": "1989 FIA F1 World Championship Official Report (Suzuka)",
    "archiveNote": "FOD / フジテレビNEXT F1歴史アーカイブ & FIA公式審議録"
  }
},
{
  "id": "drama-h-2-crashgate-2008",
  "difficulty": "master",
  "category": "history",
  "format": "rule_dilemma",
  "categoryLabel": "📜 歴史的スキャンダル",
  "formatLabel": "⚖️ FIA重大処分事件",
  "question": "【F1歴史的スキャンダル】2008年第15戦シンガポールGPにおいて、ルノーのチーム代表フラビオ・ブリアトーレらがネルソン・ピケJr.に指示し、14周目のターン17で故意にスピン・クラッシュさせてセーフティカーを導入させ、早期ピットインしていたアロンソを優勝に導いた前代未聞の不正事件の通称は？",
  "options": [
    "クラッシュゲート (Crashgate)",
    "スパイゲート (Spygate)",
    "タイヤゲート (Tyregate)",
    "パドックゲート (Paddockgate)"
  ],
  "correctIndex": 0,
  "explanation": "正解は「クラッシュゲート」です！翌2009年、チームを解雇されたピケJr.がFIAに真実を告発して発覚。FIA世界モータースポーツ評議会（WMSC）により、首謀者のブリアトーレ代表にはF1からの無期限追放処分（後に減刑）、エンジニアリングディレクターのパット・シモンズには5年間の資格停止処分が下されました。",
  "funFact": "このSC導入時のピット混乱で給油ホースが抜けないまま発進してしまったフェリペ・マッサは大量得点を失い、結果として1点差で2008年王座を逃す引き金となりました。",
  "linkSubTab": "history",
  "sourceAttribution": {
    "title": "FIA World Motor Sport Council Decision: Renault F1 Team (Sept 2009)",
    "archiveNote": "FIA公式調査最終報告書 & FOD/フジテレビNEXT中継アーカイブ"
  }
},
{
  "id": "drama-h-3-canada-2011-button",
  "difficulty": "intermediate",
  "category": "history",
  "format": "standard",
  "categoryLabel": "📜 伝説の名勝負",
  "formatLabel": "🏁 歴史的激闘",
  "question": "【伝説の名勝負】豪雨で2時間以上の中断を挟み、総レース時間「4時間4分39秒」（F1史上最長）となった2011年カナダGPにおいて、接触・ドライブスルーペナルティ・パンク等で計6回もピットに入り、一時は最後尾21位まで転落しながら、最終周に首位ベッテルを劇的にオーバーテイクして優勝を飾ったドライバーは？",
  "options": [
    "ジェンソン・バトン (マクラーレン)",
    "ルイス・ハミルトン (マクラーレン)",
    "マーク・ウェバー (レッドブル)",
    "ミハエル・シューマッハ (メルセデス)"
  ],
  "correctIndex": 0,
  "explanation": "正解は「ジェンソン・バトン」です！タイヤ交換、接触によるウイング交換、ドライブスルーペナルティなどで合計6回もピットロードを通過し、一時は最後尾まで落ちながらも、乾いていく路面で異次元のラップタイムを連発。最終周のターン6で首位ベッテルが痛恨のハーフスピンを喫した瞬間に抜き去り、F1史上最も劇的な大逆転勝利を達成しました。",
  "funFact": "このレースは赤旗中断を含めた総所要時間が長すぎたため、後のレギュレーション改正で「赤旗中断を含めたレースの最大時間制限は3時間（後に2021年ベルギーGPを受けて見直し）」と規定される契機となりました。",
  "linkSubTab": "history",
  "sourceAttribution": {
    "title": "2011 Canadian Grand Prix Official Race Report",
    "archiveNote": "FOD / フジテレビNEXT 2011年カナダGP中継アーカイブ"
  }
},
{
  "id": "quiz-2026-pu-split",
  "difficulty": "intermediate",
  "category": "rules",
  "format": "standard",
  "categoryLabel": "📜 2026年新規定",
  "formatLabel": "⚡ パワーユニット",
  "question": "2026年より導入される新世代F1パワーユニット（PU）規則において、内燃機関（V6ターボエンジン）と電気モーター（MGU-K）の出力配分はどのように定められているか？",
  "options": [
    "内燃エンジン 約50% ： 電気モーター 約50%（各約350kW / 約475馬力）",
    "内燃エンジン 約80% ： 電気モーター 約20%",
    "完全電動モーター 100%（EV化）",
    "内燃エンジン 約30% ： 電気モーター 約70%"
  ],
  "correctIndex": 0,
  "explanation": "正解は「内燃エンジン約50% ： 電気モーター約50%」です！MGU-Hが廃止される一方、MGU-Kの出力が従来の120kW（約160馬力）から約350kW（約475馬力）へと3倍近く引き上げられ、合計1,000馬力超のほぼ半分をハイブリッド電力が担います。",
  "funFact": "燃料も化石燃料から、100%サステナブル（非化石由来・持続可能合成燃料）のドロップイン燃料へと完全移行します。",
  "linkSubTab": "regulations",
  "sourceAttribution": {
    "title": "2026 Formula 1 Power Unit Technical Regulations",
    "archiveNote": "FIA World Motor Sport Council Official Documentation"
  }
},
{
  "id": "quiz-2026-active-aero",
  "difficulty": "expert",
  "category": "racecraft",
  "format": "telemetry_tactics",
  "categoryLabel": "🔭 空力工学",
  "formatLabel": "🌀 アクティブエアロ",
  "question": "2026年マシンに導入されるアクティブ・エアロダイナミクスにおいて、ストレート走行時に空気抵抗（ドラッグ）を削ぎ落とすローダウンフォース形態の呼称は？",
  "options": [
    "Xモード（X-Mode）",
    "Zモード（Z-Mode）",
    "Sモード（Speed-Mode）",
    "Fダクト（F-Duct）"
  ],
  "correctIndex": 0,
  "explanation": "正解は「Xモード（X-Mode）」です！コーナー区間では前後ウイングを立てて最大ダウンフォースを得る「Zモード（Z-Mode）」、指定された直線区間では前後ウイング角を寝かせてドラッグを最小化する「Xモード」へと走行中に形状を切り替えます。",
  "funFact": "従来のDRS（前走車1秒以内の追従車のみ）と異なり、全車が指定ストレート区間でXモードを使用できるため、マシン全体のエネルギー消費効率が劇的に向上します。",
  "linkSubTab": "regulations",
  "sourceAttribution": {
    "title": "FIA 2026 Aerodynamic Technical Regulations & Concept Car Launch",
    "archiveNote": "FIA Technical Department Analysis"
  }
},
{
  "id": "quiz-2026-override-mode",
  "difficulty": "master",
  "category": "racecraft",
  "format": "rule_dilemma",
  "categoryLabel": "🔭 バトル新兵器",
  "formatLabel": "🔥 オーバーテイク",
  "question": "2026年規定において、従来のDRSに代わって「前走車の1秒以内に接近した追従車」に解禁される電動追加ブースト機能の正式名称は？",
  "options": [
    "マニュアル・オーバーライド・モード（Manual Override Mode）",
    "KERSハイパーブースト（Hyper KERS）",
    "プッシュ・トゥ・パス・プラス（Push-to-Pass+）",
    "スーパーチャージ・トリガー（Supercharge Trigger）"
  ],
  "correctIndex": 0,
  "explanation": "正解は「マニュアル・オーバーライド・モード（Manual Override Mode）」です！前走車から1秒以内の追従車は、時速290km/hを超えても電気出力が制限されず、時速355km/hまでフルパワー（350kW）の給電が持続するため、ストレートでの強烈なオーバーテイク加速が可能になります。",
  "funFact": "首位走者は時速290km/hから電気出力が徐々に0kWへと低下（デレート）するため、後続車との最高速差が明瞭に生じるよう工学的に設計されています。",
  "linkSubTab": "regulations",
  "sourceAttribution": {
    "title": "FIA 2026 Sporting & Technical Regulations: Overtake Override System",
    "archiveNote": "FIA Single-Seater Commission"
  }
},
{
  "id": "quiz-madrid-circuit-feature",
  "difficulty": "intermediate",
  "category": "circuits",
  "format": "track_corner",
  "categoryLabel": "🏁 2026新コース",
  "formatLabel": "🏙️ マドリング",
  "question": "2026年にF1スペインGPを開催する新設サーキット「マドリング（IFEMAマドリード）」の最大の特徴となっているコーナー構造は？",
  "options": [
    "最大傾斜約10度を誇る常設サーキット級の超高速バンクコーナー",
    "全長2.2kmにおよぶグリッド最長の直線ストレート",
    "地下トンネルを時速300km/h超で駆け抜けるアンダーパス",
    "8の字交差する立体交差ブリッジ"
  ],
  "correctIndex": 0,
  "explanation": "正解は「最大傾斜約10度の超高速バンクコーナー（The High Bank / T7-T9）」です！マドリングは市街地公道区間と、オランダ・ザントフォールトを彷彿とさせる傾斜10度の急勾配高速バンクが融合した世界初のハイブリッド公道サーキットです。",
  "funFact": "バンク旋回中は4.5G超の横Gとともに巨大な縦圧縮荷重が加わるため、車高のボトミング（底打ち）防止とサスペンション剛性の最適化が鍵を握ります。",
  "linkSubTab": "circuits",
  "sourceAttribution": {
    "title": "IFEMA Madrid Circuit Track Characteristics & Technical Briefing",
    "archiveNote": "Formula 1 Circuit Design Group"
  }
},
{
  "id": "quiz-madrid-location",
  "difficulty": "beginner",
  "category": "circuits",
  "format": "standard",
  "categoryLabel": "🏁 開催地トリビア",
  "formatLabel": "🇪🇸 マドリードGP",
  "question": "2026年にF1カレンダーに初登場するマドリード市街地コースが建設された、国際見本市会場を中心とするエリアの略称・名称は？",
  "options": [
    "IFEMA（イフェマ / フェリア・デ・マドリード）",
    "サンティアゴ・ベルナベウ",
    "プラド美術館パークウェイ",
    "プエルタ・デル・ソル"
  ],
  "correctIndex": 0,
  "explanation": "正解は「IFEMA（イフェマ）」です！マドリード・バラハス国際空港近くの巨大国際展示見本市コンプレックスの敷地および周辺道路を活用してコースが設計されました。",
  "funFact": "IFEMAの屋内パビリオン群をパドックやチームホスピタリティ施設、観客ラウンジとして活用する、完全天候対応型の画期的なF1拠点となっています。",
  "linkSubTab": "circuits",
  "sourceAttribution": {
    "title": "Madrid F1 Grand Prix Official Venue Specifications",
    "archiveNote": "IFEMA Madrid & F1 Official Press Release"
  }
},
{
  "id": "quiz-2026-audi-entry",
  "difficulty": "beginner",
  "category": "history",
  "format": "standard",
  "categoryLabel": "🏛️ 2026新グリッド",
  "formatLabel": "🇩🇪 新ワークス参戦",
  "question": "2026年にスイスの名門ザウバーを買収し、完全自社製パワーユニットを搭載してF1に新規ワークス参戦するドイツの自動車メーカーは？",
  "options": [
    "アウディ（Audi）",
    "ポルシェ（Porsche）",
    "BMW",
    "フォルクスワーゲン（Volkswagen）"
  ],
  "correctIndex": 0,
  "explanation": "正解は「アウディ（Audi）」です！ドイツ・ノイブルクに専用のPUファクトリーを建設し、スイス・ヒンウィルのザウバーを完全子会社化して「Audi Revolut F1 Team」としてF1の頂点に挑みます。",
  "funFact": "エースドライバーにはドイツ出身のベテラン・ニコ・ヒュルケンベルグ、僚機にはF3・F2王者ガブリエル・ボルトレートが起用されています。",
  "linkSubTab": "drivers",
  "sourceAttribution": {
    "title": "Audi F1 Project Official Milestones & Factory Rollout",
    "archiveNote": "Audi AG Corporate Communications"
  }
},
{
  "id": "quiz-2026-cadillac-entry",
  "difficulty": "intermediate",
  "category": "history",
  "format": "standard",
  "categoryLabel": "🏛️ 2026新グリッド",
  "formatLabel": "🇺🇸 第11の新チーム",
  "question": "2026年より「第11のF1チーム」として念願のグリッド入りを果たした、GM（ゼネラルモーターズ）傘下のアメリカン・レーシングチームは？",
  "options": [
    "キャデラックF1チーム（Cadillac Formula 1 Team）",
    "フォード・パフォーマンスF1",
    "シボレー・コルベットF1",
    "ペンスキー・レーシング"
  ],
  "correctIndex": 0,
  "explanation": "正解は「キャデラックF1チーム」です！長年の参入交渉を経てFIAおよびFOMの正式認可を受け、2026年より22台が並ぶ待望の11番目の新チームとしてグリッドに加わりました。",
  "funFact": "ドライバーには実績十分のベテランコンビ、セルジオ・ペレスとバルテリ・ボッタスを迎え、初年度からポイント獲得を狙います。",
  "linkSubTab": "drivers",
  "sourceAttribution": {
    "title": "Cadillac Formula 1 Entry Approval & 11th Team Ratification",
    "archiveNote": "FIA Official Bulletin 2025"
  }
},
{
  "id": "quiz-2026-aston-honda",
  "difficulty": "intermediate",
  "category": "history",
  "format": "standard",
  "categoryLabel": "🏛️ 2026新グリッド",
  "formatLabel": "🇯🇵 ホンダ完全ワークス",
  "question": "2026年新規定に合わせて「完全ワークス体制」の独占パートナーシップを結んだ、アストンマーティンと日本のパワーユニット製造企業は？",
  "options": [
    "ホンダ（Honda Racing Corporation / HRC）",
    "トヨタ（TOYOTA GAZOO Racing）",
    "日産（NISMO）",
    "スバル（STI）"
  ],
  "correctIndex": 0,
  "explanation": "正解は「ホンダ（HRC）」です！アストンマーティンは2026年よりホンダの完全ワークスPU「RA626H」の独占供給を受け、天才空力デザイナーのエイドリアン・ニューウェイとともに世界タイトルを目指します。",
  "funFact": "マクラーレン・ホンダ時代に苦闘を共にしたフェルナンド・アロンソが、成熟した最強体制で再びホンダPUとタッグを組むことでも世界中の熱狂を集めています。",
  "linkSubTab": "drivers",
  "sourceAttribution": {
    "title": "Aston Martin Aramco & Honda Works Partnership 2026 Announcement",
    "archiveNote": "Honda Motor Co., Ltd. & Aston Martin F1 Press Conference"
  }
}
];
