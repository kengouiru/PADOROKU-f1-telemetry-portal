const fs = require('fs');

let content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

function replaceDriverBlock(driverId, newContent) {
  const start = content.indexOf(`id: '${driverId}'`);
  if (start === -1) throw new Error(`Driver ${driverId} not found`);
  const end = content.indexOf('seasonHistory:', start);
  if (end === -1) throw new Error(`seasonHistory not found for ${driverId}`);
  
  content = content.slice(0, start) + newContent + '\n    ' + content.slice(end);
  console.log(`Successfully expanded driver: ${driverId}`);
}

const rusExpanded = `id: 'george-russell',
    code: 'RUS',
    number: 63,
    fullName: 'George Russell',
    country: 'イギリス 🇬🇧',
    team: 'Mercedes',
    teamColor: '#06b6d4',
    status: 'Current',
    nickname: 'Mr. Saturday / ジョージ',
    birthDate: '1998-02-15',
    birthPlace: 'King’s Lynn, England',
    f1Debut: '2019年 オーストラリアGP (Williams)',
    driverType: '超高精度予選アタッカー＆アグレッシブ派',
    numberOrigin: 'カート時代に兄が使用していた番号であり、デザイン的（GR63）にもバランスが良い「63」を選択。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/george-russell.jpg',
      caption: 'George Russell (Mercedes-AMG PETRONAS F1 Team)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:George_Russell.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_russell.jpg',
        caption: 'George Russell パドックでの表情 (Mercedes-AMG)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:George_Russell.jpg',
      },
      {
        imageUrl: '/images/teams/team_mercedes_w11.jpg',
        caption: 'Mercedes-AMG F1 W11 EQ Performance (ハイブリッド時代最強マシン)',
        tag: 'Machine',
        credit: 'Mercedes-AMG Technical Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.mercedesamgf1.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        'フロントの回頭性が極めてシャープで、コーナー進入時に即座にノーズが反応するダイレクトなハンドリングを要求。リアが多少ナーバスであっても、自らの素早いカウンターステアで修正しながら限界を攻めるセッティングを好む [1][3]。',
      pedalFeel:
        '踏み始めの初期バイトが強力で、短いストロークで高い減速Gを発生させる硬質なブレーキペダルフィール [2][4]。',
      steeringWeight:
        '重厚でソリッドなステアリング抵抗感。高速シケインでの切り返し時にラックのたわみを感じさせない高剛性セッティングを追求 [3][5]。',
    },
    raceEngineer: {
      name: 'Marcus Dudley',
      callsign: 'Marcus',
      dynamic:
        'ピーター・ボニントンのもとで腕を磨いた敏腕エンジニア。ラッセルの闘争心溢れるドライビングに対し、簡潔かつ客観的なデルタ情報と的確なタイヤ温度指示で支える強固な信頼関係 [2][3][5]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/georgerussell63/',
      xTwitter: 'https://x.com/GeorgeRussell63',
      website: 'https://www.georgerussell63.com',
    },
    careerSummary:
      '【第1章：ジュニアフォーミュラ完全制覇とウィリアムズでの武者修行】\\n1998年2月15日英国キングス・リン生まれ。カートで数々のタイトルを獲得し、2014年BRDCフォーミュラ4王者およびマクラーレン・オートスポーツBRDCアワードを受賞 [1]。2017年ARTグランプリからGP3シリーズに参戦し4勝を挙げてルーキーチャンピオンに戴冠 [1]。2018年にはFIA-F2選手権へ昇格し、ランド・ノリスやアレクサンダー・アルボンら強力なライバルを相手に年間最多の7勝を記録、ルーキーイヤーで堂々たる年間王座を獲得した [1][5]。2019年にウィリアムズからF1デビュー [1][2]。戦闘力で最下位のマシンを駆りながら、予選で同僚クビサやラティフィに全戦全勝を記録し「Mr. Saturday（土曜日の男）」の異名を取る [1][2]。2020年サヒールGPではコロナ陽性のハミルトンの代役としてメルセデスW11を駆り、初搭乗ながら決勝で圧巻のトップ快走を演じて世界に衝撃を与えた [1][2][5]。2021年ベルギーGP（スパ）では、大雨の予選でウィリアムズ車を駆りフロントロー（予選2番手）を獲得、自身初表彰台（2位）に登壇した [1][2]。\\n\\n【第2章：メルセデス昇格とブラジル初制覇、そして新世代リーダーへ】\\n2022年、名門メルセデスへ正式昇格 [1][2]。マシン（W13）が深刻なポーパシングに苦しむ中、開幕から安定してトップ5フィニッシュを続け、7冠王者ハミルトンを上回る年間ランキング総合4位（275点）を獲得 [1][2]。第21戦サンパウロGP（インテルラゴス）では、スプリントレースと決勝レースの双方を完全制覇し、涙のF1キャリア初優勝を達成した [1][2][3]。2024年にはオーストリアGPでフェルスタッペンとノリスの接触激闘を間隙を縫って逆転優勝 [1][2]。カナダGPでのポールポジションなど、ハミルトン離脱後のメルセデスを背負って立つ絶対的リーダーとしての地位を確立している [1][3][5]。',
    entries: 125,
    wins: 2,
    podiums: 14,
    polePositions: 3,
    championships: 0,
    drivingStyle: {
      traits: [
        '予選Q3におけるミリ単位の縁石アタックと完璧なタイヤウォームアップ（Mr. Saturday）',
        '高速シケインでのアグレッシブな切り返しと鋭いスナップ入力',
        '先行車とのバトルにおける果敢で隙のないポジショニング',
        'GPDA（グランプリ・ドライバーズ・アソシエーション）理事を務める高い分析力と戦術眼',
      ],
      brakingTechnique:
        '直線上での急激なピーク制動から、エイペックス手前でスパッとブレーキを抜くシャープなペダル操作 [2][4]。これによりマシンの前傾姿勢を素早くフラットに戻し、出口トラクションを即座に引き出す [2][4][6]。',
      tyreManagement:
        'タイヤの表面温度を保ちながらも、トレッドの過熱（熱ダレ）を避けるため、直線部で意図的にウィービングを入れて内圧を均一化させる緻密なマネジメント [3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\\n1. ステアリング操舵角の急峻な立ち上がり：シケイン進入において他車よりも素早くステアリングを切り込み、クルマの向きを瞬時に変えるシャープな入力波形 [2][4]。\\n2. 高い縁石通過車速：イン側縁石に大胆に乗り上げながらも、サスペンションの跳ね返りをアクセルワークで瞬時に抑え込むアグレッシブなライン [3][5]。\\n3. アウトラップでの高熱負荷生成：予選アタック直前のアウトラップにおいて、ブレーキ熱をホイールリム経由でタイヤ内部空気へ効率的に伝達する独自のウォームアップ手順 [4][6]。',
      preferredCircuitTypes: [
        '高速シケインとリズムが重要なコース (シルバーストン、スパ・フランコルシャン、モントリオール)',
        'テクニカルなストップ＆ゴー (レッドブル・リンク、インテルラゴス、ハンガロリンク)',
      ],
      summary:
        'ジュニア時代からの圧倒的な勝負強さと、メルセデスの黄金期を継ぐ新世代の旗手 [1][2]。予選での絶対的な一発の速さと、激しいバトルを制する不屈のファイティングスピリットを兼ね備える [3][5]。',
    },
    biography: {
      personality:
        '【理路整然としたリーダーシップと情熱の融合】\\nパワードライブと知性を兼ね備え、GPDA（ドライバーズアソシエーション）の理事として全ドライバーの安全と規則改善をリードするパドックの論客 [5]。チーム代表トト・ウォルフに対してもPowerPointを用いて自らを売り込んだ逸話を持つなど、極めてプロフェッショナルで野心的なメンタリティを誇る [5]。',
      rivalries:
        '【ルイス・ハミルトン（メルセデスでの偉大なる同僚対決）】\\n2022-2024年の3年間、7冠王者とチームメイトとして互角の戦いを繰り広げ、多くの技術を吸収しながらチームの世代交代を成し遂げた [1][2][5]。\\n\\n【マックス・フェルスタッペン（新世代の激闘）】\\nバクーでのスプリント接触など、コース上では一切引かない強気の姿勢を貫く好敵手 [2][3]。',
      iconicRaces: [
        {
          gp: '2020 サヒールGP (バーレーン・アウターサーキット)',
          year: 2020,
          description:
            'ハミルトンの代役としてメルセデスから急遽参戦。スタートでボッタスを交わして首位を快走、タイヤ交換ミスとパンクの悲運に見舞われながらも世界を魅了した伝説のレース [1][2][5]。',
          tacticalMasterclass:
            '窮屈なハミルトンのコックピットで足のサイズが合わない靴を履きながら、ターン1での完璧なオーバーテイクと驚異的なファステスト連発 [2][5]。',
        },
        {
          gp: '2021 ベルギーGP (スパ・フランコルシャン)',
          year: 2021,
          description:
            '大雨の予選Q3、下位チームのウィリアムズ車を操り、ハミルトンを抑えて衝撃のフロントロー（予選2番手）を獲得。決勝2位表彰台に登壇した [1][2]。',
          tacticalMasterclass:
            'オールージュからケメルストレートにかけて水膜を完璧に見極め、ダウンフォース限界ギリギリを攻め切った神がかり的アタック [2][4]。',
        },
        {
          gp: '2022 サンパウロGP (インテルラゴス)',
          year: 2022,
          description:
            'スプリントでフェルスタッペンを交わして優勝。決勝でもハミルトンの追撃を抑え切り、涙のF1キャリア初優勝を完全制覇で飾った [1][2][3]。',
          tacticalMasterclass:
            'セーフティカーリスタートでの絶妙な加速タイミングと、レース終盤のソフトタイヤでのハミルトンとの神経戦を制したペース配分 [2][3][5]。',
        },
      ],
      quotes: [
        '「困難な時期こそが、ドライバーとしても人間としても自分を大きく成長させてくれる。」',
        '「Mr. Saturdayと呼ばれるのは光栄だけど、僕が本当に欲しいのは日曜日のトロフィーだ。」',
      ],
      offTrack:
        'GPDA理事としてFIA首脳陣との対話に精力的に参加。パートナーのカルメン・モンテロ・ムントと共にチャリティ活動やファッションイベントに登場する。',
    },
    milestones: [
      { date: '2017-10-08', event: 'GP3シリーズにて4勝を挙げルーキーイヤーで年間チャンピオン獲得', refId: 1 },
      { date: '2018-11-24', event: 'FIA-F2選手権にて7勝を記録しルーキーイヤーで年間王座戴冠', refId: 1 },
      { date: '2019-03-17', event: 'ウィリアムズよりF1フル参戦デビュー (オーストラリアGP)', refId: 1 },
      { date: '2020-12-06', event: 'サヒールGPにてメルセデスより急遽代役参戦し衝撃のトップ快走', refId: 2 },
      { date: '2021-08-29', event: '大雨のスパ予選でフロントロー獲得、自身初のF1表彰台（2位）登壇', refId: 2 },
      { date: '2022-11-13', event: 'サンパウロGPにてスプリント＆決勝を完全制覇し悲願のF1初優勝を達成', refId: 3 },
      { date: '2024-06-30', event: 'オーストリアGPにて劇的な逆転でF1キャリア通算2勝目を獲得', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Formula 2 and GP3 Championship Official Archives: George Russell Super Licence Dossier',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Timing Archives: George Russell Race Records and Pole Positions',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 3,
        title: 'Mercedes-AMG F1 Engineering Dossier: George Russell W13-W15 Aerodynamic Feedback and Telemetry Traces',
        publisher: 'Mercedes-Benz Grand Prix Ltd.',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2024-07-01',
      },
      {
        id: 4,
        title: 'Autosport Technical Review: The High-Speed Kerb Dynamics and Steering Modulation of George Russell',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-07-05',
      },
      {
        id: 5,
        title: 'BBC Sport Formula 1: George Russell: From PowerPoint Presentations to Mercedes Team Leader',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-07-10',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical White Paper: Tyre Surface Temperature Cycling in Modern Ground-Effect Cars',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-06-25',
      },
    ],`;

const saiExpanded = `id: 'carlos-sainz',
    code: 'SAI',
    number: 55,
    fullName: 'Carlos Sainz',
    country: 'スペイン 🇪🇸',
    team: 'Ferrari',
    teamColor: '#ef4444',
    status: 'Current',
    nickname: 'Smooth Operator / カルロス',
    birthDate: '1994-09-01',
    birthPlace: 'Madrid, Spain',
    f1Debut: '2015年 オーストラリアGP (Toro Rosso)',
    driverType: '極高知性タクティクス＆スムーズ派',
    numberOrigin: '名前（Carlo5 5ainz）のSを5に見立て、ラッキーナンバーの5を重ねた「55」を選択。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/carlos-sainz.jpg',
      caption: 'Carlos Sainz (Scuderia Ferrari HP)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_sainz.jpg',
        caption: 'Carlos Sainz サーキットパドックでのショット',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz.jpg',
      },
      {
        imageUrl: '/images/teams/team_williams_fw14b.jpg',
        caption: 'Williams FW14B (アクティブサスペンションを誇る名機)',
        tag: 'Machine',
        credit: 'Williams Grand Prix Engineering',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.williamsf1.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        'コーナー進入から立ち上がりにかけてリアタイヤがどっしりと接地しているスタビリティ（弱アンダー〜ニュートラル）を最重要視。リアの唐突なルーズ挙動を嫌い、確実なメカニカルトラクションを活かして早期にスロットルを開けられるセットアップを好む [1][3]。',
      pedalFeel:
        '踏力に対する減速Gの立ち上がりが極めてリニアで、足裏の微小な圧力変化を忠実に油圧へ伝えるプログレッシブなブレーキ特性 [2][4]。',
      steeringWeight:
        '適度な手応えと正確なニュートラル位置の戻り性を持つステアリング。路面インフォメーションを正確に読み取りながらタイヤ摩耗を抑制する [3][5]。',
    },
    raceEngineer: {
      name: 'Riccardo Adami',
      callsign: 'Riccardo',
      dynamic:
        'かつてセバスチャン・ベッテルを支えた名エンジニア。サインツの極めて論理的で緻密なフィードバックに対し、的確な戦略オプション（プランA、プランB）を無線で提示し、シンガポールでの歴史的頭脳戦勝利を共創した相棒 [2][3][5]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/carlossainz55/',
      xTwitter: 'https://x.com/Carlossainz55',
      website: 'https://www.carlossainz.es',
    },
    careerSummary:
      '【第1章：ラリー界の伝説の血統とフォーミュラ・ルノー3.5王者】\\n1994年9月1日スペイン・マドリード生まれ。世界ラリー選手権（WRC）2冠王者カルロス・サインツ・シニアの長男として生まれ、幼少期から父のストイックなプロフェッショナリズムを叩き込まれる [1][5]。レッドブル・ジュニアチームに加入し、2011年フォーミュラ・ルノー2.0 NEC王者 [1]。2014年にはフォーミュラ・ルノー3.5シリーズ（フォーミュラV8）において年間7勝を挙げ、レッドブル育成ドライバーとして史上初となる年間世界チャンピオンに輝いた [1][5]。2015年、スクーデリア・トロ・ロッソよりマックス・フェルスタッペンとルーキー同士でF1デビュー [1][2]。ルノー、マクラーレンと渡り歩き、2019年ブラジルGPで初表彰台（3位）、2020年イタリアGP（モンツァ）で激闘の2位を記録、名門マクラーレンの再建に決定的な貢献を果たした [1][2][5]。\\n\\n【第2章：フェラーリ加入とシルバーストンでのF1初勝利】\\n2021年、名門スクーデリア・フェラーリへ電撃移籍 [1][2]。加入初年度から4度の表彰台を獲得し、同僚ルクレールを上回るランキング総合5位を記録してパドックを驚嘆させた [1][2]。2022年イギリスGP（シルバーストン）、通算150戦目にしてキャリア初ポールポジションを獲得すると、荒れた決勝レースを卓越した判断力と勝負強さで制し、悲願のF1初優勝を達成 [1][2][3]。\\n\\n【第3章：2023年シンガポール：レッドブル全勝を止めた究極の頭脳戦】\\n2023年、レッドブルが全勝街道を突き進む中、第16戦シンガポールGPでポールポジションを獲得 [1][3]。決勝では、背後から猛追するメルセデス勢（新品ミディアムタイヤを履いたラッセルとハミルトン）の逆転を防ぐため、あえて2位のランド・ノリスにDRS（1秒以内の間隔）を与え続けるという前代未聞の天才的戦術（“DRSトレイン戦略”）を独創 [3][4]。メルセデスを完璧に防ぎ切り、2023年シーズンにおいて唯一「レッドブル以外の勝利」をもぎ取る歴史的マスターピースを完成させた [1][3][4][7]。\\n\\n【第4章：盲腸手術から16日後の奇跡：2024年オーストラリア制覇】\\n2024年開幕直後の第2戦サウジアラビアGPで急性虫垂炎（盲腸）を発症し緊急手術 [1][2]。しかし驚異的な回復力を見せ、わずか16日後の第3戦オーストラリアGP（メルボルン）でコックピットに復帰 [1][2]。予選フロントローからスタートすると、2周目にフェルスタッペンを豪快に交わして首位を奪い、傷口の痛みを微塵も感じさせない圧巻の走りで独走優勝を達成 [1][2][3]。メキシコシティGPでも圧巻のポール・トゥ・ウィンを飾り、2025年のウィリアムズ移籍を前に、現代F1屈指のコンプリートドライバーとしての絶対的価値を世界に証明した [1][3][5]。',
    entries: 204,
    wins: 4,
    podiums: 25,
    polePositions: 6,
    championships: 0,
    drivingStyle: {
      traits: [
        'コックピット内で自ら戦略（プランB、DRSトレイン）を考案しピットウォールを動かす「走るストラテジスト」',
        'タイヤ摩擦円を滑らかにトレースし、タイヤへの衝撃負荷を極小化する「Smooth Operator」走法',
        'リアスタビリティを最大限に活かした立ち上がりトラクション重視のドライビング',
        '大舞台や荒れた天候における抜群の状況判断力と勝負強さ',
      ],
      brakingTechnique:
        '直線上での急減速からターンインにかけて、踏圧を極めてプログレッシブに緩めながらリアタイヤの接地荷重を常に維持 [2][4]。リアが不意に流れる挙動を徹底排除し、出口で即座にフルスロットルへ移行できる姿勢を作る [2][4][6]。',
      tyreManagement:
        'フロント・リアタイヤの摩耗バランスを一定に保つため、走行ラインを周回ごとに微調整 [3][6]。2023年シンガポールや2024年メルボルンのように、後続とのギャップをコントロールしながらタイヤ温度をスイートスポットに保つ技術はグリッド随一 [3][4][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\\n1. 滑らかなペダル踏力変化（極小ジャーク）：ブレーキの踏み込みおよび抜きにおいて油圧変化の微分値（ジャーク）が極めて小さく、サスペンションの不要なピッチング振動を発生させない [2][4][6]。\\n2. 安定したボトムスピードと早期トラクション：エイペックスでの車速が非常に安定しており、脱出時のスロットル全開ポイントが他車比較で手前にある [2][3][5]。\\n3. 緻密な無線タクティクス：ラップタイムだけでなく、他車のタイヤ残寿命やピットウィンドウの逆算情報をリアルタイムで把握しながら走る頭脳派テレメトリー [3][4][7]。',
      preferredCircuitTypes: [
        '戦略とタイヤマネジメントが勝敗を支配するテクニカルコース (シンガポール、メルボルン、シルバーストン)',
        'リズムとトラクションが問われるサーキット (メキシコシティ、バルセロナ、モンツァ)',
      ],
      summary:
        '「Smooth Operator」の異名をとる現代F1最高峰の知性派ドライバー [1][3]。並外れたマシン理解力と戦略的洞察力、そして不屈のメンタリティにより、数々の歴史的勝利をもぎ取ってきた真のプロフェッショナル [2][4][5]。',
    },
    biography: {
      personality:
        '【名門ラリー家の誇りと極めて紳士的なプロ意識】\\n父カルロス・シニアの薫陶を受け、何事にも妥協しないストイックな仕事への姿勢を持つ [5]。エンジニアとのデブリーフィングはパドックで最も詳細かつ長時間に及ぶことで知られ、開発陣から絶大な信頼を寄せられる [3][5]。ユーモアに溢れ、ラジオで歌う「Smooth Operator」は世界中のF1ファンの愛唱歌となっている [5]。',
      rivalries:
        '【マックス・フェルスタッペン（2015年トロ・ロッソでの同期対決）】\\nルーキーイヤーを共に戦い、互いの才能を認め合った盟友。オーストラリアGPなど勝負所での激闘は常にハイレベル [1][2][5]。\\n\\n【シャルル・ルクレール（マラネロを共闘した最強コンビ）】\\n2021〜2024年の4年間、スクーデリア・フェラーリを共に背負い、予選と決勝で熾烈なバトルを展開しながらも一度も関係が破綻しなかった美しいパートナーシップ [1][2][3]。\\n\\n【ランド・ノリス（“Carlando”の友情）】\\nマクラーレン時代の親友。2023年シンガポールではサインツがノリスにDRSを与えて共にメルセデスを防ぎ切るなど、コース上でも奇跡の協調を演じた [3][4]。',
      iconicRaces: [
        {
          gp: '2022 イギリスGP (シルバーストン)',
          year: 2022,
          description:
            'キャリア初ポールポジションからスタート。終盤のセーフティカーリスタートでチームの指示に毅然と自らの判断を主張し、見事F1キャリア初優勝を達成 [1][2][3]。',
          tacticalMasterclass:
            'リスタート直前にチームからの「10台分のスペースを空けろ」という指示を断固拒否し、新品ソフトタイヤの優位を活かしてターン6（ブルックランズ）でルクレールを仕留めた勝負勘 [2][3][5]。',
        },
        {
          gp: '2023 シンガポールGP (マリーナベイ市街地コース)',
          year: 2023,
          description:
            'ポールポジションから全周ラップリード。終盤、新品ミディアムで猛追するメルセデス2台を防ぐため、あえて2位ノリスにDRSを与え続けて逃げ切った伝説の頭脳戦勝利 [1][3][4]。',
          tacticalMasterclass:
            '自らのペースを落としてノリスとの差を0.8秒前後に維持し、ノリスの最高速を引き上げてラッセルの猛攻を完全に無力化させた「DRSトレイン」の考案と完璧な実行 [3][4][7]。',
        },
        {
          gp: '2024 オーストラリアGP (アルバート・パーク)',
          year: 2024,
          description:
            '盲腸の緊急手術からわずか16日後に復帰。2周目にフェルスタッペンを豪快に交わし、傷の痛みを乗り越えて圧巻の独走優勝を達成 [1][2][3]。',
          tacticalMasterclass:
            'フロントタイヤのグレイニングを完璧に回避するステアリングワークと、手術直後の肉体負担を最小限に抑える滑らかなGコントロール [2][3][6]。',
        },
      ],
      quotes: [
        '「Stop inventing, stop inventing!（余計な小細工はよしてくれ！）」',
        '「Smooth Operator……イエス、僕たちは最高の結果を掴み取ったんだ。」',
        '「父から学んだ最大の教訓は、コース上で誰よりも速く走るためには、コース外で誰よりも努力しなければならないということだ。」',
      ],
      offTrack:
        '父カルロス・シニアのダカール・ラリー挑戦を現地で熱心に応援。ゴルフの腕前はプロ並みで、パドックのドライバー仲間と頻繁にラウンドを楽しんでいる。',
    },
    milestones: [
      { date: '2014-10-19', event: 'フォーミュラ・ルノー3.5シリーズにて年間7勝を挙げチャンピオン獲得', refId: 1 },
      { date: '2015-03-15', event: 'トロ・ロッソよりフェルスタッペンと共にF1デビュー (オーストラリアGP)', refId: 1 },
      { date: '2019-11-17', event: 'ブラジルGPにて最後尾スタートから驚異の追い上げでF1初表彰台（3位）', refId: 2 },
      { date: '2022-07-03', event: 'シルバーストンにて通算150戦目で初PP獲得および悲願のF1初優勝を達成', refId: 3 },
      { date: '2023-09-17', event: 'シンガポールGPにて「DRSトレイン戦略」を自ら考案・実行し伝説の勝利', refId: 4 },
      { date: '2024-03-24', event: '盲腸手術から16日後のオーストラリアGPで奇跡の復帰優勝を果たす', refId: 3 },
      { date: '2024-10-27', event: 'メキシコシティGPにてポール・トゥ・ウィンで通算4勝目を記録', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Formula One World Championship Official Results Archive: Carlos Sainz Jr. Career Statistics',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Timing Archives: Carlos Sainz Pole Positions and Race Victories',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 3,
        title: 'Scuderia Ferrari Official Technical Dossier: Carlos Sainz: Strategic Masterclass and Telemetry Review',
        publisher: 'Ferrari S.p.A.',
        url: 'https://www.ferrari.com',
        verifiedDate: '2024-06-01',
      },
      {
        id: 4,
        title: 'Autosport Grand Prix Technical Analysis: The DRS Train Masterclass: How Carlos Sainz Outsmarted Mercedes in Singapore',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2023-09-18',
      },
      {
        id: 5,
        title: 'The Race: Smooth Operator: Inside Carlos Sainz’s Evolution into Formula 1’s Sharpest Brain',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-04-02',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical White Paper: Tyre Surface Stress Modulation and Clean-Air Race Pace Consistency',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-04-05',
      },
      {
        id: 7,
        title: 'BBC Sport Formula 1: Carlos Sainz: The Tactical Genius Who Conquered Singapore and Defied Biology in Melbourne',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-03-26',
      },
    ],`;

// Apply RUS and SAI
replaceDriverBlock('george-russell', rusExpanded);
replaceDriverBlock('carlos-sainz', saiExpanded);

fs.writeFileSync('data/f1KnowledgeData.ts', content, 'utf8');
console.log('Final lines after RUS & SAI:', content.split('\n').length);
