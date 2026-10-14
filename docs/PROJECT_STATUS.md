# Project Status & Handover Doc

最終更新日時: 2026-10-14
ステータス: 安定稼働・機能拡張完了（v3.2.0: 巨大データJSONチャンク分割・インラインワークスペース・2画面BroadcastChannel同期・OpenF1×Jolpica速報/確定ハイブリッド稼働）

## 1. アプリケーション概要・目的
- 非公式のF1テレメトリ分析・戦略シミュレーション・総合知識ポータル（PADOROKU - F1 Telemetry Intelligence Portal）。
- FIA公式記録、OpenF1 / Jolpica-F1 一次データ、および物理演算モデル（`lib/physicsConstants.ts` 準拠）を連携させ、開催前・開催中・終了後のレース分析と1.0xリアルタイム戦略シミュレーションを一気通貫で提供する。

## 2. 実装済み機能
- [x] Next.js (App Router) + TypeScript + Tailwind CSS 基盤と5大コアハブ（SEASON / TELEMETRY / PITWALL / NEWS / LIBRARY）の構築
- [x] 単一 `<main>` レスポンシブコンテナ化によるデスクトップ・モバイル間の二重マウント防止（OpenF1 API 429レート制限対策完了）
- [x] 巨大歴史データ（`data/f1HistoricalResultsData.ts` 92,468行）の年別JSONチャンク分割（`data/chunks/historical/results-2018.json`〜`results-2025.json`）と動的 `import()` プリロード
- [x] SEASONハブの「インライン・マスターディテール・ワークスペース」（透過モーダル乱用を廃止し、`router.replace(..., { scroll: false })` で履歴を汚さずリザルト・無線RC・3Dコースガイドをインライン展開）
- [x] `BroadcastChannel('padoroku_pitwall_sync')` ＋初期ハンドシェイク（`REQUEST_STATE` ➔ `SYNC_STATE`）による2画面Pop-outテレメトリーウィンドウ（`/popout/telemetry`）のゼロブランク即時同期
- [x] OpenF1 × Jolpica ハイブリッドリザルト検証エンジン（レース直後は `PROVISIONAL (OpenF1速報)` を表示し、Jolpica反映後に `OFFICIAL (FIA確定)` へ自動昇格する Graceful Degradation）
- [x] 物理定数（`lib/physicsConstants.ts`）連動の「観戦・戦略3分ブリーフィングボード」（`components/hubs/season/RaceWeekendBriefingCard.tsx`）およびコンテキスト連動型 Pro アナリスト導線
- [x] 2018〜2026年の公式確定記録（2026年は第17戦シンガポールGPまで収録）と前回大会確認セクション（`PreviousRaceHero`）の常時表示
- [x] 全コンポーネントの ESLint `react-hooks/exhaustive-deps` 警告ゼロ化、および最小11px＋`tabular-nums whitespace-nowrap` によるモバイル数値折り返し保護

## 3. 仮置き・モック・要補完リスト（※不完全箇所・セキュリティ仮設定）
※以下の書式「機能名 (`対象パス`): 現在の仮仕様 ➔ 本来の仕様」を厳守して記載すること。
- [ ] **2026年 第18戦〜第24戦の公式リザルト** (`lib/sessionResultsService.ts`, `data/f1SeasonData.ts`): 第18戦アメリカGP（2026-10-16〜10-19開催）以降は未開催のためスケジュールのみ登録・リザルト空配列 ➔ **【本来の要件】**: 各GP開催完了後に OpenF1 速報（`PROVISIONAL`）および Jolpica 公式確定（`OFFICIAL`）を自動取得しつつ、確定後に静的データへ順次収録する。
- [ ] **車載テレメトリー波形（Car Data 300Hz）のフォールバック計算** (`lib/telemetryUtils.ts`): OpenF1 `car_data` エンドポイントが対象セッションで未提供またはタイムアウトした場合、実測ラップタイム・セクタータイムとコース幾何曲率から物理モデルで速度・スロットル・ブレーキ波形を補間生成 ➔ **【本来の要件】**: OpenF1高頻度サンプルが取得可能な場合は実測サンプルをそのまま描画し、物理補間時はUI上で「モデル推計」と区別可能にする。
- [ ] **Pitwall Pro 課金決済フロー** (`components/subscription/PitwallProModal.tsx`): 現在はデモ用のプラン紹介・モックアップグレード切り替えUI ➔ **【本来の要件】**: 将来のマネタイズフェーズにて Stripe Checkout + NextAuth / Supabase サブスクリプション認可と連携する。

## 4. 次に取り組むタスク
※別セッションのAIが「4-1を進めて」の一言でそのまま実行できるよう、具体的な指示内容まで記載すること。
1. **[4-1: 2026年 第18戦 アメリカGP（COTA）開催後の公式リザルト反映]** - 2026年10月19日の第18戦アメリカGP決勝終了後、`lib/sessionResultsService.ts` の `COMPLETED_2026_RACES[18]` にスプリント・予選・決勝公式リザルトを追加し、`data/f1SeasonData.ts` の `DRIVER_STANDINGS_2026` / `CONSTRUCTOR_STANDINGS_2026` および Round 18 `winnerNote` を更新して `npm run test` と `npm run build` を通すこと。
2. **[4-2: 既存 `<img>` タグの段階的 `next/image` 最適化検討]** - 外部Wikimedia URLおよびローカルサーキット写真で使用している `<img>` について、`next.config.mjs` の `remotePatterns` と照合しつつ LCP 影響の大きいヒーロー画像から段階的に最適化する。

## 5. 技術選定・主要ディレクトリ構成
- **Framework**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Charts / Testing**: Recharts, Lucide React, Vitest (`npm run test`)
- **Core Types (型定義の正)**: `lib/types.ts`, `data/f1SeasonData.ts`, `data/f1KnowledgeTypes.ts`
- **主要パス**:
  - `app/page.tsx`: アプリ全体の統合ワークスペース・状態管理・ルーティング
  - `app/popout/telemetry/page.tsx`: マルチモニター観戦用の独立2画面同期テレメトリーウィンドウ
  - `components/hubs/`: 5大コアハブ（`SeasonHub.tsx`, `RaceSimulatorHub.tsx`, `DriversHub.tsx`, `CircuitsHub.tsx`, `KnowledgeHistoryHub.tsx`）および `season/RaceWeekendBriefingCard.tsx`
  - `components/telemetry/`: テレメトリー比較チャート・デルタ解析・トラックマップ（`DetailedTelemetryChart.tsx`, `TelemetryDeltaAnalyzer.tsx`, `TelemetryTrackMap.tsx`）
  - `components/pitwall/`: レース後無線・RC振り返りビュー（`PostRaceReviewModal.tsx`）
  - `lib/`: OpenF1 / Jolpica API クライアント、ハイブリッド結果サービス（`sessionResultsService.ts`, `openf1LiveResult.ts`）、2画面同期（`pitwallBroadcastSync.ts`）、物理定数（`physicsConstants.ts`）、システム時計（`systemClock.ts`）
  - `data/`: 2018〜2026シーズンカレンダー・ランキング（`f1SeasonData.ts`）、年別歴史リザルトJSONチャンク（`data/chunks/historical/results-2018..2025.json`）、知識ベース分割データ（`data/f1Knowledge*.ts`）
- **環境変数ステータス（キー名のみ）**:
  - `GEMINI_API_KEY`: 任意（AI Strategist API `/api/strategist` で使用、未設定時はローカルルールベース分析へフォールバック）
  - `NEXTAUTH_SECRET`: 任意（`/api/auth/[...nextauth]` 用）
