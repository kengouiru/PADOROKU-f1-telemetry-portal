/**
 * lib/raceDebriefAnalysis.ts
 * 🏁 F1 Pitwall Debrief & Personality Diagnostic Engine
 *
 * Provides:
 * 1. 10 F1 Strategist Archetypes (Ross Brawn, Hannah Schmitz, Kimi, Sainz, Vowles, Bono, etc.)
 * 2. 30+ Iconic F1 Titles & Badges (Masterstrokes, Memes, Classic Despair/Trauma moments)
 * 3. 5-Axis Radar Diagnostic Algorithm (Decision Speed, Risk Appetite, Data Adherence, Driver Empathy, Board Control)
 * 4. FIA Strategist License Grade System (Grade D to Super License Grade S)
 * 5. LocalStorage Career & Badges Persistence
 */

import type {
  SimSnapshot,
  ChallengeScenario,
  PlayerTacticalCommand,
  TacticalScoreBreakdown,
  TyreCompound,
} from '@/lib/raceSimulationEngine';

// ── 1. Strategist Archetype Definitions ───────────────────────────────────────

export interface RadarAxes {
  decisionSpeed: number; // 0-100 (決断速度・直感即答)
  riskAppetite: number;  // 0-100 (リスク選好度・ギャンブル性)
  dataAdherence: number; // 0-100 (データ・計算忠実度)
  driverEmpathy: number; // 0-100 (ドライバー共感・現場優先)
  boardControl: number;  // 0-100 (盤面支配・戦術狡猾さ)
}

export interface StrategistArchetype {
  id: string;
  name: string;
  englishTitle: string;
  icon: string;
  badgeColor: string;
  catchphrase: string;
  historicalContext: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  tacticalAdvice: string;
  benchmarkRadar: RadarAxes;
}

export const STRATEGIST_ARCHETYPES: Record<string, StrategistArchetype> = {
  ross_brawn: {
    id: 'ross_brawn',
    name: '【神算鬼謀】ロス・ブラウン型',
    englishTitle: 'The Mastermind (Ross Brawn Style)',
    icon: '♟️',
    badgeColor: 'from-amber-600 to-red-600',
    catchphrase: '「マイケル、次の19周で25秒マージンを稼いでくれ（ハンガリー1998）」',
    historicalContext: 'ベネトン、フェラーリ黄金期、ブラウンGPを常勝に導いたF1史上最高の戦略頭脳。',
    summary: '緻密な秒数計算と誰も予想しない奇策（3ストップ等）で、コース上でライバルを屠る絶対的データ戦略派。',
    strengths: ['完璧なアンダーカット計算', 'クリーンエア（単独走行窓）の精密な確保', 'データへの冷徹な信頼'],
    weaknesses: ['ドライバーへの過酷なスパート要求', '天候急変などの不条理カオス'],
    tacticalAdvice: '計算は完璧です。あとはドライバーがそのタイムを刻めない時のBプランを常に用意しておきましょう。',
    benchmarkRadar: { decisionSpeed: 75, riskAppetite: 60, dataAdherence: 95, driverEmpathy: 50, boardControl: 95 },
  },
  hannah_schmitz: {
    id: 'hannah_schmitz',
    name: '【絶対冷静の暗殺者】ハンナ・シュミッツ型',
    englishTitle: 'The Silent Assassin (Hannah Schmitz Style)',
    icon: '🎯',
    badgeColor: 'from-blue-600 to-indigo-600',
    catchphrase: '「動かないことが最善の時もある。ただ数字の真実だけを見る（モナコ＆ハンガリー2022）」',
    historicalContext: 'レッドブルの数々の大逆転劇を裏で操る現役最強の女性チーフストラテジスト。',
    summary: '混乱した天候レーダーや他車のピットインに一切惑わされず、最も冷徹かつ致命的な一手で大逆転を演出する勝負師。',
    strengths: ['SC時のチープピット見極め', 'ライバルの心理を突くオーバーカット', '極限状況での平常心'],
    weaknesses: ['保守的なレース展開では真価を発揮しにくい'],
    tacticalAdvice: '波乱時の直感と判断力は世界最高峰です。平常時の小さなアンダーカット差も同様に貪欲に狩りに行きましょう。',
    benchmarkRadar: { decisionSpeed: 90, riskAppetite: 70, dataAdherence: 90, driverEmpathy: 70, boardControl: 90 },
  },
  carlos_sainz: {
    id: 'carlos_sainz',
    name: '【車上チェスマスター】カルロス・サインツ型',
    englishTitle: 'The Smooth Operator (Carlos Sainz Style)',
    icon: '🏎️',
    badgeColor: 'from-emerald-600 to-teal-600',
    catchphrase: '「Stop inventing!（変な作戦を考えるな） / ノリスにDRSを与える（シンガポール2023）」',
    historicalContext: 'コックピットにいながらピットウォール以上の戦況認識を持ち、巧みなゲームメイクで勝利をもぎ取る知性派。',
    summary: 'ピットの指示を鵜呑みにせず、後続に意図的にDRSを与えて盾にするなど、盤面全体をコントロールするIQ200型。',
    strengths: ['敵味方を利用した心理戦・DRSトレイン構築', 'コックピット視点のタイヤ判断', '狡猾な駆け引き'],
    weaknesses: ['ピットとの作戦対立による意思決定の遅延リスク'],
    tacticalAdvice: '盤面の支配力は抜群です。チーム側との意思疎通をさらに円滑にすれば、無駄な摩擦なく完全勝利を掴めます。',
    benchmarkRadar: { decisionSpeed: 80, riskAppetite: 65, dataAdherence: 75, driverEmpathy: 85, boardControl: 95 },
  },
  kimi_raikkonen: {
    id: 'kimi_raikkonen',
    name: '【現場至上主義】キミ・ライコネン型',
    englishTitle: 'Leave Me Alone (Kimi Style)',
    icon: '🧊',
    badgeColor: 'from-cyan-600 to-blue-700',
    catchphrase: '「放っておいてくれ、自分が何をすべきかは分かっている（アブダビ2012）」',
    historicalContext: '2007年ワールド王者。無線での余計なおしゃべりを嫌い、野生のドライビングセンスで最速を刻み続けたアイスマン。',
    summary: 'ピットウォールからの過度な指示を嫌い、ドライバーの直感とタイヤフィーリングを最優先する現場至上主義。',
    strengths: ['ドライバーのストレス最小化', 'シンプルな作戦遂行', '混戦での図太いメンタル'],
    weaknesses: ['最新トラフィックデータの共有不足によるアンダーカット被弾'],
    tacticalAdvice: 'ドライバーを信じる姿勢は素晴らしいですが、見えないトラフィックの合流窓だけはしっかり伝えてあげましょう。',
    benchmarkRadar: { decisionSpeed: 85, riskAppetite: 50, dataAdherence: 45, driverEmpathy: 95, boardControl: 60 },
  },
  james_vowles: {
    id: 'james_vowles',
    name: '【冷酷なる勝利至上主義】ジェームズ・ボウルズ型',
    englishTitle: 'Valtteri, It\'s James (Realpolitik Style)',
    icon: '🛡️',
    badgeColor: 'from-slate-700 to-zinc-900',
    catchphrase: '「バルテリ、ジェームズだ。順位を譲ってくれ（ロシア2018）」',
    historicalContext: 'メルセデス8連覇を支えた戦術責任者。チームの勝利のためには非情なチームオーダーも断行する。現ウィリアムズ代表。',
    summary: 'チーム全体の戴冠のためならドライバー個人の感情や勝利も切り捨てる、冷徹なプラグマティズム（実利主義）。',
    strengths: ['チームメイトを使った完璧な防壁構築', 'リスクヘッジの徹底', '大局観に基づいた配分'],
    weaknesses: ['ドライバーの不満爆発・チーム内亀裂のリスク'],
    tacticalAdvice: 'チームの勝利は盤石です。しかし、犠牲になったドライバーのモチベーションをケアする無線も忘れずに。',
    benchmarkRadar: { decisionSpeed: 85, riskAppetite: 45, dataAdherence: 90, driverEmpathy: 35, boardControl: 95 },
  },
  hamilton_bono: {
    id: 'hamilton_bono',
    name: '【逆境の劇走メンター】ルイス＆ボノ型',
    englishTitle: 'Bono, My Tyres Are Dead (Dramatic Resilience)',
    icon: '📻',
    badgeColor: 'from-purple-600 to-pink-600',
    catchphrase: '「ボノ、タイヤはもう死んだ！ ➔ 次の周でファステストラップ更新」',
    historicalContext: 'ハミルトンとピーター・ボニントン（ボノ）の黄金コンビ。絶望的なタイヤ状況から奇跡の大逆転を何度も生み出した。',
    summary: '無線で不満や不安を吐き出させつつも極限までタイヤを持たせ、最後に怒涛のハイペースで逆襲を仕掛けるドラマ派。',
    strengths: ['限界タイヤでのロングスティント', '終盤の怒涛のチャージ', '強固な信頼関係'],
    weaknesses: ['タイヤクリフの見極めミスによる突然の大失速'],
    tacticalAdvice: 'ドラマティックな粘り勝ちはお見事です！ ただ、タイヤの内部温度が限界を超える前に引き上げる勇気も持ちましょう。',
    benchmarkRadar: { decisionSpeed: 70, riskAppetite: 70, dataAdherence: 70, driverEmpathy: 95, boardControl: 75 },
  },
  eddie_jordan: {
    id: 'eddie_jordan',
    name: '【一か八かのロックスター】エディ・ジョーダン型',
    englishTitle: 'The Maverick Gambler (Eddie Jordan Style)',
    icon: '⚡',
    badgeColor: 'from-yellow-500 to-amber-600',
    catchphrase: '「ロックスターになるか、間抜けになるか。スリックで行け！（スパ1998）」',
    historicalContext: '弱小チームから数々の大波乱・初優勝を演出したF1界の名物オーナー。常に常識外れの賭けに出る。',
    summary: '天候急変や波乱の気配を感じると、誰もが躊躇する極端な逆張り戦略を敢行。当たれば伝説、外れれば大炎上の勝負師。',
    strengths: ['最下位からの奇跡の表彰台奪取', '雨の兆候での超早期ピット', '観客を熱狂させるエンタメ性'],
    weaknesses: ['ギャンブルが外れた際の大惨事・最下位転落'],
    tacticalAdvice: 'あなたの賭けが当たった時の快感は代えがたいものがあります。ただし、守るべき順位がある時は手堅さも覚えましょう！',
    benchmarkRadar: { decisionSpeed: 95, riskAppetite: 98, dataAdherence: 40, driverEmpathy: 75, boardControl: 60 },
  },
  ferrari_checking: {
    id: 'ferrari_checking',
    name: '【愛すべき迷走】スクーデリア・フェラーリ型',
    englishTitle: 'We Are Checking... (Plan E Style)',
    icon: '🤡',
    badgeColor: 'from-red-600 to-rose-700',
    catchphrase: '「プランEだ。……ステイアウト！ ステイアウト！ いやボックス！（モナコ2022）」',
    historicalContext: '数々の名勝負と同時に、ファンを絶句させる伝説の戦略ミスを生み出し続けてきたティフォシの誇り高き迷走。',
    summary: '考えすぎて選択肢（プランA〜F）が増えすぎ、ドライバーに問い返している間にピット入口を通り過ぎてしまう愛すべきスタイル。',
    strengths: ['選択肢の豊富さ（プランFまである）', '世界中のファンを沸かせる（話題性1位）'],
    weaknesses: ['土壇場での決断遅延', 'ピットでのタイヤ取り違え・準備遅れ'],
    tacticalAdvice: 'プランをEまで用意するのは素晴らしい熱意です！ しかし最後は「今すぐBoxだ！」と迷わず叫びましょう。',
    benchmarkRadar: { decisionSpeed: 30, riskAppetite: 50, dataAdherence: 60, driverEmpathy: 60, boardControl: 40 },
  },
  flavio_briatore: {
    id: 'flavio_briatore',
    name: '【カオス・サーファー】フラビオ・ブリアトーレ型',
    englishTitle: 'The Chaos Operator (Flavio Style)',
    icon: '🕶️',
    badgeColor: 'from-cyan-700 to-slate-900',
    catchphrase: '「混乱こそ最大のチャンスだ。誰も見ていない隙を突け（シンガポール2008）」',
    historicalContext: 'シューマッハやアロンソを見出し、ベネトンとルノーで王座を獲得した異端の策士。ルールと混沌の境界線で戦う。',
    summary: 'セーフティカーや他車のクラッシュ、イエローフラッグを最大限に利用し、どん底から一気に表彰台へ強襲する策士。',
    strengths: ['他車のトラブルを好機に変える嗅覚', '大胆なピットタイミングのずらし'],
    weaknesses: ['荒れない平穏なレースではジリ貧になりがち'],
    tacticalAdvice: '混乱を味方につけるセンスは天下一品です。乱戦が起きない手堅いレースでもペースを保てる基本戦術を磨きましょう。',
    benchmarkRadar: { decisionSpeed: 85, riskAppetite: 85, dataAdherence: 65, driverEmpathy: 50, boardControl: 85 },
  },
  toto_wolff: {
    id: 'toto_wolff',
    name: '【盤石の鉄壁防衛】トト・ウォルフ型',
    englishTitle: 'The Iron Fortress (Toto Wolff Style)',
    icon: '🏢',
    badgeColor: 'from-emerald-700 to-slate-900',
    catchphrase: '「トラックポジションこそすべてだ。隙を見せるな」',
    historicalContext: 'メルセデスを前人未到のダブルタイトル8連覇に導いた絶対的リーダー。ミスを徹底的に排除する完璧主義。',
    summary: 'コース上の順位（トラックポジション）を何よりも重視し、アンダーカットを絶対に許さない堅牢な守備型ストラテジスト。',
    strengths: ['首位独走時の完璧なリードコントロール', 'ピット作業ミスの徹底排除', '高い勝率の維持'],
    weaknesses: ['追う展開での奇襲アイデアの欠如'],
    tacticalAdvice: '盤石の守備力は王者の風格です。時には2位以下からの大逆転を狙うアグレッシブな博打も試してみましょう。',
    benchmarkRadar: { decisionSpeed: 80, riskAppetite: 40, dataAdherence: 95, driverEmpathy: 65, boardControl: 90 },
  },
};

// ── 2. Iconic F1 Titles & Badges Catalog (30+ Badges) ────────────────────────

export type BadgeCategory = 'masterstroke' | 'quote_meme' | 'despair_trauma';

export interface F1Badge {
  id: string;
  name: string;
  englishTitle: string;
  category: BadgeCategory;
  categoryLabel: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  rarityColor: string;
  historicalQuote: string;
  unlockConditionText: string;
  lore: string;
}

export const F1_BADGES_CATALOG: F1Badge[] = [
  // ── A. 神采配・歴史的マスターピース (Masterstrokes) ──
  {
    id: 'three_stop_miracle',
    name: '🌟 3ストップの奇蹟',
    englishTitle: 'The 3-Stop Miracle',
    category: 'masterstroke',
    categoryLabel: '🏆 神采配',
    icon: '🌟',
    rarity: 'LEGENDARY',
    rarityColor: 'text-amber-300 border-amber-500/60 bg-amber-950/40',
    historicalQuote: '「マイケル、次の19周で25秒マージンを稼いでくれ（ハンガリー1998）」',
    unlockConditionText: 'ピット回数をライバルより多く（2回以上）敢行し、それでもP1勝利を達成する。',
    lore: '1998年ハンガロリンクでロス・ブラウンとシューマッハがマクラーレンを破った伝説の奇策。',
  },
  {
    id: 'smooth_operator',
    name: '🏎️ スムーズ・オペレーター',
    englishTitle: 'The Smooth Operator',
    category: 'masterstroke',
    categoryLabel: '🏆 神采配',
    icon: '🏎️',
    rarity: 'EPIC',
    rarityColor: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/40',
    historicalQuote: '「ノリスにDRSを与える。それが最善の防御策だ（シンガポール2023）」',
    unlockConditionText: '後続ライバルとのタイム差を1秒以内（DRS圏内）に制御しながらトップチェッカーを受ける。',
    lore: '2023年シンガポールGPでサインツがメルセデスの猛追を封じるために使ったIQ200の神ディフェンス。',
  },
  {
    id: 'montreal_miracle',
    name: '🌧️ モントリオールの奇蹟',
    englishTitle: 'The Montreal Miracle',
    category: 'masterstroke',
    categoryLabel: '🏆 神采配',
    icon: '🌧️',
    rarity: 'LEGENDARY',
    rarityColor: 'text-amber-300 border-amber-500/60 bg-amber-950/40',
    historicalQuote: '「6回のピットイン、ペナルティ、最後尾転落からの最終周大逆転（カナダ2011）」',
    unlockConditionText: 'レース途中でP8以下まで落ちながら、雨天または波乱を突いて表彰台（P3以上）を獲得する。',
    lore: '2011年カナダGPでジェンソン・バトンが豪雨と4時間超の死闘の末に最後尾から優勝したF1史上最大の逆転劇。',
  },
  {
    id: 'undercut_maestro',
    name: '🎯 アンダーカットの魔術師',
    englishTitle: 'Undercut Maestro',
    category: 'masterstroke',
    categoryLabel: '🏆 神采配',
    icon: '🎯',
    rarity: 'RARE',
    rarityColor: 'text-sky-300 border-sky-500/60 bg-sky-950/40',
    historicalQuote: '「新品タイヤのアウトラップでライバルの前を奪い取る」',
    unlockConditionText: 'ライバルより早くピットインし、アウトラップで前を奪ってオーバーテイクを成立させる。',
    lore: '現代F1における王道にして究極の戦術。1周のピットタイミングがレースの運命を決定づける。',
  },
  {
    id: 'simply_lovely',
    name: '💎 Simply Lovely',
    englishTitle: 'Simply Lovely',
    category: 'masterstroke',
    categoryLabel: '🏆 神采配',
    icon: '💎',
    rarity: 'LEGENDARY',
    rarityColor: 'text-amber-300 border-amber-500/60 bg-amber-950/40',
    historicalQuote: '「Simply lovely race, guys. What a drive.（マックス・フェルスタッペン）」',
    unlockConditionText: '一度も首位を譲らず、戦術評価92点以上（Rank S/S+）でパーフェクトウィンを達成する。',
    lore: 'フェルスタッペンが完全無欠のレースを達成した時に無線で放つ定番の決め台詞。',
  },
  {
    id: 'lightning_pit',
    name: '⏱️ 神速の2.0秒ピット',
    englishTitle: 'Sub-2.0s Lightning Pit',
    category: 'masterstroke',
    categoryLabel: '🏆 神采配',
    icon: '⏱️',
    rarity: 'RARE',
    rarityColor: 'text-sky-300 border-sky-500/60 bg-sky-950/40',
    historicalQuote: '「まばたきする間に4本のタイヤが交換された」',
    unlockConditionText: 'ピット静止時間2.3秒以下の完璧なストップを成功させ、トラフィックの直前でコース復帰する。',
    lore: 'レッドブルが保持する世界記録1.82秒に迫る、クルーとストラテジストの完全無欠の連携。',
  },
  {
    id: 'pierre_monza',
    name: '🍾 Pierre, YOU WON A GP!',
    englishTitle: 'Miracle at Monza',
    category: 'masterstroke',
    categoryLabel: '🏆 神采配',
    icon: '🍾',
    rarity: 'EPIC',
    rarityColor: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/40',
    historicalQuote: '「ピエール、お前がグランプリで勝ったんだ！（モンツァ2020）」',
    unlockConditionText: '中団・下位チーム（RB/ハース/ザウバー等）を担当し、赤旗やSCの混乱を味方につけてP1勝利を掴む。',
    lore: '2020年イタリアGPでピエール・ガスリーがアルファタウリに歴史的勝利をもたらした感動の奇跡。',
  },

  // ── B. 名言・無線・ドラマティック称号 (Iconic Memes & Dramas) ──
  {
    id: 'leave_me_alone',
    name: '📻 Leave me alone!',
    englishTitle: 'Leave Me Alone, I Know What I\'m Doing',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '📻',
    rarity: 'RARE',
    rarityColor: 'text-purple-300 border-purple-500/60 bg-purple-950/40',
    historicalQuote: '「放っておいてくれ、自分が何をすべきかは分かっている（キミ・ライコネン）」',
    unlockConditionText: '緊急無線に対してドライバーを信頼する選択肢を選び、目標順位を達成する。',
    lore: '2012年アブダビGPでピットからの過剰なタイヤ指示にキミが放ったF1史上最も有名な無線。',
  },
  {
    id: 'stop_inventing',
    name: '🛑 Stop Inventing!',
    englishTitle: 'Stop Inventing!',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '🛑',
    rarity: 'RARE',
    rarityColor: 'text-purple-300 border-purple-500/60 bg-purple-950/40',
    historicalQuote: '「Stop inventing! 変な小細工を考えるな！（カルロス・サインツ）」',
    unlockConditionText: 'チームからの変則指示を拒否・変更して自身のプランを貫き、勝利を掴む。',
    lore: '2022年シルバーストンでフェラーリピットからの難解な指示を一蹴し、自身初優勝を掴んだサインツの叫び。',
  },
  {
    id: 'multi_21',
    name: '🏎️ Multi 21, Seb',
    englishTitle: 'Multi 21 Controversy',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '🏎️',
    rarity: 'EPIC',
    rarityColor: 'text-purple-300 border-purple-500/60 bg-purple-950/40',
    historicalQuote: '「Multi 21だ、セブ。Multi 21……（マーク・ウェバー）」',
    unlockConditionText: 'チームオーダー「順位入替（Swap）」を発動し、チームメイトを抜いて上位でフィニッシュする。',
    lore: '2013年マレーシアGPでベッテルがチームオーダーを破ってウェバーを抜き、表彰台裏が凍りついた事件。',
  },
  {
    id: 'valtteri_james',
    name: '📻 Valtteri, it\'s James',
    englishTitle: 'Valtteri, It\'s James',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '📻',
    rarity: 'RARE',
    rarityColor: 'text-purple-300 border-purple-500/60 bg-purple-950/40',
    historicalQuote: '「バルテリ、ジェームズだ。順位を入れ替えてくれ（ロシア2018）」',
    unlockConditionText: 'チームオーダー「後続ブロック（Defend）」を発動し、相方にライバルを抑え込ませてメインカーが勝利する。',
    lore: 'ボッタスに勝利を諦めさせハミルトンに優勝を譲らせた、非情なる勝利への方程式。',
  },
  {
    id: 'bono_my_tyres',
    name: '🛞 Bono, my tyres are dead',
    englishTitle: 'Bono, My Tyres Are Gone!',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '🛞',
    rarity: 'RARE',
    rarityColor: 'text-purple-300 border-purple-500/60 bg-purple-950/40',
    historicalQuote: '「ボノ、タイヤはもう終わりだ！ ➔ 次の周でファステスト更新（ハミルトン）」',
    unlockConditionText: 'タイヤ摩耗度75%以上の限界状態でピットインせずステイアウトし、そのまま目標順位で逃げ切る。',
    lore: 'ハミルトンが「タイヤが終わった」と言った直後に驚異的なファステストラップを連発するF1界のお約束。',
  },
  {
    id: 'fernando_faster',
    name: '📻 Fernando is faster than you',
    englishTitle: 'Fernando Is Faster Than You',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '📻',
    rarity: 'RARE',
    rarityColor: 'text-purple-300 border-purple-500/60 bg-purple-950/40',
    historicalQuote: '「フェルナンドの方が速い。理解できたか確認してくれ（ドイツ2010）」',
    unlockConditionText: '後続のチームメイトが接近した際にチームオーダーを発動し、ポジションをスムーズに譲らせる。',
    lore: 'チームオーダーが禁止されていた時代、フェラーリがマッサに放った伝説の暗号指示。',
  },
  {
    id: 'el_plan',
    name: '⚡ El Plan (壮大なる計画)',
    englishTitle: 'El Plan',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '⚡',
    rarity: 'RARE',
    rarityColor: 'text-purple-300 border-purple-500/60 bg-purple-950/40',
    historicalQuote: '「信じろ。これがアロンソの『El Plan』だ」',
    unlockConditionText: 'ハードタイヤスタートを選択し、忍耐強いロングスティントで目標順位を達成する。',
    lore: 'フェルナンド・アロンソがアルピーヌ復帰時に掲げ、ファンを熱狂させた謎の合言葉。',
  },
  {
    id: 'papaya_rules',
    name: '🏎️ Papaya Rules',
    englishTitle: 'Papaya Rules',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '🏎️',
    rarity: 'RARE',
    rarityColor: 'text-orange-300 border-orange-500/60 bg-orange-950/40',
    historicalQuote: '「パパイヤ・ルールだ。クリーンに競い合え（マクラーレン2024）」',
    unlockConditionText: 'チームオーダー「自由競争（None）」を維持したまま、2台揃ってトップ4以内フィニッシュを果たす。',
    lore: '2024年にマクラーレンのノリスとピアストリに課された、同士討ち厳禁のクリーンバトル規定。',
  },

  // ── C. 絶望・トラウマ・迷場面の称号 (Classic F1 Fails & Trauma) ──
  {
    id: 'we_are_checking',
    name: '🤡 We Are Checking...',
    englishTitle: 'We Are Checking...',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '🤡',
    rarity: 'COMMON',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「ボックスすべきか？ ➔ We are checking...（確認中だ）」',
    unlockConditionText: '戦術評価65点以下、または目標順位を逃し、ピットタイミングの決断が遅れてしまう。',
    lore: 'フェラーリのピットウォールが窮地に陥ると必ず発動する、F1界で最も愛され恐れられる迷文句。',
  },
  {
    id: 'stay_out_shout',
    name: '🤦 Stay out, STAY OUT!!',
    englishTitle: 'Stay Out, STAY OUT!!',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '🤦',
    rarity: 'RARE',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「ボックス！ ボックス！ ……ステイアウト！ STAY OUT!! ➔ NOOOO!!（モナコ2022）」',
    unlockConditionText: 'ダブルスタック危機（同時ピットイン危険）を検知した状態で、ピット判断を迷い目標を逃す。',
    lore: '2022年モナコGPで首位ルクレールをピットに呼び込み、直前に叫んでダブルスタック大破局を招いた悲劇。',
  },
  {
    id: 'where_are_tyres',
    name: '🛞 タイヤがない!?',
    englishTitle: 'Where Are The Tyres?!',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '🛞',
    rarity: 'EPIC',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「何も言うな。何を言ってもこの結果は変わらない（ダニエル・リカルド モナコ2016）」',
    unlockConditionText: 'ピットストップで静止時間が想定より大幅に遅延し（ピット作業ロス）、順位を落とす。',
    lore: '2016年モナコでリカルドがピットに入った瞬間、クルーがタイヤを出しておらず優勝を奪われた悪夢。',
  },
  {
    id: 'sakhir_tyre_mix',
    name: '🔀 サクヒールの悪夢 (タイヤ取り違え)',
    englishTitle: 'The Sakhir Double-Stack Horror',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '🔀',
    rarity: 'EPIC',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「チームメイトのタイヤを履かされてしまった！（ラッセル サクヒール2020）」',
    unlockConditionText: 'ダブルスタック発生時に両車ともに大きなタイムロスを被り、順位を落としてしまう。',
    lore: '2020年サクヒールGPでラッセルがハミルトン代役で圧勝目前だった中、メルセデスが引き起こした歴史的混乱。',
  },
  {
    id: 'sochi_tears',
    name: '🌧️ ソチの涙 (No, it\'s not wet!)',
    englishTitle: 'Sochi Tears (Lando\'s Heartbreak)',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '🌧️',
    rarity: 'RARE',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「インターに替えるか？ ➔ NO!!（ランド・ノリス ソチ2021）」',
    unlockConditionText: '雨天時にインターミディエイトへ乗り換えずスリックのまま走り続け、タイムを大暴落させる。',
    lore: '2021年ロシアGPで初優勝目前のノリスが雨天ピットを拒否し、スリックでコース外へ滑り落ちた痛恨の記憶。',
  },
  {
    id: 'three_wheel_finish',
    name: '🛞 3輪チェッカー',
    englishTitle: '3-Wheeled Across the Line',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '🛞',
    rarity: 'EPIC',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「フロント左タイヤが完全にバーストしたまま火花を散らして逃げ切り（シルバーストン2020）」',
    unlockConditionText: '最終周でタイヤ摩耗度が88%を超え、タイヤがクリフ落ちしながら辛うじて完走する。',
    lore: '2020年イギリスGPで最終ラップにタイヤが破裂しながら、火花を散らしてトップチェッカーを受けたハミルトン。',
  },
  {
    id: 'is_that_glock',
    name: '💔 Is that Glock?!',
    englishTitle: 'Is That Glock?!',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '💔',
    rarity: 'RARE',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「Is that Glock?! Is that Glock going slowly?!（ブラジル2008）」',
    unlockConditionText: '最終順位が目標順位の1つ下（あと1台抜けていれば達成だった）で惜敗する。',
    lore: '2008年ブラジルGP最終周の最終コーナーでハミルトンがグロックを抜き、マッサの戴冠が30秒で消え去った悲劇。',
  },
  {
    id: 'silver_war_crash',
    name: '💥 銀河系クラッシュ',
    englishTitle: 'Silver War Disaster',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '💥',
    rarity: 'EPIC',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「1周目のターン4でチームメイト同士が接触ダブルリタイア（スペイン2016）」',
    unlockConditionText: 'チームメイトとのギャップが極めて接近した状態で、同士討ち危機のアラートを発生させる。',
    lore: '2016年スペインGPでロズベルグとハミルトンがスタート直後に接触し、トト・ウォルフが激怒した事件。',
  },
  {
    id: 'brake_magic_on',
    name: '🔌 Brake Magic On',
    englishTitle: 'Brake Magic On',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '🔌',
    rarity: 'RARE',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「ブレーキマジックを切り忘れて1コーナーを直進（バクー2021）」',
    unlockConditionText: 'SCリスタート直後の周回でPUまたはERS操作を誤り、ポジションを落とす。',
    lore: '2021年アゼルバイジャンGPでハミルトンがボタンを誤操作し、リスタートで白煙を上げてエスケープに直進した瞬間。',
  },
  {
    id: 'gp2_engine',
    name: '🏎️ GP2 Engine! GP2!',
    englishTitle: 'GP2 Engine!',
    category: 'despair_trauma',
    categoryLabel: '💀 絶望トラウマ',
    icon: '🏎️',
    rarity: 'RARE',
    rarityColor: 'text-rose-300 border-rose-500/60 bg-rose-950/40',
    historicalQuote: '「GP2エンジンだ！ GP2！ ああぁぁぁ！（アロンソ 鈴鹿2015）」',
    unlockConditionText: 'PUコンサーブ（節約モード）を続けすぎて、ライバルに連続オーバーテイクを許す。',
    lore: '2015年鈴鹿でホンダの地元ファンを前にアロンソが叫び、パドックを震撼させた魂の絶叫。',
  },
  {
    id: 'no_drincc',
    name: '🍼 No Kimi, you will not have the drink',
    englishTitle: 'No Drink For You',
    category: 'quote_meme',
    categoryLabel: '📻 名言・無線',
    icon: '🍼',
    rarity: 'COMMON',
    rarityColor: 'text-cyan-300 border-cyan-500/60 bg-cyan-950/40',
    historicalQuote: '「ドリンクは繋がっているか？ ➔ 否、キミ。飲めない（ハンガリー2018）」',
    unlockConditionText: 'タイヤ表面温度128℃以上の過熱状態のまま、ピットインせずスティントを走り切る。',
    lore: '真夏の猛暑ハンガロリンクで水分補給ボトルを接続し忘れられ、喉の渇きと戦ったライコネンの伝説。',
  },
];

// ── 3. FIA Strategist License Grade System ───────────────────────────────────

export interface StrategistLicense {
  grade: 'D' | 'C' | 'B' | 'A' | 'S';
  title: string;
  badge: string;
  minCp: number;
  description: string;
}

export const FIA_LICENSES: StrategistLicense[] = [
  {
    grade: 'S',
    title: 'FIA 殿堂入りマスターマインド (Hall of Fame)',
    badge: '👑 SUPER LICENSE S',
    minCp: 2500,
    description: '世界最高峰のグランプリマスター。あらゆるカオスとデータを完璧に支配する生ける伝説。',
  },
  {
    grade: 'A',
    title: 'チーフ・ストラテジー・ディレクター (Chief Director)',
    badge: '⭐ GRADE A',
    minCp: 1500,
    description: 'トップチームの全権司令塔。極限のアンダーカットと天候変化を神速で操る。',
  },
  {
    grade: 'B',
    title: 'トラックサイド・シニアストラテジスト (Senior Strategist)',
    badge: '🎖️ GRADE B',
    minCp: 800,
    description: 'セーフティカーや複合気象のピット損得計算を的確にこなすベテラン司令官。',
  },
  {
    grade: 'C',
    title: 'レースオペレーション・エンジニア (Race Engineer)',
    badge: '🔧 GRADE C',
    minCp: 300,
    description: '基礎的なピット窓口管理とタイヤ二層熱力学を習得した実力派エンジニア。',
  },
  {
    grade: 'D',
    title: 'ピットウォール・インターン (Pitwall Intern)',
    badge: '📋 GRADE D',
    minCp: 0,
    description: '司令塔の第一歩。テレメトリーデータと無線を監視するルーキーアナリスト。',
  },
];

export function getLicenseFromCp(totalCp: number): StrategistLicense {
  for (const lic of FIA_LICENSES) {
    if (totalCp >= lic.minCp) return lic;
  }
  return FIA_LICENSES[FIA_LICENSES.length - 1];
}

// ── 4. Diagnostic & Scoring Engine ───────────────────────────────────────────

export interface DiagnosticResult {
  archetype: StrategistArchetype;
  radar: RadarAxes;
  unlockedBadgesThisRace: F1Badge[];
  allUnlockedBadgeIds: string[];
  totalCpEarnedThisRace: number;
  totalCareerCp: number;
  license: StrategistLicense;
  analysisCommentary: string;
}

export function diagnoseStrategistProfile(
  snapshots: SimSnapshot[],
  scenario: ChallengeScenario,
  playerOverrides: Record<number, Partial<PlayerTacticalCommand>>,
  radioChoices: Record<string, string>,
  tacticalScore: TacticalScoreBreakdown,
  existingUnlockedBadgeIds: string[] = []
): DiagnosticResult {
  const lastSnap = snapshots[snapshots.length - 1];
  const playerCar = lastSnap?.cars.find((c) => c.code === scenario.playerConfig.code);
  const finalPos = playerCar ? playerCar.position : 5;
  const isP1 = finalPos === 1;
  const reachedTarget = playerCar ? playerCar.position <= scenario.targetPosition : false;

  // ── Calculate 5 Radar Axes ──
  const radioCount = Object.keys(radioChoices).length;
  let decisionSpeed = 70;
  if (radioCount > 0) decisionSpeed += 15;
  if (Object.keys(playerOverrides).length > 2) decisionSpeed += 10;
  decisionSpeed = Math.min(98, Math.max(30, decisionSpeed));

  let riskAppetite = 50;
  const hadRain = snapshots.some((s) => s.rainRadar.waterDepthMm > 1.0);
  const pittedForInter = snapshots.some((s) => {
    const car = s.cars.find((c) => c.code === scenario.playerConfig.code);
    return car?.tyreCompound === 'INTER' || car?.tyreCompound === 'WET';
  });
  if (hadRain && !pittedForInter) riskAppetite += 35;
  const usedPush = Object.values(playerOverrides).filter((o) => o.puMode === 'push').length;
  riskAppetite += usedPush * 5;
  riskAppetite = Math.min(99, Math.max(25, riskAppetite));

  let dataAdherence = Math.round(
    ((tacticalScore.pitTimingScore + tacticalScore.tyreEnergyScore) / 50) * 100
  );
  dataAdherence = Math.min(99, Math.max(30, dataAdherence));

  let driverEmpathy = 65;
  const usedConserve = Object.values(playerOverrides).filter((o) => o.puMode === 'conserve').length;
  driverEmpathy += usedConserve * 8;
  if (playerCar && playerCar.driverConfidence > 80) driverEmpathy += 15;
  driverEmpathy = Math.min(98, Math.max(30, driverEmpathy));

  let boardControl = Math.round(
    ((tacticalScore.trafficScore + tacticalScore.chaosTeamScore) / 50) * 80 +
      (reachedTarget ? 20 : 0)
  );
  boardControl = Math.min(99, Math.max(25, boardControl));

  const radar: RadarAxes = {
    decisionSpeed,
    riskAppetite,
    dataAdherence,
    driverEmpathy,
    boardControl,
  };

  // ── Match Best Archetype ──
  let bestArchetypeId = 'ross_brawn';
  let minDistance = 999999;

  for (const [key, archetype] of Object.entries(STRATEGIST_ARCHETYPES)) {
    const target = archetype.benchmarkRadar;
    const dist =
      Math.pow(radar.decisionSpeed - target.decisionSpeed, 2) * 1.2 +
      Math.pow(radar.riskAppetite - target.riskAppetite, 2) * 1.5 +
      Math.pow(radar.dataAdherence - target.dataAdherence, 2) * 1.3 +
      Math.pow(radar.driverEmpathy - target.driverEmpathy, 2) * 1.0 +
      Math.pow(radar.boardControl - target.boardControl, 2) * 1.2;

    if (key === 'ferrari_checking' && tacticalScore.totalScore < 60 && decisionSpeed < 55) {
      bestArchetypeId = 'ferrari_checking';
      break;
    }
    if (key === 'eddie_jordan' && riskAppetite > 85) {
      bestArchetypeId = 'eddie_jordan';
      break;
    }

    if (dist < minDistance) {
      minDistance = dist;
      bestArchetypeId = key;
    }
  }

  const archetype = STRATEGIST_ARCHETYPES[bestArchetypeId] || STRATEGIST_ARCHETYPES.ross_brawn;

  // ── Unlock Badges Detection ──
  const unlockedThisRace: F1Badge[] = [];
  const currentBadgeIdSet = new Set<string>(existingUnlockedBadgeIds);

  const checkAndAward = (badgeId: string) => {
    const b = F1_BADGES_CATALOG.find((item) => item.id === badgeId);
    if (b) {
      unlockedThisRace.push(b);
      currentBadgeIdSet.add(b.id);
    }
  };

  if (playerCar && playerCar.pitCount >= 2 && isP1) {
    checkAndAward('three_stop_miracle');
  }
  if (isP1 && playerCar && playerCar.gapToAhead < 1.0) {
    checkAndAward('smooth_operator');
  }
  const droppedLow = snapshots.some((s) => {
    const c = s.cars.find((car) => car.code === scenario.playerConfig.code);
    return c && c.position >= 8;
  });
  if (droppedLow && finalPos <= 3 && hadRain) {
    checkAndAward('montreal_miracle');
  }
  const hasUndercutDecision = tacticalScore.keyDecisions.some(
    (d) => d.linkedKeywords.includes('undercut') && d.verdict === 'optimal'
  );
  if (hasUndercutDecision) {
    checkAndAward('undercut_maestro');
  }
  if (isP1 && tacticalScore.totalScore >= 92) {
    checkAndAward('simply_lovely');
  }
  const hadFastPit = snapshots.some((s) => {
    const c = s.cars.find((car) => car.code === scenario.playerConfig.code);
    return c && c.isPitting && (c.pitStopDuration || 2.4) <= 2.3;
  });
  if (hadFastPit) {
    checkAndAward('lightning_pit');
  }
  if (isP1 && (scenario.playerConfig.team.includes('RB') || scenario.playerConfig.team.includes('Williams') || scenario.playerConfig.team.includes('Haas'))) {
    checkAndAward('pierre_monza');
  }
  const trustedRadio = Object.values(radioChoices).some((val) => val.includes('driver') || val.includes('stay') || val.includes('trust'));
  if (trustedRadio && reachedTarget) {
    checkAndAward('leave_me_alone');
  }
  const rejectedTeamOrder = Object.values(radioChoices).some((val) => val.includes('reject') || val.includes('own_plan'));
  if (rejectedTeamOrder || (isP1 && Object.keys(playerOverrides).length > 3)) {
    checkAndAward('stop_inventing');
  }
  const swappedAggressive = Object.values(playerOverrides).some((o) => o.teamOrder === 'swap');
  if (swappedAggressive && finalPos < (scenario.teammateConfig ? 4 : 5)) {
    checkAndAward('multi_21');
  }
  const usedDefend = Object.values(playerOverrides).some((o) => o.teamOrder === 'defend');
  if (usedDefend && reachedTarget) {
    checkAndAward('valtteri_james');
  }
  const highTyreWear = snapshots.some((s) => {
    const c = s.cars.find((car) => car.code === scenario.playerConfig.code);
    return c && c.tyreWearPercent >= 75;
  });
  if (highTyreWear && reachedTarget) {
    checkAndAward('bono_my_tyres');
  }
  if (scenario.playerConfig.startTyre === 'HARD' && reachedTarget) {
    checkAndAward('el_plan');
  }
  const teammateCar = lastSnap?.cars.find((c) => c.code === scenario.teammateConfig?.code);
  if (finalPos <= 4 && teammateCar && teammateCar.position <= 4) {
    checkAndAward('papaya_rules');
  }
  if (tacticalScore.totalScore <= 65 && !reachedTarget) {
    checkAndAward('we_are_checking');
  }
  const hadDoubleStackRisk = snapshots.some((s) => s.teammateStatus?.doubleStackRisk);
  if (hadDoubleStackRisk && !reachedTarget) {
    checkAndAward('stay_out_shout');
  }
  if (hadRain && !pittedForInter && !reachedTarget) {
    checkAndAward('sochi_tears');
  }
  const extremeTyreWear = playerCar && playerCar.tyreWearPercent >= 88;
  if (extremeTyreWear) {
    checkAndAward('three_wheel_finish');
  }
  if (finalPos === scenario.targetPosition + 1) {
    checkAndAward('is_that_glock');
  }
  const ranHot = snapshots.some((s) => {
    const c = s.cars.find((car) => car.code === scenario.playerConfig.code);
    return c && c.tyreSurfaceTemp >= 128;
  });
  if (ranHot && playerCar && playerCar.pitCount === 0) {
    checkAndAward('no_drincc');
  }

  // ── Calculate Command Points (CP) ──
  const baseCp = Math.round(tacticalScore.totalScore * 2);
  const winBonus = isP1 ? 150 : reachedTarget ? 80 : 20;
  const newBadgeBonus = unlockedThisRace.length * 50;
  const cpEarned = baseCp + winBonus + newBadgeBonus;

  const savedCareer = loadStrategistCareer();
  const newTotalCp = savedCareer.totalCp + cpEarned;
  const newLicense = getLicenseFromCp(newTotalCp);

  const analysisCommentary = `${archetype.name}と判定されました。決断速度 ${radar.decisionSpeed}点、リスク選好度 ${radar.riskAppetite}点、データ忠実度 ${radar.dataAdherence}点、ドライバー共感度 ${radar.driverEmpathy}点、盤面支配力 ${radar.boardControl}点。${archetype.summary}`;

  return {
    archetype,
    radar,
    unlockedBadgesThisRace: unlockedThisRace,
    allUnlockedBadgeIds: Array.from(currentBadgeIdSet),
    totalCpEarnedThisRace: cpEarned,
    totalCareerCp: newTotalCp,
    license: newLicense,
    analysisCommentary,
  };
}

// ── 5. LocalStorage Career Persistence ────────────────────────────────────────

const CAREER_STORAGE_KEY = 'f1_padoroku_pitwall_career_v1';

export interface SavedCareerData {
  totalCp: number;
  grade: 'D' | 'C' | 'B' | 'A' | 'S';
  unlockedBadgeIds: string[];
  totalRacesCompleted: number;
  totalWins: number;
  highestScore: number;
  lastArchetypeId?: string;
}

export function loadStrategistCareer(): SavedCareerData {
  if (typeof window === 'undefined') {
    return {
      totalCp: 0,
      grade: 'D',
      unlockedBadgeIds: [],
      totalRacesCompleted: 0,
      totalWins: 0,
      highestScore: 0,
    };
  }

  try {
    const raw = localStorage.getItem(CAREER_STORAGE_KEY);
    if (!raw) {
      return {
        totalCp: 0,
        grade: 'D',
        unlockedBadgeIds: [],
        totalRacesCompleted: 0,
        totalWins: 0,
        highestScore: 0,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      totalCp: 0,
      grade: 'D',
      unlockedBadgeIds: [],
      totalRacesCompleted: 0,
      totalWins: 0,
      highestScore: 0,
    };
  }
}

export function saveStrategistCareer(
  cpEarned: number,
  newBadgeIds: string[],
  score: number,
  isWin: boolean,
  archetypeId: string
): SavedCareerData {
  const current = loadStrategistCareer();
  const updatedBadgeIds = Array.from(new Set([...current.unlockedBadgeIds, ...newBadgeIds]));
  const updatedCp = current.totalCp + cpEarned;
  const license = getLicenseFromCp(updatedCp);

  const updated: SavedCareerData = {
    totalCp: updatedCp,
    grade: license.grade,
    unlockedBadgeIds: updatedBadgeIds,
    totalRacesCompleted: current.totalRacesCompleted + 1,
    totalWins: current.totalWins + (isWin ? 1 : 0),
    highestScore: Math.max(current.highestScore, score),
    lastArchetypeId: archetypeId,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save pitwall career to localStorage', e);
    }
  }

  return updated;
}
