'use client';

/**
 * app/knowledge/glossary/[id]/page.tsx
 * Dedicated Standalone Page for Individual F1 Glossary Terms
 * e.g. /knowledge/glossary/undercut
 * Supports direct links, bookmarking, and multi-window side-by-side comparison.
 */

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GLOSSARY_TERMS } from '@/data/f1GlossaryData';
import GlossaryDetailView from '@/components/glossary/GlossaryDetailView';

export default function GlossaryTermPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id.toLowerCase() : '';

  const term = GLOSSARY_TERMS.find(
    (t) =>
      t.id.toLowerCase() === id ||
      t.term.toLowerCase().includes(id) ||
      t.englishTerm.toLowerCase().includes(id)
  );

  if (!term) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="glass-card bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <div className="text-4xl">🔍</div>
          <h2 className="text-xl font-racing font-bold text-white">
            用語が見つかりませんでした
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            指定された用語ID: 「{id}」
          </p>
          <button
            type="button"
            onClick={() => router.push('/?hub=knowledge')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-racing font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            F1 用語辞典・大百科へ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 flex flex-col">
      <GlossaryDetailView
        term={term}
        onBack={() => {
          if (typeof window !== 'undefined' && window.opener) {
            window.close();
          } else {
            router.push('/?hub=knowledge');
          }
        }}
      />
    </div>
  );
}
