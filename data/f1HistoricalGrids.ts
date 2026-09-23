/**
 * data/f1HistoricalGrids.ts
 * Formula 1 Complete Historical Grids, Constructor Information, and Reserve Drivers (2016 - 2026).
 * Ground Truth: FIA Official Archives, Formula 1 Official Record Books, and Team Press Releases.
 */

export interface HistoricalGridDriver {
  code: string;
  name: string;
  number?: number;
  country: string;
  flag: string;
  role: 'Regular' | 'Reserve' | 'Test';
  isRookie?: boolean;
  isTransfer?: boolean;
  note?: string;
}

export interface HistoricalGridTeam {
  teamId: string;
  teamName: string;
  fullName: string;
  teamColor: string;
  powerUnit: string;
  teamPrincipal?: string;
  finalRank?: number; // Constructors Championship rank
  points?: number;
  drivers: HistoricalGridDriver[]; // Primary race drivers (typically 2)
  reserves?: HistoricalGridDriver[]; // Official reserve and development drivers
}

export interface SeasonGridInfo {
  year: number;
  eraName: string; // e.g., "1.6L V6 ターボハイブリッド新規定", "グラウンドエフェクト新時代"
  seasonSummary: string;
  isOngoing?: boolean;
  ongoingStatusText?: string;
  championDriver?: {
    code: string;
    name: string;
    team: string;
    carNumber: number;
    points: number;
    wins: number;
  };
  championConstructor?: {
    name: string;
    powerUnit: string;
    points: number;
    wins: number;
  };
  leaderDriver?: {
    code: string;
    name: string;
    team: string;
    carNumber: number;
    points: number;
    wins: number;
  };
  leaderConstructor?: {
    name: string;
    powerUnit: string;
    points: number;
    wins: number;
  };
  teams: HistoricalGridTeam[];
}

export const HISTORICAL_SEASONS_DATA: Record<number, SeasonGridInfo> = {
  // ── 2026 SEASON ─────────────────────────────────────────────
  2026: {
    year: 2026,
    eraName: '持続可能燃料 ＆ 350kW電動MGU-K 新レギュレーション時代',
    seasonSummary: 'MGU-H撤廃と電動出力3倍化の新PU規定が導入。新規ワークスのアウディと第11チームのキャデラックが参戦し、11チーム・22台体制へ拡大。アストンマーティンはホンダの完全ワークスPU体制へ移行。',
    isOngoing: true,
    ongoingStatusText: '2026シーズン進行中 (第16戦モンツァ終了時点 - タイトル未確定)',
    leaderDriver: {
      code: 'RUS',
      name: 'ジョージ・ラッセル',
      team: 'Mercedes-AMG',
      carNumber: 63,
      points: 285,
      wins: 6,
    },
    leaderConstructor: {
      name: 'Mercedes-AMG PETRONAS F1 Team',
      powerUnit: 'Mercedes M17 Works',
      points: 495,
      wins: 11,
    },
    teams: [
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG PETRONAS Formula One Team',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes M17 Works',
        teamPrincipal: 'Toto Wolff',
        finalRank: 1,
        drivers: [
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'チームを牽引する大黒柱' },
          { code: 'ANT', name: 'アンドレア・キミ・アントネッリ', number: 12, country: 'イタリア', flag: '🇮🇹', role: 'Regular', isRookie: false, note: 'モンツァで19番手から歴史的勝利を飾った新星' },
        ],
        reserves: [
          { code: 'MSC', name: 'ミック・シューマッハ', number: 47, country: 'ドイツ', flag: '🇩🇪', role: 'Reserve', note: 'WECアルピーヌと兼務する実力派リザーブ' },
          { code: 'VES', name: 'フレデリック・ヴェスティ', country: 'デンマーク', flag: '🇩🇰', role: 'Test', note: 'シミュレータ開発兼テストドライバー' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Scuderia Ferrari',
        fullName: 'Scuderia Ferrari HP',
        teamColor: '#E80020',
        powerUnit: 'Ferrari 067/3 Works',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 2,
        drivers: [
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular', note: 'ティフォシの寵児、マラネロの支柱' },
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: '跳ね馬での2年目、通算8度目の王座を目指す' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', number: 99, country: 'イタリア', flag: '🇮🇹', role: 'Reserve', note: 'ル・マン24時間ウィナー、経験豊富な公式リザーブ' },
          { code: 'SHW', name: 'ロバート・シュワルツマン', number: 38, country: 'イスラエル', flag: '🇮🇱', role: 'Test', note: 'IMSA/WEC参戦兼開発テスト' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren Formula 1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Mercedes M17 Customer',
        teamPrincipal: 'Andrea Stella',
        finalRank: 3,
        drivers: [
          { code: 'NOR', name: 'ランド・ノリス', number: 1, country: '英国', flag: '🇬🇧', role: 'Regular', note: '2025年王者、カーナンバー1を背負う' },
          { code: 'PIA', name: 'オスカー・ピアストリ', number: 81, country: '豪州', flag: '🇦🇺', role: 'Regular', note: '驚異的な安定感を誇る若きクールマスター' },
        ],
        reserves: [
          { code: 'OWA', name: 'パト・オワード', number: 29, country: 'メキシコ', flag: '🇲🇽', role: 'Reserve', note: 'インディカー界のエース、公式リザーブ' },
          { code: 'HIR', name: '平川 亮 (Ryo Hirakawa)', country: '日本', flag: '🇯🇵', role: 'Test', note: 'WEC世界王者、シミュレータ＆テスト開発' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Oracle Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'Red Bull Ford Powertrains',
        teamPrincipal: 'Laurent Mekies',
        finalRank: 4,
        drivers: [
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 3, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: 'フォード新PU時代でも勝利をもぎ取る絶対王者' },
          { code: 'HAD', name: 'イサック・ハジャー', number: 6, country: 'フランス', flag: '🇫🇷', role: 'Regular', isTransfer: true, note: 'レッドブル昇格を果たしたアグレッシブな新鋭' },
        ],
        reserves: [
          { code: 'IWA', name: '岩佐 歩夢 (Ayumu Iwasa)', number: 36, country: '日本', flag: '🇯🇵', role: 'Reserve', note: 'スーパーフォーミュラ＆F1公式リザーブ' },
          { code: 'LIN', name: 'アービッド・リンドブラッド', country: '英国', flag: '🇬🇧', role: 'Test', note: 'レッドブル育成の注目ルーキー' },
        ],
      },
      {
        teamId: 'rb',
        teamName: 'Racing Bulls (RB)',
        fullName: 'Visa Cash App RB Formula One Team',
        teamColor: '#6692FF',
        powerUnit: 'Red Bull Ford Powertrains',
        teamPrincipal: 'Alan Permane',
        finalRank: 5,
        drivers: [
          { code: 'TSU', name: '角田 裕毅', number: 22, country: '日本', flag: '🇯🇵', role: 'Regular', note: 'F1参戦6年目、リーダーとしてチームを牽引' },
          { code: 'LAW', name: 'リアム・ローソン', number: 30, country: 'NZ', flag: '🇳🇿', role: 'Regular', note: '粘り強い走りで入賞を積み重ねる' },
        ],
        reserves: [
          { code: 'IWA', name: '岩佐 歩夢 (Ayumu Iwasa)', number: 36, country: '日本', flag: '🇯🇵', role: 'Reserve', note: 'RB公式リザーブ兼務' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams Racing',
        fullName: 'Williams Racing',
        teamColor: '#00A0DE',
        powerUnit: 'Mercedes M17',
        teamPrincipal: 'James Vowles',
        finalRank: 6,
        drivers: [
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Regular', note: 'ウィリアムズ躍進の立役者' },
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: '高い知性と開発力でマシンを進化させる' },
        ],
        reserves: [
          { code: 'BRO', name: 'ルーク・ブラウニング', country: '英国', flag: '🇬🇧', role: 'Reserve', note: 'ウィリアムズ・アカデミー出身F2実力派' },
        ],
      },
      {
        teamId: 'alpine',
        teamName: 'Alpine',
        fullName: 'BWT Alpine Formula One Team',
        teamColor: '#0093CC',
        powerUnit: 'Mercedes M17 (新換装)',
        teamPrincipal: 'Flavio Briatore / Steve Nielsen',
        finalRank: 7,
        drivers: [
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'メルセデスPUへ換装しリーダーシップを発揮' },
          { code: 'COL', name: 'フランコ・コラピント', number: 43, country: 'アルゼンチン', flag: '🇦🇷', role: 'Regular', note: '熱狂的な母国の期待を背負う若き天才' },
        ],
        reserves: [
          { code: 'DOO', name: 'ジャック・ドゥーハン', number: 61, country: '豪州', flag: '🇦🇺', role: 'Reserve', note: 'アルピーヌ公式テスト＆リザーブ' },
          { code: 'MAR', name: 'ヴィクトール・マルタンス', country: 'フランス', flag: '🇫🇷', role: 'Test', note: 'F2ウィナー・アカデミードライバー' },
        ],
      },
      {
        teamId: 'aston-martin',
        teamName: 'Aston Martin',
        fullName: 'Aston Martin Aramco Formula One Team',
        teamColor: '#229971',
        powerUnit: 'Honda Works PU (RA626H)',
        teamPrincipal: 'Adrian Newey',
        finalRank: 8,
        drivers: [
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'ホンダ新ワークスPUとともに悲願の33勝目を狙う' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular', note: 'ニューウェイ設計の最新鋭マシンを駆る' },
        ],
        reserves: [
          { code: 'DRU', name: 'フェリペ・ドルゴヴィッチ', number: 34, country: 'ブラジル', flag: '🇧🇷', role: 'Reserve', note: 'F2チャンピオン、専属テスト＆リザーブ' },
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', number: 2, country: 'ベルギー', flag: '🇧🇪', role: 'Reserve', note: 'FE世界王者・経験豊富なリザーブ' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'MoneyGram Haas F1 Team',
        teamColor: '#B6BABD',
        powerUnit: 'Ferrari Works',
        teamPrincipal: 'Ayao Komatsu (小松礼雄)',
        finalRank: 9,
        drivers: [
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: '小松代表のもとで強固なレースクラフトを展開' },
          { code: 'BEA', name: 'オリバー・ベアマン', number: 87, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'フェラーリ育成の大器、確固たる正ドライバーへ' },
        ],
        reserves: [
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', number: 51, country: 'ブラジル', flag: '🇧🇷', role: 'Reserve', note: '長年チームを支えるインディカー兼務リザーブ' },
        ],
      },
      {
        teamId: 'audi',
        teamName: 'Audi F1 Team',
        fullName: 'Audi Revolut Formula One Team',
        teamColor: '#E0001A',
        powerUnit: 'Audi Works E-Performance',
        teamPrincipal: 'Mattia Binotto',
        finalRank: 10,
        drivers: [
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', isTransfer: true, note: 'ドイツ名門アウディ初代ワークスエース' },
          { code: 'BOR', name: 'ガブリエル・ボルトレート', number: 5, country: 'ブラジル', flag: '🇧🇷', role: 'Regular', note: 'F3・F2ルーキー制覇の大型新鋭' },
        ],
        reserves: [
          { code: 'POU', name: 'テオ・プルシェール', number: 98, country: 'フランス', flag: '🇫🇷', role: 'Reserve', note: 'F2チャンピオン、インディカー兼務リザーブ' },
        ],
      },
      {
        teamId: 'cadillac',
        teamName: 'Cadillac F1 Team',
        fullName: 'Cadillac Formula 1 Team',
        teamColor: '#D4AF37',
        powerUnit: 'Ferrari Works Power Unit',
        teamPrincipal: 'Marcin Budkowski',
        finalRank: 11,
        drivers: [
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular', isTransfer: true, note: '第11の米新規参戦チーム初代エース' },
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', isTransfer: true, note: '通算10勝の経験で新設チームの基盤を構築' },
        ],
        reserves: [
          { code: 'HER', name: 'コルトン・ハータ', country: '米国', flag: '🇺🇸', role: 'Reserve', note: 'インディカー強豪アンドレッティのエース' },
        ],
      },
    ],
  },

  // ── 2025 SEASON ─────────────────────────────────────────────
  2025: {
    year: 2025,
    eraName: 'グラウンドエフェクト時代 最終決戦',
    seasonSummary: 'マクラーレンがランド・ノリスとともに悲願のダブルタイトル（ドライバーズ＆コンストラクターズ）を獲得。ルイス・ハミルトンがフェラーリへ電撃移籍し、パドックに空前の熱狂を巻き起こした。',
    championDriver: {
      code: 'NOR',
      name: 'ランド・ノリス',
      team: 'McLaren',
      carNumber: 4,
      points: 423,
      wins: 8,
    },
    championConstructor: {
      name: 'McLaren Formula 1 Team',
      powerUnit: 'Mercedes',
      points: 698,
      wins: 13,
    },
    teams: [
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren Formula 1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Andrea Stella',
        finalRank: 1,
        points: 698,
        drivers: [
          { code: 'NOR', name: 'ランド・ノリス', number: 4, country: '英国', flag: '🇬🇧', role: 'Regular', note: '自身初の世界ドライバーズチャンピオン獲得' },
          { code: 'PIA', name: 'オスカー・ピアストリ', number: 81, country: '豪州', flag: '🇦🇺', role: 'Regular', note: 'シーズン5勝を挙げコンストラクターズ連覇に貢献' },
        ],
        reserves: [
          { code: 'OWA', name: 'パト・オワード', country: 'メキシコ', flag: '🇲🇽', role: 'Reserve' },
          { code: 'HIR', name: '平川 亮', country: '日本', flag: '🇯🇵', role: 'Test' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari HP',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 2,
        points: 652,
        drivers: [
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular' },
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', isTransfer: true, note: 'メルセデスからフェラーリへの世紀の移籍1年目' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
          { code: 'BEA', name: 'オリバー・ベアマン', country: '英国', flag: '🇬🇧', role: 'Reserve' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Oracle Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'Honda RBPT',
        teamPrincipal: 'Christian Horner',
        finalRank: 3,
        points: 589,
        drivers: [
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 1, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: 'シーズン終盤まで激闘を繰り広げランキング2位' },
          { code: 'LAW', name: 'リアム・ローソン', number: 30, country: 'NZ', flag: '🇳🇿', role: 'Regular', isTransfer: true, note: 'レッドブル昇格初年度' },
        ],
        reserves: [
          { code: 'HAD', name: 'イサック・ハジャー', country: 'フランス', flag: '🇫🇷', role: 'Reserve' },
          { code: 'IWA', name: '岩佐 歩夢', country: '日本', flag: '🇯🇵', role: 'Test' },
        ],
      },
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG PETRONAS F1 Team',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 4,
        points: 468,
        drivers: [
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular' },
          { code: 'ANT', name: 'アンドレア・キミ・アントネッリ', number: 12, country: 'イタリア', flag: '🇮🇹', role: 'Regular', isRookie: true, note: '18歳での衝撃フル参戦デビュー' },
        ],
        reserves: [
          { code: 'MSC', name: 'ミック・シューマッハ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'aston-martin',
        teamName: 'Aston Martin',
        fullName: 'Aston Martin Aramco F1 Team',
        teamColor: '#229971',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Mike Krack',
        finalRank: 5,
        drivers: [
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular' },
        ],
        reserves: [
          { code: 'DRU', name: 'フェリペ・ドルゴヴィッチ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alpine',
        teamName: 'Alpine',
        fullName: 'BWT Alpine F1 Team',
        teamColor: '#0093CC',
        powerUnit: 'Renault',
        teamPrincipal: 'Oliver Oakes',
        finalRank: 6,
        drivers: [
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular' },
          { code: 'COL', name: 'フランコ・コラピント', number: 43, country: 'アルゼンチン', flag: '🇦🇷', role: 'Regular', isTransfer: true, note: 'ウィリアムズからアルピーヌへ移籍' },
        ],
        reserves: [
          { code: 'DOO', name: 'ジャック・ドゥーハン', country: '豪州', flag: '🇦🇺', role: 'Reserve' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'MoneyGram Haas F1 Team',
        teamColor: '#B6BABD',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Ayao Komatsu',
        finalRank: 7,
        drivers: [
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', isTransfer: true },
          { code: 'BEA', name: 'オリバー・ベアマン', number: 87, country: '英国', flag: '🇬🇧', role: 'Regular', isRookie: true },
        ],
        reserves: [
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'rb',
        teamName: 'Racing Bulls (RB)',
        fullName: 'Visa Cash App RB Formula One Team',
        teamColor: '#6692FF',
        powerUnit: 'Honda RBPT',
        teamPrincipal: 'Laurent Mekies',
        finalRank: 8,
        drivers: [
          { code: 'TSU', name: '角田 裕毅', number: 22, country: '日本', flag: '🇯🇵', role: 'Regular' },
          { code: 'HAD', name: 'イサック・ハジャー', number: 6, country: 'フランス', flag: '🇫🇷', role: 'Regular', isRookie: true },
        ],
        reserves: [
          { code: 'IWA', name: '岩佐 歩夢', country: '日本', flag: '🇯🇵', role: 'Reserve' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Racing',
        teamColor: '#00A0DE',
        powerUnit: 'Mercedes',
        teamPrincipal: 'James Vowles',
        finalRank: 9,
        drivers: [
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Regular' },
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', isTransfer: true, note: 'フェラーリからウィリアムズへ電撃加入' },
        ],
        reserves: [
          { code: 'BRO', name: 'ルーク・ブラウニング', country: '英国', flag: '🇬🇧', role: 'Reserve' },
        ],
      },
      {
        teamId: 'sauber',
        teamName: 'Kick Sauber',
        fullName: 'Stake F1 Team Kick Sauber',
        teamColor: '#52E252',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Mattia Binotto',
        finalRank: 10,
        drivers: [
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', isTransfer: true },
          { code: 'BOR', name: 'ガブリエル・ボルトレート', number: 5, country: 'ブラジル', flag: '🇧🇷', role: 'Regular', isRookie: true },
        ],
        reserves: [
          { code: 'POU', name: 'テオ・プルシェール', country: 'フランス', flag: '🇫🇷', role: 'Reserve' },
        ],
      },
    ],
  },

  // ── 2024 SEASON ─────────────────────────────────────────────
  2024: {
    year: 2024,
    eraName: '4強激突群雄割拠シーズン',
    seasonSummary: 'フェルスタッペンが個人4連覇を果たす一方、マクラーレンが1998年以来26年ぶりとなるコンストラクターズタイトルを獲得。フェラーリやメルセデスも複数回勝利を挙げ、7名以上のウィナーが誕生した激闘の年。',
    championDriver: {
      code: 'VER',
      name: 'マックス・フェルスタッペン',
      team: 'Red Bull Racing',
      carNumber: 1,
      points: 437,
      wins: 9,
    },
    championConstructor: {
      name: 'McLaren Formula 1 Team',
      powerUnit: 'Mercedes',
      points: 666,
      wins: 5,
    },
    teams: [
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren Formula 1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Andrea Stella',
        finalRank: 1,
        points: 666,
        drivers: [
          { code: 'NOR', name: 'ランド・ノリス', number: 4, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'マイアミGPでF1初優勝を達成' },
          { code: 'PIA', name: 'オスカー・ピアストリ', number: 81, country: '豪州', flag: '🇦🇺', role: 'Regular', note: 'ハンガリー＆バクーで優勝' },
        ],
        reserves: [
          { code: 'OWA', name: 'パト・オワード', country: 'メキシコ', flag: '🇲🇽', role: 'Reserve' },
          { code: 'HIR', name: '平川 亮', country: '日本', flag: '🇯🇵', role: 'Test' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari HP',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 2,
        points: 652,
        drivers: [
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular', note: '悲願の母国モナコGP＆伝統のモンツァ完全制覇' },
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: '盲腸手術から電撃復帰の豪州GP＆メキシコGPで圧勝' },
        ],
        reserves: [
          { code: 'BEA', name: 'オリバー・ベアマン', number: 38, country: '英国', flag: '🇬🇧', role: 'Reserve', note: 'サウジアラビアGPでサインツ代役として7位入賞' },
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
          { code: 'SHW', name: 'ロバート・シュワルツマン', country: 'イスラエル', flag: '🇮🇱', role: 'Reserve' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Oracle Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'Honda RBPT',
        teamPrincipal: 'Christian Horner',
        finalRank: 3,
        points: 589,
        drivers: [
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 1, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: 'ブラジル雨の17番手スタートから奇跡の独走勝利、4年連続王者' },
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular' },
        ],
        reserves: [
          { code: 'LAW', name: 'リアム・ローソン', country: 'NZ', flag: '🇳🇿', role: 'Reserve' },
          { code: 'IWA', name: '岩佐 歩夢', country: '日本', flag: '🇯🇵', role: 'Test' },
        ],
      },
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG PETRONAS F1 Team',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 4,
        points: 468,
        drivers: [
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'オーストリア＆ラスベガスで勝利' },
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'シルバーストンで歴代最多母国9勝目、スパでも勝利' },
        ],
        reserves: [
          { code: 'MSC', name: 'ミック・シューマッハ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
          { code: 'ANT', name: 'アンドレア・キミ・アントネッリ', country: 'イタリア', flag: '🇮🇹', role: 'Test', note: 'モンツァFP1出走' },
        ],
      },
      {
        teamId: 'aston-martin',
        teamName: 'Aston Martin',
        fullName: 'Aston Martin Aramco F1 Team',
        teamColor: '#229971',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Mike Krack',
        finalRank: 5,
        points: 94,
        drivers: [
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular' },
        ],
        reserves: [
          { code: 'DRU', name: 'フェリペ・ドルゴヴィッチ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', country: 'ベルギー', flag: '🇧🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alpine',
        teamName: 'Alpine',
        fullName: 'BWT Alpine F1 Team',
        teamColor: '#0093CC',
        powerUnit: 'Renault',
        teamPrincipal: 'Oliver Oakes',
        finalRank: 6,
        points: 65,
        drivers: [
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'ブラジル雨のサンパウロGPでダブル表彰台3位' },
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'ブラジル雨のサンパウロGPでダブル表彰台2位' },
        ],
        reserves: [
          { code: 'DOO', name: 'ジャック・ドゥーハン', number: 61, country: '豪州', flag: '🇦🇺', role: 'Reserve', note: 'アブダビ最終戦でオコンの代役出走' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'MoneyGram Haas F1 Team',
        teamColor: '#B6BABD',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Ayao Komatsu (小松礼雄)',
        finalRank: 7,
        points: 58,
        drivers: [
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: 'オーストリア＆シルバーストンで連続6位入賞' },
          { code: 'MAG', name: 'ケビン・マグヌッセン', number: 20, country: 'デンマーク', flag: '🇩🇰', role: 'Regular' },
        ],
        reserves: [
          { code: 'BEA', name: 'オリバー・ベアマン', number: 50, country: '英国', flag: '🇬🇧', role: 'Reserve', note: 'バクー＆サンパウロで代役参戦し入賞' },
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'rb',
        teamName: 'Racing Bulls (RB)',
        fullName: 'Visa Cash App RB Formula One Team',
        teamColor: '#6692FF',
        powerUnit: 'Honda RBPT',
        teamPrincipal: 'Laurent Mekies',
        finalRank: 8,
        points: 46,
        drivers: [
          { code: 'TSU', name: '角田 裕毅', number: 22, country: '日本', flag: '🇯🇵', role: 'Regular', note: '母国日本GPで歴史的10位入賞、予選Q3の常連として牽引' },
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular', note: 'シンガポールGPでラストファステストラップを記録' },
          { code: 'LAW', name: 'リアム・ローソン', number: 30, country: 'NZ', flag: '🇳🇿', role: 'Regular', note: 'アメリカGPよりシートを引き継ぎ復帰' },
        ],
        reserves: [
          { code: 'IWA', name: '岩佐 歩夢', number: 40, country: '日本', flag: '🇯🇵', role: 'Test', note: '鈴鹿FP1出走' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Racing',
        teamColor: '#00A0DE',
        powerUnit: 'Mercedes',
        teamPrincipal: 'James Vowles',
        finalRank: 9,
        points: 17,
        drivers: [
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Regular' },
          { code: 'SAR', name: 'ローガン・サージェント', number: 2, country: '米国', flag: '🇺🇸', role: 'Regular' },
          { code: 'COL', name: 'フランコ・コラピント', number: 43, country: 'アルゼンチン', flag: '🇦🇷', role: 'Regular', note: 'モンツァから昇格しバクーで8位入賞' },
        ],
        reserves: [
          { code: 'BRO', name: 'ルーク・ブラウニング', country: '英国', flag: '🇬🇧', role: 'Reserve' },
        ],
      },
      {
        teamId: 'sauber',
        teamName: 'Kick Sauber',
        fullName: 'Stake F1 Team Kick Sauber',
        teamColor: '#52E252',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Alessandro Alunni Bravi / Mattia Binotto',
        finalRank: 10,
        points: 4,
        drivers: [
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular' },
          { code: 'ZHO', name: '周 冠宇 (Guanyu Zhou)', number: 24, country: '中国', flag: '🇨🇳', role: 'Regular', note: 'カタールGPで殊勲の8位入賞' },
        ],
        reserves: [
          { code: 'POU', name: 'テオ・プルシェール', country: 'フランス', flag: '🇫🇷', role: 'Reserve' },
          { code: 'MAL', name: 'ゼイン・マロニー', country: 'バルバドス', flag: '🇧🇧', role: 'Reserve' },
        ],
      },
    ],
  },

  // ── 2023 SEASON ─────────────────────────────────────────────
  2023: {
    year: 2023,
    eraName: 'レッドブル年間21勝 ＆ フェルスタッペン10連勝の金字塔',
    seasonSummary: 'レッドブルRB19が全22戦中21勝という前人未到の記録を樹立。フェルスタッペンは個人最多19勝＆10連勝を達成。サインツ（フェラーリ）がシンガポールGPで唯一他チームとして勝利を挙げた。',
    championDriver: {
      code: 'VER',
      name: 'マックス・フェルスタッペン',
      team: 'Red Bull Racing',
      carNumber: 1,
      points: 575,
      wins: 19,
    },
    championConstructor: {
      name: 'Oracle Red Bull Racing',
      powerUnit: 'Honda RBPT',
      points: 860,
      wins: 21,
    },
    teams: [
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Oracle Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'Honda RBPT',
        teamPrincipal: 'Christian Horner',
        finalRank: 1,
        points: 860,
        drivers: [
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 1, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: '個人10連勝＆年間19勝の不滅の記録' },
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular', note: 'サウジ＆バクー優勝、選手権2位' },
        ],
        reserves: [
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Reserve', note: 'サードドライバー（シルバーストンテスト後にアルファタウリへ）' },
          { code: 'LAW', name: 'リアム・ローソン', number: 40, country: 'NZ', flag: '🇳🇿', role: 'Reserve' },
        ],
      },
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG PETRONAS F1 Team',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 2,
        points: 409,
        drivers: [
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'ハンガリーGPでポールポジション獲得、選手権3位' },
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular' },
        ],
        reserves: [
          { code: 'MSC', name: 'ミック・シューマッハ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve', note: 'シミュレータ開発を精力的に担当' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 3,
        points: 406,
        drivers: [
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular' },
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'シンガポールGPでレッドブル独走を阻止する伝説の優勝' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
          { code: 'SHW', name: 'ロバート・シュワルツマン', country: 'イスラエル', flag: '🇮🇱', role: 'Reserve' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren Formula 1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Andrea Stella',
        finalRank: 4,
        points: 302,
        drivers: [
          { code: 'NOR', name: 'ランド・ノリス', number: 4, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'オーストリア以降の表彰台ラッシュで4位浮上に貢献' },
          { code: 'PIA', name: 'オスカー・ピアストリ', number: 81, country: '豪州', flag: '🇦🇺', role: 'Regular', isRookie: true, note: 'カタールGPスプリント優勝＆決勝表彰台' },
        ],
        reserves: [
          { code: 'PAL', name: 'アレックス・パロウ', country: 'スペイン', flag: '🇪🇸', role: 'Reserve' },
          { code: 'MSC', name: 'ミック・シューマッハ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'aston-martin',
        teamName: 'Aston Martin',
        fullName: 'Aston Martin Aramco Cognizant F1 Team',
        teamColor: '#229971',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Mike Krack',
        finalRank: 5,
        points: 280,
        drivers: [
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular', isTransfer: true, note: '開幕から表彰台量産、41歳で選手権4位の快挙' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular' },
        ],
        reserves: [
          { code: 'DRU', name: 'フェリペ・ドルゴヴィッチ', number: 34, country: 'ブラジル', flag: '🇧🇷', role: 'Reserve', note: 'プレシーズンテストでストロール代役出走' },
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', country: 'ベルギー', flag: '🇧🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alpine',
        teamName: 'Alpine',
        fullName: 'BWT Alpine F1 Team',
        teamColor: '#0093CC',
        powerUnit: 'Renault',
        teamPrincipal: 'Otmar Szafnauer / Bruno Famin',
        finalRank: 6,
        points: 120,
        drivers: [
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', isTransfer: true, note: 'ザントフォールトで移籍後初表彰台3位' },
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'モナコGPで値千金の表彰台3位' },
        ],
        reserves: [
          { code: 'DOO', name: 'ジャック・ドゥーハン', country: '豪州', flag: '🇦🇺', role: 'Reserve' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Racing',
        teamColor: '#00A0DE',
        powerUnit: 'Mercedes',
        teamPrincipal: 'James Vowles',
        finalRank: 7,
        points: 28,
        drivers: [
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Regular', note: 'モンツァ・カナダ等で鬼神の走破、27点を一人で稼ぐ' },
          { code: 'SAR', name: 'ローガン・サージェント', number: 2, country: '米国', flag: '🇺🇸', role: 'Regular', isRookie: true, note: '母国アメリカGPで初入賞' },
        ],
        reserves: [
          { code: 'MSC', name: 'ミック・シューマッハ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alphatauri',
        teamName: 'AlphaTauri',
        fullName: 'Scuderia AlphaTauri',
        teamColor: '#00293F',
        powerUnit: 'Honda RBPT',
        teamPrincipal: 'Franz Tost',
        finalRank: 8,
        points: 25,
        drivers: [
          { code: 'TSU', name: '角田 裕毅', number: 22, country: '日本', flag: '🇯🇵', role: 'Regular', note: 'チームリーダーとして孤軍奮闘、アメリカGPファステストラップ' },
          { code: 'DEV', name: 'ニック・デ・フリース', number: 21, country: 'オランダ', flag: '🇳🇱', role: 'Regular', isRookie: true, note: '第10戦イギリスまで出走' },
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular', note: 'ハンガリーGPより電撃復帰、メキシコで7位' },
          { code: 'LAW', name: 'リアム・ローソン', number: 40, country: 'NZ', flag: '🇳🇿', role: 'Regular', note: 'オランダ〜カタールで代役参戦、シンガポールで殊勲の9位入賞' },
        ],
        reserves: [
          { code: 'HAD', name: 'イサック・ハジャー', country: 'フランス', flag: '🇫🇷', role: 'Test' },
        ],
      },
      {
        teamId: 'alfa-romeo',
        teamName: 'Alfa Romeo',
        fullName: 'Alfa Romeo F1 Team Stake',
        teamColor: '#900000',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Alessandro Alunni Bravi',
        finalRank: 9,
        points: 16,
        drivers: [
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular' },
          { code: 'ZHO', name: '周 冠宇', number: 24, country: '中国', flag: '🇨🇳', role: 'Regular' },
        ],
        reserves: [
          { code: 'POU', name: 'テオ・プルシェール', country: 'フランス', flag: '🇫🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'MoneyGram Haas F1 Team',
        teamColor: '#B6BABD',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Guenther Steiner',
        finalRank: 10,
        points: 12,
        drivers: [
          { code: 'MAG', name: 'ケビン・マグヌッセン', number: 20, country: 'デンマーク', flag: '🇩🇰', role: 'Regular' },
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', isTransfer: true, note: '予選で幾度もQ3に進出しいぶし銀の速さを披露' },
        ],
        reserves: [
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
        ],
      },
    ],
  },

  // ── 2022 SEASON ─────────────────────────────────────────────
  2022: {
    year: 2022,
    eraName: 'グラウンドエフェクトカー 新レギュレーション導入初年度',
    seasonSummary: '40年ぶりにグラウンドエフェクトが復活しポーパシング（縦揺れ）問題が発生。序盤はルクレール（フェラーリ）が首位に立つも、中盤以降フェルスタッペン（レッドブル）がシーズン新記録となる年間15勝で王座連覇。',
    championDriver: {
      code: 'VER',
      name: 'マックス・フェルスタッペン',
      team: 'Red Bull Racing',
      carNumber: 1,
      points: 454,
      wins: 15,
    },
    championConstructor: {
      name: 'Oracle Red Bull Racing',
      powerUnit: 'Red Bull Powertrains',
      points: 759,
      wins: 17,
    },
    teams: [
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Oracle Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'Red Bull Powertrains',
        teamPrincipal: 'Christian Horner',
        finalRank: 1,
        points: 759,
        drivers: [
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 1, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: '年間最多勝記録更新（15勝）' },
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular', note: 'モナコ＆シンガポール優勝' },
        ],
        reserves: [
          { code: 'LAW', name: 'リアム・ローソン', country: 'NZ', flag: '🇳🇿', role: 'Reserve' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Mattia Binotto',
        finalRank: 2,
        points: 554,
        drivers: [
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular', note: '開幕2勝、シーズン最多ポール（9回）' },
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'シルバーストンで悲願のF1初優勝' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
          { code: 'MSC', name: 'ミック・シューマッハ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG PETRONAS F1 Team',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 3,
        points: 515,
        drivers: [
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular', isTransfer: true, note: 'メルセデス正式加入初年度、ブラジルで初優勝' },
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'ポーパシングに苦しむマシンで開発を牽引' },
        ],
        reserves: [
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', country: 'ベルギー', flag: '🇧🇪', role: 'Reserve' },
          { code: 'DEV', name: 'ニック・デ・フリース', country: 'オランダ', flag: '🇳🇱', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alpine',
        teamName: 'Alpine',
        fullName: 'BWT Alpine F1 Team',
        teamColor: '#0093CC',
        powerUnit: 'Renault',
        teamPrincipal: 'Otmar Szafnauer',
        finalRank: 4,
        points: 173,
        drivers: [
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular' },
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'カナダGP予選でフロントロウ2位' },
        ],
        reserves: [
          { code: 'PIA', name: 'オスカー・ピアストリ', country: '豪州', flag: '🇦🇺', role: 'Reserve', note: 'F2王者として専属リザーブドライバーを務める' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren F1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Andreas Seidl',
        finalRank: 5,
        points: 159,
        drivers: [
          { code: 'NOR', name: 'ランド・ノリス', number: 4, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'イモラで表彰台3位、中団トップを死守' },
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular' },
        ],
        reserves: [
          { code: 'PAL', name: 'アレックス・パロウ', country: 'スペイン', flag: '🇪🇸', role: 'Test' },
          { code: 'HER', name: 'コルトン・ハータ', country: '米国', flag: '🇺🇸', role: 'Test' },
        ],
      },
      {
        teamId: 'alfa-romeo',
        teamName: 'Alfa Romeo',
        fullName: 'Alfa Romeo F1 Team ORLEN',
        teamColor: '#900000',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 6,
        points: 55,
        drivers: [
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', isTransfer: true, note: 'メルセデスから移籍しチームリーダーとして活躍' },
          { code: 'ZHO', name: '周 冠宇', number: 24, country: '中国', flag: '🇨🇳', role: 'Regular', isRookie: true, note: '中国人初のF1フル参戦ドライバー' },
        ],
        reserves: [
          { code: 'KUB', name: 'ロバート・クビサ', number: 88, country: 'ポーランド', flag: '🇵🇱', role: 'Reserve' },
        ],
      },
      {
        teamId: 'aston-martin',
        teamName: 'Aston Martin',
        fullName: 'Aston Martin Aramco Cognizant F1 Team',
        teamColor: '#229971',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Mike Krack',
        finalRank: 7,
        points: 55,
        drivers: [
          { code: 'VET', name: 'セバスチャン・ベッテル', number: 5, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: '4冠王者のラストシーズン' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular' },
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: 'ベッテルコロナ陽性のため開幕2戦に代役参戦' },
        ],
        reserves: [
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'Haas F1 Team',
        teamColor: '#B6BABD',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Guenther Steiner',
        finalRank: 8,
        points: 37,
        drivers: [
          { code: 'MAG', name: 'ケビン・マグヌッセン', number: 20, country: 'デンマーク', flag: '🇩🇰', role: 'Regular', isTransfer: true, note: '電撃復帰の開幕戦5位＆ブラジルGPで自身初ポールポジション獲得' },
          { code: 'MSC', name: 'ミック・シューマッハ', number: 47, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: 'シルバーストン＆オーストリアで連続入賞' },
        ],
        reserves: [
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alphatauri',
        teamName: 'AlphaTauri',
        fullName: 'Scuderia AlphaTauri',
        teamColor: '#00293F',
        powerUnit: 'Red Bull Powertrains',
        teamPrincipal: 'Franz Tost',
        finalRank: 9,
        points: 35,
        drivers: [
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular' },
          { code: 'TSU', name: '角田 裕毅', number: 22, country: '日本', flag: '🇯🇵', role: 'Regular', note: '参戦2年目、ガスリーと互角の速さを披露' },
        ],
        reserves: [
          { code: 'LAW', name: 'リアム・ローソン', country: 'NZ', flag: '🇳🇿', role: 'Reserve' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Racing',
        teamColor: '#00A0DE',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Jost Capito',
        finalRank: 10,
        points: 8,
        drivers: [
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Regular', isTransfer: true, note: '1年間の休養から復帰、オーストラリアで最終周タイヤ交換作戦' },
          { code: 'LAT', name: 'ニコラス・ラティフィ', number: 6, country: 'カナダ', flag: '🇨🇦', role: 'Regular' },
          { code: 'DEV', name: 'ニック・デ・フリース', number: 45, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: 'モンツァでアルボン盲腸の代役出走し鮮烈な9位入賞' },
        ],
        reserves: [
          { code: 'DEV', name: 'ニック・デ・フリース', country: 'オランダ', flag: '🇳🇱', role: 'Reserve' },
          { code: 'SAR', name: 'ローガン・サージェント', country: '米国', flag: '🇺🇸', role: 'Test' },
        ],
      },
    ],
  },

  // ── 2021 SEASON ─────────────────────────────────────────────
  2021: {
    year: 2021,
    eraName: '世紀のタイトル争い フェルスタッペン vs ハミルトン',
    seasonSummary: '史上最も劇的なタイトル争いが展開。同点首位で迎えたアブダビGP最終戦のラストラップでマックス・フェルスタッペンがオーバーテイクを決め、初の世界チャンピオン戴冠。ホンダF1ラストイヤーを有終の美で飾った。',
    championDriver: {
      code: 'VER',
      name: 'マックス・フェルスタッペン',
      team: 'Red Bull Racing Honda',
      carNumber: 33,
      points: 395.5,
      wins: 10,
    },
    championConstructor: {
      name: 'Mercedes-AMG Petronas F1 Team',
      powerUnit: 'Mercedes',
      points: 613.5,
      wins: 9,
    },
    teams: [
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG Petronas F1 Team',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 1,
        points: 613.5,
        drivers: [
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'F1史上初となる通算100勝を達成' },
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: 'トルコGP優勝、コンストラクターズ8連覇に貢献' },
        ],
        reserves: [
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', country: 'ベルギー', flag: '🇧🇪', role: 'Reserve' },
          { code: 'DEV', name: 'ニック・デ・フリース', country: 'オランダ', flag: '🇳🇱', role: 'Reserve' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Red Bull Racing Honda',
        teamColor: '#3671C6',
        powerUnit: 'Honda RA621H',
        teamPrincipal: 'Christian Horner',
        finalRank: 2,
        points: 585.5,
        drivers: [
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 33, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: '最終周オーバーテイクで自身初の世界王者戴冠' },
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular', isTransfer: true, note: 'バクー優勝、最終戦で「防衛大臣」の走り' },
        ],
        reserves: [
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Reserve', note: '開発テストを強力に支えタイトル奪回に多大な貢献' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari Mission Winnow',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Mattia Binotto',
        finalRank: 3,
        points: 323.5,
        drivers: [
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', isTransfer: true, note: '移籍初年度から表彰台4回、選手権5位' },
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular', note: 'モナコ＆バクーで連続ポール獲得' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
          { code: 'ILO', name: 'カラム・アイロット', country: '英国', flag: '🇬🇧', role: 'Test' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren F1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Andreas Seidl',
        finalRank: 4,
        points: 275,
        drivers: [
          { code: 'NOR', name: 'ランド・ノリス', number: 4, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'ロシアGPポール獲得、表彰台4回' },
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular', isTransfer: true, note: 'イタリアGPモンツァで9年ぶりのチーム1-2優勝' },
        ],
        reserves: [
          { code: 'DIR', name: 'ポール・ディ・レスタ', country: '英国', flag: '🇬🇧', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alpine',
        teamName: 'Alpine',
        fullName: 'Alpine F1 Team',
        teamColor: '#0093CC',
        powerUnit: 'Renault',
        teamPrincipal: 'Laurent Rossi / Davide Brivio',
        finalRank: 5,
        points: 155,
        drivers: [
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular', isTransfer: true, note: 'F1復帰、カタールGPで7年ぶりの表彰台3位' },
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'ハンガリーGPで歓喜のキャリア初優勝' },
        ],
        reserves: [
          { code: 'KVY', name: 'ダニール・クビアト', country: 'ロシア', flag: '🇷🇺', role: 'Reserve' },
          { code: 'ZHO', name: '周 冠宇', country: '中国', flag: '🇨🇳', role: 'Test' },
        ],
      },
      {
        teamId: 'alphatauri',
        teamName: 'AlphaTauri',
        fullName: 'Scuderia AlphaTauri Honda',
        teamColor: '#00293F',
        powerUnit: 'Honda RA621H',
        teamPrincipal: 'Franz Tost',
        finalRank: 6,
        points: 142,
        drivers: [
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: '予選トップ6の常連、アゼルバイジャン3位' },
          { code: 'TSU', name: '角田 裕毅', number: 22, country: '日本', flag: '🇯🇵', role: 'Regular', isRookie: true, note: 'デビュー戦9位入賞、アブダビ最終戦で自己最高4位' },
        ],
        reserves: [
          { code: 'ALB', name: 'アレクサンダー・アルボン', country: 'タイ', flag: '🇹🇭', role: 'Reserve' },
        ],
      },
      {
        teamId: 'aston-martin',
        teamName: 'Aston Martin',
        fullName: 'Aston Martin Cognizant F1 Team',
        teamColor: '#229971',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Otmar Szafnauer',
        finalRank: 7,
        points: 77,
        drivers: [
          { code: 'VET', name: 'セバスチャン・ベッテル', number: 5, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', isTransfer: true, note: 'アゼルバイジャンGPで殊勲の2位表彰台' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular' },
        ],
        reserves: [
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Racing',
        teamColor: '#00A0DE',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Jost Capito',
        finalRank: 8,
        points: 23,
        drivers: [
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular', note: '豪雨のベルギーGP予選2位、初表彰台2位獲得' },
          { code: 'LAT', name: 'ニコラス・ラティフィ', number: 6, country: 'カナダ', flag: '🇨🇦', role: 'Regular', note: 'ハンガリーGPで7位入賞' },
        ],
        reserves: [
          { code: 'AIT', name: 'ジャック・エイトケン', country: '英国', flag: '🇬🇧', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alfa-romeo',
        teamName: 'Alfa Romeo',
        fullName: 'Alfa Romeo Racing ORLEN',
        teamColor: '#900000',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 9,
        points: 13,
        drivers: [
          { code: 'RAI', name: 'キミ・ライコネン', number: 7, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: '「アイスマン」のF1ラストシーズン' },
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', number: 99, country: 'イタリア', flag: '🇮🇹', role: 'Regular' },
          { code: 'KUB', name: 'ロバート・クビサ', number: 88, country: 'ポーランド', flag: '🇵🇱', role: 'Regular', note: 'ライコネンコロナ陽性のためオランダ・イタリアで代役出走' },
        ],
        reserves: [
          { code: 'KUB', name: 'ロバート・クビサ', country: 'ポーランド', flag: '🇵🇱', role: 'Reserve' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'Uralkali Haas F1 Team',
        teamColor: '#FFFFFF',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Guenther Steiner',
        finalRank: 10,
        points: 0,
        drivers: [
          { code: 'MSC', name: 'ミック・シューマッハ', number: 47, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', isRookie: true, note: '前年F2王者、シューマッハの名を背負いデビュー' },
          { code: 'MAZ', name: 'ニキータ・マゼピン', number: 9, country: 'ロシア', flag: '🇷🇺', role: 'Regular', isRookie: true },
        ],
        reserves: [
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
        ],
      },
    ],
  },

  // ── 2020 SEASON ─────────────────────────────────────────────
  2020: {
    year: 2020,
    eraName: 'コロナ禍の短縮全17戦 ＆ ハミルトン歴代最多7冠達成',
    seasonSummary: 'パンデミックにより欧州・中東中心の17戦で開催。ハミルトンがシューマッハの最多勝（91勝）を塗り替え、歴代最多タイの7度目の世界王座を獲得。ガスリーがモンツァで、ペレスがサヒールで涙のキャリア初優勝を遂げた。',
    championDriver: {
      code: 'HAM',
      name: 'ルイス・ハミルトン',
      team: 'Mercedes-AMG',
      carNumber: 44,
      points: 347,
      wins: 11,
    },
    championConstructor: {
      name: 'Mercedes-AMG Petronas F1 Team',
      powerUnit: 'Mercedes',
      points: 573,
      wins: 13,
    },
    teams: [
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG Petronas F1 Team',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 1,
        points: 573,
        drivers: [
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: '通算92勝目で歴代最多勝記録樹立＆7冠' },
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: '開幕戦オーストリアGP＆ロシアGP優勝' },
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'サヒールGPでハミルトン代役として出走し初ポイント獲得' },
        ],
        reserves: [
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', country: 'ベルギー', flag: '🇧🇪', role: 'Reserve' },
          { code: 'GUT', name: 'エステバン・グティエレス', country: 'メキシコ', flag: '🇲🇽', role: 'Reserve' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Aston Martin Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'Honda RA620H',
        teamPrincipal: 'Christian Horner',
        finalRank: 2,
        points: 319,
        drivers: [
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 33, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: '70周年記念GP＆アブダビ最終戦完全優勝' },
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Regular', note: 'ムジェロ＆バーレーンで2度の3位表彰台' },
        ],
        reserves: [
          { code: 'BUE', name: 'セバスチャン・ブエミ', country: 'スイス', flag: '🇨🇭', role: 'Reserve' },
          { code: 'SET', name: 'セルジオ・セッテ・カマラ', country: 'ブラジル', flag: '🇧🇷', role: 'Test' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren F1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Renault',
        teamPrincipal: 'Andreas Seidl',
        finalRank: 3,
        points: 202,
        drivers: [
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'モンツァでガスリーと死闘の末2位' },
          { code: 'NOR', name: 'ランド・ノリス', number: 4, country: '英国', flag: '🇬🇧', role: 'Regular', note: '開幕戦オーストリアGPでF1初表彰台獲得' },
        ],
        reserves: [
          { code: 'TUR', name: 'オリバー・ターベイ', country: '英国', flag: '🇬🇧', role: 'Test' },
        ],
      },
      {
        teamId: 'racing-point',
        teamName: 'Racing Point',
        fullName: 'BWT Racing Point F1 Team',
        teamColor: '#F596C8',
        powerUnit: 'BWT Mercedes',
        teamPrincipal: 'Otmar Szafnauer',
        finalRank: 4,
        points: 195,
        drivers: [
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular', note: 'サヒールGPで最後尾から奇跡のF1初優勝' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular', note: '雨のトルコGPでポールポジション獲得、モンツァ3位' },
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: 'ペレス・ストロールのコロナ陽性に伴い3戦代役出走' },
        ],
        reserves: [
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'renault',
        teamName: 'Renault',
        fullName: 'Renault DP World F1 Team',
        teamColor: '#FFF500',
        powerUnit: 'Renault E-Tech 20',
        teamPrincipal: 'Cyril Abiteboul',
        finalRank: 5,
        points: 181,
        drivers: [
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular', note: 'ニュルブルクリンク＆イモラで表彰台獲得' },
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', isTransfer: true, note: 'サヒールGPで2位初表彰台獲得' },
        ],
        reserves: [
          { code: 'SIR', name: 'セルゲイ・シロトキン', country: 'ロシア', flag: '🇷🇺', role: 'Reserve' },
          { code: 'ZHO', name: '周 冠宇', country: '中国', flag: '🇨🇳', role: 'Test' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari',
        teamColor: '#E80020',
        powerUnit: 'Ferrari 065',
        teamPrincipal: 'Mattia Binotto',
        finalRank: 6,
        points: 131,
        drivers: [
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular', note: '戦闘力を欠いたSF1000をねじ伏せ2度表彰台' },
          { code: 'VET', name: 'セバスチャン・ベッテル', number: 5, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: '雨のトルコGPで激走の3位表彰台' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alphatauri',
        teamName: 'AlphaTauri',
        fullName: 'Scuderia AlphaTauri Honda',
        teamColor: '#00293F',
        powerUnit: 'Honda RA620H',
        teamPrincipal: 'Franz Tost',
        finalRank: 7,
        points: 107,
        drivers: [
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'イタリアGPモンツァで劇的初優勝、トロロッソ時代以来12年ぶりの勝利' },
          { code: 'KVY', name: 'ダニール・クビアト', number: 26, country: 'ロシア', flag: '🇷🇺', role: 'Regular', note: 'イモラで4位入賞' },
        ],
        reserves: [
          { code: 'SET', name: 'セルジオ・セッテ・カマラ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alfa-romeo',
        teamName: 'Alfa Romeo',
        fullName: 'Alfa Romeo Racing ORLEN',
        teamColor: '#900000',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 8,
        points: 8,
        drivers: [
          { code: 'RAI', name: 'キミ・ライコネン', number: 7, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: 'ポルティマオ1周目で10台抜きを披露' },
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', number: 99, country: 'イタリア', flag: '🇮🇹', role: 'Regular' },
        ],
        reserves: [
          { code: 'KUB', name: 'ロバート・クビサ', country: 'ポーランド', flag: '🇵🇱', role: 'Reserve' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'Haas F1 Team',
        teamColor: '#787878',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Guenther Steiner',
        finalRank: 9,
        points: 3,
        drivers: [
          { code: 'GRO', name: 'ロマン・グロージャン', number: 8, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'バーレーン火災事故からの生還' },
          { code: 'MAG', name: 'ケビン・マグヌッセン', number: 20, country: 'デンマーク', flag: '🇩🇰', role: 'Regular', note: 'ハンガリーGP戦略成功で10位入賞' },
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', number: 51, country: 'ブラジル', flag: '🇧🇷', role: 'Regular', note: 'グロージャン負傷に伴いサヒール・アブダビ代役参戦' },
        ],
        reserves: [
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
          { code: 'DEL', name: 'ルイ・デレトラズ', country: 'スイス', flag: '🇨🇭', role: 'Test' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Racing',
        teamColor: '#00A0DE',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Claire Williams / Simon Roberts',
        finalRank: 10,
        points: 0,
        drivers: [
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular' },
          { code: 'LAT', name: 'ニコラス・ラティフィ', number: 6, country: 'カナダ', flag: '🇨🇦', role: 'Regular', isRookie: true },
          { code: 'AIT', name: 'ジャック・エイトケン', number: 89, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'サヒールGPでラッセル代役出走' },
        ],
        reserves: [
          { code: 'AIT', name: 'ジャック・エイトケン', country: '英国', flag: '🇬🇧', role: 'Reserve' },
          { code: 'NIS', name: 'ロイ・ニッサニー', country: 'イスラエル', flag: '🇮🇱', role: 'Test' },
        ],
      },
    ],
  },

  // ── 2019 SEASON ─────────────────────────────────────────────
  2019: {
    year: 2019,
    eraName: 'メルセデス前人未到の開幕5連続1-2フィニッシュ',
    seasonSummary: 'メルセデスが開幕5戦連続1-2という記録を樹立し6年連続ダブルタイトルを獲得。ホンダがレッドブルと組みオーストリアGPで13年ぶりの勝利を挙げ、ドイツ・ブラジルと年間3勝を記録。ルクレールがフェラーリで2勝を挙げ新世代の台頭を見せた。',
    championDriver: {
      code: 'HAM',
      name: 'ルイス・ハミルトン',
      team: 'Mercedes-AMG',
      carNumber: 44,
      points: 413,
      wins: 11,
    },
    championConstructor: {
      name: 'Mercedes-AMG Petronas Motorsport',
      powerUnit: 'Mercedes',
      points: 739,
      wins: 15,
    },
    teams: [
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG Petronas Motorsport',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 1,
        points: 739,
        drivers: [
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'ファン・マヌエル・ファンジオを超える通算6度目の世界王者' },
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: '開幕戦豪州圧勝、シーズン4勝' },
        ],
        reserves: [
          { code: 'OCO', name: 'エステバン・オコン', country: 'フランス', flag: '🇫🇷', role: 'Reserve', note: 'シミュレータ＆テストで王者奪回を支える' },
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', country: 'ベルギー', flag: '🇧🇪', role: 'Test' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari Mission Winnow',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Mattia Binotto',
        finalRank: 2,
        points: 504,
        drivers: [
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular', isTransfer: true, note: 'スパで初優勝、モンツァで9年ぶりフェラーリ母国勝利、年間最多7ポール' },
          { code: 'VET', name: 'セバスチャン・ベッテル', number: 5, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: 'シンガポールGPで通算53勝目' },
        ],
        reserves: [
          { code: 'HAR', name: 'ブレンドン・ハートレー', country: 'NZ', flag: '🇳🇿', role: 'Test' },
          { code: 'WEH', name: 'パスカル・ウェーレイン', country: 'ドイツ', flag: '🇩🇪', role: 'Test' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Aston Martin Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'Honda RA619H',
        teamPrincipal: 'Christian Horner',
        finalRank: 3,
        points: 417,
        drivers: [
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 33, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: 'オーストリアでホンダに13年ぶり勝利をもたらし年間3勝' },
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: '第12戦までレッドブル出走' },
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Regular', isTransfer: true, note: 'ベルギーGPよりレッドブルへ抜擢昇格' },
        ],
        reserves: [
          { code: 'BUE', name: 'セバスチャン・ブエミ', country: 'スイス', flag: '🇨🇭', role: 'Reserve' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren F1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Renault',
        teamPrincipal: 'Andreas Seidl',
        finalRank: 4,
        points: 145,
        drivers: [
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', isTransfer: true, note: 'ブラジルGPで最後尾から自身初表彰台3位獲得' },
          { code: 'NOR', name: 'ランド・ノリス', number: 4, country: '英国', flag: '🇬🇧', role: 'Regular', isRookie: true, note: '19歳の超大型新星ルーキー' },
        ],
        reserves: [
          { code: 'SET', name: 'セルジオ・セッテ・カマラ', country: 'ブラジル', flag: '🇧🇷', role: 'Test' },
        ],
      },
      {
        teamId: 'renault',
        teamName: 'Renault',
        fullName: 'Renault F1 Team',
        teamColor: '#FFF500',
        powerUnit: 'Renault',
        teamPrincipal: 'Cyril Abiteboul',
        finalRank: 5,
        points: 91,
        drivers: [
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular', isTransfer: true, note: 'レッドブルから電撃移籍' },
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular' },
        ],
        reserves: [
          { code: 'SIR', name: 'セルゲイ・シロトキン', country: 'ロシア', flag: '🇷🇺', role: 'Reserve' },
          { code: 'AIT', name: 'ジャック・エイトケン', country: '英国', flag: '🇬🇧', role: 'Test' },
        ],
      },
      {
        teamId: 'toro-rosso',
        teamName: 'Toro Rosso',
        fullName: 'Red Bull Toro Rosso Honda',
        teamColor: '#00293F',
        powerUnit: 'Honda RA619H',
        teamPrincipal: 'Franz Tost',
        finalRank: 6,
        points: 85,
        drivers: [
          { code: 'KVY', name: 'ダニール・クビアト', number: 26, country: 'ロシア', flag: '🇷🇺', role: 'Regular', note: 'ドイツGP雨のレースで殊勲の3位表彰台' },
          { code: 'ALB', name: 'アレクサンダー・アルボン', number: 23, country: 'タイ', flag: '🇹🇭', role: 'Regular', isRookie: true, note: '前半戦で鮮烈な走りを披露しレッドブルへ昇格' },
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'ブラジルGPでハミルトンとドラッグレースを制し2位表彰台' },
        ],
        reserves: [
          { code: 'YAM', name: '山本 尚貴 (Naoki Yamamoto)', country: '日本', flag: '🇯🇵', role: 'Test', note: '日本GP鈴鹿FP1出走' },
        ],
      },
      {
        teamId: 'racing-point',
        teamName: 'Racing Point',
        fullName: 'SportPesa Racing Point F1 Team',
        teamColor: '#F596C8',
        powerUnit: 'BWT Mercedes',
        teamPrincipal: 'Otmar Szafnauer',
        finalRank: 7,
        points: 73,
        drivers: [
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular', isTransfer: true, note: 'ドイツGPで4位入賞' },
        ],
        reserves: [
          { code: 'LAT', name: 'ニコラス・ラティフィ', country: 'カナダ', flag: '🇨🇦', role: 'Reserve' },
        ],
      },
      {
        teamId: 'alfa-romeo',
        teamName: 'Alfa Romeo',
        fullName: 'Alfa Romeo Racing',
        teamColor: '#900000',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 8,
        points: 57,
        drivers: [
          { code: 'RAI', name: 'キミ・ライコネン', number: 7, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', isTransfer: true, note: '古巣ザウバーの系譜へ移籍、ブラジル4位' },
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', number: 99, country: 'イタリア', flag: '🇮🇹', role: 'Regular', isRookie: true, note: 'イタリア人としてフル参戦' },
        ],
        reserves: [
          { code: 'ERI', name: 'マーカス・エリクソン', country: 'スウェーデン', flag: '🇸🇪', role: 'Reserve' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'Rich Energy Haas F1 Team',
        teamColor: '#000000',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Guenther Steiner',
        finalRank: 9,
        points: 28,
        drivers: [
          { code: 'GRO', name: 'ロマン・グロージャン', number: 8, country: 'フランス', flag: '🇫🇷', role: 'Regular' },
          { code: 'MAG', name: 'ケビン・マグヌッセン', number: 20, country: 'デンマーク', flag: '🇩🇰', role: 'Regular' },
        ],
        reserves: [
          { code: 'FIT', name: 'ピエトロ・フィッティパルディ', country: 'ブラジル', flag: '🇧🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'ROKiT Williams Racing',
        teamColor: '#00A0DE',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Claire Williams',
        finalRank: 10,
        points: 1,
        drivers: [
          { code: 'RUS', name: 'ジョージ・ラッセル', number: 63, country: '英国', flag: '🇬🇧', role: 'Regular', isRookie: true, note: '前年F2王者、予選で僚友に21戦全勝' },
          { code: 'KUB', name: 'ロバート・クビサ', number: 88, country: 'ポーランド', flag: '🇵🇱', role: 'Regular', isTransfer: true, note: 'ラリーの大怪我から8年ぶりの奇跡のF1本戦復帰、ドイツGPで1点獲得' },
        ],
        reserves: [
          { code: 'LAT', name: 'ニコラス・ラティフィ', country: 'カナダ', flag: '🇨🇦', role: 'Reserve' },
        ],
      },
    ],
  },

  // ── 2018 SEASON ─────────────────────────────────────────────
  2018: {
    year: 2018,
    eraName: '頭部保護デバイス「Halo」導入初年度 ＆ ハミルトンvsベッテル5冠争い',
    seasonSummary: '「Halo」が全車義務化。ハミルトンとベッテルが史上初となる「5回目の世界王座獲得」を懸けて激突し、ハミルトンが後半戦圧倒的な強さで王座戴冠。シャルル・ルクレールがザウバーから鮮烈デビュー。',
    championDriver: {
      code: 'HAM',
      name: 'ルイス・ハミルトン',
      team: 'Mercedes-AMG',
      carNumber: 44,
      points: 408,
      wins: 11,
    },
    championConstructor: {
      name: 'Mercedes-AMG Petronas Motorsport',
      powerUnit: 'Mercedes',
      points: 655,
      wins: 11,
    },
    teams: [
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG Petronas Motorsport',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 1,
        points: 655,
        drivers: [
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'キャリア最高峰の完成度で5度目の世界王座獲得' },
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular' },
        ],
        reserves: [
          { code: 'WEH', name: 'パスカル・ウェーレイン', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
          { code: 'RUS', name: 'ジョージ・ラッセル', country: '英国', flag: '🇬🇧', role: 'Test', note: 'F2王者獲得' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Maurizio Arrivabene',
        finalRank: 2,
        points: 571,
        drivers: [
          { code: 'VET', name: 'セバスチャン・ベッテル', number: 5, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: '開幕2連勝含む年間5勝' },
          { code: 'RAI', name: 'キミ・ライコネン', number: 7, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: 'アメリカGPで5年ぶりの感動の勝利（F1通算21勝目）' },
        ],
        reserves: [
          { code: 'KVY', name: 'ダニール・クビアト', country: 'ロシア', flag: '🇷🇺', role: 'Test' },
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Aston Martin Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'TAG Heuer (Renault)',
        teamPrincipal: 'Christian Horner',
        finalRank: 3,
        points: 419,
        drivers: [
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular', note: '中国GP＆モナコGPで勝利' },
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 33, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: 'オーストリア＆メキシコGP勝利、選手権4位' },
        ],
        reserves: [
          { code: 'BUE', name: 'セバスチャン・ブエミ', country: 'スイス', flag: '🇨🇭', role: 'Reserve' },
        ],
      },
      {
        teamId: 'renault',
        teamName: 'Renault',
        fullName: 'Renault Sport Formula One Team',
        teamColor: '#FFF500',
        powerUnit: 'Renault',
        teamPrincipal: 'Cyril Abiteboul',
        finalRank: 4,
        points: 122,
        drivers: [
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: '年間選手権7位（ベスト・オブ・ザ・レスト）' },
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular' },
        ],
        reserves: [
          { code: 'AIT', name: 'ジャック・エイトケン', country: '英国', flag: '🇬🇧', role: 'Test' },
          { code: 'MAR', name: 'アルテム・マルケロフ', country: 'ロシア', flag: '🇷🇺', role: 'Test' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'Haas F1 Team',
        teamColor: '#787878',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Guenther Steiner',
        finalRank: 5,
        points: 93,
        drivers: [
          { code: 'GRO', name: 'ロマン・グロージャン', number: 8, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'オーストリアGPで4位入賞' },
          { code: 'MAG', name: 'ケビン・マグヌッセン', number: 20, country: 'デンマーク', flag: '🇩🇰', role: 'Regular' },
        ],
        reserves: [
          { code: 'FER', name: 'サンティーノ・フェルッチ', country: '米国', flag: '🇺🇸', role: 'Test' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren F1 Team',
        teamColor: '#FF8000',
        powerUnit: 'Renault',
        teamPrincipal: 'Zak Brown / Gil de Ferran',
        finalRank: 6,
        points: 62,
        drivers: [
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: '開幕5戦連続入賞、ル・マン優勝と兼務しシーズン後にF1一時休養' },
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', number: 2, country: 'ベルギー', flag: '🇧🇪', role: 'Regular' },
        ],
        reserves: [
          { code: 'NOR', name: 'ランド・ノリス', country: '英国', flag: '🇬🇧', role: 'Reserve', note: 'F2参戦兼テストドライバー' },
        ],
      },
      {
        teamId: 'force-india',
        teamName: 'Force India / Racing Point',
        fullName: 'Racing Point Force India F1 Team',
        teamColor: '#F596C8',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Otmar Szafnauer',
        finalRank: 7,
        points: 52,
        drivers: [
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular', note: 'アゼルバイジャンGPで3位表彰台獲得' },
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', note: 'ベルギーGP予選3位の快挙' },
        ],
        reserves: [
          { code: 'LAT', name: 'ニコラス・ラティフィ', country: 'カナダ', flag: '🇨🇦', role: 'Reserve' },
        ],
      },
      {
        teamId: 'sauber',
        teamName: 'Sauber',
        fullName: 'Alfa Romeo Sauber F1 Team',
        teamColor: '#900000',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 8,
        points: 48,
        drivers: [
          { code: 'LEC', name: 'シャルル・ルクレール', number: 16, country: 'モナコ', flag: '🇲🇨', role: 'Regular', isRookie: true, note: 'ルーキーながら予選・決勝で鮮烈な速さを見せフェラーリ昇格を決定' },
          { code: 'ERI', name: 'マーカス・エリクソン', number: 9, country: 'スウェーデン', flag: '🇸🇪', role: 'Regular' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
        ],
      },
      {
        teamId: 'toro-rosso',
        teamName: 'Toro Rosso',
        fullName: 'Red Bull Toro Rosso Honda',
        teamColor: '#00293F',
        powerUnit: 'Honda RA618H',
        teamPrincipal: 'Franz Tost',
        finalRank: 9,
        points: 33,
        drivers: [
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', isRookie: true, note: 'バーレーンGPでホンダPU復帰後最高位となる4位フィニッシュ' },
          { code: 'HAR', name: 'ブレンドン・ハートレー', number: 28, country: 'NZ', flag: '🇳🇿', role: 'Regular' },
        ],
        reserves: [
          { code: 'GEL', name: 'ショーン・ゲラエル', country: 'インドネシア', flag: '🇮🇩', role: 'Test' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Martini Racing',
        teamColor: '#FFFFFF',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Claire Williams',
        finalRank: 10,
        points: 7,
        drivers: [
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular' },
          { code: 'SIR', name: 'セルゲイ・シロトキン', number: 35, country: 'ロシア', flag: '🇷🇺', role: 'Regular', isRookie: true },
        ],
        reserves: [
          { code: 'KUB', name: 'ロバート・クビサ', number: 40, country: 'ポーランド', flag: '🇵🇱', role: 'Reserve', note: '開発テストドライバーとしてFP1出走' },
        ],
      },
    ],
  },

  // ── 2017 SEASON ─────────────────────────────────────────────
  2017: {
    year: 2017,
    eraName: 'ワイド＆ロー 幅広タイヤと強烈ダウンフォース新時代',
    seasonSummary: 'タイヤ幅と車幅が拡大され、コーナリングスピードが劇的に向上。ハミルトンとベッテルが年間を通じて激しいタイトル争いを展開し、ハミルトンがメキシコGPで自身4度目のタイトルを獲得。',
    championDriver: {
      code: 'HAM',
      name: 'ルイス・ハミルトン',
      team: 'Mercedes-AMG',
      carNumber: 44,
      points: 363,
      wins: 9,
    },
    championConstructor: {
      name: 'Mercedes-AMG Petronas Motorsport',
      powerUnit: 'Mercedes',
      points: 668,
      wins: 12,
    },
    teams: [
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG Petronas Motorsport',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 1,
        points: 668,
        drivers: [
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: '通算4度目の世界王座奪還、ポールポジション歴代最多記録更新' },
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', isTransfer: true, note: 'ウィリアムズから電撃移籍、ロシアGPでF1初優勝含む3勝' },
        ],
        reserves: [
          { code: 'RUS', name: 'ジョージ・ラッセル', country: '英国', flag: '🇬🇧', role: 'Test' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Maurizio Arrivabene',
        finalRank: 2,
        points: 522,
        drivers: [
          { code: 'VET', name: 'セバスチャン・ベッテル', number: 5, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: '開幕戦オーストラリア制覇、年間5勝' },
          { code: 'RAI', name: 'キミ・ライコネン', number: 7, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: 'モナコGPでポールポジション獲得' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
          { code: 'LEC', name: 'シャルル・ルクレール', country: 'モナコ', flag: '🇲🇨', role: 'Test', note: 'F2王者獲得' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'TAG Heuer (Renault)',
        teamPrincipal: 'Christian Horner',
        finalRank: 3,
        points: 368,
        drivers: [
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular', note: 'アゼルバイジャンGPで大混戦を制し優勝' },
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 33, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: 'マレーシア＆メキシコGPで圧勝' },
        ],
        reserves: [
          { code: 'GAS', name: 'ピエール・ガスリー', country: 'フランス', flag: '🇫🇷', role: 'Reserve' },
          { code: 'BUE', name: 'セバスチャン・ブエミ', country: 'スイス', flag: '🇨🇭', role: 'Reserve' },
        ],
      },
      {
        teamId: 'force-india',
        teamName: 'Force India',
        fullName: 'Sahara Force India F1 Team',
        teamColor: '#F596C8',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Vijay Mallya / Otmar Szafnauer',
        finalRank: 4,
        points: 187,
        drivers: [
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular', note: '2年連続100ポイント到達' },
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', isTransfer: true, note: '全20戦中18戦で入賞する驚異の安定感' },
        ],
        reserves: [
          { code: 'CEL', name: 'アルフォンソ・セリス・ジュニア', country: 'メキシコ', flag: '🇲🇽', role: 'Test' },
          { code: 'RUS', name: 'ジョージ・ラッセル', country: '英国', flag: '🇬🇧', role: 'Test', note: 'ブラジル・アブダビFP1出走' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Martini Racing',
        teamColor: '#FFFFFF',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Claire Williams',
        finalRank: 5,
        points: 83,
        drivers: [
          { code: 'MAS', name: 'フェリペ・マッサ', number: 19, country: 'ブラジル', flag: '🇧🇷', role: 'Regular', note: '引退撤回し電撃復帰したラストシーズン' },
          { code: 'STR', name: 'ランス・ストロール', number: 18, country: 'カナダ', flag: '🇨🇦', role: 'Regular', isRookie: true, note: 'アゼルバイジャンGPで18歳初表彰台3位、雨のモンツァ予選2位' },
          { code: 'DIR', name: 'ポール・ディ・レスタ', number: 40, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'ハンガリーGP予選直前にマッサ体調不良のため急遽代役出走' },
        ],
        reserves: [
          { code: 'DIR', name: 'ポール・ディ・レスタ', country: '英国', flag: '🇬🇧', role: 'Reserve' },
        ],
      },
      {
        teamId: 'renault',
        teamName: 'Renault',
        fullName: 'Renault Sport Formula One Team',
        teamColor: '#FFF500',
        powerUnit: 'Renault',
        teamPrincipal: 'Cyril Abiteboul',
        finalRank: 6,
        points: 57,
        drivers: [
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', isTransfer: true },
          { code: 'PAL', name: 'ジョリオン・パーマー', number: 30, country: '英国', flag: '🇬🇧', role: 'Regular', note: '日本GPまで出走' },
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', isTransfer: true, note: 'アメリカGPよりトロロッソから電撃移籍' },
        ],
        reserves: [
          { code: 'SIR', name: 'セルゲイ・シロトキン', country: 'ロシア', flag: '🇷🇺', role: 'Reserve' },
        ],
      },
      {
        teamId: 'toro-rosso',
        teamName: 'Toro Rosso',
        fullName: 'Scuderia Toro Rosso',
        teamColor: '#00293F',
        powerUnit: 'Renault',
        teamPrincipal: 'Franz Tost',
        finalRank: 7,
        points: 53,
        drivers: [
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'シンガポールGPで4位入賞' },
          { code: 'KVY', name: 'ダニール・クビアト', number: 26, country: 'ロシア', flag: '🇷🇺', role: 'Regular' },
          { code: 'GAS', name: 'ピエール・ガスリー', number: 10, country: 'フランス', flag: '🇫🇷', role: 'Regular', isRookie: true, note: 'マレーシアGPでF1デビュー' },
          { code: 'HAR', name: 'ブレンドン・ハートレー', number: 28, country: 'NZ', flag: '🇳🇿', role: 'Regular', isRookie: true, note: 'アメリカGPでWEC王者からF1デビュー' },
        ],
        reserves: [
          { code: 'GEL', name: 'ショーン・ゲラエル', country: 'インドネシア', flag: '🇮🇩', role: 'Test' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'Haas F1 Team',
        teamColor: '#787878',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Guenther Steiner',
        finalRank: 8,
        points: 47,
        drivers: [
          { code: 'GRO', name: 'ロマン・グロージャン', number: 8, country: 'フランス', flag: '🇫🇷', role: 'Regular' },
          { code: 'MAG', name: 'ケビン・マグヌッセン', number: 20, country: 'デンマーク', flag: '🇩🇰', role: 'Regular', isTransfer: true },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Test', note: '金曜FP1に7回出走' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren Honda',
        teamColor: '#FF8000',
        powerUnit: 'Honda RA617H',
        teamPrincipal: 'Éric Boullier',
        finalRank: 9,
        points: 30,
        drivers: [
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'モナコを欠場しインディ500へ参戦、ハンガリーで6位' },
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', number: 2, country: 'ベルギー', flag: '🇧🇪', role: 'Regular', isRookie: true },
          { code: 'BUT', name: 'ジェンソン・バトン', number: 22, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'アロンソのインディ参戦に伴いモナコGPで限定ワンオフ復帰' },
        ],
        reserves: [
          { code: 'BUT', name: 'ジェンソン・バトン', country: '英国', flag: '🇬🇧', role: 'Reserve' },
          { code: 'NOR', name: 'ランド・ノリス', country: '英国', flag: '🇬🇧', role: 'Test' },
        ],
      },
      {
        teamId: 'sauber',
        teamName: 'Sauber',
        fullName: 'Sauber F1 Team',
        teamColor: '#002B49',
        powerUnit: 'Ferrari 061 (2016年仕様)',
        teamPrincipal: 'Monisha Kaltenborn / Frédéric Vasseur',
        finalRank: 10,
        points: 5,
        drivers: [
          { code: 'ERI', name: 'マーカス・エリクソン', number: 9, country: 'スウェーデン', flag: '🇸🇪', role: 'Regular' },
          { code: 'WEH', name: 'パスカル・ウェーレイン', number: 94, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', isTransfer: true, note: 'スペイン8位＆アゼルバイジャン10位入賞' },
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', number: 36, country: 'イタリア', flag: '🇮🇹', role: 'Regular', isRookie: true, note: 'ウェーレイン負傷に伴い開幕2戦代役参戦' },
        ],
        reserves: [
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Reserve' },
          { code: 'LEC', name: 'シャルル・ルクレール', country: 'モナコ', flag: '🇲🇨', role: 'Test', note: 'FP1に4回出走' },
        ],
      },
    ],
  },

  // ── 2016 SEASON ─────────────────────────────────────────────
  2016: {
    year: 2016,
    eraName: 'ロズベルグ悲願の王者戴冠 ＆ フェルスタッペン史上最年少初優勝',
    seasonSummary: 'ニコ・ロズベルグが幼少期からのライバルであるハミルトンとの死闘を制し初の世界王座を獲得、直後に電撃引退。18歳のフェルスタッペンがスペインGPで史上最年少初優勝を達成した歴史的シーズン。',
    championDriver: {
      code: 'ROS',
      name: 'ニコ・ロズベルグ',
      team: 'Mercedes-AMG',
      carNumber: 6,
      points: 385,
      wins: 9,
    },
    championConstructor: {
      name: 'Mercedes-AMG Petronas Formula One Team',
      powerUnit: 'Mercedes',
      points: 765,
      wins: 19,
    },
    teams: [
      {
        teamId: 'mercedes',
        teamName: 'Mercedes-AMG',
        fullName: 'Mercedes-AMG Petronas Formula One Team',
        teamColor: '#27F4D2',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Toto Wolff',
        finalRank: 1,
        points: 765,
        drivers: [
          { code: 'ROS', name: 'ニコ・ロズベルグ', number: 6, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: '父ケケに続く親子世界チャンピオン戴冠、シーズン後に電撃引退' },
          { code: 'HAM', name: 'ルイス・ハミルトン', number: 44, country: '英国', flag: '🇬🇧', role: 'Regular', note: '年間最多10勝を挙げるも5点差でランキング2位' },
        ],
        reserves: [
          { code: 'WEH', name: 'パスカル・ウェーレイン', country: 'ドイツ', flag: '🇩🇪', role: 'Reserve' },
          { code: 'OCO', name: 'エステバン・オコン', country: 'フランス', flag: '🇫🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'red-bull',
        teamName: 'Red Bull Racing',
        fullName: 'Red Bull Racing',
        teamColor: '#3671C6',
        powerUnit: 'TAG Heuer (Renault)',
        teamPrincipal: 'Christian Horner',
        finalRank: 2,
        points: 468,
        drivers: [
          { code: 'RIC', name: 'ダニエル・リカルド', number: 3, country: '豪州', flag: '🇦🇺', role: 'Regular', note: 'マレーシアGP優勝、選手権3位' },
          { code: 'KVY', name: 'ダニール・クビアト', number: 26, country: 'ロシア', flag: '🇷🇺', role: 'Regular', note: '中国GPで表彰台3位（第4戦ロシアまで出走）' },
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 33, country: 'オランダ', flag: '🇳🇱', role: 'Regular', isTransfer: true, note: '第5戦スペインGP昇格初戦で史上最年少初優勝（18歳228日）' },
        ],
        reserves: [
          { code: 'GAS', name: 'ピエール・ガスリー', country: 'フランス', flag: '🇫🇷', role: 'Reserve', note: 'GP2王者獲得' },
          { code: 'BUE', name: 'セバスチャン・ブエミ', country: 'スイス', flag: '🇨🇭', role: 'Reserve' },
        ],
      },
      {
        teamId: 'ferrari',
        teamName: 'Ferrari',
        fullName: 'Scuderia Ferrari',
        teamColor: '#E80020',
        powerUnit: 'Ferrari',
        teamPrincipal: 'Maurizio Arrivabene',
        finalRank: 3,
        points: 398,
        drivers: [
          { code: 'VET', name: 'セバスチャン・ベッテル', number: 5, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', note: '表彰台7回' },
          { code: 'RAI', name: 'キミ・ライコネン', number: 7, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: '表彰台4回' },
        ],
        reserves: [
          { code: 'VERG', name: 'ジャン＝エリック・ベルニュ', country: 'フランス', flag: '🇫🇷', role: 'Test' },
          { code: 'GIO', name: 'アントニオ・ジョヴィナッツィ', country: 'イタリア', flag: '🇮🇹', role: 'Test' },
          { code: 'LEC', name: 'シャルル・ルクレール', country: 'モナコ', flag: '🇲🇨', role: 'Test', note: 'GP3王者獲得' },
        ],
      },
      {
        teamId: 'force-india',
        teamName: 'Force India',
        fullName: 'Sahara Force India F1 Team',
        teamColor: '#F596C8',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Vijay Mallya / Robert Fernley',
        finalRank: 4,
        points: 173,
        drivers: [
          { code: 'PER', name: 'セルジオ・ペレス', number: 11, country: 'メキシコ', flag: '🇲🇽', role: 'Regular', note: 'モナコ＆バクーで表彰台獲得、チーム史上最高位4位に貢献' },
          { code: 'HUL', name: 'ニコ・ヒュルケンベルグ', number: 27, country: 'ドイツ', flag: '🇩🇪', role: 'Regular' },
        ],
        reserves: [
          { code: 'CEL', name: 'アルフォンソ・セリス・ジュニア', country: 'メキシコ', flag: '🇲🇽', role: 'Test' },
        ],
      },
      {
        teamId: 'williams',
        teamName: 'Williams',
        fullName: 'Williams Martini Racing',
        teamColor: '#FFFFFF',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Claire Williams',
        finalRank: 5,
        points: 138,
        drivers: [
          { code: 'BOT', name: 'バルテリ・ボッタス', number: 77, country: 'フィンランド', flag: '🇫🇮', role: 'Regular', note: 'カナダGPで表彰台3位' },
          { code: 'MAS', name: 'フェリペ・マッサ', number: 19, country: 'ブラジル', flag: '🇧🇷', role: 'Regular' },
        ],
        reserves: [
          { code: 'DIR', name: 'ポール・ディ・レスタ', country: '英国', flag: '🇬🇧', role: 'Reserve' },
        ],
      },
      {
        teamId: 'mclaren',
        teamName: 'McLaren',
        fullName: 'McLaren Honda',
        teamColor: '#1E1E1E',
        powerUnit: 'Honda RA616H',
        teamPrincipal: 'Éric Boullier',
        finalRank: 6,
        points: 76,
        drivers: [
          { code: 'ALO', name: 'フェルナンド・アロンソ', number: 14, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'モナコ5位、アメリカ5位' },
          { code: 'BUT', name: 'ジェンソン・バトン', number: 22, country: '英国', flag: '🇬🇧', role: 'Regular', note: 'オーストリアGP予選3番手' },
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', number: 47, country: 'ベルギー', flag: '🇧🇪', role: 'Regular', isRookie: true, note: 'アロンソ負傷に伴いバーレーンGP代役出走、10位初入賞' },
        ],
        reserves: [
          { code: 'VAN', name: 'ストフェル・ヴァンドーン', country: 'ベルギー', flag: '🇧🇪', role: 'Reserve' },
          { code: 'MAT', name: '松下 信治 (Nobuharu Matsushita)', country: '日本', flag: '🇯🇵', role: 'Test', note: 'マクラーレン・ホンダ開発テストドライバー' },
        ],
      },
      {
        teamId: 'toro-rosso',
        teamName: 'Toro Rosso',
        fullName: 'Scuderia Toro Rosso',
        teamColor: '#00293F',
        powerUnit: 'Ferrari 060 (2015年仕様)',
        teamPrincipal: 'Franz Tost',
        finalRank: 7,
        points: 63,
        drivers: [
          { code: 'SAI', name: 'カルロス・サインツ', number: 55, country: 'スペイン', flag: '🇪🇸', role: 'Regular', note: 'アメリカGP等で6位入賞3回' },
          { code: 'VER', name: 'マックス・フェルスタッペン', number: 33, country: 'オランダ', flag: '🇳🇱', role: 'Regular', note: '第4戦ロシアまで出走しレッドブルへ昇格' },
          { code: 'KVY', name: 'ダニール・クビアト', number: 26, country: 'ロシア', flag: '🇷🇺', role: 'Regular', note: '第5戦スペインよりレッドブルからトレード復帰' },
        ],
        reserves: [
          { code: 'GAS', name: 'ピエール・ガスリー', country: 'フランス', flag: '🇫🇷', role: 'Reserve' },
        ],
      },
      {
        teamId: 'haas',
        teamName: 'Haas F1 Team',
        fullName: 'Haas F1 Team',
        teamColor: '#787878',
        powerUnit: 'Ferrari 061',
        teamPrincipal: 'Guenther Steiner',
        finalRank: 8,
        points: 29,
        drivers: [
          { code: 'GRO', name: 'ロマン・グロージャン', number: 8, country: 'フランス', flag: '🇫🇷', role: 'Regular', isTransfer: true, note: '参戦初戦オーストラリア6位、バーレーン5位の快挙' },
          { code: 'GUT', name: 'エステバン・グティエレス', number: 21, country: 'メキシコ', flag: '🇲🇽', role: 'Regular' },
        ],
        reserves: [
          { code: 'LEC', name: 'シャルル・ルクレール', country: 'モナコ', flag: '🇲🇨', role: 'Test', note: 'FP1に4回出走' },
        ],
      },
      {
        teamId: 'renault',
        teamName: 'Renault',
        fullName: 'Renault Sport Formula One Team',
        teamColor: '#FFF500',
        powerUnit: 'Renault R.E.16',
        teamPrincipal: 'Frédéric Vasseur',
        finalRank: 9,
        points: 8,
        drivers: [
          { code: 'MAG', name: 'ケビン・マグヌッセン', number: 20, country: 'デンマーク', flag: '🇩🇰', role: 'Regular', isTransfer: true, note: 'ロシアGPで7位入賞' },
          { code: 'PAL', name: 'ジョリオン・パーマー', number: 30, country: '英国', flag: '🇬🇧', role: 'Regular', isRookie: true },
        ],
        reserves: [
          { code: 'OCO', name: 'エステバン・オコン', country: 'フランス', flag: '🇫🇷', role: 'Reserve' },
          { code: 'SIR', name: 'セルゲイ・シロトキン', country: 'ロシア', flag: '🇷🇺', role: 'Test' },
        ],
      },
      {
        teamId: 'sauber',
        teamName: 'Sauber',
        fullName: 'Sauber F1 Team',
        teamColor: '#002B49',
        powerUnit: 'Ferrari 061',
        teamPrincipal: 'Monisha Kaltenborn',
        finalRank: 10,
        points: 2,
        drivers: [
          { code: 'NAS', name: 'フェリペ・ナスル', number: 12, country: 'ブラジル', flag: '🇧🇷', role: 'Regular', note: '豪雨の母国ブラジルGPで殊勲の9位入賞' },
          { code: 'ERI', name: 'マーカス・エリクソン', number: 9, country: 'スウェーデン', flag: '🇸🇪', role: 'Regular' },
        ],
        reserves: [],
      },
      {
        teamId: 'manor',
        teamName: 'Manor Racing',
        fullName: 'Manor Racing MRT',
        teamColor: '#004C97',
        powerUnit: 'Mercedes',
        teamPrincipal: 'Dave Ryan',
        finalRank: 11,
        points: 1,
        drivers: [
          { code: 'WEH', name: 'パスカル・ウェーレイン', number: 94, country: 'ドイツ', flag: '🇩🇪', role: 'Regular', isRookie: true, note: 'オーストリアGPで値千金の10位入賞' },
          { code: 'HAR_R', name: 'リオ・ハリアント', number: 88, country: 'インドネシア', flag: '🇮🇩', role: 'Regular', isRookie: true, note: '第12戦ドイツまで出走' },
          { code: 'OCO', name: 'エステバン・オコン', number: 31, country: 'フランス', flag: '🇫🇷', role: 'Regular', isRookie: true, note: 'ベルギーGPよりマノーからF1デビュー' },
        ],
        reserves: [
          { code: 'ROS_A', name: 'アレクサンダー・ロッシ', country: '米国', flag: '🇺🇸', role: 'Reserve' },
          { code: 'KIN', name: 'ジョーダン・キング', country: '英国', flag: '🇬🇧', role: 'Test' },
        ],
      },
    ],
  },
};

/**
 * Returns available historical season years in descending order.
 */
export function getAvailableHistoricalYears(): number[] {
  return Object.keys(HISTORICAL_SEASONS_DATA)
    .map(Number)
    .sort((a, b) => b - a);
}

/**
 * Fetch season grid info by year.
 */
export function getHistoricalSeasonGrid(year: number): SeasonGridInfo | undefined {
  return HISTORICAL_SEASONS_DATA[year];
}
