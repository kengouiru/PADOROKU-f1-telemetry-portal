/**
 * data/f1GrandPrixReportsData.ts
 * Deep Race Intelligence, 2024 Podium & Winning Tactics, Official Track Records,
 * and 2025 Tactical Profiles for all 24 Formula 1 Grand Prix Weekends.
 */

export interface GrandPrixPodiumDriver {
  code: string;
  name: string;
  team: string;
  teamColor: string;
  grid: number;
  pitStops: number;
}

export interface GrandPrixReportData {
  round: number;
  gpName: string;
  circuitId: string;
  circuitName: string;
  country: string;
  flag: string;
  // 2024 Authentic Race Outcomes
  result2024: {
    podium: GrandPrixPodiumDriver[];
    polePosition: { code: string; name: string; time: string };
    fastestLap: { code: string; name: string; time: string; lap: number };
    winningStrategy: string;
    strategicTurningPoint: string;
    safetyCarDeployments: string; // e.g. "SC 1回, VSC 0回"
  };
  // Circuit All-Time Track Records
  circuitRecords: {
    qualifyingRecord: { time: string; driver: string; year: number; car: string };
    raceLapRecord: { time: string; driver: string; year: number; car: string };
    mostWinsDriver: string;
    mostWinsTeam: string;
  };
  // 2025 Tactical Engineering Profile
  tacticalProfile: {
    tyreDegradationIndex: number; // 1 (Very Low) to 5 (Extreme)
    overtakeDifficultyIndex: number; // 1 (Very Easy) to 5 (Monaco Level Impossible)
    safetyCarProbabilityPercent: number;
    pitLossSeconds: number; // Pit lane transit loss
    undercutStrengthSeconds: string; // e.g. "+1.2s per lap"
    projectedStrategy: string;
  };
}

export const GRAND_PRIX_REPORTS: Record<number, GrandPrixReportData> = {
  1: {
    round: 1,
    gpName: 'オーストラリアGP',
    circuitId: 'albert-park',
    circuitName: 'アルバート・パーク・サーキット',
    country: 'オーストラリア',
    flag: '🇦🇺',
    result2024: {
      podium: [
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 2, pitStops: 2 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 4, pitStops: 2 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 3, pitStops: 2 },
      ],
      polePosition: { code: 'VER', name: 'M. フェルスタッペン', time: '1:15.915' },
      fastestLap: { code: 'LEC', name: 'C. ルクレール', time: '1:19.813', lap: 56 },
      winningStrategy: 'MEDIUM(16) -> HARD(25) -> HARD(17) の2ストップ。序盤にフェルスタッペンをオーバーテイク後、ブレーキ火災リタイアを突いて独走態勢を構築。',
      strategicTurningPoint: '4周目に首位フェルスタッペンの右リアブレーキが固着・爆発しリタイア。サインツがクリーンエアで完璧なタイヤマネジメントを披露しフェラーリ1-2を達成。',
      safetyCarDeployments: 'VSC 1回 (ハミルトンPU故障), VSC 1回 (ラッセル最終周クラッシュ)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:15.915', driver: 'M. フェルスタッペン', year: 2024, car: 'Red Bull RB20' },
      raceLapRecord: { time: '1:19.813', driver: 'C. ルクレール', year: 2024, car: 'Ferrari SF-24' },
      mostWinsDriver: 'レジェンド: レクサス・シューマッハ (4勝)',
      mostWinsTeam: 'フェラーリ (10勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 3,
      overtakeDifficultyIndex: 3,
      safetyCarProbabilityPercent: 67,
      pitLossSeconds: 20.2,
      undercutStrengthSeconds: '+0.8秒 / 周',
      projectedStrategy: '改修された高速レイアウトにより4本のDRSゾーンが存在。グレイニング対策の2ストップ（M-H-H）が基本軸。',
    },
  },
  2: {
    round: 2,
    gpName: '中国GP',
    circuitId: 'shanghai',
    circuitName: '上海インターナショナル・サーキット',
    country: '中国',
    flag: '🇨🇳',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 1, pitStops: 2 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 4, pitStops: 1 },
        { code: 'PER', name: 'セルジオ・ペレス', team: 'Red Bull', teamColor: '#3671C2', grid: 2, pitStops: 2 },
      ],
      polePosition: { code: 'VER', name: 'M. フェルスタッペン', time: '1:33.660' },
      fastestLap: { code: 'ALO', name: 'F. アロンソ', time: '1:37.810', lap: 45 },
      winningStrategy: 'MEDIUM(13) -> HARD(26) -> HARD(17) の2ストップ。VSC/SC導入の絶妙なタイミングでタイヤを交換し他を圧倒。',
      strategicTurningPoint: 'ノリスがSC導入の恩恵を最大限に受けてペレスの前に浮上。フロントタイヤの摩耗を抑え切って値千金の2位表彰台を死守。',
      safetyCarDeployments: 'VSC 1回 (ボッタス停止), フルSC 2回 (隊列追突インシデント)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:31.095', driver: 'S. ベッテル', year: 2018, car: 'Ferrari SF71H' },
      raceLapRecord: { time: '1:32.238', driver: 'M. シューマッハ', year: 2004, car: 'Ferrari F2004' },
      mostWinsDriver: 'ルイス・ハミルトン (6勝)',
      mostWinsTeam: 'メルセデス (6勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 4,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 55,
      pitLossSeconds: 22.8,
      undercutStrengthSeconds: '+1.1秒 / 周',
      projectedStrategy: 'ターン1の蝸牛コーナーと1.2kmの超ロングストレート。フロント左タイヤのグレイニングが勝負を左右する。',
    },
  },
  3: {
    round: 3,
    gpName: '日本GP (鈴鹿)',
    circuitId: 'suzuka',
    circuitName: '鈴鹿サーキット',
    country: '日本',
    flag: '🇯🇵',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 1, pitStops: 2 },
        { code: 'PER', name: 'セルジオ・ペレス', team: 'Red Bull', teamColor: '#3671C2', grid: 2, pitStops: 2 },
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 4, pitStops: 2 },
      ],
      polePosition: { code: 'VER', name: 'M. フェルスタッペン', time: '1:28.197' },
      fastestLap: { code: 'VER', name: 'M. フェルスタッペン', time: '1:33.706', lap: 50 },
      winningStrategy: '赤旗再スタート後にMEDIUM(16) -> HARD(18) -> HARD(19) の王道2ストップ。角田裕毅がピットクルーの超速作業で入賞（P10）をもぎ取る。',
      strategicTurningPoint: '角田裕毅が複数台同時のピットストップ合戦でクルーの神作業（2.2秒）により3台をごぼう抜き。母国鈴鹿で日本人12年ぶり入賞の快挙。',
      safetyCarDeployments: '赤旗中断 1回 (1周目 アルボン & リカルド接触)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:27.064', driver: 'S. ベッテル', year: 2019, car: 'Ferrari SF90' },
      raceLapRecord: { time: '1:30.983', driver: 'L. ハミルトン', year: 2019, car: 'Mercedes W10' },
      mostWinsDriver: 'ミハエル・シューマッハ (6勝)',
      mostWinsTeam: 'マクラーレン (9勝) / フェラーリ (7勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 5,
      overtakeDifficultyIndex: 4,
      safetyCarProbabilityPercent: 48,
      pitLossSeconds: 22.4,
      undercutStrengthSeconds: '+1.5秒 / 周 (世界最強のアンダーカット効果)',
      projectedStrategy: 'S字コーナーの高横G負荷によりタイヤ摩耗はシーズン最大級。アンダーカットの破壊力が凄まじく、1周早いピットインが即逆転に直結する。',
    },
  },
  4: {
    round: 4,
    gpName: 'バーレーンGP',
    circuitId: 'bahrain-international',
    circuitName: 'バーレーン・インターナショナル・サーキット',
    country: 'バーレーン',
    flag: '🇧🇭',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 1, pitStops: 2 },
        { code: 'PER', name: 'セルジオ・ペレス', team: 'Red Bull', teamColor: '#3671C2', grid: 5, pitStops: 2 },
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 4, pitStops: 2 },
      ],
      polePosition: { code: 'VER', name: 'M. フェルスタッペン', time: '1:29.179' },
      fastestLap: { code: 'VER', name: 'M. フェルスタッペン', time: '1:32.608', lap: 39 },
      winningStrategy: 'SOFT(17) -> HARD(19) -> SOFT(21) のグランドスラム（ポール、全周首位、ファステスト、優勝）。',
      strategicTurningPoint: 'サインツがチームメイトのルクレール（ブレーキ温度差トラブル）とラッセルをアグレッシブにオーバーテイクし表彰台へ。',
      safetyCarDeployments: 'コーションなし (クリーンレース)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:27.264', driver: 'L. ハミルトン', year: 2020, car: 'Mercedes W11' },
      raceLapRecord: { time: '1:31.447', driver: 'P. デ・ラ・ロサ', year: 2005, car: 'McLaren MP4-20' },
      mostWinsDriver: 'ルイス・ハミルトン (5勝)',
      mostWinsTeam: 'フェラーリ (7勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 5,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 50,
      pitLossSeconds: 23.1,
      undercutStrengthSeconds: '+1.3秒 / 周',
      projectedStrategy: '粗いアスファルトによるリアタイヤのトラクション摩耗が極めて激しい。2ストップ（S-H-SまたはS-H-H）が鉄板。',
    },
  },
  5: {
    round: 5,
    gpName: 'サウジアラビアGP',
    circuitId: 'jeddah',
    circuitName: 'ジェッダ・コーニッシュ・サーキット',
    country: 'サウジアラビア',
    flag: '🇸🇦',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 1, pitStops: 1 },
        { code: 'PER', name: 'セルジオ・ペレス', team: 'Red Bull', teamColor: '#3671C2', grid: 3, pitStops: 1 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 2, pitStops: 1 },
      ],
      polePosition: { code: 'VER', name: 'M. フェルスタッペン', time: '1:27.472' },
      fastestLap: { code: 'LEC', name: 'C. ルクレール', time: '1:31.632', lap: 50 },
      winningStrategy: '7周目のストロールクラッシュによるSC時に一斉ピットイン（MEDIUM -> HARD 43周ステイアウト）の1ストップ。',
      strategicTurningPoint: '虫垂炎のサインツ代役として18歳のオリバー・ベアマンがフェラーリから急遽デビューし、堂々P7入賞でドライバー・オブ・ザ・デイ獲得。',
      safetyCarDeployments: 'フルSC 1回 (ストロールバリア激突)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:27.472', driver: 'M. フェルスタッペン', year: 2024, car: 'Red Bull RB20' },
      raceLapRecord: { time: '1:30.734', driver: 'L. ハミルトン', year: 2021, car: 'Mercedes W12' },
      mostWinsDriver: 'マックス・フェルスタッペン (2勝)',
      mostWinsTeam: 'レッドブル (3勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 2,
      overtakeDifficultyIndex: 3,
      safetyCarProbabilityPercent: 85,
      pitLossSeconds: 20.5,
      undercutStrengthSeconds: '+0.6秒 / 周',
      projectedStrategy: '世界最速の市街地サーキット（平均時速250km超）。SC発生率が85%と極めて高く、SCのタイミングで1ストップを消化するのが王道。',
    },
  },
  6: {
    round: 6,
    gpName: 'マイアミGP',
    circuitId: 'miami',
    circuitName: 'マイアミ・インターナショナル・オートドローム',
    country: 'アメリカ',
    flag: '🇺🇸',
    result2024: {
      podium: [
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 5, pitStops: 1 },
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 1, pitStops: 1 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 2, pitStops: 1 },
      ],
      polePosition: { code: 'VER', name: 'M. フェルスタッペン', time: '1:27.241' },
      fastestLap: { code: 'PIA', name: 'O. ピアストリ', time: '1:30.634', lap: 43 },
      winningStrategy: 'MEDIUM(29) -> HARD(28) の1ストップ。第1スティントを引っ張り、30周目のSC導入で無償ピットストップ（首位浮上）を完遂。',
      strategicTurningPoint: 'ノリスがF1参戦110戦目にして悲願の初優勝！SC再スタート後、フェルスタッペンを圧倒する異次元のレースペースで7.6秒差をつけて独走チェッカー。',
      safetyCarDeployments: 'フルSC 1回 (マグヌッセン & サージェント接触), VSC 1回',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:26.841', driver: 'M. フェルスタッペン', year: 2023, car: 'Red Bull RB19' },
      raceLapRecord: { time: '1:29.708', driver: 'M. フェルスタッペン', year: 2023, car: 'Red Bull RB19' },
      mostWinsDriver: 'マックス・フェルスタッペン (2勝)',
      mostWinsTeam: 'レッドブル (2勝) / マクラーレン (1勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 3,
      overtakeDifficultyIndex: 3,
      safetyCarProbabilityPercent: 67,
      pitLossSeconds: 21.0,
      undercutStrengthSeconds: '+0.9秒 / 周',
      projectedStrategy: '高温の路面温度（50℃超）。タイヤ表面のオーバーヒートを防ぎつつ第1スティントをどれだけ伸ばせるかが勝敗の分かれ目。',
    },
  },
  7: {
    round: 7,
    gpName: 'エミリア・ロマーニャGP (イモラ)',
    circuitId: 'imola',
    circuitName: 'イモラ・サーキット',
    country: 'イタリア',
    flag: '🇮🇹',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 1, pitStops: 1 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 2, pitStops: 1 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 3, pitStops: 1 },
      ],
      polePosition: { code: 'VER', name: 'M. フェルスタッペン', time: '1:14.746' },
      fastestLap: { code: 'RUS', name: 'G. ラッセル', time: '1:18.589', lap: 54 },
      winningStrategy: 'MEDIUM(24) -> HARD(39) の1ストップ。終盤タイヤの温度を失いノリスの猛追を受けるも0.725秒差で逃げ切り勝利。',
      strategicTurningPoint: '残り10周でノリスがハードタイヤのスイートスポットを掴み毎周0.5秒ずつ猛追。フェルスタッペンが限界ギリギリのバッテリーデプロイで防衛。',
      safetyCarDeployments: 'VSC 1回 (アルボン失格点検)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:13.609', driver: 'V. ボッタス', year: 2020, car: 'Mercedes W11' },
      raceLapRecord: { time: '1:15.484', driver: 'L. ハミルトン', year: 2020, car: 'Mercedes W11' },
      mostWinsDriver: 'ミハエル・シューマッハ (7勝)',
      mostWinsTeam: 'フェラーリ (8勝) / ウィリアムズ (8勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 2,
      overtakeDifficultyIndex: 5,
      safetyCarProbabilityPercent: 55,
      pitLossSeconds: 28.5,
      undercutStrengthSeconds: '+1.0秒 / 周',
      projectedStrategy: 'コース幅が狭くピットレーン走行ロスが28.5秒とシーズン屈指の長さ。抜けないため絶対的な1ストップが至上命題。',
    },
  },
  8: {
    round: 8,
    gpName: 'モナコGP',
    circuitId: 'circuit-de-monaco',
    circuitName: 'モンテカルロ市街地コース',
    country: 'モナコ',
    flag: '🇲🇨',
    result2024: {
      podium: [
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 1, pitStops: 1 },
        { code: 'PIA', name: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', grid: 2, pitStops: 1 },
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 3, pitStops: 1 },
      ],
      polePosition: { code: 'LEC', name: 'C. ルクレール', time: '1:10.270' },
      fastestLap: { code: 'HAM', name: 'L. ハミルトン', time: '1:14.165', lap: 54 },
      winningStrategy: '1周目赤旗中断中に全車タイヤ交換を完了（MEDIUM -> HARD 77周走行）。ピットストップなしの極限ペースコントロールで地元初制覇。',
      strategicTurningPoint: '1周目ボー・リバージュでペレスとハース2台が激突大破し赤旗。全車がピット義務を消化したため、ルクレールがレースを巧みにスローダウンさせてタイヤを保護し母国制覇。',
      safetyCarDeployments: '赤旗中断 1回 (1周目 3台大クラッシュ)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:10.166', driver: 'L. ハミルトン', year: 2019, car: 'Mercedes W10' },
      raceLapRecord: { time: '1:12.909', driver: 'L. ハミルトン', year: 2021, car: 'Mercedes W12' },
      mostWinsDriver: 'アイルトン・セナ (6勝)',
      mostWinsTeam: 'マクラーレン (15勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 1,
      overtakeDifficultyIndex: 5,
      safetyCarProbabilityPercent: 80,
      pitLossSeconds: 24.5,
      undercutStrengthSeconds: 'オーバーカットが優勢 (クリーンエアの猛プッシュ)',
      projectedStrategy: '世界一オーバーテイクが不可能なトラック。予選の1発が結果の95%を決定づける。',
    },
  },
  9: {
    round: 9,
    gpName: 'スペインGP (バルセロナ)',
    circuitId: 'catalunya',
    circuitName: 'カタロニア・サーキット',
    country: 'スペイン',
    flag: '🇪🇸',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 2, pitStops: 2 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 1, pitStops: 2 },
        { code: 'HAM', name: 'ルイス・ハミルトン', team: 'Mercedes', teamColor: '#00A19B', grid: 3, pitStops: 2 },
      ],
      polePosition: { code: 'NOR', name: 'L. ノリス', time: '1:11.383' },
      fastestLap: { code: 'NOR', name: 'L. ノリス', time: '1:17.115', lap: 51 },
      winningStrategy: 'スタート直後にラッセルとノリスを交わして首位を奪取。SOFT(17) -> MEDIUM(27) -> SOFT(22) の2ストップでノリスの追撃を振り切る。',
      strategicTurningPoint: 'オープニングラップのターン1でラッセルがアウトから衝撃のダブルオーバーテイク首位浮上。3周目にフェルスタッペンがラッセルを捕らえたのが決勝点。',
      safetyCarDeployments: 'コーションなし (クリーンレース)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:11.383', driver: 'L. ノリス', year: 2024, car: 'McLaren MCL38' },
      raceLapRecord: { time: '1:16.330', driver: 'M. フェルスタッペン', year: 2023, car: 'Red Bull RB19' },
      mostWinsDriver: 'M. シューマッハ & L. ハミルトン (各6勝)',
      mostWinsTeam: 'フェラーリ (12勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 4,
      overtakeDifficultyIndex: 3,
      safetyCarProbabilityPercent: 35,
      pitLossSeconds: 22.0,
      undercutStrengthSeconds: '+1.2秒 / 周',
      projectedStrategy: 'ターン3や最終ターン14の高速コーナリングにより左フロントに莫大なエネルギーがかかる。2ストップが主流。',
    },
  },
  10: {
    round: 10,
    gpName: 'カナダGP',
    circuitId: 'villeneuve',
    circuitName: 'ジル・ヴィルヌーヴ・サーキット',
    country: 'カナダ',
    flag: '🇨🇦',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 2, pitStops: 2 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 3, pitStops: 2 },
        { code: 'RUS', name: 'ジョージ・ラッセル', team: 'Mercedes', teamColor: '#00A19B', grid: 1, pitStops: 3 },
      ],
      polePosition: { code: 'RUS', name: 'G. ラッセル', time: '1:12.000 (同タイムでフェルスタッペン)' },
      fastestLap: { code: 'HAM', name: 'L. ハミルトン', time: '1:14.856', lap: 70 },
      winningStrategy: '雨と晴れが目まぐるしく入れ替わる激戦。INTER(25) -> INTER(17) -> MEDIUM(28) のタイヤ判断が勝敗を決定。',
      strategicTurningPoint: '25周目サージェントのクラッシュでSC導入時、首位ノリスがピット入口を行き過ぎてステイアウト。翌周ピットインでフェルスタッペンに首位逆転を許す。',
      safetyCarDeployments: 'フルSC 2回 (サージェント自爆, サインツ&アルボン接触)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:10.240', driver: 'S. ベッテル', year: 2019, car: 'Ferrari SF90' },
      raceLapRecord: { time: '1:13.078', driver: 'V. ボッタス', year: 2019, car: 'Mercedes W10' },
      mostWinsDriver: 'M. シューマッハ & L. ハミルトン (各7勝)',
      mostWinsTeam: 'マクラーレン (13勝) / フェラーリ (12勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 2,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 75,
      pitLossSeconds: 18.5,
      undercutStrengthSeconds: '+1.0秒 / 周',
      projectedStrategy: '名物チャンピオンズ・ウォールとストップ＆ゴーの性格。路面の進化（トラックエボリューション）が著しい。',
    },
  },
  // Add rounds 11 to 24 with high detail
  11: {
    round: 11,
    gpName: 'オーストリアGP',
    circuitId: 'redbull-ring',
    circuitName: 'レッドブル・リンク',
    country: 'オーストリア',
    flag: '🇦🇹',
    result2024: {
      podium: [
        { code: 'RUS', name: 'ジョージ・ラッセル', team: 'Mercedes', teamColor: '#00A19B', grid: 3, pitStops: 2 },
        { code: 'PIA', name: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', grid: 7, pitStops: 2 },
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 4, pitStops: 2 },
      ],
      polePosition: { code: 'VER', name: 'M. フェルスタッペン', time: '1:04.314' },
      fastestLap: { code: 'ALO', name: 'F. アロンソ', time: '1:07.694', lap: 70 },
      winningStrategy: '64周目の首位フェルスタッペンと2位ノリスの壮絶な接触同士討ち劇により、3位走行中のラッセルが漁夫の利で逆転優勝。',
      strategicTurningPoint: 'ターン3での激しいブレーキング攻防でノリスとフェルスタッペンのタイヤが接触・パンク。メルセデスに2022年ブラジル以来の勝利をもたらす。',
      safetyCarDeployments: 'VSC 1回 (首位同士討ちデブリ回収)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:02.939', driver: 'V. ボッタス', year: 2020, car: 'Mercedes W11' },
      raceLapRecord: { time: '1:05.619', driver: 'C. サインツ', year: 2020, car: 'McLaren MCL35' },
      mostWinsDriver: 'マックス・フェルスタッペン (4勝)',
      mostWinsTeam: 'メルセデス (6勝) / マクラーレン (6勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 4,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 50,
      pitLossSeconds: 20.0,
      undercutStrengthSeconds: '+1.3秒 / 周',
      projectedStrategy: '全10コーナーと短いコース長（1周約65秒）。トラックリミット違反が多発するため、白線管理が極めてシビア。',
    },
  },
  12: {
    round: 12,
    gpName: 'イギリスGP (シルバーストン)',
    circuitId: 'silverstone',
    circuitName: 'シルバーストン・サーキット',
    country: 'イギリス',
    flag: '🇬🇧',
    result2024: {
      podium: [
        { code: 'HAM', name: 'ルイス・ハミルトン', team: 'Mercedes', teamColor: '#00A19B', grid: 2, pitStops: 2 },
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 4, pitStops: 2 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 3, pitStops: 2 },
      ],
      polePosition: { code: 'RUS', name: 'G. ラッセル', time: '1:25.819' },
      fastestLap: { code: 'SAI', name: 'C. サインツ', time: '1:28.293', lap: 52 },
      winningStrategy: '雨とドライの変わり目でノリスのソフト選択ミスを突いてハミルトンが首位奪回。945日ぶりの感動的な母国通算9勝目を達成。',
      strategicTurningPoint: '39周目に路面が乾いた際、マクラーレンがノリスに中古ソフトを履かせたのに対し、メルセデスは新品ソフトを投入。ハミルトンが巧みなタイヤセーブで逃げ切る。',
      safetyCarDeployments: 'VSC 0回, フルSC 0回 (波乱の雨レース)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:24.303', driver: 'L. ハミルトン', year: 2020, car: 'Mercedes W11' },
      raceLapRecord: { time: '1:27.097', driver: 'M. フェルスタッペン', year: 2020, car: 'Red Bull RB16' },
      mostWinsDriver: 'ルイス・ハミルトン (9勝 - 同一コース最多記録)',
      mostWinsTeam: 'フェラーリ (18勝) / マクラーレン (14勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 5,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 58,
      pitLossSeconds: 21.8,
      undercutStrengthSeconds: '+1.4秒 / 周',
      projectedStrategy: 'マゴッツ・ベケッツの超高速S字。横Gが5.5Gに達するためフロントタイヤに最も過酷なグランプリの一つ。',
    },
  },
  13: {
    round: 13,
    gpName: 'ハンガリーGP',
    circuitId: 'hungaroring',
    circuitName: 'ハンガロリンク',
    country: 'ハンガリー',
    flag: '🇭🇺',
    result2024: {
      podium: [
        { code: 'PIA', name: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', grid: 2, pitStops: 2 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 1, pitStops: 2 },
        { code: 'HAM', name: 'ルイス・ハミルトン', team: 'Mercedes', teamColor: '#00A19B', grid: 5, pitStops: 2 },
      ],
      polePosition: { code: 'NOR', name: 'L. ノリス', time: '1:15.227' },
      fastestLap: { code: 'RUS', name: 'G. ラッセル', time: '1:20.305', lap: 55 },
      winningStrategy: 'マクラーレン1-2。第2ピットでアンダーカットされたノリスがチームオーダーに従い残り3周でピアストリに首位を譲り、ピアストリがF1初優勝。',
      strategicTurningPoint: 'マクラーレンの無線で繰り広げられた「Remember every Sunday morning meeting」の緊迫ドラマ。ハミルトンとフェルスタッペンがターン1で接触し表彰台争い決着。',
      safetyCarDeployments: 'VSC 1回',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:13.447', driver: 'L. ハミルトン', year: 2020, car: 'Mercedes W11' },
      raceLapRecord: { time: '1:16.627', driver: 'L. ハミルトン', year: 2020, car: 'Mercedes W11' },
      mostWinsDriver: 'ルイス・ハミルトン (8勝)',
      mostWinsTeam: 'マクラーレン (12勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 4,
      overtakeDifficultyIndex: 4,
      safetyCarProbabilityPercent: 30,
      pitLossSeconds: 21.5,
      undercutStrengthSeconds: '+1.6秒 / 周',
      projectedStrategy: '「壁のないモナコ」と呼ばれるツイスティなレイアウト。抜きにくいためアンダーカットを仕掛けた側が圧倒的に強い。',
    },
  },
  14: {
    round: 14,
    gpName: 'ベルギーGP (スパ)',
    circuitId: 'spa-francorchamps',
    circuitName: 'スパ・フランコルシャン',
    country: 'ベルギー',
    flag: '🇧🇪',
    result2024: {
      podium: [
        { code: 'HAM', name: 'ルイス・ハミルトン', team: 'Mercedes', teamColor: '#00A19B', grid: 3, pitStops: 2 },
        { code: 'PIA', name: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', grid: 5, pitStops: 2 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 1, pitStops: 2 },
      ],
      polePosition: { code: 'LEC', name: 'C. ルクレール', time: '1:53.754 (雨。最速はVERの1:53.159もPU降格)' },
      fastestLap: { code: 'PER', name: 'S. ペレス', time: '1:44.701', lap: 44 },
      winningStrategy: 'ラッセルが敢行した神がかり的1ストップ（HARD 34周）でトップチェッカーも、レース後車検で車重が1.5kg軽く失格。繰り上がりでハミルトンが勝利。',
      strategicTurningPoint: 'ラッセルの失格劇。タイヤのゴム摩耗分（ピレリによると約1kg強）とクーリングインラップでのピックアップ拾い不足が悲劇を招いた。',
      safetyCarDeployments: 'コーションなし (クリーンレース)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:41.252', driver: 'L. ハミルトン', year: 2020, car: 'Mercedes W11' },
      raceLapRecord: { time: '1:44.701', driver: 'S. ペレス', year: 2024, car: 'Red Bull RB20' },
      mostWinsDriver: 'ミハエル・シューマッハ (6勝)',
      mostWinsTeam: 'フェラーリ (18勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 4,
      overtakeDifficultyIndex: 1,
      safetyCarProbabilityPercent: 65,
      pitLossSeconds: 22.5,
      undercutStrengthSeconds: '+1.1秒 / 周',
      projectedStrategy: '全長7.004kmの長大なコース。ケメルストレートでのスリップストリーム＆DRSによる豪快な抜き合いが名物。',
    },
  },
  15: {
    round: 15,
    gpName: 'オランダGP (ザンドフォールト)',
    circuitId: 'zandvoort',
    circuitName: 'ザンドフォールト・サーキット',
    country: 'オランダ',
    flag: '🇳🇱',
    result2024: {
      podium: [
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 1, pitStops: 1 },
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 2, pitStops: 1 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 6, pitStops: 1 },
      ],
      polePosition: { code: 'NOR', name: 'L. ノリス', time: '1:09.673' },
      fastestLap: { code: 'NOR', name: 'L. ノリス', time: '1:13.817', lap: 72 },
      winningStrategy: 'MEDIUM(28) -> HARD(44) の1ストップ。地元フェルスタッペンの眼前で22.8秒の大差をつける歴史的圧勝。',
      strategicTurningPoint: 'スタートでフェルスタッペンが先行するも、18周目のターン1でノリスがアウトから楽々と再オーバーテイク。マクラーレンMCL38の圧倒的空力優位を証明。',
      safetyCarDeployments: 'コーションなし (クリーンレース)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:08.885', driver: 'M. フェルスタッペン', year: 2021, car: 'Red Bull RB16B' },
      raceLapRecord: { time: '1:11.097', driver: 'L. ハミルトン', year: 2021, car: 'Mercedes W12' },
      mostWinsDriver: 'ジム・クラーク (4勝)',
      mostWinsTeam: 'フェラーリ (8勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 3,
      overtakeDifficultyIndex: 4,
      safetyCarProbabilityPercent: 55,
      pitLossSeconds: 21.0,
      undercutStrengthSeconds: '+1.2秒 / 周',
      projectedStrategy: '18度の強烈なバンクコーナー（ターン3・ターン14）。狭いためアンダーカットとクリーンエア確保が生命線。',
    },
  },
  16: {
    round: 16,
    gpName: 'イタリアGP (モンツァ)',
    circuitId: 'monza',
    circuitName: 'モンツァ・サーキット',
    country: 'イタリア',
    flag: '🇮🇹',
    result2024: {
      podium: [
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 4, pitStops: 1 },
        { code: 'PIA', name: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', grid: 2, pitStops: 2 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 1, pitStops: 2 },
      ],
      polePosition: { code: 'NOR', name: 'L. ノリス', time: '1:19.327' },
      fastestLap: { code: 'NOR', name: 'L. ノリス', time: '1:21.432', lap: 53 },
      winningStrategy: 'ティフォシ狂乱の1ストップ大逆転劇！マクラーレン勢が2ストップを選んだ隙を突き、ルクレールがHARDタイヤで38周を保たせて母国モンツァ制覇。',
      strategicTurningPoint: 'マクラーレンが左フロントのグレイニングに怯えてピアストリを2回目のピットに呼んだ瞬間、フェラーリは1ストップ完走を決断。ルクレールがタイヤマネジメントの極致を実演。',
      safetyCarDeployments: 'コーションなし (クリーンレース)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:18.887', driver: 'L. ハミルトン', year: 2020, car: 'Mercedes W11' },
      raceLapRecord: { time: '1:21.046', driver: 'R. バリチェロ', year: 2004, car: 'Ferrari F2004' },
      mostWinsDriver: 'M. シューマッハ & L. ハミルトン (各5勝)',
      mostWinsTeam: 'フェラーリ (20勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 3,
      overtakeDifficultyIndex: 1,
      safetyCarProbabilityPercent: 50,
      pitLossSeconds: 24.5,
      undercutStrengthSeconds: '+0.8秒 / 周',
      projectedStrategy: '平均時速260km超の「神殿」。超低ドラッグウィングで走るためブレーキング時のタイヤロックアップ（フラットスポット）が命取り。',
    },
  },
  17: {
    round: 17,
    gpName: 'アゼルバイジャンGP (バクー)',
    circuitId: 'baku',
    circuitName: 'バクー市街地コース',
    country: 'アゼルバイジャン',
    flag: '🇦🇿',
    result2024: {
      podium: [
        { code: 'PIA', name: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', grid: 2, pitStops: 1 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 1, pitStops: 1 },
        { code: 'RUS', name: 'ジョージ・ラッセル', team: 'Mercedes', teamColor: '#00A19B', grid: 5, pitStops: 1 },
      ],
      polePosition: { code: 'LEC', name: 'C. ルクレール', time: '1:41.365' },
      fastestLap: { code: 'NOR', name: 'L. ノリス', time: '1:45.255', lap: 42 },
      winningStrategy: '20周目のターン1でピアストリが超ロングレイトブレーキングでルクレールを強襲奪首。以降30周にわたる息詰まるディフェンスで勝利。',
      strategicTurningPoint: '残り2周で3位争いをしていたペレスとサインツがターン2立ち上がりで接触しコンクリートウォールに大破クラッシュ。VSC下でチェッカー。',
      safetyCarDeployments: 'VSC 1回 (50周目 サインツ & ペレス大激突)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:40.203', driver: 'C. ルクレール', year: 2023, car: 'Ferrari SF-23' },
      raceLapRecord: { time: '1:43.009', driver: 'C. ルクレール', year: 2019, car: 'Ferrari SF90' },
      mostWinsDriver: 'セルジオ・ペレス (2勝)',
      mostWinsTeam: 'レッドブル (4勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 2,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 70,
      pitLossSeconds: 20.8,
      undercutStrengthSeconds: '+1.0秒 / 周',
      projectedStrategy: '幅7.6mの旧市街地キャッスルセクションと2.2kmの超ロングストレート。スリップストリームが強力無比。',
    },
  },
  18: {
    round: 18,
    gpName: 'シンガポールGP (マリーナベイ)',
    circuitId: 'singapore',
    circuitName: 'マリーナベイ市街地コース',
    country: 'シンガポール',
    flag: '🇸🇬',
    result2024: {
      podium: [
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 1, pitStops: 1 },
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 2, pitStops: 1 },
        { code: 'PIA', name: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', grid: 5, pitStops: 1 },
      ],
      polePosition: { code: 'NOR', name: 'L. ノリス', time: '1:29.525' },
      fastestLap: { code: 'RIC', name: 'D. リカルド', time: '1:34.486', lap: 60 },
      winningStrategy: 'MEDIUM(30) -> HARD(32) の1ストップ。ノリスが2度のウォールヒット寸前の危機を乗り越え、20.9秒差の独走ポール・トゥ・ウィン。',
      strategicTurningPoint: 'シンガポールGP史上初となる「SCおよびVSCが1度も出ないクリーンレース」。リカルドが最終周にソフトでファステストを奪いノリスの満点阻止。',
      safetyCarDeployments: 'コーションなし (史上初！)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:29.525', driver: 'L. ノリス', year: 2024, car: 'McLaren MCL38' },
      raceLapRecord: { time: '1:34.486', driver: 'D. リカルド', year: 2024, car: 'RB VCARB01' },
      mostWinsDriver: 'セバスチャン・ベッテル (5勝)',
      mostWinsTeam: 'メルセデス (4勝) / フェラーリ (4勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 3,
      overtakeDifficultyIndex: 4,
      safetyCarProbabilityPercent: 85,
      pitLossSeconds: 28.0,
      undercutStrengthSeconds: '+1.4秒 / 周',
      projectedStrategy: '高温多湿の過酷なナイトレース。ドライバーは2時間近く集中力を強いられ、3kgの水分を失う。',
    },
  },
  19: {
    round: 19,
    gpName: 'アメリカGP (オースティン)',
    circuitId: 'cota',
    circuitName: 'サーキット・オブ・ジ・アメリカズ',
    country: 'アメリカ',
    flag: '🇺🇸',
    result2024: {
      podium: [
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 4, pitStops: 1 },
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 3, pitStops: 1 },
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 2, pitStops: 1 },
      ],
      polePosition: { code: 'NOR', name: 'L. ノリス', time: '1:32.330' },
      fastestLap: { code: 'OCO', name: 'E. オコン', time: '1:37.330', lap: 53 },
      winningStrategy: 'スタートのターン1でノリスとフェルスタッペンがやり合うインを突いてルクレールがP4から首位へ躍進。フェラーリ見事な1-2フィニッシュ。',
      strategicTurningPoint: '終盤のターン12でノリスがコース外からフェルスタッペンを抜き5秒ペナルティを受けP4転落。エイペックス優先権ガイドラインの解釈が世界中を揺るがす。',
      safetyCarDeployments: 'フルSC 1回 (ハミルトン序盤スピンスタック)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:32.029', driver: 'V. ボッタス', year: 2019, car: 'Mercedes W10' },
      raceLapRecord: { time: '1:36.169', driver: 'C. ルクレール', year: 2019, car: 'Ferrari SF90' },
      mostWinsDriver: 'ルイス・ハミルトン (5勝)',
      mostWinsTeam: 'メルセデス (5勝) / フェラーリ (4勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 4,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 60,
      pitLossSeconds: 20.5,
      undercutStrengthSeconds: '+1.3秒 / 周',
      projectedStrategy: '高低差40mのターン1とシルバーストン風の連続S字。バンピーな路面とプランク摩耗対策が鍵。',
    },
  },
  20: {
    round: 20,
    gpName: 'メキシコGP',
    circuitId: 'mexico',
    circuitName: 'エルマノス・ロドリゲス・サーキット',
    country: 'メキシコ',
    flag: '🇲🇽',
    result2024: {
      podium: [
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 1, pitStops: 1 },
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 3, pitStops: 1 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 4, pitStops: 2 },
      ],
      polePosition: { code: 'SAI', name: 'C. サインツ', time: '1:15.946' },
      fastestLap: { code: 'LEC', name: 'C. ルクレール', time: '1:18.336', lap: 71 },
      winningStrategy: 'サインツが完璧なポール・トゥ・ウィン。フェルスタッペンがノリスとのバトルで合計20秒の重罰ペナルティを受けP6後退。',
      strategicTurningPoint: '10周目にフェルスタッペンがノリスをターン4とターン8で立て続けにコース外へ押し出し、10秒×2の計20秒加算ペナルティ。サインツが堂々の完勝。',
      safetyCarDeployments: 'フルSC 1回 (スタート直後 角田&アルボン接触クラッシュ)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:14.758', driver: 'M. フェルスタッペン', year: 2019, car: 'Red Bull RB15' },
      raceLapRecord: { time: '1:17.774', driver: 'V. ボッタス', year: 2021, car: 'Mercedes W12' },
      mostWinsDriver: 'マックス・フェルスタッペン (5勝)',
      mostWinsTeam: 'レッドブル (5勝) / ウィリアムズ (3勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 2,
      overtakeDifficultyIndex: 3,
      safetyCarProbabilityPercent: 65,
      pitLossSeconds: 22.0,
      undercutStrengthSeconds: '+0.8秒 / 周',
      projectedStrategy: '標高2,285mの希薄な空気。空気が薄いため最大ダウンフォースをつけても空気抵抗が極小。ブレーキとPUの冷却管理が限界を迎える。',
    },
  },
  21: {
    round: 21,
    gpName: 'サンパウロGP (インテルラゴス)',
    circuitId: 'interlagos',
    circuitName: 'インテルラゴス・サーキット',
    country: 'ブラジル',
    flag: '🇧🇷',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 17, pitStops: 1 },
        { code: 'OCO', name: 'エステバン・オコン', team: 'Alpine', teamColor: '#0093cc', grid: 4, pitStops: 1 },
        { code: 'GAS', name: 'ピエール・ガスリー', team: 'Alpine', teamColor: '#0093cc', grid: 13, pitStops: 1 },
      ],
      polePosition: { code: 'NOR', name: 'L. ノリス', time: '1:23.405 (雨)' },
      fastestLap: { code: 'VER', name: 'M. フェルスタッペン', time: '1:20.472', lap: 67 },
      winningStrategy: 'F1史に残る豪雨の奇跡！17番グリッドからスタートしたフェルスタッペンが1周で6台抜き、異次元の雨天ライン取りで17連発ファステストを叩き出して大逆転優勝。',
      strategicTurningPoint: '豪雨赤旗中断の直前にアルピーヌ2台とフェルスタッペンがタイヤ交換せずステイアウト。無償赤旗タイヤ交換を成功させアルピーヌが衝撃のW表彰台（P2 & P3）。',
      safetyCarDeployments: '赤旗中断 1回 (コラピントクラッシュ), VSC 2回, フルSC 1回',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:07.281', driver: 'L. ハミルトン', year: 2018, car: 'Mercedes W09' },
      raceLapRecord: { time: '1:10.540', driver: 'V. ボッタス', year: 2018, car: 'Mercedes W09' },
      mostWinsDriver: 'アラン・プロスト (6勝)',
      mostWinsTeam: 'マクラーレン (12勝) / フェラーリ (11勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 4,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 75,
      pitLossSeconds: 20.8,
      undercutStrengthSeconds: '+1.3秒 / 周',
      projectedStrategy: '天候急変と反時計回りの名門。セナS字と登り坂のホームストレートでオーバーテイクが連発する。',
    },
  },
  22: {
    round: 22,
    gpName: 'ラスベガスGP',
    circuitId: 'las-vegas',
    circuitName: 'ラスベガス・ストリップ・サーキット',
    country: 'アメリカ',
    flag: '🇺🇸',
    result2024: {
      podium: [
        { code: 'RUS', name: 'ジョージ・ラッセル', team: 'Mercedes', teamColor: '#00A19B', grid: 1, pitStops: 2 },
        { code: 'HAM', name: 'ルイス・ハミルトン', team: 'Mercedes', teamColor: '#00A19B', grid: 10, pitStops: 2 },
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 3, pitStops: 2 },
      ],
      polePosition: { code: 'RUS', name: 'G. ラッセル', time: '1:32.312' },
      fastestLap: { code: 'NOR', name: 'L. ノリス', time: '1:35.908', lap: 50 },
      winningStrategy: 'メルセデスが極寒のラスベガスで1-2完勝！フェルスタッペンがP5フィニッシュにより通算4度目のワールドチャンピオンをここで確定。',
      strategicTurningPoint: '夜間気温13℃の低温路面でメルセデスW15がタイヤを完璧に作動ウィンドウに乗せ他を圧倒。フェルスタッペンがノリスの前でゴールしタイトル決定。',
      safetyCarDeployments: 'VSC 1回',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:32.312', driver: 'G. ラッセル', year: 2024, car: 'Mercedes W15' },
      raceLapRecord: { time: '1:35.490', driver: 'O. ピアストリ', year: 2023, car: 'McLaren MCL60' },
      mostWinsDriver: 'M. フェルスタッペン & G. ラッセル (各1勝)',
      mostWinsTeam: 'レッドブル (1勝) / メルセデス (1勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 2,
      overtakeDifficultyIndex: 2,
      safetyCarProbabilityPercent: 65,
      pitLossSeconds: 20.0,
      undercutStrengthSeconds: '+0.7秒 / 周',
      projectedStrategy: 'ストリップ通りを350km/hで駆け抜ける超高速ナイトコース。低気温によるタイヤウォームアップが最大の技術的課題。',
    },
  },
  23: {
    round: 23,
    gpName: 'カタールGP (ロサイル)',
    circuitId: 'losail',
    circuitName: 'ロサイル・インターナショナル・サーキット',
    country: 'カタール',
    flag: '🇶🇦',
    result2024: {
      podium: [
        { code: 'VER', name: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C2', grid: 2, pitStops: 2 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 5, pitStops: 2 },
        { code: 'PIA', name: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', grid: 4, pitStops: 2 },
      ],
      polePosition: { code: 'RUS', name: 'G. ラッセル', time: '1:21.059 (VER予選妨害で1グリッド降格)' },
      fastestLap: { code: 'NOR', name: 'L. ノリス', time: '1:24.088', lap: 56 },
      winningStrategy: 'スタートのターン1でフェルスタッペンがラッセルを捕らえて首位へ。ピットストップペナルティやSCの混乱を冷静に切り抜け完勝。',
      strategicTurningPoint: '黄旗無視によりノリスがストップ＆ゴー10秒ペナルティを受け後退。コンストラクターズタイトル争いが最終戦アブダビへ持ち越しに。',
      safetyCarDeployments: 'フルSC 3回 (デブリ散乱および接触事故)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:20.827', driver: 'L. ハミルトン', year: 2021, car: 'Mercedes W12' },
      raceLapRecord: { time: '1:23.196', driver: 'M. フェルスタッペン', year: 2021, car: 'Red Bull RB16B' },
      mostWinsDriver: 'マックス・フェルスタッペン (2勝)',
      mostWinsTeam: 'レッドブル (2勝) / メルセデス (1勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 5,
      overtakeDifficultyIndex: 3,
      safetyCarProbabilityPercent: 70,
      pitLossSeconds: 23.5,
      undercutStrengthSeconds: '+1.5秒 / 周',
      projectedStrategy: '中高速コーナーが連続するタイヤ泣かせのレイアウト。縁石のピラミッド形状によるタイヤ損傷リスクが高く2ストップ必至。',
    },
  },
  24: {
    round: 24,
    gpName: 'アブダビGP (ヤス・マリーナ)',
    circuitId: 'yas-marina',
    circuitName: 'ヤス・マリーナ・サーキット',
    country: 'アラブ首長国連邦',
    flag: '🇦🇪',
    result2024: {
      podium: [
        { code: 'NOR', name: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', grid: 1, pitStops: 1 },
        { code: 'SAI', name: 'カルロス・サインツ', team: 'Ferrari', teamColor: '#E80020', grid: 3, pitStops: 1 },
        { code: 'LEC', name: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', grid: 19, pitStops: 1 },
      ],
      polePosition: { code: 'NOR', name: 'L. ノリス', time: '1:22.595' },
      fastestLap: { code: 'NOR', name: 'L. ノリス', time: '1:26.545', lap: 54 },
      winningStrategy: 'ノリスがポール・トゥ・ウィンで完勝！マクラーレンが1998年以来26年ぶりとなるコンストラクターズワールドチャンピオンを奪還！',
      strategicTurningPoint: 'マクラーレンの戴冠劇。フェラーリはルクレールが19番グリッドから3位表彰台まで猛烈に追い上げるも、マクラーレンが21ポイント差で王座を確定。',
      safetyCarDeployments: 'フルSC 1回 (1周目 ペレス&ガスリー接触)',
    },
    circuitRecords: {
      qualifyingRecord: { time: '1:22.109', driver: 'M. フェルスタッペン', year: 2021, car: 'Red Bull RB16B' },
      raceLapRecord: { time: '1:26.103', driver: 'M. フェルスタッペン', year: 2021, car: 'Red Bull RB16B' },
      mostWinsDriver: 'ルイス・ハミルトン (5勝)',
      mostWinsTeam: 'メルセデス (6勝) / レッドブル (6勝)',
    },
    tacticalProfile: {
      tyreDegradationIndex: 3,
      overtakeDifficultyIndex: 3,
      safetyCarProbabilityPercent: 50,
      pitLossSeconds: 22.0,
      undercutStrengthSeconds: '+1.1秒 / 周',
      projectedStrategy: 'トワイライトレース。日没とともに路面温度が急激に下がるため、第1スティントと第2スティントでタイヤの挙動が激変する。',
    },
  },
};

export function getGrandPrixReportByRound(round: number): GrandPrixReportData | undefined {
  return GRAND_PRIX_REPORTS[round];
}
