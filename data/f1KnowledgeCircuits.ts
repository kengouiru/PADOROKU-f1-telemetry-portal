import { 
  TeamProfile, DriverProfile, CircuitProfile, 
  StrategyConcept, HistoryArchive,
  TyreKnowledge, Reference, TeamIconicCar, DriverMilestone, IconicRace,
  DriverVisualAsset, VisualGalleryItem, EngineeringPreference, RaceEngineer,
  DriverSocialLinks, DriverSeasonHistory, TelemetryTarget, EmbeddedRadio,
  KeyCorner, CircuitCornerDetail, TrackGeometry, CircuitVisualAsset,
  CircuitHistoricalMoment, CircuitOfficialLinks, CircuitVisualMap
} from './f1KnowledgeTypes';

import { SeasonStoryline, Rivalry, DramaticMoment, PaddockRelationship } from './f1DramaData';
import { DriverTraitId, DriverTraitDefinition, TraitTier, TraitCategory } from './driverTraitsData';

export const KNOWLEDGE_CIRCUITS: CircuitProfile[] = [

  {
    "id": "bahrain-international",
    "name": "バーレーン・インターナショナル・サーキット",
    "officialName": "Bahrain International Circuit (Sakhir)",
    "country": "バーレーン 🇧🇭",
    "lengthKm": 5.412,
    "turns": 15,
    "drsZones": 3,
    "downforceLevel": "Medium",
    "tyreStress": "High",
    "typicalPitLossSec": 22.5,
    "safetyCarProbability": "60% (中程度)",
    "undercutImpact": "極めて大（新品タイヤのゲイン約1.8秒/周）",
    "lapRecord": {
      "time": "1:31.447",
      "driver": "Pedro de la Rosa (McLaren)",
      "year": 2005
    },
    "characteristics": "【第1章：砂漠の夜を切り裂く高負荷ストップ＆ゴー】\\nサヒールの砂漠地帯に位置し、F1プレシーズンテストの舞台としても馴染み深い近代サーキットの模範 [1][5]。4本のロングストレートとヘビーブレーキングゾーンが組み合わされ、強烈な縦方向の加減速（トラクションとストッピングパワー）がマシンの骨格を試す [1][2]。砂漠から吹き込む細かい砂がアスファルトに付着し、セッション序盤の路面ミュー（摩擦係数）の急変や、突風による空力バランスの乱れがドライバーを悩ませる [2][4]。\\n\\n【第2章：過酷な路面アブレシブ性と魔のターン10】\\n花崗岩を多く含んだ特殊舗装はF1カレンダー屈指のタイヤ攻撃性（アブレシブ性）を誇り、リアタイヤの熱劣化（サーマルデグラデーション）管理が戦略の成否を分ける [3][6]。特に下り勾配で左に回り込みながら減速する「ターン10」は、左フロントの内輪側が激しくリフトしてロックアップを誘発しやすい最難関コーナーとして知られる [2][3][5]。",
    "officialLinks": {
          "website": "https://www.bahraingp.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/bahrain.html",
          "googleMaps": "https://maps.google.com/?q=Bahrain+International+Circuit",
          "xTwitter": "https://x.com/BAH_Int_Circuit",
          "instagram": "https://www.instagram.com/bah_int_circuit/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_asset_1.png",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bahrain_International_Circuit--Grand_Prix_Layout.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_asset_1.png",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bahrain_International_Circuit--Grand_Prix_Layout.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_asset_1.png",
        "caption": "砂漠の闇を照らす強力なナイトレース照明とバックストレートの全景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bahrain_International_Circuit_back_straight.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_asset_1.png",
        "caption": "砂漠の闇を照らす強力なナイトレース照明とバックストレートの全景",
        "tag": "Panoramic",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bahrain_International_Circuit_back_straight.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 17.5,
      "longestStraightMeters": 1090,
      "gForceMax": {
        "lateral": 4.2,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Michael Schumacher Turn",
          "characteristic": "330km/hから65km/hへと急減速するオーバーテイクの要衝。"
        },
        {
          "number": "T4",
          "name": "Turn 4",
          "characteristic": "高速アプローチからの下り複合右。トラックリミット違反が多発。"
        },
        {
          "number": "T10",
          "name": "Turn 10",
          "characteristic": "下りながら左に曲がりつつブレーキングする最悪のフロントロックアップ誘発ポイント。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Michael Schumacher Turn",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "330km/h超から65km/hへの急減速。フロントの縦荷重抜けによるイン側ロックに最大限注意。"
      },
      {
        "number": "T2",
        "name": "T2 Kink",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "上り勾配の左立ち上がり。早期のスロットルオープンでT3への加速ラインを作る。"
      },
      {
        "number": "T3",
        "name": "T3 Acceleration",
        "gearEstimated": "4th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "全開で抜ける右ベンド。リアタイヤのスライドを抑えてDRS区間へ繋げる。"
      },
      {
        "number": "T4",
        "name": "Turn 4",
        "gearEstimated": "4th",
        "speedEstimated": "145 km/h",
        "engineeringTip": "下りアプローチの右。エイペックスで縁石を使いすぎると外側ランオフに押し出される。"
      },
      {
        "number": "T5",
        "name": "Esses Entry Left",
        "gearEstimated": "6th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "高速左。ステアリング舵角を一定に保ち、続く右への切り返しに備える。"
      },
      {
        "number": "T6",
        "name": "Esses Right",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "急激な荷重移動。横Gがピークに達するためフロントの応答性が勝負。"
      },
      {
        "number": "T7",
        "name": "Esses Exit Left",
        "gearEstimated": "6th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "下りながらの脱出。風向き（追い風・向かい風）で空力グリップが激変。"
      },
      {
        "number": "T8",
        "name": "Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "タイトな右ヘアピン。インの縁石をコンパクトに回り、立ち上がりのトラクションを最優先。"
      },
      {
        "number": "T9",
        "name": "Downhill Left",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "下りながら左へ旋回しつつT10へのブレーキングを開始する超高難度アプローチ。"
      },
      {
        "number": "T10",
        "name": "Lockup Trap",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "左フロントタイヤが浮き上がりやすく、グリッド中で最もロックアップしやすい魔のコーナー。"
      },
      {
        "number": "T11",
        "name": "Uphill Sweeper",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "バックストレートへ向けて上りながら全開で駆け上がる高速左。"
      },
      {
        "number": "T12",
        "name": "Fast Right Bend",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "ほぼ全開の右ベンド。空力ダウンフォースのフロア安定性が試される。"
      },
      {
        "number": "T13",
        "name": "Turn 13",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "第2バックストレートへ繋がる重要右コーナー。脱出でのリアホイールスピン厳禁。"
      },
      {
        "number": "T14",
        "name": "Final Entry",
        "gearEstimated": "4th",
        "speedEstimated": "135 km/h",
        "engineeringTip": "メインストレートへの進入。トレイルブレーキングで車首を素早くインに向ける。"
      },
      {
        "number": "T15",
        "name": "Main Straight Launch",
        "gearEstimated": "4th ➔ 7th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "メインストレートDRSゾーンへの最終加速。縁石に乗せつつトラクションを最大化。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2014,
        "title": "ハミルトン対ロズベルグ「バーレーンの死闘」",
        "description": "メルセデス同門のハミルトンとロズベルグがセーフティカー明けの残り10周、ホイール・トゥ・ホイールの極限バトルを展開。",
        "detailedStory": "ハイブリッド規程初年度、圧倒的速さを誇るメルセデスの2台。オプションタイヤのロズベルグがプライムタイヤのハミルトンに猛攻を仕掛けるも、ハミルトンが神懸かり的なブレーキングディフェンスで首位を死守。F1史上に残るクリーンかつ壮絶なチームメイト対決となった。",
        "significance": "V6ターボハイブリッド時代の幕開けを象徴する伝説的バトル。"
      },
      {
        "year": 2020,
        "title": "グロージャン奇跡の生還劇",
        "description": "オープニングラップでロマン・グロージャンのマシンがガードレールを突き破り2つに裂け炎上。Haloにより命を救われた。",
        "detailedStory": "ターン3立ち上がりでの接触から時速220km/h超でバリアに激突、衝撃荷重67Gを記録。マシンは真っ二つに裂け巨大な火球と化したが、Haloがドライバー頭部を致命的衝撃から防ぎ、グロージャン自ら炎の中から脱出。FIAの長年の安全技術研究の集大成となった。",
        "significance": "Halo安全デバイスの有効性を世界に証明したモータースポーツ史の転換点。"
      },
      {
        "year": 2021,
        "title": "フェルスタッペン対ハミルトン 開幕戦トラックリミット劇",
        "description": "レッドブルのフェルスタッペンがターン4外側からハミルトンをオーバーテイクするも、コース外走行判定でポジション返還を命じられハミルトンが勝利。",
        "detailedStory": "2021年の歴史的タイトル争いの口火を切った開幕戦。終盤にフェルスタッペンがターン4で劇的なパッシングを決めたが、4輪が白線を越えていたとしてスチュワードから順位返還を指示された。直後にタイヤのグリップを失い、ハミルトンが0.7秒差で辛勝した。",
        "significance": "2021年シーズンの超激闘を決定づけた伝説の幕開け。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "3本のロングストレートがあるため過度なハイダウンフォースは禁物。最高速と中低速トラクションのバランスをとるミディアムセッティングが基本。",
      "kerbUsage": "ターン1・ターン4・ターン13のイン側縁石は低めだが、ターン10立ち上がりなどアグレッシブに攻めすぎるとフロアを強打しダウンフォースを失う。",
      "brakeDemands": "ターン1、ターン4、ターン8、ターン10と超ハードブレーキングが連続。カーボンディスク温度が1000℃を超えるためダクト冷却開度が重要。"
    },
    "references": [
      {
        "id": 1,
        "title": "FIA Formula One Technical Report - Circuit Kinematics and Energy Dissipation",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-03-01"
      },
      {
        "id": 2,
        "title": "Pirelli F1 Tyre Strategy & Thermal Degradation Map - Sakhir",
        "publisher": "Pirelli Motorsport Engineering",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2024-02-28"
      }
    ]
  },
  {
    "id": "suzuka",
    "name": "鈴鹿サーキット",
    "officialName": "Suzuka International Racing Course",
    "country": "日本 🇯🇵",
    "lengthKm": 5.807,
    "turns": 18,
    "drsZones": 1,
    "downforceLevel": "High",
    "tyreStress": "Very High",
    "typicalPitLossSec": 22.8,
    "safetyCarProbability": "45% (中低)",
    "undercutImpact": "大（アウトラップのタイヤウォームアップとトラフィック処理が鍵）",
    "lapRecord": {
      "time": "1:30.983",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2019
    },
    "characteristics": "【第1章：世界唯一の立体交差とセクター1の幾何学的キネマティクス】\\n世界で唯一の「8の字立体交差（Figure-Eight Layout）」を持ち、高低差52mの起伏に富む鈴鹿サーキット [1]。1962年に本田宗一郎の命によりジョン・フーゲンホルツが設計して以来、現代F1において最もマシンの純粋な空力性能とメカニカルシシー剛性が試される「ドライバーズ・サーキット」の最高峰として君臨する [1][5]。特にセクター1のターン2からターン7（S字〜逆バンク）は、時速220〜255km/hの超高速領域で左右へ最大4.8Gもの激しい横加速度が交互にマシンを襲う [2][3]。マックス・フェルスタッペンや角田裕毅らのテレメトリーデータによれば、わずか0.1度のステアリング舵角の遅れやマイクロミリ秒単位のスロットルオフが荷重移動の遅れを招き、次コーナーでの致命的なアンダーステアやオーバーステアを誘発する極限のバランスが要求される [2][3][4]。\\n\\n【第2章：2026年アクティブエアロ（X/Zモード）と350kW MGU-K回生配分】\\n2026年新レギュレーション導入に伴い、鈴鹿の攻略法は劇的な進化を遂げた [1][4]。西ストレート（スプーン脱出〜130R手前）およびメインストレートでは低ドラッグの「Xモード」が展開され時速328km/hに到達する一方、ターン1への飛び込みや日立Astemoシケイン進入では高ダウンフォースの「Zモード」へと瞬時に復帰し、最大-5.2Gの激しい制動減速を行う [2][4]。さらに出力が350kWへと倍増したMGU-Kにより、ヘアピンやシケインでの強力な運動エネルギー回生と、セクター1連続コーナーでのトルクフィルが極めて重要となる [1][3]。直線エンドでのスーパー・クリッピング（電力枯渇による最高速頭打ち）を防ぐため、ドライバーはリフト＆コーストを緻密に駆使し、Manual Override Mode（オーバーテイク用ブースト）を130Rやスプーン後の攻防に温存するパワーマネジメントが不可欠である [3][5]。\\n\\n【第3章：ピレリ玄武岩アスファルト摩耗と2ストップ・アンダーカット戦術】\\n鈴鹿の路面は粗粒度の高い玄武岩（Basalt）含有アスファルトで構成されており、連続する高G旋回によって左フロントタイヤに強烈なサーマルデグラデーションとブリスターのリスクが集中する [2][6]。特にピレリの最も硬いコンパウンドレンジ（C1・C2・C3）が投入されるが、アウトラップでのタイヤウォーマー非使用環境下（または低温運用）ではグリップ発動に繊細な荷重コントロールが求められる [2][3]。デグラデーションの進行が1周あたり約0.12秒に達するため、クリーンエアを得られる絶好のタイミングでピットストップを行うアンダーカットが極めて強力であり、新品タイヤの初期トラクションを活かして1周で最大1.8秒ものマージンを稼ぎ出す戦略的駆け引きが勝敗を左右する [1][6]。",
    "officialLinks": {
          "website": "https://www.suzukacircuit.jp/",
          "f1Official": "https://www.formula1.com/en/racing/2026/japan.html",
          "googleMaps": "https://maps.google.com/?q=Suzuka+Circuit",
          "xTwitter": "https://x.com/suzuka_event",
          "instagram": "https://www.instagram.com/suzukacircuit_official/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_asset_4.jpg",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_circuit_map--2005.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_asset_4.jpg",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_circuit_map--2005.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_asset_4.jpg",
        "caption": "世界中のF1ファンで埋め尽くされるホームストレートと表彰台セレモニー",
        "credit": "Japan Tourism Agency",
        "license": "CC BY 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Podium_2016_Japanese_GP.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_asset_6.jpg",
        "caption": "鈴鹿のランドマーク・大観覧車と超満員のグランドスタンド全景",
        "tag": "Panoramic",
        "credit": "shiraga from Osaka",
        "license": "CC BY 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_Circuit_2006.jpg"
      },
      {
        "imageUrl": "/images/circuits/circuit_asset_7.jpg",
        "caption": "決勝日の熱気に包まれるメインストレートとピットビルディング",
        "tag": "Atmosphere",
        "credit": "BWard 1997",
        "license": "CC BY 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_Circuit_21-09-2024.jpg"
      },
      {
        "imageUrl": "/images/circuits/circuit_asset_4.jpg",
        "caption": "世界中のF1ファンで埋め尽くされるホームストレートと表彰台セレモニー",
        "tag": "Podium",
        "credit": "Japan Tourism Agency",
        "license": "CC BY 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Podium_2016_Japanese_GP.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 40.4,
      "longestStraightMeters": 900,
      "gForceMax": {
        "lateral": 5.2,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T3-T6",
          "name": "S字カーブ (Esses)",
          "characteristic": "200km/h超で左右に切り返すリズムの極致。1つのライン乱れが全区間のタイムロスに直結。"
        },
        {
          "number": "T8-T9",
          "name": "デグナー・カーブ",
          "characteristic": "T8の縁石に乗るミリ単位の精度が要求され、T9は飛び出し厳禁のブラインド右。"
        },
        {
          "number": "T11",
          "name": "ヘアピン",
          "characteristic": "急減速からの立ち上がりトラクション勝負。インを刺すブレーキング合戦の要所。"
        },
        {
          "number": "T13-T14",
          "name": "スプーンカーブ",
          "characteristic": "複合下りコーナー。西ストレートの最高速を稼ぐための脱出ボトムスピード維持が鍵。"
        },
        {
          "number": "T15",
          "name": "130R",
          "characteristic": "全開300km/h超で突入する伝説の超高速左コーナー。度胸とハイダウンフォースが試される。"
        },
        {
          "number": "T16-T17",
          "name": "日立Astemoシケイン",
          "characteristic": "数々の歴史的ドラマを生んだ最終減速ポイント。ブレーキング勝負の最終決戦場。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "第1コーナー",
        "gearEstimated": "6th",
        "speedEstimated": "235 km/h",
        "engineeringTip": "メインストレートから高速のまま飛び込み、第2コーナーに向けてトレイルブレーキングで車首を旋回。"
      },
      {
        "number": "T2",
        "name": "第2コーナー",
        "gearEstimated": "4th",
        "speedEstimated": "150 km/h",
        "engineeringTip": "イン側のエイペックスにしっかりノーズを寄せ、S字への加速ラインを組み立てる。"
      },
      {
        "number": "T3",
        "name": "S字 1つ目 (左)",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "セクター1のリズムの起点。イン側の縁石に触れすぎず、マシンの挙動を安定させる。"
      },
      {
        "number": "T4",
        "name": "S字 2つ目 (右)",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "素早い荷重移動が要求される。フロントタイヤの応答性がタイムに直結。"
      },
      {
        "number": "T5",
        "name": "S字 3つ目 (左)",
        "gearEstimated": "4th",
        "speedEstimated": "190 km/h",
        "engineeringTip": "上り勾配によりフロントの接地感が増す。アクセルの微細なコントロールでアンダーを防ぐ。"
      },
      {
        "number": "T6",
        "name": "逆バンクコーナー",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "路面カントが外側へ逃げているため遠心力でマシンが外へ流されやすい難所。"
      },
      {
        "number": "T7",
        "name": "ダンロップ・コーナー",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "全開で駆け上がるブラインドの高速左。強烈な横Gと加速Gが同時にかかる。"
      },
      {
        "number": "T8",
        "name": "デグナー1",
        "gearEstimated": "5th",
        "speedEstimated": "235 km/h",
        "engineeringTip": "縁石をミリ単位でアタックする度胸試しの超高速右コーナー。"
      },
      {
        "number": "T9",
        "name": "デグナー2",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "T8の直後に急制動。イン側縁石に乗ると跳ねて外側のグラベルに飛び出す罠。"
      },
      {
        "number": "T10",
        "name": "110R (立体交差下)",
        "gearEstimated": "7th",
        "speedEstimated": "280 km/h",
        "engineeringTip": "立体交差の下をくぐり抜ける全開右ベンド。フロアのダウンフォース安定が鍵。"
      },
      {
        "number": "T11",
        "name": "ヘアピン",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "強烈なブレーキングからインの縁石をなめるようにクリア。脱出のトラクションが勝負。"
      },
      {
        "number": "T12",
        "name": "200R",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "スプーンへ向けた下り高速右。マシンの空力バランスが安定していることが前提。"
      },
      {
        "number": "T13",
        "name": "スプーン入口",
        "gearEstimated": "5th",
        "speedEstimated": "200 km/h",
        "engineeringTip": "下りながらのブレーキングでリアが不安定になりやすい。"
      },
      {
        "number": "T14",
        "name": "スプーン出口",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "西ストレートの最高速を決める最重要脱出エイペックス。スロットル全開タイミングが命。"
      },
      {
        "number": "T15",
        "name": "130R",
        "gearEstimated": "8th",
        "speedEstimated": "305 km/h",
        "engineeringTip": "全開300km/h超で飛び込む伝説の高速左。マシンのダウンフォース限界とドライバーの精神力が試される。"
      },
      {
        "number": "T16",
        "name": "日立Astemoシケイン進入",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "310km/hからフルブレーキング。数々の名勝負と接触事故の舞台となった最終減速帯。"
      },
      {
        "number": "T17",
        "name": "シケイン脱出縁石",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "縁石を鋭角に跳ね越えてマシンを素早くメインストレートへ向ける。"
      },
      {
        "number": "T18",
        "name": "最終コーナー",
        "gearEstimated": "4th ➔ 7th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "下りながらメインストレートへ全開加速。DRSゾーンへの脱出トラクションを最大化。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1989,
        "title": "セナ・プロスト シケインの接触劇",
        "description": "タイトルを争うマクラーレン・ホンダの同門2台が47周目のシケイン進入で激突。セナ失格によりプロストが王座獲得。",
        "detailedStory": "1989年第15戦日本GP。ポイントリーダーのプロストに対し、逆転王座には優勝が絶対条件のセナ。47周目、セナがシケイン手前でインへ飛び込むが、プロストが早めにステアリングを切り込んで2台のマクラーレン・ホンダMP4/5が激突・停止。プロストはその場でリタイアするも、セナはマーシャルの押しがけでコース復帰し、ノーズ交換を経てトップチェッカーを受けた。しかしレース後、FIAは「シケイン不通過（ショートカット）」を理由にセナを失格処分とし、プロストのタイトルが決定した。",
        "significance": "F1史上最も物議を醸した政治的裁定と世紀のライバル対決。"
      },
      {
        "year": 2005,
        "title": "ライコネン 17番グリッドからの奇跡のファイナルラップ逆転",
        "description": "マクラーレンのキミ・ライコネンが17番手スタートから異次元のペースで追い上げ、最終周の1コーナー外側からフィジケラをオーバーテイクして優勝。",
        "detailedStory": "予選の大雨により17番手スタートを余儀なくされたライコネン。ファステストラップを連発しながら驚異的なオーバーテイクショーを展開。最終周、首位を走るルノーのフィジケラのスリップストリームに入り、時速300km/h超のメインストレートから1コーナーアウト側へマシンを振って大逆転勝利を飾った。",
        "significance": "鈴鹿サーキット史上最高と称えられる伝説のドライビング。"
      },
      {
        "year": 2022,
        "title": "豪雨の鈴鹿でフェルスタッペンが2度目の戴冠",
        "description": "悪天候で長時間の赤旗中断後、28周の短縮レースを圧勝。チェッカー後のペナルティ判定により鈴鹿でホンダと共にタイトル防衛。",
        "detailedStory": "ヘビーレインによる中断後、残り時間わずかの中でレースが再開。フェルスタッペンが2位ルクレールに27秒の大差をつけて独走優勝。ルクレールが最終シケインでコースオフしたことで5秒ペナルティを受け、フェルスタッペンの年間王座確定が表彰台直前に知らされた。ホンダのお膝元での戴冠となった。",
        "significance": "ホンダPU搭載マシンによる鈴鹿での歓喜のチャンピオン決定。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "XモードとZモードのアクティブエアロ切り替えを前提とし、セクター1のS字や130Rでの高速安定性を死守するためZモード時は最大級のハイダウンフォースに設定。西ストレートの最高速はXモードによるドラッグ低減に委ね、コーナー脱出トラクションとフロント回頭性を最優先する。",
      "kerbUsage": "デグナー2（T9）および日立Astemoシケイン（T16-17）での縁石（ケルブ）への乗り上げはラップタイム短縮に直結する。ただし硬すぎるサスペンションはマシンを跳ね上げてフロア負圧を喪失させるため、ダンパーの低速・高速バンプ減衰力の精密なセッティングが必須。",
      "brakeDemands": "日立Astemoシケインとヘアピン（T11）以外は強烈なフルブレーキング箇所が少ない。しかし350kWへと増大したMGU-Kのブレーキバイアス協調回生が不可欠であり、トレイルブレーキング時のリアスタビリティとタイヤ表面温度の適正管理が勝負を分ける。"
    },
    "references": [
      {
        "id": 1,
        "title": "Suzuka Circuit Geometry and Figure-8 Elevation Dynamics",
        "publisher": "Mobilityland Technical Review",
        "url": "https://www.suzukacircuit.jp",
        "verifiedDate": "2024-04-05"
      },
      {
        "id": 2,
        "title": "Lateral Acceleration and Grip Degradation at Suzuka Circuit",
        "publisher": "SAE International Motorsports Engineering",
        "url": "https://www.sae.org",
        "verifiedDate": "2023-10-12"
      }
    ]
  },
  {
    "id": "monza",
    "name": "モンツァ・サーキット",
    "officialName": "Autodromo Nazionale Monza",
    "country": "イタリア 🇮🇹",
    "lengthKm": 5.793,
    "turns": 11,
    "drsZones": 2,
    "downforceLevel": "Low",
    "tyreStress": "Medium",
    "typicalPitLossSec": 24.5,
    "safetyCarProbability": "50% (中程度)",
    "undercutImpact": "中（ストレートが長いためDRSオーバーテイクが容易）",
    "lapRecord": {
      "time": "1:21.046",
      "driver": "Rubens Barrichello (Ferrari)",
      "year": 2004
    },
    "characteristics": "【第1章：世界最古のスピードの神殿とティフォシの真紅の熱狂】\\n1922年に建設され、F1発祥の1950年から今日まで（1980年イモラ開催を除く）欠かさずイタリアGPを開催し続ける世界最古級の超高速サーキット、モンツァ・サーキット [1][5]。全周の約78%をフルスロットルで駆け抜けるこの「神殿（Temple of Speed）」は、スクーデリア・フェラーリの聖地として知られ、表彰台直下に集まる熱狂的なファン「ティフォシ」の地鳴りのような大歓声がパドックを揺るがす [1][5]。ルイス・ハミルトン、シャルル・ルクレールらが歴史的な勝利を挙げたメインストレートは、ドライバーにとっても特別な感情が宿る歴史的舞台である [1][2]。\\n\\n【第2章：360km/hのXモード極薄空力とバリアンテ・デル・レティフィーロの-5.4G制動】\\n直線の最高速をミリ単位で削り出すため、各チームはモンツァ専用の「スプーンウィング」と呼ばれるほぼ水平に寝かせた極薄リアウィングと超低ドラッグパッケージを投入する [3][4]。2026年規定の「アクティブエアロ（Xモード）」作動時には時速360km/hという驚異的なトップスピードに達する [2][4]。しかし、その直後に待ち受ける第1シケイン「バリアンテ・デル・レティフィーロ（Turn 1-2）」では、時速360km/hから一気に時速72km/hまでわずか2.2秒で急減速。ダウンフォースが最小化された状態から高ダウンフォースの「Zモード」へとアクティブ変形しながら、-5.4Gもの極限の減速Gとカーボンブレーキにかかる1,000℃超の熱負荷に耐えなければならず、タイヤのロックアップが最も頻発する [2][3][6]。\\n\\n【第3章：350kW MGU-K回生配分と縁石ホッピングによる1ストップ戦略】\\n超高速直線が続くモンツァでは、回生可能なブレーキングポイントが3箇所のシケイン（レティフィーロ、ロッジア、アスカリ）に限られるため、350kW MGU-Kのバッテリー充電状態（SoC）のマネジメントが死活問題となる [1][3]。直線後半でのパワーユニット電力枯渇（クリッピング）を防ぐためのフューエルセーブとリフト＆コーストが不可欠である [3][4]。また、アスカリ・シケイン等の縁石（ケルブ）を直線的に跨いでショートカットラインを取るためのサスペンションのしなやかさがトラクションを決定づける。タイヤの横方向デグラデーションは比較的低いため、ピットストップ時間を最小化する1ストップ戦略が主流であり、スリップストリームとDRSを併用したオーバーテイク合戦が展開される [1][2][6]。",
    "officialLinks": {
          "website": "https://www.monzanet.it/",
          "f1Official": "https://www.formula1.com/en/racing/2026/italy.html",
          "googleMaps": "https://maps.google.com/?q=Autodromo+Nazionale+Monza",
          "xTwitter": "https://x.com/Autodromo_Monza",
          "instagram": "https://www.instagram.com/autodromonazionale_monza/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_asset_6.jpg",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Nazionale_Monza_track_map.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_asset_6.jpg",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Nazionale_Monza_track_map.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_asset_6.jpg",
        "caption": "歴史あるモンツァのメインストレートとティフォシの熱狂",
        "credit": "Sbaei",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monza_circuit_straight.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_asset_6.jpg",
        "caption": "歴史あるモンツァのメインストレートとティフォシの熱狂",
        "tag": "Atmosphere",
        "credit": "Sbaei",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monza_circuit_straight.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 12.8,
      "longestStraightMeters": 1120,
      "gForceMax": {
        "lateral": 3.8,
        "longitudinal": 5.1
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Variante del Rettifilo",
          "characteristic": "355km/hから時速70km/hへ急減速する世界最高負荷のシケイン。"
        },
        {
          "number": "T4-T5",
          "name": "Variante della Roggia",
          "characteristic": "高速アプローチから縁石をアグレッシブにカットする第2シケイン。"
        },
        {
          "number": "T8-T10",
          "name": "Variante Ascari",
          "characteristic": "左・右・左と高速で切り抜ける度胸とサスペンション追従性の試金石。"
        },
        {
          "number": "T11",
          "name": "Curva Parabolica (Alboreto)",
          "characteristic": "徐々に全開へと持ち込む伝説のロングコーナー。コースオフのリスク大。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Variante del Rettifilo 進入",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "355km/hから時速70km/hへの最大減速G（5.1G）。ブレーキバランスの正確性が命。"
      },
      {
        "number": "T2",
        "name": "Rettifilo 脱出右",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "右側のソーセージ縁石を跳ねずにクリアし、クルバ・グランデへのトラクションを確保。"
      },
      {
        "number": "T3",
        "name": "Curva Grande (Biassono)",
        "gearEstimated": "8th",
        "speedEstimated": "315 km/h",
        "engineeringTip": "全開で抜ける雄大な右ロングベンド。ローダウンフォース下での横Gに耐える。"
      },
      {
        "number": "T4",
        "name": "Variante della Roggia 進入",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "330km/hからのヘビーブレーキング。イン側縁石に大胆に乗せて回る。"
      },
      {
        "number": "T5",
        "name": "Roggia 脱出右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "素早く右に切り返し、レズモへの短いストレートへ加速。"
      },
      {
        "number": "T6",
        "name": "Curva di Lesmo 1",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "高速右。ダウンフォースが削られているためフロントの回頭性がシビア。"
      },
      {
        "number": "T7",
        "name": "Curva di Lesmo 2",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "下りながら立ち上がる右。バックストレートの車速に直結する重要脱出ポイント。"
      },
      {
        "number": "T8",
        "name": "Variante Ascari 進入左",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "アスカリシケインの進入。縁石を深くカットしてスピードを保つ。"
      },
      {
        "number": "T9",
        "name": "Ascari 中央右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "左右の強烈な切り返し。フロアの底打ちによるコントロール喪失に警戒。"
      },
      {
        "number": "T10",
        "name": "Ascari 脱出左",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "縁石いっぱいを使って立ち上がり、パラボリカへ向かうバックストレートへ全開加速。"
      },
      {
        "number": "T11",
        "name": "Curva Parabolica (Alboreto)",
        "gearEstimated": "5th ➔ 7th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "進入でノーズをインに固定し、中盤から徐々にスロットルを開いてメインストレートへ駆け出す。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2008,
        "title": "ベッテルの史上最年少初優勝（トロロッソの奇跡）",
        "description": "豪雨のモンツァでセバスチャン・ベッテルがトロロッソ（旧ミナルディ）でポール・トゥ・ウィンを達成。",
        "detailedStory": "ウェットコンディションの予選で驚異的なポールポジションを獲得した21歳のベッテル。決勝でも水煙を上げるモンツァのストレートを一人旅で駆け抜け、一度も首位を譲ることなく初優勝。ファエンツァの小さなチームに初の栄冠をもたらした。",
        "significance": "歴史的快挙となったベッテルの初勝利と新時代の幕開け。"
      },
      {
        "year": 2019,
        "title": "ルクレール、フェラーリで9年ぶりのモンツァ制覇",
        "description": "シャルル・ルクレールがメルセデス2台の執拗な猛攻を単身で耐え抜き、ティフォシの前で感動のイタリアGP制覇。",
        "detailedStory": "前戦スパで初優勝を飾ったルクレールが、超満員のモンツァでポールスタート。ハミルトンとボッタスが交互にDRS攻撃を仕掛ける中、ルクレールはロッジアでの激しいホイール・トゥ・ホイールの防衛戦を展開。ティフォシの地響きのような歓声の中トップでチェッカーを受けた。",
        "significance": "フェラーリの聖地モンツァで刻まれた新世代エースの戴冠劇。"
      },
      {
        "year": 2021,
        "title": "マクラーレン9年ぶりの1-2フィニッシュと天王山の激突",
        "description": "リカルドとノリスがマクラーレンに劇的な1-2勝利をもたらす一方、首位争いのフェルスタッペンとハミルトンがターン1で重なり合い共倒れ。",
        "detailedStory": "ターン1のシケインでインとアウトを奪い合ったフェルスタッペンとハミルトンが接触。レッドブルのマシンがメルセデスの上に乗り上げる衝撃的なクラッシュで両者リタイア。混乱を潜り抜けたダニエル・リカルドが完璧なレース運びでマクラーレンに9年ぶりの勝利をもたらした。",
        "significance": "2021年タイトル争いの頂点とマクラーレンの劇的復活劇。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "モンツァ専用の超極小ウィング角を採用。ダウンフォースを削ぎ落とし、直線でのXモードによるドラッグ低減を極限まで追求。セクター2のレズモやアスカリでのメカニカルグリップを確保しつつ最高速360km/hにフォーカスする。",
      "kerbUsage": "レティフィーロ、ロッジア、アスカリの3大シケインを直線的に駆け抜けるため、縁石（ケルブ）の激しい乗り越え（ホッピング）に対応するしなやかなサスペンション減衰力セッティングが不可欠。",
      "brakeDemands": "時速360km/hからの-5.4G急制動によりブレーキディスク温度は瞬時に1,000℃を超える。MGU-Kの回生ブレーキと油圧ブレーキバイアスの正確な電子制御（Brake-by-Wire）がリアの安定性を支配する。"
    },
    "references": [
      {
        "id": 1,
        "title": "Aerodynamic Drag Reduction and Low Downforce Setups at Monza",
        "publisher": "Formula 1 Technical Analysis",
        "url": "https://www.formula1.com",
        "verifiedDate": "2023-09-03"
      },
      {
        "id": 2,
        "title": "Thermal Dissipation in Carbon Ceramic Brakes under Extreme Longitudinal G",
        "publisher": "Brembo Racing Technical Insights",
        "url": "https://www.brembo.com",
        "verifiedDate": "2023-09-01"
      }
    ]
  },
  {
    "id": "spa-francorchamps",
    "name": "スパ・フランコルシャン",
    "officialName": "Circuit de Spa-Francorchamps",
    "country": "ベルギー 🇧🇪",
    "lengthKm": 7.004,
    "turns": 19,
    "drsZones": 2,
    "downforceLevel": "Medium",
    "tyreStress": "High",
    "typicalPitLossSec": 23.2,
    "safetyCarProbability": "75% (高)",
    "undercutImpact": "大（全長が7kmと長いためピットタイミングの1周の重みが絶大）",
    "lapRecord": {
      "time": "1:46.286",
      "driver": "Valtteri Bottas (Mercedes)",
      "year": 2018
    },
    "characteristics": "【第1章：アルデンヌの森の102m高低差とオールージュの圧縮G】\\n全長7.004kmと現代F1カレンダーで最長を誇り、最大高低差102.2mという雄大な起伏を持つベルギーの聖地スパ・フランコルシャン [1][5]。伝説的コーナー「オールージュ〜ラディオン（Eau Rouge - Raidillon: Turns 2-4）」は、下り坂から時速305km/hで急降下した直後に18%の急勾配を一気に駆け上がり、垂直方向に最大4.5Gの強烈な圧縮G（コンプレッション）がマシンとドライバーを押し潰す世界屈指のスペクタクル [1][3]。フロアのスキッドブロックが路面と擦れ合い火花を散らす中、ドライバーはステアリングをミリ単位で保持し、ブラインドの頂点へと全開で飛び込んでいく [2][3]。\\n\\n【第2章：ケメルストレートXモードとプーオン4.6G Zモードの空力トレードオフ】\\nラディオンを抜けた後の「ケメルストレート」では2026年規定の「アクティブエアロ（Xモード）」によって時速345km/hに到達し、最大のオーバーテイクポイントとなる [2][4]。一方で、セクター2に位置する超高速下り左コーナー「プーオン（Turn 12: Pouhon）」では時速285km/h・横加速度4.6Gの極限旋回が要求され、高ダウンフォースの「Zモード」が不可欠となる [1][3]。ストレートでのトップスピードを優先してウィングを寝かせすぎるとセクター2でタイムを失いアンダーステアに苦しみ、逆にダウンフォースを増やしすぎると直線で格好の餌食となるという「空力セットアップの究極のジレンマ」が立ちはだかる [2][4][6]。\\n\\n【第3章：350kW MGU-K電力マネジメントと「スパ・ウェザー」の局地雨戦術】\\n7kmの長大なコーススケールゆえに、350kW MGU-Kのエネルギー配分がラップタイムを大きく左右する [1][3]。ケメルストレートでの電力ブーストを確保しつつ、後半のバスストップ・シケインでのブレーキングで確実なエネルギー回生を行う繊細なエネルギーマネジメントが要求される [3][4]。さらにアルデンヌ特有の「コースの半分は大雨、残りの半分は完全なドライ路面」という名物「スパ・ウェザー」が頻発する [1][2]。全長が長いためピットストップの判断が1周遅れるだけで30秒以上のタイムを失うリスクがあり、チームのテレメトリー気象レーダー解析とドライバーの路面グリップ察知能力が勝敗を決定づける [1][6]。",
    "officialLinks": {
          "website": "https://www.spa-francorchamps.be/",
          "f1Official": "https://www.formula1.com/en/racing/2026/belgium.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+de+Spa-Francorchamps",
          "xTwitter": "https://x.com/circuitspa",
          "instagram": "https://www.instagram.com/circuit_spa_francorchamps/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_asset_12.jpg",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Spa_2007.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_asset_12.jpg",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Spa_2007.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_asset_12.jpg",
        "caption": "アルデンヌの森を駆け上がる伝説の「オールージュ〜ラディオン」",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Spa-Francorchamps_Eau_Rouge.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_asset_12.jpg",
        "caption": "アルデンヌの森を駆け上がる伝説の「オールージュ〜ラディオン」",
        "tag": "Historic",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Spa-Francorchamps_Eau_Rouge.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 102.2,
      "longestStraightMeters": 2000,
      "gForceMax": {
        "lateral": 4.8,
        "longitudinal": 4.9
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "La Source",
          "characteristic": "スタート直後の急減速ヘアピン。接触事故が極めて多い要衝。"
        },
        {
          "number": "T2-T4",
          "name": "Eau Rouge / Raidillon",
          "characteristic": "高低差40mを一気に駆け上がる世界最もスリリングな全開複合コーナー。"
        },
        {
          "number": "T10-T11",
          "name": "Pouhon",
          "characteristic": "時速260km/h超で駆け抜ける超高速ダブルエイペックス左。強烈な横G。"
        },
        {
          "number": "T18-T19",
          "name": "Bus Stop Chicane",
          "characteristic": "ケメルとは逆の超低速減速シケイン。最終オーバーテイクの勝負どころ。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "La Source",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "スタート直後のタイトな右ヘアピン。インに寄りすぎず脱出速度を重視してケメルへの勢いをつける。"
      },
      {
        "number": "T2",
        "name": "Eau Rouge 左",
        "gearEstimated": "7th",
        "speedEstimated": "300 km/h",
        "engineeringTip": "下り坂の底で強烈な縦圧縮G（約3G）を受けながら左へステアリングを切る。"
      },
      {
        "number": "T3",
        "name": "Raidillon 右",
        "gearEstimated": "7th",
        "speedEstimated": "305 km/h",
        "engineeringTip": "急激な上り勾配（高低差40m）で空を見上げながらのブラインド右。フロアの安定性が命。"
      },
      {
        "number": "T4",
        "name": "Raidillon 頂上左",
        "gearEstimated": "8th",
        "speedEstimated": "315 km/h",
        "engineeringTip": "頂上でマシンが軽くなる瞬間。全開を維持してケメルストレートへ繋ぐ。"
      },
      {
        "number": "T5",
        "name": "Les Combes 進入右",
        "gearEstimated": "4th",
        "speedEstimated": "140 km/h",
        "engineeringTip": "ケメルストレートエンドの超高速ブレーキング。DRSオーバーテイクの主戦場。"
      },
      {
        "number": "T6",
        "name": "Les Combes 左",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "右から左への切り返し。縁石を素早く跨ぎ車体を水平に戻す。"
      },
      {
        "number": "T7",
        "name": "Malmedy 右",
        "gearEstimated": "5th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "下り坂へ向かう右コーナー。リアの接地感を保ちつつスロットルオン。"
      },
      {
        "number": "T8",
        "name": "Rivage (Bruxelles)",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "下り傾斜のきつい右ヘアピン。フロントタイヤが逃げやすくアンダーステアが出やすい。"
      },
      {
        "number": "T9",
        "name": "Speaker's Corner",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "左下りコーナー。素早くアクセルを開けてプーホンへのアプローチ速度を稼ぐ。"
      },
      {
        "number": "T10",
        "name": "Pouhon 進入左",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "F1屈指の超高速ダブルエイペックス左。4.5G超の横Gがかかり続ける度胸試し。"
      },
      {
        "number": "T11",
        "name": "Pouhon 脱出左",
        "gearEstimated": "6th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "外側の縁石いっぱいまで使って加速。マシンの空力バランスが完璧である必要がある。"
      },
      {
        "number": "T12",
        "name": "Fagnes 進入右",
        "gearEstimated": "5th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "右シケイン進入。縁石をフラットに捉えてリズムよく抜ける。"
      },
      {
        "number": "T13",
        "name": "Fagnes 脱出左",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "左脱出。スタビリティを確保しながら加速へ移行。"
      },
      {
        "number": "T14",
        "name": "Campus",
        "gearEstimated": "5th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "スタブロットへ向けた右コーナー。"
      },
      {
        "number": "T15",
        "name": "Stavelot",
        "gearEstimated": "6th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "全開区間へ入るための最重要右エイペックス。スロットルを緩めずにクリア。"
      },
      {
        "number": "T16",
        "name": "Paul Frere",
        "gearEstimated": "7th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "ブランシモンへ続く緩やかな全開右ベンド。"
      },
      {
        "number": "T17",
        "name": "Blanchimont",
        "gearEstimated": "8th",
        "speedEstimated": "310 km/h",
        "engineeringTip": "310km/h全開で飛び込む超高速左。ミスは許されない極限の高速コーナー。"
      },
      {
        "number": "T18",
        "name": "Bus Stop Chicane 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "超高速から急減速する最終シケイン。ブレーキングでのイン飛び込み勝負。"
      },
      {
        "number": "T19",
        "name": "Bus Stop 脱出左",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "縁石をカットしてメインストレートへ加速。チェッカーフラッグへの最終スパート。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2000,
        "title": "ハッキネン、ケメルストレートでの「世紀の追い抜き」",
        "description": "ミカ・ハッキネンが周回遅れのゾンタを挟んでシューマッハを時速330km/h超でインから一閃オーバーテイク。",
        "detailedStory": "首位シューマッハ（フェラーリ）を追うハッキネン（マクラーレン）。40周目のケメルストレート、前方に周回遅れのゾンタが現れた瞬間、シューマッハが左へ交わした隙を突き、ハッキネンはゾンタの右イン側へ超高速で飛び込み、2台まとめて抜き去った。F1史上最も芸術的なパッシングと称される。",
        "significance": "F1史における最高峰のオーバーテイクとして語り継がれる伝説。"
      },
      {
        "year": 1998,
        "title": "雨のスパ・史上最大の多重クラッシュ",
        "description": "豪雨のスタート直後、ラ・スルス立ち上がりで13台が絡む前代未聞の大破事故が発生しレース赤旗。",
        "detailedStory": "視界ゼロのヘビーウェットコンディションの中スタート。クルサードがスピンしコースを塞いだ瞬間、後続車が次々と突っ込み13台のマシンが粉砕。奇跡的に重傷者は出なかったが、再スタート後もシューマッハがクルサードに追突しピットで乱闘寸前になるなど大波乱の1日となった。",
        "significance": "雨のアルデンヌの恐ろしさとドラマ性を凝縮した伝説のレース。"
      },
      {
        "year": 2004,
        "title": "シューマッハ、通算7度目の戴冠を達成",
        "description": "フェラーリのミハエル・シューマッハがスパで2位に入り、前人未到の7回目のワールドチャンピオンを確定。",
        "detailedStory": "シューマッハのF1デビューの地であり初優勝の地でもあるスパ。この年圧倒的な強さでシーズン12勝を挙げていたシューマッハは、マクラーレンのライコネンに次ぐ2位でフィニッシュし、ファンジオの記録を塗り替える7度目のドライバーズタイトルを獲得した。",
        "significance": "シューマッハ帝国の金字塔となった歴史的節目。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "セクター1・3の超高速直線（ケメル、ブランシモン）でのXモード低ドラッグと、セクター2（プーオン、スタヴロ）でのZモード高ダウンフォースのバランス。中翼角パッケージで高速コーナーの横Gに耐えうるスタビリティを確保する。",
      "kerbUsage": "ラディオン出口やバスストップ・シケインの縁石（ケルブ）はアグレッシブに攻める必要があるが、濡れた路面では一瞬でスピンを誘発するため、天候に応じた車高とアンチロールバーの柔軟な調整が求められる。",
      "brakeDemands": "ラ・ソース（T1）とバスストップ・シケイン（T18-19）が主たる激しい減速ゾーン。350kW MGU-Kの協調回生を最大限に活用し、エネルギーマネジメントとリアブレーキ温度の維持を両立させる。"
    },
    "references": [
      {
        "id": 1,
        "title": "Eau Rouge Compression Forces and Ride Height Compliance Analysis",
        "publisher": "FIA Technical Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2023-07-28"
      },
      {
        "id": 2,
        "title": "Spa-Francorchamps Weather Volatility and Strategic Microclimate Impact",
        "publisher": "Royal Belgian Meteorological Institute & F1 Research",
        "url": "https://www.meteo.be",
        "verifiedDate": "2023-08-01"
      }
    ]
  },
  {
    "id": "circuit-de-monaco",
    "name": "モナコ市街地コース",
    "officialName": "Circuit de Monaco",
    "country": "モナコ 🇲🇨",
    "lengthKm": 3.337,
    "turns": 19,
    "drsZones": 1,
    "downforceLevel": "High",
    "tyreStress": "Low",
    "typicalPitLossSec": 21,
    "safetyCarProbability": "85% (極めて高い)",
    "undercutImpact": "小（トラックポジションが絶対的でオーバーカットが有効）",
    "lapRecord": {
      "time": "1:12.909",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2021
    },
    "characteristics": "【第1章：世界三大レースの頂点と地中海のガードレール迷宮】\\n1929年に初開催され、インディ500、ル・マン24時間と並ぶモータースポーツ・トリプルクラウンの一角を占めるモナコGP（モンテカルロ市街地コース） [1][3]。全長わずか3.337kmの公道は、ガードレールと建壁がコース全周を隙間なく囲み、エスケープゾーンがほぼ皆無の「ミリ単位の精密走行」が求められる [1][2]。ドライバーは78周のレース中に約4,000回ものギアチェンジを行い、心拍数は平均170bpmを超え続ける。アイルトン・セナが6勝を挙げたこの聖地では、わずか数センチのラインの狂いが即座にサスペンション破損やクラッシュへと直結する [2][5]。\\n\\n【第2章：特製ステアリングラックと最大ダウンフォースの幾何学】\\n名物「フェアモント・ヘアピン（旧ロウズヘアピン: Turn 6）」はF1で最も車速が落ちる時速48km/hの超低速コーナーであり、各チームはこのコーナーを曲がり切るためにステアリング切れ角を大幅に拡大した「モナコ専用特製ステアリングラック」とフロントウィッシュボーンを投入する [3][4]。空気抵抗（ドラッグ）の影響が小さいため、マシンには年間で最も巨大なウィングが装着され、低速域でも地面に張り付くような最大ダウンフォースが要求される [2][3]。トンネルセクションを時速280km/hで駆け抜けた直後の「ヌーベルシケイン（Turns 10-11）」での急減速や、プールサイドを時速200km/h超でかすめる「スイミングプール（Turns 13-16）」の切り返しなど、マシンの俊敏な回頭性と低速トラクションがタイムを決定づける [2][4][6]。\\n\\n【第3章：予選が勝敗の95%を決める聖地とオーバーカット戦術】\\nコース幅が極めて狭く現代のワイドなF1マシンでのオーバーテイクは統計上ほぼ不可能なため、土曜日の予選でのポールポジション獲得が決勝の勝敗を95%決定づける [1][2]。決勝ではタイヤのサーマルデグラデーションがカレンダー中で最も低く、ピットストップ回数は最小限の1ストップとなる [2][6]。前走者のペースが遅い場合、あえて先にピットインせずクリアラップでハイペースを刻んで逆転を狙うオーバーカット戦略や、85%という極めて高いセーフティカー出動確率を見越したピットウィンドウの遅延戦術が勝負の鍵を握る [1][6]。",
    "officialLinks": {
          "website": "https://acm.mc/",
          "f1Official": "https://www.formula1.com/en/racing/2026/monaco.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+de+Monaco",
          "xTwitter": "https://x.com/ACM_Media",
          "instagram": "https://www.instagram.com/automobileclubmonaco/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_monaco.png",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Monaco.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_monaco.png",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Monaco.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_monaco.png",
        "caption": "紺碧の地中海と高級ヨットが係留するハーバーセクションの全景",
        "credit": "Antony Stanley",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monaco_Harbour_F1.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_monaco.png",
        "caption": "紺碧の地中海と高級ヨットが係留するハーバーセクションの全景",
        "tag": "Atmosphere",
        "credit": "Antony Stanley",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monaco_Harbour_F1.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 42,
      "longestStraightMeters": 670,
      "gForceMax": {
        "lateral": 3.5,
        "longitudinal": 4.2
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Sainte-Dévote",
          "characteristic": "スタート直後の急減速。外側ガードレールに吸い寄せられるクラッシュ名所。"
        },
        {
          "number": "T6",
          "name": "Grand Hotel Hairpin",
          "characteristic": "F1最遅の時速48km/h。ステアリング切れ角を最大まで改造して旋回。"
        },
        {
          "number": "T12",
          "name": "Tabac",
          "characteristic": "ハーバー沿いを時速160km/hでガードレールすれすれに抜ける超度胸コーナー。"
        },
        {
          "number": "T13-T16",
          "name": "Louis Chiron & Swimming Pool",
          "characteristic": "プールサイドを時速200km/hで切り返す超高速シケイン。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Sainte-Dévote",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "1コーナー右。外側のガードレールにノーズが吸い寄せられやすく、脱出でのオーバーステアは即クラッシュ。"
      },
      {
        "number": "T2",
        "name": "Beau Rivage 上り",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "ブラインドの上り坂。ガードレールに挟まれた全開ストレート。"
      },
      {
        "number": "T3",
        "name": "Massenet",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "カジノ前の長い左。イン側のクリッピングポイントに車体を寄せ続ける横G。"
      },
      {
        "number": "T4",
        "name": "Casino Square",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "右コーナー。路面の起伏でマシンがバウンドするため車高管理がシビア。"
      },
      {
        "number": "T5",
        "name": "Mirabeau Haute",
        "gearEstimated": "2nd",
        "speedEstimated": "80 km/h",
        "engineeringTip": "急な下り坂でのブレーキング右。イン側を早めに抑える。"
      },
      {
        "number": "T6",
        "name": "Grand Hotel Hairpin",
        "gearEstimated": "1st",
        "speedEstimated": "48 km/h",
        "engineeringTip": "F1カレンダー最遅コーナー。ステアリングラックの切れ角をモナコ専用に拡大してクリア。"
      },
      {
        "number": "T7",
        "name": "Mirabeau Bas",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "右直角ターン。海側へ向けて下りながら旋回。"
      },
      {
        "number": "T8",
        "name": "Portier",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "トンネル進入直前の最重要右コーナー。ここでのトラクションが最高速を決定。"
      },
      {
        "number": "T9",
        "name": "Tunnel",
        "gearEstimated": "6th",
        "speedEstimated": "270 km/h",
        "engineeringTip": "暗闇から光へ飛び出す唯一の高速全開右ベンド。空力ダウンフォースのフロア安定性。"
      },
      {
        "number": "T10",
        "name": "Nouvelle Chicane 進入左",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "トンネル出口の290km/hからのヘビーブレーキング。数少ない追い越しポイント。"
      },
      {
        "number": "T11",
        "name": "Nouvelle Chicane 脱出右",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "縁石を舐めるように跨いでハーバーサイドへ加速。"
      },
      {
        "number": "T12",
        "name": "Tabac",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "左ガードレールすれすれを160km/hで抜ける度胸試し。"
      },
      {
        "number": "T13",
        "name": "Louis Chiron (プール入口)",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "プールサイド高速左。ミリ単位でガードレールを掠める。"
      },
      {
        "number": "T14",
        "name": "プール高速右",
        "gearEstimated": "6th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "スピードを落とさず右へ。マシンの俊敏なロール特性が試される。"
      },
      {
        "number": "T15",
        "name": "プールシケイン進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "縁石を大きくカットする低速シケイン進入。"
      },
      {
        "number": "T16",
        "name": "プールシケイン脱出左",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "ソーセージ縁石でのジャンプを抑えてラスカスへ向かう。"
      },
      {
        "number": "T17",
        "name": "La Rascasse",
        "gearEstimated": "2nd",
        "speedEstimated": "55 km/h",
        "engineeringTip": "レストランを取り囲む右回り低速タイトターン。インベタで最短距離を走る。"
      },
      {
        "number": "T18",
        "name": "Antony Noghès 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "最終シケイン進入。"
      },
      {
        "number": "T19",
        "name": "Antony Noghès 脱出",
        "gearEstimated": "3rd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "スタート/フィニッシュ直線への最終トラクション。外側ガードレールに張り付くように全開加速。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1988,
        "title": "セナ、異次元の予選ラップとまさかの首位クラッシュ",
        "description": "アイルトン・セナが同門プロストを1.4秒千切る神業予選を決めるも、決勝で50秒リードの終盤にポルティエの壁に散る。",
        "detailedStory": "「神の領域で走っていた」と語ったセナが驚愕のポールポジションを獲得。決勝でも独走し勝利を確信した67周目、ポルティエのガードレールに接触してリタイア。ショックのあまりセナはピットに戻らず自宅アパートへ直行した。この悔しさがセナを更なる高みへと押し上げた。",
        "significance": "セナの伝説的ドライビングとモナコの残酷さを象徴する最も有名な逸話。"
      },
      {
        "year": 1992,
        "title": "セナ対マンセル、伝説の残り3周の鉄壁ディフェンス",
        "description": "圧倒的な速さを誇るウィリアムズのマンセルが背後に迫る中、セナが巧みな車体配置で抑えきりモナコ5連覇を達成。",
        "detailedStory": "開幕5連勝中のマンセルがホイールナットの緩みで緊急ピットイン。新品タイヤでコース復帰し、首位セナの背後へ猛追。残り3周、モナコの狭いコースでマンセルが左右から揺さぶりをかけるが、セナは完璧なレコードライン防御でわずか0.215秒差で先着した。",
        "significance": "マシンの性能差をドライバーの技量と戦略で覆した歴史的名勝負。"
      },
      {
        "year": 2018,
        "title": "リカルド、MGU-K故障で出力25%喪失の中の執念の勝利",
        "description": "レッドブルのリカルドがレース序盤にMGU-Kが停止し約160馬力を失いながら、ベッテルの猛攻を78周防ぎ切って悲願の勝利。",
        "detailedStory": "2016年にピットミスで勝利を奪われたリカルド。2018年、ポールから首位を快走するも28周目にMGU-Kが故障しパワーが25%低下、ブレーキ温度も急上昇。それでも市街地の特性を活かし、立ち上がり重視のラインでベッテルを完封。涙のリベンジ優勝を飾った。",
        "significance": "モナコにおけるトラックポジションの絶対的優位性を証明した名レース。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "直線の最高速を完全に無視した最大級のハイダウンフォースセッティング。アクティブエアロも常に高グリップ側を意識し、低速・中速コーナーでの車体安定性と鋭い回頭性を最優先する。",
      "kerbUsage": "スイミングプール・シケインのソーセージ縁石（ケルブ）を跳ね飛ばすようにインを突くため、ソフトなスプリングと長いサスペンションストロークを確保し、着地時のメカニカルグリップを維持する。",
      "brakeDemands": "減速ゾーンは多いが直線が短いためブレーキ冷却用のダクト開口部を最大化。低速からの立ち上がりでリアタイヤが空転しないよう、トラクションコントロールに近い繊細なデフセッティングとブレーキバイアス調整が要求される。"
    },
    "references": [
      {
        "id": 1,
        "title": "Monaco Circuit Street Layout Kinematics and Steering Rack Adjustments",
        "publisher": "Automobile Club de Monaco",
        "url": "https://www.acm.mc",
        "verifiedDate": "2024-05-20"
      },
      {
        "id": 2,
        "title": "Qualifying Dominance and Track Position Strategy in Modern Street Circuits",
        "publisher": "Motorsport Analytics Group",
        "url": "https://www.motorsport.com",
        "verifiedDate": "2024-05-22"
      }
    ]
  },
  {
    "id": "silverstone",
    "name": "シルバーストン・サーキット",
    "officialName": "Silverstone Circuit",
    "country": "イギリス 🇬🇧",
    "lengthKm": 5.891,
    "turns": 18,
    "drsZones": 2,
    "downforceLevel": "Medium-High",
    "tyreStress": "Very High",
    "typicalPitLossSec": 20.5,
    "safetyCarProbability": "55% (中程度)",
    "undercutImpact": "大（タイヤデグラデーションが高くアンダーカットが強力）",
    "lapRecord": {
      "time": "1:27.097",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2020
    },
    "characteristics": "【第1章：F1世界選手権発祥の聖地と伝説の超高速S字複合】\\n1950年5月13日にF1初の公式世界選手権レースが開催されたモータースポーツの揺り籠、シルバーストン・サーキット [1][5]。旧第二次世界大戦時の英空軍飛行場跡地を利用した広大で平坦なレイアウトに、時速260〜295km/hで連続して駆け抜ける世界屈指の超高速S字セクション「マゴッツ〜ベケッツ〜チャペル（Maggots - Becketts - Chapel: Turns 10-14）」が鎮座する [1][2]。ルイス・ハミルトン、ランド・ノリス、ジョージ・ラッセルら英国勢の母国グランプリとして熱狂的なファンが集う伝統の舞台である [1][5]。\\n\\n【第2章：5.2G横加速度とピレリ最強構造タイヤへの剪断ストレス】\\nマゴッツ〜ベケッツ区間では、ステアリングを左・右・左と切り返すたびに最大5.2Gを超える激烈な横加速度が連続してマシンを襲う [2][3]。この極限の高速旋回により、グラウンドエフェクトフロアとウィングが発生する巨大なダウンフォースがタイヤを路面に押し付け、左フロントおよび左リアタイヤの内部カーカスベルトに世界最大の剪断ストレス（Shear Stress）が加わる [2][3]。ピレリは毎年このサーキットに最高強度の専用構造タイヤを供給するが、サーマルデグラデーションの進行は極めて早く、ブリスター防止のためのタイヤマネジメントが不可欠となる [3][6]。\\n\\n【第3章：ハンガーストレートXモードと2ストップ・アンダーカット決戦】\\nチャペルを全開で立ち上がった後の「ハンガーストレート」では、2026年規定の「アクティブエアロ（Xモード）」が作動し時速335km/hに到達 [2][4]。直後のストウ（Turn 15: Stowe）では時速180km/hの「Zモード」へと高速移行し、ストレートエンドでの激しいオーバーテイクバトルが繰り広げられる [2][4]。さらに広大な吹き抜けの地形ゆえに突風や横風がフロア負圧を急激に乱すため、ドライバーは卓越したマシンバランスのセンシングが求められる [2][4]。タイヤ摩耗の激しさから2ストップ戦略が基本であり、フレッシュタイヤの強烈なグリップを活かしたアンダーカットが勝負を決する決定打となる [1][6]。",
    "officialLinks": {
          "website": "https://www.silverstone.co.uk/",
          "f1Official": "https://www.formula1.com/en/racing/2026/great-britain.html",
          "googleMaps": "https://maps.google.com/?q=Silverstone+Circuit",
          "xTwitter": "https://x.com/SilverstoneUK",
          "instagram": "https://www.instagram.com/silverstonecircuit/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_silverstone_real.jpg",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Circuit_2011.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_silverstone_real.jpg",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Circuit_2011.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_silverstone_real.jpg",
        "caption": "英国モータースポーツの殿堂シルバーストンの最新ピットビル「Wing」",
        "credit": "Chesapeakedave",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Wing_Pit_Straight.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_silverstone_real.jpg",
        "caption": "英国モータースポーツの殿堂シルバーストンの最新ピットビル「Wing」",
        "tag": "Atmosphere",
        "credit": "Chesapeakedave",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Wing_Pit_Straight.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 11.3,
      "longestStraightMeters": 1034,
      "gForceMax": {
        "lateral": 5.3,
        "longitudinal": 4.5
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Abbey / Farm",
          "characteristic": "時速285km/hで突入する超高速1コーナー。"
        },
        {
          "number": "T3-T5",
          "name": "Village / Loop",
          "characteristic": "インフィールドのテクニカル低速複合コーナー。"
        },
        {
          "number": "T9",
          "name": "Copse",
          "characteristic": "かつての1コーナー。時速290km/hで度胸を試す全開右コーナー。"
        },
        {
          "number": "T10-T14",
          "name": "Maggotts / Becketts / Chapel",
          "characteristic": "F1屈指の超高速切り返しS字コンプレックス。5G超の横G。"
        },
        {
          "number": "T15",
          "name": "Stowe",
          "characteristic": "ハンガーストレートエンドの時速200km/h超高速ブレーキングコーナー。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Abbey",
        "gearEstimated": "7th",
        "speedEstimated": "285 km/h",
        "engineeringTip": "ピットストレートから全開で飛び込む超高速右。マシンのダウンフォースとフロアの吸い付きが試される。"
      },
      {
        "number": "T2",
        "name": "Farm Curve",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "全開で抜けるブラインド左。ビレッジへの進入ラインを整える。"
      },
      {
        "number": "T3",
        "name": "Village",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "急減速の右ヘアピン。インを刺すブレーキング合戦の舞台。"
      },
      {
        "number": "T4",
        "name": "The Loop",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "シルバーストン最遅の低速左。脱出のトラクションがウェリントンストレートの車速を決める。"
      },
      {
        "number": "T5",
        "name": "Aintree",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "全開加速しながら抜ける左。縁石を使ってDRS区間へスムーズに接続。"
      },
      {
        "number": "T6",
        "name": "Brooklands",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "ウェリントンエンドの左。トレイルブレーキングで長い旋回をこなす。"
      },
      {
        "number": "T7",
        "name": "Luffield",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "長大な右複合カルーセル。フロントタイヤを傷めないよう丁寧なスロットルワーク。"
      },
      {
        "number": "T8",
        "name": "Woodcote",
        "gearEstimated": "7th",
        "speedEstimated": "270 km/h",
        "engineeringTip": "旧ピットストレートへ抜ける全開右ベンド。"
      },
      {
        "number": "T9",
        "name": "Copse",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "時速290km/h超で飛び込む伝説の高速右。ダウンフォースと度胸の極致。"
      },
      {
        "number": "T10",
        "name": "Maggotts 進入左",
        "gearEstimated": "8th",
        "speedEstimated": "295 km/h",
        "engineeringTip": "マゴッツ〜ベケッツの超高速S字突入。5Gを超える強烈な横G。"
      },
      {
        "number": "T11",
        "name": "Maggotts 右",
        "gearEstimated": "7th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "素早いステアリングの切り返し。マシンのフロントレスポンスが命。"
      },
      {
        "number": "T12",
        "name": "Becketts 左",
        "gearEstimated": "6th",
        "speedEstimated": "235 km/h",
        "engineeringTip": "コーナーが徐々にタイトに締まるため、アクセルを少し戻して旋回。"
      },
      {
        "number": "T13",
        "name": "Becketts 右",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "チャペルへの脱出を見据えた重要エイペックス。"
      },
      {
        "number": "T14",
        "name": "Chapel",
        "gearEstimated": "6th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "ハンガーストレートへ飛び出す全開左。外側縁石を大胆に跨ぐ。"
      },
      {
        "number": "T15",
        "name": "Stowe",
        "gearEstimated": "6th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "320km/hから軽くブレーキングして200km/h超で駆け抜ける高速右。"
      },
      {
        "number": "T16",
        "name": "Vale 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "下りながらの急減速左。イン側をカットして最終クラブへ。"
      },
      {
        "number": "T17",
        "name": "Club 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "グランドスタンド前の右ターン。"
      },
      {
        "number": "T18",
        "name": "Club 脱出",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "ハミルトンストレートへ向けて全開立ち上がり。勝利のチェッカーへ。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2020,
        "title": "ハミルトン、3輪走行での劇的チェッカー優勝",
        "description": "ファイナルラップで左フロントタイヤがバーストするも、3輪で走り抜けてレッドブルのフェルスタッペンを振り切り優勝。",
        "detailedStory": "シルバーストンの強烈な横Gにより終盤にタイヤトラブルが続発。首位独走のハミルトンも最終ラップのターン8で左前タイヤが完全に破裂。ホイールから火花を散らしながらストウ、ベイルを必死にコントロールし、後方から猛追するフェルスタッペンにわずか5.8秒差で逃げ切った。",
        "significance": "F1史上最もドラマチックなパンクチャー生還劇。"
      },
      {
        "year": 2021,
        "title": "コプスでの51G大激突とハミルトンの逆転勝利",
        "description": "オープニングラップの時速290km/hコーナー「コプス」でハミルトンとフェルスタッペンが激突。フェルスタッペンは51Gの衝撃でバリアへ激突。",
        "detailedStory": "スプリント予選導入の記念大会。決勝1周目、激しいサイド・バイ・サイドの攻防の末、コプス進入で2台が接触。フェルスタッペンはタイヤバリアに大クラッシュし病院へ搬送。ハミルトンは10秒ペナルティを受けながらも終盤にルクレールを逆転して母国8度目の優勝を飾った。",
        "significance": "2021年タイトル争いの最大の火種となった歴史的衝突。"
      },
      {
        "year": 2022,
        "title": "サインツのF1初優勝と周冠宇の戦慄クラッシュ",
        "description": "スタート直後に周冠宇が宙を舞いフェンスに突き刺さる大クラッシュから再開後、サインツがキャリア150戦目で悲願の初優勝。",
        "detailedStory": "スタートで周冠宇のマシンが反転しグラベルを滑走してキャッチフェンスに激突する大事故が発生（Haloにより無傷）。赤旗中断後のレースでは終盤にセーフティカーが出動。フェラーリのカルロス・サインツが僚友ルクレールとのチームオーダーを乗り越えて自身初のグランプリ勝利を達成した。",
        "significance": "Haloの命を救う性能とサインツの念願の初優勝が刻まれた名勝負。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "マゴッツ・ベケッツやコプス（T9）、ストウ（T15）での5G超の横Gに耐えるハイダウンフォースと、ウェリントンおよびハンガーストレートでのXモード低ドラッグの協調設計。高速旋回でのアンダーステアを排除するフロントグリップを重視。",
      "kerbUsage": "コプス出口やベケッツの縁石（ケルブ）をタイヤ半分乗せるアグレッシブなライン取りが必須。フロア端部のベンチュリトンネルシールを破損しないよう、適切なライドハイトとバンプストップの調整が求められる。",
      "brakeDemands": "ブルックランズ（T6）、クラブ（T18）、ストウ（T15）での減速が主たるブレーキングポイント。高速からの急減速に伴う荷重移動を安定させ、350kW MGU-Kの回生エネルギーを効率よく蓄電する。"
    },
    "references": [
      {
        "id": 1,
        "title": "History and Architectural Evolution of Silverstone Grand Prix Circuit",
        "publisher": "British Racing Drivers' Club (BRDC)",
        "url": "https://www.silverstone.co.uk",
        "verifiedDate": "2024-07-05"
      },
      {
        "id": 2,
        "title": "High Lateral G-Force Load and Structural Stress in Maggotts-Becketts Complex",
        "publisher": "FIA Formula One Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-07-08"
      }
    ]
  },
  {
    "id": "albert-park",
    "name": "アルバート・パーク・サーキット",
    "officialName": "Melbourne Grand Prix Circuit (Albert Park)",
    "country": "オーストラリア 🇦🇺",
    "lengthKm": 5.278,
    "turns": 14,
    "drsZones": 4,
    "downforceLevel": "Medium-High",
    "tyreStress": "Medium",
    "typicalPitLossSec": 20.2,
    "safetyCarProbability": "65% (高)",
    "undercutImpact": "中程度（トラックポジション優先、SC頻度高）",
    "lapRecord": {
      "time": "1:19.813",
      "driver": "Charles Leclerc (Ferrari)",
      "year": 2024
    },
    "characteristics": "【第1章：緑豊かな人工湖畔を周回する伝統のセミストリート】\\nオーストラリア・メルボルンのアルバート・パーク湖を取り囲む公道区間を利用したハイスピードコース [1][5]。普段は一般公道であるため、週末の初日はグリップが極端に低く、セッションを重ねるごとにラバーが乗ってラップタイムが秒単位で向上する「トラックエボリューション」が最も顕著に現れる [1][2]。美しい公園の景観とは裏腹に、ランオフエリアが狭く一瞬のミスが即座にクラッシュへと直結する [2][4]。\\n\\n【第2章：改修後の超高速シケインと4箇所のDRSゾーン】\\n2022年の大幅改修により低速シケインが撤去され、ターン8からターン9へ向かうセクター2が時速320km/h超の全開フラットアウト区間へと生まれ変わった [1][3]。カレンダー最多となる4つのDRSゾーンが設定され、ターン9-10の超高速S字切り返しではドライバーに強烈な横Gと度胸が試される [2][3][6]。フロントの回頭性と中高速のダウンフォース安定性がラップタイムの鍵を握る [3][4]。",
    "officialLinks": {
          "website": "https://www.grandprix.com.au/",
          "f1Official": "https://www.formula1.com/en/racing/2026/australia.html",
          "googleMaps": "https://maps.google.com/?q=Albert+Park+Circuit",
          "xTwitter": "https://x.com/ausgrandprix",
          "instagram": "https://www.instagram.com/ausgp/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_albert_park.jpg",
      "credit": "Ozzmosis",
      "license": "CC BY-SA 2.5",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melbourne_Grand_Prix_Circuit_pit_building.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_albert_park.jpg",
        "credit": "Ozzmosis",
        "license": "CC BY-SA 2.5",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melbourne_Grand_Prix_Circuit_pit_building.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_albert_park.jpg",
        "caption": "アルバート・パークのピットレーンとメインストレート風景",
        "credit": "Ozzmosis",
        "license": "CC BY-SA 2.5",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melbourne_Grand_Prix_Circuit_pit_building.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_albert_park.jpg",
        "caption": "アルバート・パークのピットレーンとメインストレート風景",
        "tag": "Atmosphere",
        "credit": "Ozzmosis",
        "license": "CC BY-SA 2.5",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melbourne_Grand_Prix_Circuit_pit_building.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 2.6,
      "longestStraightMeters": 850,
      "gForceMax": {
        "lateral": 4.3,
        "longitudinal": 4.5
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Jones / Brabham",
          "characteristic": "315km/hから進入するスタート直後の難所シケイン。"
        },
        {
          "number": "T9-T10",
          "name": "Lakeside Fast Chicanes",
          "characteristic": "旧シケイン撤去後の超高速250km/hフローセクション。"
        },
        {
          "number": "T11-T12",
          "name": "Waite Corner",
          "characteristic": "全開で駆け抜ける左〜右の高速切り返し。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Jones",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "315km/hからブレーキング。右イン側縁石をしっかり捉えてT2の立ち上がりラインを作る。"
      },
      {
        "number": "T2",
        "name": "Brabham",
        "gearEstimated": "3rd",
        "speedEstimated": "165 km/h",
        "engineeringTip": "左脱出。外側の縁石をアグレッシブに使い、続くDRSストレートへ加速。"
      },
      {
        "number": "T3",
        "name": "Sports Complex",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "オーバーテイク多発の急減速右。フロントのロックアップに注意。"
      },
      {
        "number": "T4",
        "name": "T4 Left",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "左フリック。立ち上がりでウォールが迫るためライン取りがシビア。"
      },
      {
        "number": "T5",
        "name": "Lakeside Sweep",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "湖畔沿いの高速右。全開で抜けつつT6への進入速度を最大化。"
      },
      {
        "number": "T6",
        "name": "Marina Entry",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "改修により道幅が拡大された右コーナー。ボトムスピードを維持。"
      },
      {
        "number": "T7",
        "name": "Marina Exit",
        "gearEstimated": "5th",
        "speedEstimated": "190 km/h",
        "engineeringTip": "全開で湖沿いバックストレートへ接続する立ち上がり。"
      },
      {
        "number": "T8",
        "name": "Fast Kink",
        "gearEstimated": "7th",
        "speedEstimated": "270 km/h",
        "engineeringTip": "全開の高速ベンド。第3DRSゾーンの高速バトル。"
      },
      {
        "number": "T9",
        "name": "Lakeside Chicane Left",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "旧シケイン撤去により誕生した超高速左。度胸とマシンのフロア吸い付きが試される。"
      },
      {
        "number": "T10",
        "name": "Lakeside Chicane Right",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "250km/h超で右に切り返す世界屈指の高速チェンジ。"
      },
      {
        "number": "T11",
        "name": "Waite Left",
        "gearEstimated": "6th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "ハードブレーキングを伴う高速左。イン側の縁石を深くカット。"
      },
      {
        "number": "T12",
        "name": "Waite Right",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "右脱出。芝生やグラベルに足を落とすと即スピンの大クラッシュ。"
      },
      {
        "number": "T13",
        "name": "Ascari / Prost",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "インフィールド低速右。フロントタイヤの接地感が勝負。"
      },
      {
        "number": "T14",
        "name": "Final Corner",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "最終左ターン。ピットストレートへのトラクションを確保。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2002,
        "title": "ウェバー、デビュー戦ミナルディで奇跡の5位入賞",
        "description": "地元オーストラリアのマーク・ウェバーが戦闘力に劣るミナルディで大波乱の生き残り戦を制し感動の5位入賞。",
        "detailedStory": "スタート直後の多重クラッシュで8台が脱落。ウェバーは冷静にマシンを運び、終盤トヨタのサロからの猛追を退けて5位フィニッシュ。レース後、表彰台に登る特例が認められ、地元の大観衆から熱烈なオベーションを受けた。",
        "significance": "オーストラリアF1史に残る最も感動的なデビュー戦。"
      },
      {
        "year": 2023,
        "title": "3度の赤旗と大混乱のスタンディングリスタート",
        "description": "終盤の赤旗連発により残り2周のスプリントリスタートで多重クラッシュが発生したカオスレース。",
        "detailedStory": "残り4周でマグヌッセンのクラッシュにより赤旗。残り2周でのスタンディングリスタート直後、アルピーヌ同門2台の同士討ちなど多重事故が発生。最終的にSC先導でチェッカーとなり、フェルスタッペンがメルボルン初勝利を飾った。",
        "significance": "現代F1のレギュレーション論争を巻き起こした最も波乱に満ちたGP。"
      },
      {
        "year": 2024,
        "title": "サインツ、盲腸手術からの奇跡の復帰優勝",
        "description": "前戦を虫垂炎手術で欠場したカルロス・サインツが、わずか2週間後に完全復活しフェラーリ1-2を牽引して優勝。",
        "detailedStory": "サウジアラビアGPを緊急手術で欠場したサインツ。メルボルンで見事に復帰しフロントローを獲得。決勝序盤に首位フェルスタッペンのブレーキが発火・リタイアすると、完璧なペースコントロールで独走。ルクレールと共にフェラーリに2004年以来の豪州1-2をもたらした。",
        "significance": "アスリートの強靭な精神力とフェラーリの速さを証明した名勝負。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "2022年改修により平均時速が大幅に上昇。ストレートでの4つのDRSを活かすためミディアムハイに抑えるセッティングが主流。",
      "kerbUsage": "公道ベースのため路面のうねりや白線の滑りやすさに注意。縁石は角が立っており跳ねやすい。",
      "brakeDemands": "ターン1、ターン3、ターン11などハードブレーキングが存在。冷却ダクトの調整がタイヤ作動温度に直結。"
    },
    "references": [
      {
        "id": 1,
        "title": "Albert Park Circuit Redesign and High-Speed Flow Analysis",
        "publisher": "Australian Grand Prix Corporation",
        "url": "https://www.grandprix.com.au",
        "verifiedDate": "2024-03-20"
      },
      {
        "id": 2,
        "title": "Tyre Temperature and Street Asphalt Grip Analysis - Melbourne",
        "publisher": "Pirelli Motorsport F1 Research",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2024-03-22"
      }
    ]
  },
  {
    "id": "shanghai",
    "name": "上海インターナショナル・サーキット",
    "officialName": "Shanghai International Circuit",
    "country": "中国 🇨🇳",
    "lengthKm": 5.451,
    "turns": 16,
    "drsZones": 2,
    "downforceLevel": "Medium-High",
    "tyreStress": "High",
    "typicalPitLossSec": 23.5,
    "safetyCarProbability": "50% (中程度)",
    "undercutImpact": "大（左フロントタイヤのグレイニングが勝負を左右）",
    "lapRecord": {
      "time": "1:32.238",
      "driver": "Michael Schumacher (Ferrari)",
      "year": 2004
    },
    "characteristics": "【第1章：「上」の字を象った広大なスケールと名物カタツムリコーナー】\\n上海市嘉定区の湿地帯に建設され、漢字の「上」をモチーフにした独創的レイアウト [1][5]。メインストレートから進入するターン1〜4は、半径が徐々に小さくなりながら270度旋回し、さらに左へと切り返す世界でも唯一無二の「カタツムリコーナー（Snail Turn）」[1][2]。前輪、特に左フロントタイヤに長時間の巨大な横荷重と縦荷重が加わり続けるため、フロントタイヤのグレイニング（毛羽立ち摩耗）克服がセットアップの生命線となる [2][3]。\\n\\n【第2章：1.2kmの超長大バックストレートとタイトヘアピン】\\nセクター3にはF1最長クラスとなる1,170mのバックストレートが横たわり、時速340km/h超から時速60km/hのタイトヘアピン（ターン14）へと一気に減速する [1][3]。激しいブレーキングバトルが展開される絶好のオーバーテイクポイントであり、ストレート最高速と低中速コーナーでのメカニカルグリップを高次元で両立する空力妥協が求められる [2][4][6]。",
    "officialLinks": {
          "website": "https://www.shanghaicircuit.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/china.html",
          "googleMaps": "https://maps.google.com/?q=Shanghai+International+Circuit"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_shanghai.jpg",
      "credit": "Yue Zhang",
      "license": "CC BY-SA 4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shanghai_International_Circuit_grandstand.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_shanghai.jpg",
        "credit": "Yue Zhang",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shanghai_International_Circuit_grandstand.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_shanghai.jpg",
        "caption": "巨大なメイングランドスタンドと上海サーキットのホームストレート",
        "credit": "Yue Zhang",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shanghai_International_Circuit_grandstand.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_shanghai.jpg",
        "caption": "巨大なメイングランドスタンドと上海サーキットのホームストレート",
        "tag": "Atmosphere",
        "credit": "Yue Zhang",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shanghai_International_Circuit_grandstand.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 7.4,
      "longestStraightMeters": 1170,
      "gForceMax": {
        "lateral": 4.1,
        "longitudinal": 4.7
      },
      "keyCorners": [
        {
          "number": "T1-T4",
          "name": "Snails Corner (カタツムリ)",
          "characteristic": "270度の旋回をしながら減速し逆方向に切り返す超難関複合コーナー。"
        },
        {
          "number": "T13",
          "name": "Parabolic Entry",
          "characteristic": "1.2kmストレートへ向かう高速バンクコーナー。"
        },
        {
          "number": "T14",
          "name": "Hairpin",
          "characteristic": "最長ストレートエンドの時速65km/hヘビーブレーキング地点。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Snail Entry",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "ストレートから高速のまま飛び込み、徐々に半径が小さくなる右旋回へ。"
      },
      {
        "number": "T2",
        "name": "Snail Middle",
        "gearEstimated": "4th",
        "speedEstimated": "150 km/h",
        "engineeringTip": "アクセルを絞りながら左フロントタイヤに荷重をかけ続ける。"
      },
      {
        "number": "T3",
        "name": "Snail Tightening",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "最もタイトな最イン側エイペックス。スピンを防ぎつつ左へ切り返す準備。"
      },
      {
        "number": "T4",
        "name": "Snail Exit Left",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "鋭く左へ切り返し、バックストレート手前の加速へ。"
      },
      {
        "number": "T5",
        "name": "Right Kink",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "全開で抜ける高速右。"
      },
      {
        "number": "T6",
        "name": "Hairpin Right",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "低速右ヘアピン。インの縁石をコンパクトに回りトラクションを確保。"
      },
      {
        "number": "T7",
        "name": "High-speed Left",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "高速S字の進入。フロントタイヤの応答性が命。"
      },
      {
        "number": "T8",
        "name": "High-speed Right",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "横Gがかかったまま右へ切り返す。"
      },
      {
        "number": "T9",
        "name": "Medium Left",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "中速左。アンダーステアを出さずインをキープ。"
      },
      {
        "number": "T10",
        "name": "Medium Right Exit",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "外側縁石を使って加速へ繋ぐ。"
      },
      {
        "number": "T11",
        "name": "Infield Left",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "バンクコーナーへ向かう低速進入。"
      },
      {
        "number": "T12",
        "name": "Infield Right Flick",
        "gearEstimated": "4th",
        "speedEstimated": "150 km/h",
        "engineeringTip": "短い右切り返し。"
      },
      {
        "number": "T13",
        "name": "Parabolic Long Right",
        "gearEstimated": "5th ➔ 7th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "1.2kmストレートの最高速を決める重要バンクコーナー。早期全開が命。"
      },
      {
        "number": "T14",
        "name": "Back Straight Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "68 km/h",
        "engineeringTip": "340km/hから68km/hへの超ヘビーブレーキング。最大のオーバーテイク地点。"
      },
      {
        "number": "T15",
        "name": "Hairpin Exit Left",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "最終コーナーへの立ち上がり。"
      },
      {
        "number": "T16",
        "name": "Final Corner",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "メインストレートへ接続する左ターン。DRSゾーンへ最高速を乗せる。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2006,
        "title": "シューマッハ、F1生涯最後の91勝目",
        "description": "ウエットからドライへと変化する路面で、ミハエル・シューマッハがルノー勢を逆転し伝説の通算91勝目を達成。",
        "detailedStory": "アロンソとタイトルを争うシューマッハ。雨の序盤はルノーが先行するも、路面が乾き始めるとブリヂストンタイヤを履くシューマッハが猛追。ピットストップでアロンソとフィジケラを逆転し、キャリア最後の91勝目をマークした。",
        "significance": "皇帝シューマッハのキャリア最後の勝利となった歴史的一戦。"
      },
      {
        "year": 2009,
        "title": "レッドブル・レーシング、チーム初優勝",
        "description": "豪雨の上海でセバスチャン・ベッテルがポール・トゥ・ウィン、ウェバーが2位に入りレッドブルが初の1-2を達成。",
        "detailedStory": "ニューウェイ設計のRB5が豪雨の中で圧倒的なダウンフォースを発揮。ベッテルが終始レースを支配し、チーム設立5年目にして初のポールポジションと初優勝を1-2フィニッシュという完璧な形で成し遂げた。",
        "significance": "レッドブル黄金時代の幕開けとなった記念碑的グランプリ。"
      },
      {
        "year": 2018,
        "title": "リカルド、神業ブレーキング連発の上海大逆転",
        "description": "セーフティカー導入時にタイヤ交換を決断したリカルドが、怒涛のオーバーテイクショーを披露して6位から大逆転優勝。",
        "detailedStory": "終盤のSCでソフトタイヤに交換したリカルド。ライコネン、ハミルトン、ベッテル、ボッタスをターン14やターン6で信じられないレイトブレーキングで次々に仕留め、会場を熱狂の渦に巻き込む鮮やかな逆転劇を演じた。",
        "significance": "「ラスト・オブ・ザ・レイトブレイカーズ」リカルドの真骨頂。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "1.2kmストレートと低中速コーナーの共存。ストレートでの被オーバーテイクを防ぎつつセクター1でのフロントグリップを保つセッティング。",
      "kerbUsage": "フラットなコースであり縁石の攻撃性は低め。積極的に跨いで走行ラインを広げる。",
      "brakeDemands": "ターン14での減速はF1屈指のハードブレーキング。ロングストレートで冷えたブレーキの急加熱対策が必要。"
    },
    "references": [
      {
        "id": 1,
        "title": "Design and Architectural Philosophy of Shanghai International Circuit",
        "publisher": "Tilke Engineers & Architects",
        "url": "https://tilke.de",
        "verifiedDate": "2024-04-10"
      },
      {
        "id": 2,
        "title": "Front-Left Tyre Thermal Degradation Patterns in Shanghai Turn 1-4",
        "publisher": "Pirelli Motorsport Engineering Analysis",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2024-04-12"
      }
    ]
  },
  {
    "id": "miami",
    "name": "マイアミ・インターナショナル・オートドローム",
    "officialName": "Miami International Autodrome",
    "country": "アメリカ 🇺🇸",
    "lengthKm": 5.412,
    "turns": 19,
    "drsZones": 3,
    "downforceLevel": "Medium",
    "tyreStress": "Medium",
    "typicalPitLossSec": 20,
    "safetyCarProbability": "70% (高)",
    "undercutImpact": "中程度（タイヤのオーバーヒートが早くアウトラップ勝負）",
    "lapRecord": {
      "time": "1:29.708",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2023
    },
    "characteristics": "【第1章：NFLスタジアムを取り囲む華やかなマイアミの祭典】\\nNFLマイアミ・ドルフィンズの本拠地ハードロック・スタジアムの敷地内に建設されたモダンストリートコース [1][5]。巨大スタジアムの周囲を縫うようにレイアウトされ、高速スウィーパーが連続するセクター1と、高架道路（フロリダ・ターンパイク）の支柱下をすり抜ける極低速テクニカルセクションの対比が鮮烈な特徴 [1][2]。フロリダ特有の強烈な日差しにより路面温度は容易に55℃を超え、冷却パッケージとタイヤ熱管理が極限に達する [2][4]。\\n\\n【第2章：高架下の急勾配シケイン（Turns 14-15）の難所】\\n時速340km/hを超える超長大バックストレートへ突入する直前のターン14-15は、登り勾配から縁石を跳ね越えながら下るブラインドの超タイトシケイン [1][3]。グラウンドエフェクトカーの硬いサスペンションでは縁石に乗った瞬間にフロアのダウンフォースが抜けやすく、ドライバーはミリ単位のスロットル・ステアリング操作を強いられる [2][3][6]。",
    "officialLinks": {
          "website": "https://www.f1miamigp.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/miami.html",
          "googleMaps": "https://maps.google.com/?q=Miami+International+Autodrome",
          "xTwitter": "https://x.com/f1miami",
          "instagram": "https://www.instagram.com/f1miami/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_miami.jpg",
      "credit": "Apex Circuit Design",
      "license": "CC BY-SA 4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miami_International_Autodrome.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_miami.jpg",
        "credit": "Apex Circuit Design",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miami_International_Autodrome.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_miami.jpg",
        "caption": "ハードロック・スタジアムとマイアミ・オートドロームの全景",
        "credit": "Apex Circuit Design",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miami_International_Autodrome.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_miami.jpg",
        "caption": "ハードロック・スタジアムとマイアミ・オートドロームの全景",
        "tag": "Atmosphere",
        "credit": "Apex Circuit Design",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miami_International_Autodrome.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 4.8,
      "longestStraightMeters": 1280,
      "gForceMax": {
        "lateral": 4,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T4-T8",
          "name": "Stadium Esses",
          "characteristic": "スタジアム横を駆け抜ける鈴鹿風の高速連続S字セクション。"
        },
        {
          "number": "T14-T15",
          "name": "Overpass Chicane",
          "characteristic": "高速道路高架下の急激な上り下りを伴う低速シケイン。ミス即ウォール。"
        },
        {
          "number": "T17",
          "name": "Hairpin",
          "characteristic": "1.2kmストレートエンドの最重要パッシングゾーン。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "メインストレートエンドの右。スタート直後のポジション争い多発。"
      },
      {
        "number": "T2",
        "name": "Turn 2",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "左フリック。S字へのリズムを作る。"
      },
      {
        "number": "T3",
        "name": "Turn 3",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "加速しながら抜ける右。"
      },
      {
        "number": "T4",
        "name": "Esses 1 (左)",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "高速S字突入。フロアのダウンフォース安定性が試される。"
      },
      {
        "number": "T5",
        "name": "Esses 2 (右)",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "横Gがかかった状態での鋭い切り返し。"
      },
      {
        "number": "T6",
        "name": "Esses 3 (左)",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "イン側の縁石に乗りすぎないようラインをキープ。"
      },
      {
        "number": "T7",
        "name": "Esses 4 (右)",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "スタジアムに沿った高速コンプレッション。"
      },
      {
        "number": "T8",
        "name": "Esses Exit (左)",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "長い左旋回。タイヤ温度の上昇に注意。"
      },
      {
        "number": "T9",
        "name": "Left Kink",
        "gearEstimated": "6th",
        "speedEstimated": "250 km/h",
        "engineeringTip": "全開で抜ける左ベンド。"
      },
      {
        "number": "T10",
        "name": "Right Kink",
        "gearEstimated": "7th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "DRS区間の全開右。"
      },
      {
        "number": "T11",
        "name": "Turn 11 Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "急減速の左ヘアピン。オーバーテイクの要衝。"
      },
      {
        "number": "T12",
        "name": "Turn 12",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "ヤシの木の下を抜ける右フリック。"
      },
      {
        "number": "T13",
        "name": "Turn 13 Entry",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "高架下シケインへ向かうアプローチ右。"
      },
      {
        "number": "T14",
        "name": "Overpass Chicane Left",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "高速道路高架下の急勾配シケイン。縁石に乗ると跳ねてウォール直撃。"
      },
      {
        "number": "T15",
        "name": "Overpass Chicane Right",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "下りながらの右切り返し。"
      },
      {
        "number": "T16",
        "name": "Blind Left Entry",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "1.2kmストレートへ向かうブラインドの左立ち上がり。トラクション重視。"
      },
      {
        "number": "T17",
        "name": "Back Straight Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "68 km/h",
        "engineeringTip": "335km/hから68km/hへの最大減速地点。DRSオーバーテイクの決着の場。"
      },
      {
        "number": "T18",
        "name": "Turn 18",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "最終加速への右ベンド。"
      },
      {
        "number": "T19",
        "name": "Final Left",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "ピットストレートへ繋がる最終左。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2022,
        "title": "マイアミGP初開催とフェルスタッペンの劇的勝利",
        "description": "新設サーキットの初レースでフェルスタッペンがポールシッターのルクレールを猛追し逆転優勝。",
        "detailedStory": "華やかなセレブ達が集結した初開催のマイアミ。フェラーリがフロントローを独占したが、3番手スタートのフェルスタッペンが1周目にサインツを交わし、9周目にはルクレールをパス。終盤のセーフティカー後の猛攻を凌ぎ切った。",
        "significance": "アメリカ市場でのF1人気爆発を象徴する歴史的初開催。"
      },
      {
        "year": 2023,
        "title": "フェルスタッペン、9番グリッドからの圧倒的逆転劇",
        "description": "予選赤旗で9番手スタートとなったフェルスタッペンが、ハードタイヤでの異次元ロングランで僚友ペレスを撃破。",
        "detailedStory": "予選Q3の赤旗でタイムを出せず9番グリッドに沈んだフェルスタッペン。決勝ではハードタイヤでスタートし、異次元のペースで前走車を次々とごぼう抜き。45周目まで引っ張る猛烈なスティントでペレスの前に立ち、圧巻の優勝を果たした。",
        "significance": "2023年シーズンの圧倒的強さを決定づけたマスタークラス。"
      },
      {
        "year": 2024,
        "title": "ランド・ノリス、悲願のF1キャリア初優勝",
        "description": "マクラーレンのランド・ノリスがキャリア110戦目にして待望のF1初優勝を達成。",
        "detailedStory": "これまで幾度となく勝利を逃してきたノリス。中盤のセーフティカーのタイミングを完璧に味方につけて首位に立つと、リスタート後もフェルスタッペンの追撃を寄せ付けずファステストラップを連発。7.6秒差をつけて感動の初優勝を遂げた。",
        "significance": "新世代スターの誕生とマクラーレンの黄金期再来の証明。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "1.2kmストレートでの最高速とセクター1のS字でのダウンフォースの兼ね合い。ミディアムレベルのウイングセッティング。",
      "kerbUsage": "ターン14〜15の高架下シケインは縁石が極めて高く、車高が低すぎるとマシンが跳ねて制御不能になる。",
      "brakeDemands": "ストレートエンドのターン17とターン1でのフル制動。フロリダの強烈な熱気によるブレーキ・パワーユニットの冷却対策が必須。"
    },
    "references": [
      {
        "id": 1,
        "title": "Miami International Autodrome Engineering and Surface Characteristics",
        "publisher": "Apex Circuit Design",
        "url": "https://www.apexcircuitdesign.com",
        "verifiedDate": "2024-05-02"
      },
      {
        "id": 2,
        "title": "Track Temperature and High-Speed Cornering G-Forces at Miami",
        "publisher": "FIA Technical Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-05-04"
      }
    ]
  },
  {
    "id": "imola",
    "name": "イモラ・サーキット（エンツォ・エ・ディーノ・フェラーリ）",
    "officialName": "Autodromo Internazionale Enzo e Dino Ferrari",
    "country": "イタリア 🇮🇹",
    "lengthKm": 4.909,
    "turns": 19,
    "drsZones": 1,
    "downforceLevel": "High",
    "tyreStress": "Medium-High",
    "typicalPitLossSec": 25,
    "safetyCarProbability": "65% (高)",
    "undercutImpact": "大（コース幅が狭くオーバーテイク困難なため戦略勝負）",
    "lapRecord": {
      "time": "1:15.484",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2020
    },
    "characteristics": "【第1章：アペニン山脈の丘陵に刻まれた歴史と栄光、そして祈りの地】\\nフェラーリの創業者エンツォとその息子の名を冠し、サンテルノ川沿いの自然な起伏に沿って広がる反時計回りの名門クラシックサーキット [1][5]。1994年のアイルトン・セナとローランド・ラッツェンバーガーの悲劇を経て安全改修を重ねながらも、タンブレロ、トサ、ピラテッラ、アクエ・ミネラリといった伝説的コーナーの挑戦的キャラクターは脈々と受け継がれている [1][3]。\\n\\n【第2章：強烈な縁石アタックとセッティングのジレンマ】\\n高低差が激しく、ドライバーは縁石を大胆に跨ぎながら最短ラインをトレースするアグレッシブな走りを要求される [2][4]。車高を下げてダウンフォースを稼ぎたいグラウンドエフェクトカーにとって、縁石でのボトミング（底打ち）による跳ねをいかにサスペンションのしなやかさでいなすかが最大の技術課題 [2][4][6]。コース幅が狭くオーバーテイクが極めて困難なため、予選の1発アタックが決勝順位を大きく決定づける [1][3]。",
    "officialLinks": {
          "website": "https://www.autodromoimola.it/",
          "f1Official": "https://www.formula1.com/en/racing/2026/emilia-romagna.html",
          "googleMaps": "https://maps.google.com/?q=Autodromo+Enzo+e+Dino+Ferrari",
          "xTwitter": "https://x.com/autodromoimola",
          "instagram": "https://www.instagram.com/autodromoimola/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_imola.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Imola_Track_Map_2008.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_imola.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Imola_Track_Map_2008.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_imola.jpg",
        "caption": "イモラのピットビルディングとサン・テルモの丘陵風景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Imola_Pits.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_imola.jpg",
        "caption": "イモラのピットビルディングとサン・テルモの丘陵風景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Imola_Pits.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 34,
      "longestStraightMeters": 900,
      "gForceMax": {
        "lateral": 4.4,
        "longitudinal": 4.7
      },
      "keyCorners": [
        {
          "number": "T2-T4",
          "name": "Variante Tamburello",
          "characteristic": "高速アプローチから縁石を跨ぐ素早い切り返しシケイン。"
        },
        {
          "number": "T9",
          "name": "Piratella",
          "characteristic": "ブラインドの丘の頂上から時速185km/hで駆け下りる難関左コーナー。"
        },
        {
          "number": "T11-T13",
          "name": "Acque Minerali",
          "characteristic": "下りから強烈なボトム圧縮を経て急勾配を駆け上がる名物セクション。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Main Straight Kink",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "ピット前ストレートの全開緩やか右。"
      },
      {
        "number": "T2",
        "name": "Tamburello 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "高速シケイン進入。縁石を深くカットしてマシンの向きを変える。"
      },
      {
        "number": "T3",
        "name": "Tamburello 右",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "鋭い右切り返し。底打ちを避けるライン取り。"
      },
      {
        "number": "T4",
        "name": "Tamburello 脱出左",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "ヴィルヌーヴへの加速ストレートへ接続。"
      },
      {
        "number": "T5",
        "name": "Villeneuve 進入右",
        "gearEstimated": "4th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "中速右シケイン進入。"
      },
      {
        "number": "T6",
        "name": "Villeneuve 脱出左",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "トサへ向けた上り坂への加速。"
      },
      {
        "number": "T7",
        "name": "Tosa Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "上り坂の急減速ヘアピン。最大のパッシングゾーン。"
      },
      {
        "number": "T8",
        "name": "Uphill Right Bend",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "ピラテラへ向けて上り詰める全開右。"
      },
      {
        "number": "T9",
        "name": "Piratella",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "丘の頂上から下りながら抜けるブラインド左。リアのトラクション抜けに警戒。"
      },
      {
        "number": "T10",
        "name": "Downhill Run-in",
        "gearEstimated": "5th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "アクア・ミネラリへ向けて駆け下りる全開セクション。"
      },
      {
        "number": "T11",
        "name": "Acque Minerali 進入右",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "下り坂での高速右。"
      },
      {
        "number": "T12",
        "name": "Acque Minerali ボトム圧縮",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "下り切った底での強烈な縦G圧縮。"
      },
      {
        "number": "T13",
        "name": "Acque Minerali 上り出口",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "急勾配を駆け上がる右脱出。"
      },
      {
        "number": "T14",
        "name": "Variante Alta 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "丘の頂上のシケイン。高い縁石を跨ぐ。"
      },
      {
        "number": "T15",
        "name": "Variante Alta 脱出左",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "リバッツァへ向けた下り坂への脱出。"
      },
      {
        "number": "T16",
        "name": "Downhill Sweep",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "下り全開アプローチ。"
      },
      {
        "number": "T17",
        "name": "Rivazza 1",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "下りながらのハードブレーキング左。フロントロック多発。"
      },
      {
        "number": "T18",
        "name": "Rivazza 2",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "メインストレートへ接続する左。"
      },
      {
        "number": "T19",
        "name": "Final Launch Bend",
        "gearEstimated": "4th ➔ 7th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "ピット直線への全開加速ライン。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1994,
        "title": "アイルトン・セナとローランド・ラッツェンバーガーの悲劇",
        "description": "モータースポーツ史上で最も暗い週末。タンブレロでの事故により不世出の英雄アイルトン・セナが逝去。",
        "detailedStory": "予選でラッツェンバーガーが命を落とし、迎えた決勝7周目。首位を走るセナのウィリアムズFW16が時速300km/h超のタンブレロでステアリング故障により壁に激突。この週末の悲劇を受け、FIAはマシンの安全性、クラッシュテスト、コース改修の大改革を断行した。",
        "significance": "近代F1の安全基準を根本から変えたモータースポーツ史上最大の転換点。"
      },
      {
        "year": 2005,
        "title": "アロンソ対シューマッハ、イモラの20周の死闘",
        "description": "ルノーのフェルナンド・アロンソが、猛追するミハエル・シューマッハのフェラーリを完璧な防御で20周抑え切り優勝。",
        "detailedStory": "13番手スタートから異次元の速さで迫ったシューマッハ。残り20周、アロンソの真後ろに張り付くも、アロンソはイモラの狭いコース幅を完璧に熟知したポジショニングで隙を一切与えず、わずか0.2秒差でトップチェッカーを受けた。翌2006年は逆にシューマッハがアロンソを抑えて勝利し伝説の返し技となった。",
        "significance": "新旧王者が魅せたF1史上最高峰のディフェンシブ・ドライビング。"
      },
      {
        "year": 2021,
        "title": "雨のイモラ、波乱の赤旗とフェルスタッペンの圧勝",
        "description": "ハミルトンとラッセルの大クラッシュによる赤旗の中、フェルスタッペンが雨のイモラを完ぺきに制覇。",
        "detailedStory": "ウエット路面でのスタートでフェルスタッペンがターン2でハミルトンを豪快にパス。その後ハミルトンがトサでグラベルにコースオフ、直後にラッセルとボッタスが時速300km/hで大激突し赤旗。フェルスタッペンはリスタート後も完璧な走りでシーズン初優勝を飾った。",
        "significance": "2021年タイトル争いの激化を告げた大波乱のウェットレース。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "道幅が狭くオーバーテイクが極めて困難なため、予選重視のハイダウンフォースセッティングが基本。",
      "kerbUsage": "バリアンテ・アルタなどの縁石は攻撃的。縁石に乗りすぎるとフロアのグラウンドエフェクトが破壊される。",
      "brakeDemands": "トサやリバッツァでのヘビーブレーキング。下り坂での減速が多いため前後ブレーキバランスの調整が重要。"
    },
    "references": [
      {
        "id": 1,
        "title": "History and Safety Evolution of Autodromo Enzo e Dino Ferrari",
        "publisher": "Formula Imola S.p.A.",
        "url": "https://www.autodromoimola.it",
        "verifiedDate": "2024-05-15"
      },
      {
        "id": 2,
        "title": "Downforce and Kerb Dynamics on Historic Anti-Clockwise Circuits",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-05-18"
      }
    ]
  },
  {
    "id": "villeneuve",
    "name": "ジル・ヴィルヌーヴ・サーキット",
    "officialName": "Circuit Gilles Villeneuve (Montreal)",
    "country": "カナダ 🇨🇦",
    "lengthKm": 4.361,
    "turns": 14,
    "drsZones": 2,
    "downforceLevel": "Low",
    "tyreStress": "Medium",
    "typicalPitLossSec": 18.5,
    "safetyCarProbability": "80% (極めて高い)",
    "undercutImpact": "大（低速シケインが多く新品タイヤのトラクション差大）",
    "lapRecord": {
      "time": "1:13.078",
      "driver": "Valtteri Bottas (Mercedes)",
      "year": 2019
    },
    "characteristics": "【第1章：セントローレンス川に浮かぶ人工島の超高速ストップ＆ゴー】\\nノートルダム島の万国博覧会跡地公道を利用したセミストリートサーキット [1][5]。長いストレートを急減速シケインとヘアピンで結ぶレイアウトであり、F1カレンダー屈指の「ブレーキ破壊サーキット」として知られる [1][2]。カーボンブレーキディスクの温度は1,000℃を超え、ブレーキ冷却ダクト設計とペダルマネジメントが完走の絶対条件となる [2][4]。\\n\\n【第2章：名物「チャンピオンの壁」と激しい縁石ホッピング】\\n最終シケイン（Turns 13-14）の出口外側にそびえるコンクリートウォールは、1999年に当時の世界王者3名（シューマッハ、ヒル、ヴィルヌーヴ）が相次いでクラッシュしたことから「ウォール・オブ・チャンピオンズ（Wall of Champions）」と恐れられる [1][3]。ドライバーは時速240km/h超で縁石を跳ね飛びながらミリ単位でウォールをかすめる度胸のアタックを繰り広げる [2][3][6]。",
    "officialLinks": {
          "website": "https://www.gpcanada.ca/",
          "f1Official": "https://www.formula1.com/en/racing/2026/canada.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+Gilles+Villeneuve",
          "xTwitter": "https://x.com/F1GPCanada",
          "instagram": "https://www.instagram.com/f1gpcanada/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_villeneuve.jpg",
      "credit": "Alexandre_Prévot",
      "license": "CC BY-SA 2.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Gilles_Villeneuve_aerial.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_villeneuve.jpg",
        "credit": "Alexandre_Prévot",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Gilles_Villeneuve_aerial.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_villeneuve.jpg",
        "caption": "モントリオール・オリンピック漕艇場とジル・ヴィルヌーヴ・サーキット全景",
        "credit": "Alexandre_Prévot",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Gilles_Villeneuve_aerial.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_villeneuve.jpg",
        "caption": "モントリオール・オリンピック漕艇場とジル・ヴィルヌーヴ・サーキット全景",
        "tag": "Atmosphere",
        "credit": "Alexandre_Prévot",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Gilles_Villeneuve_aerial.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 5.2,
      "longestStraightMeters": 1064,
      "gForceMax": {
        "lateral": 3.8,
        "longitudinal": 5.2
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Virage Senna",
          "characteristic": "メインストレートから飛び込む下りのS字ヘアピン。"
        },
        {
          "number": "T10",
          "name": "L'Epingle (Hairpin)",
          "characteristic": "300km/h超から65km/hへ急減速するオーバーテイクの要衝。"
        },
        {
          "number": "T13-T14",
          "name": "Wall of Champions",
          "characteristic": "コンクリートウォールが迫る最終シケイン。ミリ単位のミスでクラッシュ。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Senna S 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "ピット直線エンドから下りながら飛び込む。"
      },
      {
        "number": "T2",
        "name": "Virage Senna ヘアピン右",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "タイトな右ヘアピン。脱出でのトラクションが鍵。"
      },
      {
        "number": "T3",
        "name": "Chicane 1 右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "縁石をアグレッシブにカット。"
      },
      {
        "number": "T4",
        "name": "Chicane 1 左",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "壁すれすれを抜けて漕艇場ストレートへ。"
      },
      {
        "number": "T5",
        "name": "Rowing Basin Kink",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "オリンピック漕艇場沿いの全開右。"
      },
      {
        "number": "T6",
        "name": "Pont de la Concorde 左",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "急減速シケイン進入。"
      },
      {
        "number": "T7",
        "name": "Pont de la Concorde 右",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "脱出速度を重視。"
      },
      {
        "number": "T8",
        "name": "Chicane 2 右",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "橋の下をくぐり抜けるシケイン。"
      },
      {
        "number": "T9",
        "name": "Chicane 2 左",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "ヘアピンへのアプローチラインを組み立てる。"
      },
      {
        "number": "T10",
        "name": "L'Epingle (Hairpin)",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "カジノ直線へ向かう最重要ヘアピン。立ち上がりのホイールスピン厳禁。"
      },
      {
        "number": "T11",
        "name": "Hairpin Exit Left",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "カジノ直線への加速。"
      },
      {
        "number": "T12",
        "name": "Droit du Casino",
        "gearEstimated": "8th",
        "speedEstimated": "325 km/h",
        "engineeringTip": "1km超のロングストレートDRS区間。"
      },
      {
        "number": "T13",
        "name": "Wall of Champions 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "縁石を勢いよく跨ぐ。"
      },
      {
        "number": "T14",
        "name": "Wall of Champions 壁際左",
        "gearEstimated": "3rd ➔ 4th",
        "speedEstimated": "145 km/h",
        "engineeringTip": "右外側のコンクリートウォールをミリ単位で擦りながら全開加速。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1999,
        "title": "「チャンピオンの壁」誕生の週末",
        "description": "デイモン・ヒル、ミハエル・シューマッハ、ジャック・ヴィルヌーヴの歴代世界王者3名が同じ壁に次々とクラッシュ。",
        "detailedStory": "1999年カナダGP。最終シケインの脱出ウォールに、当時の現役世界チャンピオン3名（ヒル、シューマッハ、ヴィルヌーヴ）に加えFIA GT王者ゾンタが全く同じ場所でクラッシュしてリタイア。この出来事以来、この外側バリアは「ウォール・オブ・チャンピオンズ」と呼ばれるようになった。",
        "significance": "モータースポーツ界で最も悪名高いコーナーの命名起源。"
      },
      {
        "year": 2011,
        "title": "バトン、最後尾から4時間の雨中大逆転優勝",
        "description": "豪雨による2時間の中断、6回のピットイン、パンク、ペナルティ、クラッシュを乗り越えたバトンが最終周に首位ベッテルを逆転。",
        "detailedStory": "F1史上最長の4時間4分を記録した伝説のレース。チームメイトのハミルトンやアロンソと接触し最後尾に沈んだジェンソン・バトン。路面が乾き始めた終盤に驚異のファステストラップを連発し、ファイナルラップのターン6でベッテルがスライドした隙を突き奇跡の優勝を遂げた。",
        "significance": "F1史上最長・最もドラマチックな大逆転劇。"
      },
      {
        "year": 2008,
        "title": "クビサ、前年の大クラッシュの地で歓喜の初優勝",
        "description": "前年に時速300km/hの凄惨な空中大クラッシュを喫したロバート・クビサが、同じコースでBMWザウバーに初勝利をもたらす。",
        "detailedStory": "2007年にヘアピン手前でマシンが粉砕する大事故を起こしたクビサ。奇跡的に生還し迎えた2008年、ピット出口でのハミルトンとライコネンの追突劇を尻目に完璧な走りを披露。BMWザウバーに歴史的初勝利を1-2フィニッシュで飾った。",
        "significance": "不屈のドライバー精神と復活の美しさを体現した名レース。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "ロングストレートでの最高速を優先し、ローダウンフォース寄りのセッティング。シケインでのブレーキング安定性との両立。",
      "kerbUsage": "シケインを直線的に抜けるために高い縁石を激しく跨ぐ。サスペンションのダンピング特性がタイムを決定。",
      "brakeDemands": "カレンダー中最もブレーキに過酷なサーキット。ディスク摩耗とキャリパー温度の管理が完走の絶対条件。"
    },
    "references": [
      {
        "id": 1,
        "title": "Circuit Gilles Villeneuve Braking Energy and Surface Analysis",
        "publisher": "Brembo F1 Brake Systems Report",
        "url": "https://www.brembo.com",
        "verifiedDate": "2024-06-05"
      },
      {
        "id": 2,
        "title": "The Wall of Champions - Geometric Line and Collision Dynamics",
        "publisher": "Formula 1 Historical Society",
        "url": "https://www.formula1.com",
        "verifiedDate": "2024-06-08"
      }
    ]
  },
  {
    "id": "catalunya",
    "name": "カタロニア・サーキット（バルセロナ）",
    "officialName": "Circuit de Barcelona-Catalunya",
    "country": "スペイン 🇪🇸",
    "lengthKm": 4.657,
    "turns": 14,
    "drsZones": 2,
    "downforceLevel": "High",
    "tyreStress": "Very High",
    "typicalPitLossSec": 22,
    "safetyCarProbability": "40% (中低)",
    "undercutImpact": "大（高横Gによるタイヤ摩耗が激しくフレッシュタイヤの優位性大）",
    "lapRecord": {
      "time": "1:16.330",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2023
    },
    "characteristics": "【第1章：空力ベンチマークの殿堂と超高速ターン3】\\n長年F1の公式合同テストとスペインGPを開催し、「このコースで速いマシンは世界中のどこでも速い」と称される空力効率の絶対的リファレンス [1][5]。低速・中速・高速コーナー、そして1kmのストレートが理想的な比率で配置されている [1][2]。特に上り勾配の超高速ロング右コーナー「ターン3」は、首と外側タイヤに強大な遠心力Gが加わり続け、マシンのフロントグリップと空力スタビリティを過酷なまでに暴き出す [2][3]。\\n\\n【第2章：シケイン撤去による本来の超高速最終セクター復活】\\n2023年より最終セクターの低速シケインが撤去され、かつての高速スウィーパー2連続（ターン13-14）へと原点回帰 [1][3]。時速250km/h超で最終コーナーを駆け抜けメインストレートへ飛び出すレイアウトとなったことで、スリップストリームとDRSの効きが劇的に向上 [2][4]。タイヤの左フロントおよび左リアにかかる熱的ストレスが極めて高く、複数回ピットストップ戦略の知略戦が繰り広げられる [3][6]。",
    "officialLinks": {
          "website": "https://www.circuitcat.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/spain.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+de+Barcelona-Catalunya",
          "xTwitter": "https://x.com/Circuitcat_eng",
          "instagram": "https://www.instagram.com/circuitdebcncat/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_catalunya.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Catalunya_main_straight.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_catalunya.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Catalunya_main_straight.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_catalunya.jpg",
        "caption": "カタロニア・サーキットのメインストレートとメインスタンド風景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Catalunya_main_straight.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_catalunya.jpg",
        "caption": "カタロニア・サーキットのメインストレートとメインスタンド風景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Catalunya_main_straight.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 29.6,
      "longestStraightMeters": 1047,
      "gForceMax": {
        "lateral": 4.8,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Elf",
          "characteristic": "メインストレートから進入する左右の高速切り返しシケイン。"
        },
        {
          "number": "T3",
          "name": "Curva Renault",
          "characteristic": "時速225km/hで上りながら駆け抜ける世界屈指の超高G右ロングコーナー。"
        },
        {
          "number": "T9",
          "name": "Campsa",
          "characteristic": "ブラインドの丘を全開240km/hで駆け抜ける度胸試しの右。"
        },
        {
          "number": "T13-T14",
          "name": "Final Sweepers",
          "characteristic": "2023年復活。時速230km/h超でメインストレートへ突入する超高速右2連発。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Elf 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "330km/hから進入。トレイルブレーキングで車首を素早くインに向ける。"
      },
      {
        "number": "T2",
        "name": "Elf 左",
        "gearEstimated": "3rd",
        "speedEstimated": "150 km/h",
        "engineeringTip": "左切り返し。外側縁石を広く使ってターン3への加速を確保。"
      },
      {
        "number": "T3",
        "name": "Curva Renault",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "上り坂の雄大な右ロングコーナー。左フロントタイヤに強烈な横G（4G超）が加わる。"
      },
      {
        "number": "T4",
        "name": "Repsol",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "下りながら回り込む右。イン側のクリップを逃さない。"
      },
      {
        "number": "T5",
        "name": "Seat Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "下りの急減速左ヘアピン。フロントロックしやすい難所。"
      },
      {
        "number": "T6",
        "name": "Left Kink Uphill",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "上り勾配の左ベンド。"
      },
      {
        "number": "T7",
        "name": "Wurth 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "上りシケイン。縁石を巧みに跨ぐ。"
      },
      {
        "number": "T8",
        "name": "Wurth 脱出右",
        "gearEstimated": "4th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "右への立ち上がり。カンプサへ向けた加速。"
      },
      {
        "number": "T9",
        "name": "Campsa",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "丘の頂上を駆け抜ける超高速ブラインド右。マシンのダウンフォースの信頼性が全て。"
      },
      {
        "number": "T10",
        "name": "Caixa (Hairpin)",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "バックストレートエンドの急減速左。改修により流れるコーナー形状へ。"
      },
      {
        "number": "T11",
        "name": "Infield Left",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "インフィールドの上り左。"
      },
      {
        "number": "T12",
        "name": "Infield Long Right",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "長い右旋回。リアタイヤの摩耗に配慮。"
      },
      {
        "number": "T13",
        "name": "High-speed Right (旧シケイン手前)",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "シケイン撤去により全開アプローチとなった超高速右。"
      },
      {
        "number": "T14",
        "name": "Final Corner",
        "gearEstimated": "6th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "メインストレートへ時速230km/hで駆け抜ける最終コーナー。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1996,
        "title": "シューマッハ、豪雨のバルセロナでフェラーリ初勝利",
        "description": "悪天候でライバルが次々と脱落する中、シューマッハが他車より1周4秒以上速い驚異の走りで独走優勝。",
        "detailedStory": "フェラーリ移籍初年度、戦闘力に劣るF310を駆るシューマッハ。豪雨でコース上が川と化したレースで、異次元の雨ラインを見出し、2位のアレジに45秒差をつけてフェラーリでの初勝利を飾った。「雨の皇帝 (Regenmeister)」の伝説を不動のものにした。",
        "significance": "F1史上屈指の伝説的ウェット・ドライビング・マスタークラス。"
      },
      {
        "year": 2016,
        "title": "メルセデス同士討ちとフェルスタッペン史上最年少初優勝",
        "description": "1周目にハミルトンとロズベルグが激突共倒れ。レッドブル昇格初戦の18歳マックス・フェルスタッペンが史上最年少優勝。",
        "detailedStory": "スタート直後のターン4でメルセデスの2台が激突リタイア。トロロッソから電撃昇格したばかりの18歳フェルスタッペンが、フェラーリのライコネンからのプレッシャーを2タイヤ戦略で見事に耐え切り、F1史上最年少優勝（18歳228日）の金字塔を打ち立てた。",
        "significance": "現代F1絶対王者マックス・フェルスタッペンの伝説の始まり。"
      },
      {
        "year": 2012,
        "title": "パストール・マルドナド、ウィリアムズでの奇跡の初勝利",
        "description": "予選ポールポジションを獲得したマルドナドが、地元アロンソの猛攻を退けて生涯唯一のF1優勝を達成。",
        "detailedStory": "2012年の混戦シーズン、ウィリアムズFW34を駆るマルドナドが予選で驚きのポール。決勝でもフェラーリのアロンソに背後を脅かされながらノーミスで走り抜き、ウィリアムズに2004年以来となる勝利をもたらした。レース直後にピットが火災に見舞われるドラマも。",
        "significance": "近代F1で最も予想外かつ痛快なアップセット勝利。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "ターン3やターン9、最終コーナーのハイスピードコーナリングを支えるハイダウンフォースセッティングが必須。",
      "kerbUsage": "全体的に縁石はスムーズ。しっかりと跨いでコーナーアングルを緩める走法が標準。",
      "brakeDemands": "ターン1とターン10でのハードブレーキング。ロングストレートで冷却風は確保しやすい。"
    },
    "references": [
      {
        "id": 1,
        "title": "Aerodynamic Evaluation Benchmark Data at Circuit de Barcelona-Catalunya",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-06-18"
      },
      {
        "id": 2,
        "title": "Restoration of Original High-Speed Final Sector at Catalunya",
        "publisher": "Circuit de Barcelona-Catalunya Official Report",
        "url": "https://www.circuitcat.com",
        "verifiedDate": "2023-06-01"
      }
    ]
  },
  {
    "id": "madrid",
    "name": "マドリング (IFEMAマドリード市街地コース)",
    "officialName": "Madring (IFEMA Madrid Hybrid Circuit)",
    "country": "スペイン 🇪🇸",
    "lengthKm": 5.474,
    "turns": 20,
    "drsZones": 3,
    "downforceLevel": "Medium",
    "tyreStress": "Medium-High",
    "typicalPitLossSec": 21.0,
    "safetyCarProbability": "65% (ストリート区間・ウォール近接)",
    "undercutImpact": "特大（路面温度上昇に伴うグレイニング多発、アンダーカットゲイン約1.7秒/周）",
    "lapRecord": {
      "time": "1:18.250",
      "driver": "2026年 FIA F1公式シミュレーション基準値",
      "year": 2026
    },
    "characteristics": "【第1章：2026年新時代を象徴する首都ハイブリッド・ストリート】\\nスペインの首都マドリードのIFEMA展示会場とバルデベバス地区を結び、2026年よりカレンダーに加わった新世代の半公道サーキット、マドリング（IFEMAマドリード市街地コース） [1][5]。国際展示場の敷地内と市街地公道、そして起伏に富んだ専用設計セクションが有機的に融合 [1][2]。F1の脱炭素・持続可能性目標に合致した完全公共交通アクセス型グランプリとして世界の注目を集める最新鋭のレースウェイである [2][5]。\\n\\n【第2章：パビリオン・アンダーパスとバンク角10度の超高速ベンド】\\nコース最大の見所は、巨大なIFEMA展示ホール間を潜り抜ける特設トンネルセクションと、最大傾斜角10度を誇るダイナミックなバンク付き高速コーナー（Turns 7-9） [1][3]。時速260km/h超でバンクを駆け抜ける際には遠心力と下向きの重力加速度が重なり合い、マシンのサスペンションが限界まで沈み込む（ボトミング） [2][3]。2026年の新アクティブエアロ（低ドラッグのXモードと高ダウンフォースのZモード）の切り替えが随所で要求され、市街地特有のタイトブレーキングと超高速セクションが共存する [2][4][6]。\\n\\n【第3章：350kW MGU-K回生配分と路面グレイニングのアンダーカット戦術】\\n新設サーキット特有の「グリーンなアスファルト（未成熟な路面）」はタイヤの滑りを誘発しやすく、局所的な温度上昇による表面剥離（グレイニング）とサーマルデグラデーションが頻発する [2][6]。特にタイトな市街地シケインでのブレーキングで350kW MGU-Kのエネルギーを急速回生し、トンネル直後のロングストレートでManual Override Modeを展開するオーバーテイク戦略が極めて有効 [3][4]。デグラデーションの進行が早いため、1周あたり約1.7秒ものタイム短縮をもたらすアグレッシブなアンダーカットが勝敗を分ける [1][6]。",
    "officialLinks": {
          "website": "https://www.ifema.es/",
          "f1Official": "https://www.formula1.com/en/racing/2026/madrid.html",
          "googleMaps": "https://maps.google.com/?q=IFEMA+Madrid",
          "xTwitter": "https://x.com/IFEMA",
          "instagram": "https://www.instagram.com/feria_madrid/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_madrid.jpg",
      "credit": "F1 / IFEMA Madrid Official",
      "license": "Editorial / Fair Use",
      "sourceUrl": "https://www.formula1.com/en/latest/article.madrid-to-host-spanish-grand-prix-from-2026.html"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_madrid.jpg",
        "credit": "F1 / IFEMA Madrid Official",
        "license": "Editorial / Fair Use",
        "sourceUrl": "https://www.formula1.com/en/latest/article.madrid-to-host-spanish-grand-prix-from-2026.html"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_madrid.jpg",
        "caption": "IFEMAパビリオン群と壮大なバンクコーナーを駆け抜ける新世代マドリードGP全景",
        "credit": "IFEMA Madrid",
        "license": "Editorial / Fair Use",
        "sourceUrl": "https://www.ifema.es/en/madrid-f1"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_madrid.jpg",
        "caption": "IFEMAパビリオン群と壮大なバンクコーナーを駆け抜ける新世代マドリードGP全景",
        "tag": "Atmosphere",
        "credit": "IFEMA Madrid",
        "license": "Editorial / Fair Use",
        "sourceUrl": "https://www.ifema.es/en/madrid-f1"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 21.5,
      "longestStraightMeters": 1100,
      "gForceMax": {
        "lateral": 4.9,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "IFEMA Gateway",
          "characteristic": "時速330km/hから一気に時速110km/hまで減速する左・右の難関ブレーキングゾーン。"
        },
        {
          "number": "T7-T9",
          "name": "The High Bank",
          "characteristic": "バンク傾斜10度を誇る超高速スウィーパー。時速260km/h超で駆け抜ける。"
        },
        {
          "number": "T13-T15",
          "name": "Urban Complex",
          "characteristic": "コンクリートウォールがミリ単位で迫るツイスティな低速テクニカルセクション。"
        },
        {
          "number": "T19-T20",
          "name": "Launch Sweeper",
          "characteristic": "メインストレートへ全開で接続する高速右コーナー。DRSゾーンへと雪崩れ込む。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Gateway Left",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "330km/hから進入。トレイルブレーキングで車首を素早くインに向ける。"
      },
      {
        "number": "T2",
        "name": "Gateway Right",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "縁石を活用し素早い脱出トラクションを確保。"
      },
      {
        "number": "T7",
        "name": "The Bank Entry",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "バンク角によりダウンフォースと垂直Gが急増。車高セッティングの底付き（ボトミング）に注意。"
      },
      {
        "number": "T8",
        "name": "The Bank Apex",
        "gearEstimated": "7th",
        "speedEstimated": "265 km/h",
        "engineeringTip": "全開で駆け抜ける右バンク。左タイヤへの熱負荷が最大化。"
      },
      {
        "number": "T14",
        "name": "Urban Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "78 km/h",
        "engineeringTip": "最も車速が落ちるヘアピン。ステアリング切れ角とデフセッティングが重要。"
      },
      {
        "number": "T20",
        "name": "Final Launch",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "メインストレートへの脱出速度を最大化するため、イン側の縁石をミリ単位でクリップ。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "IFEMAロングストレートでのXモード低ドラッグと、市街地ツイスティ区間およびバンクコーナーでのZモード高ダウンフォースの両立。ストリートコースとしては比較的中〜高速寄りのエアロパッケージが要求される。",
      "kerbUsage": "市街地セクションの特設縁石（ケルブ）は段差が鋭いため、サスペンションが弾かれてウォールに接触するリスクがある。しなやかなコンプライアンスを持たせつつ、バンクでのボトミングを防ぐプログレッシブなバンプラバー設定が重要。",
      "brakeDemands": "ターン1（IFEMA Gateway）の時速330km/hからのヘビーブレーキングが最大の減速ポイント。コンクリートウォールが迫る中での急制動となるため、ブレーキバイアスを最適化してリアの唐突なオーバーステアを抑制する。"
    },
    "references": [
      {
        "id": 1,
        "title": "Madrid to host Formula 1 Spanish Grand Prix from 2026 onwards",
        "publisher": "Formula 1 Official Announcement",
        "url": "https://www.formula1.com/en/latest/article.madrid-to-host-spanish-grand-prix-from-2026.html",
        "verifiedDate": "2024-01-23"
      },
      {
        "id": 2,
        "title": "IFEMA Madrid Circuit Design & Technical Layout Specifications",
        "publisher": "FIA World Motor Sport Council",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-06-15"
      }
    ]
  },
  {
    "id": "redbull-ring",
    "name": "レッドブル・リンク（シュピールベルク）",
    "officialName": "Red Bull Ring",
    "country": "オーストリア 🇦🇹",
    "lengthKm": 4.318,
    "turns": 10,
    "drsZones": 3,
    "downforceLevel": "Medium",
    "tyreStress": "Medium",
    "typicalPitLossSec": 20.5,
    "safetyCarProbability": "50% (中程度)",
    "undercutImpact": "大（1周約65秒の超ショートコースのため周回遅れとトラフィック処理が命）",
    "lapRecord": {
      "time": "1:05.619",
      "driver": "Carlos Sainz (McLaren)",
      "year": 2020
    },
    "characteristics": "【第1章：シュタイヤーマルクのアルプスに抱かれた電光石火のショートトラック】\\nオーストリア・シュピールベルクの美しいアルプス山麓に位置し、1周わずか約1分05秒前後で駆け抜けるカレンダー最短クラスの電撃サーキット [1][5]。高低差65メートルの山肌を登り降りするドラマティックなレイアウトであり、ターン1からターン3へ向かう強烈な登り坂ストレートは、エンジンパワーと高地でのターボチャージャー効率を厳しく試す [1][2]。\\n\\n【第2章：ソーセージ縁石の洗礼とトラックリミットの死闘】\\n3箇所のDRSゾーンにより毎周のようにオーバーテイクが頻発する一方、ターン9〜10の最終高速コーナーでは外側の白線ミリ単位を攻める「トラックリミット違反」が頻発する [2][3]。また、コーナー出口に設置された硬質な縁石はフロントウィングやサスペンション、フロアに甚大なダメージを与える「カーブ・ディストラクター（縁石の破壊者）」として恐れられる [2][4][6]。",
    "officialLinks": {
          "website": "https://www.redbullring.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/austria.html",
          "googleMaps": "https://maps.google.com/?q=Red+Bull+Ring",
          "xTwitter": "https://x.com/redbullring",
          "instagram": "https://www.instagram.com/redbullring/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_redbull_ring.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Bull_Ring_Spielberg.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_redbull_ring.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Bull_Ring_Spielberg.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_redbull_ring.jpg",
        "caption": "シュタイアーマルク山脈とシンボルの巨大な雄牛像を望むレッドブル・リンク",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Bull_Ring_Spielberg.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_redbull_ring.jpg",
        "caption": "シュタイアーマルク山脈とシンボルの巨大な雄牛像を望むレッドブル・リンク",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Bull_Ring_Spielberg.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 63.5,
      "longestStraightMeters": 800,
      "gForceMax": {
        "lateral": 4.5,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Niki Lauda Kurve",
          "characteristic": "上り坂の急減速右直角コーナー。"
        },
        {
          "number": "T3",
          "name": "Schlossgold",
          "characteristic": "山頂の急勾配上りヘアピン。激しいブレーキングバトル。"
        },
        {
          "number": "T9-T10",
          "name": "Jochen Rindt & Final Corner",
          "characteristic": "下りながら高速で駆け抜けるトラックリミット厳重警戒の2連続右。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Niki Lauda Kurve",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "上り坂でのブレーキング。インの縁石を大胆に跨いでメインストレートを立ち上がる。"
      },
      {
        "number": "T2",
        "name": "Kink Uphill",
        "gearEstimated": "7th",
        "speedEstimated": "310 km/h",
        "engineeringTip": "急勾配を駆け上がる全開左キンク。DRS全開。"
      },
      {
        "number": "T3",
        "name": "Schlossgold Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "山頂の超急勾配右ヘアピン。オーバーテイクの最大激戦区。"
      },
      {
        "number": "T4",
        "name": "Rauch (下り右)",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "強烈な下り坂での右。フロントの荷重抜けでコース外へ押し出されやすい。"
      },
      {
        "number": "T5",
        "name": "Fast Left Sweep",
        "gearEstimated": "5th",
        "speedEstimated": "200 km/h",
        "engineeringTip": "下り全開左スイープ。"
      },
      {
        "number": "T6",
        "name": "Gerhard Berger Kurve",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "長い下り左。外側グラベルが近いため精密なステア操作。"
      },
      {
        "number": "T7",
        "name": "Left Exit Curb",
        "gearEstimated": "5th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "外側ソーセージ縁石に底打ちしないよう加速。"
      },
      {
        "number": "T8",
        "name": "Fast Right Transition",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "最終セクターへの高速右アプローチ。"
      },
      {
        "number": "T9",
        "name": "Jochen Rindt Kurve",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "下り高速右。トラックリミット違反が極めて多発する名所。"
      },
      {
        "number": "T10",
        "name": "Final Corner",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "メインストレートへ接続する下り右。ミリ単位で白線を残して立ち上がる。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2019,
        "title": "フェルスタッペン、ホンダPUに13年ぶりの勝利をもたらす",
        "description": "スタート出遅れから驚異の挽回劇。残り3周でルクレールをターン3でインから押し出し劇的優勝。",
        "detailedStory": "スタートでアンチラグが作動し8番手まで落ちたフェルスタッペン。オレンジアーミーの大声援を背に驚異的なペースで追い上げ、残り3周のターン3でルクレールとホイールを接触させながらパス。ホンダに2006年ハンガリーGP以来となる記念すべき勝利をもたらした。",
        "significance": "ホンダF1現代黄金期の復活を告げた記念碑的一戦。"
      },
      {
        "year": 2020,
        "title": "コロナ禍からのF1開幕戦とノリス初の表彰台",
        "description": "世界が停止したパンデミックを経てオーストリアでF1再開。ノリスが最終ラップにファステストを叩き出し初登壇。",
        "detailedStory": "7月にようやく開幕を迎えた2020年F1。セーフティカー連発の荒れた展開の中、ハミルトンに5秒ペナルティが科される。マクラーレンのノリスが最終周に「シナリオ7」全開モードでベストラップを刻み、わずか0.198秒差でハミルトンを逆転し初表彰台を獲得した。",
        "significance": "パンデミックの暗雲を吹き飛ばした奇跡の開幕戦。"
      },
      {
        "year": 2002,
        "title": "フェラーリの悪名高いチームオーダー劇",
        "description": "首位を快走するバリチェロに対し、チェッカー直前でシューマッハに勝利を譲るようチームオーダーが下り大ブーイング。",
        "detailedStory": "終始レースを支配したルーベンス・バリチェロ。しかしジャン・トッド代表から「シューマッハを前に出せ」との冷徹な指示。ゴールライン直前でバリチェロが減速しシューマッハが先着。表彰台でブーイングが吹き荒れ、この事件を機にチームオーダー禁止規定が制定された。",
        "significance": "F1史上で最も議論を呼んだチームオーダー事件。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "3本のロングストレートと高速ターン9-10のバランス。ミディアムレベルのウイングで最高速を確保。",
      "kerbUsage": "ターン9・ターン10の脱出縁石はトラックリミットの温床。足を落とすとタイム抹消とペナルティが科される。",
      "brakeDemands": "ターン1、ターン3、ターン4でのヘビーブレーキング。高地による空気密度の低さで冷却効率に注意。"
    },
    "references": [
      {
        "id": 1,
        "title": "Red Bull Ring Track Topography and Elevation Profile",
        "publisher": "Projekt Spielberg Technical Review",
        "url": "https://www.redbullring.com",
        "verifiedDate": "2024-06-25"
      },
      {
        "id": 2,
        "title": "Track Limits and Aerodynamic Sensitivity in Austrian GP Final Sector",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-06-28"
      }
    ]
  },
  {
    "id": "hungaroring",
    "name": "ハンガロリンク（ブダペスト）",
    "officialName": "Hungaroring",
    "country": "ハンガリー 🇭🇺",
    "lengthKm": 4.381,
    "turns": 14,
    "drsZones": 2,
    "downforceLevel": "High",
    "tyreStress": "High",
    "typicalPitLossSec": 21.8,
    "safetyCarProbability": "40% (中低)",
    "undercutImpact": "極めて大（モナコ並みに抜きにくいためアンダーカットが最強の武器）",
    "lapRecord": {
      "time": "1:16.627",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2020
    },
    "characteristics": "【第1章：「壁のないモナコ」と呼ばれる灼熱のワインディングロード】\\nハンガリー・ブダペスト郊外の天然すり鉢状の谷あいに位置する超テクニカルサーキット [1][5]。ストレートが極端に短く、14のコーナーが息つく暇もなく連続するため「壁のないモナコ（Monaco without walls）」の異名をとる [1][2]。毎年7月下旬の酷暑期に開催されるため、路面温度は60℃近くまで跳ね上がり、コクピット内のドライバーにサウナ状態の肉体的持久戦を強いる [2][4]。\\n\\n【第2章：最大ダウンフォースセッティングと予選グリッドの重み】\\nコース全周にわたり高速全開区間がほとんど存在しないため、各チームは空力抵抗（ドラッグ）を犠牲にしてでも最大ダウンフォース仕様のウィングを投入する [3][4]。抜きどころがターン1進入のブレーキングポイントに事実上限定されるため、土曜予選でのポールポジション獲得が決勝での勝利に直結する戦略的サーキット [1][3][6]。",
    "officialLinks": {
          "website": "https://hungaroring.hu/",
          "f1Official": "https://www.formula1.com/en/racing/2026/hungary.html",
          "googleMaps": "https://maps.google.com/?q=Hungaroring",
          "xTwitter": "https://x.com/HungaroringF1",
          "instagram": "https://www.instagram.com/hungaroring_official/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_hungaroring.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hungaroring_panoramic.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_hungaroring.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hungaroring_panoramic.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_hungaroring.jpg",
        "caption": "ブダペスト郊外のすり鉢状の丘に広がるハンガロリンクのパノラマ全景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hungaroring_panoramic.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_hungaroring.jpg",
        "caption": "ブダペスト郊外のすり鉢状の丘に広がるハンガロリンクのパノラマ全景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hungaroring_panoramic.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 38.5,
      "longestStraightMeters": 908,
      "gForceMax": {
        "lateral": 4.4,
        "longitudinal": 4.5
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Downhill Hairpin",
          "characteristic": "メインストレートエンドの下り急減速右。数少ないパッシングゾーン。"
        },
        {
          "number": "T4",
          "name": "Blind Crest Left",
          "characteristic": "時速220km/hで丘の頂上を駆け抜けるブラインド左。"
        },
        {
          "number": "T6-T7",
          "name": "Chicane",
          "characteristic": "縁石を大きく跨ぐ低速左右の切り返し。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Downhill Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "310km/hから下りながら急減速。インを突く最大のオーバーテイク地点。"
      },
      {
        "number": "T2",
        "name": "Downhill Left Carousel",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "下り傾斜の長い左。外側に流されないようフロントをインに引き止める。"
      },
      {
        "number": "T3",
        "name": "Sweeping Right",
        "gearEstimated": "4th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "全開で抜ける下り右。ターン4へのアプローチ速度を乗せる。"
      },
      {
        "number": "T4",
        "name": "Blind Crest Left",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "上り坂の頂上にあるブラインド高速左。イン側の縁石に車体を吸い付かせる。"
      },
      {
        "number": "T5",
        "name": "Long Uphill Carousel Right",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "上りながら右に旋回し続けるタイヤ酷使コーナー。"
      },
      {
        "number": "T6",
        "name": "Chicane 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "ソーセージ縁石を飛び越える低速シケイン。"
      },
      {
        "number": "T7",
        "name": "Chicane 脱出左",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "着地後の素早いスロットルコントロール。"
      },
      {
        "number": "T8",
        "name": "Technical Left",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "セクター2の流れるテクニカル複合への進入。"
      },
      {
        "number": "T9",
        "name": "Quick Right",
        "gearEstimated": "3rd",
        "speedEstimated": "155 km/h",
        "engineeringTip": "左右の荷重移動のレスポンスが命。"
      },
      {
        "number": "T10",
        "name": "Fast Left Kink",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "全開で抜ける高速左ベンド。"
      },
      {
        "number": "T11",
        "name": "Fast Right Sweep",
        "gearEstimated": "4th",
        "speedEstimated": "190 km/h",
        "engineeringTip": "長い右。ダウンフォースが抜けやすい難所。"
      },
      {
        "number": "T12",
        "name": "Right 90-degree",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "ハードブレーキングを伴う右直角コーナー。"
      },
      {
        "number": "T13",
        "name": "Medium Left Carousel",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "最終コーナー手前の回り込む左。"
      },
      {
        "number": "T14",
        "name": "Final 180-degree Right",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "メインストレートへ接続する180度ロング右。DRS区間への立ち上がりが最重要。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2006,
        "title": "ジェンソン・バトン、波乱の雨中でキャリア初優勝",
        "description": "ホンダ第3期F1の記念すべき初勝利。14番手スタートのバトンが悪天候を読み切り113戦目の初勝利。",
        "detailedStory": "ハンガロリンク初の雨のレース。アロンソやライコネンがトラブルで脱落する中、ホンダRA106を駆るバトンが濡れた路面で圧巻の速さを披露。的確なピット判断で首位に立ち、ホンダに1992年以来のワークス優勝をもたらした。",
        "significance": "ホンダ第3期唯一の勝利とバトンの歴史的初タイトルへの足がかり。"
      },
      {
        "year": 2021,
        "title": "オコンの奇跡の初勝利とハミルトン「ひとりスタート」",
        "description": "1周目の多重事故とリスタート時の全車ピットインにより、アルピーヌのエステバン・オコンが初優勝。",
        "detailedStory": "ボッタスの追突から多重事故が発生し赤旗。再スタート前のフォーメーションラップで路面が乾き、ハミルトン以外の全車がピットインしてタイヤ交換。ハミルトンがグリッドにたった1台でスタンディングスタートを切る前代未聞の珍事に。混乱を突いたオコンがベッテルを抑え切って劇的勝利。",
        "significance": "F1史上最も奇妙なスタートとアルピーヌの初勝利。"
      },
      {
        "year": 2019,
        "title": "ハミルトンとメルセデスの神戦略アンダーカット",
        "description": "首位フェルスタッペンに対し、メルセデスが残り20周で奇襲の2ストップ作戦を決行し大逆転勝利。",
        "detailedStory": "ポールから独走するフェルスタッペンを抜けずにいたハミルトン。メルセデスは残り20周で2度目のピットインを行い新品ミディアムを投入。1周2秒速いペースで猛追し、残り3周でタイヤの終わったフェルスタッペンをターン1で捕らえて優勝を奪った。",
        "significance": "現代F1におけるタイヤデータシミュレーション戦略の最高傑作。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "ストレート速度を捨ててでもコーナーでのグリップを稼ぐマックス・ハイダウンフォース。モナコに匹敵するエアロ構成。",
      "kerbUsage": "ターン6〜7のシケインをはじめ縁石を深く使ってコーナーを直線化する走法が求められる。",
      "brakeDemands": "ストレートで風が当たる時間が短いため、ブレーキダクトの開度を大きくとり冷却を確保。"
    },
    "references": [
      {
        "id": 1,
        "title": "Hungaroring Circuit Characteristics and High-Downforce Dynamics",
        "publisher": "Hungaroring Sport Zrt.",
        "url": "https://hungaroring.hu",
        "verifiedDate": "2024-07-15"
      },
      {
        "id": 2,
        "title": "Strategic Overtaking Deficit and Two-Stop Undercut Efficacy at Budapest",
        "publisher": "Motorsport Strategy Engineering Analysis",
        "url": "https://www.formula1.com",
        "verifiedDate": "2024-07-18"
      }
    ]
  },
  {
    "id": "zandvoort",
    "name": "ザントフォールト・サーキット",
    "officialName": "Circuit Zandvoort",
    "country": "オランダ 🇳🇱",
    "lengthKm": 4.259,
    "turns": 14,
    "drsZones": 2,
    "downforceLevel": "High",
    "tyreStress": "High",
    "typicalPitLossSec": 21.5,
    "safetyCarProbability": "60% (中程度)",
    "undercutImpact": "大（コース幅が狭くオーバーテイク困難、戦略が鍵）",
    "lapRecord": {
      "time": "1:11.097",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2021
    },
    "characteristics": "【第1章：北海の砂丘を縫う伝説のバンクコーナー】\\n1952年にF1を初開催し、2021年に大改修を経て復活したオランダのクラシックサーキット [1][5]。設計会社アペックス・サーキット・デザインが導入したターン3（フーゲンホルツ）の18度（32%勾配）バンク、そして最終ターン14（オーリー・ボスコ）の急傾斜バンクは、インディアナポリス（9度）の2倍の傾斜角を誇る [1][3]。\\n\\n【第2章：3次元コーナリングGと砂丘の突風】\\nバンクコーナーでは、通常の横Gに加えて垂直方向の圧縮Gがタイヤにかかるため、ピレリは専用の強化構造タイヤを供給 [3][6]。北海からの強風がコース上に海砂を吹き飛ばし、グリップレベルが周回ごとに激変するトラックエボリューションへの適応力が勝負を分ける [2][4]。",
    "officialLinks": {
          "website": "https://www.circuitzandvoort.nl/",
          "f1Official": "https://www.formula1.com/en/racing/2026/netherlands.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+Zandvoort",
          "xTwitter": "https://x.com/circuitzandvoor",
          "instagram": "https://www.instagram.com/circuitzandvoort/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_zandvoort.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Zandvoort_aerial.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_zandvoort.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Zandvoort_aerial.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_zandvoort.jpg",
        "caption": "北海の砂丘地帯を縫うように走るザントフォールトのバンキングコーナー全景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Zandvoort_aerial.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_zandvoort.jpg",
        "caption": "北海の砂丘地帯を縫うように走るザントフォールトのバンキングコーナー全景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Zandvoort_aerial.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 15,
      "longestStraightMeters": 678,
      "gForceMax": {
        "lateral": 4.6,
        "longitudinal": 4.4
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Tarzanbocht",
          "characteristic": "名物180度ヘアピン。アウト側からインに切り込むオーバーテイク名所。"
        },
        {
          "number": "T3",
          "name": "Hugenholtzbocht",
          "characteristic": "19度の急激なバンク角を持つすり鉢状コーナー。"
        },
        {
          "number": "T14",
          "name": "Arie Luyendykbocht",
          "characteristic": "18度バンクを駆け抜けメインストレートへ全開で接続する超高速最終コーナー。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Tarzanbocht",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "伝統の180度右ヘアピン。カントがついており外側ラインからのクロスラインが有効。"
      },
      {
        "number": "T2",
        "name": "Gerlachbocht",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "バンクコーナーへ向かう中速右。"
      },
      {
        "number": "T3",
        "name": "Hugenholtzbocht (19度バンク)",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "インディを凌ぐ19度の巨大バンク左。外側の高いラインを走ることで脱出速度が急上昇。"
      },
      {
        "number": "T4",
        "name": "Uphill Crest Right",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "丘の頂上へ向けて全開で駆け上がるブラインド右。"
      },
      {
        "number": "T5",
        "name": "Crest Kink",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "砂丘の尾根を全開で通過。"
      },
      {
        "number": "T6",
        "name": "Hunserug",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "高速右ベンド。"
      },
      {
        "number": "T7",
        "name": "Scheivlak",
        "gearEstimated": "6th",
        "speedEstimated": "250 km/h",
        "engineeringTip": "下りブラインドの超高速右。F1で最も度胸が試される名コーナー。"
      },
      {
        "number": "T8",
        "name": "Mastersbocht",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "高速右スイープ。砂が吹き溜まりやすくグリップ変化に注意。"
      },
      {
        "number": "T9",
        "name": "Bocht 9",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "インフィールドのテクニカル左。"
      },
      {
        "number": "T10",
        "name": "CM.com Bocht",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "タイトに回り込む左。"
      },
      {
        "number": "T11",
        "name": "Hans Ernst Bocht 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "低速シケイン進入。"
      },
      {
        "number": "T12",
        "name": "Hans Ernst Bocht 脱出左",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "縁石を跨いで最終セクターへ。"
      },
      {
        "number": "T13",
        "name": "Kumhobocht",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "バンクコーナーへ向けて速度を乗せる右。"
      },
      {
        "number": "T14",
        "name": "Arie Luyendykbocht (18度バンク)",
        "gearEstimated": "6th ➔ 7th",
        "speedEstimated": "265 km/h",
        "engineeringTip": "18度バンクを全開DRSで駆け抜ける圧巻の最終コーナー。縦Gと横Gが同時に作用。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1985,
        "title": "ニキ・ラウダ、F1生涯最後の優勝",
        "description": "マクラーレンのニキ・ラウダが、猛追する僚友アラン・プロストを0.232秒差で抑え込みキャリア25勝目を達成。",
        "detailedStory": "ザントフォールト改修前最後のグランプリ。10番手スタートのラウダがタイヤ交換戦略でトップに立ち、終盤にファステストを連発して迫るプロストを徹底的なブロックで抑え切った。ラウダにとってこれがF1通算25回目にして最後の勝利となった。",
        "significance": "不世出の英雄ニキ・ラウダの現役最後の金字塔。"
      },
      {
        "year": 2021,
        "title": "36年ぶりの復活とフェルスタッペンの母国制覇",
        "description": "オランダGPが36年ぶりに復活。オレンジアーミーの大熱狂の中、フェルスタッペンがメルセデス2台を完封し勝利。",
        "detailedStory": "サーキット全体がオレンジ色の発煙筒と大歓声で埋め尽くされた記念すべき復帰戦。ハミルトンとボッタスがアンダーカット攻撃を仕掛ける中、フェルスタッペンは神懸かり的なペース配分で首位を一度も譲ることなく母国初優勝を遂げた。",
        "significance": "オランダのモータースポーツ熱が頂点に達した歴史的瞬間。"
      },
      {
        "year": 2023,
        "title": "豪雨と赤旗、フェルスタッペンが歴代最多タイの9連勝",
        "description": "大雨による赤旗中断と路面変化の極限レースを制し、セバスチャン・ベッテルの持つF1最多連勝記録（9連勝）に並ぶ。",
        "detailedStory": "レース開始直後と終盤に局地的な豪雨が襲来。コースアウトが続出する大荒れの展開の中、フェルスタッペンは的確なタイヤマネジメントでトップを死守。アストンマーティンのアロンソの猛追を振り切り、母国3連覇と歴史的9連勝を達成した。",
        "significance": "近代F1の絶対王者が大記録に肩を並べた伝説のレース。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "バンクコーナーで高い垂直荷重が得られるため、ダウンフォースは高めの設定が有効。",
      "kerbUsage": "砂丘の特性上、コース外は即グラベルと芝生。縁石の使いすぎはスピン直結。",
      "brakeDemands": "ターン1のタルツァンボヒト以外は強い減速がなく、ブレーキ冷却への要求は中程度。"
    },
    "references": [
      {
        "id": 1,
        "title": "Banking Geometry and Dynamic Vertical Compression at Circuit Zandvoort",
        "publisher": "Dromo Circuit Design & Engineering",
        "url": "https://www.studiodromo.it",
        "verifiedDate": "2023-08-25"
      },
      {
        "id": 2,
        "title": "Pirelli Special Tyre Pressure Guidelines for Zandvoort Banked Turns",
        "publisher": "Pirelli Motorsport Technical Report",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2023-08-28"
      }
    ]
  },
  {
    "id": "baku",
    "name": "バクー・シティ・サーキット",
    "officialName": "Baku City Circuit",
    "country": "アゼルバイジャン 🇦🇿",
    "lengthKm": 6.003,
    "turns": 20,
    "drsZones": 2,
    "downforceLevel": "Low",
    "tyreStress": "Low",
    "typicalPitLossSec": 21,
    "safetyCarProbability": "80% (極めて高い)",
    "undercutImpact": "中程度（2.2kmストレートのDRSスリップストリームが強烈）",
    "lapRecord": {
      "time": "1:43.009",
      "driver": "Charles Leclerc (Ferrari)",
      "year": 2019
    },
    "characteristics": "【第1章：世界遺産の古城と2.2kmの超長大メインストリート】\\nカスピ海の港町バクーの市街地を走る超高速ストリートコース [1][5]。コース幅がわずか7.6メートルしかなく、世界遺産の城壁すれすれを抜ける「キャッスル・セクション（Turns 8-10）」という極低速区間を持つ一方、カスピ海沿岸のメインストレートはF1カレンダー最長の2.2kmに達し、時速355km/hを超える超高速バトルが展開される [1][2]。\\n\\n【第2章：相反する空力セッティングとスリップストリームの狂詩曲】\\nストレート最高速を稼ぐための超低ダウンフォースウィングと、低速シケインを曲がるためのメカニカルグリップという極端な妥協点を探るセットアップ [2][4]。ターン1進入での強烈なスリップストリーム合戦や、ブレーキロックによるエスケープゾーン飛び込み、そしてセーフティカーリスタートでの大波乱が毎年の名物となっている [1][2][6]。",
    "officialLinks": {
          "website": "https://www.bakucitycircuit.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/azerbaijan.html",
          "googleMaps": "https://maps.google.com/?q=Baku+City+Circuit",
          "xTwitter": "https://x.com/BakuCityCircuit",
          "instagram": "https://www.instagram.com/bakucitycircuit/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_baku.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baku_City_Circuit_Castle_section.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_baku.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baku_City_Circuit_Castle_section.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_baku.jpg",
        "caption": "中世の城壁と現代のF1マシンが交錯するバクー旧市街城塞セクション",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baku_City_Circuit_Castle_section.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_baku.jpg",
        "caption": "中世の城壁と現代のF1マシンが交錯するバクー旧市街城塞セクション",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baku_City_Circuit_Castle_section.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 24.5,
      "longestStraightMeters": 2220,
      "gForceMax": {
        "lateral": 3.9,
        "longitudinal": 4.9
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Turn 1",
          "characteristic": "350km/h超から急減速する90度左コーナー。"
        },
        {
          "number": "T8-T10",
          "name": "Castle Section",
          "characteristic": "コース幅わずか7.6m。中世の石造りの城壁をミリ単位で駆け抜ける。"
        },
        {
          "number": "T16",
          "name": "Turn 16",
          "characteristic": "2.2kmストレートへ向かう最後の低速左。脱出トラクションが勝負。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "350km/h超からヘビーブレーキング。オーバーテイクの最大激戦区。"
      },
      {
        "number": "T2",
        "name": "Turn 2 (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "直後の90度左。外側ウォールが迫る。"
      },
      {
        "number": "T3",
        "name": "Turn 3 (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "第2DRSゾーンへ向けた立ち上がり。"
      },
      {
        "number": "T4",
        "name": "Turn 4 (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "ストリート直角コーナー。"
      },
      {
        "number": "T5",
        "name": "Turn 5 (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "低速切り返し。"
      },
      {
        "number": "T6",
        "name": "Turn 6 (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "城塞セクションへのアプローチ。"
      },
      {
        "number": "T7",
        "name": "Turn 7 (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "路面が狭まり始める右ターン。"
      },
      {
        "number": "T8",
        "name": "Castle Section 進入",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "道幅わずか7.6mの超難関。石壁にミラーを擦る極限精度。"
      },
      {
        "number": "T9",
        "name": "Castle Section 右",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "城壁沿いの右フリック。"
      },
      {
        "number": "T10",
        "name": "Castle Section 左脱出",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "狭いボトルネックからの脱出。"
      },
      {
        "number": "T11",
        "name": "Downhill Fast Right",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "下りながら抜ける高速右。"
      },
      {
        "number": "T12",
        "name": "Downhill Blind Left",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "ブラインドの高速左。"
      },
      {
        "number": "T13",
        "name": "Fortress Left Sweep",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "城塞を背にした全開左。"
      },
      {
        "number": "T14",
        "name": "Fast Left Kink",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "ターン15へのアプローチ。"
      },
      {
        "number": "T15",
        "name": "Downhill Hard Braking Left",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "下り坂でのトリッキーなブレーキング。外側バリアへのクラッシュ多発。"
      },
      {
        "number": "T16",
        "name": "Turn 16 (最重要脱出左)",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "2.2kmストレートへの最終トラクション。ここでのミスはストレート全体で致命傷。"
      },
      {
        "number": "T17",
        "name": "Coastal Kink Left",
        "gearEstimated": "6th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "海岸沿い全開ストレートへの突入。"
      },
      {
        "number": "T18",
        "name": "Full Throttle Sweep",
        "gearEstimated": "7th",
        "speedEstimated": "305 km/h",
        "engineeringTip": "全開で抜ける高速右。"
      },
      {
        "number": "T19",
        "name": "Blind Full Throttle Left",
        "gearEstimated": "8th",
        "speedEstimated": "330 km/h",
        "engineeringTip": "時速330km/h超で駆け抜けるブラインド全開左。"
      },
      {
        "number": "T20",
        "name": "Main Straight Blast",
        "gearEstimated": "8th",
        "speedEstimated": "350 km/h",
        "engineeringTip": "F1最長の2.2kmストレートのDRS全開疾走。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2017,
        "title": "ベッテルとハミルトンのSC中激突事件",
        "description": "セーフティカー先導中、追突されたベッテルが激怒しハミルトンに横付けしてマシンを体当たりさせる大スキャンダル。",
        "detailedStory": "SCリスタート直前の減速に腹を立てたベッテルが、ハミルトンの横に並びステアリングを切って接触。10秒ストップペナルティを受けるも、ハミルトンもヘッドレストの脱落でピットインを余儀なくされ、リカルドが奇跡の勝利を飾った。",
        "significance": "激化するライバル関係の頂点となった前代未聞のスポーツマンシップ違反事件。"
      },
      {
        "year": 2018,
        "title": "レッドブル同門2台の同士討ち大クラッシュ",
        "description": "レース中激しいバトルを繰り広げていたリカルドとフェルスタッペンが、メインストレートエンドで時速320km/hで追突。",
        "detailedStory": "激しい順位争いを展開していた2台。40周目のメインストレート、スリップから抜け出そうとしたリカルドに対しフェルスタッペンがブロック。空力を失ったリカルドが追突し両者リタイア。チーム首脳陣を激怒させた伝説の同門クラッシュとなった。",
        "significance": "リカルドのルノー移籍を決断させた決定的一撃。"
      },
      {
        "year": 2021,
        "title": "フェルスタッペンのタイヤ破裂とハミルトンの「魔法ボタン」ミス",
        "description": "首位独走のフェルスタッペンが時速320km/hでタイヤバースト。赤旗リスタートでハミルトンがブレーキ設定ミスでコースオフ。",
        "detailedStory": "残り5周で首位フェルスタッペンの左リアがメインストレートで突然破裂。赤旗中断後の残り2周のスタンディングスタート、ハミルトンがターン1でブレーキバイアスボタン（Brake Magic）を誤操作して白煙を上げコースオフ。ペレスがレッドブル初勝利を飾った。",
        "significance": "2021年タイトル争いのドラマチックな波乱を象徴する激闘。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "2.2kmストレートでの最高速を狙うためモンツァ級のローダウンフォースが要求されるが、低速セクター2でのグリップとの妥協が極めて困難。",
      "kerbUsage": "市街地コースのため縁石は低めだが、ターン8〜10の城塞セクションでは縁石に乗ると即ウォール接触。",
      "brakeDemands": "ターン1やターン3での340km/hからのヘビーブレーキング。ストレートが長いためブレーキの急冷（温度ドロップ）に警戒。"
    },
    "references": [
      {
        "id": 1,
        "title": "Baku City Circuit Engineering Design and Longest Straight Aerodynamics",
        "publisher": "Tilke Engineers & Architects",
        "url": "https://tilke.de",
        "verifiedDate": "2024-04-26"
      },
      {
        "id": 2,
        "title": "Pirelli Technical Findings on High-Speed Tyre Failures at Baku",
        "publisher": "Pirelli Motorsport & FIA Safety Department",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2024-04-28"
      }
    ]
  },
  {
    "id": "singapore",
    "name": "マリーナベイ・ストリート・サーキット",
    "officialName": "Marina Bay Street Circuit",
    "country": "シンガポール 🇸🇬",
    "lengthKm": 4.94,
    "turns": 19,
    "drsZones": 4,
    "downforceLevel": "High",
    "tyreStress": "Medium",
    "typicalPitLossSec": 28,
    "safetyCarProbability": "100% (歴史上全レースでSC出動)",
    "undercutImpact": "大（低速コーナー連続でデグラデーションが激しい）",
    "lapRecord": {
      "time": "1:34.486",
      "driver": "Daniel Ricciardo (RB)",
      "year": 2024
    },
    "characteristics": "【第1章：赤道直下の熱帯夜を照らす世界初のF1ナイトレース】\\nマリーナベイの摩天楼をバックに強力な照明灯の下で開催されるストリートレース [1][5]。気温30℃超、湿度80%以上という過酷な気候条件の中、2時間ルールぎりぎりまで続く70周のレースは、ドライバーの心拍数が平均170bpmを超え、体重が3kg以上減少する「年間で最も肉体的に過酷なグランプリ」と称される [1][2]。\\n\\n【第2章：19のコーナーと100%のセーフティカー確率】\\n低速コーナーが連続するため最大ダウンフォースセッティングが必須 [3][4]。市街地の舗装ギャップや橋の通過部（アンダーソン・ブリッジ）での底打ちショックを吸収するしなやかなサスペンションセッティングが要求される [2][4]。コース全周がコンクリートウォールに囲まれているため、2008年初開催以来セーフティカー出動率100%という驚異的な記録を保持している [1][2][6]。",
    "officialLinks": {
          "website": "https://singaporegp.sg/",
          "f1Official": "https://www.formula1.com/en/racing/2026/singapore.html",
          "googleMaps": "https://maps.google.com/?q=Marina+Bay+Street+Circuit",
          "xTwitter": "https://x.com/F1NightRace",
          "instagram": "https://www.instagram.com/f1nightrace/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_singapore.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marina_Bay_Street_Circuit_Singapore_Flyer.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_singapore.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marina_Bay_Street_Circuit_Singapore_Flyer.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_singapore.jpg",
        "caption": "シンガポール・フライヤーとマリーナベイの壮麗な夜景に包まれるストリート",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marina_Bay_Street_Circuit_Singapore_Flyer.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_singapore.jpg",
        "caption": "シンガポール・フライヤーとマリーナベイの壮麗な夜景に包まれるストリート",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marina_Bay_Street_Circuit_Singapore_Flyer.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 5.3,
      "longestStraightMeters": 832,
      "gForceMax": {
        "lateral": 3.8,
        "longitudinal": 4.5
      },
      "keyCorners": [
        {
          "number": "T1-T3",
          "name": "Sheares Chicane",
          "characteristic": "メインストレートから飛び込む低速シケイン。"
        },
        {
          "number": "T7",
          "name": "Memorial Corner",
          "characteristic": "ラッフルズ通りエンドの90度左。パッシング名所。"
        },
        {
          "number": "T13",
          "name": "Fullerton Hairpin",
          "characteristic": "アンダーソン橋を渡った直後の急減速ヘアピン。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Sheares 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "ピット直線エンドの急減速。イン側をカット。"
      },
      {
        "number": "T2",
        "name": "Sheares 右",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "タイトな切り返し。"
      },
      {
        "number": "T3",
        "name": "Sheares 脱出左",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "立ち上がりのトラクションが鍵。"
      },
      {
        "number": "T4",
        "name": "Turn 4 右",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "ラッフルズ通りへの加速。"
      },
      {
        "number": "T5",
        "name": "Raffles Sweep",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "全開で大通りへ合流。"
      },
      {
        "number": "T6",
        "name": "Raffles Kink",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "DRS全開区間。"
      },
      {
        "number": "T7",
        "name": "Memorial Corner (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "最大のオーバーテイクポイント。"
      },
      {
        "number": "T8",
        "name": "Stamford (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "市街地直角ターン。"
      },
      {
        "number": "T9",
        "name": "City Hall (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "市庁舎前の左。"
      },
      {
        "number": "T10",
        "name": "Padang Sweeper",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "パダン広場沿いの左。"
      },
      {
        "number": "T11",
        "name": "Singapore Sling 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "かつてのシケイン跡地。"
      },
      {
        "number": "T12",
        "name": "Anderson Bridge 進入",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "歴史ある橋を渡る極狭セクション。"
      },
      {
        "number": "T13",
        "name": "Fullerton Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "橋を出た直後の急減速ヘアピン。"
      },
      {
        "number": "T14",
        "name": "Esplanade (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "新ストレート区間へ向かう直角右。"
      },
      {
        "number": "T15",
        "name": "New Straight Kink",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "2023年新設の全開直線。"
      },
      {
        "number": "T16",
        "name": "Marina Bay Chicane 進入",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "新設シケイン進入。"
      },
      {
        "number": "T17",
        "name": "Marina Bay Chicane 脱出",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "縁石を跨ぐ。"
      },
      {
        "number": "T18",
        "name": "Grandstand Left",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "観客席前の左。"
      },
      {
        "number": "T19",
        "name": "Final Corner Left",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "メインストレートへ接続する最終左。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2008,
        "title": "初開催ナイトレースと「クラッシュゲート」事件",
        "description": "ルノーのピケJr.が故意にクラッシュしセーフティカーを導入させ、僚友フェルナンド・アロンソが逆転優勝。",
        "detailedStory": "F1初の夜間レース。ルノー首脳陣の謀略により、ピケJr.が指示通りターン17で単独クラッシュ。直前にピットインしていたアロンソがSC導入によりトップへ浮上し優勝。翌年に不正が告発され、ブリアトーレが追放されるF1史上最大の不正スキャンダルとなった。",
        "significance": "モータースポーツの統治構造と公正性を揺るがした世紀の大事件。"
      },
      {
        "year": 2017,
        "title": "雨のスタート、フェラーリ同士討ちと王座の暗転",
        "description": "雨のスタート直後、ポールシッターのベッテル、ライコネン、フェルスタッペンが3重激突し1周目に全滅。",
        "detailedStory": "タイトル争いの天王山。スタート直後、インから好発進したライコネンとフェルスタッペン、アウトからブロックしたベッテルが接触。フェラーリ2台が粉砕しリタイア。後方スタートのハミルトンが棚ぼたの勝利を飾り、選手権を決定づけた。",
        "significance": "2017年タイトル争いの趨勢を決定づけた伝説のスタートクラッシュ。"
      },
      {
        "year": 2023,
        "title": "サインツ、DRSトレイン戦略によるレッドブル全勝阻止",
        "description": "カルロス・サインツが後続のノリスに故意にDRSを与え続け、猛追するメルセデス勢を封じ込めて優勝。",
        "detailedStory": "レッドブルのシーズン全勝記録がかかった一戦。ポールから首位を走るサインツは、終盤に新品タイヤで猛追するラッセルとハミルトンを防ぐため、2位のノリスをあえて1秒以内に留めてDRSを与え、自らの盾とする天才的頭脳プレイを展開。シーズン唯一の非レッドブル勝利を飾った。",
        "significance": "「スムーズ・オペレーター」サインツの戦術的最高傑作。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "低速コーナーのトラクションと制動力を最大化するためモナコ並みのマックス・ダウンフォース。",
      "kerbUsage": "市街地のうねりとマンホール、縁石に対応する柔軟なサスペンション。",
      "brakeDemands": "23箇所（改修後19箇所）の減速の連続でカレンダー中最も過酷なブレーキ負荷。冷却が最重要課題。"
    },
    "references": [
      {
        "id": 1,
        "title": "Marina Bay Street Circuit Environmental Factors and Lighting Engineering",
        "publisher": "Singapore GP Pte Ltd",
        "url": "https://singaporegp.sg",
        "verifiedDate": "2024-09-18"
      },
      {
        "id": 2,
        "title": "Driver Thermal Stress and Hydration Degradation under Tropical Night Race Conditions",
        "publisher": "FIA Medical Commission",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-09-20"
      }
    ]
  },
  {
    "id": "cota",
    "name": "サーキット・オブ・ジ・アメリカズ（オースティン）",
    "officialName": "Circuit of the Americas",
    "country": "アメリカ 🇺🇸",
    "lengthKm": 5.513,
    "turns": 20,
    "drsZones": 2,
    "downforceLevel": "High",
    "tyreStress": "High",
    "typicalPitLossSec": 20,
    "safetyCarProbability": "55% (中程度)",
    "undercutImpact": "大（高低差と複合コーナーによるタイヤデグラデーション大）",
    "lapRecord": {
      "time": "1:36.169",
      "driver": "Charles Leclerc (Ferrari)",
      "year": 2019
    },
    "characteristics": "【第1章：高低差41mの急坂クライムと世界のアイコニックコーナー融合】\\nヘルマン・ティルケが設計し、2012年に誕生したアメリカ・モータースポーツの近代の殿堂 [1][5]。ホームストレートエンドに待ち構える「高低差41メートルの急勾配を駆け上がるブラインドのターン1ヘアピン」は、進入時の視野が完全に遮られるスリリングなパッシングステージ [1][2]。\\n\\n【第2章：シルバーストンとホッケンハイムのオマージュ】\\nセクター1のターン3からターン6はシルバーストンのマゴッツ〜ベケッツ、セクター3はホッケンハイムのスタジアムセクションを再現した複合テクニカルレイアウト [2][3]。テキサスの粘土質土壌による路面のバンプ（起伏・段差）が激しく、グラウンドエフェクトカーのスキッドブロック摩耗やフロア損傷を防ぐライドハイト管理が極めてシビアとなる [2][4][6]。",
    "officialLinks": {
          "website": "https://circuitoftheamericas.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/united-states.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+of+the+Americas",
          "xTwitter": "https://x.com/COTA",
          "instagram": "https://www.instagram.com/cota_official/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_cota.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_aerial.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_cota.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_aerial.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_cota.jpg",
        "caption": "急勾配のターン1ヒルと特徴的な観測タワーを望むCOTAのパノラマ",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_aerial.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_cota.jpg",
        "caption": "急勾配のターン1ヒルと特徴的な観測タワーを望むCOTAのパノラマ",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_aerial.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 41,
      "longestStraightMeters": 1200,
      "gForceMax": {
        "lateral": 4.7,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Turn 1 Hill",
          "characteristic": "高低差41mを一気に駆け上がる超ワイドなブラインドヘアピン。"
        },
        {
          "number": "T3-T6",
          "name": "Esses Section",
          "characteristic": "シルバーストンに着想を得た時速250km/h超の連続切り返しS字。"
        },
        {
          "number": "T16-T18",
          "name": "Multi-Apex Carousel",
          "characteristic": "イスタンブールT8を模した観測タワー下の超ロング複合トリプル右コーナー。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 Hill (上りヘアピン)",
        "gearEstimated": "2nd",
        "speedEstimated": "80 km/h",
        "engineeringTip": "41mの上り坂。登坂抵抗によりブレーキを奥まで遅らせられるが、頂上でのイン側ロックに注意。"
      },
      {
        "number": "T2",
        "name": "Downhill Acceleration",
        "gearEstimated": "4th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "下りながら右へ加速。S字へのリズムの起点。"
      },
      {
        "number": "T3",
        "name": "Esses 1 右",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "高速S字進入。強烈な横G。"
      },
      {
        "number": "T4",
        "name": "Esses 2 左",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "素早いステアリング切り返し。"
      },
      {
        "number": "T5",
        "name": "Esses 3 右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "縁石を舐めるようにアタック。"
      },
      {
        "number": "T6",
        "name": "Esses 4 左",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "徐々にタイトになる切り返し。"
      },
      {
        "number": "T7",
        "name": "Esses 5 右",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "コンプレッション。"
      },
      {
        "number": "T8",
        "name": "Esses Exit 左",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "脱出ラインをキープ。"
      },
      {
        "number": "T9",
        "name": "Blind Crest Left",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "丘の頂上のブラインド左。"
      },
      {
        "number": "T10",
        "name": "Downhill Left Sweep",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "下り全開左。"
      },
      {
        "number": "T11",
        "name": "Hairpin Left",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "1.2kmバックストレートへ接続する最重要ヘアピン。立ち上がりトラクションが命。"
      },
      {
        "number": "T12",
        "name": "Back Straight Braking Left",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "335km/hからのヘビーブレーキング。パッシングの要所。"
      },
      {
        "number": "T13",
        "name": "Infield Right",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "スタジアムセクション進入。"
      },
      {
        "number": "T14",
        "name": "Infield Right Transition",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "中速右。"
      },
      {
        "number": "T15",
        "name": "Hairpin Left",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "タイトな低速左。"
      },
      {
        "number": "T16",
        "name": "Carousel 1st Apex",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "観測タワー下トリプルエイペックスの右進入。"
      },
      {
        "number": "T17",
        "name": "Carousel 2nd Apex",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "横Gが4.5Gに達する右持続旋回。"
      },
      {
        "number": "T18",
        "name": "Carousel 3rd Apex",
        "gearEstimated": "5th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "全開で抜けるタワー下の右出口。"
      },
      {
        "number": "T19",
        "name": "Downhill Left",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "下りながらの左。トラックリミット注意。"
      },
      {
        "number": "T20",
        "name": "Final Left",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "メインストレートへの最終加速左。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2012,
        "title": "ハミルトン、ベッテルとの一騎打ちを制しCOTA初王者に",
        "description": "マクラーレン最後の年となったハミルトンが、バックストレートでベッテルを劇的オーバーテイクして初開催を勝利。",
        "detailedStory": "新設されたオースティンでの初レース。タイトルへ驀進するレッドブルのベッテルを追うハミルトン。周回遅れのトラフィックを突いて42周目のバックストレートでDRSを使い鮮やかに抜き去り、アメリカでの無類の強さを見せつけた。",
        "significance": "アメリカGP復活の記念すべきオープニング勝利。"
      },
      {
        "year": 2018,
        "title": "キミ・ライコネン、フェラーリでの感動のキャリア最後（21勝目）の勝利",
        "description": "フェラーリのライコネンが113戦ぶりの勝利を達成。フェルスタッペンとハミルトンの追撃を完璧に封じ込める。",
        "detailedStory": "スタートでハミルトンを交わして首位に立ったライコネン。タイヤ戦略が分かれる中、終盤に背後へ迫るフェルスタッペンとハミルトンとの三つ巴の死闘を冷静沈着なドライビングで凌ぎ切り、2013年開幕戦以来となる涙の通算21勝目を飾った。",
        "significance": "「アイスマン」ライコネンのF1キャリア最後の感動的勝利。"
      },
      {
        "year": 2021,
        "title": "フェルスタッペン対ハミルトン、0.7秒差のテキサス決戦",
        "description": "レッドブルの積極的なアンダーカット戦略に対し、終盤ハミルトンが怒涛の追い上げを見せるもフェルスタッペンが0.7秒差で死守。",
        "detailedStory": "14万人の大観衆が見守る中、歴史的タイトル争いがテキサスで激突。2ストップのアンダーカットで先行したフェルスタッペン。フレッシュタイヤで迫るハミルトン。ラストラップまで息の詰まる追撃戦が展開され、フェルスタッペンが薄氷の勝利を掴み取った。",
        "significance": "2021年シーズンの壮絶さを象徴する近代屈指の名勝負。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "セクター1のS字での高速安定性とセクター3のカルーセルに対応するためハイダウンフォースが有利。",
      "kerbUsage": "バンプ（路面のうねり）が非常に多いサーキット。車高を落としすぎるとフロアを破損するためライドハイトの余裕が必要。",
      "brakeDemands": "ターン1とターン12での激しい減速。特にターン1は上り勾配を利用できるがターン12は平坦からの急制動。"
    },
    "references": [
      {
        "id": 1,
        "title": "Circuit of the Americas Engineering and Topographical Features",
        "publisher": "Tilke Engineers & Architects",
        "url": "https://tilke.de",
        "verifiedDate": "2024-10-15"
      },
      {
        "id": 2,
        "title": "Ground Effect Porpoising and Bump Compliance at COTA",
        "publisher": "Formula 1 Technical Analysis",
        "url": "https://www.formula1.com",
        "verifiedDate": "2024-10-18"
      }
    ]
  },
  {
    "id": "mexico",
    "name": "エルマノス・ロドリゲス・サーキット（メキシコシティ）",
    "officialName": "Autódromo Hermanos Rodríguez",
    "country": "メキシコ 🇲🇽",
    "lengthKm": 4.304,
    "turns": 17,
    "drsZones": 3,
    "downforceLevel": "High",
    "tyreStress": "Low",
    "typicalPitLossSec": 22.5,
    "safetyCarProbability": "60% (中程度)",
    "undercutImpact": "中程度（オーバーヒート対策が最優先）",
    "lapRecord": {
      "time": "1:17.774",
      "driver": "Valtteri Bottas (Mercedes)",
      "year": 2021
    },
    "characteristics": "【第1章：標高2,285mの希薄な大気と最高速360km/hのパラドックス】\\nメキシコシティの海抜2,285メートルという高地に位置し、大気圧が平地の約78%（0.78気圧）しかないF1唯一無二のウルトラハイアルティチュードサーキット [1][5]。空気が極端に薄いため、各チームはモナコ並みの最大ダウンフォースウィングを装着しても、空気抵抗はモンツァ並みに低減し、メインストレートでは時速360km/hに迫る超高トップスピードを記録する [1][2]。\\n\\n【第2章：冷却不足の危機と熱狂の野球場「フォロ・ソル」】\\n希薄な大気はエンジン、ターボ、ブレーキの冷却効率を著しく低下させ、オーバーヒート対策が最大のエンジニアリング課題となる [2][4]。終盤のセクター3には、かつての野球スタジアムのグランドをコースが貫通する名物「フォロ・ソル（Foro Sol）」セクションがあり、3万人を超える大観衆の熱狂的な歓声に包まれながら低速シケインを駆け抜ける世界屈指のスペクタクルを誇る [1][3][6]。",
    "officialLinks": {
          "website": "https://www.mexicogp.mx/",
          "f1Official": "https://www.formula1.com/en/racing/2026/mexico.html",
          "googleMaps": "https://maps.google.com/?q=Autodromo+Hermanos+Rodriguez",
          "xTwitter": "https://x.com/mexicogp",
          "instagram": "https://www.instagram.com/mexicogp/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_mexico.png",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Hermanos_Rodriguez_stadium.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_mexico.png",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Hermanos_Rodriguez_stadium.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_mexico.png",
        "caption": "旧野球場フォロ・ソルの巨大スタジアムを駆け抜けるメキシコGPの名物セクション",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Hermanos_Rodriguez_stadium.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_mexico.png",
        "caption": "旧野球場フォロ・ソルの巨大スタジアムを駆け抜けるメキシコGPの名物セクション",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Hermanos_Rodriguez_stadium.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 2.8,
      "longestStraightMeters": 1200,
      "gForceMax": {
        "lateral": 3.8,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1-T3",
          "name": "Moisés Solana Chicane",
          "characteristic": "1.2kmストレートから360km/hで突入する最初の減速シケイン。"
        },
        {
          "number": "T7-T11",
          "name": "Esses Section",
          "characteristic": "薄い空気の中でグリップが希薄な高速切り返しS字。"
        },
        {
          "number": "T12-T16",
          "name": "Foro Sol Stadium",
          "characteristic": "4万人収容のスタジアム内を通過する極低速セクション。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Moisés Solana 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "360km/hからのヘビーブレーキング。空気が薄いため制動距離が伸びる。"
      },
      {
        "number": "T2",
        "name": "Moisés Solana 左",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "左フリック。"
      },
      {
        "number": "T3",
        "name": "Moisés Solana 脱出右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "第2ストレートへの立ち上がり。"
      },
      {
        "number": "T4",
        "name": "Turn 4 進入左",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "第2ストレートエンドの90度左。"
      },
      {
        "number": "T5",
        "name": "Turn 5 右",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "右直角ターン。"
      },
      {
        "number": "T6",
        "name": "Hairpin Right",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "タイトなヘアピン。S字への加速ラインを確保。"
      },
      {
        "number": "T7",
        "name": "Esses 進入左",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "高速S字突入。薄い空気によるダウンフォース不足でマシンが滑りやすい。"
      },
      {
        "number": "T8",
        "name": "Esses 右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "素早いステアリング切り返し。"
      },
      {
        "number": "T9",
        "name": "Esses 左",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "イン側の縁石をなぞる。"
      },
      {
        "number": "T10",
        "name": "Esses 右",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "外側に流されないようコントロール。"
      },
      {
        "number": "T11",
        "name": "Esses Exit 左",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "スタジアムへ向かう直線への脱出。"
      },
      {
        "number": "T12",
        "name": "Foro Sol 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "4万人の大歓声が響くスタジアムセクションへの突入。"
      },
      {
        "number": "T13",
        "name": "Stadium Hairpin 左",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "スタンドに囲まれた極低速ヘアピン。"
      },
      {
        "number": "T14",
        "name": "Stadium 右",
        "gearEstimated": "2nd",
        "speedEstimated": "80 km/h",
        "engineeringTip": "スタジアム内低速ターン。"
      },
      {
        "number": "T15",
        "name": "Stadium 左",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "スタジアム脱出へ向けた切り返し。"
      },
      {
        "number": "T16",
        "name": "Mansell Curve 進入",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "かつての超高速ペラルターダ後半部分。"
      },
      {
        "number": "T17",
        "name": "Mansell Curve 脱出",
        "gearEstimated": "4th ➔ 7th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "1.2kmメインストレートへの全開加速。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1990,
        "title": "マンセル、ペラルターダ外側からの伝説のオーバーテイク",
        "description": "ナイジェル・マンセルが命知らずの超高速バンクコーナー「ペラルターダ」の外側からベルガーを抜き去りフェラーリ1-2。",
        "detailedStory": "当時F1屈指の超危険コーナーだったペラルターダ。ファイナルラップ直前、マンセルは時速270km/h超のバンク外側にマシンを振り、誰もが不可能と信じたアウト側からのパッシングを成功させた。モータースポーツ史に刻まれる伝説の瞬間。",
        "significance": "「大英帝国の荒鷲」マンセルの最も勇敢なオーバーテイク。"
      },
      {
        "year": 2017,
        "title": "ハミルトン、パンクを乗り越え4度目のワールドチャンピオン",
        "description": "1周目にフェルスタッペン、ベッテルと接触し最後尾まで落ちるも、9位まで挽回してタイトルを獲得。",
        "detailedStory": "スタート直後のターン3でベッテルのフロントウィングとハミルトンの右リアが接触。タイヤがバーストし最後尾に転落したハミルトン。執念のドライビングでポイント圏内まで挽回し、自身4度目となるドライバーズ世界王者をメキシコで確定させた。",
        "significance": "ハミルトンの偉大なキャリアにおける王座防衛の記念碑。"
      },
      {
        "year": 2021,
        "title": "フェルスタッペンのターン1大外狩りとペレスの母国表彰台",
        "description": "3番手スタートのフェルスタッペンがターン1でメルセデス2台をアウトから一網打尽。セルジオ・ペレスがメキシコ人初の母国表彰台。",
        "detailedStory": "1.2kmストレートのスリップストリームを活かし、1コーナー手前でメルセデス2台のアウト側へ飛び込んだフェルスタッペン。完璧なブレーキングでトップを奪い独走勝利。チームメイトのペレスも3位でチェッカーを受け、スタジアムは歓喜のフィエスタと化した。",
        "significance": "ペレスの母国英雄伝説とフェルスタッペンの神業スタート。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "空気が薄いため最大ウイングを装着してもドラッグが小さく、ダウンフォース不足に悩まされる。クーリング開口部を最大化。",
      "kerbUsage": "スタジアム内やシケインの縁石は低め。マシンを跳ねさせずにスムーズに旋回。",
      "brakeDemands": "空気密度が低いためブレーキダクトの空気流入量が25%減少し、ブレーキ冷却が極めて過酷。ディスクの熱酸化に警戒。"
    },
    "references": [
      {
        "id": 1,
        "title": "High Altitude Aerodynamic and Engine Performance Analysis at Mexico City",
        "publisher": "Honda Racing & FIA Technical Working Group",
        "url": "https://honda.racing",
        "verifiedDate": "2024-10-25"
      },
      {
        "id": 2,
        "title": "Thermal Management of Turbochargers and Brake Friction at 2,285m Altitude",
        "publisher": "Brembo Racing Technical Insights",
        "url": "https://www.brembo.com",
        "verifiedDate": "2024-10-28"
      }
    ]
  },
  {
    "id": "interlagos",
    "name": "インテルラゴス・サーキット（ホセ・カルロス・パーチェ）",
    "officialName": "Autódromo José Carlos Pace (Interlagos)",
    "country": "ブラジル 🇧🇷",
    "lengthKm": 4.309,
    "turns": 15,
    "drsZones": 2,
    "downforceLevel": "Medium-High",
    "tyreStress": "High",
    "typicalPitLossSec": 21,
    "safetyCarProbability": "70% (高)",
    "undercutImpact": "大（高低差と天候急変により戦略の柔軟性が勝負を決める）",
    "lapRecord": {
      "time": "1:10.540",
      "driver": "Valtteri Bottas (Mercedes)",
      "year": 2018
    },
    "characteristics": "【第1章：反時計回りの起伏とアイルトン・セナの魂が宿る聖地】\\nブラジル・サンパウロのすり鉢状の天然盆地に位置し、海抜約800メートルの高地を反時計回り（反時計回りコースは首の筋肉への負担が極端に高い）に疾走する伝統のインテルラゴス [1][5]。名物コーナー「エス・ド・セナ（Senna S: Turns 1-2）」は、下り勾配でブラインドとなる右から左への切り返しであり、激しいブレーキングバトルが展開される世界屈指のパッシングポイント [1][2]。\\n\\n【第2章：急変する天候とドラマティックな最終セクター】\\n熱帯特有のスコールが突如襲来し、数分でドライから豪雨へと急変する気象ドラマが数々のタイトル決定戦（2008年ハミルトン最終周逆転戴冠、2012年ベッテル最後尾からの3冠戴冠など）を生んできた [1][3]。セクター2の低速テクニカル区間でのトラクションと、ターン12（フンサオ）から登り坂を駆け上がる超高速全開セクター3での最高速という相反する空力セッティングの妥協が鍵となる [2][4][6]。",
    "officialLinks": {
          "website": "https://f1saopaulo.com.br/",
          "f1Official": "https://www.formula1.com/en/racing/2026/brazil.html",
          "googleMaps": "https://maps.google.com/?q=Autodromo+Jose+Carlos+Pace",
          "xTwitter": "https://x.com/f1saopaulo",
          "instagram": "https://www.instagram.com/f1saopaulo/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_interlagos.png",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Jose_Carlos_Pace_Senna_S.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_interlagos.png",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Jose_Carlos_Pace_Senna_S.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_interlagos.png",
        "caption": "急勾配を下る名物「エス・ド・セナ」とサンパウロの摩天楼風景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Jose_Carlos_Pace_Senna_S.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_interlagos.png",
        "caption": "急勾配を下る名物「エス・ド・セナ」とサンパウロの摩天楼風景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Jose_Carlos_Pace_Senna_S.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 43,
      "longestStraightMeters": 650,
      "gForceMax": {
        "lateral": 4.5,
        "longitudinal": 4.7
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Senna 'S'",
          "characteristic": "急坂を一気に下りながら左から右へ切り返す大興奮の1コーナー。"
        },
        {
          "number": "T4",
          "name": "Descida do Lago",
          "characteristic": "バックストレートエンドの急減速下り左。パッシング多発。"
        },
        {
          "number": "T12",
          "name": "Junção",
          "characteristic": "長い上り坂メインストレートへ突入するための最重要左コーナー。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Senna S 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "急勾配を下りながら飛び込む左。インをカットして右へのラインを作る。"
      },
      {
        "number": "T2",
        "name": "Senna S 切り返し右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "下りの底での強烈な荷重移動。リアタイヤのトラクションを確保。"
      },
      {
        "number": "T3",
        "name": "Curva do Sol",
        "gearEstimated": "4th ➔ 6th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "レタ・オポスタへ向かう全開左ロングコーナー。"
      },
      {
        "number": "T4",
        "name": "Descida do Lago",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "下りながらハードブレーキングする左。オーバーテイクの要衝。"
      },
      {
        "number": "T5",
        "name": "Lago Exit Left",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "インフィールドへ向けた加速。"
      },
      {
        "number": "T6",
        "name": "Ferradura 1",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "上り坂の高速右。"
      },
      {
        "number": "T7",
        "name": "Ferradura 2",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "高速右エイペックス。"
      },
      {
        "number": "T8",
        "name": "Laranjinha",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "上りながら回り込むブラインド右。"
      },
      {
        "number": "T9",
        "name": "Pinheirinho",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "下りオフキャンバーの低速左。アンダーステア警戒。"
      },
      {
        "number": "T10",
        "name": "Bico de Pato",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "「アヒルのクチバシ」と呼ばれる急減速右ヘアピン。"
      },
      {
        "number": "T11",
        "name": "Mergulho",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "下り高速左。"
      },
      {
        "number": "T12",
        "name": "Junção",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "急勾配の上り坂ストレートへの脱出速度を決める最重要左コーナー。"
      },
      {
        "number": "T13",
        "name": "Subida dos Boxes",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "ピット入口横の急勾配を全開で駆け上がる。"
      },
      {
        "number": "T14",
        "name": "Arquibancadas (バンク左)",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "グランドスタンド前の左全開バンク。"
      },
      {
        "number": "T15",
        "name": "Straight Launch Bend",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "ゴールラインへ向かう全開ベンド。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2008,
        "title": "ハミルトン、最終コーナーでの劇的初タイトル獲得",
        "description": "マッサがトップチェッカーを受けフェラーリが歓喜に沸く中、最終周の最終コーナーでハミルトンがグロックを抜き5位に入り王座獲得。",
        "detailedStory": "大雨が降り始めた最終盤。マッサが完璧なポール・トゥ・ウィンを飾り、マッサ陣営がタイトル獲得を祝っていたその時、ドライタイヤで走っていたグロックをハミルトンが最終コーナー手前でオーバーテイク。わずか1ポイント差でハミルトンが初の世界チャンピオンとなった。",
        "significance": "F1史上最もドラマチックなタイトル決定戦の結末。"
      },
      {
        "year": 1991,
        "title": "アイルトン・セナ、母国初勝利とギアボックストラブルの奇跡",
        "description": "レース終盤にギアが6速に固定される絶体絶命の危機の中、全身の痙攣に耐えながら母国ブラジルで悲願の初優勝。",
        "detailedStory": "母国優勝を渇望していたセナ。残り周回でトランスミッションが壊れ6速のみでの走行を強いられる。雨の中、エンジンストール寸前の状態でマシンを走らせ続け、首位でチェッカー。肉体の限界を超えたセナは無線で絶叫し、表彰台でトロフィーを掲げることも困難なほどの疲労を見せた。",
        "significance": "セナ伝説の頂点に位置する不滅の名勝負。"
      },
      {
        "year": 2012,
        "title": "雨のインテルラゴス、ベッテルの最後尾からの3連覇",
        "description": "1周目に追突され最後尾まで落ちたセバスチャン・ベッテルが、驚異的な追い上げで6位に入りアロンソを3点差で退けて3連覇達成。",
        "detailedStory": "雨の最終戦。スタート直後のターン4で接触しスピン、最後尾に転落したベッテル。マシンにダメージを負いながらも無線故障やピット混乱を乗り越えて6位まで猛追。2位のアロンソをわずか3ポイント差で上回り、史上最年少での3年連続世界王者に輝いた。",
        "significance": "近代F1屈指の壮絶なチャンピオンシップ決定戦。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "インフィールドのテクニカル区間と、急勾配の上り坂メインストレートでの最高速の兼ね合い。ミディアムハイセッティング。",
      "kerbUsage": "セナSやメルグーリョの縁石はアグレッシブに攻められるが、急勾配での底打ちに注意。",
      "brakeDemands": "ターン1とターン4でのフルブレーキング。反時計回りコースのためドライバーの首（左側筋肉）に極端な疲労がかかる。"
    },
    "references": [
      {
        "id": 1,
        "title": "Topographical Dynamics and Anti-Clockwise Demands at Interlagos",
        "publisher": "Confederação Brasileira de Automobilismo",
        "url": "https://www.cba.org.br",
        "verifiedDate": "2024-11-01"
      },
      {
        "id": 2,
        "title": "Weather Instability and Strategic Adaptability at Brazilian Grand Prix",
        "publisher": "FIA Formula One Technical Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-11-03"
      }
    ]
  },
  {
    "id": "las-vegas",
    "name": "ラスベガス・ストリップ・サーキット",
    "officialName": "Las Vegas Strip Circuit",
    "country": "アメリカ 🇺🇸",
    "lengthKm": 6.201,
    "turns": 17,
    "drsZones": 2,
    "downforceLevel": "Low",
    "tyreStress": "Low",
    "typicalPitLossSec": 20.8,
    "safetyCarProbability": "65% (高)",
    "undercutImpact": "中程度（低温タイヤウォームアップが最大のハードル）",
    "lapRecord": {
      "time": "1:35.490",
      "driver": "Oscar Piastri (McLaren)",
      "year": 2023
    },
    "characteristics": "【第1章：夜のラスベガス・ストリップを350km/hで疾走する究極の非日常】\\n世界最大のエンターテインメント都市ラスベガスの大通り（ストリップ）を完全封鎖して開催される土曜深夜の超高速ナイトレース [1][5]。ベラージオの噴水やシーザーズ・パレス、巨大球体スクリーン「スフィア」の極彩色のネオンを背景に、全長1.9kmに及ぶストレートを時速350km/h超でマシンが駆け抜ける [1][2]。\\n\\n【第2章：気温10℃前後の極冷路面とタイヤウォームアップの極限】\\n砂漠気候の11月深夜に開催されるため、路面温度が15℃以下、時にはシングルデジットまで冷え込む [1][3]。超低ダウンフォースウィングでストレートを疾走した直後のターン14ハードブレーキングでは、冷え切ったタイヤの表面が摩擦熱を持たずに破断する「コールド・グレイニング」が多発 [2][4]。タイヤをいかに作動温度領域（ウインドウ）に留め続けるかが勝負の絶対条件となる [2][3][6]。",
    "officialLinks": {
          "website": "https://www.f1lasvegasgp.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/las-vegas.html",
          "googleMaps": "https://maps.google.com/?q=Las+Vegas+Strip+Circuit",
          "xTwitter": "https://x.com/F1LasVegas",
          "instagram": "https://www.instagram.com/f1lasvegas/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_las_vegas.png",
      "credit": "Formula 1",
      "license": "CC BY-SA 4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_Circuit.png"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_las_vegas.png",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_Circuit.png"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_las_vegas.png",
        "caption": "ネオン輝くラスベガス・ストリップ通りを駆け抜ける超高速ストリートサーキット",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_Circuit.png"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_las_vegas.png",
        "caption": "ネオン輝くラスベガス・ストリップ通りを駆け抜ける超高速ストリートサーキット",
        "tag": "Atmosphere",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_Circuit.png"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 4,
      "longestStraightMeters": 1900,
      "gForceMax": {
        "lateral": 3.7,
        "longitudinal": 5
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Turn 1 Hairpin",
          "characteristic": "スタート直後の急減速タイト左。混乱多発地点。"
        },
        {
          "number": "T5-T9",
          "name": "Sphere Section",
          "characteristic": "巨大球体施設スフィアを取り囲むテクニカル複合コーナー。"
        },
        {
          "number": "T14",
          "name": "Harmon Chicane",
          "characteristic": "1.9kmストリップ全開直後の超ハードブレーキング。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 Hairpin 左",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "ピット直線から急減速。低温路面でのフロントロックアップに細心の注意。"
      },
      {
        "number": "T2",
        "name": "Turn 2 右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "コーバル・レーンへ向かう加速右。"
      },
      {
        "number": "T3",
        "name": "Koval Kink",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "左ベンド。"
      },
      {
        "number": "T4",
        "name": "Turn 4 (90度右)",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "スフィアへ向かう直角右。"
      },
      {
        "number": "T5",
        "name": "Sphere Entry 左",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "巨大スフィアを望む複合セクション進入。"
      },
      {
        "number": "T6",
        "name": "Sphere Carousel 左",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "長い左旋回。"
      },
      {
        "number": "T7",
        "name": "Sphere Switchback 右",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "鋭い切り返し。"
      },
      {
        "number": "T8",
        "name": "Sphere Exit 右",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "サンズ・アベニューへ抜ける。"
      },
      {
        "number": "T9",
        "name": "Sands Ave 左",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "ストリップ手前の加速。"
      },
      {
        "number": "T10",
        "name": "Sands Sweep",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "全開で抜ける高速ベンド。"
      },
      {
        "number": "T11",
        "name": "Sands Kink",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "ストリップ突入前の左キンク。"
      },
      {
        "number": "T12",
        "name": "Turn 12 (ストリップ合流左)",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "1.9kmのラスベガス・ストリップ大通りへ飛び出す重要左ターン。"
      },
      {
        "number": "T13",
        "name": "The Strip Blast",
        "gearEstimated": "8th",
        "speedEstimated": "350 km/h",
        "engineeringTip": "ベラージオ前を350km/hで駆け抜ける壮大な全開ストレート。"
      },
      {
        "number": "T14",
        "name": "Harmon Chicane 進入左",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "350km/hからのヘビーブレーキング。最大のパッシングポイント。"
      },
      {
        "number": "T15",
        "name": "Harmon Chicane 右",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "縁石を跨ぐ。"
      },
      {
        "number": "T16",
        "name": "Harmon Exit 左",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "最終直線へ向けた加速。"
      },
      {
        "number": "T17",
        "name": "Final Corner",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "メインストレートへ接続する高速左。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2023,
        "title": "ルクレール、ペレス、フェルスタッペンの深夜の大激闘",
        "description": "初開催のラスベガスGPで、フェルスタッペンがペナルティと接触を跳ね返して優勝。ルクレールが最終周にペレスを逆転。",
        "detailedStory": "ネオン輝く深夜23時スタート。1周目にフェルスタッペンがルクレールを押し出して5秒ペナルティを受け、さらにラッセルとの接触でダメージを負うも驚異の追い上げで首位を奪還。ファイナルラップのターン14でルクレールがペレスに猛烈な飛び込みを決め2位をもぎ取った。",
        "significance": "莫大なエンターテインメント演出と純粋なレースの興奮が融合した名勝負。"
      },
      {
        "year": 2023,
        "title": "FP1のマンホール枠事故とサインツの不運",
        "description": "走行開始わずか8分後、カルロス・サインツのマシンが緩んだマンホールの蓋を跳ね上げフロアが粉砕。",
        "detailedStory": "グランドエフェクトカーの強烈なフロア吸入負圧により、ストリップ上のマンホール枠が外れサインツのフェラーリを直撃。シャシーとバッテリーが破壊され赤旗中止に。サインツは被害者でありながらパーツ交換ペナルティを科され、物議を醸した。",
        "significance": "公道サーキットにおけるグラウンドエフェクトカーの特殊な危険性を証明。"
      },
      {
        "year": 2024,
        "title": "ラスベガスでのタイトル決定戦",
        "description": "冷え切ったストリップの夜空の下、フェルスタッペンが安定した走りで年間ドライバーズ王座を4連覇。",
        "detailedStory": "砂漠の深夜の冷え込みの中、タイヤ温度管理に各車が苦戦する中、レッドブルのフェルスタッペンが巧みなレース運びで5位に入り、ライバルのノリスを抑えて4年連続のドライバーズタイトルをラスベガスで決定づけた。",
        "significance": "エンターテインメントの首都で決着した歴史的戴冠劇。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "1.9kmのストリップでの直線スピードが必須のためモンツァ級のローダウンフォースが標準。",
      "kerbUsage": "市街地のアスファルトの継ぎ目とマンホールに注意。サスペンションストロークを適度に確保。",
      "brakeDemands": "寒冷気温（路面温度15℃前後）と長大な直線によりブレーキとタイヤが急冷。ブレーキング時のタイヤロックアップ対策が最重要。"
    },
    "references": [
      {
        "id": 1,
        "title": "Las Vegas Strip Circuit Civil Engineering and Surface Preparation",
        "publisher": "Formula 1 Las Vegas Grand Prix Operations",
        "url": "https://www.f1lasvegasgp.com",
        "verifiedDate": "2023-11-20"
      },
      {
        "id": 2,
        "title": "Cold Ambient Temperature Tyre Grain Dynamics in Street Circuits",
        "publisher": "Pirelli Motorsport Technical Review",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2023-11-22"
      }
    ]
  },
  {
    "id": "losail",
    "name": "ルサイル・インターナショナル・サーキット",
    "officialName": "Lusail International Circuit",
    "country": "カタール 🇶🇦",
    "lengthKm": 5.419,
    "turns": 16,
    "drsZones": 1,
    "downforceLevel": "High",
    "tyreStress": "Very High",
    "typicalPitLossSec": 24,
    "safetyCarProbability": "40% (中低)",
    "undercutImpact": "大（高横Gによるタイヤ摩耗が著しくフレッシュタイヤの恩恵大）",
    "lapRecord": {
      "time": "1:24.319",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2023
    },
    "characteristics": "【第1章：MotoGP譲りの流麗な中高速コーナーと息もつかせぬ横G】\\nカタール・ドーハ近郊の砂漠に広がる完全照明のナイトレースサーキット [1][5]。元来2輪ロードレースの聖地として設計されたため、ストップ＆ゴーの急減速コーナーがほとんどなく、流れるような中高速コーナー（ターン12〜14の3連続スウィーパー）が延々と続く [1][2]。休む場所が一切ないレイアウトにより、ドライバーには連続して4Gから5Gに達する強烈な横Gが加わり続ける [2][4]。\\n\\n【第2章：ピレリタイヤへの最大級負荷と強制スティント制限の衝撃】\\n高速コーナーで縁石に乗る際の高周波振動と巨大なダウンフォース荷重により、2023年にはタイヤ内部構造剥離の懸念から「1セット最大18周」というF1史上異例の強制周回数制限がFIAから発令された [1][3]。マシンには完璧な高ダウンフォースバランスと、ドライバーには過酷な高温多湿に耐え抜く強靭なフィジカルが要求される [2][3][6]。",
    "officialLinks": {
          "website": "https://www.lcsc.qa/",
          "f1Official": "https://www.formula1.com/en/racing/2026/qatar.html",
          "googleMaps": "https://maps.google.com/?q=Lusail+International+Circuit",
          "xTwitter": "https://x.com/lusailcircuit",
          "instagram": "https://www.instagram.com/lusailcircuit/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_losail.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lusail_International_Circuit.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_losail.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lusail_International_Circuit.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_losail.jpg",
        "caption": "強力なナイトレース照明に照らされるルサイル・サーキットのホームストレート",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lusail_International_Circuit.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_losail.jpg",
        "caption": "強力なナイトレース照明に照らされるルサイル・サーキットのホームストレート",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lusail_International_Circuit.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 5.5,
      "longestStraightMeters": 1068,
      "gForceMax": {
        "lateral": 5.1,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Turn 1",
          "characteristic": "1kmメインストレートからのヘビーブレーキング右コーナー。"
        },
        {
          "number": "T12-T14",
          "name": "Triple Apex Right",
          "characteristic": "時速250km/h超で5Gの横Gが数秒間持続する世界最凶のトリプルエイペックス。"
        },
        {
          "number": "T16",
          "name": "Final Corner",
          "characteristic": "メインストレートへ接続する高速立ち上がり右。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 右",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "335km/hから進入する右。最大のオーバーテイクポイント。"
      },
      {
        "number": "T2",
        "name": "Turn 2 左",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "立ち上がりの左。"
      },
      {
        "number": "T3",
        "name": "Turn 3 右キンク",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "全開で抜ける高速右。"
      },
      {
        "number": "T4",
        "name": "Turn 4 高速右進入",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "高速右。横Gがかかり始める。"
      },
      {
        "number": "T5",
        "name": "Turn 5 高速右脱出",
        "gearEstimated": "5th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "ボトムスピードを維持。"
      },
      {
        "number": "T6",
        "name": "Turn 6 ヘアピン左",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "コース中最もタイトな低速左ヘアピン。"
      },
      {
        "number": "T7",
        "name": "Turn 7 高速右スイープ",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "中速右。"
      },
      {
        "number": "T8",
        "name": "Turn 8 高G右スイーパー",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "強烈な横Gがかかり続ける右。"
      },
      {
        "number": "T9",
        "name": "Turn 9 高速左",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "素早い切り返し。"
      },
      {
        "number": "T10",
        "name": "Turn 10 中速左",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "インをキープ。"
      },
      {
        "number": "T11",
        "name": "Turn 11 高速右",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "トリプルエイペックスへの助走。"
      },
      {
        "number": "T12",
        "name": "Triple Apex 1st",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "名物トリプルエイペックスの突入。"
      },
      {
        "number": "T13",
        "name": "Triple Apex 2nd",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "5G超の横Gが持続。タイヤ内部コードへの最大負荷地点。"
      },
      {
        "number": "T14",
        "name": "Triple Apex 3rd",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "全開で駆け抜ける3つ目のエイペックス。"
      },
      {
        "number": "T15",
        "name": "Turn 15 高速左",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "最終コーナーへのアプローチ。"
      },
      {
        "number": "T16",
        "name": "Final Turn 右",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "メインストレートへ接続する重要右コーナー。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2021,
        "title": "ハミルトンの圧勝と複数台のパンククライシス",
        "description": "カタールGP初開催でハミルトンが独走勝利する一方、ピラミッド縁石の衝撃でボッタス、ノリスらが相次ぎパンク。",
        "detailedStory": "タイトル争いの緊迫する終盤戦。ハミルトンがポールから完璧なレース運びで勝利。しかし高速コーナーの外側に設置されたピラミッド型縁石によりタイヤのサイドウォールが削られ、ボッタスやラティフィが相次いで高速バーストを起こす事態となった。",
        "significance": "カタール初開催の熱狂と縁石安全性の教訓。"
      },
      {
        "year": 2023,
        "title": "極限の熱中症レースとフェルスタッペンのスプリント戴冠",
        "description": "土曜スプリントでフェルスタッペンが3度目のタイトルを獲得。日曜決勝では過酷な猛暑でドライバーが次々と失神寸前に。",
        "detailedStory": "気温35℃、湿度80%の過酷なナイトレース。縁石によるタイヤ剥離防止のためFIAが1スティント18周の強制ピット制限を導入。ドライバーたちは全力アタックを強いられ、サージェントが脱水症状でリタイア、オコンが車内で嘔吐、ストロールが失神寸前になる極限のサバイバルとなった。",
        "significance": "F1史上最も過酷な気候条件下でのアスリートの限界闘争。"
      },
      {
        "year": 2024,
        "title": "マクラーレンの猛攻とカタール決戦",
        "description": "コンストラクターズタイトル争いが最高潮に達する中、マクラーレンとフェラーリが高速ルサイルで激突。",
        "detailedStory": "マクラーレンのノリスとピアストリが超高速セクターで圧倒的なアドバンテージを発揮。フェルスタッペンとの激しいトップ争いの中、タイヤマネジメントとピット戦略の妙技が披露された。",
        "significance": "新世代マシンによる高速空力バトルの極致。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "連続する高速コーナーでのボトムスピードを稼ぐためハイダウンフォースが必須。",
      "kerbUsage": "ピラミッド型縁石の角が鋭利であり、乗り上げすぎるとタイヤ内部構造を破壊するため縁石回避ラインが重要。",
      "brakeDemands": "ターン1以外は激しい減速ゾーンがなく、ブレーキ負荷は低〜中程度。"
    },
    "references": [
      {
        "id": 1,
        "title": "Lusail Circuit High-Lateral G-Force Profile and MotoGP/F1 Hybrid Design",
        "publisher": "Lusail Circuit Sports Club",
        "url": "https://www.circuitlusail.com",
        "verifiedDate": "2024-11-20"
      },
      {
        "id": 2,
        "title": "FIA and Pirelli Mandatory Stint Length Directive - Qatar GP 2023",
        "publisher": "FIA Technical Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2023-10-08"
      }
    ]
  },
  {
    "id": "yas-marina",
    "name": "ヤス・マリーナ・サーキット",
    "officialName": "Yas Marina Circuit",
    "country": "UAE 🇦🇪",
    "lengthKm": 5.281,
    "turns": 16,
    "drsZones": 2,
    "downforceLevel": "Medium",
    "tyreStress": "Medium",
    "typicalPitLossSec": 22,
    "safetyCarProbability": "45% (中程度)",
    "undercutImpact": "中程度（改修によりオーバーテイクが容易になった）",
    "lapRecord": {
      "time": "1:26.103",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2021
    },
    "characteristics": "【第1章：夕暮れから満天の夜空へ移ろう豪華絢爛のシーズンフィナーレ】\\nアラブ首長国連邦アブダビの人工島ヤス島に建設され、伝統的にF1シーズンの最終戦を飾るトワイライトレースの舞台 [1][5]。夕暮れの太陽光の下でスタートし、夜間照明へと徐々に光の条件が変化する中、気温と路面温度がセッション中に10℃以上急降下するため、マシンの前後バランスが激変する [1][2]。\\n\\n【第2章：改修された高速バンクとマリーナホテルの下を抜ける華麗なセクター】\\n2021年の大改修により、旧来のストップ＆ゴーからターン5のバンク付きヘアピン、ターン9の雄大な高速バンクコーナーへと刷新され、パッシング機会とレースペースが飛躍的に向上 [1][3]。セクター3では、色鮮やかに発光する五星ホテル「Wアブダビ」の直下を潜り抜けるテクニカル区間が待ち受け、トラクションと低速メカニカルグリップがタイヤのオーバーヒートを防ぐ鍵となる [2][4][6]。",
    "officialLinks": {
          "website": "https://www.yasmarinacircuit.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/abu-dhabi.html",
          "googleMaps": "https://maps.google.com/?q=Yas+Marina+Circuit",
          "xTwitter": "https://x.com/ymcofficial",
          "instagram": "https://www.instagram.com/ymcofficial/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_yas_marina.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yas_Marina_Circuit_Hotel.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_yas_marina.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yas_Marina_Circuit_Hotel.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_yas_marina.jpg",
        "caption": "色鮮やかにライトアップされたヤス・ホテルとマリーナを駆け抜ける最終戦の舞台",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yas_Marina_Circuit_Hotel.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_yas_marina.jpg",
        "caption": "色鮮やかにライトアップされたヤス・ホテルとマリーナを駆け抜ける最終戦の舞台",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yas_Marina_Circuit_Hotel.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 10.7,
      "longestStraightMeters": 1200,
      "gForceMax": {
        "lateral": 4.2,
        "longitudinal": 4.7
      },
      "keyCorners": [
        {
          "number": "T5",
          "name": "North Hairpin",
          "characteristic": "2021年改修でシケインが撤去され新設された高速進入ヘアピン。"
        },
        {
          "number": "T9",
          "name": "South Banked Corner",
          "characteristic": "マリーナセクション入口の巨大なバンク付き高速ロング左。"
        },
        {
          "number": "T13-T14",
          "name": "Hotel Complex",
          "characteristic": "ライトアップされたヤス・ホテルの下をくぐり抜ける低速セクション。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 左",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "ピット直線からの高速左。イン側の縁石に車首を乗せる。"
      },
      {
        "number": "T2",
        "name": "Turn 2 上り右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "上り坂の全開右ベンド。"
      },
      {
        "number": "T3",
        "name": "Turn 3 高速右",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "丘の頂上の高速右。"
      },
      {
        "number": "T4",
        "name": "Turn 4 下り左",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "ヘアピンへ向けた下りアプローチ。"
      },
      {
        "number": "T5",
        "name": "North Hairpin (改修後新ヘアピン)",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "1.2kmバックストレートへ飛び出す最重要急減速ヘアピン。"
      },
      {
        "number": "T6",
        "name": "Straight Kink",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "バックストレートへの立ち上がり。"
      },
      {
        "number": "T7",
        "name": "Chicane 進入左",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "1.2kmストレートエンドの急減速シケイン。最大のパッシングポイント。"
      },
      {
        "number": "T8",
        "name": "Chicane 脱出右",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "第2ストレートへ向けた切り返し。"
      },
      {
        "number": "T9",
        "name": "South Banked Corner (新設バンク左)",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "2021年新設のバンク付きロング左。外側ラインで勢いをつけて抜ける。"
      },
      {
        "number": "T10",
        "name": "Marina Straight Exit",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "マリーナ沿いストレートへの加速。"
      },
      {
        "number": "T11",
        "name": "Turn 11 (90度右)",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "マリーナのホテル街へ進入する直角右。"
      },
      {
        "number": "T12",
        "name": "Turn 12 (90度左)",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "ヨットハーバー沿いの左。"
      },
      {
        "number": "T13",
        "name": "Hotel Entry 左",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "ホテルの下へ潜り込む左ターン。"
      },
      {
        "number": "T14",
        "name": "Hotel Exit 右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "ホテルをくぐり抜けた直後の右。"
      },
      {
        "number": "T15",
        "name": "Turn 15 右",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "最終コーナーへの位置取り。"
      },
      {
        "number": "T16",
        "name": "Final Corner 右",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "メインストレートへ接続する右。DRS加速ラインへ。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2021,
        "title": "「アブダビの奇跡と論争」フェルスタッペンの初戴冠",
        "description": "最終戦の最終周、セーフティカー明けのラストラップでフェルスタッペンがハミルトンをオーバーテイクし初の世界チャンピオン。",
        "detailedStory": "同点首位で迎えた歴史的最終戦。独走するハミルトンに対し、残り5周でラティフィがクラッシュしSC導入。レースディレクター（マイケル・マシ）の物議を醸した指示により周回遅れが一部解除され、ファイナルラップにレース再開。新品ソフトのフェルスタッペンがターン5でハミルトンを抜き初戴冠。",
        "significance": "F1史上で最も劇的かつ激しい議論を呼んだタイトル決定劇。"
      },
      {
        "year": 2010,
        "title": "ベッテル、史上最年少での奇跡の逆転戴冠",
        "description": "ポイント3番手のセバスチャン・ベッテルが勝利。首位アロンソがペトロフに阻まれ、23歳での史上最年少王者が誕生。",
        "detailedStory": "4人にタイトル獲得の可能性が残された最終戦。ポイントリーダーのアロンソがウェバーを警戒して早期ピットインするも、ルノーのペトロフの後ろに引っかかり7位に沈む。ポールから独走したベッテルが優勝し、土壇場で逆転世界王者に輝いた。",
        "significance": "ベッテルとレッドブルの4年連続黄金時代の幕開け。"
      },
      {
        "year": 2016,
        "title": "ロズベルグ、父子2代の世界チャンピオン達成と電撃引退",
        "description": "ハミルトンが故意にペースを落とす心理戦を仕掛ける中、ロズベルグが2位を死守して初王座。わずか5日後に電撃引退を発表。",
        "detailedStory": "首位のハミルトンは後続のベッテルやフェルスタッペンにロズベルグを抜かせるため、意図的にスローペースで走行。チームの指示も無視する極限の心理戦の中、ロズベルグは冷静に2位を守り抜き念願の世界王者に。そしてその5日後、頂点に立ったまま現役引退を宣言した。",
        "significance": "激しいチームメイト対決のクライマックスと衝撃の幕引き。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "1.2kmストレートとマリーナ低速区間の両立。ミディアムレベルのウイングで最高速とトラクションを最適化。",
      "kerbUsage": "ターン7〜8シケインやホテル周辺の縁石は比較的低め。アグレッシブに乗せてラインを広げる。",
      "brakeDemands": "バックストレートエンドのターン7やターン5でのハード制動。日没に伴う路面温度の低下がタイヤ内圧に影響。"
    },
    "references": [
      {
        "id": 1,
        "title": "Yas Marina Circuit 2021 Track Reconfiguration Design and Flow Dynamics",
        "publisher": "Abu Dhabi Motorsports Management (ADMM)",
        "url": "https://www.yasmarinacircuit.com",
        "verifiedDate": "2024-11-25"
      },
      {
        "id": 2,
        "title": "Twilight Race Track Temperature Inversion Analysis - Abu Dhabi",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-11-28"
      }
    ]
  },
  {
    "id": "jeddah",
    "name": "ジェッダ・コーニッシュ・サーキット",
    "officialName": "Jeddah Corniche Circuit",
    "country": "サウジアラビア 🇸🇦",
    "lengthKm": 6.174,
    "turns": 27,
    "drsZones": 3,
    "downforceLevel": "Low",
    "tyreStress": "Medium",
    "typicalPitLossSec": 20,
    "safetyCarProbability": "85% (極めて高い)",
    "undercutImpact": "中程度（高速コースのためSCタイミングが戦略の全てを左右）",
    "lapRecord": {
      "time": "1:30.734",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2021
    },
    "characteristics": "【第1章：紅海沿岸を時速250km/hで駆け抜ける「世界最速の市街地サーキット」】\\nサウジアラビアの港町ジェッダの海岸線に建設された超高速ストリートサーキット [1][5]。全27のコーナーを持ちながら、平均時速はモンツァに次ぐ250km/h以上に達し、市街地レースの常識を根底から覆す異次元のハイスピードコース [1][2]。ブラインドの高速コーナーがコンクリートウォールに囲まれて延々と続き、わずか数センチのラインのズレが大惨事につながる極限の緊張感が支配する [2][3]。\\n\\n【第2章：12度のバンク角を持つターン13と赤旗セーフティカーの高確率】\\nターン13は12度の傾斜を持つバンク付きヘアピンであり、外側ラインから高いコーナリングスピードを維持して立ち上がるアグレッシブなライン取りが可能 [1][3]。超高速かつランオフエリアが皆無であるため、ひとたびクラッシュが発生すれば即座にセーフティカー出動や赤旗中断へと発展し、ピット戦略の瞬時の判断力が波乱のレースを制する鍵となる [2][4][6]。",
    "officialLinks": {
          "website": "https://saudiarabiangp.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/saudi-arabia.html",
          "googleMaps": "https://maps.google.com/?q=Jeddah+Corniche+Circuit",
          "xTwitter": "https://x.com/SaudiArabianGP",
          "instagram": "https://www.instagram.com/saudiarabiangp/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_jeddah.png",
      "credit": "Formula 1",
      "license": "CC BY-SA 4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jeddah_Corniche_Circuit.png"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_jeddah.png",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jeddah_Corniche_Circuit.png"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_jeddah.png",
        "caption": "紅海のウォーターフロントに光り輝く超高速ジェッダ・コーニッシュ・サーキット",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jeddah_Corniche_Circuit.png"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_jeddah.png",
        "caption": "紅海のウォーターフロントに光り輝く超高速ジェッダ・コーニッシュ・サーキット",
        "tag": "Atmosphere",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jeddah_Corniche_Circuit.png"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 4.2,
      "longestStraightMeters": 1000,
      "gForceMax": {
        "lateral": 4.9,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Turn 1-2 Chicane",
          "characteristic": "320km/hから壁の間をすり抜けるタイトなシケイン。"
        },
        {
          "number": "T13",
          "name": "Banked Hairpin",
          "characteristic": "12度の傾斜を持つバンク付き高速ヘアピン。"
        },
        {
          "number": "T22-T24",
          "name": "High-speed Chicanes",
          "characteristic": "時速250km/h超で左右に切り返す視界ゼロの超危険セクション。"
        },
        {
          "number": "T27",
          "name": "Final Hairpin",
          "characteristic": "メインストレートへ接続する急減速左。DRS検知ポイントの駆け引き。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "ピット直線エンドから進入。ウォールが狭まる。"
      },
      {
        "number": "T2",
        "name": "Turn 2 右",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "急激な右切り返し。"
      },
      {
        "number": "T3",
        "name": "Turn 3 加速左",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "高速フローへの加速。"
      },
      {
        "number": "T4",
        "name": "Turn 4 高速右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "ブラインド高速右。"
      },
      {
        "number": "T5",
        "name": "Turn 5 左スイープ",
        "gearEstimated": "5th",
        "speedEstimated": "235 km/h",
        "engineeringTip": "全開で抜ける左。"
      },
      {
        "number": "T6",
        "name": "Turn 6 高速右フリック",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "壁すれすれの右。"
      },
      {
        "number": "T7",
        "name": "Turn 7 左切り返し",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "鋭いステアリング。"
      },
      {
        "number": "T8",
        "name": "Turn 8 右スイープ",
        "gearEstimated": "6th",
        "speedEstimated": "265 km/h",
        "engineeringTip": "高速キープ。"
      },
      {
        "number": "T9",
        "name": "Turn 9 ブラインド左",
        "gearEstimated": "7th",
        "speedEstimated": "280 km/h",
        "engineeringTip": "全開ブラインド。"
      },
      {
        "number": "T10",
        "name": "Turn 10 右カーブ",
        "gearEstimated": "7th",
        "speedEstimated": "285 km/h",
        "engineeringTip": "フロアのダウンフォース安定性。"
      },
      {
        "number": "T11",
        "name": "Turn 11 左キンク",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "バンクコーナーへ向かう。"
      },
      {
        "number": "T12",
        "name": "Turn 12 減速右",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "ヘアピンへの進入姿勢を作る。"
      },
      {
        "number": "T13",
        "name": "Banked Hairpin (12度バンク)",
        "gearEstimated": "4th",
        "speedEstimated": "150 km/h",
        "engineeringTip": "12度バンクのすり鉢状ヘアピン。外側ラインで車速を乗せる。"
      },
      {
        "number": "T14",
        "name": "Turn 14 脱出右",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "立ち上がり。"
      },
      {
        "number": "T15",
        "name": "Turn 15 高速スイーパー",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "高速全開区間へ。"
      },
      {
        "number": "T16",
        "name": "Turn 16 ブラインド高速左",
        "gearEstimated": "6th",
        "speedEstimated": "265 km/h",
        "engineeringTip": "視界ゼロの高速左。"
      },
      {
        "number": "T17",
        "name": "Turn 17 高速右",
        "gearEstimated": "6th",
        "speedEstimated": "270 km/h",
        "engineeringTip": "ウォールとのマージンをミリ単位で制御。"
      },
      {
        "number": "T18",
        "name": "Turn 18 全開左",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "全開疾走。"
      },
      {
        "number": "T19",
        "name": "Turn 19 全開右",
        "gearEstimated": "7th",
        "speedEstimated": "295 km/h",
        "engineeringTip": "DRSゾーン。"
      },
      {
        "number": "T20",
        "name": "Turn 20 高速左",
        "gearEstimated": "7th",
        "speedEstimated": "285 km/h",
        "engineeringTip": "ウォーターフロント沿い。"
      },
      {
        "number": "T21",
        "name": "Turn 21 左縁石",
        "gearEstimated": "7th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "シケイン手前。"
      },
      {
        "number": "T22",
        "name": "Turn 22 超高速シケイン左",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "時速240km/hで突入する最も危険なシケイン。"
      },
      {
        "number": "T23",
        "name": "Turn 23 シケイン右",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "縁石を跨ぐ。"
      },
      {
        "number": "T24",
        "name": "Turn 24 シケイン脱出左",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "脱出加速。"
      },
      {
        "number": "T25",
        "name": "Turn 25 全開キンク",
        "gearEstimated": "7th",
        "speedEstimated": "305 km/h",
        "engineeringTip": "全開で駆け抜ける。"
      },
      {
        "number": "T26",
        "name": "Turn 26 全開スイープ",
        "gearEstimated": "8th",
        "speedEstimated": "320 km/h",
        "engineeringTip": "最終減速帯へのアプローチ。"
      },
      {
        "number": "T27",
        "name": "Final Hairpin 左",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "メインストレートへ接続する急減速ヘアピン。DRS検知ラインの心理戦。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2021,
        "title": "ハミルトン対フェルスタッペン、混沌と激突の初開催",
        "description": "赤旗2回、VSC多発の中、ストレートでのポジション譲渡を巡る謎の追突事故が発生したカオスレース。",
        "detailedStory": "タイトル決定目前の第21戦。度重なる赤旗とリスタートの中、順位返還を指示されたフェルスタッペンがストレートで減速した際、ハミルトンが真後ろに追突する前代未聞の事態に。ハミルトンは破損したフロントウィングのままファステストを連発し優勝、同点で最終戦へ向かう伝説となった。",
        "significance": "F1史上最も混沌とした初開催レースの一つ。"
      },
      {
        "year": 2022,
        "title": "フェルスタッペンとルクレール、DRS検知線の駆け引き合戦",
        "description": "最終コーナー手前のDRS検知ラインを巡り、両者が互いに相手を先行させようとフルブレーキを踏み合う頭脳戦。",
        "detailedStory": "新規定マシンの第2戦。ルクレールとフェルスタッペンが残り10周にわたり首位を争う中、ターン27手前のDRSラインを相手に先に踏ませるための駆け引きを展開。最終的にフェルスタッペンが0.5秒差で辛勝し、名勝負として称賛された。",
        "significance": "現代F1におけるDRSルールとレースインテリジェンスの最高傑作。"
      },
      {
        "year": 2024,
        "title": "オリバー・ベアマン、18歳でフェラーリ緊急デビュー7位入賞",
        "description": "盲腸のサインツに代わり急遽フェラーリのステアリングを握ったベアマンが、世界最速の市街地で堂々の7位入賞。",
        "detailedStory": "FP3直前にフェラーリからの出走を告げられた18歳の新人ベアマン。予選11位から決勝ではノリスやハミルトンの追撃を完璧に防ぎ切り7位フィニッシュ。世界中にその非凡な才能を鮮烈にアピールした。",
        "significance": "フェラーリの歴史上最も若いドライバーの鮮烈なデビュー劇。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "平均速度が極めて高いためローダウンフォースが有利だが、高速S字での安定性を欠くと即クラッシュの危険。",
      "kerbUsage": "ウォールとの距離がゼロに近いため、縁石の使いすぎによるマシンの跳ね上がりは致命的。",
      "brakeDemands": "時速250km/h以上のコーナーが続くため、ターン1とターン27以外にブレーキ負荷は少ないが、冷却風量の確保が課題。"
    },
    "references": [
      {
        "id": 1,
        "title": "Safety and High-Speed Street Circuit Geometry at Jeddah Corniche",
        "publisher": "Saudi Motorsport Company & Tilke GmbH",
        "url": "https://www.saudimotorsport.com",
        "verifiedDate": "2024-03-08"
      },
      {
        "id": 2,
        "title": "Analysis of Visual Sightlines and Barrier Adjustments at Jeddah",
        "publisher": "FIA Safety Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-03-10"
      }
    ]
  }

];
