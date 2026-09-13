'use client';

import React, { useState } from 'react';

export interface FeatureItem {
  id: string;
  category: 'new' | 'telemetry' | 'knowledge' | 'ai';
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  summary: string;
  reviewPoints: string[];
  locationHint: string;
  actionText: string;
}

export const ALL_FEATURES: FeatureItem[] = [
  // ── 注目新機能 (レビュー対象) ──
  {
    id: 'virtual_gp',
    category: 'new',
    title: '模擬レースシミュレーター Pro (Virtual Grand Prix)',
    badge: '注目 No.1 / 模擬レース Pro',
    badgeColor: 'bg-gradient-to-r from-amber-500/30 to-yellow-400/30 text-amber-300 border-amber-500/40',
    icon: '🏎️',
    summary: '複数台グリッド同時対戦、周回別ピット戦略・タイヤ選択、突然の降雨やセーフティカー（SC）出動をリアルタイム演算する高度なレースシミュレーター。Rechartsギャップチャート＆Gemini AIによる戦術総括付き。',
    reviewPoints: [
      '【5台グリッド対戦】VER・NOR・TSU・LEC・HAMのベースペースと燃料消費（-0.045s/周）を演算',
      '【動的イベント】突然の降雨（雨量mm/min・インター履き替え）＆ SC出動（ピットロス11秒へ半減）',
      '【Recharts線図】全周回トップ差推移グラフ（Gap to Leader）とリアルタイム順位タワー',
      '【AI戦術デブリーフ】Gemini AIがレース展開・タイヤ作戦の成否・勝因を自動レポート',
    ],
    locationHint: 'テレメトリー＆Live ➔ PIT STRATEGY SIMULATOR ➔ 「🏎️ 模擬レース Pro」タブ',
    actionText: '模擬レース Proを開く',
  },
  {
    id: 'telemetry_delta',
    category: 'new',
    title: 'タイムデルタ(Δt) ＆ コーナー詳細解析（角田裕毅 vs TOP）',
    badge: '注目 No.2 / 独自解析',
    badgeColor: 'bg-sky-600/30 text-sky-300 border-sky-500/40',
    icon: '🏁',
    summary: 'GPS積算タイム差（Δt）折れ線グラフと、全コーナーのエイペックス速度・制動開始点マトリクス。角田裕毅（TSU）とフェルスタッペン/ローソン/ノリスの走りを比較し、Gemini AIによるエンジニアデブリーフを生成。',
    reviewPoints: [
      '【GPS累積デルタ】ラップ進行に伴うタイム差の増減が折れ線グラフで一目瞭然',
      '【コーナー詳細マトリクス】全15コーナーのエイペックス速度とブレーキング開始地点比較',
      '【角田裕毅プリセット】TSU vs VER、TSU vs LAW、TSU vs NOR をワンタップで切り替え',
      '【Gemini AIデブリーフ】テレメトリー数値をチーフレースエンジニアの視点で自動総括',
    ],
    locationHint: 'テレメトリー＆Live ➔ CAR DATA INSPECTOR ➔ 「タイムデルタ(Δt)」タブ',
    actionText: 'タイムデルタ解析室を開く',
  },
  {
    id: 'war_room',
    category: 'new',
    title: '戦術司令室 (Virtual Pitwall War Room)',
    badge: '注目 No.3 / 戦術司令室',
    badgeColor: 'bg-amber-600/30 text-amber-300 border-amber-500/40',
    icon: '🚨',
    summary: '天候雨量・路面温度スライダー、タイヤ劣化カーブ＆タイヤクリフ（崖）探知、セーフティカー/VSC時のピットロスタイム損得計算器（+11秒短縮）を搭載した仮想ピットウォール司令室。',
    reviewPoints: [
      '【天候・温度スライダー】雨量操作でドライからインター/ウェットへのクロスオーバーを検証',
      '【タイヤクリフ探知】デグラデーション急激悪化（タイヤの崖）の周回予測',
      '【SC/VSC損得計算】通常ピット22秒 vs SC時ピット11秒の「フリーピットストップ窓」損得判定',
      '【戦略ジレンマ選択】アンダーカット vs ステイアウトのリアルタイム戦術シミュレーション',
    ],
    locationHint: 'テレメトリー＆Live ➔ PIT STRATEGY SIMULATOR ➔ 「戦術司令室 (War Room)」ボタン',
    actionText: '戦術司令室を開く',
  },
  {
    id: 'fod_news',
    category: 'new',
    title: 'FOD公式中継スケジュール ＆ 一次ソース格付けニュース',
    badge: '注目 No.4 / 公式中継',
    badgeColor: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40',
    icon: '📺',
    summary: 'フジテレビNEXT / FOD公式中継基準の週末全セッション生配信スケジュール表と、一次情報（FIA公式、チーム公式、FOD）格付けバッジ付き最新パドックニュースフィード。',
    reviewPoints: [
      '【FOD中継タイムテーブル】FP1・FP2・FP3・予選・スプリント・決勝の公式配信時刻',
      '【一次ソース権威バッジ】👑 FIA公式、🏎️ チーム公式、📺 FOD、📰 パドックによる信頼度評価',
      '【2世代バックアップ】最新データと前回バックアップの切り替え・復元機構',
    ],
    locationHint: 'レース観戦 ➔ ニュース＆パドック',
    actionText: 'FOD中継＆ニュースを開く',
  },
  {
    id: 'quiz',
    category: 'new',
    title: 'F1検定クイズ（本格実況音声 ＆ FOD公式中継基準）',
    badge: '注目 No.5 / 実況音声',
    badgeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/40',
    icon: '🏆',
    summary: '全4難易度・148問の本格対話型クイズ。迫力あるエンジンエキゾースト・ピット無線エフェクトつき実況音声と、問題文に安易なヒントを含まない真のF1知識を問う厳選設問。',
    reviewPoints: [
      '【迫力の実況音声】スピーカーボタンでエンジン始動音・ピット無線エフェクトつき実況が再生',
      '【FOD公式中継基準】安易な国名ヒントを廃し、鈴鹿・モナコ・スパなどコース特性の本質を問う問題',
      '【4難易度】ビギナー・中級・マニア・超人モードでF1知識を測定',
    ],
    locationHint: 'ヘッダー右上「🏆 クイズ」ボタン',
    actionText: '実況クイズを起動',
  },

  // ── レース分析・テレメトリー ──
  {
    id: 'telemetry_laps',
    category: 'telemetry',
    title: 'テレメトリー・ラップタイム比較',
    badge: 'CORE / テレメトリー',
    badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
    icon: '📊',
    summary: '選択ドライバー間の全周回ラップタイム推移、ペース比較、ファステストラップ表示。',
    reviewPoints: ['ドライバー間のペースの落ち込みやピット後のアウトラップペースを比較'],
    locationHint: 'テレメトリー＆Live ➔ 画面上部メイングラフ',
    actionText: 'ラップ比較を見る',
  },
  {
    id: 'stint_visualizer',
    category: 'telemetry',
    title: '全車タイヤスティント・ピット戦略タイムライン',
    badge: 'CORE / 戦略',
    badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
    icon: '🛞',
    summary: 'グリッド全ドライバーの装着タイヤ（S/M/H/I/W）とピットタイミングをカラー帯で一元可視化。',
    reviewPoints: ['各チームの1ストップ vs 2ストップの戦略差やアンダーカットの成功状況を確認'],
    locationHint: 'テレメトリー＆Live ➔ STINT VISUALIZER セクション',
    actionText: 'スティント一覧を見る',
  },
  {
    id: 'team_radios',
    category: 'telemetry',
    title: 'チーム無線タイムライン ＆ AIリアルタイム文字起こし',
    badge: 'CORE / 音声解析',
    badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
    icon: '🎙️',
    summary: '緊迫のレース中チーム無線を周回順に再生。Gemini AIによる英語無線の日本語翻訳と戦術解説。',
    reviewPoints: ['ドライバーとレースエンジニアの生無線音声とAI日本語翻訳'],
    locationHint: 'テレメトリー＆Live ➔ 画面最下部 TEAM RADIO TIMELINE',
    actionText: 'チーム無線を開く',
  },

  // ── F1大百科・歴史ライブラリ ──
  {
    id: 'drivers',
    category: 'knowledge',
    title: '選手名鑑 (ドライバーハブ)',
    badge: 'LIBRARY / 選手',
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-500/40',
    icon: '👤',
    summary: '2026年現役全22ドライバー＋歴代伝説ドライバーの戦績、ドライビングスタイル、一次出典付きバイオグラフィー。',
    reviewPoints: ['角田裕毅、フェルスタッペン、ハミルトン、アントネッリ等の詳細プロフィール'],
    locationHint: 'F1大百科 ➔ 選手名鑑',
    actionText: '選手名鑑を開く',
  },
  {
    id: 'teams',
    category: 'knowledge',
    title: 'チーム名鑑 (コンストラクター＆PU)',
    badge: 'LIBRARY / チーム',
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-500/40',
    icon: '🏎️',
    summary: 'アウディ、レッドブル・フォード、アストンマーティン・ホンダを含む全11チームの開発拠点、PU、工学哲学。',
    reviewPoints: ['2026年新規参入アウディやホンダワークス体制の工学哲学'],
    locationHint: 'F1大百科 ➔ チーム名鑑',
    actionText: 'チーム名鑑を開く',
  },
  {
    id: 'circuits',
    category: 'knowledge',
    title: 'コース解説 (24サーキット詳細)',
    badge: 'LIBRARY / コース',
    badgeColor: 'bg-blue-900/40 text-blue-300 border-blue-500/40',
    icon: '🏁',
    summary: '全24サーキットのDRSゾーン、最高速、全開率、タイヤ負荷、標高差、追い抜き難易度を完全網羅。',
    reviewPoints: ['鈴鹿サーキット、スパ、モンツァなどの名所コーナーとセクター特性'],
    locationHint: 'F1大百科 ➔ コース解説',
    actionText: 'コース解説を開く',
  },
  {
    id: 'tyres',
    category: 'knowledge',
    title: 'タイヤ大百科 (ピレリコンパウンド＆作動温度)',
    badge: 'LIBRARY / タイヤ',
    badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-500/40',
    icon: '🛞',
    summary: 'ピレリC1〜C5コンパウンド特性、作動温度ウィンドウ、グレイニングとブリスターの科学的メカニズム。',
    reviewPoints: ['タイヤ作動温度帯やアンダーカットが効くメカニズムを解説'],
    locationHint: 'F1大百科 ➔ タイヤ大百科',
    actionText: 'タイヤ大百科を開く',
  },
  {
    id: 'glossary',
    category: 'knowledge',
    title: 'F1用語辞典 (図解・辞書)',
    badge: 'LIBRARY / 用語',
    badgeColor: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40',
    icon: '🧠',
    summary: 'ポーパシング、アンダーカット、ダーティエア、MOMなど80語以上のF1専門用語をSVG図解付きで即時検索。',
    reviewPoints: ['SVG図解付きで初心者の疑問を瞬時に解決'],
    locationHint: 'F1大百科 ➔ 規定・用語集 ➔ 用語辞典',
    actionText: '用語辞典を開く',
  },
  {
    id: 'fia_rules',
    category: 'knowledge',
    title: 'FIA公式規則 ＆ 2026年新規定解説ラボ',
    badge: 'LIBRARY / 規定',
    badgeColor: 'bg-purple-900/40 text-purple-300 border-purple-500/40',
    icon: '⚖️',
    summary: 'FIA公式競技規則・技術規則・スチュワード判定基準に加え、2026年導入のアクティブ空力（Z/Xモード）、50:50 次世代PU、マニュアルオーバーライド（MOM）、車体小型化をSVGアニメーションと数値で分かりやすく図解。',
    reviewPoints: [
      '【2026年新規定図解】Z/Xモード空力フラップ可変・50:50 PU出力比率・MOMオーバーライド',
      '【競技・技術規則】トラックリミット、イエロー/赤旗手順、セーフティカー規定',
      '【スチュワード判定事例】2021アブダビ、2023COTAプランク違反失格などの詳細検証',
    ],
    locationHint: 'F1大百科 ➔ 規定・用語集 ➔ FIA公式規則＆2026年新規定',
    actionText: '公式規則＆新規定を開く',
  },
  {
    id: 'drama',
    category: 'knowledge',
    title: '名勝負ドラマ ＆ 歴史無線アーカイブ',
    badge: 'LIBRARY / 歴史',
    badgeColor: 'bg-rose-900/40 text-rose-300 border-rose-500/40',
    icon: '🎬',
    summary: 'F1の歴史に刻まれた伝説のチャンピオン争い、無線バトル、名勝負を当時の生音声とともに追体験。',
    reviewPoints: ['セナ・プロストから2021年アブダビ最終周まで'],
    locationHint: 'F1大百科 ➔ ドラマ・歴史',
    actionText: 'ドラマ・歴史を開く',
  },

  // ── AIインテリジェンス ──
  {
    id: 'ai_strategist',
    category: 'ai',
    title: 'AIチーフレースストラテジスト',
    badge: 'AI / 戦略提案',
    badgeColor: 'bg-blue-600/30 text-blue-300 border-blue-500/40',
    icon: '🤖',
    summary: 'Google Gemini 2.5 Pro を搭載。レース状況・ラップタイム・タイヤ摩耗をもとにピット戦略を即時提言。',
    reviewPoints: ['「今ピットインすべきか？」「アンダーカットの勝率は？」など自由に質問可能'],
    locationHint: 'ヘッダー右上「🤖 AI STRATEGIST」ボタンで展開',
    actionText: 'AIチャットを開く',
  },
];

interface FeatureDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFeature: (featureId: string) => void;
}

export default function FeatureDirectoryModal({
  isOpen,
  onClose,
  onSelectFeature,
}: FeatureDirectoryModalProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'new' | 'telemetry' | 'knowledge' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredFeatures = ALL_FEATURES.filter((f) => {
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    return (
      matchesCategory &&
      (f.title.toLowerCase().includes(q) ||
        f.summary.toLowerCase().includes(q) ||
        f.locationHint.toLowerCase().includes(q) ||
        f.reviewPoints.some((p) => p.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-950 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-xl shadow-lg shadow-red-900/40 border border-red-400/40">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-racing font-black tracking-wider text-white">
                  全機能マップ ＆ クイックナビゲーション
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-600/30 text-red-300 border border-red-500/40 font-bold">
                  レビューガイド
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                目的の機能へ1クリックで直通ジャンプ。新機能の見どころと確認手順を網羅しています。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-all cursor-pointer shadow-sm flex-shrink-0"
            title="閉じる"
          >
            ✕
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/5 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'すべて表示', count: ALL_FEATURES.length },
              { id: 'new', label: '🔥 注目新機能', count: ALL_FEATURES.filter((f) => f.category === 'new').length },
              { id: 'telemetry', label: '🏎️ テレメトリー', count: ALL_FEATURES.filter((f) => f.category === 'telemetry').length },
              { id: 'knowledge', label: '📚 F1大百科', count: ALL_FEATURES.filter((f) => f.category === 'knowledge').length },
              { id: 'ai', label: '🤖 AI機能', count: ALL_FEATURES.filter((f) => f.category === 'ai').length },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-400/50'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              placeholder="機能名・キーワード検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <span className="absolute left-2.5 top-2 text-xs text-slate-500">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-all hover:scale-[1.01] hover:shadow-xl ${
                  feature.category === 'new'
                    ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-red-950/30 border-red-500/30 hover:border-red-400/60 shadow-md shadow-red-950/20'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Card Header: Icon, Title, Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-racing font-bold text-white leading-tight">
                          {feature.title}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>📍</span>
                          <span>{feature.locationHint}</span>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase flex-shrink-0 ${feature.badgeColor}`}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feature.summary}
                  </p>

                  {/* Review Points Checklist */}
                  {feature.reviewPoints && feature.reviewPoints.length > 0 && (
                    <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 space-y-1">
                      <div className="text-[10px] font-racing font-bold text-amber-400 flex items-center gap-1">
                        <span>🔍</span>
                        <span>レビューの注目ポイント:</span>
                      </div>
                      <ul className="space-y-1">
                        {feature.reviewPoints.map((point, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug"
                          >
                            <span className="text-red-400 font-bold mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Footer: Direct Jump Button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectFeature(feature.id);
                      onClose();
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-racing font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                      feature.category === 'new'
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-900/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{feature.actionText}</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="text-sm font-racing">該当する機能が見つかりませんでした。</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">● 稼働中</span>
            <span className="text-[11px] font-mono">F1 2026 Telemetry & Regulations Intelligence Platform</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-racing font-bold cursor-pointer transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
