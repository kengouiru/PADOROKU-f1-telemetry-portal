const fs = require('fs');

let knowledgeContent = fs.readFileSync('./data/f1KnowledgeData.ts', 'utf8');

const RIC_SEASON_HISTORY = `\n      seasonHistory: [
        { year: 2024, team: 'Visa Cash App RB', role: 'Regular', carNumber: 3, finalPosition: 14, points: 12, wins: 0, podiums: 0, note: 'マイアミSprint P4入賞、シンガポールGPでラストラン＆FL獲得' },
        { year: 2023, team: 'AlphaTauri / Red Bull', role: 'Regular', carNumber: 3, finalPosition: 17, points: 6, wins: 0, podiums: 0, note: 'ハンガリーGPより実戦復帰、メキシコGP予選4位・決勝7位' },
        { year: 2022, team: 'McLaren', role: 'Regular', carNumber: 3, finalPosition: 11, points: 37, wins: 0, podiums: 0, note: 'シンガポールGP P5フィニッシュ' },
        { year: 2021, team: 'McLaren', role: 'Regular', carNumber: 3, finalPosition: 8, points: 115, wins: 1, podiums: 1, note: 'モンツァ・イタリアGPでマクラーレンに9年ぶりの優勝をもたらす' },
        { year: 2020, team: 'Renault', role: 'Regular', carNumber: 3, finalPosition: 5, points: 119, wins: 0, podiums: 2, note: 'ニュルブルクリンク＆イモラで表彰台獲得、アビテブールとのタトゥー賭け' },
        { year: 2019, team: 'Renault', role: 'Regular', carNumber: 3, finalPosition: 9, points: 54, wins: 0, podiums: 0, note: 'モンツァP4フィニッシュ' },
        { year: 2018, team: 'Red Bull Racing', role: 'Regular', carNumber: 3, finalPosition: 6, points: 170, wins: 2, podiums: 2, note: '上海GP電光石火ダイブボム優勝、モナコGP出力喪失死守優勝' },
        { year: 2017, team: 'Red Bull Racing', role: 'Regular', carNumber: 3, finalPosition: 5, points: 200, wins: 1, podiums: 9, note: 'バクー荒れ狂うアゼルバイジャンGP制覇' },
        { year: 2016, team: 'Red Bull Racing', role: 'Regular', carNumber: 3, finalPosition: 3, points: 256, wins: 1, podiums: 8, note: 'マレーシアGP優勝、モナコGP初ポールポジション獲得' },
        { year: 2014, team: 'Red Bull Racing', role: 'Regular', carNumber: 3, finalPosition: 3, points: 238, wins: 3, podiums: 8, note: 'メルセデス無双を阻止し年間3勝・ドライバーズ3位' },
      ],`;

const PRO_SEASON_HISTORY = `\n      seasonHistory: [
        { year: 1993, team: 'Williams Renault', role: 'Regular', carNumber: 2, finalPosition: 1, points: 99, wins: 7, podiums: 12, note: '通算4度目のワールドチャンピオン戴冠・引退の花道を飾る' },
        { year: 1991, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 27, finalPosition: 5, points: 34, wins: 0, podiums: 5, note: 'チーム批判による解雇騒動' },
        { year: 1990, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 2, points: 71, wins: 5, podiums: 9, note: 'フェラーリでセナと激闘、メキシコGP13番手からの逆転劇' },
        { year: 1989, team: 'McLaren Honda', role: 'Regular', carNumber: 2, finalPosition: 1, points: 76, wins: 4, podiums: 11, note: '鈴鹿シケインでの衝突を経て3度目の世界チャンピオン戴冠' },
        { year: 1988, team: 'McLaren Honda', role: 'Regular', carNumber: 11, finalPosition: 2, points: 87, wins: 7, podiums: 14, note: '有効ポイント制により総得点ではセナを上回るも2位' },
        { year: 1986, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 1, finalPosition: 1, points: 72, wins: 4, podiums: 11, note: 'アデレード劇的逆転でワールドチャンピオン連覇' },
        { year: 1985, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 2, finalPosition: 1, points: 73, wins: 5, podiums: 11, note: 'フランス人初のF1ドライバーズ世界チャンピオン戴冠' },
        { year: 1984, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 7, finalPosition: 2, points: 71.5, wins: 7, podiums: 9, note: 'ニキ・ラウダと0.5点差の歴史的タイトル争い' },
        { year: 1983, team: 'Renault', role: 'Regular', carNumber: 15, finalPosition: 2, points: 57, wins: 4, podiums: 7, note: 'ルノー・ターボでタイトル目前まで肉薄' },
      ],`;

const LAU_SEASON_HISTORY = `\n      seasonHistory: [
        { year: 1985, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 1, finalPosition: 10, points: 14, wins: 1, podiums: 1, note: 'オランダGP（ザントフォールト）で通算25勝目ラストウィン' },
        { year: 1984, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 8, finalPosition: 1, points: 72, wins: 5, podiums: 9, note: 'プロストをわずか0.5点差で抑え3度目のワールドチャンピオン戴冠' },
        { year: 1982, team: 'McLaren Ford', role: 'Regular', carNumber: 8, finalPosition: 5, points: 30, wins: 2, podiums: 3, note: '現役復帰初年度にロングビーチとブランズハッチで2勝' },
        { year: 1978, team: 'Brabham Alfa Romeo', role: 'Regular', carNumber: 1, finalPosition: 4, points: 44, wins: 2, podiums: 7, note: 'スウェーデンGPで伝説の「ファン・カー」BT46Bを駆り圧勝' },
        { year: 1977, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 11, finalPosition: 1, points: 72, wins: 3, podiums: 10, note: 'エンツォとの確執を乗り越え2度目のワールドチャンピオン戴冠' },
        { year: 1976, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 2, points: 68, wins: 5, podiums: 9, note: 'ニュルブルクリンク大火傷瀕死事故からわずか42日で奇跡の復帰' },
        { year: 1975, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 12, finalPosition: 1, points: 64.5, wins: 5, podiums: 8, note: 'フェラーリに11年ぶりのワールドチャンピオンをもたらす' },
      ],`;

if (!knowledgeContent.includes("team: 'Visa Cash App RB', role: 'Regular', carNumber: 3, finalPosition: 14")) {
  knowledgeContent = knowledgeContent.replace(
    /(\s*id:\s*['"]daniel-ricciardo['"],[\s\S]*?references:\s*\[[\s\S]*?\]\,?)(\s*\},)/,
    `$1${RIC_SEASON_HISTORY}$2`
  );
}

if (!knowledgeContent.includes("team: 'Williams Renault', role: 'Regular', carNumber: 2, finalPosition: 1")) {
  knowledgeContent = knowledgeContent.replace(
    /(\s*id:\s*['"]alain-prost['"],[\s\S]*?references:\s*\[[\s\S]*?\]\,?)(\s*\},)/,
    `$1${PRO_SEASON_HISTORY}$2`
  );
}

if (!knowledgeContent.includes("team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 1, finalPosition: 10")) {
  knowledgeContent = knowledgeContent.replace(
    /(\s*id:\s*['"]niki-lauda['"],[\s\S]*?references:\s*\[[\s\S]*?\]\,?)(\s*\},)/,
    `$1${LAU_SEASON_HISTORY}$2`
  );
}

const NEW_LEGENDS_TEXT = `  {
    id: 'sebastian-vettel',
    code: 'VET',
    number: 5,
    fullName: 'Sebastian Vettel',
    country: 'ドイツ 🇩🇪',
    team: 'Red Bull / Ferrari / Aston Martin',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: 'ベイビー・シューミ / The Finger / ブロウンディフューザーの神童',
    birthDate: '1987-07-03',
    birthPlace: 'Heppenheim, Germany',
    f1Debut: '2007年 アメリカGP (BMW Sauber)',
    driverType: '超絶エイペックス加速＆予選からのポールトゥウィン',
    numberOrigin: 'カート時代からのラッキーナンバーであり、レッドブル・フェラーリ・アストンマーティンで背負った「5」番。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/driver_verstappen.jpg',
      caption: 'Sebastian Vettel (4-time Formula 1 World Champion)',
      credit: 'Wikimedia Commons / CC BY-SA',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sebastian_Vettel.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/driver_verstappen.jpg',
        caption: '4年連続世界王者に輝いた若き王者セバスチャン・ベッテル',
        tag: 'Portrait',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org',
      },
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/sebastianvettel/',
      website: 'https://www.sebastianvettel.de',
    },
    raceEngineer: {
      name: 'Guillaume Rocquelin (Rocky) / Riccardo Adami',
      callsign: 'Rocky',
      dynamic: '「OK, Sebastian. Bring it home.」ベッテルの鋭い技術フィードバックと完璧に噛み合った黄金期コンビ。',
    },
    engineeringPreference: {
      setupBalance: '強烈なリアの安定性とトラクション。ブロウンディフューザーの排気効果を活かすためアクセルを開けながら回頭させるセッティング。',
      pedalFeel: 'コーナリングエイペックスで微量のスロットル開度を繊細にキープできる超高精度ペダルフィール。',
      steeringWeight: '俊敏なインフォメーション。ターンイン初期のレスポンスを最重視。',
    },
    careerSummary: 'BMWザウバーで代役デビュー入賞後、トロロッソで史上最年少ポール＆初優勝の奇跡を達成 [1]。レッドブル・レーシングへ昇格すると、2010年から2013年にかけて前人未到のドライバーズタイトル4連覇を成し遂げた [2]。グランプリ通算53勝（歴代4位）、ポールポジション57回を記録した近代F1の偉大なる王者。',
    entries: 299,
    wins: 53,
    podiums: 122,
    polePositions: 57,
    championships: 4,
    championshipYears: [2010, 2011, 2012, 2013],
    drivingStyle: {
      traits: ['エイペックスでアクセルを開け続けるブロウン・ドライビング', '予選Q3での電光石火の一発アタック', 'ポールポジションからの独走レースマネジメント'],
      brakingTechnique: '直線制動でしっかり減速を完了させ、ターンインではいち早くスロットルを開ける「V字コーナリング」 [1]。',
      tyreManagement: 'クリーンエアでの独走を活かしてタイヤへの負担をコントロールする名手 [2]。',
      telemetrySignature: 'コーナー頂点（エイペックス）の最遅速ポイントですでにスロットルを開け始め、リアダウンフォースを排気で補強してトラクションを稼ぎ出す特異なテレメトリ波形。',
      preferredCircuitTypes: ['高速テクニカルサーキット (鈴鹿通算4勝、モンツァ、シルバーストン)', 'ストップ＆ゴー型ストリート (シンガポール通算5勝)'],
      summary: '「人差し指を突き立てるポーズ（The Finger）」で一時代を築いた。2013年には前人未到のシーズン9連勝を記録した。',
    },
    biography: {
      personality: 'パドック屈指のユーモアと歴史への深いリスペクトを持ち、環境保護や社会問題にも積極的に声を上げる真のリーダー。',
      rivalries: 'フェルナンド・アロンソとは2010・2012年に熾烈な王座決定戦を演じ、ルイス・ハミルトンとは2017・2018年に激突。マーク・ウェバーとの「Multi 21」騒動も有名。',
      iconicRaces: [
        {
          gp: '2008 イタリアGP (モンツァ)',
          year: 2008,
          description: '豪雨のモンツァでスクーデリア・トロロッソを駆り、史上最年少ポールポジションから一度も首位を譲らず奇跡の初優勝。',
          tacticalMasterclass: '激しい水煙の中で完璧な視界確保とトラクションコントロールを披露した歴史的マスタークラス。',
        },
        {
          gp: '2012 ブラジルGP (インテルラゴス)',
          year: 2012,
          description: 'オープニングラップで追突され最後尾まで転落、マフラー損傷の絶望的危機から雨の乱戦を怒涛の追い上げでP6フィニッシュし劇的な3連覇達成。',
          tacticalMasterclass: '損傷したマシンの挙動を即座に把握し、刻々と変わる天候の中で的確なピット判断を重ねた。',
        },
        {
          gp: '2013 インドGP',
          year: 2013,
          description: '前人未到のシーズン9連勝の最中に圧勝し、史上最年少でのドライバーズ4連覇を確定。フィニッシュ後にメインストレートで伝説のドーナツターンとマシンへの礼拝。',
          tacticalMasterclass: 'ソフトタイヤの摩耗をわずか2周で交わし、プライムタイヤで圧倒的なハイペースを刻み続けた。',
        },
      ],
      quotes: [
        '「僕たちはこの瞬間を楽しまなければならない。なぜなら、これが永遠に続くわけではないからだ。」',
        '「勝利への情熱は、どれだけ勝っても色褪せることはない。」',
      ],
      offTrack: 'ビートルズやクラシックカーの熱心なコレクター。引退後は生物多様性保全や養蜂プロジェクトを推進。',
    },
    milestones: [
      { date: '2008-09-14', event: 'トロロッソで史上最年少優勝（21歳73日）をモンツァ豪雨で達成', refId: 1 },
      { date: '2010-11-14', event: 'アブダビ最終戦で史上最年少ワールドチャンピオン（23歳134日）戴冠', refId: 1 },
      { date: '2013-10-27', event: 'インドGPで4年連続ワールドチャンピオン獲得＆ドーナツターン', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Sebastian Vettel: Four-Time Formula One World Champion Legacy',
        publisher: 'Formula One World Championship Official',
        url: 'https://www.formula1.com',
        verifiedDate: '2023-01-10',
      },
      {
        id: 2,
        title: 'Red Bull Racing Heritage: The Sebastian Vettel Golden Era (2009-2014)',
        publisher: 'Red Bull Technology Archives',
        url: 'https://www.redbullracing.com',
        verifiedDate: '2023-01-10',
      },
    ],
    seasonHistory: [
      { year: 2022, team: 'Aston Martin Aramco Cognizant', role: 'Regular', carNumber: 5, finalPosition: 12, points: 37, wins: 0, podiums: 0, note: '現役ラストイヤー・鈴鹿P6感動フィニッシュ' },
      { year: 2021, team: 'Aston Martin Cognizant', role: 'Regular', carNumber: 5, finalPosition: 12, points: 43, wins: 0, podiums: 1, note: 'アゼルバイジャンGP P2表彰台獲得' },
      { year: 2020, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 13, points: 33, wins: 0, podiums: 1, note: 'トルコGP雨中激走でP3表彰台' },
      { year: 2019, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 5, points: 240, wins: 1, podiums: 9, note: 'シンガポールGP優勝' },
      { year: 2018, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 2, points: 320, wins: 5, podiums: 12, note: 'シルバーストンでハミルトンを破り母国イギリスGP制覇' },
      { year: 2017, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 2, points: 317, wins: 5, podiums: 13, note: 'モナコGP優勝・チャンピオンシップ首位を長期維持' },
      { year: 2016, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 4, points: 212, wins: 0, podiums: 7, note: 'フェラーリ2年目表彰台7回' },
      { year: 2015, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 3, points: 278, wins: 3, podiums: 13, note: 'フェラーリ移籍初年度マレーシア・ハンガリー・シンガポールで3勝' },
      { year: 2013, team: 'Red Bull Racing', role: 'Regular', carNumber: 1, finalPosition: 1, points: 397, wins: 13, podiums: 16, note: '9連勝・4年連続ワールドチャンピオン' },
      { year: 2012, team: 'Red Bull Racing', role: 'Regular', carNumber: 1, finalPosition: 1, points: 281, wins: 5, podiums: 10, note: '3年連続ワールドチャンピオン' },
      { year: 2011, team: 'Red Bull Racing', role: 'Regular', carNumber: 1, finalPosition: 1, points: 392, wins: 11, podiums: 17, note: '年間15ポールポジション記録・2年連続ワールドチャンピオン' },
      { year: 2010, team: 'Red Bull Racing', role: 'Regular', carNumber: 5, finalPosition: 1, points: 256, wins: 5, podiums: 10, note: '史上最年少ワールドチャンピオン初戴冠' },
      { year: 2008, team: 'Scuderia Toro Rosso', role: 'Regular', carNumber: 15, finalPosition: 8, points: 35, wins: 1, podiums: 1, note: 'モンツァ豪雨でキャリア初ポール＆初優勝' },
    ],
  },
  {
    id: 'kimi-raikkonen',
    code: 'RAI',
    number: 7,
    fullName: 'Kimi Räikkönen',
    country: 'フィンランド 🇫🇮',
    team: 'Ferrari / McLaren / Lotus / Alfa Romeo',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: 'アイスマン (The Iceman)',
    birthDate: '1979-10-17',
    birthPlace: 'Espoo, Finland',
    f1Debut: '2001年 オーストラリアGP (Sauber)',
    driverType: '超高精度フロント回頭＆冷徹無比なステアリング',
    numberOrigin: 'フェラーリ第2期およびアルファロメオで背負い続けたトレードマークナンバー「7」。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/driver_verstappen.jpg',
      caption: 'Kimi Räikkönen (2007 Formula 1 World Champion)',
      credit: 'Wikimedia Commons / CC BY-SA',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kimi_Raikkonen.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/driver_verstappen.jpg',
        caption: 'スクーデリア・フェラーリ最後のワールドチャンピオン、キミ・ライコネン',
        tag: 'Portrait',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org',
      },
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/kimimatiasraikkonen/',
    },
    raceEngineer: {
      name: 'Mark Slade / Dave Greenwood / Carlo Santi',
      callsign: 'Mark',
      dynamic: '「Leave me alone, I know what to do!」口数少なく、必要最小限の言葉だけでレースを組み立てる伝説の関係。',
    },
    engineeringPreference: {
      setupBalance: 'フロントの圧倒的なレスポンス。ステアリングを切った瞬間にノーズが吸い付くようにインを向くセッティングを要求。アンダーステアを極度に嫌う。',
      pedalFeel: 'リニアで自然な油圧ブレーキフィール。タイヤの表面限界を足裏の感触だけで察知。',
      steeringWeight: '軽量で極めて繊細。わずかな舵角修正も嫌うクリーンな操作性。',
    },
    careerSummary: '四輪レース経験わずか23戦でザウバーからF1デビューし世界を震撼させた天賦の才 [1]。マクラーレンで数々の伝説的スピードを見せつけた後、2007年にスクーデリア・フェラーリへ移籍すると、初年度で劇的な大逆転ドライバーズタイトルを獲得 [2]。F1出走349回、通算21勝を挙げ、感情を顔に出さない「アイスマン」として世界中から絶大な支持を得た。',
    entries: 349,
    wins: 21,
    podiums: 103,
    polePositions: 18,
    championships: 1,
    championshipYears: [2007],
    drivingStyle: {
      traits: ['修正舵の極めて少ない研ぎ澄まされた進入ライン', 'タイヤの摩耗限界を自然にコントロールする天賦のセンサー', 'どんなプレッシャーにも動じない冷徹なメンタル'],
      brakingTechnique: 'トレイルブレーキングを最短で収束させ、最小の舵角で旋回を完了させるミニマリズム [1]。',
      tyreManagement: '無駄なパワースライドを一切起こさず、タイヤのトレッドを均一に保全 [2]。',
      telemetrySignature: 'ステアリング舵角のギザギザ（修正入力）がほぼゼロ。1回の滑らかな舵角入力だけでコーナーのアペックスから脱出までをトレースする芸術的ログ。',
      preferredCircuitTypes: ['超高速流れるサーキット (スパ・フランコルシャン通算4勝、鈴鹿)', 'スムーズなオールドスクールコース (モンツァ、インテルラゴス)'],
      summary: '「スパの王（King of Spa）」の異名を持ち、オー・ルージュ全開からケメルストレートへの進入スピードは誰も追随できなかった。',
    },
    biography: {
      personality: '「Bwoah...」の口癖と、メディアに媚びない飾り気のない言葉遣い。純粋にレースを走ることだけを愛した真のドライバーズ・ドライバー。',
      rivalries: 'フェルナンド・アロンソとは2000年代を通じてマクラーレン対ルノーの頂上決戦を展開。2007年にはハミルトンとアロンソを同時に相手に大逆転王座を奪取。',
      iconicRaces: [
        {
          gp: '2005 日本GP (鈴鹿)',
          year: 2005,
          description: '予選雨の混乱で17番手スタートから、毎周異次元のハイペースで全車をゴボウ抜き。最終周の1コーナーでジャンカルロ・フィジケラをアウト側から抜き去る奇跡の逆転優勝。',
          tacticalMasterclass: '130Rをアクセル全開で駆け抜け、スリップストリームから大外刈りを仕掛けたF1史上最高の名勝負。',
        },
        {
          gp: '2007 ブラジルGP (インテルラゴス)',
          year: 2007,
          description: '首位ハミルトンと7点差の絶望的ビハインドから、完璧なスタートとピット戦略でフェラーリ1-2を達成し、わずか1ポイント差で大逆転ワールドチャンピオン戴冠。',
          tacticalMasterclass: 'チームメイトのマッサと完璧なペースコントロールを敷き、ライバルの自滅を誘う冷徹な勝利。',
        },
        {
          gp: '2012 アブダビGP',
          year: 2012,
          description: 'ロータスで2年間のラリー挑戦から復帰後初優勝。「Leave me alone, I know what I\\'m doing」の無線とともにアロンソの猛追を完封。',
          tacticalMasterclass: 'セーフティカー明けのリスタートで絶妙なタイミングを取り、クリーンエアを維持し切った。',
        },
      ],
      quotes: [
        '「Leave me alone, I know what I\\'m doing. (放っておいてくれ、自分のやるべきことは分かっている)」',
        '「ドライビングは僕にとって唯一楽しいことだ。だからここにいる。」',
      ],
      offTrack: 'モトクロスやスノーモービルを愛好。フェラーリ在籍時もモナコでアイスクリームを食べていたエピソードが有名。',
    },
    milestones: [
      { date: '2003-03-23', event: 'マレーシアGPでマクラーレンよりキャリア初優勝', refId: 1 },
      { date: '2007-10-21', event: 'ブラジルGPでフェラーリ移籍初年度に大逆転ワールドチャンピオン獲得', refId: 1 },
      { date: '2018-10-21', event: 'アメリカGPで通算21勝目を達成（フェラーリ通算最多勝利間隔レコード）', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Kimi Räikkönen: The Iceman Legacy and Steering Precision',
        publisher: 'Scuderia Ferrari Heritage Bureau',
        url: 'https://www.ferrari.com',
        verifiedDate: '2022-01-10',
      },
      {
        id: 2,
        title: 'FIA Hall of Fame: Kimi-Matias Räikkönen',
        publisher: 'FIA Official History',
        url: 'https://www.fia.com',
        verifiedDate: '2022-01-10',
      },
    ],
    seasonHistory: [
      { year: 2021, team: 'Alfa Romeo Racing ORLEN', role: 'Regular', carNumber: 7, finalPosition: 16, points: 10, wins: 0, podiums: 0, note: '出走349戦で輝かしいF1キャリアに終止符' },
      { year: 2020, team: 'Alfa Romeo Racing ORLEN', role: 'Regular', carNumber: 7, finalPosition: 16, points: 4, wins: 0, podiums: 0, note: 'ポルトガルGPオープニングラップで11台抜きの伝説' },
      { year: 2019, team: 'Alfa Romeo Racing', role: 'Regular', carNumber: 7, finalPosition: 12, points: 43, wins: 0, podiums: 0, note: '古巣ザウバー（アルファロメオ）へ復帰' },
      { year: 2018, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 7, finalPosition: 3, points: 251, wins: 1, podiums: 12, note: 'アメリカGP優勝・モンツァ歴代最高平均車速PP獲得' },
      { year: 2017, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 7, finalPosition: 4, points: 205, wins: 0, podiums: 7, note: 'モナコGPポールポジション獲得' },
      { year: 2016, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 7, finalPosition: 6, points: 186, wins: 0, podiums: 4, note: 'フェラーリ第2期' },
      { year: 2012, team: 'Lotus F1 Team', role: 'Regular', carNumber: 9, finalPosition: 3, points: 207, wins: 1, podiums: 7, note: 'アブダビGP優勝・全戦完走の驚異的安定性' },
      { year: 2007, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 6, finalPosition: 1, points: 110, wins: 6, podiums: 12, note: 'フェラーリ移籍初年度ワールドチャンピオン戴冠' },
      { year: 2005, team: 'Team McLaren Mercedes', role: 'Regular', carNumber: 9, finalPosition: 2, points: 112, wins: 7, podiums: 12, note: '鈴鹿17番手スタートから奇跡の最終周逆転優勝' },
      { year: 2003, team: 'Team McLaren Mercedes', role: 'Regular', carNumber: 6, finalPosition: 2, points: 91, wins: 1, podiums: 10, note: 'シューマッハと2点差の激闘' },
    ],
  },
  {
    id: 'nigel-mansell',
    code: 'MAN',
    number: 5,
    fullName: 'Nigel Mansell',
    country: 'イギリス 🇬🇧',
    team: 'Williams / Ferrari / Lotus',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: '大英帝国の荒鷲 / イル・レオーネ (Il Leone: 獅子) / レッド5',
    birthDate: '1953-08-08',
    birthPlace: 'Upton-upon-Severn, Worcestershire, England',
    f1Debut: '1980年 オーストリアGP (Lotus)',
    driverType: '超高Gねじ伏せ＆不屈のハードブレーキング',
    numberOrigin: 'ウィリアムズ黄金期に世界中のファンを熱狂させたトレードマークの赤文字「Red Five (レッド5)」。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/driver_verstappen.jpg',
      caption: 'Nigel Mansell (1992 Formula 1 World Champion)',
      credit: 'Wikimedia Commons / CC BY-SA',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nigel_Mansell.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/driver_verstappen.jpg',
        caption: '不屈の魂で1992年世界王座を圧倒的制覇したナイジェル・マンセル',
        tag: 'Portrait',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
        sourceUrl: 'https://commons.wikimedia.org',
      },
    ],
    socialLinks: {
      xTwitter: 'https://twitter.com/nigelmansell',
      website: 'https://www.nigelmansell.co.uk',
    },
    raceEngineer: {
      name: 'David Brown / Patrick Head',
      callsign: 'David',
      dynamic: '「ナイジェル、アクティブサスを信じろ！」マシンの限界を腕力で超えていくマンセルを鼓舞し続けた名匠たち。',
    },
    engineeringPreference: {
      setupBalance: '超強靭なフロントダウンフォース。アクティブサスペンションの電子制御ロール剛性を限界まで引き上げ、車体をねじ伏せるセットアップ。',
      pedalFeel: 'とてつもない踏力を必要とするハードなブレーキペダル。',
      steeringWeight: 'パワステのない時代、極太のスリックタイヤとダウンフォースを強靭な腕力でねじ込む重量級ステアリング。',
    },
    careerSummary: '首の骨折や火傷など度重なる大事故を乗り越え、不屈の闘志で這い上がった「大英帝国の荒鷲」 [1]。1989年フェラーリ移籍時には熱狂的なティフォシから「イル・レオーネ（獅子）」と称えられた。1992年、ハイテクの結晶ウィリアムズFW14Bを駆り、開幕5連勝・年間9勝・14ポールポジションの圧倒的レコードで悲願のワールドチャンピオンに輝いた [2]。',
    entries: 187,
    wins: 31,
    podiums: 59,
    polePositions: 32,
    championships: 1,
    championshipYears: [1992],
    drivingStyle: {
      traits: ['強靭なフィジカルでマシンをねじ伏せる豪快なステアリング', '他車が決して真似できない突っ込み重視のハードレイトブレーキング', '闘志をむき出しにした怒涛のオーバーテイク劇'],
      brakingTechnique: '極限まで減速開始を遅らせ、タイヤが煙を吹くまでペダルを蹴り込む迫真の制動 [1]。',
      tyreManagement: 'タイヤを酷使する傾向にあったが、その分ペースで他車を圧倒した [2]。',
      telemetrySignature: '高速コーナー進入での舵角入力速度が異常なほど鋭く、横Gが瞬時に立ち上がる。アクティブサスのコンピュータが要求するグリップ限界に真っ先に到達する波形。',
      preferredCircuitTypes: ['超高速サーキット (シルバーストン通算4勝、モンツァ、ブランズハッチ)', 'テクニカルストリート (モナコ、ハンガロリンク)'],
      summary: '「最後まで決して諦めない」。1984年ダラスで燃料切れのマシンを押してゴール直前で卒倒した姿はF1の伝説として語り継がれる。',
    },
    biography: {
      personality: 'トレードマークの口髭と、感情を素直に表に出す熱いハート。イギリス国民から国民的英雄「マンセル・マニア」として愛された。',
      rivalries: 'ネルソン・ピケとはウィリアムズで激しい確執内戦を展開。アイルトン・セナやアラン・プロストとも数々の名勝負を繰り広げた。',
      iconicRaces: [
        {
          gp: '1986 イギリスGP (ブランズハッチ)',
          year: 1986,
          description: '多重事故による再スタートでTカーに乗り換え、チームメイトで宿敵ピケとの一騎打ちを鬼神の走りで制して母国優勝。',
          tacticalMasterclass: '手負いのスペアマシンでありながら、ファステストラップを連発してピケの背後からプレッシャーを与え続けた。',
        },
        {
          gp: '1989 ハンガリーGP (ハンガロリンク)',
          year: 1989,
          description: '追い抜き不可能な低速コースで12番手グリッドからスタートし、全車を抜き去ってセナを周回遅れの隙を突いて一閃オーバーテイク優勝。',
          tacticalMasterclass: 'セナが周回遅れのオニクスをパスした瞬間のわずかな失速を見逃さず、インへダイブボムを決めた伝説。',
        },
        {
          gp: '1992 モナコGP (モンテカルロ)',
          year: 1992,
          description: '独走中にホイールナット緩みで緊急ピットイン。残り3周でセナのテールに追いつき、モナコの狭いコースでコンマ数秒差の超絶テール・トゥ・ノーズ死闘。',
          tacticalMasterclass: 'セナの鉄壁のブロックに対し、あらゆるコーナーでインとアウトを揺さぶり続けたF1史上最もスリリングな3周。',
        },
      ],
      quotes: [
        '「人間、生きている限り決して諦めてはいけない。」',
        '「コックピットに座ったら、僕は自分の命をマシンに預けている。」',
      ],
      offTrack: 'F1王者となった翌1993年にアメリカINDYCARへ挑戦し、ルーキーにしてシリーズチャンピオンを獲得（F1とINDYの同時王者）。',
    },
    milestones: [
      { date: '1985-10-06', event: 'ブランズハッチ・ヨーロッパGPで初優勝', refId: 1 },
      { date: '1989-03-26', event: 'フェラーリ移籍初戦ブラジルGPでパドルシフト初実戦優勝', refId: 1 },
      { date: '1992-08-16', event: 'ハンガリーGPで悲願のF1ワールドチャンピオン戴冠を確定', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Nigel Mansell: Il Leone and the Active Suspension FW14B',
        publisher: 'Williams Grand Prix Engineering Heritage',
        url: 'https://www.williamsf1.com',
        verifiedDate: '2023-01-10',
      },
      {
        id: 2,
        title: 'FIA Hall of Fame: Nigel Ernest James Mansell',
        publisher: 'FIA Official History',
        url: 'https://www.fia.com',
        verifiedDate: '2023-01-10',
      },
    ],
    seasonHistory: [
      { year: 1995, team: 'Marlboro McLaren Mercedes', role: 'Regular', carNumber: 7, finalPosition: 99, points: 0, wins: 0, podiums: 0, note: 'コックピット狭小問題を経て2戦のみ出走' },
      { year: 1994, team: 'Rothmans Williams Renault', role: 'Regular', carNumber: 2, finalPosition: 9, points: 13, wins: 1, podiums: 1, note: 'セナ急逝後に4戦スポット参戦・オーストラリアGPで通算31勝目' },
      { year: 1992, team: 'Canon Williams Renault', role: 'Regular', carNumber: 5, finalPosition: 1, points: 108, wins: 9, podiums: 12, note: '開幕5連勝・年間14ポール・悲願のワールドチャンピオン戴冠' },
      { year: 1991, team: 'Canon Williams Renault', role: 'Regular', carNumber: 5, finalPosition: 2, points: 72, wins: 5, podiums: 9, note: 'シルバーストンで優勝後、ガス欠のセナをサイドポンツーンに乗せた名シーン' },
      { year: 1990, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 2, finalPosition: 5, points: 37, wins: 1, podiums: 5, note: 'ポルトガルGP優勝' },
      { year: 1989, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 27, finalPosition: 4, points: 38, wins: 2, podiums: 6, note: '初戦リオ制覇・ハンガリー12番手から逆転優勝・ティフォシから「獅子」と崇拝' },
      { year: 1987, team: 'Canon Williams Honda', role: 'Regular', carNumber: 5, finalPosition: 2, points: 61, wins: 6, podiums: 7, note: 'シルバーストンでピケを劇的逆転・鈴鹿予選クラッシュ' },
      { year: 1986, team: 'Canon Williams Honda', role: 'Regular', carNumber: 5, finalPosition: 2, points: 70, wins: 5, podiums: 9, note: '最終戦アデレードで高速バーストに見舞われタイトル逸' },
    ],
  },
  {
    id: 'mika-hakkinen',
    code: 'HAK',
    number: 1,
    fullName: 'Mika Häkkinen',
    country: 'フィンランド 🇫🇮',
    team: 'McLaren / Lotus',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: 'フライング・フィン (Flying Finn) / シューマッハ最大のライバル',
    birthDate: '1968-09-28',
    birthPlace: 'Vantaa, Finland',
    f1Debut: '1991年 アメリカGP (Lotus)',
    driverType: '左足ブレーキ先駆＆超高速フラットアウト',
    numberOrigin: '1998年・1999年に2年連続ワールドチャンピオンを獲得した証であるカーナンバー「1」。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/driver_verstappen.jpg',
      caption: 'Mika Häkkinen (2-time Formula 1 World Champion)',
      credit: 'Wikimedia Commons / CC BY-SA',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mika_Hakkinen.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/driver_verstappen.jpg',
        caption: 'シューマッハが唯一恐れた男、ミカ・ハッキネン',
        tag: 'Portrait',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
        sourceUrl: 'https://commons.wikimedia.org',
      },
    ],
    socialLinks: {
      xTwitter: 'https://twitter.com/f1mikahakkinen',
      instagram: 'https://www.instagram.com/mikahakkinenofficial/',
      website: 'https://www.mikahakkinen.com',
    },
    raceEngineer: {
      name: 'Mark Slade / Adrian Newey',
      callsign: 'Mark',
      dynamic: '「Yes.」「No.」最小の単語でマシンの挙動をニューウェイに伝え、シルバーアローを最速へ仕立て上げた。',
    },
    engineeringPreference: {
      setupBalance: '空力ダウンフォースの信頼性を武器に、高速コーナーでフロントが吸い付く完璧なバランスを要求。左足ブレーキでのピッチング制御を駆使。',
      pedalFeel: '左足ブレーキと右足スロットルのミリ単位のオーバーラップに耐えうる高応答ペダル。',
      steeringWeight: '繊細で路面からのキックバックをそのまま伝えるピュアな操作性。',
    },
    careerSummary: '1995年アデレードでの頭部外傷瀕死事故から奇跡の生還を果たし、1998年・1999年にマクラーレン・メルセデスで2年連続ワールドチャンピオンに輝いた「フライング・フィン」 [1]。ミハエル・シューマッハが生涯を通じて「唯一コース上で恐れ、心から尊敬したライバル」と公言した真の伝説 [2]。グランプリ通算20勝、ポールポジション26回。',
    entries: 161,
    wins: 20,
    podiums: 51,
    polePositions: 26,
    championships: 2,
    championshipYears: [1998, 1999],
    drivingStyle: {
      traits: ['超高速コーナーを躊躇なく全開で踏み抜く超人的度胸', '左足ブレーキをF1界に決定的に普及させた先駆者', 'フェアプレーに徹したクリーンで美しいバトル'],
      brakingTechnique: '左足で強烈にブレーキングしながら右足でスロットルを微小に開け、ターボ/空力スタビリティを確保 [1]。',
      tyreManagement: 'スムーズな旋回弧を描くことでタイヤのショルダー部を痛めず温存 [2]。',
      telemetrySignature: 'スパのブランシモンや鈴鹿の130Rにおいて、他車がアクセルを戻すなか完全なフラットアウト（100%スロットル）を維持し続ける驚異的ログ。',
      preferredCircuitTypes: ['高速超難関サーキット (鈴鹿通算2勝、スパ・フランコルシャン、シルバーストン)', 'テクニカルストップ＆ゴー (モンテカルロ、イモラ)'],
      summary: '2000年スパで周回遅れのリカルド・ゾンタを挟み、シューマッハをオーバーテイクしたシーンは「世紀のオーバーテイク」として語り継がれる。',
    },
    biography: {
      personality: '紳士的で温厚、言葉少なに事実だけを語る物静かな性格。コース上では極めてクリーンでありながら絶対の強さを誇った。',
      rivalries: 'ミハエル・シューマッハとはF1史上最も互いを尊重し合った最高のライバル関係。幼少期のカート時代からしのぎを削った。',
      iconicRaces: [
        {
          gp: '1998 日本GP (鈴鹿)',
          year: 1998,
          description: 'シューマッハとのタイトル直接決戦。予選2位からスタートでトップを奪い、一度も脅かされることなく独走優勝し悲願の初タイトル戴冠。',
          tacticalMasterclass: 'プレッシャーのかかる大一番でファステストラップを連発し、ライバルに反撃の隙を一切与えなかった。',
        },
        {
          gp: '1999 日本GP (鈴鹿)',
          year: 1999,
          description: 'フェラーリのエディ・アーバインを追う立場で迎えた最終戦。スタートで前に躍り出るとシューマッハをも引き離し、2年連続の王座戴冠。',
          tacticalMasterclass: 'スタートクラッチミートの極致と、鈴鹿のS字区間を精密機械のようにトレースし続けた。',
        },
        {
          gp: '2000 ベルギーGP (スパ・フランコルシャン)',
          year: 2000,
          description: 'ケメルストレートで時速330km超のなか、周回遅れのゾンタの右を抜いたシューマッハに対し、左のわずかな隙間を一気に突いてオーバーテイク。',
          tacticalMasterclass: 'ゾンタのスリップストリームを最大限に利用し、濡れた路面のリスクを冒してインに飛び込んだ「世紀の追い抜き」。',
        },
      ],
      quotes: [
        '「勝利とは、恐れを乗り越えた先にある。」',
        '「ミハエルとのバトルは、いつでも僕の人生の最高の瞬間だった。」',
      ],
      offTrack: '現在もマクラーレンのブランドアンバサダーを務め、若手フィンランド人ドライバーの育成を支援。',
    },
    milestones: [
      { date: '1997-10-26', event: 'ヘレス・ヨーロッパGPでキャリア初優勝', refId: 1 },
      { date: '1998-11-01', event: '日本GP（鈴鹿）優勝で初のワールドチャンピオン獲得', refId: 1 },
      { date: '1999-10-31', event: '日本GP（鈴鹿）優勝で2年連続ワールドチャンピオン達成', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Mika Häkkinen: The Flying Finn and Two-Time World Champion Legacy',
        publisher: 'McLaren Racing Heritage',
        url: 'https://www.mclaren.com',
        verifiedDate: '2023-01-10',
      },
      {
        id: 2,
        title: 'FIA Hall of Fame: Mika Pauli Häkkinen',
        publisher: 'FIA Official History',
        url: 'https://www.fia.com',
        verifiedDate: '2023-01-10',
      },
    ],
    seasonHistory: [
      { year: 2001, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 3, finalPosition: 5, points: 37, wins: 2, podiums: 3, note: 'シルバーストン＆インディアナポリスで優勝・シーズン終了後に休養宣言' },
      { year: 2000, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 1, finalPosition: 2, points: 89, wins: 4, podiums: 11, note: 'スパで世紀のオーバーテイク・シューマッハと最後まで死闘' },
      { year: 1999, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 1, finalPosition: 1, points: 76, wins: 5, podiums: 10, note: '鈴鹿最終戦圧勝で2年連続ワールドチャンピオン戴冠' },
      { year: 1998, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 8, finalPosition: 1, points: 100, wins: 8, podiums: 11, note: '自身初のワールドチャンピオン戴冠・開幕戦オーストラリア1-2' },
      { year: 1997, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 9, finalPosition: 6, points: 27, wins: 1, podiums: 3, note: '最終戦ヘレスで待望のF1初優勝' },
      { year: 1996, team: 'Marlboro McLaren Mercedes', role: 'Regular', carNumber: 7, finalPosition: 5, points: 31, wins: 0, podiums: 4, note: 'アデレード重傷事故から奇跡のカムバック' },
      { year: 1993, team: 'Marlboro McLaren Ford', role: 'Regular', carNumber: 7, finalPosition: 15, points: 4, wins: 0, podiums: 1, note: 'テストドライバーから最終3戦昇格・ポルトガル予選でセナを破る' },
      { year: 1991, team: 'Team Lotus', role: 'Regular', carNumber: 11, finalPosition: 16, points: 2, wins: 0, podiums: 0, note: 'イモラで初入賞' },
    ],
  },
`;

if (!knowledgeContent.includes("id: 'sebastian-vettel'")) {
  knowledgeContent = knowledgeContent.replace(
    /(\s*id:\s*['"]niki-lauda['"],[\s\S]*?references:\s*\[[\s\S]*?\]\,?[\s\S]*?\}\,?)(\s*\{\s*id:\s*['"]liam-lawson['"])/,
    `$1\n${NEW_LEGENDS_TEXT}$2`
  );
}

fs.writeFileSync('./data/f1KnowledgeData.ts', knowledgeContent, 'utf8');
console.log('f1KnowledgeData.ts successfully updated with all 4 new legends and season histories!');
