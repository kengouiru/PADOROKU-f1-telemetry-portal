# Project Status & Handover Doc

最終更新日時: 2026-10-14
ステータス: 稼働中（v3.1.0: 2026年第17戦シンガポールGP反映・前回大会確認セクション＆Post-Race Review実装完了）

## 1. アプリケーション概要・目的
- 非公式のF1テレメトリ分析・シミュレーションポータル。
- 現実のF1物理演算（1.0xリアルタイム）や公式リザルトデータに基づき、レース展開の把握やシミュレーションを提供する。

## 2. 実装済み機能
- [x] Next.js (App Router) + TypeScript + Tailwind CSS への基盤リプレイス
- [x] 全24サーキットの幾何形状SVGデータ配備とセクター同期
- [x] 2021〜2026年の公式確定記録（Jolpica Ergast API / OpenF1 API準拠、2026年は第17戦シンガポールGPまで収録）のアーカイブデータ連携
- [x] JST基準時計（システムクロック）による未開催・開催中・終了の動的判定
- [x] 前回大会確認セクション（Previous Race Summary）でのポディウム・PP・FL常時表示と全順位モーダル直接起動
- [x] 予選・決勝直後のOpenF1からの速報リザルト取得ロジック（2026年実データ連携、合成フォールバックなし）
- [x] 全無線・レースコントロールメッセージを再生・確認できる「Post-Race Review」モーダル
- [x] ドライバー名鑑における参考文献（References）タブと一次出典リンクの表示
- [x] 巨大ファイルの分割: `data/f1KnowledgeData.ts` (約12,400行) を `f1KnowledgeTeams`, `f1KnowledgeDrivers`, `f1KnowledgeCircuits` 等へモジュラー分割完了。

## 3. 仮置き・モック・要補完リスト（※不完全箇所）
- なし（`openf1LiveResult.ts` および `PostRaceReviewModal.tsx` に残存していた `year = 2024` の仮置きフォールバックは 2026-10-14 に完全撤去済み）。

## 4. 次に取り組むタスク
1. [Phase C] 2026年 第18戦 アメリカGP（COTA）以降の開催後公式リザルト順次反映
2. [Phase C] デザインシステム規約（`GEMINI.md` 第6部）に基づく残存コンポーネントの極小文字・絵文字ノイズ削減の継続

## 5. 技術選定・主要ディレクトリ構成
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Charts/Vis**: Recharts / SVG Custom Telemetry Renderers
