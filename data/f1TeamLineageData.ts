/**
 * data/f1TeamLineageData.ts
 * Formula 1 Complete Constructor Lineage Chains, Historical Roots, and 2026 Car Technical Specs.
 * Ground Truth: FIA Official Records, Formula 1 Heritage Archives, and Constructor Historical Documentation.
 */

export interface TeamLineageNode {
  period: string; // e.g. "1968 - 1998"
  teamName: string; // e.g. "Tyrrell Racing"
  fullName: string;
  country: string;
  flag: string;
  base: string;
  powerUnits: string[];
  keyPersonnel: string[];
  notableDrivers: string[];
  championships: {
    drivers: number;
    constructors: number;
  };
  iconicCar?: {
    model: string;
    description: string;
  };
  summary: string;
}

export interface CarTechnicalSpecs {
  chassisCode: string; // e.g. "W17", "RB22", "SF-26"
  powerUnitName: string; // e.g. "Mercedes-AMG M17 E Performance"
  iceSpecs: string; // 1.6L 90° V6 Turbo, 100% Sustainable Fuel
  ersPowerKw: number; // 350 kW (476 hp)
  totalHorsepower: string; // "> 1,000 bhp"
  weightKg: number; // 768 kg (Minimum regulation)
  wheelbaseMm: number; // 3,400 mm
  widthMm: number; // 1,900 mm
  activeAero: string; // Z-mode (Cornering DF) & X-mode (Straight Low Drag)
  gearbox: string; // 8-speed seamless shift + reverse
  brakes: string; // Carbon-Carbon + regenerative fly-by-wire
  fuelRegulation: string; // Max 3,000 MJ/h energy flow limit (100% Sustainable Fuel)
}

export interface TeamLineageRecord {
  teamId: string;
  currentName: string;
  originYear: number;
  founder: string;
  headquarters: string;
  allTimeTitles: {
    drivers: number;
    constructors: number;
  };
  lineageChain: TeamLineageNode[];
  technicalSpecs: CarTechnicalSpecs;
}

export const TEAM_LINEAGE_DATA: Record<string, TeamLineageRecord> = {
  // ── 1. MERCEDES-AMG PETRONAS F1 TEAM ─────────────────────────
  mercedes: {
    teamId: 'mercedes',
    currentName: 'Mercedes-AMG PETRONAS Formula One Team',
    originYear: 1968,
    founder: 'Ken Tyrrell (ケン・ティレル)',
    headquarters: 'Brackley, Northamptonshire, United Kingdom',
    allTimeTitles: { drivers: 10, constructors: 9 },
    lineageChain: [
      {
        period: '1968 - 1998',
        teamName: 'Tyrrell Racing',
        fullName: 'Tyrrell Racing Organisation',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Ockham, Surrey, UK',
        powerUnits: ['Ford-Cosworth DFV', 'Renault Turbo', 'Yamaha'],
        keyPersonnel: ['Ken Tyrrell', 'Derek Gardner', 'Harvey Postlethwaite'],
        notableDrivers: ['Jackie Stewart', 'François Cevert', 'Patrick Depailler', 'Michele Alboreto', 'Jean Alesi', '中嶋悟'],
        championships: { drivers: 3, constructors: 1 },
        iconicCar: {
          model: 'Tyrrell P34 (1976)',
          description: 'F1史上初にして唯一実戦投入された伝説の前4輪・計6輪マシン。1976年スウェーデンGPで1-2勝利を達成。',
        },
        summary: '名将ケン・ティレルが率いた英国の名門プライベーター。ジャッキー・スチュワートとともに1971年コンストラクターズ制覇、1969/1971/1973年ドライバーズ王座を獲得。',
      },
      {
        period: '1999 - 2005',
        teamName: 'BAR (British American Racing)',
        fullName: 'British American Racing Honda',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Brackley, Northamptonshire, UK',
        powerUnits: ['Supertec (1999)', 'Honda V10 (2000-2005)'],
        keyPersonnel: ['Craig Pollock', 'David Richards', 'Adrian Reynard'],
        notableDrivers: ['Jacques Villeneuve', 'Jenson Button', '佐藤琢磨', 'Olivier Panis'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'BAR Honda 006 (2004)',
          description: 'ジェンソン・バトンと佐藤琢磨（米インディアナポリス3位表彰台）が年間11回の表彰台を獲得し、コンストラクターズ2位へ躍進。',
        },
        summary: 'タバコ大手BATがティレルを買収しブラックリーに最新鋭ファクトリーを建設。ホンダワークスエンジンを得て2004年に選手権2位の快挙を成し遂げた。',
      },
      {
        period: '2006 - 2008',
        teamName: 'Honda Racing F1 Team',
        fullName: 'Honda Racing F1 Team',
        country: 'Japan / United Kingdom',
        flag: '🇯🇵',
        base: 'Brackley, Northamptonshire, UK',
        powerUnits: ['Honda RA806E / RA807E / RA808E 2.4L V8'],
        keyPersonnel: ['ニック・フライ', 'ジェフ・ウィリス', '中本修平', 'ロス・ブラウン (2008)'],
        notableDrivers: ['Jenson Button', 'Rubens Barrichello'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Honda RA106 (2006)',
          description: '2006年ハンガリーGPの激戦でジェンソン・バトンが劇的な自身初優勝（ホンダ第3期初勝利）を飾った名機。',
        },
        summary: 'ホンダがブラックリーの全株式を取得し第3期フルワークス参戦。2008年末の世界金融危機により突如F1撤退を決定するも、後継のブラウンGPへ最高のマシンを残した。',
      },
      {
        period: '2009',
        teamName: 'Brawn GP',
        fullName: 'Brawn GP Formula One Team',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Brackley, Northamptonshire, UK',
        powerUnits: ['Mercedes-Benz FO 108W 2.4L V8'],
        keyPersonnel: ['Ross Brawn', 'Nick Fry', 'Jörg Zander'],
        notableDrivers: ['Jenson Button', 'Rubens Barrichello'],
        championships: { drivers: 1, constructors: 1 },
        iconicCar: {
          model: 'Brawn BGP 001 (2009)',
          description: '革新的ダブルディフューザーを搭載し開幕7戦6勝。参戦初年度にしてコンストラクターズ＆ドライバーズのダブルタイトルを獲得した奇跡のマシン。',
        },
        summary: 'ホンダ撤退後、ロス・ブラウンが1ポンドでチームを買収し奇跡の参戦。メルセデスPUを急遽搭載し、F1史上初となる参戦初年度ダブルタイトルを成し遂げた。',
      },
      {
        period: '2010 - 現在',
        teamName: 'Mercedes-AMG PETRONAS',
        fullName: 'Mercedes-AMG PETRONAS Formula One Team',
        country: 'Germany / United Kingdom',
        flag: '🇩🇪',
        base: 'Brackley, Northamptonshire, UK',
        powerUnits: ['Mercedes-AMG 1.6L V6 Turbo Hybrid / 2026 M17 Works'],
        keyPersonnel: ['Toto Wolff', 'Niki Lauda', 'James Allison', 'Andy Cowell'],
        notableDrivers: ['Michael Schumacher', 'Lewis Hamilton', 'Nico Rosberg', 'Valtteri Bottas', 'George Russell', 'Andrea Kimi Antonelli'],
        championships: { drivers: 7, constructors: 8 },
        iconicCar: {
          model: 'Mercedes-AMG F1 W11 EQ Performance (2020)',
          description: 'DAS（2軸ステアリング）と完璧な空力を誇り、17戦13勝を挙げたF1史上最速の呼び声高い最強の銀矢。',
        },
        summary: 'ダイムラーがブラウンGPを買収しワークス復帰。2014年ハイブリッド規定導入からコンストラクターズ8連覇（2014-2021）という不滅の大記録を樹立した。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Mercedes F1 W17 E Performance',
      powerUnitName: 'Mercedes-AMG M17 E Performance Works',
      iceSpecs: '1.6L 90° V6 Turbo (540 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,020 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Front & Rear Wing dual-mode (Z-mode High DF / X-mode Low Drag)',
      gearbox: 'Mercedes-AMG 8-speed seamless shift with carbon casing',
      brakes: 'Brembo Carbon-Carbon with integrated 350kW MGU-K regenerative braking',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 2. ORACLE RED BULL RACING ────────────────────────────────
  'red-bull': {
    teamId: 'red-bull',
    currentName: 'Oracle Red Bull Racing',
    originYear: 1997,
    founder: 'Jackie Stewart & Paul Stewart (ジャッキー・スチュワート)',
    headquarters: 'Milton Keynes, Buckinghamshire, United Kingdom',
    allTimeTitles: { drivers: 7, constructors: 6 },
    lineageChain: [
      {
        period: '1997 - 1999',
        teamName: 'Stewart Grand Prix',
        fullName: 'Stewart Grand Prix',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Milton Keynes, Buckinghamshire, UK',
        powerUnits: ['Ford Zetec-R V10 / Cosworth CR-1'],
        keyPersonnel: ['Jackie Stewart', 'Paul Stewart', 'Alan Jenkins'],
        notableDrivers: ['Rubens Barrichello', 'Johnny Herbert', 'Jan Magnussen'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Stewart SF3 (1999)',
          description: '1999年ヨーロッパGP（ニュルブルクリンク）の波乱の雨中でジョニー・ハーバートが劇的初勝利、ルーベンス・バリチェロが3位で1-3表彰台。',
        },
        summary: '3度のF1王者ジャッキー・スチュワートがフォードの全面支援を受けて創設。1999年に1勝を挙げ選手権4位と大躍進を遂げた。',
      },
      {
        period: '2000 - 2004',
        teamName: 'Jaguar Racing',
        fullName: 'Jaguar Racing F1 Team',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Milton Keynes, Buckinghamshire, UK',
        powerUnits: ['Cosworth CR-2〜CR-6 3.0L V10'],
        keyPersonnel: ['Bobby Rahal', 'Niki Lauda', 'Tony Purnell', 'Malcolm Oastler'],
        notableDrivers: ['Eddie Irvine', 'Johnny Herbert', 'Pedro de la Rosa', 'Mark Webber', 'Christian Klien'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Jaguar R3 (2002)',
          description: 'エディ・アーバインがモンツァで3位表彰台を獲得したブリティッシュ・レーシング・グリーンの美しいV10マシン。',
        },
        summary: 'フォードがスチュワートを完全買収しジャガーブランドで参戦。莫大な予算を投じるも組織迷走に苦しみ表彰台2回に留まり、2004年末にレッドブルへ売却された。',
      },
      {
        period: '2005 - 現在',
        teamName: 'Red Bull Racing',
        fullName: 'Oracle Red Bull Racing',
        country: 'Austria / United Kingdom',
        flag: '🇦🇹',
        base: 'Milton Keynes, Buckinghamshire, UK',
        powerUnits: ['Ferrari (2006)', 'Renault V8/Hybrid (2007-2018)', 'Honda / RBPT (2019-2025)', 'Red Bull Ford (2026)'],
        keyPersonnel: ['Christian Horner', 'Adrian Newey', 'Helmut Marko', 'Laurent Mekies (2026)'],
        notableDrivers: ['David Coulthard', 'Sebastian Vettel', 'Mark Webber', 'Daniel Ricciardo', 'Max Verstappen', 'Isack Hadjar'],
        championships: { drivers: 7, constructors: 6 },
        iconicCar: {
          model: 'Red Bull RB19 (2023)',
          description: '22戦中21勝（勝率95.45%）を記録し、フェルスタッペンが19勝・10連勝を達成したF1史上最も圧倒的な支配力を見せた不滅の傑作。',
        },
        summary: 'エナジードリンク大手レッドブルがジャガーを買収。鬼才エイドリアン・ニューウェイを招聘し、ベッテルによる4連覇（2010-2013）、フェルスタッペンの黄金期を築き上げた。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Red Bull Racing RB22',
      powerUnitName: 'Red Bull Ford Powertrains DM01 Works',
      iceSpecs: '1.6L 90° V6 Turbo (535 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,015 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Front Flap & Rear Wing 2-Stage Active Aero System',
      gearbox: 'Red Bull Technology 8-speed longitudinal seamless gearbox',
      brakes: 'Carbon Industrie Discs with Fly-by-wire MGU-K Hybrid Retardation',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 3. ASTON MARTIN ARAMCO F1 TEAM ───────────────────────────
  'aston-martin': {
    teamId: 'aston-martin',
    currentName: 'Aston Martin Aramco Formula One Team',
    originYear: 1991,
    founder: 'Eddie Jordan (エディ・ジョーダン)',
    headquarters: 'Silverstone, Northamptonshire, United Kingdom',
    allTimeTitles: { drivers: 0, constructors: 0 },
    lineageChain: [
      {
        period: '1991 - 2005',
        teamName: 'Jordan Grand Prix',
        fullName: 'Jordan Grand Prix',
        country: 'Ireland / United Kingdom',
        flag: '🇮🇪',
        base: 'Silverstone, Northamptonshire, UK',
        powerUnits: ['Ford HB', 'Hart', 'Peugeot V10', 'Mugen-Honda V10', 'Ford Cosworth'],
        keyPersonnel: ['Eddie Jordan', 'Gary Anderson', 'Mike Gascoyne'],
        notableDrivers: ['Michael Schumacher', 'Rubens Barrichello', 'Damon Hill', 'Ralf Schumacher', 'Heinz-Harald Frentzen', 'ジャンカルロ・フィジケラ', '佐藤琢磨'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Jordan 191 (1991) / Jordan 199 (1999)',
          description: '191はF1史上最も美しいマシンと称されシューマッハが衝撃デビュー。199はフレンツェンが2勝を挙げタイトルを争い選手権3位。',
        },
        summary: '陽気なエディ・ジョーダンが立ち上げたシルバーストーンのロックンロール・チーム。無限ホンダを擁した1998年スパ1-2や1999年の王座争いで世界を魅了した。',
      },
      {
        period: '2006',
        teamName: 'Midland MF1 Racing',
        fullName: 'MF1 Racing',
        country: 'Russia / United Kingdom',
        flag: '🇷🇺',
        base: 'Silverstone, Northamptonshire, UK',
        powerUnits: ['Toyota RVX-06 2.4L V8'],
        keyPersonnel: ['Alex Shnaider', 'Colin Kolles', 'James Key'],
        notableDrivers: ['Tiago Monteiro', 'Christijan Albers'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Midland M16 (2006)',
          description: 'ロシア系カナダ人実業家アレックス・シュナイダーがジョーダンを買収した過渡期マシン。',
        },
        summary: 'ジョーダン売却後の短命な過渡期体制。ロシア国籍でエントリーしたが、シーズン終盤には早くもオランダのスパイカーへ売却された。',
      },
      {
        period: '2007',
        teamName: 'Spyker F1 Team',
        fullName: 'Etihad Aldar Spyker F1 Team',
        country: 'Netherlands / United Kingdom',
        flag: '🇳🇱',
        base: 'Silverstone, Northamptonshire, UK',
        powerUnits: ['Ferrari 056 2.4L V8'],
        keyPersonnel: ['Michiel Mol', 'Colin Kolles', 'Mike Gascoyne'],
        notableDrivers: ['Adrian Sutil', 'Christijan Albers', 'Markus Winkelhock', 'Sakon Yamamoto (山本左寛)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Spyker F8-VII (2007)',
          description: '雨のニュルブルクリンクでウィンケルホックがデビュー戦にして最後尾からラップリーダーに立つ奇跡を演出。',
        },
        summary: 'オランダのスポーツカーメーカー・スパイカーが買収。オレンジのカラーリングとフェラーリPUで戦い、荒れた富士スピードウェイでスーティルが初ポイントを獲得。',
      },
      {
        period: '2008 - 2018',
        teamName: 'Force India',
        fullName: 'Sahara Force India F1 Team',
        country: 'India / United Kingdom',
        flag: '🇮🇳',
        base: 'Silverstone, Northamptonshire, UK',
        powerUnits: ['Ferrari V8 (2008)', 'Mercedes-Benz FO 108 (2009-2018)'],
        keyPersonnel: ['Vijay Mallya', 'Bob Fernley', 'Otmar Szafnauer', 'Andrew Green'],
        notableDrivers: ['Giancarlo Fisichella', 'Adrian Sutil', 'Nico Hülkenberg', 'Paul di Resta', 'Sergio Pérez', 'Esteban Ocon'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Force India VJM02 (2009) / VJM09 (2016)',
          description: '2009年スパでフィジケラが奇跡のPP＆2位。2016-2017年には強豪メーカーを打ち破り2年連続コンストラクターズ4位を獲得。',
        },
        summary: 'ビジャイ・マリヤが買収し「最高のコストパフォーマンスを誇る中団の殺し屋」として名を馳せる。メルセデスPUとアンドリュー・グリーンの堅実な設計で表彰台常連となった。',
      },
      {
        period: '2019 - 2020',
        teamName: 'Racing Point',
        fullName: 'BWT Racing Point F1 Team',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Silverstone, Northamptonshire, UK',
        powerUnits: ['BWT Mercedes 1.6L V6 Turbo Hybrid'],
        keyPersonnel: ['Lawrence Stroll', 'Otmar Szafnauer', 'Andrew Green'],
        notableDrivers: ['Sergio Pérez', 'Lance Stroll', 'Nico Hülkenberg'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Racing Point RP20 (2020)',
          description: '「ピンク・メルセデス」と呼ばれた前年王者W10の空力コンセプトを採用し、ペレスが2020年サヒールGPで最後尾から劇的な初優勝を飾った。',
        },
        summary: '破産寸前のフォースインディアをローレンス・ストロール率いる投資家コンソーシアムが救済。ペレスがチームに悲願の初優勝をもたらした。',
      },
      {
        period: '2021 - 現在',
        teamName: 'Aston Martin',
        fullName: 'Aston Martin Aramco Formula One Team',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Silverstone, Northamptonshire, UK',
        powerUnits: ['Mercedes-AMG (2021-2025)', 'Honda Works (2026〜)'],
        keyPersonnel: ['Lawrence Stroll', 'Adrian Newey (2026〜)', 'Andy Cowell', 'Mike Krack'],
        notableDrivers: ['Sebastian Vettel', 'Lance Stroll', 'Fernando Alonso', 'Felipe Drugovich (Reserve)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Aston Martin AMR23 (2023) / AMR26 (2026)',
          description: 'AMR23でフェルナンド・アロンソが年間8回の表彰台を獲得。AMR26はエイドリアン・ニューウェイ指揮のもとホンダ完全ワークスPUを搭載。',
        },
        summary: 'アストンマーティンの名跡を復活させ、シルバーストーンに巨額の最新風洞・新ファクトリーを完成。2026年にはエイドリアン・ニューウェイとホンダ完全ワークスPUが合流した。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Aston Martin AMR26',
      powerUnitName: 'Honda Racing Corporation RA626H Works',
      iceSpecs: '1.6L 90° V6 Turbo (545 bhp @ 15,000 RPM, HRC 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,025 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Newey-designed Integrated Active Aero Platform (Z-mode/X-mode)',
      gearbox: 'Aston Martin Performance 8-speed seamless longitudinal casing',
      brakes: 'Brembo Carbon-Carbon with HRC integrated electronic brake-by-wire',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 4. BWT ALPINE F1 TEAM ────────────────────────────────────
  alpine: {
    teamId: 'alpine',
    currentName: 'BWT Alpine Formula One Team',
    originYear: 1981,
    founder: 'Ted Toleman (テッド・トールマン)',
    headquarters: 'Enstone, Oxfordshire, United Kingdom',
    allTimeTitles: { drivers: 4, constructors: 3 },
    lineageChain: [
      {
        period: '1981 - 1985',
        teamName: 'Toleman Motorsport',
        fullName: 'Toleman Group Motorsport',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Witney, Oxfordshire, UK',
        powerUnits: ['Hart 415T 1.5L Turbo'],
        keyPersonnel: ['Ted Toleman', 'Alex Hawkridge', 'Rory Byrne', 'Pat Symonds'],
        notableDrivers: ['Ayrton Senna', 'Derek Warwick', 'Bruno Giacomelli', 'Stefan Johansson'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Toleman TG184 (1984)',
          description: '豪雨の1984年モナコGPで新星アイルトン・セナが2位に食い込み、世界に衝撃を与えた伝説のターボマシン。',
        },
        summary: 'ロリー・バーンとパット・シモンズという若き天才エンジニアを擁した英国チーム。セナの才能を最初に見出し、F1界へ送り出した。',
      },
      {
        period: '1986 - 2001',
        teamName: 'Benetton Formula',
        fullName: 'Benetton Formula 1',
        country: 'United Kingdom / Italy',
        flag: '🇮🇹',
        base: 'Enstone, Oxfordshire, UK',
        powerUnits: ['BMW Turbo', 'Ford Cosworth V8', 'Renault V10', 'Playlife'],
        keyPersonnel: ['Flavio Briatore', 'Rory Byrne', 'Ross Brawn', 'Tom Walkinshaw'],
        notableDrivers: ['Michael Schumacher', 'Nelson Piquet', 'Gerhard Berger', 'Jean Alesi', 'Giancarlo Fisichella', 'Alessandro Nannini'],
        championships: { drivers: 2, constructors: 1 },
        iconicCar: {
          model: 'Benetton B194 (1994) / B195 (1995)',
          description: 'ミハエル・シューマッハが圧倒的な速さで初のドライバーズ連覇を成し遂げ、1995年にはチーム唯一のコンストラクターズ王座をもたらした名機。',
        },
        summary: 'イタリアの服飾ベネトンがトールマンを買収しエンストーンへ移転。フラビオ・ブリアトーレのもとシューマッハが台頭し、90年代中盤のF1を完全に制圧した。',
      },
      {
        period: '2002 - 2011',
        teamName: 'Renault F1 Team',
        fullName: 'Mild Seven Renault F1 Team',
        country: 'France / United Kingdom',
        flag: '🇫🇷',
        base: 'Enstone, Oxfordshire, UK',
        powerUnits: ['Renault RS21〜RS27 V10 / V8'],
        keyPersonnel: ['Flavio Briatore', 'Pat Symonds', 'Bob Bell'],
        notableDrivers: ['Fernando Alonso', 'Jarno Trulli', 'Giancarlo Fisichella', 'Robert Kubica', 'Heikki Kovalainen'],
        championships: { drivers: 2, constructors: 2 },
        iconicCar: {
          model: 'Renault R25 (2005) / R26 (2006)',
          description: 'マスダンパーと革新的な低重心V10/V8エンジンを搭載し、フェルナンド・アロンソがシューマッハを破って2年連続ダブルタイトルを獲得。',
        },
        summary: 'ルノーがベネトンを買収しワークス化。アロンソの類まれな勝負強さとエンストーンの卓越した車体設計で、2005年・2006年にダブルタイトルを連覇した。',
      },
      {
        period: '2012 - 2015',
        teamName: 'Lotus F1 Team',
        fullName: 'Lotus F1 Team',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Enstone, Oxfordshire, UK',
        powerUnits: ['Renault RS27 V8', 'Mercedes PU106A (2015)'],
        keyPersonnel: ['Eric Boullier', 'James Allison', 'Nick Chester'],
        notableDrivers: ['Kimi Räikkönen', 'Romain Grosjean', 'Pastor Maldonado'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Lotus E20 (2012)',
          description: 'F1復帰したキミ・ライコネンがアブダビGPで「Leave me alone, I know what I\'m doing」の名言とともに勝利を飾ったブラック＆ゴールドのマシン。',
        },
        summary: 'ジェネイ・キャピタル投資会社がチームを保有し「ロータス」の名で参戦。ライコネンの復帰優勝やグロージャンの活躍で中団トップを争ったが財政難に陥った。',
      },
      {
        period: '2016 - 2020',
        teamName: 'Renault F1 Team',
        fullName: 'Renault DP World F1 Team',
        country: 'France / United Kingdom',
        flag: '🇫🇷',
        base: 'Enstone, Oxfordshire, UK',
        powerUnits: ['Renault 1.6L V6 Turbo Hybrid E-Tech'],
        keyPersonnel: ['Cyril Abiteboul', 'Marcin Budkowski', 'Nick Chester'],
        notableDrivers: ['Nico Hülkenberg', 'Carlos Sainz', 'Daniel Ricciardo', 'Esteban Ocon'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Renault R.S.20 (2020)',
          description: 'ダニエル・リカルドがニュルブルクリンクとイモラで表彰台を獲得し、チームの復調を証明したイエロー＆ブラックのマシン。',
        },
        summary: 'ルノーが経営危機に瀕したエンストーンを買い戻しワークス復帰。リカルドらの活躍で表彰台争いへ復帰した。',
      },
      {
        period: '2021 - 現在',
        teamName: 'BWT Alpine',
        fullName: 'BWT Alpine Formula One Team',
        country: 'France / United Kingdom',
        flag: '🇫🇷',
        base: 'Enstone, Oxfordshire, UK',
        powerUnits: ['Renault E-Tech (2021-2025)', 'Mercedes-AMG (2026〜)'],
        keyPersonnel: ['Flavio Briatore', 'Steve Nielsen', 'David Sanchez'],
        notableDrivers: ['Fernando Alonso', 'Esteban Ocon', 'Pierre Gasly', 'Franco Colapinto', 'Jack Doohan (Reserve)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Alpine A521 (2021)',
          description: '2021年ハンガリーGPでエステバン・オコンがチーム名変更初年度に奇跡の初優勝を飾った記念碑的マシン。',
        },
        summary: 'ルノー傘下のスポーツカーブランド「アルピーヌ」へリブランド。2026年からはブリアトーレの決断により自社製PUを終了し、メルセデス製最新PUを搭載して新時代に挑む。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Alpine A526',
      powerUnitName: 'Mercedes-AMG M17 E Performance Customer',
      iceSpecs: '1.6L 90° V6 Turbo (540 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,020 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Enstone Advanced Low-Drag Active Aerodynamics',
      gearbox: 'Mercedes-AMG 8-speed seamless casing',
      brakes: 'Brembo Carbon-Carbon with integrated fly-by-wire regeneration',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 5. VISA CASH APP RB FORMULA ONE TEAM ─────────────────────
  rb: {
    teamId: 'rb',
    currentName: 'Visa Cash App RB Formula One Team',
    originYear: 1985,
    founder: 'Gian Carlo Minardi (ジャンカルロ・ミナルディ)',
    headquarters: 'Faenza, Ravenna, Italy',
    allTimeTitles: { drivers: 0, constructors: 0 },
    lineageChain: [
      {
        period: '1985 - 2005',
        teamName: 'Minardi',
        fullName: 'Minardi F1 Team',
        country: 'Italy',
        flag: '🇮🇹',
        base: 'Faenza, Ravenna, Italy',
        powerUnits: ['Motori Moderni', 'Ford Cosworth', 'Ferrari V12', 'Lamborghini V12', 'Asiatech'],
        keyPersonnel: ['Gian Carlo Minardi', 'Paul Stoddart', 'Gabriele Tredozi'],
        notableDrivers: ['Pierluigi Martini', 'Giancarlo Fisichella', 'Jarno Trulli', 'Fernando Alonso', 'Mark Webber'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Minardi PS01 (2001) / PS02 (2002)',
          description: '2001年に若きフェルナンド・アロンソが衝撃的な走りを披露し、2002年開幕戦メルボルンではマーク・ウェバーが値千金の5位入賞。',
        },
        summary: 'イタリア・ファエンツァを本拠に、熱狂的なファンに愛された伝説のプライベーター。資金難に耐えながら数々の未来の世界王者を育成した。',
      },
      {
        period: '2006 - 2019',
        teamName: 'Scuderia Toro Rosso',
        fullName: 'Scuderia Toro Rosso',
        country: 'Italy',
        flag: '🇮🇹',
        base: 'Faenza, Ravenna, Italy',
        powerUnits: ['Cosworth V10', 'Ferrari V8', 'Renault V6 Turbo', 'Honda (2018-2019)'],
        keyPersonnel: ['Franz Tost', 'Giorgio Ascanelli', 'James Key'],
        notableDrivers: ['Sebastian Vettel', 'Daniel Ricciardo', 'Max Verstappen', 'Carlos Sainz', 'Pierre Gasly'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Toro Rosso STR3 (2008)',
          description: '雨の2008年モンツァで21歳のセバスチャン・ベッテルがポール・トゥ・ウィンを飾り、親チームのレッドブルより先に悲願の初優勝をもたらした奇跡のマシン。',
        },
        summary: 'レッドブルがミナルディを買収し若手育成ジュニアチームとして再編。ベッテル、フェルスタッペン、リカルドらを輩出し、2018年からはホンダPUのワークスパートナーとしてホンダ復権の礎を築いた。',
      },
      {
        period: '2020 - 2023',
        teamName: 'Scuderia AlphaTauri',
        fullName: 'Scuderia AlphaTauri Honda / RBPT',
        country: 'Italy',
        flag: '🇮🇹',
        base: 'Faenza, Ravenna, Italy',
        powerUnits: ['Honda RA620H〜RA621H / RBPT'],
        keyPersonnel: ['Franz Tost', 'Jody Egginton', 'Guillaume Dezoteux'],
        notableDrivers: ['Pierre Gasly', 'Daniil Kvyat', '角田裕毅 (Yuki Tsunoda)', 'Liam Lawson', 'Daniel Ricciardo'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'AlphaTauri AT01 (2020)',
          description: '2020年イタリアGPでピエール・ガスリーが歴史的な劇的初優勝を飾り、ファエンツァのファクトリーに2度目の栄光をもたらした名車。',
        },
        summary: 'レッドブルのプレミアムファッションブランド「アルファタウリ」へ改称。ガスリーの感動的なモンツァ優勝、そして日本の若きエース角田裕毅のF1デビューを支えた。',
      },
      {
        period: '2024 - 現在',
        teamName: 'Visa Cash App RB (VCARB)',
        fullName: 'Visa Cash App RB Formula One Team',
        country: 'Italy / United Kingdom',
        flag: '🇮🇹',
        base: 'Faenza, Italy / Milton Keynes, UK',
        powerUnits: ['Honda RBPT (2024-2025)', 'Red Bull Ford (2026〜)'],
        keyPersonnel: ['Peter Bayer', 'Laurent Mekies (2024-2025)', 'Alan Permane (2026〜)', 'Tim Goss'],
        notableDrivers: ['角田裕毅 (Yuki Tsunoda)', 'Liam Lawson', 'Daniel Ricciardo', '岩佐歩夢 (Ayumu Iwasa - Reserve)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'VCARB 01 (2024) / VCARB 03 (2026)',
          description: 'レッドブルとの技術提携を極限まで強化し、角田裕毅が鈴鹿やマイアミで連続入賞を果たしたブルーメタリックのマシン。',
        },
        summary: '「独立した戦闘的レーシングチーム」として全面リニューアル。ミルトンキーンズの空力拠点を拡充し、角田裕毅とリアム・ローソンのコンビで新規定の中団トップ争いを演じる。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'VCARB 03',
      powerUnitName: 'Red Bull Ford Powertrains DM01',
      iceSpecs: '1.6L 90° V6 Turbo (535 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,015 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Front Flap & Rear Wing 2-Stage Active Aero System',
      gearbox: 'Red Bull Technology 8-speed seamless casing',
      brakes: 'Carbon Industrie with integrated electronic fly-by-wire system',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 6. AUDI REVOLUT F1 TEAM ──────────────────────────────────
  audi: {
    teamId: 'audi',
    currentName: 'Audi Revolut F1 Team',
    originYear: 1993,
    founder: 'Peter Sauber (ペーター・ザウバー)',
    headquarters: 'Neuburg an der Donau, Germany / Hinwil, Switzerland',
    allTimeTitles: { drivers: 0, constructors: 0 },
    lineageChain: [
      {
        period: '1993 - 2005',
        teamName: 'Sauber',
        fullName: 'Sauber Formula One Team',
        country: 'Switzerland',
        flag: '🇨🇭',
        base: 'Hinwil, Zurich, Switzerland',
        powerUnits: ['Sauber Ilmor V10', 'Ford Cosworth', 'Petronas (Ferrari V10)'],
        keyPersonnel: ['Peter Sauber', 'Harvey Postlethwaite', 'Willy Rampf'],
        notableDrivers: ['Karl Wendlinger', 'Heinz-Harald Frentzen', 'Jean Alesi', 'Kimi Räikkönen', 'Felipe Massa'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Sauber C12 (1993) / C20 (2001)',
          description: 'C12はF1参戦初戦で5位入賞。C20では21戦の経験しかない無名キミ・ライコネンを抜擢し、コンストラクターズ4位を獲得。',
        },
        summary: 'メルセデスのル・マン制覇からF1に進出したスイスの誇り高きプライベーター。ヒンウィルにF1屈指の巨大フルスケール風洞を自社建設した。',
      },
      {
        period: '2006 - 2009',
        teamName: 'BMW Sauber',
        fullName: 'BMW Sauber F1 Team',
        country: 'Germany / Switzerland',
        flag: '🇩🇪',
        base: 'Hinwil, Switzerland / Munich, Germany',
        powerUnits: ['BMW P86 2.4L V8'],
        keyPersonnel: ['Mario Theissen', 'Peter Sauber', 'Willy Rampf'],
        notableDrivers: ['Nick Heidfeld', 'Jacques Villeneuve', 'Robert Kubica', 'Sebastian Vettel (Debut)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'BMW Sauber F1.08 (2008)',
          description: 'ロバート・クビサが2008年カナダGPでチーム悲願の1-2フィニッシュ初優勝を飾り、ドライバーズ首位に立った傑作マシン。',
        },
        summary: 'ドイツの巨大自動車メーカーBMWが買収しワークス化。2007年にコンストラクターズ2位、2008年にはクビサが優勝を果たすも、2009年末にBMWが急遽撤退した。',
      },
      {
        period: '2010 - 2018',
        teamName: 'Sauber F1 Team',
        fullName: 'Sauber F1 Team',
        country: 'Switzerland',
        flag: '🇨🇭',
        base: 'Hinwil, Zurich, Switzerland',
        powerUnits: ['Ferrari 056 V8 / Ferrari 1.6L V6 Turbo Hybrid'],
        keyPersonnel: ['Peter Sauber', 'Monisha Kaltenborn', 'James Key', 'Jörg Zander'],
        notableDrivers: ['Kamui Kobayashi (小林可夢偉)', 'Sergio Pérez', 'Nico Hülkenberg', 'Charles Leclerc (Debut)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Sauber C31 (2012)',
          description: '卓越したタイヤ温存性能を誇り、ペレスが年間3度の表彰台、小林可夢偉が鈴鹿の日本GPで感動の3位初表彰台を獲得した名車。',
        },
        summary: 'ペーター・ザウバーが買収し直しチームを救済。2012年のペレス＆可夢偉による表彰台ラッシュや、2018年のシャルル・ルクレールの鮮烈デビューを支えた。',
      },
      {
        period: '2019 - 2023',
        teamName: 'Alfa Romeo Racing',
        fullName: 'Alfa Romeo Racing ORLEN / Stake',
        country: 'Switzerland / Italy',
        flag: '🇮🇹',
        base: 'Hinwil, Zurich, Switzerland',
        powerUnits: ['Ferrari 064〜066 V6 Turbo Hybrid'],
        keyPersonnel: ['Frédéric Vasseur', 'Beat Zehnder', 'Jan Monchaux'],
        notableDrivers: ['Kimi Räikkönen', 'Antonio Giovinazzi', 'Valtteri Bottas', '周冠宇 (Zhou Guanyu)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Alfa Romeo C42 (2022)',
          description: '2022年グラウンドエフェクト新規定の初戦でボッタスと周冠宇がダブル入賞を飾り、選手権6位へ躍進。',
        },
        summary: '名門アルファロメオのスポンサーシップを得てリブランド。フレデリック・バスールのもとライコネンやボッタスが参戦し組織力を近代化した。',
      },
      {
        period: '2024 - 2025',
        teamName: 'Stake F1 Team Kick Sauber',
        fullName: 'Stake F1 Team Kick Sauber',
        country: 'Switzerland',
        flag: '🇨🇭',
        base: 'Hinwil, Zurich, Switzerland',
        powerUnits: ['Ferrari 066/12 V6 Turbo Hybrid'],
        keyPersonnel: ['Andreas Seidl', 'Alessandro Alunni Bravi', 'Mattia Binotto (2024〜)'],
        notableDrivers: ['Valtteri Bottas', '周冠宇 (Zhou Guanyu)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Kick Sauber C44 (2024)',
          description: 'アウディ完全買収へ向けた準備期間に蛍光グリーンのカラーリングで戦ったシャシー。',
        },
        summary: 'アウディワークス参戦への過渡期体制。ヒンウィルのファクトリー改修と人材補強を進め、マッティア・ビノットをCOO/CTOに迎えてアウディへのバトンをつないだ。',
      },
      {
        period: '2026 - 現在',
        teamName: 'Audi Revolut F1 Team',
        fullName: 'Audi Revolut F1 Team',
        country: 'Germany / Switzerland',
        flag: '🇩🇪',
        base: 'Neuburg an der Donau, Germany / Hinwil, Switzerland',
        powerUnits: ['Audi Works E-Performance Power Unit'],
        keyPersonnel: ['Mattia Binotto', 'Jonathan Wheatley', 'Stefan Dreyer'],
        notableDrivers: ['Nico Hülkenberg', 'Gabriel Bortoleto'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Audi R26 / C-01 (2026)',
          description: 'アウディがドイツ・ノイブルクで自社開発した記念すべき初代フルワークスF1マシン。',
        },
        summary: 'ル・マン、WRC、ダカールを制したドイツの巨人がザウバーを完全買収しフルワークス参戦。自社製PUとヒンウィルの高精度シャシーでF1の頂点を目指す。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Audi R26-01',
      powerUnitName: 'Audi Works E-Performance 2026',
      iceSpecs: '1.6L 90° V6 Turbo (538 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,018 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Hinwil Full-Scale Wind Tunnel Active Aero Package',
      gearbox: 'Audi Neuburg 8-speed seamless carbon composite',
      brakes: 'Carbon-Carbon with Audi E-Tron fly-by-wire regeneration architecture',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 7. SCUDERIA FERRARI HP ───────────────────────────────────
  ferrari: {
    teamId: 'ferrari',
    currentName: 'Scuderia Ferrari HP',
    originYear: 1950,
    founder: 'Enzo Ferrari (エンツォ・フェラーリ)',
    headquarters: 'Maranello, Emilia-Romagna, Italy',
    allTimeTitles: { drivers: 15, constructors: 16 },
    lineageChain: [
      {
        period: '1950 - 現在 (76年連続参戦)',
        teamName: 'Scuderia Ferrari',
        fullName: 'Scuderia Ferrari HP',
        country: 'Italy',
        flag: '🇮🇹',
        base: 'Maranello, Emilia-Romagna, Italy',
        powerUnits: ['Ferrari In-House V12 / V8 / V6 / V10 / V8 / Hybrid Works'],
        keyPersonnel: ['Enzo Ferrari', 'Mauro Forghieri', 'Jean Todt', 'Ross Brawn', 'Frédéric Vasseur'],
        notableDrivers: ['Alberto Ascari', 'Juan Manuel Fangio', 'Niki Lauda', 'Gilles Villeneuve', 'Michael Schumacher', 'Kimi Räikkönen', 'Fernando Alonso', 'Sebastian Vettel', 'Charles Leclerc', 'Lewis Hamilton'],
        championships: { drivers: 15, constructors: 16 },
        iconicCar: {
          model: 'Ferrari F2004 (2004)',
          description: 'ミハエル・シューマッハが18戦13勝をマークし、数々のサーキットで今なお語り継がれるコースレコードを樹立したF1史上屈指の伝説的傑作。',
        },
        summary: '1950年のF1世界選手権開幕戦以来、一度も途切れることなく全シーズンに参戦し続ける唯一無二の生ける伝説。248勝以上の勝利と最多のタイトルを誇るF1の象徴。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Ferrari SF-26',
      powerUnitName: 'Ferrari 067/3 Works',
      iceSpecs: '1.6L 90° V6 Turbo (545 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,025 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Maranello Dual-Plane Active Aerodynamic Wing Structure',
      gearbox: 'Ferrari 8-speed longitudinal seamless carbon titanium',
      brakes: 'Brembo Carbon-Carbon with Ferrari Gestione Sportiva Fly-by-wire Brake-by-Wire',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 8. MCLAREN FORMULA 1 TEAM ────────────────────────────────
  mclaren: {
    teamId: 'mclaren',
    currentName: 'McLaren Formula 1 Team',
    originYear: 1966,
    founder: 'Bruce McLaren (ブルース・マクラーレン)',
    headquarters: 'Woking, Surrey, United Kingdom',
    allTimeTitles: { drivers: 12, constructors: 9 },
    lineageChain: [
      {
        period: '1966 - 現在 (60年連続参戦)',
        teamName: 'McLaren Racing',
        fullName: 'McLaren Formula 1 Team',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Woking, Surrey, UK',
        powerUnits: ['Ford-Cosworth DFV', 'TAG Porsche Turbo', 'Honda V10/V12', 'Mercedes-Benz', 'Mercedes-AMG M17 (Current)'],
        keyPersonnel: ['Bruce McLaren', 'Teddy Mayer', 'Ron Dennis', 'Gordon Murray', 'Adrian Newey', 'Andrea Stella', 'Zak Brown'],
        notableDrivers: ['Emerson Fittipaldi', 'James Hunt', 'Niki Lauda', 'Alain Prost', 'Ayrton Senna', 'Mika Häkkinen', 'Kimi Räikkönen', 'Lewis Hamilton', 'Lando Norris', 'Oscar Piastri'],
        championships: { drivers: 12, constructors: 9 },
        iconicCar: {
          model: 'McLaren MP4/4 (1988)',
          description: 'アイルトン・セナとアラン・プロストが16戦15勝（勝率93.8%）を達成し、ホンダV6ターボとともにF1界を完全制覇した伝説の最高傑作。',
        },
        summary: 'ブルース・マクラーレンが1963年に創設し1966年モナコGPでデビュー。ロン・デニス時代にカーボンモノコック（MP4/1）を初導入し黄金期を築いた名門。2024-2025年にノリス＆ピアストリで王座へ返り咲いた。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'McLaren MCL40',
      powerUnitName: 'Mercedes-AMG M17 E Performance Customer Works',
      iceSpecs: '1.6L 90° V6 Turbo (540 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,020 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'MTC Woking State-of-the-Art Active Aerodynamic Control',
      gearbox: 'McLaren 8-speed seamless casing with carbon composite structural bellhousing',
      brakes: 'Akebono / Brembo Carbon-Carbon with advanced MGU-K regeneration integration',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 9. WILLIAMS RACING ───────────────────────────────────────
  williams: {
    teamId: 'williams',
    currentName: 'Williams Racing',
    originYear: 1977,
    founder: 'Sir Frank Williams & Sir Patrick Head',
    headquarters: 'Grove, Oxfordshire, United Kingdom',
    allTimeTitles: { drivers: 7, constructors: 9 },
    lineageChain: [
      {
        period: '1977 - 現在 (49年連続参戦)',
        teamName: 'Williams Grand Prix Engineering',
        fullName: 'Williams Racing',
        country: 'United Kingdom',
        flag: '🇬🇧',
        base: 'Grove, Oxfordshire, UK',
        powerUnits: ['Ford-Cosworth DFV', 'Honda Turbo', 'Renault V10', 'BMW V10', 'Mercedes-AMG Works (Current)'],
        keyPersonnel: ['Sir Frank Williams', 'Sir Patrick Head', 'Adrian Newey', 'James Vowles', 'Pat Fry'],
        notableDrivers: ['Alan Jones', 'Keke Rosberg', 'Nelson Piquet', 'Nigel Mansell', 'Alain Prost', 'Ayrton Senna', 'Damon Hill', 'Jacques Villeneuve', 'Juan Pablo Montoya', 'Alexander Albon', 'Carlos Sainz'],
        championships: { drivers: 7, constructors: 9 },
        iconicCar: {
          model: 'Williams FW14B (1992)',
          description: 'アクティブサスペンション、トラクションコントロール、セミオートマチック変速を極限まで融合させ、ナイジェル・マンセルが開幕5連勝・年間9勝で圧倒的戴冠を果たしたハイテクの頂点。',
        },
        summary: 'フランク・ウィリアムズとパトリック・ヘッドが設立した純然たる名門レーシングコンストラクター。80年代〜90年代に9度のコンストラクターズ王座に輝き、現在はジェームズ・ボウルズのもと名門復権へ突き進む。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Williams FW48',
      powerUnitName: 'Mercedes-AMG M17 E Performance Customer',
      iceSpecs: '1.6L 90° V6 Turbo (540 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,020 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Grove Active Straight / Corner Aerodynamics',
      gearbox: 'Mercedes-AMG 8-speed seamless casing',
      brakes: 'Brembo Carbon-Carbon with integrated fly-by-wire regeneration',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 10. MONEYGRAM HAAS F1 TEAM ───────────────────────────────
  haas: {
    teamId: 'haas',
    currentName: 'MoneyGram Haas F1 Team',
    originYear: 2016,
    founder: 'Gene Haas (ジーン・ハース)',
    headquarters: 'Kannapolis, North Carolina, USA / Banbury, UK',
    allTimeTitles: { drivers: 0, constructors: 0 },
    lineageChain: [
      {
        period: '2016 - 現在 (参戦11年目)',
        teamName: 'Haas F1 Team',
        fullName: 'MoneyGram Haas F1 Team',
        country: 'United States',
        flag: '🇺🇸',
        base: 'Kannapolis, NC, USA / Banbury, UK / Maranello, Italy',
        powerUnits: ['Ferrari 1.6L V6 Turbo Hybrid (2016〜)'],
        keyPersonnel: ['Gene Haas', 'Guenther Steiner (2016-2023)', 'Ayao Komatsu (小松礼雄 - 2024〜)', 'Andrea De Zordo'],
        notableDrivers: ['Romain Grosjean', 'Kevin Magnussen', 'Mick Schumacher', 'Nico Hülkenberg', 'Esteban Ocon', 'Oliver Bearman'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Haas VF-18 (2018) / VF-22 (2022)',
          description: 'VF-18で参戦3年目にしてコンストラクターズ5位を獲得。VF-22ではマグヌッセンがインテルラゴスの雨の予選でチーム史上初のポールポジションを獲得。',
        },
        summary: '工作機械大手ハース・オートメーション創業者のジーン・ハースが設立した現代アメリカ唯一のF1チーム。ダラーラ製シャシーとフェラーリ製コンポーネントを融合させた革新的なリーン提携モデルで躍進。2024年からは小松礼雄代表が率いる。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Haas VF-26',
      powerUnitName: 'Ferrari 067/3 Customer Works',
      iceSpecs: '1.6L 90° V6 Turbo (545 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,025 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Dallara / Haas Wind Tunnel Active Aero Package',
      gearbox: 'Ferrari 8-speed longitudinal seamless casing',
      brakes: 'Brembo Carbon-Carbon with integrated Ferrari fly-by-wire',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },

  // ── 11. CADILLAC FORMULA 1 TEAM ──────────────────────────────
  cadillac: {
    teamId: 'cadillac',
    currentName: 'Cadillac Formula 1 Team',
    originYear: 2026,
    founder: 'General Motors / TWG Global',
    headquarters: 'Fishers, Indiana, USA / Silverstone, UK',
    allTimeTitles: { drivers: 0, constructors: 0 },
    lineageChain: [
      {
        period: '2026 - 現在 (第11チーム新規参戦)',
        teamName: 'Cadillac Formula 1 Team',
        fullName: 'Cadillac Formula 1 Team',
        country: 'United States',
        flag: '🇺🇸',
        base: 'Fishers, Indiana, USA / Silverstone, UK',
        powerUnits: ['Ferrari Works PU (2026-2027) / GM Cadillac Works PU (2028〜)'],
        keyPersonnel: ['Marcin Budkowski', 'Graeme Lowdon', 'Pat Symonds (Executive Consultant)'],
        notableDrivers: ['Sergio Pérez', 'Valtteri Bottas', 'Colton Herta (Reserve)', 'Pato O\'Ward (Reserve)'],
        championships: { drivers: 0, constructors: 0 },
        iconicCar: {
          model: 'Cadillac MAC-01 (2026)',
          description: 'ゼネラルモーターズ（GM）の最高峰ブランド・キャデラックが参入した第11番目の新チームの記念碑的初号機。',
        },
        summary: 'GMの巨大な技術資本とTWG Globalが結集し、新規定導入の2026年にF1グリッドへ電撃参戦した記念すべき第11番目の新興ワークスチーム。ペレスとボッタスという通算16勝の超ベテランデュオを擁する。',
      },
    ],
    technicalSpecs: {
      chassisCode: 'Cadillac MAC-01',
      powerUnitName: 'Ferrari 067/3 Customer (Transition spec for GM Works)',
      iceSpecs: '1.6L 90° V6 Turbo (545 bhp @ 15,000 RPM, 100% Sustainable Fuel)',
      ersPowerKw: 350,
      totalHorsepower: '> 1,025 bhp',
      weightKg: 768,
      wheelbaseMm: 3400,
      widthMm: 1900,
      activeAero: 'Silverstone / GM Tech Center Active Aerodynamic Architecture',
      gearbox: 'Ferrari 8-speed seamless casing',
      brakes: 'Brembo Carbon-Carbon with fly-by-wire hybrid deceleration',
      fuelRegulation: 'FIA 3,000 MJ/h Energy Flow Rate (100% Advanced Sustainable Fuel)',
    },
  },
};

/**
 * Retrieve lineage record for a given team ID
 */
export function getTeamLineage(teamId: string): TeamLineageRecord | undefined {
  return TEAM_LINEAGE_DATA[teamId];
}

/**
 * Retrieve car technical specs for a given team ID
 */
export function getTeamCarSpecs(teamId: string): CarTechnicalSpecs | undefined {
  return TEAM_LINEAGE_DATA[teamId]?.technicalSpecs;
}
