'use client';

/**
 * components/hubs/KnowledgeHistoryHub.tsx
 * Hub 3: F1 Knowledge Base, Technical Glossary, Regulations, and Historical Archives.
 */

import React, { useState } from 'react';

interface KnowledgeSection {
  id: string;
  category: 'STRATEGY' | 'REGULATIONS' | 'AERO' | 'HISTORY';
  title: string;
  subtitle: string;
  content: string;
  keyPoints: string[];
  icon: string;
}

const KNOWLEDGE_BASE: KnowledgeSection[] = [
  {
    id: 'k-1',
    category: 'STRATEGY',
    title: 'アンダーカット vs オーバーカットの戦略力学',
    subtitle: 'ピットウィンドウにおけるペース逆転のメカニズム',
    content: 'アンダーカットは前走車より1〜2周早くピットインし、新品タイヤの高いグリップ（アウトラップ＋翌周のゲイン）を活かして相手の前に出る戦術です。逆にオーバーカットはタイヤデグラデーションが極めて小さいサーキットや、アウトラップでの熱入れが難しい低温コンディションで有効となります。',
    keyPoints: [
      '新品タイヤのデルタゲインが +1.0s/Lap 以上ある場合にアンダーカットが強力',
      'トラフィック（復帰位置の前走車）に引っかかるとアンダーカットは失敗する',
      '路面進化（Track Evolution）が激しいサーキットではオーバーカットも選択肢に',
    ],
    icon: '⚡',
  },
  {
    id: 'k-2',
    category: 'REGULATIONS',
    title: 'セーフティカー (SC) ＆ バーチャルセーフティカー (VSC) 規程',
    subtitle: 'FIA競技規則におけるピットストップ損失時間の変化',
    content: '通常レーシングスピードでのピットロスタイムは約20〜24秒ですが、SC/VSC導入時はコース上の全車がデルタタイム制限（約40%減速）を受けるため、ピットロスタイムが実質9〜13秒程度まで大幅に縮小します。これが「フリーピットストップ」と呼ばれる理由です。',
    keyPoints: [
      'VSC中のピットインは通常の約半分のタイムロスでタイヤ交換が可能',
      'SC先導走行中はタイヤ温度とブレーキ温度の低下マネジメントが死活問題',
      '赤旗中断時はグリッド上での無償タイヤ交換・マシン修復が認められる',
    ],
    icon: '🚨',
  },
  {
    id: 'k-3',
    category: 'AERO',
    title: 'グラウンドエフェクト構造とポーパシング',
    subtitle: '2022年規定以降の空力思想とベンチュリトンネル',
    content: '現行F1マシンは車体底面のベンチュリトンネルにより負圧を発生させ、ダウンフォースの大部分をアンダーフロアから得ています。車高が下がりすぎるとフロアの気流が剥離（ストール）し、車体が激しく上下動する「ポーパシング（Porpoising）」現象が発生します。',
    keyPoints: [
      'フロアエッジの気流封じ込め（スリットとエッジウィング）が空力効率を左右',
      'サスペンションの硬さとライドハイト（車高）のミリ単位の最適化が不可欠',
      '前車追従時のタービュランス（後方乱気流）が旧規定より低減されオーバーテイクが容易に',
    ],
    icon: '💨',
  },
  {
    id: 'k-4',
    category: 'HISTORY',
    title: '伝説のグランプリ＆名勝負アーカイブ',
    subtitle: '歴史を塗り替えた劇的レースと戦略的マスターピース',
    content: '1998年ハンガリーGPでのミハエル・シューマッハによる驚異の「3ストップ作戦」、2011年カナダGPでのバトンによる最後尾からの劇的逆転劇、2021年アブダビGPの最終ラップ決着など、タイヤ選択とピット戦略が勝敗を分けた伝説の瞬間を振り返ります。',
    keyPoints: [
      '1998年 ハンガリーGP: シューマッハが「毎周予選アタック」でマクラーレンを逆転',
      '2011年 カナダGP: 4時間超の豪雨レースで6度のピットを敢行し劇的勝利',
      '2021年 アブダビGP: ファイナルラップでのソフトタイヤ装着と歴史的決着',
    ],
    icon: '🏆',
  },
];

export default function KnowledgeHistoryHub() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('k-1');

  const filteredItems = KNOWLEDGE_BASE.filter(
    (item) => activeCategory === 'ALL' || item.category === activeCategory
  );

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-racing font-bold text-sky-400 uppercase tracking-widest">
              ACADEMY & ARCHIVE
            </span>
          </div>
          <h2 className="text-xl font-racing font-black text-white tracking-wider">
            F1 KNOWLEDGE & HISTORICAL ARCHIVES
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            タイヤ戦略理論、FIAテクニカル・スポーティングレギュレーション、空力工学、歴史的名勝負のアーカイブ。
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 self-start md:self-auto">
          {[
            ['ALL', 'すべて'],
            ['STRATEGY', '⚡ 戦略理論'],
            ['REGULATIONS', '📋 競技規則'],
            ['AERO', '💨 空力・技術'],
            ['HISTORY', '🏆 歴史的名勝負'],
          ].map(([cat, label]) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                  : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion / Card Knowledge List */}
      <div className="flex flex-col gap-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="glass-card overflow-hidden transition-all duration-300"
            >
              {/* Card Header Clickable */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest font-racing">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <span className="text-slate-400 text-xs font-mono transition-transform duration-300 flex-shrink-0">
                  {isExpanded ? '▲ 閉じる' : '▼ 詳細を開く'}
                </span>
              </button>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-white/5 flex flex-col gap-4 animate-fade-in">
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-white/5">
                    {item.content}
                  </p>

                  <div>
                    <h4 className="text-[11px] font-bold font-racing text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>📌</span>
                      <span>戦略・解析における重要ポイント</span>
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {item.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2"
                        >
                          <span className="text-sky-400 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
