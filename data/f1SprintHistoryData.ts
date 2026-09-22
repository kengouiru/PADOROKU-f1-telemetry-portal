/**
 * data/f1SprintHistoryData.ts
 * F1スプリントレースの歴史・年別開催地・フォーマット変遷アーカイブ
 * 
 * 2021年の試験導入から2026年最新シーズンまでの全スプリント開催履歴をストック。
 * 従来の常連サーキット（インテルラゴス、レッドブル・リンク等）から
 * 2026年の新展開（モントリオール、ザントフォールト、シンガポール新設、シルバーストン復帰）までの
 * 変遷を網羅した公式準拠データ。
 */

export interface SprintVenueRecord {
  round: number;
  circuitId: string;
  gpName: string;
  circuitName: string;
  country: string;
  flag: string;
  notableMoment?: string;
}

export interface SprintSeasonArchive {
  year: number;
  totalSprints: number;
  formatDescription: string;
  pointsSystem: string;
  rulesHighlight: string;
  venues: SprintVenueRecord[];
}

export const F1_SPRINT_HISTORY_ARCHIVE: SprintSeasonArchive[] = [
  {
    year: 2021,
    totalSprints: 3,
    formatDescription: '「スプリント予選（Sprint Qualifying）」として試験導入。土曜100kmレースの順位が日曜決勝のスターティンググリッドを決定。',
    pointsSystem: '1位: 3点, 2位: 2点, 3位: 1点 (上位3名のみ)',
    rulesHighlight: '歴史上初のスプリント実験年。金曜夕方に通常予選、土曜午後に100kmスプリントを実施。',
    venues: [
      {
        round: 10,
        circuitId: 'silverstone',
        gpName: 'イギリスGP',
        circuitName: 'シルバーストン・サーキット',
        country: 'イギリス',
        flag: '🇬🇧',
        notableMoment: '史上初のF1スプリント開催。フェルスタッペンがスタートでハミルトンを逆転し勝利。'
      },
      {
        round: 14,
        circuitId: 'monza',
        gpName: 'イタリアGP',
        circuitName: 'モンツァ・サーキット',
        country: 'イタリア',
        flag: '🇮🇹',
        notableMoment: 'ボッタスが首位チェッカーを受けるもPU交換ペナルティで後方グリッドへ。'
      },
      {
        round: 19,
        circuitId: 'interlagos',
        gpName: 'サンパウロGP',
        circuitName: 'インテルラゴス・サーキット',
        country: 'ブラジル',
        flag: '🇧🇷',
        notableMoment: 'DRS失格で最後尾20番グリッドから出走したハミルトンが24周で15台抜きの超絶怒涛の追い上げを演じる。'
      }
    ]
  },
  {
    year: 2022,
    totalSprints: 3,
    formatDescription: '名称を「F1スプリント」へ改称。ポイント付与対象を上位8名へと大幅拡大。',
    pointsSystem: '1位: 8点 〜 8位: 1点 (上位8名)',
    rulesHighlight: '統計上の「ポールポジション」記録が金曜最速タイム記録者に付与されるようルール変更。',
    venues: [
      {
        round: 4,
        circuitId: 'imola',
        gpName: 'エミリア・ロマーニャGP',
        circuitName: 'イモラ・サーキット',
        country: 'イタリア',
        flag: '🇮🇹',
        notableMoment: 'フェルスタッペンが終盤にルクレールを猛追しDRSで劇的逆転勝利。'
      },
      {
        round: 11,
        circuitId: 'redbull-ring',
        gpName: 'オーストリアGP',
        circuitName: 'レッドブル・リンク',
        country: 'オーストリア',
        flag: '🇦🇹',
        notableMoment: 'フェラーリ勢（ルクレール vs サインツ）の激しいチームメイトバトルが展開。'
      },
      {
        round: 21,
        circuitId: 'interlagos',
        gpName: 'サンパウロGP',
        circuitName: 'インテルラゴス・サーキット',
        country: 'ブラジル',
        flag: '🇧🇷',
        notableMoment: 'ジョージ・ラッセルがF1初勝利（スプリント）を飾り、メルセデス日曜ワンツーへの布石に。'
      }
    ]
  },
  {
    year: 2023,
    totalSprints: 6,
    formatDescription: '開催数を年6戦へ倍増。日曜決勝から完全独立した「スプリント・シュートアウト（スプリント専用予選）」を新設。',
    pointsSystem: '1位: 8点 〜 8位: 1点 (上位8名)',
    rulesHighlight: '土曜日を完全な「スプリント・デイ」として独立分離。スプリントの結果が日曜決勝グリッドに影響しない独立フォーマット確立。',
    venues: [
      {
        round: 4,
        circuitId: 'baku',
        gpName: 'アゼルバイジャンGP',
        circuitName: 'バクー・市街地コース',
        country: 'アゼルバイジャン',
        flag: '🇦🇿',
        notableMoment: '新設スプリント・シュートアウトの初運用。ペレスがストリートコースの強さを発揮し優勝。'
      },
      {
        round: 9,
        circuitId: 'redbull-ring',
        gpName: 'オーストリアGP',
        circuitName: 'レッドブル・リンク',
        country: 'オーストリア',
        flag: '🇦🇹',
        notableMoment: 'ウェットからドライへの劇的タイヤストラテジー戦。'
      },
      {
        round: 12,
        circuitId: 'spa-francorchamps',
        gpName: 'ベルギーGP',
        circuitName: 'スパ・フランコルシャン',
        country: 'ベルギー',
        flag: '🇧🇪',
        notableMoment: '雨によるディレイ後、オスカー・ピアストリが初首位走行を披露。'
      },
      {
        round: 17,
        circuitId: 'losail',
        gpName: 'カタールGP',
        circuitName: 'ロサイル・インターナショナル・サーキット',
        country: 'カタール',
        flag: '🇶🇦',
        notableMoment: 'ピアストリがスプリント初優勝。2位に入ったフェルスタッペンが土曜日に年間チャンピオン確定。'
      },
      {
        round: 18,
        circuitId: 'cota',
        gpName: 'アメリカGP',
        circuitName: 'サーキット・オブ・ジ・アメリカズ',
        country: 'アメリカ',
        flag: '🇺🇸',
        notableMoment: 'オースティンのバンピーな路面で各車車高セッティングに苦悶。'
      },
      {
        round: 20,
        circuitId: 'interlagos',
        gpName: 'サンパウロGP',
        circuitName: 'インテルラゴス・サーキット',
        country: 'ブラジル',
        flag: '🇧🇷',
        notableMoment: '3年連続開催。インテルラゴスのスプリント適性の高さが証明される。'
      }
    ]
  },
  {
    year: 2024,
    totalSprints: 6,
    formatDescription: '週末スケジュールの最適化。金曜午前FP1→午後スプリント予選、土曜午前スプリント→午後決勝予選、日曜決勝の順に変更。',
    pointsSystem: '1位: 8点 〜 8位: 1点 (上位8名)',
    rulesHighlight: 'パルクフェルメ規定が緩和され、土曜スプリント終了後に日曜決勝に向けたセットアップ変更が可能に。',
    venues: [
      {
        round: 5,
        circuitId: 'shanghai',
        gpName: '中国GP',
        circuitName: '上海インターナショナル・サーキット',
        country: '中国',
        flag: '🇨🇳',
        notableMoment: '雨のスプリント予選でノリスがポール奪取。決勝スプリントはフェルスタッペン完勝。'
      },
      {
        round: 6,
        circuitId: 'miami',
        gpName: 'マイアミGP',
        circuitName: 'マイアミ・インターナショナル・オートドローム',
        country: 'アメリカ',
        flag: '🇺🇸',
        notableMoment: 'リカルド（RB）が驚異的なディフェンスで4位フィニッシュ、貴重なポイント獲得。'
      },
      {
        round: 11,
        circuitId: 'redbull-ring',
        gpName: 'オーストリアGP',
        circuitName: 'レッドブル・リンク',
        country: 'オーストリア',
        flag: '🇦🇹',
        notableMoment: 'マクラーレン勢とフェルスタッペンのターン3/4での熾烈な攻防。'
      },
      {
        round: 19,
        circuitId: 'cota',
        gpName: 'アメリカGP',
        circuitName: 'サーキット・オブ・ジ・アメリカズ',
        country: 'アメリカ',
        flag: '🇺🇸',
        notableMoment: 'フェルスタッペンがポール・トゥ・ウィンで久々の勝利を収め復調をアピール。'
      },
      {
        round: 21,
        circuitId: 'interlagos',
        gpName: 'サンパウロGP',
        circuitName: 'インテルラゴス・サーキット',
        country: 'ブラジル',
        flag: '🇧🇷',
        notableMoment: 'マクラーレンがチームオーダーを発動しノリスが優勝。'
      },
      {
        round: 23,
        circuitId: 'losail',
        gpName: 'カタールGP',
        circuitName: 'ロサイル・インターナショナル・サーキット',
        country: 'カタール',
        flag: '🇶🇦',
        notableMoment: 'ナイトセッションの超高速スプリント。コンストラクターズ争いが白熱。'
      }
    ]
  },
  {
    year: 2025,
    totalSprints: 6,
    formatDescription: '2024年の成功したスケジュール構成を踏襲。スプリントと決勝のセットアップ分離が成熟。',
    pointsSystem: '1位: 8点 〜 8位: 1点 (上位8名)',
    rulesHighlight: '上海、マイアミ、オースティン、ブラジル、カタールの5箇所が継続、スパが復帰。',
    venues: [
      {
        round: 2,
        circuitId: 'shanghai',
        gpName: '中国GP',
        circuitName: '上海インターナショナル・サーキット',
        country: '中国',
        flag: '🇨🇳'
      },
      {
        round: 6,
        circuitId: 'miami',
        gpName: 'マイアミGP',
        circuitName: 'マイアミ・インターナショナル・オートドローム',
        country: 'アメリカ',
        flag: '🇺🇸'
      },
      {
        round: 13,
        circuitId: 'spa-francorchamps',
        gpName: 'ベルギーGP',
        circuitName: 'スパ・フランコルシャン',
        country: 'ベルギー',
        flag: '🇧🇪'
      },
      {
        round: 19,
        circuitId: 'cota',
        gpName: 'アメリカGP',
        circuitName: 'サーキット・オブ・ジ・アメリカズ',
        country: 'アメリカ',
        flag: '🇺🇸'
      },
      {
        round: 21,
        circuitId: 'interlagos',
        gpName: 'サンパウロGP',
        circuitName: 'インテルラゴス・サーキット',
        country: 'ブラジル',
        flag: '🇧🇷'
      },
      {
        round: 23,
        circuitId: 'losail',
        gpName: 'カタールGP',
        circuitName: 'ロサイル・インターナショナル・サーキット',
        country: 'カタール',
        flag: '🇶🇦'
      }
    ]
  },
  {
    year: 2026,
    totalSprints: 6,
    formatDescription: '新レギュレーション（アクティブ空力＋50:50電動PU）導入初年度。開催地の大刷新が行われ、カナダ・オランダ・シンガポールが初採用、シルバーストンが2021年以来の復帰。',
    pointsSystem: '1位: 8点 〜 8位: 1点 (上位8名)',
    rulesHighlight: '【開催地大シャッフル】長年定着していたインテルラゴスやレッドブル・リンクに代わり、市街地＆超テクニカルなモントリオール、ザントフォールト、シンガポール（史上初ナイトスプリント）が電撃抜擢。新PUのバッテリーマネジメントが100km超短期決戦の鍵。',
    venues: [
      {
        round: 2,
        circuitId: 'shanghai',
        gpName: '中国GP',
        circuitName: '上海インターナショナル・サーキット',
        country: '中国',
        flag: '🇨🇳',
        notableMoment: '開幕直後の第2戦。新規定マシンのアクティブ空力（Xモード/Zモード）が初めて実戦スプリントで試される。'
      },
      {
        round: 4,
        circuitId: 'miami',
        gpName: 'マイアミGP',
        circuitName: 'マイアミ・インターナショナル・オートドローム',
        country: 'アメリカ',
        flag: '🇺🇸',
        notableMoment: 'アメリカでの巨大エンタメスプリント。ロングストレートでのマニュアル・オーバーライド機能の威力が試される。'
      },
      {
        round: 5,
        circuitId: 'villeneuve',
        gpName: 'カナダGP',
        circuitName: 'ジル・ヴィルヌーヴ・サーキット',
        country: 'カナダ',
        flag: '🇨🇦',
        notableMoment: '【初開催】低ダウンフォース＆ハードブレーキングのモントリオールでスプリント初導入。チャンピオンの壁を巡る波乱必至。'
      },
      {
        round: 9,
        circuitId: 'silverstone',
        gpName: 'イギリスGP',
        circuitName: 'シルバーストン・サーキット',
        country: 'イギリス',
        flag: '🇬🇧',
        notableMoment: '【5年ぶり復帰】2021年スプリント発祥の地が復活。マゴッツ・ベケッツの超高速コーナーを超軽量・小型化された2026年マシンが疾走。'
      },
      {
        round: 12,
        circuitId: 'zandvoort',
        gpName: 'オランダGP',
        circuitName: 'ザントフォールト・サーキット',
        country: 'オランダ',
        flag: '🇳🇱',
        notableMoment: '【初開催】バンク角のついた名物コーナーと狭隘なコース。抜きにくさを新空力とオーバーライドで克服できるかが焦点。'
      },
      {
        round: 17,
        circuitId: 'singapore',
        gpName: 'シンガポールGP',
        circuitName: 'マリーナベイ・ストリート・サーキット',
        country: 'シンガポール',
        flag: '🇸🇬',
        notableMoment: '【史上初】F1スプリント史上初となるナイトレース開催！過酷な熱帯多湿と市街地ウォールに囲まれた極限の100kmバトル。'
      }
    ]
  }
];

/**
 * サーキットIDが過去または現在スプリント開催実績があるかを判定
 */
export function getSprintHistoryByCircuit(circuitId: string): { year: number; round: number }[] {
  const results: { year: number; round: number }[] = [];
  for (const season of F1_SPRINT_HISTORY_ARCHIVE) {
    for (const v of season.venues) {
      if (v.circuitId === circuitId) {
        results.push({ year: season.year, round: v.round });
      }
    }
  }
  return results;
}
