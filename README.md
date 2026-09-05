# 🏎️ F1 Intelligence & Telemetry Portal (v1.0.0)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

プロフェッショナル向け Formula 1 インテリジェンス＆リアルタイム・テレメトリーポータル。  
2024年F1世界選手権全24戦のサーキット実測GPSトラックマップ、全24名のドライバー名鑑、3段同期テレメトリー解析エンジン、Gemini AIによる戦術分析・チーム無線文字起こしを完全統合した次世代モータースポーツ・ダッシュボードです。

---

## 🌟 主な機能ハイライト

### 🏁 1. 全24サーキット実測GPSトラックマップ ＆ 400超コーナー諸元
- **実測座標準拠のベクタートラックマップ (SVG)**:
  - Wikipedia / Wikimedia Commons 実績図面に基づく正確なレイアウトパス（上海のT1-T2スネイルターン、スパのオールージュ、鈴鹿の立体交差等）。
  - 各サーキットの全長（m）、ラップレコード、DRSゾーン数、コース特性、歴史的激闘録（Historic Moments）を完全網羅。
- **地域別・特性別クイックフィルター**:
  - 地域（ヨーロッパ、アジア・中東、南北アメリカ、オセアニア）および特性（超高速パワー、市街地ストリート、テクニカル高DF）による即時絞り込み。

### 🏎️ 2. 全24ドライバー手動点検済み名鑑 ＆ 10チームアーカイブ
- **厳格な肖像点検（事実性担保）**:
  - 現役20名 ＋ レジェンド殿堂4名（セナ、シューマッハ、プロスト、ラウダ）の計24名全員について、実在の本人顔写真（胸上バストアップ）を目視手動点検。
  - レーシングマシン写真（actions）と素顔写真（portraits）を物理分離。
- **チーム別グループ表示 ＆ ドライビングプロファイル**:
  - コンストラクター別のグリッド表示、ドライビングスタイル特性（ブレーキ開始点、ボトム旋回速度、脱出トラクション特性）の数値化。

### ⚡ 3. 3段同期テレメトリー解析エンジン
- **同期チャート（SPEED, PEDALS, GEAR & DELTA）**:
  - ① 車速（0〜350 km/h）
  - ② ペダル操作（スロットル開度 0〜100% ＆ ブレーキ急減速帯）
  - ③ ギア段数（1〜8速）＆ 累積タイム差（Delta sec）
- **Delta連動ゴーストカー演出**:
  - チャートホバー時、コース進行度および速度・タイム差秒から物理計算された前後オフセットを適用し、先行車と後続車を実際の時間差距離を保ってミニマップ上にリアルタイム描画。
- **ブレーキ踏力ヒートマップ**:
  - コース全周の減速G・ブレーキ踏力をカラーグラデーション（水色→黄→赤）でミニマップ上にオーバーレイ表示。
- **エイペックス（最遅速度）インサイト ＆ ダイナミック区間ズーム**:
  - キーコーナー（T1, T4, T5-7等）のクイックズームバー新設。
  - 選択コーナーの前後 $\pm 200$m の波形（減速→クリッピングボトム→脱出加速）をチャート横幅いっぱいに拡大表示。

### 🤖 4. Gemini AI 戦術アナリスト ＆ チーム無線解析
- **Gemini 3.5 Flash / Pro 連携**:
  - リアルタイム・レースストラテジストによるアンダーカット・オーバーカット勝率シミュレーション。
  - チーム無線（Team Radio MP3）の音声文字起こし、日本語翻訳、および戦略背景の自動解説。

---

## 📐 設計規約 ＆ ゼロ・ハルシネーション原則

本プロジェクトは `PROJECT_RULES.md` および `.antigravity/rules.md` に基づき開発・運用されています。
- **原則1: ゼロ・ハルシネーション＆一次情報準拠**
- **原則2: 画像・アセットの用途別完全分離と厳格な手動点検**
- **原則3: 自律的完全実行と客観的事実による完了証明**
- **原則4: 開発環境の常時保護（ポート 3000 の無停止運用）**

---

## 🚀 クイックスタート

### 動作要件
- Node.js 18.17.0 以上
- npm 9.0 以上

### インストール手順

```bash
# リポジトリのクローン
git clone https://github.com/CreationKengo/F1analyisis-app.git
cd F1analyisis-app/f1-telemetry-next

# 依存パッケージのインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```
ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアクセスします。

### 本番ビルド ＆ 実行

```bash
# プロダクションビルド（TypeScript型検査・ESLint検査・静的生成）
npm run build

# 本番サーバーの起動
npm run start
```

### 静的解析・型検査コマンド

```bash
# TypeScript型検査（型エラー 0 件検証）
npm run type-check

# ESLint静的コード解析
npm run lint
```

---

## 📁 ディレクトリ構造

```text
f1-telemetry-next/
├── app/                      # Next.js App Router (ページ & APIルート)
│   ├── api/
│   │   ├── audio-proxy/      # チーム無線MP3 CORSプロキシ
│   │   ├── f1-news/          # F1公式ニュース配信
│   │   ├── image-proxy/      # 画像CORSプロキシ
│   │   ├── strategist/       # Gemini AI 戦術アナリスト
│   │   └── transcribe/       # 音声文字起こし＆翻訳
│   ├── globals.css           # グローバルスタイル & Tailwindディレクティブ
│   ├── layout.tsx            # ルートレイアウト
│   └── page.tsx              # メインポータル
├── components/               # UIコンポーネント群
│   ├── hubs/                 # サーキット・ドライバー・チームハブ
│   │   ├── CircuitDetailModal.tsx
│   │   ├── CircuitsHub.tsx
│   │   ├── DriverDetailModal.tsx
│   │   └── DriversHub.tsx
│   ├── telemetry/            # テレメトリー解析エンジン
│   │   ├── DetailedTelemetryChart.tsx
│   │   └── TelemetryTrackMap.tsx
│   └── ui/                   # 共通UI (PhotoGalleryCarousel 等)
├── data/                     # F1一次情報データ定義
│   └── f1KnowledgeData.ts    # 24サーキット・24ドライバー・10チーム諸元
├── lib/                      # ロジック・サービス層
│   ├── carTelemetryService.ts# テレメトリー物理シミュレーション＆正規化
│   ├── telemetryUtils.ts     # 計算ユーティリティ
│   └── types.ts              # TypeScript型定義
├── public/                   # 静的アセット
│   └── images/
│       ├── circuits/maps/    # 24サーキット実測SVGトラックマップ
│       └── drivers/
│           ├── actions/      # マシン走行写真
│           └── portraits/    # ドライバー素顔バストアップ写真
├── PROJECT_RULES.md          # 開発規約・品質保証ガイドライン
└── next.config.mjs           # Next.js設定ファイル
```

---

## 📄 ライセンス

MIT License © 2026 F1 Intelligence & Telemetry Portal Team
