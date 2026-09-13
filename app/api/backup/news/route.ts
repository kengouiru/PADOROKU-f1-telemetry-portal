import { NextResponse } from 'next/server';
import { createNewsSnapshotBackup, getBackupManifest } from '@/lib/knowledgeBackupService';

export async function GET() {
  try {
    const manifest = getBackupManifest();
    return NextResponse.json({
      success: true,
      newsSnapshot: manifest?.newsSnapshot || null,
      stats: manifest?.stats || null,
    });
  } catch (error) {
    console.error('[News Backup GET Error]:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const articles = body.articles || [];

    const result = createNewsSnapshotBackup(articles);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[News Backup POST Error]:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
