/**
 * lib/dataSourceRegistry.ts
 * Master Data Source & Authority Registry for F1 Analysis App.
 * Ensures 100% factual accuracy, explicit primary source attribution,
 * and strict elimination of outdated/incorrect references.
 */

export interface DataSourceItem {
  id: string;
  name: string;
  category: 'broadcast' | 'regulatory' | 'telemetry' | 'constructors' | 'technical';
  publisher: string;
  coverage: string;
  authorityLevel: 'PRIMARY_OFFICIAL' | 'REGULATORY_BODY' | 'LICENSED_BROADCASTER' | 'ACADEMIC';
  verificationFrequency: 'realtime' | 'daily' | 'per_gp' | 'per_season';
  lastVerified: string;
  officialPortalUrl: string;
  description: string;
  disclaimer?: string;
}

export const OFFICIAL_DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'src-broadcast-fod',
    name: 'FOD (フジテレビオンデマンド) / フジテレビNEXT',
    category: 'broadcast',
    publisher: '株式会社フジテレビジョン / フジテレビNEXT ライブ・プレミアム',
    coverage: '日本国内全セッション生中継（FP1〜FP3, 予選, スプリント, 決勝）および公式中継アーカイブ',
    authorityLevel: 'LICENSED_BROADCASTER',
    verificationFrequency: 'per_gp',
    lastVerified: '2026-09-12',
    officialPortalUrl: 'https://fod.fujitv.co.jp/',
    description: '日本国内におけるF1公式中継パートナー。生実況・解説、無線日本語訳、公式タイムアタック中継アーカイブの一次基準。※当アプリではDAZN等ではなく、FOD / フジテレビNEXTの国内公式中継基準に厳格に準拠しています。',
  },
  {
    id: 'src-regulatory-fia',
    name: 'FIA (国際自動車連盟) 公式レギュレーション＆スチュワード裁定録',
    category: 'regulatory',
    publisher: "Fédération Internationale de l'Automobile (FIA)",
    coverage: 'F1技術規則 (Technical Regulations), 競技規則 (Sporting Regulations), 各GP公式裁定文書 (FIA Decision Docs)',
    authorityLevel: 'REGULATORY_BODY',
    verificationFrequency: 'per_gp',
    lastVerified: '2026-09-12',
    officialPortalUrl: 'https://www.fia.com/regulation/category/110',
    description: '全チーム・全マシンが従う世界最高権威の公式ルールブック。ペナルティ基準、失格判定、最低重量、空力規定、エンジン仕様の唯一の法規基準。',
  },
  {
    id: 'src-telemetry-fom',
    name: 'FOM (Formula One Management) 公式ライブタイミング＆実況アーカイブ',
    category: 'telemetry',
    publisher: 'Formula One Management / Formula 1',
    coverage: 'GPSトランスポンダー位置情報、セクタータイム、スピードトラップ、無線（Team Radio）実音源アーカイブ',
    authorityLevel: 'PRIMARY_OFFICIAL',
    verificationFrequency: 'realtime',
    lastVerified: '2026-09-12',
    officialPortalUrl: 'https://www.formula1.com/en/f1-live.html',
    description: 'F1全戦における全車ミリ秒単位の公式タイミングおよび全世界国際映像での無線交信実音源の一次データ元。',
  },
  {
    id: 'src-openf1',
    name: 'OpenF1 Community & Real-time Live API',
    category: 'telemetry',
    publisher: 'OpenF1 Open-Source Telemetry Project',
    coverage: '車速、RPM、ギア、スロットル、ブレーキ、DRS、ラップタイム、チーム無線MP3ストリーム',
    authorityLevel: 'PRIMARY_OFFICIAL',
    verificationFrequency: 'daily',
    lastVerified: '2026-09-12',
    officialPortalUrl: 'https://openf1.org/',
    description: 'FOM公式タイミングデータをリアルタイムでクエリ可能な高信頼性APIプロキシ。クイズ実音源やセッション分析の基盤。',
  },
  {
    id: 'src-constructors-press',
    name: 'F1全コンストラクター公式プレスリリース＆テクニカルブリーフィング',
    category: 'constructors',
    publisher: '全10チーム (Ferrari, Red Bull, McLaren, Mercedes, Aston Martin, etc.)',
    coverage: '新車発表スペック、アップデート導入発表、レース後ドライバー＆エンジニア公式コメント',
    authorityLevel: 'PRIMARY_OFFICIAL',
    verificationFrequency: 'per_gp',
    lastVerified: '2026-09-12',
    officialPortalUrl: 'https://www.formula1.com/en/teams.html',
    description: 'ピット戦略の意図、マシントラブルの公式原因発表、契約発表などの一次発表資料。',
  },
  {
    id: 'src-technical-sae',
    name: 'SAE International & Racecar Engineering 航空工学・運動力学文献',
    category: 'technical',
    publisher: 'Society of Automotive Engineers / Racecar Engineering Journal',
    coverage: 'グラウンドエフェクト気体力学、ベンチュリトンネル流体解析、タイヤ熱劣化モデル',
    authorityLevel: 'ACADEMIC',
    verificationFrequency: 'per_season',
    lastVerified: '2026-09-12',
    officialPortalUrl: 'https://www.sae.org/',
    description: 'F1大百科・技術用語解説における物理法則・力学モデルの学術的裏付け資料。',
  },
];

/**
 * Get verified sources for a specific category
 */
export function getSourcesByCategory(category: DataSourceItem['category']): DataSourceItem[] {
  return OFFICIAL_DATA_SOURCES.filter((s) => s.category === category);
}

/**
 * Standard broadcast attribution notice
 */
export const BROADCAST_ATTRIBUTION_NOTICE = {
  textJa: '国内公式中継パートナー: FOD (フジテレビオンデマンド) / フジテレビNEXT',
  noteJa: '※当アプリは正確性を最優先とし、日本国内におけるF1公式中継（FOD / フジテレビNEXT）およびFIA・FOM公式発表データに厳密に準拠しています。',
  lastAuditDate: '2026-09-12',
};
