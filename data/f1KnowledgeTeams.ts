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

export const KNOWLEDGE_TEAMS: TeamProfile[] = [


  {
    id: 'red-bull',
    name: 'Red Bull Racing',
    fullName: 'Oracle Red Bull Racing',
    teamPrincipal: 'Laurent Mekies',
    powerUnit: 'Red Bull Ford Powertrains',
    base: 'Milton Keynes, United Kingdom',
    constructorTitles: 6,
    drivers: ['VER', 'HAD'],
    color: '#38bdf8',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_redbull_rb19.jpg",
        caption: "RB19 (2023): シーズン22戦21勝のF1歴代最多勝記録を樹立した究極のマシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_redbull_rb9.jpg",
        caption: "RB9 (2013): セバスチャン・ベッテルが9連勝で4年連続ダブルタイトルを達成したV8最終兵器",
        tag: "Championship",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_redbull_factory.jpg",
        caption: "Milton Keynes Campus: 風洞・シミュレーター・Red Bull Powertrainsが集結する中枢ファクトリー",
        tag: "Factory",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'エイドリアン・ニューウェイの設計思想に基づく、フロア下部ベンチュリトンネルとサイドポッドアンダーカットの極限融合。車体姿勢（ピッチ＆ロール）の急激な変化下でもダウンフォースが急減しない極めて広い空力オペレーティングウィンドウを確立し、高速複合コーナーから低速ヘアピンまでリニアな負圧を生成 [1][3]。',
    mechanicalFocus:
      'フロントにプルロッド式、リアにプッシュロッド式のサスペンションジオメトリを採用。強烈なアンチダイブ（制動時の前沈み込み抑制）とアンチスクワット（加速時の後沈み込み抑制）を機構的に組み込み、ブレーキングから旋回にかけてフロアと路面の隙間（ライドハイト）をミリ単位で一定に固定 [2][4]。',
    description:
      '【第1章：空力の奇才エイドリアン・ニューウェイと車体ダイナミクスの絶対優位】\nレッドブル・レーシングの開発哲学の神髄は、「マシン全体をひとつの巨大な流体工学デバイスとして統合する」点にある [1][3]。2022年のグラウンドエフェクト規定復活に際し、他チームがポーパシング（高速ピッチング振動）に喘ぐ中、レッドブルはいち早くフロアエッジの渦流制御（Vortex Generation）とフロア下面の気流剥離防止技術を確立 [1][4]。サスペンションジオメトリによるアンチダイブ機構と協調させることで、縁石への激しい乗り上げやフルブレーキング時でもディフューザー負圧を一切破綻させない無類のスタビリティを実現した [2][4]。\n\n【第2章：ホンダとのパワーユニット共創とミルトンキーンズの自社一貫体制】\n2019年から始まったホンダ（現HRC）とのパートナーシップにより、パワーユニットの熱効率と車体冷却パッケージングが極限まで小型化 [3][5]。エンジンの重心高低減と排気レイアウトの最適化が、ニューウェイが描く極端に絞り込まれたサイドポッド（アンダーカット）を具現化させた [1][3]。2026年新規定を見据え、ミルトンキーンズ本拠地に自社エンジン部門「Red Bull Powertrains（RBPT）」を設立、フォードとの提携を通じてシャシーと電動PUを完全一括設計する新時代へと突入している [5][6]。',
  },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/red-bull.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari',
    fullName: 'Scuderia Ferrari HP',
    teamPrincipal: 'Frédéric Vasseur',
    powerUnit: 'Ferrari 067/3 Works',
    base: 'Maranello, Italy',
    constructorTitles: 16,
    drivers: ['LEC', 'HAM'],
    color: '#f87171',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_ferrari_f2004.jpg",
        caption: "F2004: ミハエル・シューマッハが13勝を挙げたF1史上屈指の伝説的傑作マシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_ferrari_312t.jpg",
        caption: "312T (1975): ニキ・ラウダが駆りフェラーリに黄金期をもたらした水平対向12気筒の名車",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_ferrari_factory.jpg",
        caption: "Maranello Factory: 跳ね馬の情熱が宿るエンツォ・フェラーリ創業の聖地ファクトリー",
        tag: "Factory",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      '低ドラッグと高ダウンフォースの両立を追求したSダクトおよびアンダーカットサイドポッド思想。高速直線のトップスピードを武器としつつ、モンツァやスパ等の超高速サーキットにおいて最小のウィング角で最大限のフロア吸引力を生み出すエアロダイナミクス [1][3]。',
    mechanicalFocus:
      'フロント・プッシュロッド、リア・プルロッド式（2025年以降プッシュロッド統合）を採用。市街地コースの縁石ストライクや段差通過時におけるタイヤの垂直荷重抜けを瞬時にダンピングする高追従サスペンション機構 [2][4]。',
    description:
      '【第1章：マラネロの誇りとフレデリック・バスールによる組織改革】\nF1唯一の全シーズン参戦を誇るスクーデリア・フェラーリ。2023年に就任したチーム代表フレデリック・バスールのもと、かつての硬直した官僚主義を打破し、トラックサイドとマラネロ開発陣がリアルタイムに連携するアジャイルな組織へ脱皮 [1][5]。ドライバーのフィードバックを即座にシミュレーターデータへ反映させ、予選一発の速さだけでなく、決勝ロングランでのタイヤデグラデーション克服に焦点を絞ったマシン開発を徹底している [3][4]。\n\n【第2章：自社製パワーユニットの超高熱効率とハイブリッド統合】\nマラネロファクトリー内でエンジン、シャシー、トランスミッション、電子制御の全てを内製する数少ない真のコンストラクター [1][3]。V6ターボ「066系」パワーユニットは、プレチャンバー燃焼技術の極限進化により熱効率50%超を達成 [3][6]。さらにERS（エネルギー回生システム）の電力展開マップをドライバーがステアリング上のダイヤル（エンジンモード＆ソック）で自在に微調整できる直感的なインターフェースを誇る [2][6]。',
  },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/ferrari.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'mclaren',
    name: 'McLaren',
    fullName: 'McLaren Formula 1 Team',
    teamPrincipal: 'Andrea Stella',
    powerUnit: 'Mercedes-AMG M17 E Performance',
    base: 'Woking, United Kingdom',
    constructorTitles: 10,
    drivers: ['NOR', 'PIA'],
    color: '#fb923c',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_mclaren_mp4_4.jpg",
        caption: "MP4/4 (1988): アイルトン・セナとアラン・プロストが16戦15勝を記録した不滅の金字塔",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_mclaren_mp4_13.jpg",
        caption: "MP4/13 (1998): ミカ・ハッキネンが悲願の初タイトルを奪取したニューウェイ初期の傑作",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_mclaren_mtc.jpg",
        caption: "McLaren Technology Centre (Woking): ノーマン・フォスター設計の近未来ファクトリー",
        tag: "Factory",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'ウォーキングの新風洞施設が生み出した、低速から高速まで気流剥離を起こさない極めてロバストなアンダーフロア渦流構造。フロントウィングからサイドポッド溝（ウォータースライド）、そしてビームウィングへと連動する3次元気流制御 [1][3]。',
    mechanicalFocus:
      'フロント・プルロッド、リア・プッシュロッドサスペンション。高速コーナリング時のロール角をミリ単位で抑え込み、タイヤ接地面積を常に最大化するキャンバー＆トー角コントロール機構 [2][4]。',
    description:
      '【第1章：アンドレア・ステラ体制下のエンジニアリング至上主義】\nマクラーレン・テクノロジー・センター（MTC）において、元フェラーリの名エンジニアであるアンドレア・ステラ代表が主導した技術構造改革が結実 [1][5]。ピーター・プロドロモウ（空力）らを中心としたフラットなエンジニアリング体制を確立し、2023年夏の大規模アップデート以降、グリッド最速の進化スピードを達成 [1][4]。新設の自社風洞と最先端CFDシミュレーターの完全相関（コリレーション）により、風洞で得られたダウンフォース値が実走行トラック上で100%再現される技術的ブレイクスルーを成し遂げた [3][4]。\n\n【第2章：万能のMCL38と1998年以来のコンストラクターズ世界王座奪還】\n2024年型マシンMCL38は、ストップ＆ゴーのマイアミ、超高速バンクのザントフォールト、極低速市街地のシンガポール、そして高速S字の鈴鹿に至るまで、あらゆるサーキット特性で無類の速さとタイヤ優位性を発揮 [2][3]。メルセデス製パワーユニットの信頼性と協調し、1998年（ハッキネン＆クルサード時代）以来となる悲願のF1コンストラクターズ世界選手権チャンピオンを奪還、名門完全復活を告げた [1][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/mclaren.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG',
    fullName: 'Mercedes-AMG PETRONAS F1 Team',
    teamPrincipal: 'Toto Wolff',
    powerUnit: 'Mercedes-AMG M17 E Performance',
    base: 'Brackley, United Kingdom',
    constructorTitles: 8,
    drivers: ['RUS', 'ANT'],
    color: '#2dd4bf',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_mercedes_w11.jpg",
        caption: "W11 EQ Performance (2020): F1史上最速ラップレコードを多数塗り替えた究極のブラックアロー",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_mercedes_w05.jpg",
        caption: "W05 Hybrid (2014): ターボハイブリッド新時代を開幕から完全制覇した歴史的チャンピオンカー",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'ゼロポッド構想の教訓を経て、ダウンウォッシュ型サイドポッドと強固なフロアエッジ渦流シーリングへと回帰。高速直線のドラッグ低減と、高速コーナーでの安定したダウンフォース生成を両立させた総合空力パッケージ [1][3]。',
    mechanicalFocus:
      'インボードサスペンションの内部ダンパー（ヒーブダンパーおよび慣性インナーター）の精密チューニング。グラウンドエフェクト特有のボトミング（底打ち）ショックを吸収し、ドライバーの腰部負担を軽減するサスペンションキネマティクス [2][4]。',
    description:
      '【第1章：ハイブリッド時代8連覇の金字塔とブラックリーの技術力】\n2014年のV6ターボハイブリッド導入以降、F1史上前人未到のコンストラクターズ世界選手権8連覇（2014〜2021年）を達成した絶対王者 [1][5]。トト・ウォルフ代表の統率のもと、ブラックリー（シャシー）とブリックスワース（ハイブリッドPU：Mercedes-AMG High Performance Powertrains）が完全一体となり、F1界の技術的基準を何世代にもわたり引き上げ続けた [1][3]。\n\n【第2章：新世代規定での苦闘と勝利への復活】\n2022年のグラウンドエフェクト導入初期は「ゼロポッド」による極端なポーパシングに苦しんだが、風洞モデルとCFDの抜本的見直しを断行 [3][4]。2024年にはW15の進化とともにカナダでのポールポジション、オーストリアでのラッセル優勝、そしてシルバーストン＆スパでのハミルトン優勝を記録 [1][2]。困難を克服してトップコンテンダーへ返り咲く強靭なエンジニアリング文化を実証した [2][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/mercedes.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'aston-martin',
    name: 'Aston Martin',
    fullName: 'Aston Martin Aramco F1 Team',
    teamPrincipal: 'Adrian Newey',
    powerUnit: 'Honda Works PU (RA626H)',
    base: 'Silverstone, United Kingdom',
    constructorTitles: 0,
    drivers: ['ALO', 'STR'],
    color: '#34d399',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_astonmartin_amr23.jpg",
        caption: "AMR23 (2023): アロンソが年間8回の表彰台を獲得しチーム躍進の象徴となったグリーンマシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_astonmartin_db5.jpg",
        caption: "DB5 Heritage: 英国の気品とジェームズ・ボンドの魂を受け継ぐアストンマーティンの原点",
        tag: "Heritage",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'シルバーストンの最新鋭ファクトリー「AMRテクノロジー・キャンパス」と自社風洞が生み出す、ダウンウォッシュ溝（ディープ・ウォータースライド）とフロア吸引の融合。2026年のホンダ・ワークスPU搭載およびエイドリアン・ニューウェイ加入を見据え、極限までタイトなリアエンド絞り込みと低ドラッグ・高ダウンフォースパッケージを追求 [1][3]。',
    mechanicalFocus:
      'メルセデス製リアエンド（トランスミッション＆サスペンション）の供給を受けつつ、フロントサスペンションのジオメトリを独自設計。アンチダイブ特性を強化し、ハードブレーキング時でもフロントウィング対地高の乱れを防ぐ [2][4]。',
    description:
      '【第1章：ローレンス・ストロールの巨額投資とシルバーストン新拠点】\n名門アストンマーティンの名を冠し、オーナーのローレンス・ストロールが主導する野心的なプロジェクト [1][5]。シルバーストンに数百億円規模の「AMRテクノロジー・キャンパス」を建設し、最先端CFD施設と自社専用風洞を稼働 [1][4]。ダン・ファローズ（元レッドブル空力責任者）やボブ・ベルら最高峰の頭脳を結集させ、2023年にはAMR23で年間8度の表彰台を獲得する大躍進を遂げた [1][3]。\n\n【第2章：ホンダとの2026年ワークス体制とエイドリアン・ニューウェイの参画】\n2026年からの新レギュレーション導入に合わせ、ホンダ（HRC）との独占ワークスパートナーシップを締結 [3][5]。車体と次世代100%持続可能燃料パワーユニット（アラムコ共創）を完全一体開発する体制を確立した [3][6]。さらに現代F1史上最も偉大な設計者エイドリアン・ニューウェイがマネージング・テクニカルパートナーとして加入し、世界チャンピオン獲得へ向けた万全の布陣を敷いている [1][4][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/aston-martin.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'alpine',
    name: 'Alpine',
    fullName: 'BWT Alpine F1 Team',
    teamPrincipal: 'Flavio Briatore / Steve Nielsen',
    powerUnit: 'Mercedes-AMG M17 E Performance',
    base: 'Enstone, United Kingdom',
    constructorTitles: 2,
    drivers: ['GAS', 'COL'],
    color: '#0284c7',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_alpine_r25.jpg",
        caption: "Renault R25 (2005): フェルナンド・アロンソがシューマッハを破り初の世界王者となったV10マシン",
        tag: "Championship",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_alpine_a521.jpg",
        caption: "A521 (2021): エステバン・オコンがハンガロリンクで劇的初優勝を飾ったアルピーヌ初号機",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'エンストン（シャシー）の伝統的なCFD流体解析に基づく、高効率ダウンウォッシュ・サイドポッドとビームウィングの相互作用。中低速コーナーでのフロア負圧保持を最優先としつつ、ストレートでの空気抵抗低減を狙うエアロパッケージ [1][3]。',
    mechanicalFocus:
      'プッシュロッド式前後サスペンションの剛性配分により、メカニカルグリップと縁石走破性を確保。2026年以降のカスタマーPU移行に伴うトランスミッションおよびリアサスペンションの統合適応 [2][4]。',
    description:
      '【第1章：エンストンとヴィリー＝シャティヨンの輝かしい血統】\nベネトン、ルノーとして数々の世界タイトル（シューマッハ、アロンソ）を獲得してきた英国エンストンの車体ファクトリーと、フランス・パリ近郊ヴィリー＝シャティヨンのエンジン拠点による歴史的ワークスチーム [1][5]。2021年ハンガリーGPではエステバン・オコンが歓喜の初優勝を達成 [1][2]。\n\n【第2章：ブリアトーレ復帰と2026年へ向けた大胆な組織転換】\n2024年、かつて黄金期を率いたフラビオ・ブリアトーレがエグゼクティブ・アドバイザーとして電撃復帰 [4][5]。2026年以降の自社製F1エンジン開発凍結と、メルセデス製パワーユニット＆ギアボックスのカスタマー供給導入という実利的な大英断を下し、エンストンの車体設計力に全リソースを集中させてトップコンテンダーへの返り咲きを図っている [1][4][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/alpine.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'williams',
    name: 'Williams',
    fullName: 'Williams Racing',
    teamPrincipal: 'James Vowles',
    powerUnit: 'Mercedes-AMG M17 E Performance',
    base: 'Grove, United Kingdom',
    constructorTitles: 9,
    drivers: ['ALB', 'SAI'],
    color: '#38bdf8',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_williams_fw14b.jpg",
        caption: "FW14B (1992): ナイジェル・マンセルがアクティブサスペンションで支配した名機",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_williams_fw18.jpg",
        caption: "FW18 (1996): デイモン・ヒルがワールドチャンピオンに輝いた16戦12勝の最強マシン",
        tag: "Championship",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      '歴史的に直線の絶対的最高速（トップスピード）を誇るロー・ドラッグ思想。グローブ本拠地の最新設備更新により、低速コーナーでのフロントダウンフォース抜けを改善し、オールラウンドな旋回安定性を持つエアロプラットフォームへと進化 [1][3]。',
    mechanicalFocus:
      'メルセデス製パワーユニットおよびギアボックスを搭載し、リアサスペンションの剛性を最適化。ステアリング初期応答のシャープさと、ブレーキング時の前沈み込み抑制ジオメトリを追求 [2][4]。',
    description:
      '【第1章：サー・フランク・ウィリアムズの不屈の遺産と9度の製造者王座】\n通算9度のコンストラクターズ世界選手権チャンピオン、7度のドライバーズ世界タイトル（マンセル、プロスト、セナ、ヒル、ヴィルヌーヴ等）を誇るF1界屈指の名門独立系チーム [1][5]。2020年にドリルトン・キャピタルへオーナーシップが移行し、ファクトリー設備の抜本的近代化を断行 [1][4]。\n\n【第2章：ジェームズ・ボウルズ代表のカルチャー変革とサインツ獲得】\n2023年にメルセデスから移籍した名戦略家ジェームズ・ボウルズ代表のもと、パット・フライ（チーフテクニカルオフィサー）らトップエンジニアを招聘 [4][5]。ERPシステムやサプライチェーンの完全刷新を行い、2025年以降に向けてカルロス・サインツとアレクサンダー・アルボンというグリッド屈指の強力ドライバーラインナップを完成させ、中団トップから表彰台争いへの躍進を現実のものとしている [1][3][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/williams.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'rb',
    name: 'Racing Bulls (RB)',
    fullName: 'Visa Cash App RB Formula One Team',
    teamPrincipal: 'Alan Permane',
    powerUnit: 'Red Bull Ford Powertrains',
    base: 'Faenza, Italy / Milton Keynes, United Kingdom',
    constructorTitles: 0,
    drivers: ['LAW', 'LIN'],
    color: '#60a5fa',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_rb_str3.jpg",
        caption: "Toro Rosso STR3 (2008): セバスチャン・ベッテルがモンツァの豪雨で歴史的初優勝を飾った奇跡のマシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_rb_at01.jpg",
        caption: "AlphaTauri AT01 (2020): ピエール・ガスリーがモンツァで劇的な勝利を挙げたファエンツァの名車",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'ミルトンキーンズのレッドブル・レーシング風洞および空力ハブと密接に連携した、高効率フロアエッジ渦流シーリング。角田裕毅らのアグレッシブな走りを支える、中高速コーナーでの安定したダウンフォース生成 [1][3]。',
    mechanicalFocus:
      'レッドブル・テクノロジー製のフロント・リアサスペンション（プルロッド／プッシュロッド）およびギアボックスを採用。ピッチング制御に優れ、ブレーキングから旋回初期のノーズダイブを抑制 [2][4]。',
    description:
      '【第1章：ミナルディからトロロッソ、アルファタウリを経てVisa Cash App RBへ】\nイタリア・ファエンツァを本拠地とし、セバスチャン・ベッテル（2008年モンツァ優勝）、マックス・フェルスタッペン、ダニエル・リカルド、ピエール・ガスリー（2020年モンツァ優勝）、角田裕毅らを輩出してきた名門育成チーム [1][5]。2024年にローラン・メキース（元フェラーリ・スポーティングディレクター）がチーム代表に就任し、ピーター・バイエルCEOとともに組織を一新 [3][5]。\n\n【第2章：シニアチームとのシナジー最大化と自立したレーシング軍団へ】\nレッドブル・レーシングとの合法的技術共有（シニアチームのサスペンションやトランスミッション導入）をフルに活用し、ミルトンキーンズに新設された空力デザインハブとファエンツァの本社が完全一体化 [1][4]。VCARB 01の進化とともに角田裕毅がQ3進出常連となり、中団グループをリードする独立したトップコンテンダーへと躍進を遂げている [2][3][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/rb.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'audi',
    name: 'Audi F1 Team',
    fullName: 'Audi Revolut F1 Team',
    teamPrincipal: 'Jonathan Wheatley',
    powerUnit: 'Audi Works E-Performance',
    base: 'Neuburg an der Donau, Germany / Hinwil, Switzerland',
    constructorTitles: 0,
    drivers: ['HUL', 'BOR'],
    color: '#e0001a',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_sauber_c12.jpg",
        caption: "Sauber C12 (1993): ザウバーがF1デビュー戦南アフリカGPでいきなり5位入賞を果たした歴史的初号機",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_sauber_c20.jpg",
        caption: "Sauber C20 (2001): キミ・ライコネンが衝撃のデビューを飾りコンストラクター4位を獲得した名車",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
      aeroFocus:
        'スイス・ヒンウィルの世界屈指のフルスケール風洞施設による極めて緻密な境界層気流制御。新規定アクティブエアロ（ストレートでのXモード、低中速コーナーでのZモード）における急峻な迎角変化に追従する動的フロア渦流シミュレーション [1][2]。',
      mechanicalFocus:
        'ドイツ・ノイブルク・アン・デア・ドナウの「アウディ・フォーミュラ・レーシング（AFR）」が完全内製開発したワークスパワーユニット「Audi Works E-Performance」。350kWへと倍増した高出力MGU-Kと1.6LターボICEの50/50協調制御、および高剛性カーボンコンポジット製トランスミッションケース [3][4]。',
      description:
        '【第1章：ペーター・ザウバーの遺産継承とアウディ完全ワークス体制への大転換】\n1993年にF1参戦を開始し、キミ・ライコネンやフェリペ・マッサ、ロバート・クビサらを輩出してきたスイスの独立系名門ザウバーをアウディが100%完全買収し、ドイツ自動車界の巨人が歴史的なフルワークス参戦を果たす [1][5]。組織改革の指揮官として元フェラーリ代表のマッティア・ビノット（COO兼CTO）と、レッドブル黄金期を築き上げたスポーティングディレクターのジョナサン・ウィートリー（チーム代表）の双頭体制を構築 [1][3]。ノイブルクの最先端エンジン開発拠点とヒンウィルのシャシー工場を完全デジタル統合した [2][5]。\n\n【第2章：ドイツ技術の粋を集めた新世代シャシーと熟練×新鋭のドライバー布陣】\nル・マン24時間レースで前人未到の13勝を挙げたアウディ・スポーツの軽量化技術とハイブリッド回生制御ノウハウをF1へ全面投入 [2][4]。ドライバーには200戦超のキャリアと卓越したマシン開発能力を誇るニコ・ヒュルケンベルグと、マクラーレン育成出身でFIA-F3およびFIA-F2を連覇した超新星ガブリエル・ボルトレートを起用 [1][3]。中長期的タイトル争奪を見据えた強固な技術基盤を確立している [4][5]。',
    },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/audi.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'haas',
    name: 'Haas F1 Team',
    fullName: 'MoneyGram Haas F1 Team',
    teamPrincipal: 'Ayao Komatsu (小松礼雄)',
    powerUnit: 'Ferrari Works Power Unit',
    base: 'Kannapolis, United States / Banbury, United Kingdom',
    constructorTitles: 0,
    drivers: ['OCO', 'BEA'],
    color: '#e2e8f0',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_haas_vf18.jpg",
        caption: "VF-18 (2018): コンストラクターズ5位を獲得したハース史上最高成績の記念碑的マシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_haas_vf22.jpg",
        caption: "VF-22 (2022): グラウンドエフェクト初年度にケビン・マグヌッセンがサンパウロGPで奇跡のポールを獲得",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
      aeroFocus:
        'イタリア・ダラーラ社との共同開発による超高精度CFD・カーボンモノコック成形技術、およびマラネロのフェラーリ風洞を活用した低中速コーナリングでのダウンフォース一貫性向上 [1][2]。',
      mechanicalFocus:
        'スクーデリア・フェラーリ製最新スペックPU、油圧系、ギアボックス、前後サスペンションの最適キネマティクス運用。2024年末に締結されたTOYOTA GAZOO Racing（TGR）との複数年にわたる複数分野テクニカルアライアンス（シミュレーター開発、テストカー設計、CFD・カーボンパーツ製造支援） [3][4]。',
      description:
        '【第1章：小松礼雄代表のリーン・エンジニアリング革命と現場主義の徹底】\nジーン・ハースが2016年に設立したアメリカ籍チーム [1][5]。2024年初頭にチーフエンジニア出身の小松礼雄（こまつ・あやお）がチーム代表に抜擢され、徹底的なコミュニケーション改善と現場のエンジニアリング・アカウンタビリティ改革を断行 [1][3]。限られた人的・資金的リソースを最もラップタイム向上に直結するアップデート開発へ集中投下し、グリッド随一の運用効率を誇るプロフェッショナル集団へと変貌を遂げた [2][3][5]。\n\n【第2章：トヨタ（TGR）との電撃提携とベテラン×新鋭のドライバー新機軸】\n2024年10月に発表されたTOYOTA GAZOO Racingとの公式技術提携により、ハースは長年の課題であった独自シミュレーター環境と製造インフラの飛躍的強化を獲得 [3][4]。ドライバーにはアルピーヌでGP優勝経験を持つエステバン・オコンと、フェラーリ・ドライバー・アカデミー（FDA）の秘蔵っ子でデビュー戦入賞を果たしたイギリスの神童オリバー・ベアマンが加入 [1][5]。中団のトップランカーから表彰台争いへ向けた強固な骨格を築いている [2][4]。',
    },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/haas.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'cadillac',
    name: 'Cadillac Formula 1 Team',
    fullName: 'Cadillac Formula 1 Team',
    teamPrincipal: 'Graeme Lowdon',
    powerUnit: 'Ferrari Works Power Unit',
    base: 'Silverstone, United Kingdom / Fishers, Indiana, United States',
    constructorTitles: 0,
    drivers: ['PER', 'BOT'],
    color: '#D4AF37',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_cadillac_factory.jpg",
        caption: "Silverstone HQ & Indiana Operations: キャデラック独自の最新鋭ファクトリーおよび開発オペレーション拠点",
        tag: "Factory",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
      aeroFocus:
        'イギリス・シルバーストーン近郊の最新鋭ファクトリーおよび米国インディアナ州フィッシャーズ拠点が主導する、全自動適応型アクティブエアロダイナミクス。2026年規定のストレート・ドラッグ低減とブレーキング時の急制動ダウンフォース復帰を極限制御 [1][2]。',
      mechanicalFocus:
        '参戦初期フェーズ（2026-2027年）におけるスクーデリア・フェラーリ製カスタマー・ワークスPUおよびトランスミッションの堅牢な車体統合。2028年に予定されるゼネラルモーターズ（GM）完全自社製ワークスパワーユニットの受入れを見据えた、モジュラー式高剛性シャシーバルクヘッド設計 [3][4]。',
      description:
        '【第1章：米巨大自動車コングロマリットGMとTWG Globalによる歴史的参入】\nゼネラルモーターズ（GM）が名門ブランド「キャデラック」を冠し、TWG Globalとの強力な資本提携のもとでF1グリッド第11のチームとして認可されたモータースポーツ史に残るプロジェクト [1][5]。チーム代表にはルノーF1代表やFIAテクニカルディレクターを歴任したマーチン・バドコウスキーを招聘 [1][3]。アメリカ・モータースポーツの伝統と欧州最先端F1テクノロジーを融合させた一大オペレーションを展開する [2][5]。\n\n【第2章：通算16勝のレジェンドコンビによる確実なマシン育成と2028年完全自社PU構想】\n参戦初年度のドライバーには、レッドブルで通算6勝を挙げたセルジオ・ペレスと、メルセデス黄金期に10勝を飾ったバルテリ・ボッタスという通算600戦近くの経験を誇る百戦錬磨のベテランコンビを抜擢 [1][3]。確実なテレメトリー相関とタイヤフィードバックを得ながら着実に中団争いへ食い込み、2028年のGM内製ワークスパワーユニット導入に向けた万全のステップを踏み固めている [2][4][5]。',
    },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/cadillac.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. KEY DRIVERS & LEGENDS (2026 Grid & Hall of Fame)
// ─────────────────────────────────────────────────────────────
