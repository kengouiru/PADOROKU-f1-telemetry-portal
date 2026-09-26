'use client';

/**
 * app/knowledge/circuits/[id]/page.tsx
 * Dedicated Standalone Page for F1 Circuit Specification & Encyclopedia
 * Provides direct URL permalink (e.g. /knowledge/circuits/suzuka), full browser navigation,
 * multi-window comparison (Ctrl+Click), and rich historical/engineering telemetry integration.
 */

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { KNOWLEDGE_CIRCUITS } from '@/data/f1KnowledgeData';
import { CircuitDetailView } from '@/components/hubs/CircuitDetailModal';

export default function CircuitDetailPage() {
  const params = useParams();
  const router = useRouter();

  const idParam = typeof params?.id === 'string' ? params.id.toLowerCase() : 'suzuka';

  const circuit = useMemo(() => {
    return (
      KNOWLEDGE_CIRCUITS.find((c) => c.id.toLowerCase() === idParam) ||
      KNOWLEDGE_CIRCUITS.find(
        (c) =>
          c.name.toLowerCase().includes(idParam) ||
          idParam.includes(c.id.toLowerCase())
      ) ||
      null
    );
  }, [idParam]);

  if (!circuit) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="glass-card bg-slate-900/90 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <span className="text-4xl">🏁</span>
          <h1 className="text-xl font-racing font-bold text-white">サーキットが見つかりませんでした</h1>
          <p className="text-xs text-slate-400 font-mono">
            指定されたサーキットID &quot;{idParam}&quot; は存在しないか、移動した可能性があります。
          </p>
          <div className="pt-2">
            <Link
              href="/?hub=knowledge&subTab=circuits"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing text-xs font-bold transition-all shadow-md"
            >
              <span>◀</span>
              <span>サーキット一覧トップへ戻る</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 flex flex-col">
      <CircuitDetailView
        circuit={circuit}
        allCircuits={KNOWLEDGE_CIRCUITS}
        onSelectCircuit={(nextCircuit) => {
          router.push(`/knowledge/circuits/${nextCircuit.id}`);
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
            router.push('/?hub=knowledge&subTab=circuits');
          }
        }}
      />
    </div>
  );
}
