'use client';

/**
 * app/knowledge/drivers/[code]/page.tsx
 * Dedicated Standalone Page for F1 Driver Profile & Encyclopedia
 * Provides direct URL permalink (e.g. /knowledge/drivers/SAI), full browser navigation,
 * multi-window comparison (Ctrl+Click), and rich telemetry/history integration.
 */

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { KNOWLEDGE_DRIVERS, KNOWLEDGE_TEAMS } from '@/data/f1KnowledgeData';
import { DriverDetailView } from '@/components/hubs/DriverDetailModal';

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();

  const codeParam = typeof params?.code === 'string' ? params.code.toUpperCase() : 'VER';

  const driver = useMemo(() => {
    return (
      KNOWLEDGE_DRIVERS.find((d) => d.code.toUpperCase() === codeParam) ||
      KNOWLEDGE_DRIVERS.find((d) => d.id.toLowerCase() === codeParam.toLowerCase()) ||
      null
    );
  }, [codeParam]);

  if (!driver) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="glass-card bg-slate-900/90 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <span className="text-4xl">🏎️</span>
          <h1 className="text-xl font-racing font-bold text-white">ドライバーが見つかりませんでした</h1>
          <p className="text-xs text-slate-400 font-mono">
            指定されたコード &quot;{codeParam}&quot; のドライバー情報は存在しないか、移動した可能性があります。
          </p>
          <div className="pt-2">
            <Link
              href="/?hub=knowledge&subTab=drivers"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing text-xs font-bold transition-all shadow-md"
            >
              <span>◀</span>
              <span>ドライバー名鑑トップへ戻る</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 flex flex-col">
      <DriverDetailView
        driver={driver}
        allDrivers={KNOWLEDGE_DRIVERS}
        onSelectDriver={(nextDriver) => {
          router.push(`/knowledge/drivers/${nextDriver.code}`);
        }}
        onSelectTeamDetail={(teamQuery) => {
          const lowerQuery = teamQuery.toLowerCase();
          const matchedTeam = KNOWLEDGE_TEAMS.find(
            (t) =>
              t.id.toLowerCase() === lowerQuery ||
              t.name.toLowerCase().includes(lowerQuery) ||
              lowerQuery.includes(t.id.toLowerCase())
          );
          if (matchedTeam) {
            router.push(`/knowledge/teams/${matchedTeam.id}`);
          }
        }}
        onNavigateToTelemetry={(target) => {
          const query = target?.targetDriver ? `?driver=${target.targetDriver}` : '';
          router.push(`/${query}`);
        }}
        onCompareDriver={(code) => {
          router.push(`/?hub=knowledge&subTab=drivers&mode=compare&d1=${code}`);
        }}
        onClose={() => {
          if (typeof window !== 'undefined' && window.opener) {
            window.close();
          } else {
            router.push('/?hub=knowledge&subTab=drivers');
          }
        }}
      />
    </div>
  );
}
