import { LegendDriver } from './types';

export const LEGENDS: LegendDriver[] = [
  {
    id: "fangio",
    name: "Juan Manuel Fangio",
    nameJa: "ファンジオ",
    nationality: "ARG",
    born: "1911-06-24",
    died: "1995-07-17",
    years: "1950-1951, 1953-1958",
    teams: ["Alfa Romeo", "Maserati", "Mercedes", "Ferrari"],
    championships: 5,
    championshipYears: [1951, 1954, 1955, 1956, 1957],
    wins: 24,
    poles: 29,
    podiums: 35,
    starts: 51,
    statsAsOf: "1958-07-06",
    summaryJa: "F1創世記を代表するアルゼンチン出身のドライバー。5度のワールドチャンピオンを獲得し、その記録は長年破られなかった。驚異的な勝率と、異なる4つのチームでのチャンピオン獲得という類まれな偉業を成し遂げた。",
    signatureMoments: [
      {
        year: 1957,
        titleJa: "ニュルブルクリンクの奇跡",
        descriptionJa: "ピットストップの遅れを取り戻すため、コースレコードを何度も更新し大逆転勝利を収めた伝説のレース。"
      },
    ],
    references: [
      {
        title: "Hall of Fame: Juan Manuel Fangio",
        url: "https://www.formula1.com/en/drivers/hall-of-fame/Juan_Manuel_Fangio.html",
        publisher: "Formula 1",
        tier: 1,
        accessedDate: "2026-10-05"
      },
      {
        title: "Juan Manuel FANGIO - Statistics",
        url: "https://www.statsf1.com/en/juan-manuel-fangio.aspx",
        publisher: "StatsF1",
        tier: 3,
        accessedDate: "2026-10-05"
      },
    ]
  },
  {
    id: "clark",
    name: "Jim Clark",
    nameJa: "ジム・クラーク",
    nationality: "GBR",
    born: "1936-03-04",
    died: "1968-04-07",
    years: "1960-1968",
    teams: ["Lotus"],
    championships: 2,
    championshipYears: [1963, 1965],
    wins: 25,
    poles: 33,
    podiums: 32,
    starts: 72,
    statsAsOf: "1968-01-01",
    summaryJa: "1960年代を代表するスコットランド出身の天才ドライバー。ロータスのコーリン・チャップマンと強力なタッグを組み、2度のワールドチャンピオンに輝いた。非常にスムーズでマシンに負担をかけないドライビングスタイルで知られ、通算33回のポールポジションを記録した。",
    signatureMoments: [
      {
        year: 1965,
        titleJa: "インディ500制覇とF1王者の同時獲得",
        descriptionJa: "F1で圧倒的な強さを見せてチャンピオンになると同時に、アメリカのインディ500でも優勝を果たした。"
      },
    ],
    references: [
      {
        title: "Hall of Fame: Jim Clark",
        url: "https://www.formula1.com/en/drivers/hall-of-fame/Jim_Clark.html",
        publisher: "Formula 1",
        tier: 1,
        accessedDate: "2026-10-05"
      },
      {
        title: "Jim CLARK - Statistics",
        url: "https://www.statsf1.com/en/jim-clark.aspx",
        publisher: "StatsF1",
        tier: 3,
        accessedDate: "2026-10-05"
      },
    ]
  },
  {
    id: "lauda",
    name: "Niki Lauda",
    nameJa: "ニキ・ラウダ",
    nationality: "AUT",
    born: "1949-02-22",
    died: "2019-05-20",
    years: "1971-1979, 1982-1985",
    teams: ["March", "BRM", "Ferrari", "Brabham", "McLaren"],
    championships: 3,
    championshipYears: [1975, 1977, 1984],
    wins: 25,
    poles: 24,
    podiums: 54,
    starts: 171,
    statsAsOf: "1985-11-03",
    summaryJa: "冷静沈着なドライビングと優れたマシンセットアップ能力から「コンピューター」の異名を取ったオーストリア出身のドライバー。1976年の大事故で瀕死の重傷を負うも、奇跡的な復活を遂げた。フェラーリとマクラーレンで計3度のワールドチャンピオンを獲得した。",
    signatureMoments: [
      {
        year: 1976,
        titleJa: "不死鳥の帰還",
        descriptionJa: "ニュルブルクリンクでの大クラッシュで生死をさまよったわずか6週間後、イタリアGPで奇跡のレース復帰を果たした。"
      },
    ],
    references: [
      {
        title: "Hall of Fame: Niki Lauda",
        url: "https://www.formula1.com/en/drivers/hall-of-fame/Niki_Lauda.html",
        publisher: "Formula 1",
        tier: 1,
        accessedDate: "2026-10-05"
      },
      {
        title: "Niki LAUDA - Statistics",
        url: "https://www.statsf1.com/en/niki-lauda.aspx",
        publisher: "StatsF1",
        tier: 3,
        accessedDate: "2026-10-05"
      },
    ]
  },
  {
    id: "senna",
    name: "Ayrton Senna",
    nameJa: "アイルトン・セナ",
    nationality: "BRA",
    born: "1960-03-21",
    died: "1994-05-01",
    years: "1984-1994",
    teams: ["Toleman", "Lotus", "McLaren", "Williams"],
    championships: 3,
    championshipYears: [1988, 1990, 1991],
    wins: 41,
    poles: 65,
    podiums: 80,
    starts: 161,
    statsAsOf: "1994-05-01",
    summaryJa: "予選での圧倒的な速さと、雨のレースでの神がかり的なドライビングで知られるブラジル出身の英雄。アラン・プロストとの熾烈なライバル関係はF1の歴史に残る。マクラーレン・ホンダ時代に3度のワールドチャンピオンに輝いた。",
    signatureMoments: [
      {
        year: 1993,
        titleJa: "ドニントンのオープニングラップ",
        descriptionJa: "ヨーロッパGPの雨の1周目、圧倒的なマシンコントロールで5位から次々とオーバーテイクしトップに立った。"
      },
    ],
    references: [
      {
        title: "Hall of Fame: Ayrton Senna",
        url: "https://www.formula1.com/en/drivers/hall-of-fame/Ayrton_Senna.html",
        publisher: "Formula 1",
        tier: 1,
        accessedDate: "2026-10-05"
      },
      {
        title: "Ayrton SENNA - Statistics",
        url: "https://www.statsf1.com/en/ayrton-senna.aspx",
        publisher: "StatsF1",
        tier: 3,
        accessedDate: "2026-10-05"
      },
    ]
  },
  {
    id: "schumacher",
    name: "Michael Schumacher",
    nameJa: "ミハエル・シューマッハ",
    nationality: "GER",
    born: "1969-01-03",
    years: "1991-2006, 2010-2012",
    teams: ["Jordan", "Benetton", "Ferrari", "Mercedes"],
    championships: 7,
    championshipYears: [1994, 1995, 2000, 2001, 2002, 2003, 2004],
    wins: 91,
    poles: 68,
    podiums: 155,
    starts: 306,
    statsAsOf: "2012-11-25",
    summaryJa: "歴代最多タイとなる7度のワールドチャンピオンを獲得したドイツ出身の伝説的ドライバー。フェラーリの黄金期を築き上げ、当時の数々のF1記録を塗り替えた。絶え間ない努力と完璧なレース戦略、圧倒的なスピードで長くF1界を支配した。",
    signatureMoments: [
      {
        year: 2000,
        titleJa: "フェラーリに21年ぶりの栄冠",
        descriptionJa: "鈴鹿サーキットでの激闘を制し、フェラーリにとって21年ぶりとなるドライバーズチャンピオンをもたらした。"
      },
    ],
    references: [
      {
        title: "Hall of Fame: Michael Schumacher",
        url: "https://www.formula1.com/en/drivers/hall-of-fame/Michael_Schumacher.html",
        publisher: "Formula 1",
        tier: 1,
        accessedDate: "2026-10-05"
      },
      {
        title: "Michael SCHUMACHER - Statistics",
        url: "https://www.statsf1.com/en/michael-schumacher.aspx",
        publisher: "StatsF1",
        tier: 3,
        accessedDate: "2026-10-05"
      },
    ]
  },
];