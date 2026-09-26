/**
 * lib/monetizationConfig.ts
 * 🏁 PADOROKU F1 Telemetry Portal - Monetization & Affiliate Configuration
 * 
 * 信頼性を最優先とし、F1ファンの体験を損なわない品のある配置と
 * 設定ファイル1行で各スロットをON/OFFできる引き算可能な設計。
 */

export interface AffiliateSlotConfig {
  id: string;
  enabled: boolean;
  category: 'broadcast' | 'sim_racing' | 'merchandise' | 'literature' | 'sponsor';
  title: string;
  badge: string;
  description: string;
  imageUrl?: string;
  affiliateUrl: string;
  ctaText: string;
  trackingTag?: string;
}

export interface MonetizationSettings {
  // ── スロット別 表示/非表示トグル（いつでも即座に引き算可能） ──
  enableSidebarAd: boolean;         // 左サイドバー最下部（常駐ミニバナー）
  enableSeasonBroadcastAd: boolean; // レース観戦ハブ中継案内（FOD公式送客：最重要・最高CVR）
  enableNewsInfeedAd: boolean;      // パドックニュース一覧のインフィードカード
  enableLibraryProductAd: boolean;  // 大百科・用語解説下部の公式グッズ・SIMギア枠
  enableGameInterstitialAd: boolean;// PITWALLシミュレーター起動時の自然なロード広告（3〜5秒スキップ可）
  enableAiRewardAd: boolean;        // AIストラテジスト無料枠終了後の広告視聴リワード

  // ── AIストラテジスト利用制限 ＆ リワードパラメータ ──
  aiDailyFreeLimit: number;         // 1日の完全無料質問回数（例: 3回）
  aiRewardBonusCount: number;       // 広告1回閲覧で追加される質問回数（例: +2回）
  aiMaxRewardsPerDay: number;       // 1日に広告閲覧で回復できる最大回数（例: 3回まで）

  // ── 有料プラン (Pitwall Pro) 設計 ──
  proPlanName: string;
  proPlanPriceJpy: number;          // 月額 (例: 780円)
  proPlanFeatures: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export const DEFAULT_MONETIZATION_SETTINGS: MonetizationSettings = {
  // 初期設定：F1ファンの信頼感を損なわないよう、必要性の高い場所をONにしつつ、いつでもOFFにできる
  enableSidebarAd: true,
  enableSeasonBroadcastAd: true,
  enableNewsInfeedAd: true,
  enableLibraryProductAd: true,
  enableGameInterstitialAd: true,
  enableAiRewardAd: true,

  // AI無料枠とリワード
  aiDailyFreeLimit: 3,
  aiRewardBonusCount: 2,
  aiMaxRewardsPerDay: 3,

  // Pitwall Pro 会員プラン
  proPlanName: 'Pitwall Pro',
  proPlanPriceJpy: 780,
  proPlanFeatures: [
    {
      icon: '🤖',
      title: 'AIストラテジスト完全無制限',
      description: 'Gemini 1.5 Proによる深層レース戦略対話を回数制限なく何回でも相談可能。',
    },
    {
      icon: '🖥️',
      title: 'マルチモニター・独立ウィンドウ完全開放',
      description: '中継観戦用の独立別画面ポップアウト（/popout/telemetry）をフル解像度で利用可能。',
    },
    {
      icon: '📈',
      title: '過去全レース・ヒストリカルテレメトリー比較',
      description: '2021〜2026年の全周回データ、ボトムスピード、スロットル開度の比較機能。',
    },
    {
      icon: '🚫',
      title: '広告・アフィリエイト完全非表示',
      description: 'すべての広告バナー、インフィード枠、起動ロード画面が完全に消去され最高速度で稼働。',
    },
    {
      icon: '🏁',
      title: '高機能・模擬レースシミュレーター全モード解放',
      description: '天候変化・SCチープピット・タイヤデグラデーションのカスタムレース作成権限。',
    },
  ],
};

/**
 * 厳選された公式アフィリエイト・公式送客パートナー一覧
 * （怪しい一般バナーは一切排除し、F1ファンが純粋に求める公式・公認情報に限定）
 */
export const OFFICIAL_AFFILIATE_ITEMS: Record<string, AffiliateSlotConfig> = {
  // 1. 国内公式中継（FOD / フジテレビNEXT / F1 TV）
  fod_broadcast: {
    id: 'fod_broadcast',
    enabled: true,
    category: 'broadcast',
    title: 'FOD (フジテレビ) ＆ F1 TV 公式完全生中継',
    badge: '📺 国内公式中継 ＆ F1 TV',
    description: '川井一仁氏らの日本語実況・解説（FOD）に加え、F1 TVでは全20台のオンボードカメラや生チーム無線を自由選択可能。当アプリのテレメトリーと同時表示で「自宅ピットウォール司令塔」の極上観戦へ。',
    affiliateUrl: 'https://fod.fujitv.co.jp/',
    ctaText: 'FODでセッションを観戦する ↗',
  },

  // 2. 本格SIMレーシングギア（FANATEC）
  fanatec_sim: {
    id: 'fanatec_sim',
    enabled: true,
    category: 'sim_racing',
    title: 'FANATEC 公式ダイレクトドライブ・ステアリング',
    badge: '🏎️ プロ仕様レーシングギア',
    description: 'F1公式ライセンスホイール。実車同様のフォースフィードバックでテレメトリー限界挙動を体感。',
    affiliateUrl: 'https://fanatec.com/ja-jp',
    ctaText: 'FANATEC公式ストアを見る ↗',
  },

  // 3. F1公式オフィシャルストア（ウェア・グッズ）
  f1_store_official: {
    id: 'f1_store_official',
    enabled: true,
    category: 'merchandise',
    title: 'F1 Official Store 公式チームウェア＆ミニカー',
    badge: '🏁 公式チームギア',
    description: 'フェラーリ、レッドブル、RB（角田裕毅）、マクラーレンの2026年最新チームキャップ＆ウェア。',
    affiliateUrl: 'https://f1store.formula1.com/',
    ctaText: '公式チームグッズをチェック ↗',
  },

  // 4. モータースポーツ専門誌・技術解説書
  f1_magazine: {
    id: 'f1_magazine',
    enabled: true,
    category: 'literature',
    title: 'F1速報 / GP Car Story 公式技術解説本',
    badge: '📕 モータースポーツ専門誌',
    description: '2026年新レギュレーション（アクティブエアロ・50:50 PU）の徹底技術解剖号をチェック。',
    affiliateUrl: 'https://www.as-web.jp/f1',
    ctaText: '関連書籍・技術解説を見る ↗',
  },
};
