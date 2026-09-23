'use client';

import React from 'react';
import { X, HelpCircle, BookOpen, AlertCircle, Zap, Shield, Flag } from 'lucide-react';

export type BriefingHelpTopic =
  | 'start_tyre'
  | 'pit_strategy'
  | 'pu_mode'
  | 'race_distance'
  | 'ai_difficulty'
  | 'user_assist';

interface BriefingSettingHelpModalProps {
  topic: BriefingHelpTopic | null;
  onClose: () => void;
}

export const BriefingSettingHelpModal: React.FC<BriefingSettingHelpModalProps> = ({
  topic,
  onClose,
}) => {
  if (!topic) return null;

  const contentMap: Record<
    BriefingHelpTopic,
    {
      title: string;
      category: string;
      icon: string;
      headline: string;
      points: { label: string; text: string; color?: string }[];
      regulationNote?: string;
    }
  > = {
    start_tyre: {
      title: 'スタートタイヤの戦術とコンパウンド特性',
      category: 'FIA SPORTING REGULATIONS & TYRE PHYSICS',
      icon: '🛞',
      headline: 'スタート直後の蹴り出しグリップと、スティント全体の寿命を左右する極めて重要な決定です。',
      points: [
        {
          label: '🔴 SOFT (赤)',
          text: '最大グリップでオープニングラップの蹴り出し・順位上げに最適。ただし摩耗ペースが極めて速く、数周で性能が崖のように落ちる「タイヤクリフ」を迎えます。',
          color: 'text-red-400',
        },
        {
          label: '🟡 MEDIUM (黄)',
          text: '最もバランスの取れた王道コンパウンド。雨の接近や突発セーフティカーなど、レース展開の不確実性に対して最も柔軟に対応できます。',
          color: 'text-amber-400',
        },
        {
          label: '⚪ HARD (白)',
          text: '長寿命・高耐久。序盤を我慢してライバルがピットインした後のクリーンエアで逆転を狙う「オーバーカット」や、雨待ちステイアウトに最適です。',
          color: 'text-slate-200',
        },
        {
          label: '🟢 INTERMEDIATE (緑)',
          text: '小雨〜ウェット路面（水深0.8〜4.0mm）用。ドライ路面で走ると溝のブロックが発熱・変形し、あっという間に熱破壊されます。',
          color: 'text-emerald-400',
        },
        {
          label: '🔵 FULL WET (青)',
          text: '豪雨・スタンディングウォーター（水深3.5mm以上）用。大量の排水能力を持ち、ハイドロプレーニングを防止します。',
          color: 'text-cyan-400',
        },
      ],
      regulationNote: 'FIA規則第30.5条: ドライレースでは、決勝レース中に必ず「2種類以上の異なるスリックコンパウンド」を使用しなければなりません（不履行は失格処分）。',
    },
    pit_strategy: {
      title: 'ピットストップ戦略とアンダーカット／オーバーカット',
      category: 'PIT STOP STRATEGY & TRACK POSITION',
      icon: '⏱️',
      headline: 'コース上で抜けない現代F1において、ピット戦略はレースの勝敗を決める最大の武器です。',
      points: [
        {
          label: '⚡ アンダーカット (Undercut)',
          text: '前走車より1周早くピットインし、新品タイヤの圧倒的グリップでインラップ・アウトラップを猛プッシュ。相手が翌周ピットに入った隙に順位を奪い取る王道の急襲戦術です。',
          color: 'text-cyan-400',
        },
        {
          label: '🛡️ オーバーカット (Overcut)',
          text: '相手が先にピットへ入った後、前が開けたクリーンエアの中でタイヤの残存グリップを全て引き出して最速タイムを記録。ピット出口で前に出る戦術（モナコなど抜きにくいコースで有効）。',
          color: 'text-amber-400',
        },
        {
          label: '🚨 セーフティカー (SC) チープピット',
          text: 'SC中はコース上の全車が規定タイムで徐行するため、ピットインによる実質タイムロスが通常の半分（約11秒）に圧縮されます。「タダ同然で新品タイヤを履ける」絶好のチャンスです。',
          color: 'text-red-400',
        },
        {
          label: '⚠️ ダブルスタックのリスク',
          text: 'チームの2台が同一周回で同時にピットインすると、2台目のマシンに約+4.5秒のピットボックス作業待機ロスが発生します。2台の間隔が3秒未満の時は片方をステイアウトさせる判断も必要です。',
          color: 'text-purple-400',
        },
      ],
      regulationNote: 'ピットレーン制限速度（多くのコースで80km/h、モナコ等で60km/h）と停止作業時間（約2.0〜2.8秒）を合わせたピットロスタイムを計算してウィンドウを見極めましょう。',
    },
    pu_mode: {
      title: 'パワーユニット (PU) エンジンモードと電力マネジメント',
      category: 'POWER UNIT & HYBRID ENERGY SYSTEM',
      icon: '⚡',
      headline: 'エンジン出力とERS（ハイブリッドバッテリー）の充放電バランスを司る制御マップです。',
      points: [
        {
          label: '⚡ PUSH (猛攻モード)',
          text: 'PU最大パワー解放！ラップタイムが約 -0.35秒短縮。ただしバッテリーSOCが毎周約14%激減し、タイヤ表面温度が+2.5℃上昇。攻めすぎるとトラックリミット逸脱警告のリスクが高まります。',
          color: 'text-rose-400',
        },
        {
          label: '🏎️ STD (標準巡航モード)',
          text: '最もバランスの取れた標準マッピング。ストレートでの電力ブーストとブレーキング時のエネルギー回生（MGU-K）が均衡し、安定したペースで走行を維持します。',
          color: 'text-cyan-400',
        },
        {
          label: '🌱 SAVE (省エネ・保護モード)',
          text: 'リフト＆コースト（コーナー手前で早めにアクセルを抜く）運転を指示。ラップタイムは約 +0.45秒低下しますが、バッテリーSOCが急速回生（毎周+18%）し、過熱したタイヤ表面を冷却できます。',
          color: 'text-emerald-400',
        },
      ],
      regulationNote: '※レース中いつでもコクピットの「ENGINE」ボタンから切り替え可能です。レース中のモード変更は次周（Next Lap）から滑らかに適用されます。',
    },
    race_distance: {
      title: 'レース展開・指揮フェーズと時間加速',
      category: 'RACE COMMAND PHASE & SIMULATION SCOPE',
      icon: '🏁',
      headline: 'シナリオやミッションでは、レース途中からピットウォール指揮を引き継ぎ、チェッカーまでの熱戦を体験します。',
      points: [
        {
          label: '🏎️ 決勝レース終盤介入 (シナリオ)',
          text: 'グランプリの勝負所（残り6〜9周）からピットウォール指揮を受け持ちます。天候急変やセーフティカー、タイヤクリフの攻防など、最も戦略判断が問われる局面をダイレクトに体験できます。',
          color: 'text-cyan-400',
        },
        {
          label: '🎯 特務ミッション (限定周回)',
          text: '「最後尾からの入賞」「タイヤ無交換で残り周回を防衛」など、限られた周回数で特定の過酷な作戦目標をクリアする特別シナリオです。',
          color: 'text-purple-400',
        },
        {
          label: '⚡ リアル1.0x物理 ＆ 時間加速機能',
          text: '不自然な摩耗圧縮（3.2倍等）を行わず、本物のF1物理演算（1.0x）でシミュレーション。プレイ中は1x〜20xの高速倍速と重要局面での自動ポーズで、快適かつ本格的に指揮できます。',
          color: 'text-emerald-400',
        },
      ],
      regulationNote: '※レース途中からの指揮引き継ぎシナリオでは、不自然な失格判定を防ぐため、状況に応じた柔軟なFIA規則判定が行われます。',
    },
    ai_difficulty: {
      title: 'AIライバルの思考難易度とトロフィー',
      category: 'ARTIFICIAL INTELLIGENCE & REWARD TIERS',
      icon: '🤖',
      headline: '対戦するグリッド21台のAIドライバーたちの戦術知能と反応速度を設定します。',
      points: [
        {
          label: '🌱 初級 (Beginner)',
          text: '天候急変やSCに対するAIのピット反応が1〜2周遅れます。ピットタイミングの基本を学ぶのに最適です（クリア時: 🥉 銅トロフィー対象）。',
          color: 'text-emerald-400',
        },
        {
          label: '🏎️ 標準 (Standard)',
          text: 'F1公式の標準的なストラテジストAI。天候レーダーを適切に読み、通常のピットウィンドウを遵守します（クリア時: 🥈 銀トロフィー対象）。',
          color: 'text-blue-400',
        },
        {
          label: '🏆 達人 (Master)',
          text: 'プレイヤーがピットに入った瞬間にアンダーカット防衛ピットを打ち、DRSトレインを組み、タイヤクリフを極限で見極める最高峰AI（クリア時: 🏆 金トロフィー確定！）。',
          color: 'text-purple-400',
        },
      ],
      regulationNote: '※初級や標準でも、レース結果でP1（優勝）を獲得した場合は自動的に🏆金トロフィーが付与されます。',
    },
    user_assist: {
      title: '操作アシストモード (ガイダンスの有無)',
      category: 'TELEMETRY ASSISTANCE & COCKPIT HUD',
      icon: '🔰',
      headline: 'ピットウォール計器類（M1〜M5）に対するAIサポートの有無を選択します。',
      points: [
        {
          label: '🔰 アシストあり (Assisted)',
          text: '「雨雲接近」「SC導入」「DRS射程突入」などの重要イベント発生時、画面上部に注視すべきモニター（例: M3 天候レーダー、M5 トラフィック等）を案内するガイダンスバナーが表示されます。',
          color: 'text-emerald-400',
        },
        {
          label: '🎯 エキスパート (Expert)',
          text: 'アシストバナーやヒントを一切非表示にし、自らのテレメトリー分析と直感のみでピットウォールを指揮する本格ストラテジスト向けモードです。',
          color: 'text-cyan-400',
        },
      ],
      regulationNote: '※レース中いつでも設定変更可能です。初めてプレイするコースや天候変化シナリオでは「アシストあり」が推奨されます。',
    },
  };

  const current = contentMap[topic];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-white/20 shadow-2xl p-5 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{current.icon}</span>
            <div>
              <div className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
                {current.category}
              </div>
              <h3 className="font-racing font-bold text-white text-base">
                {current.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Headline */}
        <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-white/5 text-xs text-slate-300 font-medium leading-relaxed">
          {current.headline}
        </div>

        {/* Bullet Points */}
        <div className="mt-4 space-y-2.5">
          {current.points.map((p, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1"
            >
              <div className={`font-racing font-bold text-xs ${p.color || 'text-white'}`}>
                {p.label}
              </div>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                {p.text}
              </p>
            </div>
          ))}
        </div>

        {/* Regulation / Pro-Tip Alert Box */}
        {current.regulationNote && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2 text-xs font-mono text-amber-200/90 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{current.regulationNote}</span>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-console-primary px-5 py-2 text-xs font-racing font-bold cursor-pointer"
          >
            理解した (閉じる)
          </button>
        </div>
      </div>
    </div>
  );
};
