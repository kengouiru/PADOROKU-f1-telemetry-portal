'use client';

/**
 * components/glossary/GlossaryVisualDiagram.tsx
 * Reusable animated & styled SVG/visual diagrams for key F1 concepts:
 * - Undercut / Overcut
 * - DRS mechanism
 * - Slipstream vs Dirty Air
 * - Porpoising (Ground Effect)
 * - Degradation & The Cliff
 * - Apex & Bottom Speed
 * - Telemetry Traces
 */

import React from 'react';

export interface GlossaryVisualDiagramProps {
  visualType?: string;
}

export default function GlossaryVisualDiagram({ visualType }: GlossaryVisualDiagramProps) {
  if (visualType === 'undercut') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-amber-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-amber-400 flex items-center gap-1.5">
            <span>📊</span>
            <span>アンダーカット逆転のメカニズム図解</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Lap N 〜 Lap N+1</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-3 text-xs">
          {/* Machine A (Stay out) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-300">マシン A（ステイアウト / 古タイヤ走行）</span>
              <span className="text-red-400 font-mono">ペース低下: +1.5秒/周</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 relative overflow-hidden flex items-center">
              <div className="h-full bg-red-500/70 rounded-full w-[65%]" />
              <span className="absolute right-2 text-[9px] text-slate-400">翌周ピットインへ</span>
            </div>
          </div>

          {/* Machine B (Undercut) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-400">マシン B（1周早くピットイン / 新品タイヤ投入）</span>
              <span className="text-emerald-400 font-mono font-bold">アウトラップ激走: -1.8秒</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 relative overflow-hidden flex items-center">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full w-[90%]" />
              <span className="absolute right-2 text-[9px] text-emerald-300 font-bold">ピット出口で鼻先を押さえて逆転！</span>
            </div>
          </div>

          {/* Track Delta Outcome */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-300">
            <span className="text-base">🏁</span>
            <div>
              <strong className="text-amber-300">成功の鍵：</strong>
              <span>新品タイヤの「アウトラップ1周の爆発的グリップ差」がピット作業ロスタイムを上回ることで成立します。</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'overcut') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-sky-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-sky-400 flex items-center gap-1.5">
            <span>📊</span>
            <span>オーバーカット成立のメカニズム図解</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">クリアエア活用型</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-bold">相手: アウトラップで冷えたタイヤに苦戦 (+2.0秒)</span>
            <span className="text-red-400 font-mono font-bold">ウォームアップ遅延</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-sky-300 font-bold">自分: コース上で前が空き、クリーンエアで全開アタック</span>
            <span className="text-sky-400 font-mono font-bold">高速ラップ連発</span>
          </div>
          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
            <strong className="text-sky-300">有効な場面：</strong> モナコ市街地など抜きにくく、かつタイヤが長持ちするコースで劇的な効果を発揮します。
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'drs') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-emerald-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-emerald-400 flex items-center gap-1.5">
            <span>💨</span>
            <span>DRS作動メカニズム図解</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">最高速 +15〜20 km/h</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300">1. 検知地点（Detection Point）</span>
            <span className="text-amber-400 font-mono font-bold">前走車との差 &lt; 1.0秒</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-400">2. 作動区間（Activation Zone）</span>
            <span className="text-emerald-400 font-mono font-bold">リアウィングフラップ開口（85mm）</span>
          </div>
          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
            <span className="text-base">🚀</span>
            <span>空気抵抗（ドラッグ）が急減し、ストレートエンドで強力なオーバーテイクが可能になります。</span>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'slipstream') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-indigo-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-indigo-400 flex items-center gap-1.5">
            <span>🏎️💨🏎️</span>
            <span>スリップストリーム（トウ）気流図解</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">牽引効果</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 text-[11px] text-slate-300 leading-relaxed font-mono">
            [前走車] ===(高気圧の壁を切る)==&gt; [真後ろ: 低気圧の真空ポケット] &lt;===[後続車が吸い込まれ急加速！]
          </div>
          <div className="text-[11px] text-slate-400">
            ストレートで同じパワーユニットでも時速10〜15km/hの速度ゲインを獲得できます。
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'dirty-air') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-red-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-red-400 flex items-center gap-1.5">
            <span>🌪️</span>
            <span>ダーティエア（乱気流）の影響図解</span>
          </span>
          <span className="text-[10px] text-red-300 font-mono">ダウンフォース -30%</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
          <div className="text-[11px] text-slate-300">
            前走車の後方に発生する渦巻く乱気流により、後続車のフロントウイングが失速。
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-red-400">① コーナーで滑り曲がらない</span>
            <span className="text-amber-400">② タイヤ表面が過熱（オーバーヒート）</span>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'porpoising') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-purple-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-purple-400 flex items-center gap-1.5">
            <span>🐬</span>
            <span>ポーパシング（空力振動）のサイクル</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">グラウンドエフェクト</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 text-[11px] text-slate-300 leading-relaxed font-mono">
            高速走行 ➔ 床下吸引で車高低下 ➔ 気流が塞がれ失速 ➔ ダウンフォース喪失で車高浮上 ➔ 再び吸引...（連続バウンド！）
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'degradation') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-yellow-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-yellow-400 flex items-center gap-1.5">
            <span>📉</span>
            <span>タイヤデグラデーション＆クリフ（崖）</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">熱ダレ vs 摩耗</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-yellow-300">初期〜中期: リニアな劣化 (+0.05〜0.1秒/周)</span>
            <span className="text-slate-400 font-mono">マネジメント領域</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-red-400 font-bold">限界点到達: 「ザ・クリフ」（1周で2秒急落！）</span>
            <span className="text-red-400 font-mono font-bold">即ピットイン必須</span>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'apex') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-cyan-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-cyan-400 flex items-center gap-1.5">
            <span>📐</span>
            <span>エイペックス＆ボトムスピードの相関図</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">幾何学的頂点 vs レーシング頂点</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300">① ターンイン（進入）:</span>
            <span className="text-amber-400 font-mono">トレイルブレーキングでノーズを入れる</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-cyan-300 font-bold">② エイペックス（クリップ）:</span>
            <span className="text-cyan-400 font-mono font-bold">最低速度（ボトムスピード）の極小点</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-300">③ 脱出（イグジット）:</span>
            <span className="text-emerald-400 font-mono">スロットル100%全開＋トラクション</span>
          </div>
          <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
            <strong className="text-cyan-300">テレメトリーの見方：</strong> 速度グラフがV字の谷になる最下点が「ボトムスピード」。谷が浅く（速度が高く）、谷からの立ち上がりが鋭いドライバーがタイムを削っています。
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'telemetry') {
    return (
      <div className="bg-slate-950/80 rounded-2xl border border-blue-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-racing font-bold text-blue-400 flex items-center gap-1.5">
            <span>📈</span>
            <span>テレメトリートレースの読み解き方</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Speed / Throttle / Brake / Delta</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-blue-300 font-bold">Speed（車速）:</span>
            <span className="text-slate-300">最高速（DRS効果）と最低速（コーナリング）の差</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-300 font-bold">Throttle（アクセル）:</span>
            <span className="text-slate-300">コーナー脱出でいち早く100%まで踏み込めているか</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-red-400 font-bold">Brake（ブレーキ）:</span>
            <span className="text-slate-300">踏み始め位置の奥深さと、離し際のスムーズさ</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-purple-300 font-bold">Delta（タイム差）:</span>
            <span className="text-slate-300">上向き（+）で相手がリード、下向き（-）で優勢</span>
          </div>
        </div>
      </div>
    );
  }

  // Default schematic banner
  return (
    <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
      <span className="text-base">🏁</span>
      <span>F1公式テクニカル・スポーティングレギュレーションおよび実戦戦略に基づく用語解説です。</span>
    </div>
  );
}
