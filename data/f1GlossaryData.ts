'use client';

/**
 * data/f1GlossaryData.ts
 * Comprehensive F1 Glossary (F1用語辞典)
 * Designed for beginners to quickly look up terms during race viewing,
 * categorized into Car, Tyre, Strategy, Race, Rule, and Engineering.
 */

export type GlossaryCategory = 'car' | 'tyre' | 'strategy' | 'race' | 'rule' | 'engineering';

export type GlossaryVisualType =
  | 'undercut'
  | 'overcut'
  | 'drs'
  | 'slipstream'
  | 'dirty-air'
  | 'porpoising'
  | 'degradation'
  | 'parc-ferme'
  | 'telemetry'
  | 'apex'
  | 'default';

export interface InAppLink {
  label: string;
  icon: string;
  action: {
    appMode?: 'season' | 'library';
    hub?: 'season' | 'telemetry' | 'news' | 'knowledge' | 'notes';
    subTab?: 'drivers' | 'teams' | 'circuits' | 'tyres' | 'glossary' | 'drama' | 'regulations';
    section?: string;
    circuitId?: string;
  };
}

export interface GlossaryTerm {
  id: string;
  term: string;
  englishTerm: string;
  category: GlossaryCategory;
  categoryLabel: string;
  level: 1 | 2 | 3; // 1: 初級, 2: 中級, 3: 上級
  summary: string; // 30-40 words beginner summary
  description: string;
  realExample: string;
  relatedTerms?: string[];
  visualType?: GlossaryVisualType;
  inAppLinks?: InAppLink[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ── マシン関連 (CAR) ──
  {
    id: 'drs',
    term: 'DRS (ドラッグ・リダクション・システム)',
    englishTerm: 'Drag Reduction System',
    category: 'car',
    categoryLabel: '🏎️ マシン',
    level: 1,
    summary: 'リアウィングを開いて空気抵抗を減らし、最高速を時速15〜20km/hアップさせる追い抜き補助装置。',
    description: 'DRS検知ポイントで前走車と1秒未満の差にいる場合、指定されたDRSゾーン内でステアリングのボタンを押してフラップを開放できます。空気抵抗（ドラッグ）が急減し、ストレートでのオーバーテイクを強力に支援します。',
    realExample: '「フェルスタッペンがDRSゾーンに入りました！リアウィングが開いて一気に真横に並びかける！」',
    relatedTerms: ['オーバーテイク', 'スリップストリーム', 'ダウンフォース'],
    visualType: 'drs',
    inAppLinks: [
      {
        label: 'F1大百科：コース解説で各サーキットのDRSゾーンを見る',
        icon: '🏁',
        action: { appMode: 'library', hub: 'knowledge', subTab: 'circuits' },
      },
      {
        label: 'テレメトリーで最高速とストレートの伸びを比較する',
        icon: '🏎️',
        action: { appMode: 'season', hub: 'telemetry' },
      },
    ],
  },
  {
    id: 'ground-effect',
    term: 'グラウンド・エフェクト',
    englishTerm: 'Ground Effect Aerodynamics',
    category: 'car',
    categoryLabel: '🏎️ マシン',
    level: 2,
    summary: 'マシンのフロア（床下）に気流を通して負圧を作り、車体を地面へ強烈に吸い付ける空力技術。',
    description: '2022年の技術規則改定で40年ぶりに復活した空力コンセプト。床下のベンチュリトンネルを通る空気の流れにより強力なダウンフォースを発生させます。前走車の乱気流（ダーティエア）の影響を受けにくく、接近戦を可能にしました。',
    realExample: '「2022年以降のF1マシンは床下でダウンフォースの約6割を稼いでいます。」',
    relatedTerms: ['ダウンフォース', 'ベンチュリトンネル', 'ポーパシング'],
  },
  {
    id: 'halo',
    term: 'HALO (ヘイロー)',
    englishTerm: 'Halo Cockpit Protection',
    category: 'car',
    categoryLabel: '🏎️ マシン',
    level: 1,
    summary: 'ドライバーの頭部を飛来物や横転事故から守るチタン製の強靭な安全保護ケージ。',
    description: '2018年に導入された安全装備。重量約9kgのチタン合金製で、ロンドンバス2台分（約12トン）の垂直荷重に耐えられます。導入当初は見栄えへの賛否がありましたが、グロージャンの炎上事故やハミルトンの乗り上げ事故などで幾度もドライバーの命を救いました。',
    realExample: '「HALOがなかったらモンツァの事故でハミルトンは無事では済まなかったでしょう。」',
    relatedTerms: ['モノコック', 'コックピット'],
  },
  {
    id: 'slipstream',
    term: 'スリップストリーム (トゥ / 牽引効果)',
    englishTerm: 'Slipstream / Tow',
    category: 'car',
    categoryLabel: '🏎️ マシン',
    level: 1,
    summary: '高速走行する前走車の真後ろにできる低気圧の空気の穴に入り、空気抵抗を減らして急加速する走法。',
    description: '前を走るマシンが空気を切り裂くことで、真後ろに気圧の低い空間（スリップストリーム）が発生します。ここに飛び込むと空気抵抗が激減し、同じエンジン出力でも最高速が時速10〜15km/h伸びてオーバーテイクが容易になります。予選でチームメイト同士が引っ張り合う「トウ」の駆け引きも有名です。',
    realExample: '「モンツァのストレートで完璧なスリップストリームに入った！一気にスリップから抜け出してオーバーテイク！」',
    relatedTerms: ['DRS', 'ダーティエア', 'オーバーテイク'],
    visualType: 'slipstream',
    inAppLinks: [
      {
        label: 'テレメトリーで最高速とストレート加速差を確認する',
        icon: '🏎️',
        action: { appMode: 'season', hub: 'telemetry' },
      },
    ],
  },
  {
    id: 'dirty-air',
    term: 'ダーティエア (乱気流)',
    englishTerm: 'Dirty Air (Turbulence)',
    category: 'car',
    categoryLabel: '🏎️ マシン',
    level: 1,
    summary: '前を走るマシンが後方にまき散らす激しい乱気流。後続車のダウンフォースを最大30%奪い、タイヤを痛める。',
    description: 'F1マシンは強力なダウンフォースを生む代償として、後方に激しくかき乱された空気の渦（ダーティエア）を吐き出します。真後ろを走るマシンはフロントウイングに綺麗な空気が当たらずダウンフォースを喪失。コーナリングで滑るためタイヤが異常加熱し、接近走行が困難になります。',
    realExample: '「無線: ダーティエアが酷くてフロントタイヤの温度が上がりすぎている。少し車間を空ける。」',
    relatedTerms: ['スリップストリーム', 'グラウンド・エフェクト', 'ダウンフォース'],
    visualType: 'dirty-air',
    inAppLinks: [
      {
        label: 'F1大百科：空力レギュレーション（接近戦改善ルール）を読む',
        icon: '📜',
        action: { appMode: 'library', hub: 'knowledge', subTab: 'regulations' },
      },
    ],
  },
  {
    id: 'porpoising',
    term: 'ポーパシング / バウンシング',
    englishTerm: 'Porpoising / Bouncing',
    category: 'car',
    categoryLabel: '🏎️ マシン',
    level: 3,
    summary: '直線走行中にマシンが激しく上下にバウンドを繰り返す、グラウンドエフェクト特有の空力振動現象。',
    description: '高速走行時に床下の負圧で車高が下がりすぎると、フロアと地面の隙間が塞がれて突如気流が剥離（失速）します。ダウンフォースが消えて車高が浮き、再び気流が通って下がる...という上下運動が時速300km/hで連続して発生します。イルカ（Porpoise）の泳ぐ姿に似ていることから命名されました。',
    realExample: '「2022年アゼルバイジャンGPでハミルトンが激しい腰痛を訴えた最大の原因。」',
    relatedTerms: ['グラウンド・エフェクト', 'ダウンフォース'],
    visualType: 'porpoising',
    inAppLinks: [
      {
        label: 'F1大百科：空力レギュレーション解説を読む',
        icon: '📜',
        action: { appMode: 'library', hub: 'knowledge', subTab: 'regulations' },
      },
    ],
  },

  // ── タイヤ関連 (TYRE) ──
  {
    id: 'degradation',
    term: 'デグラデーション (デグラ)',
    englishTerm: 'Tyre Degradation',
    category: 'tyre',
    categoryLabel: '🛞 タイヤ',
    level: 1,
    summary: '周回を重ねるごとにタイヤのゴムが削れ、ラップタイムが徐々に遅くなっていく性能低下現象。',
    description: '単にゴムが薄くなる物理的摩耗だけでなく、連続高負荷による熱ダレ（サーマル・デグラデーション）も含みます。デグラデーションが大きいサーキットでは、ピットストップ回数（2ストップ作戦）が増える傾向にあります。',
    realExample: '「マクラーレンはデグラデーションが極めて小さく、終盤までハイペースを維持しています。」',
    relatedTerms: ['ザ・クリフ', 'グレイニング', 'ブリスタリング'],
    visualType: 'degradation',
    inAppLinks: [
      {
        label: '全ドライバーのタイヤ履歴・スティント推移を見る',
        icon: '📊',
        action: { appMode: 'season', hub: 'telemetry', section: 'stints' },
      },
      {
        label: 'F1大百科：タイヤ解説（熱劣化メカニズム）を開く',
        icon: '🛞',
        action: { appMode: 'library', hub: 'knowledge', subTab: 'tyres' },
      },
    ],
  },
  {
    id: 'the-cliff',
    term: 'ザ・クリフ (タイヤの崖)',
    englishTerm: 'The Tyre Cliff',
    category: 'tyre',
    categoryLabel: '🛞 タイヤ',
    level: 1,
    summary: 'タイヤの摩耗限界を迎え、ある周回で突然グリップが消えて1周あたり2〜3秒急落する限界現象。',
    description: 'トレッドゴムが極端に薄くなると熱を保持できず、急激にオーバーヒートしてゴムが死にます。崖に落ちる前にピットインするのがレース戦略の絶対鉄則です。',
    realExample: '「無線: タイヤが完全にクリフを迎えた！今すぐピットに入れてくれ！」',
    relatedTerms: ['デグラデーション', 'アンダーカット'],
    visualType: 'degradation',
  },
  {
    id: 'graining',
    term: 'グレイニング (ささくれ立ち)',
    englishTerm: 'Graining (Cold Tear)',
    category: 'tyre',
    categoryLabel: '🛞 タイヤ',
    level: 2,
    summary: 'タイヤ表面が冷たい状態で無理にスライドさせた時、表面が削りカスとなってザラザラに荒れる現象。',
    description: 'ゴムの内部骨格が温まる前に激しくプッシュすると、ゴムが路面追従できずにちぎれます。一時的にグリップが落ちますが、数周ステアリング操作を優しくして走るとカスが剥がれ落ちて回復する（クリーンアップ）特徴があります。',
    realExample: '「フロントに軽いグレイニングが出ていますが、数周我慢すればペースは戻る見込みです。」',
    relatedTerms: ['ブリスタリング', 'デグラデーション'],
    visualType: 'degradation',
  },
  {
    id: 'blistering',
    term: 'ブリスター / ブリスタリング',
    englishTerm: 'Blistering',
    category: 'tyre',
    categoryLabel: '🛞 タイヤ',
    level: 2,
    summary: 'タイヤ内部が130℃以上の超高温に達し、ゴムが水ぶくれのように破裂してクレーターができる修復不能なトラブル。',
    description: '猛暑の路面や過度のホイールスピンが原因。ゴム内部の揮発成分が気化して内部から爆発するため、一度発生すると二度と自己修復せず、放置するとバーストにつながるため即時ピット交換が必要です。',
    realExample: '「リアタイヤに巨大なブリスターが発生！緊急ピットインです！」',
    relatedTerms: ['グレイニング', 'バースト'],
    visualType: 'degradation',
  },

  // ── 戦略関連 (STRATEGY) ──
  {
    id: 'undercut',
    term: 'アンダーカット',
    englishTerm: 'The Undercut',
    category: 'strategy',
    categoryLabel: '⛽ 戦略',
    level: 1,
    summary: '前の車より「1周早くピットイン」して新品タイヤを履き、爆発的なアウトラップの速さで相手を逆転する戦術。',
    description: '相手が摩耗した古タイヤで走っている間に、こちらは新品タイヤの圧倒的グリップで全開走行。相手が翌周ピットに入った際、ピット出口で鼻先を押さえて順位を奪い取ります。',
    realExample: '「フェルスタッペンが先にピットイン！アンダーカットを狙って猛烈にプッシュしています！」',
    relatedTerms: ['オーバーカット', 'アウトラップ', 'ピットウィンドウ'],
    visualType: 'undercut',
    inAppLinks: [
      {
        label: 'ピット戦略＆アンダーカットシミュレーターで試す',
        icon: '⛽',
        action: { appMode: 'season', hub: 'telemetry', section: 'pit-sim' },
      },
      {
        label: '全ドライバーのタイヤ履歴・スティント推移を見る',
        icon: '🛞',
        action: { appMode: 'season', hub: 'telemetry', section: 'stints' },
      },
      {
        label: 'F1大百科：タイヤ解説（C1〜C5コンパウンド特性）を開く',
        icon: '📖',
        action: { appMode: 'library', hub: 'knowledge', subTab: 'tyres' },
      },
      {
        label: 'テレメトリー画面でアウトラップのペース差を確認する',
        icon: '🏎️',
        action: { appMode: 'season', hub: 'telemetry' },
      },
    ],
  },
  {
    id: 'overcut',
    term: 'オーバーカット',
    englishTerm: 'The Overcut',
    category: 'strategy',
    categoryLabel: '⛽ 戦略',
    level: 2,
    summary: '相手がピットに入った隙にあえてコース上に残り（ステイアウト）、前が空いた綺麗な空気の中で飛ばして逆転する戦術。',
    description: '新品タイヤが温まるのに時間がかかるサーキットや、タイヤがタレないコース（モナコなど）で有効。相手がアウトラップで冷えたタイヤに苦戦している隙に、クリアエアで全開アタックしてタイム差を築きます。',
    realExample: '「ペレスがモナコでステイアウトを選択。前が空いたモナコでオーバーカットを成功させました！」',
    relatedTerms: ['アンダーカット', 'クリアエア'],
    visualType: 'overcut',
    inAppLinks: [
      {
        label: 'ピット戦略シミュレーターで試す',
        icon: '⛽',
        action: { appMode: 'season', hub: 'telemetry', section: 'pit-sim' },
      },
      {
        label: 'F1大百科：コース解説（モナコ市街地コース）を見る',
        icon: '🏁',
        action: { appMode: 'library', hub: 'knowledge', subTab: 'circuits', circuitId: 'circuit-de-monaco' },
      },
    ],
  },
  {
    id: 'cheap-pit',
    term: 'チープ・ピットストップ (激安ピット)',
    englishTerm: 'Cheap Pit Stop (SC/VSC)',
    category: 'strategy',
    categoryLabel: '⛽ 戦略',
    level: 2,
    summary: 'セーフティカー中にピットに入ると、通常約22秒かかるタイムロスが約半分の約11秒に減る大チャンス現象。',
    description: 'SC中は本コース上の全車が速度制限（約40%ペースダウン）で走っています。しかしピットレーンの制限速度（60/80km/h）は平常時と同じため、ピットインに伴う相対的なタイムロスが大幅に小さくなり、順位を失わずにタイヤ交換できます。',
    realExample: '「セーフティカーが出ました！各車一斉にチープピットストップへ飛び込みます！」',
    relatedTerms: ['セーフティカー', 'VSC'],
  },
  {
    id: 'drs-train',
    term: 'DRS トレイン (DRS列車)',
    englishTerm: 'DRS Train',
    category: 'strategy',
    categoryLabel: '⛽ 戦略',
    level: 2,
    summary: '複数台のマシンが1秒未満の数珠つなぎになり、全員がDRSを使えるため誰も追い抜きができなくなる膠着状態。',
    description: '先頭の遅い車に対し、2番手、3番手、4番手が全員DRSを開けるため、ストレートでの速度差がゼロになります。抜け出せなくなった後続車はタイヤを無駄に消耗し、戦略が大きく狂います。',
    realExample: '「中団グループが5台のDRSトレインを形成しており、誰もオーバーテイクできません！」',
    relatedTerms: ['DRS', 'ダーティエア'],
  },

  // ── レース関連 (RACE) ──
  {
    id: 'pole-position',
    term: 'ポールポジション (PP)',
    englishTerm: 'Pole Position',
    category: 'race',
    categoryLabel: '🏁 レース',
    level: 1,
    summary: '予選で最速タイムを記録したドライバーが獲得する、決勝レース最前列イン側のスターティンググリッド1番手。',
    description: 'モナコやハンガリーなどオーバーテイクが困難なコースでは、ポールポジションを獲得することが勝利の8割を決定づけます。歴史上最多獲得記録はハミルトンの104回以上。',
    realExample: '「ルクレールがモナコで通算24回目のポールポジションを獲得！」',
    relatedTerms: ['フロントロー', '予選Q3'],
  },
  {
    id: 'fastest-lap',
    term: 'ファステストラップ (FL)',
    englishTerm: 'Fastest Lap',
    category: 'race',
    categoryLabel: '🏁 レース',
    level: 1,
    summary: '決勝レース中、全ドライバーの中で最も速い1周タイムを記録すること。',
    description: '10位以内完走者にボーナス1ポイントが付与されていた規定（2024年まで）など、タイトル争いにおいてライバルのボーナスポイントを奪い取るためにレース終盤に新品ソフトへ交換するスプリントが繰り広げられます。',
    realExample: '「残り2周でノリスがピットイン！ファステストラップの1点を奪いに行きます！」',
    relatedTerms: ['ポールポジション', 'ポイントシステム'],
  },
  {
    id: 'sprint',
    term: 'スプリント (Sprint)',
    englishTerm: 'Sprint Race',
    category: 'race',
    categoryLabel: '🏁 レース',
    level: 1,
    summary: '年間6戦のみ開催される、決勝レースの約3分の1の距離（約100km・30分）をタイヤ無交換で全力疾走するミニレース。',
    description: '金曜にスプリント予選、土曜午前にスプリント決勝が行われます。1位（8点）〜8位（1点）までポイントが付与され、本戦とは独立した激しいスプリントバトルが展開されます。',
    realExample: '「明日はスプリントが開催されます。ピット義務がないため最初から最後まで全開のバトルです！」',
    relatedTerms: ['決勝レース', 'ポイントシステム'],
  },

  // ── ルール関連 (RULE) ──
  {
    id: 'parc-ferme',
    term: 'パルクフェルメ (車両保管)',
    englishTerm: 'Parc Fermé',
    category: 'rule',
    categoryLabel: '📏 規則',
    level: 2,
    summary: '予選開始後、決勝レース終了までマシンのパーツ交換やセッティング変更を固く禁じるFIAの厳格な規則。',
    description: 'フランス語で「閉ざされた公園」。予選専用の過激なセッティングでタイムを出し、決勝前にまるごとレース用に戻すような不正を防ぐため、サスペンションや空力ウィングの変更が封印されます。違反するとピットレーンスタートのペナルティが科されます。',
    realExample: '「パルクフェルメ解除後にセットアップを変更したため、ラッセルはピットレーンスタートとなります。」',
    relatedTerms: ['スクルティニアリング', 'ペナルティ'],
    visualType: 'parc-ferme',
    inAppLinks: [
      {
        label: 'F1大百科：FIA公式規定・ペナルティ基準を読む',
        icon: '📜',
        action: { appMode: 'library', hub: 'knowledge', subTab: 'regulations' },
      },
    ],
  },
  {
    id: 'track-limits',
    term: 'トラックリミット (コース境界線)',
    englishTerm: 'Track Limits',
    category: 'rule',
    categoryLabel: '📏 規則',
    level: 1,
    summary: 'コース外側を走ってタイムを稼がないよう、4輪すべてが白線を越えてはみ出すことを禁じる規則。',
    description: '白線から4輪全てが完全にはみ出た瞬間、その周のラップタイムは抹消されます。決勝レース中に4回違反すると「5秒タイムペナルティ」が科されます。オーストリアGPなどでは毎戦多数の違反が発生します。',
    realExample: '「ターン10でトラックリミット違反！ノリスの予選アタックタイムが抹消されました！」',
    relatedTerms: ['ペナルティ', '縁石'],
    inAppLinks: [
      {
        label: 'F1大百科：規定・ペナルティガイドを読む',
        icon: '📜',
        action: { appMode: 'library', hub: 'knowledge', subTab: 'regulations' },
      },
    ],
  },
  {
    id: 'safety-car',
    term: 'セーフティカー (SC) / VSC',
    englishTerm: 'Safety Car / Virtual Safety Car',
    category: 'rule',
    categoryLabel: '📏 規則',
    level: 1,
    summary: 'コース上に破片や事故車両があり危険な際、速度を抑えて安全を確保するための先導車または電子速度制限システム。',
    description: '実車のセーフティカー（AMG GTやアストンマーティン）が入ると全車が隊列を組んで追い越し禁止になります。VSC（バーチャル・セーフティカー）は先導車を出さず、ステアリング上のデルタタイムに従って全車が一律に約40%減速する電子規制です。',
    realExample: '「コース上にデブリが散乱したため、バーチャル・セーフティカーが発動されました。」',
    relatedTerms: ['チープ・ピットストップ', '黄旗'],
    inAppLinks: [
      {
        label: 'ピット戦略シミュレーターでSC時の逆転を試す',
        icon: '⛽',
        action: { appMode: 'season', hub: 'telemetry', section: 'pit-sim' },
      },
    ],
  },
  {
    id: 'blue-flag',
    term: '青旗 (ブルーフラッグ)',
    englishTerm: 'Blue Flag',
    category: 'rule',
    categoryLabel: '📏 規則',
    level: 1,
    summary: '後ろから周回遅れにするトップグループのマシンが迫っている際、進路を速やかに譲ることを命じる旗。',
    description: '青旗を提示されたドライバーは、3つのマーシャルポストを通過するまでに安全にラインを開けて首位集団を先行させなければなりません。無視し続けるとペナルティが科されます。',
    realExample: '「無線: 青旗だ、後ろからフェルスタッペンが来ている。ターン1手前で前に行かせろ。」',
    relatedTerms: ['周回遅れ', '黄旗'],
  },

  // ── エンジニアリング関連 (ENGINEERING) ──
  {
    id: 'power-unit',
    term: 'パワーユニット (PU)',
    englishTerm: 'Power Unit',
    category: 'engineering',
    categoryLabel: '🔧 工学',
    level: 2,
    summary: '1.6L V6ターボエンジンに2種類のハイブリッドモーター（MGU-K / MGU-H）を融合した1,000馬力超の心臓部。',
    description: '単なるエンジンではなく、運動エネルギー回生モーター（MGU-K）と熱エネルギー回生モーター（MGU-H）を組み合わせた世界最高峰の熱効率（50%超）を誇る複合推進機関。',
    realExample: '「2026年からはMGU-Hが廃止され、電気モーター（MGU-K）の出力が約3倍に増強されます。」',
    relatedTerms: ['MGU-K', 'MGU-H', 'ERS'],
  },
  {
    id: 'mgu-k',
    term: 'MGU-K (運動エネルギー回生)',
    englishTerm: 'Motor Generator Unit - Kinetic',
    category: 'engineering',
    categoryLabel: '🔧 工学',
    level: 2,
    summary: 'ブレーキング時の回転エネルギーを電気に変換してバッテリーに貯め、加速時に160馬力の電動ブーストを供給するモーター。',
    description: '減速時は発電機（ジェネレーター）として強力な回生ブレーキをかけ、加速時はモーターとして瞬時にトルクをクランクシャフトへ送り込みます。リカルドが2018年モナコで優勝した際は、このMGU-Kが故障して160馬力を失いながらの奇跡の勝利でした。',
    realExample: '「MGU-Kのアシストにより、ターボラグのない爆発的な立ち上がり加速が実現します。」',
    relatedTerms: ['パワーユニット', 'MGU-H', 'ERS'],
  },
  {
    id: 'telemetry',
    term: 'テレメトリー (遠隔データ解析)',
    englishTerm: 'Telemetry',
    category: 'engineering',
    categoryLabel: '🔧 工学',
    level: 2,
    summary: 'マシンの速度、スロットル開度、ブレーキ圧、エンジン回転数、タイヤ温度などを無線でピットへリアルタイム送信するシステム。',
    description: 'F1マシンには300個以上のセンサーが埋め込まれており、1秒あたり数万件のデータがピットウォールおよび英国・イタリア等の本拠地ファクトリーへ送られます。ドライバーのドライビングスタイルの違いやマシントラブルの予兆が一瞬で判明します。',
    realExample: '「テレメトリーデータを見ると、ハミルトンの方がターン3で10メートル奥までブレーキを我慢しています。」',
    relatedTerms: ['スロットル開度', 'ブレーキ圧', 'タイヤ温度'],
    visualType: 'telemetry',
    inAppLinks: [
      {
        label: 'テレメトリー分析画面を開く',
        icon: '🏎️',
        action: { appMode: 'season', hub: 'telemetry' },
      },
    ],
  },
  {
    id: 'apex',
    term: 'エイペックス (クリッピングポイント)',
    englishTerm: 'Apex / Clipping Point',
    category: 'engineering',
    categoryLabel: '🔧 工学',
    level: 1,
    summary: 'コーナー旋回中、マシンのラインが最もイン側（縁石）に最接近する頂点地点。',
    description: 'エイペックスは幾何学的中心だけでなく、脱出速度を最大化するために意図的に奥に取る「レイト・エイペックス」走法などがあります。エイペックスでの車速（ボトムスピード）とステアリングの舵角がテレメトリー比較の核心となります。',
    realExample: '「ターン4のエイペックスを完璧に捉えた！素早くステアリングを戻してフルスロットルへ移ります！」',
    relatedTerms: ['ボトムスピード', 'トレイルブレーキング', 'テレメトリー'],
    visualType: 'apex',
    inAppLinks: [
      {
        label: 'テレメトリーでエイペックス付近の速度差を確認する',
        icon: '🏎️',
        action: { appMode: 'season', hub: 'telemetry' },
      },
    ],
  },
  {
    id: 'bottom-speed',
    term: 'ボトムスピード (最低コーナリング車速)',
    englishTerm: 'Minimum Cornering Speed',
    category: 'engineering',
    categoryLabel: '🔧 工学',
    level: 2,
    summary: 'コーナー旋回中に最も車速が落ちた瞬間の数値。マシンのメカニカルグリップと回頭性の指標。',
    description: '減速を終えて加速に移る転換点のスピード。ボトムスピードが高すぎるとアンダーステアで立ち上がりが遅れ、低すぎると純粋にタイムを失います。フェルスタッペンやハミルトンはボトムスピードの高さと立ち上がり加速の両立が世界屈指です。',
    realExample: '「テレメトリーを見ると、マクラーレンは中速コーナーのボトムスピードがレッドブルより時速4km高い状態です。」',
    relatedTerms: ['エイペックス', 'トレイルブレーキング', 'テレメトリー'],
    visualType: 'apex',
    inAppLinks: [
      {
        label: 'テレメトリーグラフでボトムスピードの谷を比較する',
        icon: '📈',
        action: { appMode: 'season', hub: 'telemetry' },
      },
    ],
  },
  {
    id: 'trail-braking',
    term: 'トレイルブレーキング (荷重移動走法)',
    englishTerm: 'Trail Braking',
    category: 'engineering',
    categoryLabel: '🔧 工学',
    level: 3,
    summary: '直線で100%フルブレーキングした後、コーナー進入時にステアリングを切りながら徐々にブレーキを緩める高等走法。',
    description: 'ステアリングを切り込む際にあえてフロントタイヤに荷重を残すことで、フロントのグリップを限界まで引き出し回頭性を高めます。テレメトリーのブレーキグラフが綺麗な滑り台のような下降カーブを描くのが特徴です。',
    realExample: '「ノリスはターン1へのトレイルブレーキングが非常に深く、ノーズの入りがシャープです。」',
    relatedTerms: ['ボトムスピード', 'エイペックス', 'テレメトリー'],
    visualType: 'telemetry',
    inAppLinks: [
      {
        label: 'テレメトリーでブレーキ踏み込み＆リリース波形を比較する',
        icon: '📈',
        action: { appMode: 'season', hub: 'telemetry' },
      },
    ],
  },
  {
    id: 'delta-time',
    term: 'デルタタイム (タイム差 / タイム差波形)',
    englishTerm: 'Delta Time (Time Delta)',
    category: 'engineering',
    categoryLabel: '🔧 工学',
    level: 1,
    summary: 'ライバル車や自己ベストラップとの区間ごとの時間差（+0.15秒など）をミリ秒単位で追跡した波形データ。',
    description: 'テレメトリーチャートの最下段に表示される累積時間差。波形が上に向かうと相手がタイムを稼いでおり、下に向かうと自分が引き離していることを示します。どのコーナー進入、旋回、直線で勝敗が分かれたかが一目で分かります。',
    realExample: '「セクター2の出口でデルタがマイナス0.2秒まで縮まりました！激しいタイム削り合いです！」',
    relatedTerms: ['テレメトリー', 'ボトムスピード'],
    visualType: 'telemetry',
    inAppLinks: [
      {
        label: '詳細テレメトリー画面でデルタタイム波形を確認する',
        icon: '📈',
        action: { appMode: 'season', hub: 'telemetry' },
      },
    ],
  },
  {
    id: 'downforce',
    term: 'ダウンフォース (下向きの空気力)',
    englishTerm: 'Aerodynamic Downforce',
    category: 'car',
    categoryLabel: '🏎️ マシン',
    level: 1,
    summary: '車体を地面に強烈に押し付け、時速250km超での驚異的なコーナリンググリップを生み出す空気の力。',
    description: '前後ウイングやフロア（床下）の気流差によって発生。車重を重くすることなくタイヤへの荷重を増やせるため、コーナリング限界が跳ね上がります。時速200km以上ではマシンの重量以上のダウンフォースが発生し、理論上はトンネルの天井を逆さまに走行可能です。',
    realExample: '「ハイダウンフォース仕様のモナコでは、最高速を犠牲にしてでもコーナーのグリップを最優先します。」',
    relatedTerms: ['グラウンド・エフェクト', 'DRS', 'ダーティエア'],
    visualType: 'porpoising',
  },
];
