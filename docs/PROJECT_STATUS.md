# Project Status & Handover Doc

最終更新日時: 2026-10-14
ステータス: 機能拡張中（v3.1.0: 2026年第17戦シンガポールGP反映・前回大会確認セクション＆Post-Race Review完全稼働）

## 1. アプリケーション概要・目的
- 非公式のF1テレメトリ分析・戦略シミュレーション・総合知識ポータル（PADOROKU - F1 Telemetry Intelligence Portal）。
- FIA公式記録、OpenF1 / Jolpica-F1 一次データ、および物理演算モデル（`lib/physicsConstants.ts` 準拠）を連携させ、開催前・開催中・終了後のレース分析と1.0xリアルタイム戦略シミュレーションを一気通貫で提供する。

## 2. 実装済み機能
- [x] Next.js (App Router) + TypeScript + Tailwind CSS 基盤と5大コアハブ（SEASON / TELEMETRY / PITWALL / NEWS / LIBRARY）の構築
- [x] 単一 `<main>` レスポンシブコンテナ化によるデスクトップ・モバイル間の二重マウント防止（OpenF1 API 429レート制限対策完了）
- [x] 全24サーキットのGPS準拠ベクターSVGデータ配備・ターンピン連動・セクター同期
- [x] 2018〜2026年の公式確定記録（Jolpica Ergast API / OpenF1 API準拠、2026年は第17戦シンガポールGPまで収録）のアーカイブ連携
- [x] JST基準システムクロック（`Date.now()`）による未開催・開催中・終了の動的時系列判定
- [x] SEASONハブ「前回大会確認セクション（Previous Race Summary）」での直近完了戦（第17戦シンガポールGP）ポディウム・PP・FL常時表示と全順位モーダル（`SessionResultsModal`）直接起動
- [x] 予選・決勝直後のOpenF1からの2026年実データ速報リザルト取得ロジック（`lib/openf1LiveResult.ts`）
- [x] 全ドライバーの無線（実音声再生対応）とレースコントロール履歴を振り返る「Post-Race Review」モーダル（`components/pitwall/PostRaceReviewModal.tsx`）
- [x] ドライバー名鑑・チーム名鑑・サーキット大図鑑・規定用語集の2カラム・エディトリアルレイアウトと一次出典（References）リンク明示
- [x] 巨大ファイル分割: `data/f1KnowledgeData.ts`（約12,400行）を `data/knowledge/*`（Teams / Drivers / Circuits 等）へモジュラー分割完了

## 3. 仮置き・モック・要補完リスト（※不完全箇所・セキュリティ仮設定）
※以下の書式「機能名 (`対象パス`): 現在の仮仕様 ➔ 本来の仕様」を厳守して記載すること。
- [ ] **2026年 第18戦〜第24戦の公式リザルト** (`lib/sessionResultsService.ts`, `data/f1SeasonData.ts`): 第18戦アメリカGP（2026-10-16〜10-19開催）以降は未開催のためスケジュールのみ登録・リザルト空配列 ➔ **【本来の要件】**: 各GP開催完了後に公式確定リザルト（P1〜P20、予選、スプリント、FL、ピット戦略、選手権ポイント）を順次収録またはJolpica/OpenF1 APIから動的確定させる。
- [ ] **車載テレメトリー波形（Car Data 300Hz）のフォールバック計算** (`lib/telemetryUtils.ts`): OpenF1 `car_data` エンドポイントが対象セッションで未提供またはタイムアウトした場合、実測ラップタイム・セクタータイムとコース幾何曲率から物理モデルで速度・スロットル・ブレーキ波形を補間生成 ➔ **【本来の要件】**: OpenF1高頻度サンプルが取得可能な場合は実測サンプルをそのまま描画し、物理補間時はUI上で「モデル推計」と区別可能にする。
- [ ] **Pitwall Pro 課金決済フロー** (`components/modals/ProUpgradeModal.tsx`): 現在はデモ用のプラン紹介・モックアップグレード切り替えUI ➔ **【本来の要件】**: 将来のマネタイズフェーズにて Stripe Checkout + NextAuth / Supabase サブスクリプション認可と連携する。

## 4. 次に取り組むタスク
※別セッションのAIが「4-1を進めて」の一言でそのまま実行できるよう、具体的な指示内容まで記載すること。
1. **[4-1: 2026年 第18戦 アメリカGP（COTA）開催後の公式リザルト反映]** - 2026年10月19日の第18戦アメリカGP決勝終了後、`lib/sessionResultsService.ts` の `COMPLETED_2026_RACES[18]` にスプリント・予選・決勝公式リザルトを追加し、`data/f1SeasonData.ts` の `DRIVER_STANDINGS_2026` / `CONSTRUCTOR_STANDINGS_2026` および Round 18 `winnerNote` を更新して `npm run test` と `npm run build` を通すこと。
2. **[4-2: デザインシステム規約（第6部）に基づく残存コンポーネントのノイズ削減]** - `components/pitwall/PaddockLiveAtmosphere.tsx` や `components/strategy/VirtualGrandPrixSimulator.tsx` に残っている ESLint `react-hooks/exhaustive-deps` 警告および極小文字（`text-[10px]`）・UIクローム絵文字を点検し、Lucide SVGアイコンと11px以上のタイポグラフィへ統一すること。

## 5. 技術選定・主要ディレクトリ構成
- **Framework**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Charts / Testing**: Recharts, Lucide React, Vitest (`npm run test`)
- **Core Types (型定義の正)**: `types/f1.ts`, `data/f1SeasonData.ts`, `data/f1KnowledgeData.ts`
- **主要パス**:
  - `app/page.tsx`: アプリ全体の統合ワークスペース・状態管理・ルーティング
  - `components/hubs/`: 5大コアハブ（`SeasonHub.tsx`, `RaceSimulatorHub.tsx`, `DriversHub.tsx`, `CircuitsHub.tsx`, `KnowledgeHistoryHub.tsx` 等）
  - `components/telemetry/`: テレメトリー比較チャート・デルタ解析・トラックマップ（`DetailedTelemetryChart.tsx`, `TelemetryDeltaAnalyzer.tsx`, `TelemetryTrackMap.tsx`）
  - `components/pitwall/`: レース後無線・RC振り返りモーダル等（`PostRaceReviewModal.tsx`）
  - `lib/`: OpenF1 / Jolpica API クライアント、セッション結果サービス（`sessionResultsService.ts`, `openf1LiveResult.ts`）、物理定数（`physicsConstants.ts`）、システム時計（`systemClock.ts`）
  - `data/`: 2018〜2026シーズンカレンダー・ランキング（`f1SeasonData.ts`）、知識ベース分割データ（`data/knowledge/*`）
- **環境変数ステータス（キー名のみ）**:
  - `GEMINI_API_KEY`: 任意（AI Strategist API `/api/strategist` で使用、未設定時はローカルルールベース分析へフォールバック）
  - `NEXTAUTH_SECRET`: 任意（`/api/auth/[...nextauth]` 用）
