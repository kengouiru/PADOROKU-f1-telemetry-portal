import { NextResponse } from 'next/server';
import { executeRollback, getRollbackStatus } from '@/lib/knowledgeBackupService';

export async function GET() {
  try {
    const status = getRollbackStatus();
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error('[Rollback GET Error]:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.target || 'all';

    const result = executeRollback(target);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('[Rollback POST Error]:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
