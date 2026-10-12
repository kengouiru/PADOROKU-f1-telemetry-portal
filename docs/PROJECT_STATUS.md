# Project Status & Handover Doc

最終更新日時: 2026-10-12
ステータス: 開発中（Phase 5 完了）

## 1. アプリケーション概要・目的
- 非公式のF1テレメトリ分析・シミュレーションポータル。
- 現実のF1物理演算（1.0xリアルタイム）や公式リザルトデータに基づき、レース展開の把握やシミュレーションを提供する。

## 2. 実装済み機能
- [x] Next.js (App Router) + TypeScript + Tailwind CSS への基盤リプレイス
- [x] 全24サーキットの幾何形状SVGデータ配備とセクター同期
- [x] 2021〜2026年の公式確定記録（Jolpica Ergast API準拠）のアーカイブデータ連携
- [x] JST基準時計（システムクロック）による未開催・開催中の動的判定
- [x] ドライバー名鑑における参考文献（References）タブと一次出典リンクの表示
- [x] 巨大ファイルの分割: data/f1KnowledgeData.ts (約12,400行) を 1KnowledgeTeams, 1KnowledgeDrivers, 1KnowledgeCircuits 等へモジュラー分割完了。

## 3. 仮置き・モック・要補完リスト（※不完全箇所）
- [ ] UI上の仮置き: （※現時点で新たに発見されたモックがあればここに追記する）

## 4. 次に取り組むタスク
1. [Phase B] 予選・決勝直後のOpenF1からの速報リザルト取得ロジックの実装
2. [Phase B] 全無線を聞き返せる「Post-Race Review」画面の作成
3. [Phase C] AIオリジナル記事生成機能の構築

5. 技術選定・主要ディレクトリ構成
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Charts/Vis**: Chart.js (CDN/SSR無効化で連携想定)
