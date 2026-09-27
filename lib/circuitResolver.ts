/**
 * lib/circuitResolver.ts
 * Resolves circuit ID, official total laps, and telemetry baseline benchmarks
 * from Grand Prix session metadata.
 */

import type { Session } from './types';

export interface CircuitBenchmark {
  circuitId: string;
  name: string;
  location: string;
  totalLaps: number;
  baseLapTimeSec: number;
  pit1Lap: number;
  pit2Lap: number;
  topSpeedKmh: number;
}

export const CIRCUIT_BENCHMARKS: Record<string, CircuitBenchmark> = {
  'albert-park': {
    circuitId: 'albert-park',
    name: 'Albert Park Circuit',
    location: 'Melbourne',
    totalLaps: 58,
    baseLapTimeSec: 78.5, // ~1:18.500
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 335,
  },
  'shanghai': {
    circuitId: 'shanghai',
    name: 'Shanghai International Circuit',
    location: 'Shanghai',
    totalLaps: 56,
    baseLapTimeSec: 96.0, // ~1:36.000
    pit1Lap: 16,
    pit2Lap: 36,
    topSpeedKmh: 340,
  },
  'suzuka': {
    circuitId: 'suzuka',
    name: 'Suzuka International Racing Course',
    location: 'Suzuka',
    totalLaps: 53,
    baseLapTimeSec: 92.5, // ~1:32.500
    pit1Lap: 15,
    pit2Lap: 34,
    topSpeedKmh: 326,
  },
  'bahrain-international': {
    circuitId: 'bahrain-international',
    name: 'Bahrain International Circuit',
    location: 'Sakhir',
    totalLaps: 57,
    baseLapTimeSec: 93.8, // ~1:33.800
    pit1Lap: 17,
    pit2Lap: 37,
    topSpeedKmh: 330,
  },
  'jeddah': {
    circuitId: 'jeddah',
    name: 'Jeddah Corniche Circuit',
    location: 'Jeddah',
    totalLaps: 50,
    baseLapTimeSec: 89.5, // ~1:29.500
    pit1Lap: 19,
    pit2Lap: 38,
    topSpeedKmh: 345,
  },
  'miami': {
    circuitId: 'miami',
    name: 'Miami International Autodrome',
    location: 'Miami',
    totalLaps: 57,
    baseLapTimeSec: 89.8, // ~1:29.800
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 345,
  },
  'imola': {
    circuitId: 'imola',
    name: 'Autodromo Internazionale Enzo e Dino Ferrari',
    location: 'Imola',
    totalLaps: 63,
    baseLapTimeSec: 78.5, // ~1:18.500
    pit1Lap: 22,
    pit2Lap: 43,
    topSpeedKmh: 325,
  },
  'circuit-de-monaco': {
    circuitId: 'circuit-de-monaco',
    name: 'Circuit de Monaco',
    location: 'Monaco',
    totalLaps: 78,
    baseLapTimeSec: 74.0, // ~1:14.000
    pit1Lap: 28,
    pit2Lap: 52,
    topSpeedKmh: 295,
  },
  'catalunya': {
    circuitId: 'catalunya',
    name: 'Circuit de Barcelona-Catalunya',
    location: 'Barcelona',
    totalLaps: 66,
    baseLapTimeSec: 76.5, // ~1:16.500
    pit1Lap: 19,
    pit2Lap: 42,
    topSpeedKmh: 332,
  },
  'villeneuve': {
    circuitId: 'villeneuve',
    name: 'Circuit Gilles Villeneuve',
    location: 'Montreal',
    totalLaps: 70,
    baseLapTimeSec: 74.5, // ~1:14.500
    pit1Lap: 21,
    pit2Lap: 46,
    topSpeedKmh: 338,
  },
  'redbull-ring': {
    circuitId: 'redbull-ring',
    name: 'Red Bull Ring',
    location: 'Spielberg',
    totalLaps: 71,
    baseLapTimeSec: 67.5, // ~1:07.500
    pit1Lap: 21,
    pit2Lap: 48,
    topSpeedKmh: 328,
  },
  'silverstone': {
    circuitId: 'silverstone',
    name: 'Silverstone Circuit',
    location: 'Silverstone',
    totalLaps: 52,
    baseLapTimeSec: 88.5, // ~1:28.500
    pit1Lap: 16,
    pit2Lap: 35,
    topSpeedKmh: 330,
  },
  'hungaroring': {
    circuitId: 'hungaroring',
    name: 'Hungaroring',
    location: 'Budapest',
    totalLaps: 70,
    baseLapTimeSec: 79.5, // ~1:19.500
    pit1Lap: 20,
    pit2Lap: 44,
    topSpeedKmh: 315,
  },
  'spa-francorchamps': {
    circuitId: 'spa-francorchamps',
    name: 'Circuit de Spa-Francorchamps',
    location: 'Spa-Francorchamps',
    totalLaps: 44,
    baseLapTimeSec: 105.5, // ~1:45.500
    pit1Lap: 14,
    pit2Lap: 29,
    topSpeedKmh: 345,
  },
  'zandvoort': {
    circuitId: 'zandvoort',
    name: 'Circuit Zandvoort',
    location: 'Zandvoort',
    totalLaps: 72,
    baseLapTimeSec: 72.8, // ~1:12.800
    pit1Lap: 24,
    pit2Lap: 49,
    topSpeedKmh: 318,
  },
  'monza': {
    circuitId: 'monza',
    name: 'Autodromo Nazionale Monza',
    location: 'Monza',
    totalLaps: 53,
    baseLapTimeSec: 81.2, // ~1:21.200
    pit1Lap: 18,
    pit2Lap: 36,
    topSpeedKmh: 355,
  },
  'baku': {
    circuitId: 'baku',
    name: 'Baku City Circuit',
    location: 'Baku',
    totalLaps: 51,
    baseLapTimeSec: 102.5, // ~1:42.500
    pit1Lap: 15,
    pit2Lap: 34,
    topSpeedKmh: 352,
  },
  'singapore': {
    circuitId: 'singapore',
    name: 'Marina Bay Street Circuit',
    location: 'Singapore',
    totalLaps: 62,
    baseLapTimeSec: 96.0, // ~1:36.000
    pit1Lap: 20,
    pit2Lap: 43,
    topSpeedKmh: 315,
  },
  'cota': {
    circuitId: 'cota',
    name: 'Circuit of the Americas',
    location: 'Austin',
    totalLaps: 56,
    baseLapTimeSec: 96.5, // ~1:36.500
    pit1Lap: 17,
    pit2Lap: 36,
    topSpeedKmh: 335,
  },
  'mexico': {
    circuitId: 'mexico',
    name: 'Autódromo Hermanos Rodríguez',
    location: 'Mexico City',
    totalLaps: 71,
    baseLapTimeSec: 79.5, // ~1:19.500
    pit1Lap: 23,
    pit2Lap: 48,
    topSpeedKmh: 352,
  },
  'interlagos': {
    circuitId: 'interlagos',
    name: 'Autódromo José Carlos Pace',
    location: 'Sao Paulo',
    totalLaps: 71,
    baseLapTimeSec: 71.8, // ~1:11.800
    pit1Lap: 22,
    pit2Lap: 47,
    topSpeedKmh: 332,
  },
  'las-vegas': {
    circuitId: 'las-vegas',
    name: 'Las Vegas Strip Circuit',
    location: 'Las Vegas',
    totalLaps: 50,
    baseLapTimeSec: 94.5, // ~1:34.500
    pit1Lap: 17,
    pit2Lap: 35,
    topSpeedKmh: 350,
  },
  'losail': {
    circuitId: 'losail',
    name: 'Lusail International Circuit',
    location: 'Lusail',
    totalLaps: 57,
    baseLapTimeSec: 83.5, // ~1:23.500
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 336,
  },
  'yas-marina': {
    circuitId: 'yas-marina',
    name: 'Yas Marina Circuit',
    location: 'Yas Marina',
    totalLaps: 58,
    baseLapTimeSec: 86.5, // ~1:26.500
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 335,
  },
  'madrid': {
    circuitId: 'madrid',
    name: 'Madring (IFEMA Madrid Hybrid Circuit)',
    location: 'Madrid',
    totalLaps: 55,
    baseLapTimeSec: 81.5, // ~1:21.500
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 340,
  },
};

// Monaco alias for backwards compatibility
CIRCUIT_BENCHMARKS['monaco'] = CIRCUIT_BENCHMARKS['circuit-de-monaco'];

/**
 * Resolves a circuit identifier and its telemetry benchmark for any given session.
 */
export function resolveCircuitForSession(session: Session | null | undefined): CircuitBenchmark {
  if (!session) {
    return CIRCUIT_BENCHMARKS['bahrain-international'];
  }

  const query = `${session.meeting_name ?? ''} ${session.location ?? ''} ${session.meeting_official_name ?? ''}`.toLowerCase();

  if (query.includes('melbourne') || query.includes('australi') || query.includes('albert')) {
    return CIRCUIT_BENCHMARKS['albert-park'];
  }
  if (query.includes('shanghai') || query.includes('chin')) {
    return CIRCUIT_BENCHMARKS['shanghai'];
  }
  if (query.includes('suzuka') || query.includes('japan')) {
    return CIRCUIT_BENCHMARKS['suzuka'];
  }
  if (query.includes('bahrain') || query.includes('sakhir')) {
    return CIRCUIT_BENCHMARKS['bahrain-international'];
  }
  if (query.includes('jeddah') || query.includes('saudi')) {
    return CIRCUIT_BENCHMARKS['jeddah'];
  }
  if (query.includes('miami')) {
    return CIRCUIT_BENCHMARKS['miami'];
  }
  if (query.includes('imola') || query.includes('emilia') || query.includes('dino ferrari')) {
    return CIRCUIT_BENCHMARKS['imola'];
  }
  if (query.includes('monaco') || query.includes('monte carlo')) {
    return CIRCUIT_BENCHMARKS['circuit-de-monaco'];
  }
  if (query.includes('madrid') || query.includes('madring') || query.includes('ifema')) {
    return CIRCUIT_BENCHMARKS['madrid'];
  }
  if (query.includes('catalunya') || query.includes('barcelona') || query.includes('spani') || query.includes('españa')) {
    return CIRCUIT_BENCHMARKS['catalunya'];
  }
  if (query.includes('montreal') || query.includes('canad') || query.includes('villeneuve')) {
    return CIRCUIT_BENCHMARKS['villeneuve'];
  }
  if (query.includes('spielberg') || query.includes('austria') || query.includes('red bull ring')) {
    return CIRCUIT_BENCHMARKS['redbull-ring'];
  }
  if (query.includes('silverstone') || query.includes('british') || query.includes('great britain')) {
    return CIRCUIT_BENCHMARKS['silverstone'];
  }
  if (query.includes('hungaroring') || query.includes('hungar') || query.includes('budapest')) {
    return CIRCUIT_BENCHMARKS['hungaroring'];
  }
  if (query.includes('spa') || query.includes('belgi') || query.includes('francorchamps')) {
    return CIRCUIT_BENCHMARKS['spa-francorchamps'];
  }
  if (query.includes('zandvoort') || query.includes('dutch') || query.includes('netherland')) {
    return CIRCUIT_BENCHMARKS['zandvoort'];
  }
  if (query.includes('monza') || query.includes('ital')) {
    return CIRCUIT_BENCHMARKS['monza'];
  }
  if (query.includes('baku') || query.includes('azerbaijan')) {
    return CIRCUIT_BENCHMARKS['baku'];
  }
  if (query.includes('singapore') || query.includes('marina bay')) {
    return CIRCUIT_BENCHMARKS['singapore'];
  }
  if (query.includes('austin') || query.includes('united states') || query.includes('cota') || query.includes('americas')) {
    return CIRCUIT_BENCHMARKS['cota'];
  }
  if (query.includes('mexico') || query.includes('rodriguez')) {
    return CIRCUIT_BENCHMARKS['mexico'];
  }
  if (query.includes('interlagos') || query.includes('sao paulo') || query.includes('brazil') || query.includes('brasil')) {
    return CIRCUIT_BENCHMARKS['interlagos'];
  }
  if (query.includes('vegas')) {
    return CIRCUIT_BENCHMARKS['las-vegas'];
  }
  if (query.includes('losail') || query.includes('lusail') || query.includes('qatar')) {
    return CIRCUIT_BENCHMARKS['losail'];
  }
  if (query.includes('yas marina') || query.includes('abu dhabi')) {
    return CIRCUIT_BENCHMARKS['yas-marina'];
  }

  return CIRCUIT_BENCHMARKS['bahrain-international'];
}

export interface AtmospherePhoto {
  url: string;
  caption: string;
  tag: string;
}

export function getCircuitAtmospherePhotos(circuitId: string, gpName: string = ''): [AtmospherePhoto, AtmospherePhoto] {
  const photoMap: Record<string, [AtmospherePhoto, AtmospherePhoto]> = {
    'suzuka': [
      {
        url: '/images/circuits/circuit_suzuka_real.jpg',
        caption: '鈴鹿名物の大観覧車と超満員のグランドスタンド。世界屈指の熱気',
        tag: 'グランドスタンド＆熱気'
      },
      {
        url: '/images/circuits/circuit_suzuka.jpg',
        caption: '名物S字カーブと逆バンク。200km/h超で駆け抜けるドライバーズサーキット',
        tag: 'S字＆テクニカル区間'
      }
    ],
    'circuit-de-monaco': [
      {
        url: '/images/circuits/circuit_monaco_real.jpg',
        caption: 'モンテカルロ港の豪華ヨット群とカジノ広場。F1屈指の格式と歴史',
        tag: 'ハーバー＆カジノ広場'
      },
      {
        url: '/images/circuits/circuit_monaco.jpg',
        caption: 'フェアモント・ヘアピン（旧ロウズ）とトンネル区間の超絶接近戦',
        tag: '最遅ヘアピン＆トンネル'
      }
    ],
    'spa-francorchamps': [
      {
        url: '/images/circuits/circuit_spa_real.jpg',
        caption: 'アルデンヌの森に轟く轟音。名物オールージュ〜ラディオンの急勾配の絶景',
        tag: 'オールージュ＆森林'
      },
      {
        url: '/images/circuits/circuit_spa.jpg',
        caption: 'ケメルストレートエンドのレ・コームとプーホンの超高速ダブルエイペックス',
        tag: 'ケメル＆プーホン'
      }
    ],
    'monza': [
      {
        url: '/images/circuits/circuit_monza_real.jpg',
        caption: 'ティフォシの深紅の熱気と王立公園に響く超高回転サウンド。速度の神殿',
        tag: 'ティフォシの熱気'
      },
      {
        url: '/images/circuits/circuit_monza.jpg',
        caption: '350km/h超からのフルブレーキング勝負・第1シケインと名物パラボリカ',
        tag: '速度の神殿・シケイン'
      }
    ],
    'silverstone': [
      {
        url: '/images/circuits/circuit_silverstone_real.jpg',
        caption: 'モータースポーツ発祥の地。新ピット棟The Wingと熱狂のホームストレート',
        tag: 'The Wing＆ホーム'
      },
      {
        url: '/images/circuits/circuit_silverstone.jpg',
        caption: 'マゴッツ・ベケッツ・チャペルの極限横G連続切り返しとコプスコーナー',
        tag: 'マゴッツ＆ベケッツ'
      }
    ],
    'albert-park': [
      {
        url: '/images/circuits/circuit_albert_park_real.jpg',
        caption: 'メルボルンの湖畔公園に特設される美しい緑と高層ビル群のコントラスト',
        tag: '湖畔公園＆開幕戦熱狂'
      },
      {
        url: '/images/circuits/circuit_albert_park.jpg',
        caption: '高速化したセクター2とターン9-10の超ハイスピードシケインアプローチ',
        tag: '高速レイクサイド'
      }
    ],
    'shanghai': [
      {
        url: '/images/circuits/circuit_shanghai_real.jpg',
        caption: '漢字の「上」を象った巨大建築メインスタンドと未来的なパドック景観',
        tag: '巨大スタンド＆パドック'
      },
      {
        url: '/images/circuits/circuit_shanghai.jpg',
        caption: 'ターン1-2の巻き込むような「かたつむりコーナー」と1.2kmロングストレート',
        tag: 'ロングストレート'
      }
    ],
    'bahrain-international': [
      {
        url: '/images/circuits/circuit_bahrain_real.jpg',
        caption: '砂漠の夜空を白銀に照らす無数の投光器。ナイトレースの幻想的な輝き',
        tag: '砂漠のナイトレース'
      },
      {
        url: '/images/circuits/circuit_bahrain.jpg',
        caption: 'オアシスタワーと花崗岩アスファルト。激しいタイヤ摩耗とターン10',
        tag: 'オアシスタワー'
      }
    ],
    'jeddah': [
      {
        url: '/images/circuits/circuit_jeddah_real.jpg',
        caption: '紅海沿岸を平均時速250km/h超で駆け抜ける世界最速の市街地サーキット',
        tag: '紅海コーストライン'
      },
      {
        url: '/images/circuits/circuit_jeddah.jpg',
        caption: 'バンク角12度のターン13と連続するブラインド高速コーナーの緊迫感',
        tag: 'バンク＆ブラインドS字'
      }
    ],
    'miami': [
      {
        url: '/images/circuits/circuit_miami_real.jpg',
        caption: 'NFLハードロック・スタジアムを取り囲むアメリカンエンターテインメントの祭典',
        tag: 'スタジアム＆キャンパス'
      },
      {
        url: '/images/circuits/circuit_miami.jpg',
        caption: '高速マリーナセクターとターン14-15の高架下タイトシケイン',
        tag: '高架下シケイン'
      }
    ],
    'imola': [
      {
        url: '/images/circuits/circuit_imola_real.jpg',
        caption: 'サンテルモの丘とエンツォ・エ・ディーノ・フェラーリの歴史と情熱の聖地',
        tag: '歴史の聖地＆丘陵'
      },
      {
        url: '/images/circuits/circuit_imola.jpg',
        caption: 'トサコーナーのすり鉢状バンクとアクエ・ミネラリの超難関ブレーキング',
        tag: 'トサ＆アクエミネラリ'
      }
    ],
    'catalunya': [
      {
        url: '/images/circuits/circuit_catalunya.jpg',
        caption: 'マシンの総合空力性能が白日の下に晒されるバルセロナの名門コース',
        tag: '名門カタロニア全景'
      },
      {
        url: '/images/circuits/circuit_asset_12.jpg',
        caption: '超ロングなターン3のロングスウィープとリニューアルされた最終高速ベンド',
        tag: '高速ターン3'
      }
    ],
    'villeneuve': [
      {
        url: '/images/circuits/circuit_villeneuve_real.jpg',
        caption: 'セント・ローレンス川に浮かぶノートルダム島。緑豊かな万博跡地の特設コース',
        tag: 'ノートルダム島＆水辺'
      },
      {
        url: '/images/circuits/circuit_villeneuve.jpg',
        caption: 'チャンピオンたちの挑戦を阻んできた最終シケイン「チャンピオンの壁」',
        tag: 'チャンピオンの壁'
      }
    ],
    'redbull-ring': [
      {
        url: '/images/circuits/circuit_redbull_ring_real.jpg',
        caption: '雄大なシュタイアーマルク山脈のパノラマと巨大な雄牛モニュメント',
        tag: 'アルプス山脈＆雄牛'
      },
      {
        url: '/images/circuits/circuit_redbull_ring.jpg',
        caption: '急勾配を駆け上がるターン1〜ターン3の強烈なオーバーテイク合戦',
        tag: '急勾配アップヒル'
      }
    ],
    'hungaroring': [
      {
        url: '/images/circuits/circuit_hungaroring.jpg',
        caption: 'すり鉢状の天然スタンドからコースの大半が見渡せる夏の伝統グランプリ',
        tag: '天然すり鉢スタンド'
      },
      {
        url: '/images/circuits/circuit_asset_18.jpg',
        caption: '「壁のないモナコ」と称される息つく暇もない中低速テクニカルコーナー群',
        tag: 'ツイスティ・インフィールド'
      }
    ],
    'zandvoort': [
      {
        url: '/images/circuits/circuit_zandvoort.jpg',
        caption: '北海沿岸の砂丘地帯を縫うように走るオレンジアーミー歓喜のオランダGP',
        tag: '砂丘＆オレンジアーミー'
      },
      {
        url: '/images/circuits/circuit_asset_19.jpg',
        caption: 'バンク角18度のターザンカーブとアリー・ルイエンダイク・バンクの迫力',
        tag: '18度バンクコーナー'
      }
    ],
    'baku': [
      {
        url: '/images/circuits/circuit_baku_real.jpg',
        caption: '世界遺産の旧市街城壁と超近代的なカスピ海プロムナードの強烈な対比',
        tag: '旧市街城壁＆超近代都市'
      },
      {
        url: '/images/circuits/circuit_baku.jpg',
        caption: '幅わずか7.6mの城壁セクションと時速350km/h超の2.2kmメイン直線',
        tag: '城壁狭窄路＆最高速直線'
      }
    ],
    'singapore': [
      {
        url: '/images/circuits/circuit_singapore_real.jpg',
        caption: 'マリーナベイ・サンズを背景に熱帯の夜を疾走する世界初のF1ナイトレース',
        tag: 'マリーナベイ夜景'
      },
      {
        url: '/images/circuits/circuit_singapore.jpg',
        caption: 'アンダーソン橋を渡る歴史的ストリートと湿度80%超の過酷なサバイバル戦',
        tag: 'アンダーソン橋＆シティ'
      }
    ],
    'cota': [
      {
        url: '/images/circuits/circuit_cota_real.jpg',
        caption: '赤白青の星条旗カラーと高さ77mの展望タワーが象徴するテキサスの熱気',
        tag: '展望タワー＆星条旗'
      },
      {
        url: '/images/circuits/circuit_cota.jpg',
        caption: '高低差41mを一気に駆け上がるブラインドの急勾配ターン1ブレーキング',
        tag: '急坂ターン1アプローチ'
      }
    ],
    'mexico': [
      {
        url: '/images/circuits/circuit_mexico_real.jpg',
        caption: '旧野球場フォロ・ソルに作られたスタジアムセクション。4万人の大歓声',
        tag: 'フォロ・ソル野球場'
      },
      {
        url: '/images/circuits/circuit_mexico.jpg',
        caption: '標高2,285mの希薄な空気。最高速350km/hと低下するダウンフォース',
        tag: '高地2285mメイン直線'
      }
    ],
    'interlagos': [
      {
        url: '/images/circuits/circuit_interlagos_real.jpg',
        caption: 'サンパウロの熱狂的なサンバのリズムとセナの魂が宿る伝統のインテルラゴス',
        tag: 'セナの聖地＆大観衆'
      },
      {
        url: '/images/circuits/circuit_interlagos.jpg',
        caption: '下りながら左右に切り返す名物エス・ド・セナと急坂を駆け上がる最終加速',
        tag: 'エス・ド・セナ'
      }
    ],
    'las-vegas': [
      {
        url: '/images/circuits/circuit_las_vegas_real.jpg',
        caption: 'ラスベガス・ストリップ通りを封鎖し、ネオンと巨大Sphereが輝く土曜ナイトレース',
        tag: 'ストリップ通り＆Sphere'
      },
      {
        url: '/images/circuits/circuit_las_vegas.jpg',
        caption: 'ベラージオの噴水前を時速350km/hで駆け抜ける約2kmの超高速ストレート',
        tag: 'ベラージオ噴水前直線'
      }
    ],
    'losail': [
      {
        url: '/images/circuits/circuit_losail_real.jpg',
        caption: '最新鋭のピットビルディングと砂漠を照らすLED照明。中東カタールの豪華舞台',
        tag: 'カタールLEDナイト'
      },
      {
        url: '/images/circuits/circuit_losail.jpg',
        caption: '流れるような中高速コーナーの連続とドライバーを極限まで追い詰める過酷な熱',
        tag: '超高速フローセクション'
      }
    ],
    'yas-marina': [
      {
        url: '/images/circuits/circuit_yas_marina_real.jpg',
        caption: 'Wアブダビ・ホテルのイルミネーションと夕暮れから夜へ移ろうトワイライトレース',
        tag: 'Wホテル＆トワイライト'
      },
      {
        url: '/images/circuits/circuit_yas_marina.jpg',
        caption: '改修された高速バンクコーナーとシーズンフィナーレの華やかな表彰台',
        tag: 'グランドフィナーレ'
      }
    ],
    'madrid': [
      {
        url: '/images/circuits/circuit_madrid.jpg',
        caption: '2026年新設のIFEMAマドリード市街地コース。展示会場と公道が融合した新舞台',
        tag: 'IFEMAマドリード新設'
      },
      {
        url: '/images/circuits/circuit_asset_14.jpg',
        caption: '高速立体交差と市街地ストリートセクションが織りなす次世代のレイアウト',
        tag: '次世代ハイブリッド市街地'
      }
    ],
  };

  const cleanId = circuitId.toLowerCase().replace(/_/g, '-');
  const match = photoMap[cleanId] || photoMap[circuitId];
  if (match) return match;

  const fallbackBase = cleanId.replace(/-/g, '_');
  return [
    {
      url: `/images/circuits/circuit_${fallbackBase}_real.jpg`,
      caption: `${gpName || 'グランプリ'} の熱狂に包まれるサーキット全景`,
      tag: 'サーキット全景'
    },
    {
      url: `/images/circuits/circuit_${fallbackBase}.jpg`,
      caption: `${gpName || 'グランプリ'} の名所コーナーと白熱のコースセクター`,
      tag: '名所コース'
    }
  ];
}
