'use client';

/**
 * app/knowledge/teams/[id]/page.tsx
 * Dedicated Standalone Page for F1 Team Lineage & Technical Specifications
 * Provides direct URL permalink (e.g. /knowledge/teams/williams), full browser navigation,
 * multi-window comparison (Ctrl+Click), and rich historical/engineering integration.
 */

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { KNOWLEDGE_TEAMS } from '@/data/f1KnowledgeData';
import { TeamDetailView } from '@/components/hubs/TeamDetailModal';

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();

  const idParam = typeof params?.id === 'string' ? params.id.toLowerCase() : 'mercedes';

  const team = useMemo(() => {
    return (
      KNOWLEDGE_TEAMS.find((t) => t.id.toLowerCase() === idParam) ||
      KNOWLEDGE_TEAMS.find(
        (t) =>
          t.name.toLowerCase().includes(idParam) ||
          idParam.includes(t.id.toLowerCase())
      ) ||
      null
    );
  }, [idParam]);

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="glass-card bg-slate-900/90 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <span className="text-4xl">🏁</span>
          <h1 className="text-xl font-racing font-bold text-white">チームが見つかりませんでした</h1>
          <p className="text-xs text-slate-400 font-mono">
            指定されたチームID &quot;{idParam}&quot; は存在しないか、移動した可能性があります。
          </p>
          <div className="pt-2">
            <Link
              href="/?hub=knowledge&subTab=teams"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing text-xs font-bold transition-all shadow-md"
            >
              <span>◀</span>
              <span>チーム名鑑トップへ戻る</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 flex flex-col">
      <TeamDetailView
        team={team}
        allTeams={KNOWLEDGE_TEAMS}
        onSelectTeam={(nextTeam) => {
          router.push(`/knowledge/teams/${nextTeam.id}`);
        }}
        onSelectDriverDetail={(driverCode) => {
          router.push(`/knowledge/drivers/${driverCode.toUpperCase()}`);
        }}
        onNavigateToTelemetry={(target) => {
          const d1 = target?.targetDriver ? `&d1=${target.targetDriver}` : '';
          const d2 = target?.targetDriver2 ? `&d2=${target.targetDriver2}` : '';
          router.push(`/?hub=telemetry${d1}${d2}`);
        }}
        onClose={() => {
          if (typeof window !== 'undefined' && window.opener) {
            window.close();
          } else {
            router.push('/?hub=knowledge&subTab=teams');
          }
        }}
      />
    </div>
  );
}
