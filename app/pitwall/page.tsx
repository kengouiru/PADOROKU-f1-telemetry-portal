'use client';

/**
 * app/pitwall/page.tsx
 * 🏎️ Dedicated Standalone Full-Screen F1 Pitwall Tactical Game Application
 *
 * An independent, distraction-free gaming environment for F1 Pitwall Command Room:
 * - 100% full PC screen coverage (F11 native fullscreen support)
 * - Zero portal banners or sidebars
 * - Seamless return to F1 Portal and 1-click external library research
 */

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import PitwallProModal from '@/components/subscription/PitwallProModal';
import { Gamepad2, ArrowLeft, BookOpen } from 'lucide-react';

const RaceSimulatorHub = dynamic(() => import('@/components/hubs/RaceSimulatorHub'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        <span className="font-mono text-xs text-slate-400">PITWALL コックピット起動中...</span>
      </div>
    </div>
  ),
});

export default function StandalonePitwallPage() {
  const [proModalOpen, setProModalOpen] = useState(false);

  // Automatically maximize window to full screen dimensions on launch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.moveTo(0, 0);
        window.resizeTo(window.screen.availWidth, window.screen.availHeight);
      } catch (_) {}
    }
  }, []);

  const handleReturnToPortal = () => {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = '/';
    }
  };

  const handleOpenLibrary = (subTab: string = 'tyres') => {
    window.open(`/?hub=knowledge&subTab=${subTab}`, '_blank');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden text-slate-100 select-none">
      {/* ── Main Gaming Stage (Maximized direct full-screen immersion) ── */}
      <main className="flex-1 overflow-y-auto relative p-1.5 sm:p-2 scrollbar-thin">
        <ErrorBoundary sectionName="F1 PITWALL スタンドアロンゲーム">
          <RaceSimulatorHub
            standaloneMode={true}
            onReturnToPortal={handleReturnToPortal}
            onOpenUpgradeModal={() => setProModalOpen(true)}
            onNavigateToLibrary={(subTab) => handleOpenLibrary(subTab)}
          />
        </ErrorBoundary>
      </main>

      {/* ── Pro Membership Modal ── */}
      <PitwallProModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
      />
    </div>
  );
}
