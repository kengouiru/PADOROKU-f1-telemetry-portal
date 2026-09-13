import { NextResponse } from 'next/server';
import { createGenerationBackup, createNewsSnapshotBackup, getBackupManifest } from '@/lib/knowledgeBackupService';
import { KNOWLEDGE_TEAMS, KNOWLEDGE_CIRCUITS } from '@/data/f1KnowledgeData';
import { REGULATION_ARTICLES } from '@/data/f1RegulationsData';
import { QUIZ_QUESTIONS } from '@/data/f1QuizData';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.target || 'knowledge';

    if (target === 'knowledge' || target === 'all') {
      const manifest = createGenerationBackup({
        teams: KNOWLEDGE_TEAMS,
        circuits: KNOWLEDGE_CIRCUITS,
        quizQuestions: QUIZ_QUESTIONS,
        regulations: REGULATION_ARTICLES,
      });

      return NextResponse.json({
        success: true,
        message: '最新の知識ベース・スナップショットを生成し、直前世代へローテーション退避しました。',
        manifest,
      });
    }

    return NextResponse.json({ success: false, message: '不明なバックアップ対象です。' }, { status: 400 });
  } catch (error) {
    console.error('[Backup Create POST Error]:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
