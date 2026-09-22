'use client';

import React from 'react';
import { XCircle, BookOpen } from 'lucide-react';
import type { GlossaryTerm } from '@/data/f1GlossaryData';

interface IntelGlossaryModalProps {
  selectedIntelTerm: GlossaryTerm | null;
  onClose: () => void;
  onNavigateToLibrary?: (subTab: string, termId?: string) => void;
}

export const IntelGlossaryModal: React.FC<IntelGlossaryModalProps> = ({
  selectedIntelTerm,
  onClose,
  onNavigateToLibrary,
}) => {
  if (!selectedIntelTerm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-lg w-full glass-card-premium p-5 rounded-2xl border-2 border-red-500/60 shadow-2xl space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-[10px] font-mono text-red-300">
                {selectedIntelTerm.categoryLabel || '⛽ 戦略'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedIntelTerm.englishTerm}
              </span>
            </div>
            <h3 className="font-racing font-bold text-white text-lg mt-1">
              {selectedIntelTerm.term}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-xs leading-relaxed space-y-2">
          <p className="font-bold text-white">{selectedIntelTerm.summary}</p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {selectedIntelTerm.description}
          </p>
          {selectedIntelTerm.realExample && (
            <div className="p-2 rounded bg-slate-950 text-[11px] text-amber-300 font-mono">
              実例: {selectedIntelTerm.realExample}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-console text-xs px-3 py-1.5 text-slate-300"
          >
            閉じる
          </button>
          {onNavigateToLibrary && (
            <button
              type="button"
              onClick={() => {
                const termId = selectedIntelTerm.id;
                onClose();
                onNavigateToLibrary('glossary', termId);
              }}
              className="btn-console-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" /> F1大百科で詳しく学ぶ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
