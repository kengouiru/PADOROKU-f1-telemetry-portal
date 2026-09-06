'use client';

/**
 * data/f1DramaData.ts
 * F1 Human Drama, Season Storylines, Iconic Rivalries, Emotional Moments & Paddock Chemistry
 * The core emotional differentiator of the F1 Telemetry Portal.
 */

// ─────────────────────────────────────────────────────────────
// 1. DATA INTERFACES
// ─────────────────────────────────────────────────────────────

export interface Chapter {
  chapterNumber: number;
  title: string;
  races: string;
  story: string;
  pivotalMoment: string;
  radioOrQuote?: string;
}

export interface SeasonStoryline {
  id: string;
  seasonYear: string;
  category: 'contemporary' | 'historic' | 'legend';
  title: string;
  subtitle: string;
  tagline: string;
  overview: string;
  chapters: Chapter[];
  champion: string;
  constructorsChampion: string;
  aftermath: string;
}

export interface Rivalry {
  id: string;
  type: 'current' | 'historic';
  name: string;
  subtitle: string;
  driver1: {
    name: string;
    code: string;
    team: string;
    titles: number;
    color: string;
  };
  driver2: {
    name: string;
    code: string;
    team: string;
    titles: number;
    color: string;
  };
  nature: string;
  definingMoment: string;
  h2hSummary: string;
  quote: string;
}

export interface DramaticMoment {
  id: string;
  title: string;
  grandPrix: string;
  year: number;
  hero: string;
  team: string;
  badge: string;
  radioQuote: string;
  radioSpeaker: string;
  story: string;
  outcome: string;
  aftermath: string;
  tag: string;
}

export interface PaddockRelationship {
  id: string;
  category: 'teammate' | 'principal' | 'academy' | 'rival';
  title: string;
  description: string;
  members: { name: string; code: string; role: string }[];
  dynamics: string;
  badgeColor: string;
}

// Retain backward-compatible interfaces
export type DramaCategory = 'rivalry' | 'civil_war' | 'triumph' | 'saga';

export interface IconicQuote {
  speaker: string;
  quote: string;
  context: string;
}

export interface DramaEpisode {
  id: string;
  category: DramaCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  era: string;
  protagonists: {
    name: string;
    code: string;
    role: string;
    avatarUrl?: string;
    team: string;
    color: string;
  }[];
  tagline: string;
  overview: string;
  acts: {
    actNumber: number;
    actTitle: string;
    description: string;
    pivotalMoment: string;
  }[];
  iconicQuotes: IconicQuote[];
  decisiveGrandPrix: {
    gp: string;
    year: number;
    summary: string;
    videoOrRadioHighlight: string;
  };
  aftermath: string;
  whyItMatters: string;
}

export interface RelationshipConnection {
  source: string;
  target: string;
  relationType: 'mentor' | 'bro' | 'rival' | 'tense';
  label: string;
  description: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────
// 2. SEASON STORYLINES (連続ドラマ本編)
// ─────────────────────────────────────────────────────────────

export const SEASON_STORYLINES: SeasonStoryline[] = [
  {
    id: 'season-2024-collapse-of-the-throne',
    seasonYear: '2024',
    category: 'contemporary',
    title: '2024シーズン「王座崩壊」',
    subtitle: 'レッドブル無敵の春から、マクラーレンの覚醒と4強大乱戦へ',
    tagline: '絶対王者に走った亀裂。史上最も予測不能な群雄割拠の24戦。',
    overview:
      '2023年に22戦21勝という空前絶後の独走を演じたレッドブルとフェルスタッペン。しかし2024年、革新的空力マシンRB20の迷走、エイドリアン・ニューウェイの電撃離脱、そしてマクラーレンの大覚醒により、F1の勢力図は激変した。1シーズンで7人ものウィナーが誕生した激動のドラマ。',
    chapters: [
      {
        chapterNumber: 1,
        title: '開幕連勝 — フェルスタッペン無敵の春',
        races: '第1戦バーレーンGP 〜 第5戦中国GP',
        story:
          '開幕戦バーレーンでフェルスタッペンがポールトゥウィン＆ファステストの完全勝利。続くサウジアラビア、日本、中国でも圧倒的な速さを見せ、「今年も全勝か」とパドック全体が絶望に包まれた。しかしオーストラリアではリアブレーキ発火によるまさかのリタイアが発生し、小さな影を落とし始める。',
        pivotalMoment: 'バーレーンで2位ペレスに22秒差をつけてフィニッシュしたフェルスタッペンの冷徹な独走。',
        radioOrQuote: '🎙️ フェルスタッペン: 「マシンは完璧だ。完全に手の中にある」',
      },
      {
        chapterNumber: 2,
        title: '亀裂 — マクラーレンの逆襲開始',
        races: '第6戦マイアミGP 〜 第8戦モナコGP',
        story:
          'マイアミGPにマクラーレンが持ち込んだ大型アップデートが奇跡を起こす。セーフティカーの好機を逃さず首位に立ったランド・ノリスが、リスタート後にフェルスタッペンを自力で引き離して110戦目の初優勝を達成。続くモナコではシャルル・ルクレールが悲願の母国初制覇を果たし、レッドブルの絶対優位が完全に崩壊した。',
        pivotalMoment: 'マイアミの表彰台で、シャンパンを頭から浴びて男泣きするランド・ノリス。',
        radioOrQuote: '🎙️ ノリス: 「長かった...ついにやったぞ！みんな、本当にありがとう！」',
      },
      {
        chapterNumber: 3,
        title: '群雄割拠 — 4チームの四つ巴',
        races: '第9戦カナダGP 〜 第12戦イギリスGP',
        story:
          'カナダの雨でフェルスタッペンが辛勝するも、マクラーレン、フェラーリ、メルセデスの3チームが急速に接近。スペイン、オーストリア、シルバーストーンでは毎戦ポールシッターと勝者が入れ替わる大激戦。シルバーストーンではルイス・ハミルトンが945日ぶりの涙の復活優勝を飾り、全英が号泣した。',
        pivotalMoment: 'シルバーストーンのチェッカー後、コクピットで声を震わせて泣きじゃくるハミルトン。',
        radioOrQuote: '🎙️ ハミルトン: 「これ以上嬉しい勝利はない...僕を信じ続けてくれてありがとう」',
      },
      {
        chapterNumber: 4,
        title: '夏の嵐 — レッドブル内紛とノリスの覚醒',
        races: '第13戦ハンガリーGP 〜 第15戦オランダGP',
        story:
          'ハンガリーではピアストリが初優勝を飾るも、マクラーレンの「パパイヤルール（チームオーダー）」を巡りノリスとの間に不穏な空気が流れる。一方のレッドブルはバランスの破綻に苦しみ、フェルスタッペンは無線で怒りを爆発させる。夏休み明けのオランダGPでは、ノリスがフェルスタッペンの母国で22秒の大差をつけて圧勝。タイトル争いが一気に点火した。',
        pivotalMoment: 'オランダGPで、フェルスタッペンのお膝元ザントフォールトを静まり返らせたノリスの完勝劇。',
        radioOrQuote: '🎙️ フェルスタッペン: 「この車は全く曲がらない！戦略も最悪だ！」',
      },
      {
        chapterNumber: 5,
        title: '頂上決戦 — サンパウロ豪雨の神業',
        races: '第16戦イタリアGP 〜 第21戦サンパウロGP',
        story:
          'モンツァでルクレールが魂の1ストップ作戦で優勝。ノリスがジワジワとポイント差を詰める中、迎えたブラジルGP。大雨の予選でフェルスタッペンは17番グリッドへ沈み、ノリスがポール。誰もがノリスの大逆転を確信した決勝、豪雨の中でフェルスタッペンが異次元のブレーキングとライン取りで17台をゴボウ抜き。ファステストを連発して奇跡の優勝を飾り、タイトル争いに終止符を打った。',
        pivotalMoment: '17番手スタートから水煙を切り裂き、次々とライバルをねじ伏せるフェルスタッペンの雨のドライビング。',
        radioOrQuote: '🎙️ フェルスタッペン: 「Simply Lovely! 地獄の底から這い上がったぞ！」',
      },
      {
        chapterNumber: 6,
        title: '最終章 — エピローグと来季への伏線',
        races: '第22戦ラスベガスGP 〜 第24戦アブダビGP',
        story:
          'ラスベガスでフェルスタッペンが4年連続のドライバーズ世界王者を確定。一方コンストラクターズ選手権は最終戦アブダビまでもつれ込み、マクラーレンが1998年以来26年ぶりとなる念願のチーム王座を獲得。そしてハミルトンは12年間苦楽を共にしたメルセデスに別れを告げ、2025年のフェラーリ移籍へと向かった。',
        pivotalMoment: 'アブダビのパルクフェルメでメルセデスチーム全員と抱き合うハミルトンのラストラン。',
        radioOrQuote: '🎙️ トト・ヴォルフ: 「ルイス、君は永遠に僕たちのチャンピオンだ」',
      },
    ],
    champion: 'マックス・フェルスタッペン (Red Bull Racing / 4連覇)',
    constructorsChampion: 'McLaren F1 Team (26年ぶりのコンストラクターズ王者)',
    aftermath:
      '1チームの独走時代が終わり、マクラーレン、フェラーリ、メルセデス、レッドブルの4強が拮抗する黄金時代が幕を開けた。2025年への期待を最高潮に高めた伝説のシーズン。',
  },
  {
    id: 'season-2021-titans-clash',
    seasonYear: '2021',
    category: 'contemporary',
    title: '2021シーズン「世紀の対決」',
    subtitle: 'ハミルトン vs フェルスタッペン 全22戦の激闘とアブダビの審判',
    tagline: '7冠の絶対王者と新世代の暴風。F1史上で最も苛烈を極めたライバル死闘。',
    overview:
      '新旧世代の二大巨頭が、毎戦ホイール・トゥ・ホイールで激突した2021年。シルバーストーンの51Gクラッシュ、モンツァの乗り上げ事故、サウジアラビアの混沌を経て、同点（369.5ポイント）で迎えた最終戦アブダビGPのファイナルラップまで勝負がもつれ込んだ。',
    chapters: [
      {
        chapterNumber: 1,
        title: '激突の予兆 — 序盤戦の鍔迫り合い',
        races: '開幕戦バーレーン 〜 第9戦オーストリア',
        story:
          '開幕戦バーレーンから最終周まで続いた死闘。フェルスタッペンが速さを見せ、ハミルトンが経験と戦術で対抗。モナコ、フランス、オーストリアとフェルスタッペンが3連勝を飾り、新世代の戴冠が現実味を帯びる。',
        pivotalMoment: 'フランスGPでフェルスタッペンが2ストップ作戦から残り2周でハミルトンを逆転した瞬間。',
      },
      {
        chapterNumber: 2,
        title: '宣戦布告 — シルバーストーン51Gの衝撃',
        races: '第10戦イギリスGP 〜 第14戦イタリアGP',
        story:
          'シルバーストーンのコプス・コーナーで時速290km/hでの接触。フェルスタッペンは51Gの衝撃でバリアへ激突し病院へ搬送。ハミルトンが優勝し両者の関係は修復不能へ。続くモンツァでは第1シケインで接触し、レッドブルがメルセデスの頭上に乗り上げる事故が発生。',
        pivotalMoment: 'ハミルトンの頭上数十センチにフェルスタッペンのリアタイヤが乗っかったモンツァの衝撃映像。',
      },
      {
        chapterNumber: 3,
        title: 'アブダビの審判 — 最終周のドラマ',
        races: '第21戦サウジアラビアGP 〜 最終戦アブダビGP',
        story:
          '同点首位で迎えたアブダビ。ハミルトンがレースを支配し8冠目を手中に収めたかに見えた残り5周、ラティフィのクラッシュでセーフティカー出動。レースディレクターの特例判断によりファイナルラップのみリスタート。新品ソフトのフェルスタッペンがターン5でハミルトンをインから抜き去り、初戴冠を果たした。',
        pivotalMoment: 'アブダビのターン5でインに飛び込み、首位を奪い去ったフェルスタッペンのオーバーテイク。',
        radioOrQuote: '🎙️ フェルスタッペン: 「オーマイゴッド！やった！信じられない！」',
      },
    ],
    champion: 'マックス・フェルスタッペン (初戴冠)',
    constructorsChampion: 'Mercedes-AMG (8連覇)',
    aftermath:
      'FIAのレースディレクション改革（マイケル・マシ解任）へと発展し、現代F1の熱狂を世界中に広げた歴史的転換点。',
  },
  {
    id: 'legend-senna-prost',
    seasonYear: '1988-1990',
    category: 'legend',
    title: 'レジェンド編：セナ vs プロスト「宿命のライバル」',
    subtitle: 'マクラーレン・ホンダ黄金期に起きた、天才とプロフェッサーの愛憎劇',
    tagline: '神に選ばれた男と、数理で走る男。鈴鹿で2年連続起きた衝突決着。',
    overview:
      '同じマクラーレン・ホンダで16戦15勝を記録した二人の天才。しかし「勝つこと」への異常な執念が友情を憎悪へと変え、1989年鈴鹿シケインでの接触、1990年鈴鹿第1コーナーでの時速250km/h特攻衝突という、モータースポーツ史最大の確執を生んだ。',
    chapters: [
      {
        chapterNumber: 1,
        title: '蜜月から亀裂へ — イモラの紳士協定破棄 (1989)',
        races: '1989年 サンマリノGP',
        story:
          '「スタートの第1コーナーを制した者が先行し、無駄な争いを避ける」という密約を交わしていた二人。リスタート時、セナがプロストをオーバーテイクしたことでプロストは激怒。二人の対話は完全に途絶えた。',
        pivotalMoment: 'イモラのトサ・コーナーでプロストのインを刺したセナの動き。',
      },
      {
        chapterNumber: 2,
        title: '鈴鹿シケインの接触 (1989)',
        races: '1989年 日本GP (鈴鹿)',
        story:
          'プロストがタイトル王手をかけた鈴鹿。47周目のシケインでセナがインに飛び込むが、プロストはステアリングをインへ切り込み両車接触。プロストはマシンを降り、セナは押しがけで復帰しトップチェッカーを受けるも、後にFIAからシケイン不通過で失格処分を下され、プロストの王座が確定した。',
        pivotalMoment: 'シケインで絡み合い、コース脇に静止した2台のマクラーレン・ホンダ。',
      },
      {
        chapterNumber: 3,
        title: '時速250km/hのリベンジ特攻 (1990)',
        races: '1990年 日本GP (鈴鹿)',
        story:
          'フェラーリへ移籍したプロストと、マクラーレンに残ったセナ。迎えた翌年の鈴鹿、スタート直後の第1コーナーで、セナは減速せずアウトから被せてきたプロストのリアに全開で突進。両車大クラッシュで即リタイアとなり、セナのチャンピオンが決定した。',
        pivotalMoment: '第1コーナーの砂煙の中へ2台が消え去ったスタート直後の9秒間。',
      },
    ],
    champion: '1988: セナ / 1989: プロスト / 1990: セナ',
    constructorsChampion: 'McLaren-Honda',
    aftermath:
      'プロストが1993年に引退を表明した最終戦アデレードの表彰台で、セナはプロストを抱き寄せ、二人はついに和解した。',
  },
  {
    id: 'legend-schumacher-imperator',
    seasonYear: '1996-2004',
    category: 'legend',
    title: 'レジェンド編：シューマッハ「皇帝の軌跡」',
    subtitle: '暗黒期のフェラーリを21年ぶりの戴冠へ導いた不屈のエンジニアリング精神',
    tagline: '跳ね馬の復活と、前人未到の黄金5連覇。',
    overview:
      'ベネトンで2度の王者に輝いたミハエル・シューマッハは、20年以上タイトルから見放されていた名門フェラーリへ移籍。ジャン・トッド、ロス・ブラウンらと共にチームを根底から叩き直し、2000年に21年ぶりの悲願達成。そこから2004年まで続く不滅の5連覇を打ち立てた。',
    chapters: [
      {
        chapterNumber: 1,
        title: '跳ね馬の再建 — 雨のバルセロナで見せた魔術 (1996)',
        races: '1996年 スペインGP',
        story:
          '信頼性も空力も劣るフェラーリF310。豪雨のバルセロナでシューマッハは他車より毎周4秒も速い神懸かりの走りを披露し、フェラーリでの初優勝を飾る。',
        pivotalMoment: '水浸しのカタルーニャ・サーキットを独走する赤いマシンの異次元の速さ。',
      },
      {
        chapterNumber: 2,
        title: '21年ぶりの悲願 — 鈴鹿での歓喜 (2000)',
        races: '2000年 日本GP (鈴鹿)',
        story:
          'ライバルのミカ・ハッキネン（マクラーレン）と毎周コンマ数秒を争う究極のストップ・ラップ合戦。ピット戦略で逆転に成功したシューマッハがトップでチェッカーを受け、フェラーリに1979年以来となる栄冠をもたらした。',
        pivotalMoment: 'チェッカーフラッグを受けた瞬間、ステアリングを何度も激しく叩いて咆哮したシューマッハ。',
      },
    ],
    champion: 'ミハエル・シューマッハ (通算7度王者)',
    constructorsChampion: 'Scuderia Ferrari (6連覇)',
    aftermath:
      '近代F1における「ドライバーと技術陣の完璧な統合」という現在のメルセデスやレッドブルの基礎となる組織モデルを作り上げた。',
  },
];

// ─────────────────────────────────────────────────────────────
// 3. RIVALRIES (宿命のライバル直接対決)
// ─────────────────────────────────────────────────────────────

export const RIVALRIES: Rivalry[] = [
  {
    id: 'verstappen-vs-norris',
    type: 'current',
    name: 'マックス・フェルスタッペン vs ランド・ノリス',
    subtitle: 'カート時代からの幼馴染が、世界一の王座を賭けて激突した宿命',
    driver1: {
      name: 'マックス・フェルスタッペン',
      code: 'VER',
      team: 'Red Bull Racing',
      titles: 4,
      color: '#3671C6',
    },
    driver2: {
      name: 'ランド・ノリス',
      code: 'NOR',
      team: 'McLaren',
      titles: 0,
      color: '#FF8000',
    },
    nature: 'プライベートでは一緒にシムレースやパデルを楽しむ親友同士。しかしコース上では一歩も引かない2024年のタイトル直接対決関係。',
    definingMoment:
      '2024年オーストリアGP：激しいトップ争いの中、ターン3で接触し両者パンク。友情の破綻が懸念されるほどの舌戦へ発展。',
    h2hSummary: '2024年はノリスが予選で互角以上の速さを見せ、フェルスタッペンが雨のブラジルで王者の貫禄を示した。',
    quote: '「僕たちは親友だ。でもヘルメットをかぶれば、彼を倒すこと以外何も考えていない。」— ランド・ノリス',
  },
  {
    id: 'leclerc-vs-sainz',
    type: 'current',
    name: 'シャルル・ルクレール vs カルロス・サインツ',
    subtitle: 'フェラーリ名門の正統派エース争いと、苦渋の別離',
    driver1: {
      name: 'シャルル・ルクレール',
      code: 'LEC',
      team: 'Scuderia Ferrari',
      titles: 0,
      color: '#E80020',
    },
    driver2: {
      name: 'カルロス・サインツ',
      code: 'SAI',
      team: 'Williams (元Ferrari)',
      titles: 0,
      color: '#00A0DE',
    },
    nature: '互いを認め合う紳士的コンビでありながら、戦略の不平等感や同士討ち寸前の接触（2024中国スプリント、スペイン）で火花を散らした社内ライバル。',
    definingMoment:
      '2024年開幕前、ハミルトンの電撃加入によりサインツの契約非更新が決定。サインツは意地の走りでオーストラリア優勝を果たす。',
    h2hSummary: '予選一発の純粋スピードはルクレール、レースペースの安定性と独自の戦略眼はサインツという極めてハイレベルな均衡。',
    quote: '「カルロスほど僕を限界までプッシュさせたチームメイトはいない。」— シャルル・ルクレール',
  },
  {
    id: 'hamilton-vs-russell',
    type: 'current',
    name: 'ルイス・ハミルトン vs ジョージ・ラッセル',
    subtitle: '7冠の生ける伝説と、玉座を狙う若き英国エースの世代闘争',
    driver1: {
      name: 'ルイス・ハミルトン',
      code: 'HAM',
      team: 'Ferrari (元Mercedes)',
      titles: 7,
      color: '#00D2BE',
    },
    driver2: {
      name: 'ジョージ・ラッセル',
      code: 'RUS',
      team: 'Mercedes-AMG',
      titles: 0,
      color: '#27F4D2',
    },
    nature: 'メルセデス育成出身のラッセルが、少年時代からの英雄ハミルトンと同じチームでナンバーワンを奪い合う緊張感。',
    definingMoment:
      '2022年サンパウロGPでのラッセル初優勝。そして2024年ベルギーGPでの幻の1-2フィニッシュ（ラッセル重量違反失格）。',
    h2hSummary: '3年間の直接対決で予選成績はラッセルが勝ち越す場面も多く、ハミルトンにフェラーリ移籍を決断させた大きな要因の一つ。',
    quote: '「ジョージは未来のチャンピオンだ。彼と競い合えたことは僕にとっても刺激だった。」— ルイス・ハミルトン',
  },
  {
    id: 'norris-vs-piastri',
    type: 'current',
    name: 'ランド・ノリス vs オスカー・ピアストリ',
    subtitle: 'パパイヤルールに揺れるマクラーレン若き二大天才',
    driver1: {
      name: 'ランド・ノリス',
      code: 'NOR',
      team: 'McLaren',
      titles: 0,
      color: '#FF8000',
    },
    driver2: {
      name: 'オスカー・ピアストリ',
      code: 'PIA',
      team: 'McLaren',
      titles: 0,
      color: '#FF8000',
    },
    nature: '急成長するマクラーレンが生んだナンバーワン不在の緊張感。ピアストリの冷静沈着なアイスマンぶりと、ノリスの情熱の激突。',
    definingMoment:
      '2024年ハンガリーGP：アンダーカットで前に出たノリスに対し、チームが「ポジションをピアストリへ返せ」と無線で懇願し続けたドラマ。',
    h2hSummary: 'ノリスが長年チームを牽引してきた自負に対し、参戦2年目のピアストリが全く物怖じせず勝利を奪い合う次世代最注目ライバル。',
    quote: '「パパイヤルール：お互いに敬意を払い、接触せず、チームのために戦え。」— アンドレア・ステラ代表',
  },
];

// ─────────────────────────────────────────────────────────────
// 4. DRAMATIC MOMENTS (涙と感動の名シーン集)
// ─────────────────────────────────────────────────────────────

export const DRAMATIC_MOMENTS: DramaticMoment[] = [
  {
    id: 'is-that-glock-2008',
    title: '「IS THAT GLOCK?!」 最終コーナーの奇跡と悲劇',
    grandPrix: '2008年 ブラジルGP (インテルラゴス)',
    year: 2008,
    hero: 'ルイス・ハミルトン ＆ フェリペ・マッサ',
    team: 'McLaren / Ferrari',
    badge: 'F1史上最大のサスペンス',
    radioQuote: '🎙️ 実況マーティン・ブランドル: 「Is that Glock?! Is that Glock going slowly?! OH MY GOODNESS ME, HAMILTON\'S BACK IN POSITION!」',
    radioSpeaker: 'Martin Brundle (ITV F1)',
    story:
      '母国ブラジルでポールトゥウィンを飾ったマッサ。フェラーリピットではマッサの父が歓喜の抱擁を交わし、世界王者を確信した。しかしそのわずか数百メートル後方、土砂降りの最終コーナーでドライタイヤのまま走っていたティモ・グロックを、ハミルトンがフィニッシュライン直前でパスして5位へ浮上。わずか1ポイント差でハミルトンが史上最年少戴冠（当時）を果たした。',
    outcome: 'ハミルトンが1ポイント差で王座獲得。マッサは母国の表彰台で胸を叩き、涙を流しながら大観衆に一礼した。',
    aftermath: '敗れながらも気品ある振る舞いを見せたマッサは世界中から賞賛され、F1史上最もドラマチックな結末として語り継がれている。',
    tag: '劇的戴冠',
  },
  {
    id: 'charles-for-antoine-and-papa-2019',
    title: '「シャルル、パパと親友に捧ぐ初優勝」',
    grandPrix: '2019年 ベルギーGP (スパ・フランコルシャン)',
    year: 2019,
    hero: 'シャルル・ルクレール',
    team: 'Scuderia Ferrari',
    badge: '涙の初勝利',
    radioQuote: '🎙️ ルクレール: 「この勝利を喜ぶことはできない。子どもの頃から一緒に走ってきたアントワーヌに捧げる。」',
    radioSpeaker: 'シャルル・ルクレール (Ferrari)',
    story:
      '前日のF2レースで、ルクレールの幼馴染であり無二の親友アントワーヌ・ユベールが事故死。深い悲しみとショックがパドックを覆う中、翌日の決勝でルクレールはハミルトンの猛追をコンマ9秒差で凌ぎ切り、キャリア初優勝を飾った。表彰台でシャンパンファイトは行われず、ルクレールは天を指差して親友と、2年前に他界した父エルヴェに祈りを捧げた。',
    outcome: 'フェラーリにシーズン初勝利をもたらし、翌週のモンツァでも連勝してフェラーリファンの神となった。',
    aftermath: '少年の日の友を胸に、真のエースへと成長を遂げたルクレールの精神的支柱となった伝説の一戦。',
    tag: '哀悼と栄光',
  },
  {
    id: 'gasly-monza-miracle-2020',
    title: '「ガスリー、奈落からの栄光」',
    grandPrix: '2020年 イタリアGP (モンツァ)',
    year: 2020,
    hero: 'ピエール・ガスリー',
    team: 'Scuderia AlphaTauri',
    badge: 'どん底からの下克上',
    radioQuote: '🎙️ ガスリー: 「WHAT DID WE JUST DO?! DID WE WIN THE RACE?! OH MY GOD!」',
    radioSpeaker: 'ピエール・ガスリー (AlphaTauri)',
    story:
      '2019年にレッドブルへ抜擢されるも、わずか12戦で降格される屈辱を味わったガスリー。さらに直後のスパで大親友ユベールを亡くす絶望を経験。しかし2020年モンツァ、赤旗中断の波乱の中トップに立つと、マクラーレンのサインツの猛追を0.4秒差で振り切って奇跡の優勝。表彰台セレモニーの後、誰もいなくなったポディウムに一人座り込み、トロフィーを抱いて静かに涙を流した。',
    outcome: 'フランス人ドライバーとして1996年のパニス以来24年ぶりの勝利。アルファタウリにとっても奇跡の母国優勝。',
    aftermath: '失意のどん底から這い上がったスポーツマンシップの象徴として世界中のファンの心を震わせた。',
    tag: '不屈の贖罪',
  },
  {
    id: 'tsunoda-suzuka-roar-2024',
    title: '「角田裕毅、母国の大歓声と魂のS字オーバーテイク」',
    grandPrix: '2024年 日本GP (鈴鹿サーキット)',
    year: 2024,
    hero: '角田裕毅',
    team: 'RB (Visa Cash App RB)',
    badge: '12年ぶりの母国入賞',
    radioQuote: '🎙️ 角田裕毅: 「みんな、最高のピットストップをありがとう！信じられないよ！」',
    radioSpeaker: '角田裕毅 (RB)',
    story:
      '春開催となった2024年日本GP。超高速S字で他車が抜けないと言われる鈴鹿で、角田はアウトから豪快にマシンをねじ込む圧巻のオーバーテイクを連発。さらにRBピットクルーが驚異のタイヤ交換でライバル2台をピットロードで抜き去る神業を披露。角田は10位でチェッカーを受け、日本人ドライバーとして2012年の小林可夢偉以来12年ぶりとなる母国入賞を果たした。スタンドは総立ちとなり、地鳴りのような「ユウキ！」コールが鈴鹿の森に響き渡った。',
    outcome: '10位入賞で貴重な1ポイントを獲得。チーム全員で抱き合って歓喜した。',
    aftermath: '海外メディアからも「今週末のベストドライバーの一人」と絶賛され、トップチーム昇格への評価を確固たるものにした。',
    tag: '母国の熱狂',
  },
  {
    id: 'zhou-shanghai-tears-2024',
    title: '「周冠宇、20年越しの祖国凱旋と男泣き」',
    grandPrix: '2024年 中国GP (上海インターナショナル)',
    year: 2024,
    hero: '周冠宇',
    team: 'Kick Sauber',
    badge: '歴史的凱旋',
    radioQuote: '🎙️ 周冠宇: 「20年間この日を夢見てきた。中国のファンに心から感謝したい。」',
    radioSpeaker: '周冠宇 (Sauber)',
    story:
      '5年ぶりに復活した中国GP。F1史上初の中国人レギュラードライバーとなった周冠宇にとって、2004年に幼い少年として観客席からアロンソを見ていた上海サーキットへの凱旋だった。決勝完走後、F1公式は特例でホームストレート上に周のための専用停車エリアを用意。マシンを降りた瞬間、10万人を超える大観衆から割れんばかりの歓声が地鳴りのように響き、感情を抑えきれずに両膝をついて涙を流した。',
    outcome: 'ポイント圏外ながら、ホームストレート上で大観衆と感動を分かち合う異例のセレモニー。',
    aftermath: '中国のモータースポーツ史に永遠に刻まれた瞬間であり、世界中のF1ファンに夢の大切さを伝えた。',
    tag: '少年の夢の結実',
  },
];

// ─────────────────────────────────────────────────────────────
// 5. PADDOCK DYNAMICS (相関図・チーム内力学)
// ─────────────────────────────────────────────────────────────

export const PADDOCK_DYNAMICS: PaddockRelationship[] = [
  {
    id: 'redbull-horner-max',
    category: 'principal',
    title: 'レッドブル内部の権力構造とフェルスタッペン家',
    description: 'クリスチャン・ホーナー代表、ヘルムート・マルコ顧問、そしてヨス・フェルスタッペン（マックスの父）の三権分立。2024年開幕時に表面化した内紛劇。',
    members: [
      { name: 'クリスチャン・ホーナー', code: 'HOR', role: 'チーム代表兼CEO' },
      { name: 'ヘルムート・マルコ', code: 'MAR', role: 'モータースポーツ顧問' },
      { name: 'マックス・フェルスタッペン', code: 'VER', role: '4冠のエース' },
    ],
    dynamics: 'フェルスタッペンはマルコ顧問への強い忠誠心を持ち、「マルコが去るなら僕も去る」と発言。チームの屋台骨を揺るがすパワーバランス。',
    badgeColor: '#3671C6',
  },
  {
    id: 'ferrari-vasseur-leclerc',
    category: 'principal',
    title: 'フェラーリの再生：バスール代表と愛弟子ルクレール',
    description: 'ザウバー時代にルクレールをF1デビューさせたフレデリック・バスールがフェラーリ代表に就任。長年の戦略迷走を断ち切り、チームを再び常勝軍団へ。',
    members: [
      { name: 'フレデリック・バスール', code: 'VAS', role: 'チーム代表' },
      { name: 'シャルル・ルクレール', code: 'LEC', role: '生え抜きエース' },
      { name: 'ルイス・ハミルトン', code: 'HAM', role: '2025新加入の7冠王者' },
    ],
    dynamics: 'バスールの冷静沈着なリーダーシップがルクレールに精神的安定をもたらし、2025年にはかつてのマクラーレン時代の教え子ハミルトンを迎える。',
    badgeColor: '#E80020',
  },
  {
    id: 'mclaren-stella-duo',
    category: 'teammate',
    title: 'マクラーレンの調和：ステラ代表と「パパイヤルール」',
    description: '元シューマッハのエンジニアだったアンドレア・ステラ代表が率いるマクラーレン。ノリスとピアストリという二大巨頭を公正に操縦するための哲学。',
    members: [
      { name: 'アンドレア・ステラ', code: 'STE', role: 'チーム代表' },
      { name: 'ランド・ノリス', code: 'NOR', role: '生え抜きの看板ドライバー' },
      { name: 'オスカー・ピアストリ', code: 'PIA', role: '新世代の至宝' },
    ],
    dynamics: '「接触厳禁、チーム最優先」を徹底するが、どちらもチャンピオンを狙える速さを持つがゆえに、毎戦ピットウォールの神経戦が続く。',
    badgeColor: '#FF8000',
  },
  {
    id: 'redbull-junior-academy',
    category: 'academy',
    title: 'レッドブル・ジュニア育成の冷酷なサバイバル',
    description: '世界一過酷と言われる育成プログラム。結果を出せなければシーズン途中でも容赦なく解雇される弱肉強食の世界。',
    members: [
      { name: '角田裕毅', code: 'TSU', role: '4シーズン生き残った日本人エース' },
      { name: 'リアム・ローソン', code: 'LAW', role: 'レッドブル昇格を果たした実力派' },
      { name: 'イサック・ハジャー', code: 'HAD', role: '2025デビューの新星' },
    ],
    dynamics: 'トップチームのシートは常に一つ。仲間でありながら最大の敵としてライバルを蹴落とし合わなければならない極限の環境。',
    badgeColor: '#1E40AF',
  },
];

// ─────────────────────────────────────────────────────────────
// 6. BACKWARD COMPATIBLE EXPORTS
// ─────────────────────────────────────────────────────────────

export const F1_DRAMA_EPISODES: DramaEpisode[] = [
  {
    id: 'hamilton-verstappen-2021',
    category: 'rivalry',
    categoryLabel: '世紀のライバル死闘',
    title: 'ルイス・ハミルトン vs マックス・フェルスタッペン (2021)',
    subtitle: '7冠の絶対王者と新世代の暴風が激突した、22戦に及ぶ歴史上最大の死闘',
    era: '2021年シーズン',
    protagonists: [
      { name: 'ルイス・ハミルトン', code: 'HAM', role: '絶対王者 (メルセデス)', team: 'Mercedes-AMG', color: '#00d2be' },
      { name: 'マックス・フェルスタッペン', code: 'VER', role: '若き挑戦者 (レッドブル)', team: 'Red Bull Racing', color: '#0600ef' },
    ],
    tagline: '「コース上で引いたら負けだ。互いに命を削り合った22戦」',
    overview:
      '2014年以降F1を支配し続けたメルセデスの絶対王者ルイス・ハミルトンに対し、レッドブル・ホンダを駆るマックス・フェルスタッペンが牙を剥いた2021年。開幕戦から最終戦アブダビのファイナルラップまで、完全に同点で並んだ二人の戦いはスポーツの枠を超えたドラマとなった。',
    acts: [
      {
        actNumber: 1,
        actTitle: '序盤の鍔迫り合いと宣戦布告',
        description:
          '開幕戦バーレーンでの激闘から、二人は毎戦ホイール・トゥ・ホイールのバトルを展開。フェルスタッペンが速さで圧倒すれば、ハミルトンは経験とチーム戦略で対抗。',
        pivotalMoment: '第4戦スペインGP：ハミルトンの2ストップ奇襲作戦による逆転勝利。',
      },
      {
        actNumber: 2,
        actTitle: 'シルバーストーン51Gとモンツァの乗り上げ',
        description:
          'イギリスGPのコプス・コーナーで時速290km/hでの接触事故が発生。フェルスタッペンは51Gの衝撃でバリアへ激突し病院へ搬送。さらにイタリアGPの第1シケインで再び接触し、レッドブルのマシンがメルセデスの頭上へ乗り上げる。',
        pivotalMoment: 'シルバーストーンの接触。二人のライバル関係は完全に修復不能な敵対関係へ突入した。',
      },
      {
        actNumber: 3,
        actTitle: 'アブダビ最終戦・奇跡のファイナルラップ',
        description:
          '同点首位で迎えた最終戦アブダビGP。レース大半をリードしたハミルトンの8度目戴冠が確実視された残り5周、クラッシュによるセーフティカーが出動。最終ラップのみのリスタートで、新品ソフトを履いたフェルスタッペンがターン5でハミルトンをオーバーテイク。',
        pivotalMoment: 'アブダビGPファイナルラップのターン5でのイン飛び込み。フェルスタッペンの初タイトルが確定。',
      },
    ],
    iconicQuotes: [
      { speaker: 'ルイス・ハミルトン', quote: '「これは操作されている（This has been manipulated, man）」', context: 'アブダビGP最終ラップ直前、SC解除判断に対するチーム無線' },
      { speaker: 'マックス・フェルスタッペン', quote: '「信じられない！チームのみんな、本当に愛している！」', context: 'チェッカーを受けた直後の絶叫無線' },
    ],
    decisiveGrandPrix: {
      gp: '2021年 アブダビグランプリ (ヤス・マリーナ)',
      year: 2021,
      summary: '全22戦を戦い終えて同ポイントで迎えた最終戦。最終周のリスタートで歴史が動いた。',
      videoOrRadioHighlight: '🎙️ フェルスタッペンの絶叫無線と、コース脇で呆然と立ち尽くすメルセデス陣営',
    },
    aftermath: 'フェルスタッペン時代の幕開けとなり、ハミルトンは長期の沈黙を経て再び王座奪還を誓うこととなる。',
    whyItMatters: '二人の超一流ドライバーが精神的・肉体的に限界を超えてぶつかり合った、F1 75年の歴史上最もドラマチックなシーズン。',
  },
];

export const PADDOCK_CONNECTIONS: RelationshipConnection[] = [
  { source: 'VER', target: 'HAM', relationType: 'rival', label: '宿命のライバル', description: '2021年の死闘を経て互いに敬意を抱きつつも、コース上では一切譲らない究極の対決関係。', color: '#ef4444' },
  { source: 'TSU', target: 'GAS', relationType: 'bro', label: '親友コンビ「カルツノ」', description: 'アルファタウリ時代に築かれた大親友関係。別々のチームになってもオフに一緒に食事へ行くパドック公認のブロマンス。', color: '#38bdf8' },
  { source: 'ALO', target: 'BOR', relationType: 'mentor', label: '師弟関係 (マネージャー)', description: 'アロンソのマネジメント会社（A14）がボルトレートを育成。アロンソが愛弟子のF1昇格を全力で後押しした。', color: '#10b981' },
  { source: 'NOR', target: 'PIA', relationType: 'tense', label: '新世代の社内ライバル', description: 'マクラーレン躍進の立役者コンビ。仲は良好だが、チームオーダーを巡る緊張感が漂うナンバー1争い。', color: '#f59e0b' },
  { source: 'HAM', target: 'ANT', relationType: 'mentor', label: '玉座の継承', description: 'ハミルトンがフェラーリへ移籍したことで空いたメルセデスの席を18歳のアントネッリが継承。ハミルトンも大きなエールを送る。', color: '#8b5cf6' },
  { source: 'OCO', target: 'GAS', relationType: 'tense', label: '幼少期からの愛憎劇', description: 'フランスの同じ地方で育ちカート時代は親友だったが、あるレースの接触を機に絶縁状態へ。', color: '#ec4899' },
];
