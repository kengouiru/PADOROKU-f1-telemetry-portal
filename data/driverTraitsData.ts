/**
 * data/driverTraitsData.ts
 * 🏎️ F1 Driver Special Traits & Paddock Perks Master Database
 *
 * Implements:
 * - 3-Tier F1 Telemetry Styling:
 *   🥇 APEX_GOLD: Iconic legendary individual signatures
 *   💠 TITANIUM_TACTICAL: Pro racecraft & technical virtues
 *   🚨 HAZARD_VOLATILITY: High-friction emotional quirks & operational vulnerabilities
 * - Multi-axis Categorization:
 *   'STRATEGIC_IQ' | 'PIT_CREW_TEAMWORK' | 'ENVIRONMENTAL' | 'SITUATIONAL' | 'MECHANICAL' | 'PSYCHOLOGICAL'
 * - Direct Historical Linking to Encyclopedia (Driver milestones, iconic races & quotes)
 * - Quantitative Engine Physics Multipliers & Radio Dispatch Metadata
 */

export type TraitTier = 'APEX_GOLD' | 'TITANIUM_TACTICAL' | 'HAZARD_VOLATILITY';

export type TraitCategory =
  | 'STRATEGIC_IQ'
  | 'PIT_CREW_TEAMWORK'
  | 'ENVIRONMENTAL'
  | 'SITUATIONAL'
  | 'MECHANICAL'
  | 'PSYCHOLOGICAL';

export type DriverTraitId =
  // 🥇 APEX GOLD
  | 'SUZUKA_SPIRIT'          // 角田裕毅: 鈴鹿の魂
  | 'MAD_MAX_HUNT'           // フェルスタッペン: 狂気の狩人
  | 'HAMMER_TIME'            // ハミルトン: ハンマータイム
  | 'SMOOTH_OPERATOR'        // サインツ: スムース・オペレーター (戦略提言チェスマスター)
  | 'MINISTER_OF_DEFENCE'    // アロンソ / ペレス: 鉄壁防衛
  | 'ICE_COLD_HEART'         // ピアストリ: アイスマン・Jr
  | 'SATURDAY_MAGICIAN'      // ルクレール: 予選の魔術師
  | 'FINAL_LAP_HERO'         // ノリス: ラストラップ・チャージ
  | 'TYRE_WHISPERER'         // ペレス / 角田: タイヤの囁き (1ストップの達人)

  // 💠 TITANIUM TACTICAL
  | 'RAIN_DEITY'             // 雨神◎ (フェルスタッペン、ハミルトン、ストロール)
  | 'SUB_2S_PIT_CREW'        // 電光石火のピットクルー (レッドブル、マクラーレン)
  | 'BOX_MARKSMAN'           // 寸分違わぬ停止精度 (ピットボックス停止精度◎)
  | 'CLUTCH_COMEBACK'        // 逆境〇 (P12以下からの猛追)
  | 'LAUNCH_MASTER'          // ロケットスタート〇 (オープニングラップの蹴り出し)
  | 'STREET_FIGHTER'         // 市街地マスター〇 (モナコ、バクー、シンガポール)
  | 'TEAMMATE_RIVALRY'       // チームメイト闘志〇 (同僚が前にいる時の急接近)
  | 'LATE_BRAKER'            // 奥深きレイトブレーキング〇 (コーナー進入飛び込み)
  | 'CLEAN_AIR_DEMON'        // 独走〇 (P1単独走行時のパーフェクトラップ)

  // 🚨 HAZARD VOLATILITY
  | 'RADIO_HEAT'             // 激情の無線× (トラブル時に感情昂り、一時的に過熱)
  | 'COLD_TYRE_STUMBLE'      // コールドタイヤ× (SC明け1周目のタイヤ発熱遅れ)
  | 'MONACO_JINX';           // モナコの呪い× (モナコGPでの戦略不運・接触リスク)

export type TraitTriggerType = 'GUARANTEED' | 'PROBABILISTIC';

export interface DriverTraitDefinition {
  id: DriverTraitId;
  triggerType: TraitTriggerType;
  baseActivationChance: number; // 1.0 for GUARANTEED, 0.4 - 0.85 for PROBABILISTIC
  name: string;
  badgeLabel: string;
  tier: TraitTier;
  category: TraitCategory;
  icon: string; // Emoji / Icon indicator
  shortDescription: string;
  tacticalEffectDescription: string;
  originHistory: string; // 百科の史実・名勝負エピソード連動
  quote?: string;
  // Physics multipliers applied in raceSimulationEngine
  modifiers: {
    lapPaceDeltaSec?: number; // e.g. -0.22s
    tyreWearMultiplier?: number; // e.g. 0.78 (-22% wear)
    waterPenaltyReduction?: number; // e.g. 0.45 (-45% water loss)
    pitCrewTimeDeltaSec?: number; // e.g. -0.35s faster pit stop
    pitErrorResistance?: number; // e.g. 0.85 (85% reduction in pit hang/delay)
    overtakeSuccessBonus?: number; // e.g. +30% overtake chance
    defenseStrengthBonus?: number; // e.g. +50% defense resistance
    incidentRiskModifier?: number; // e.g. 0.1 (nearly zero mistakes)
  };
  triggerConditionText: string;
}

// ── Master Trait Definitions Database ────────────────────────────────────────

export const MASTER_TRAITS: Record<DriverTraitId, DriverTraitDefinition> = {
  // ── 🥇 APEX GOLD ─────────────────────────────────────────────────────────────
  SUZUKA_SPIRIT: {
    id: 'SUZUKA_SPIRIT',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: '鈴鹿の魂 (Suzuka Spirit)',
    badgeLabel: '鈴鹿の魂',
    tier: 'APEX_GOLD',
    category: 'ENVIRONMENTAL',
    icon: '🇯🇵',
    shortDescription: '母国・鈴鹿サーキットで熱狂的大歓声を背に受けて全能力が限界突破。',
    tacticalEffectDescription: '鈴鹿サーキット走行時にラップタイム -0.25秒、S字区間の追従ミス0%、オーバーテイク成功率+35%。',
    originHistory: '2024年日本GP（鈴鹿）において、母国ファンの大歓声とチームの迅速なピットワークに応え、S字での圧巻のマシンコントロールでライバル3台をごぼう抜きして堂々の入賞（P10）を果たした走りに由来。',
    quote: '「鈴鹿でファンの皆さんの前でポイントを獲れた瞬間は、一生忘れられない宝物です。」',
    modifiers: {
      lapPaceDeltaSec: -0.25,
      overtakeSuccessBonus: 0.35,
      incidentRiskModifier: 0.3,
    },
    triggerConditionText: '鈴鹿サーキット（日本GP）を走行中',
  },

  MAD_MAX_HUNT: {
    id: 'MAD_MAX_HUNT',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.75,
    name: '狂気の狩人 (Mad Max Predator)',
    badgeLabel: '狩人の咆哮',
    tier: 'APEX_GOLD',
    category: 'SITUATIONAL',
    icon: '🦁',
    shortDescription: '前方に獲物を捉えた瞬間、一切の躊躇なく毎周ファステストラップ級で追い詰める。',
    tacticalEffectDescription: '前方2.0秒以内にターゲットがいる場合、ラップタイム -0.28秒、ダーティエアによる発熱を無効化、追越成功率+45%。',
    originHistory: 'どんな劣勢でも前走車が見えた瞬間に牙を剥く闘争本能。2021年のタイトル争いや数々の怒涛の追い上げで見せた、相手に息をつかせない猛獣のようなドライビングスタイルに由来。',
    quote: '「I am not here to finish fourth.（4位で満足するために走っているんじゃない）」',
    modifiers: {
      lapPaceDeltaSec: -0.28,
      overtakeSuccessBonus: 0.45,
    },
    triggerConditionText: '前走車とのギャップが 2.0秒 以内に接近した時',
  },

  HAMMER_TIME: {
    id: 'HAMMER_TIME',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.7,
    name: 'ハンマータイム (Hammer Time)',
    badgeLabel: 'HAMMER TIME',
    tier: 'APEX_GOLD',
    category: 'STRATEGIC_IQ',
    icon: '🔨',
    shortDescription: '勝負のピットイン前後、「タイヤが終わった」の無線直後に異次元のスパートを刻む。',
    tacticalEffectDescription: 'BOX指示の直前1周およびピットアウト後の1周、使い古したタイヤでもグリップ低下を無視してラップタイム -0.45秒。',
    originHistory: '名レースエンジニア「ボノ（Peter Bonnington）」からの伝説の無線コード『It\'s Hammer Time, Lewis!』に呼応し、数々のアンダーカット・オーバーカット逆転勝利を量産した黄金期に由来。',
    quote: '「Bono, my tyres are dead... からのファステストラップ連発。」',
    modifiers: {
      lapPaceDeltaSec: -0.45,
    },
    triggerConditionText: 'ピットイン予定ラップの直前周、またはピットアウト直後のアウトラップ',
  },

  SMOOTH_OPERATOR: {
    id: 'SMOOTH_OPERATOR',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.8,
    name: 'スムース・オペレーター (Smooth Operator)',
    badgeLabel: '戦略チェスマスター',
    tier: 'APEX_GOLD',
    category: 'STRATEGIC_IQ',
    icon: '♟️',
    shortDescription: 'コックピットからレース全体を俯瞰し、ピットウォールを超える勝負戦略を無線で提言。',
    tacticalEffectDescription: 'セーフティカー導入時や雨天クロスオーバー時に、AI戦略BOXとは異なる「高勝率オルタナティブ戦略」を無線提案。ピット判断ミス確率 -80%。',
    originHistory: '2023年シンガポールGPでノリスに意図的にDRSを与えてメルセデス勢の猛攻を封じ込めた「DRSトレイン防衛術」や、数々の自作戦提案で勝利を掴み取った知性派走りに由来。',
    quote: '「Stop inventing!（余計な小細工はよせ、僕の戦略で行く！）」',
    modifiers: {
      lapPaceDeltaSec: -0.15,
      defenseStrengthBonus: 0.5,
    },
    triggerConditionText: '雨天クロスオーバー発生時、またはSC/VSC導入時のピット判断局面',
  },

  MINISTER_OF_DEFENCE: {
    id: 'MINISTER_OF_DEFENCE',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: '将軍の鉄壁 (Minister of Defence)',
    badgeLabel: '鉄壁の防衛',
    tier: 'APEX_GOLD',
    category: 'SITUATIONAL',
    icon: '🛡️',
    shortDescription: '後続にDRSを使われても、ミリ単位のライン取りで絶対に前を譲らない不落の要塞。',
    tacticalEffectDescription: '後続車が0.8秒以内のDRS圏内にいる時、自車のタイヤを痛めず後続車の追越難易度を+65%上昇。',
    originHistory: '2005年イモラでのアロンソ vs シューマッハの伝説の防衛戦、2021年ハンガリーでのアロンソによるハミルトン相手の10周ブロック、2021年アブダビでのペレスによる「チェコ防衛大臣」の走りに由来。',
    quote: '「Checo is a legend.（フェルスタッペンの無線称賛）」',
    modifiers: {
      defenseStrengthBonus: 0.65,
      tyreWearMultiplier: 0.85,
    },
    triggerConditionText: '後続車が 0.8秒 以内（DRS圏内）に迫られた時',
  },

  ICE_COLD_HEART: {
    id: 'ICE_COLD_HEART',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: 'アイスマン・Jr (Ice Cold Heart)',
    badgeLabel: '氷の平常心',
    tier: 'APEX_GOLD',
    category: 'PSYCHOLOGICAL',
    icon: '🧊',
    shortDescription: '極限のテール・トゥ・ノーズや雨天でも心拍数が一切上がらない脅威のメンタル。',
    tacticalEffectDescription: 'SCリスタート時、接近戦バトル時、タイヤ摩耗末期でもミス発生率が完全に0%。タイヤ表面温度の急上昇を完全防止。',
    originHistory: '2024年アゼルバイジャンGP（バクー）でルクレールに奇襲のレイトブレーキングを仕掛けて首位を奪い、その後30周にわたる猛攻を一切の乱れなく完封した鉄の心臓に由来。',
    quote: '「リスクを取らなければ、一生誰かの後ろを走ることになっていた。」',
    modifiers: {
      incidentRiskModifier: 0.05,
      tyreWearMultiplier: 0.88,
    },
    triggerConditionText: 'リスタート時、または後続・前走車と 1.0秒 未満の接近戦時',
  },

  SATURDAY_MAGICIAN: {
    id: 'SATURDAY_MAGICIAN',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.85,
    name: '予選の魔術師 (Saturday Magician)',
    badgeLabel: '一発の魔術師',
    tier: 'APEX_GOLD',
    category: 'MECHANICAL',
    icon: '⚡',
    shortDescription: 'マシンの限界を超えてミリ単位で壁際を攻め、驚異の一発アタックタイムを叩き出す。',
    tacticalEffectDescription: 'ニュータイヤ装着時の最初の2周、およびクリーンエア走行時にラップタイム -0.32秒。',
    originHistory: 'モナコやバクーなどで見せる、マシンのポテンシャルを明らかに上回る圧倒的なポールポジション獲得率と神がかり的アタックラップに由来。',
    quote: '「I gave everything, absolutely on the limit.」',
    modifiers: {
      lapPaceDeltaSec: -0.32,
    },
    triggerConditionText: '新品スリックタイヤ装着後 1〜2周目、かつ前方に車がいない時',
  },

  FINAL_LAP_HERO: {
    id: 'FINAL_LAP_HERO',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.75,
    name: 'ラストラップ・チャージ (Final Lap Hero)',
    badgeLabel: '最終周の鬼',
    tier: 'APEX_GOLD',
    category: 'SITUATIONAL',
    icon: '🔥',
    shortDescription: 'チェッカーフラッグが近づくにつれてペースが覚醒し、劇的なドラマを演出する。',
    tacticalEffectDescription: 'レース残り3周から全開プッシュ。ラップタイム -0.30秒、ERS消費効率+25%、ファステストラップ確率特大UP。',
    originHistory: '2020年オーストリアGPの最終ラップでファステストラップを叩き出し、劇的な初表彰台（P3）をもぎ取った「Scenario 7」の走りに由来。',
    quote: '「Scenario 7, press the overtake button!」',
    modifiers: {
      lapPaceDeltaSec: -0.3,
      overtakeSuccessBonus: 0.35,
    },
    triggerConditionText: 'レース残り周回数が 3周 以下になった時',
  },

  TYRE_WHISPERER: {
    id: 'TYRE_WHISPERER',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: 'タイヤの囁き (Tyre Whisperer)',
    badgeLabel: 'タイヤ職人',
    tier: 'APEX_GOLD',
    category: 'MECHANICAL',
    icon: '🛞',
    shortDescription: 'タイヤと対話するように熱と摩耗を抑え、不可能とされた1ストップ作戦を実現。',
    tacticalEffectDescription: 'クリーンエア単独走行時にタイヤ摩耗率 -28%、表面温度が適正ウィンドウ（90〜105℃）に自動収束。',
    originHistory: 'ペレスの「タイヤ・ウィスパラー」としての伝説や、角田の長距離スティント管理能力、ハミルトンのロングラン技術に由来。',
    quote: '「タイヤの声を聴き、ゴムの粒子をアスファルトに優しく馴染ませる。」',
    modifiers: {
      tyreWearMultiplier: 0.72,
    },
    triggerConditionText: '前車と 1.8秒 以上離れたクリーンエアを走行中',
  },

  // ── 💠 TITANIUM TACTICAL ──────────────────────────────────────────────────
  RAIN_DEITY: {
    id: 'RAIN_DEITY',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: '雨神◎ (Rain Deity)',
    badgeLabel: '雨神◎',
    tier: 'TITANIUM_TACTICAL',
    category: 'ENVIRONMENTAL',
    icon: '🌧️',
    shortDescription: '雨が降るほど他車をごぼう抜きにし、水深によるタイムロスを大幅に打ち消す。',
    tacticalEffectDescription: '水深1.2mm以上のウェットコンディションで水深ペナルティ -45%、ハイドロプレーニング確率 1/4。',
    originHistory: 'フェルスタッペンの2016年ブラジルGP神走、ハミルトンの2008年シルバーストン歴史的圧勝、アイルトン・セナのドニントン1993に代表される雨の達人たちに由来。',
    modifiers: {
      waterPenaltyReduction: 0.45,
      incidentRiskModifier: 0.25,
    },
    triggerConditionText: 'サーキットの水深が 1.2mm 以上の時',
  },

  SUB_2S_PIT_CREW: {
    id: 'SUB_2S_PIT_CREW',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: '電光石火のピットクルー (Sub-2.0s Pit Crew)',
    badgeLabel: '最速ピットクルー',
    tier: 'TITANIUM_TACTICAL',
    category: 'PIT_CREW_TEAMWORK',
    icon: '⏱️',
    shortDescription: 'チームメカニックの超人的連携により、ピット静止作業時間を限界まで削る。',
    tacticalEffectDescription: '通常ピットストップ作業時間を一律 -0.35秒 短縮。アンダーカット成功率が飛躍的に向上。',
    originHistory: 'マクラーレンが2023年カタールGPで樹立した世界最速記録「1.80秒」や、レッドブルが連発する2秒切りの世界最高峰クルーワークに由来。',
    modifiers: {
      pitCrewTimeDeltaSec: -0.35,
      pitErrorResistance: 0.85,
    },
    triggerConditionText: 'ピットイン時の静止タイヤ交換作業時',
  },

  BOX_MARKSMAN: {
    id: 'BOX_MARKSMAN',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: '寸分違わぬ停止精度 (Precision Box Marksman)',
    badgeLabel: '停止精度◎',
    tier: 'TITANIUM_TACTICAL',
    category: 'PIT_CREW_TEAMWORK',
    icon: '🎯',
    shortDescription: 'ピットボックスの停止マークへ1ミリの狂いもなく正確にマシンをピタ止めする。',
    tacticalEffectDescription: 'メカニックの車体位置修正ロスを完全排除し作業時間 -0.2秒、ホイールナット詰まり等のピットミス率 -90%。',
    originHistory: 'ジャッキマンが1歩も動くことなく瞬時に車体をリフトできる、トップドライバーの神技的ピットエントリー精度に由来。',
    modifiers: {
      pitCrewTimeDeltaSec: -0.2,
      pitErrorResistance: 0.9,
    },
    triggerConditionText: 'ピットレーン進入からボックス停止時',
  },

  CLUTCH_COMEBACK: {
    id: 'CLUTCH_COMEBACK',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.7,
    name: '逆境の鬼神〇 (Clutch Comeback)',
    badgeLabel: '逆境〇',
    tier: 'TITANIUM_TACTICAL',
    category: 'SITUATIONAL',
    icon: '⚔️',
    shortDescription: '予選不調やピットミスで後方に沈んだ際、怒涛の追い上げモードへと移行する。',
    tacticalEffectDescription: '現在順位が P12 以下の場合、前走車を追うペースが -0.22秒 短縮、追越成功率+30%。',
    originHistory: 'ペレスの2020年サヒールGP（最後尾P18からの劇的初優勝）や、アロンソ・フェルスタッペンのグリッド降格からの猛烈な表彰台追い上げに由来。',
    modifiers: {
      lapPaceDeltaSec: -0.22,
      overtakeSuccessBonus: 0.3,
    },
    triggerConditionText: '走行順位が P12 以下に落ちた時',
  },

  LAUNCH_MASTER: {
    id: 'LAUNCH_MASTER',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.75,
    name: 'ロケットスタート〇 (Launch Master)',
    badgeLabel: 'スタート巧者',
    tier: 'TITANIUM_TACTICAL',
    category: 'MECHANICAL',
    icon: '🚀',
    shortDescription: 'ブラックアウト瞬間のクラッチミートと蹴り出しが神がかり的で、1周目に順位を奪取。',
    tacticalEffectDescription: 'Lap 1のオープニングラップにおけるスタート加速ロスを -0.6秒 軽減、ポジションアップ確率特大UP。',
    originHistory: 'アロンソやノリス、ハミルトンが見せる、シグナル消灯直後の稲妻のような蹴り出しとターン1でのポジション獲りに由来。',
    modifiers: {
      lapPaceDeltaSec: -0.6,
      overtakeSuccessBonus: 0.4,
    },
    triggerConditionText: '決勝スタートの Lap 1（オープニングラップ）',
  },

  STREET_FIGHTER: {
    id: 'STREET_FIGHTER',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: '市街地マスター〇 (Street Fighter)',
    badgeLabel: '市街地巧者',
    tier: 'TITANIUM_TACTICAL',
    category: 'ENVIRONMENTAL',
    icon: '🏙️',
    shortDescription: 'コンクリートウォールが迫るストリートコースで壁スレスレの度胸試しを制する。',
    tacticalEffectDescription: 'モナコ、バクー、シンガポール、ジェッダ、ラスベガス等の市街地でラップタイム -0.20秒。',
    originHistory: 'ペレスのストリート勝利連発や、ピアストリ・ルクレールのアゼルバイジャンでの極限の壁際バトルに由来。',
    modifiers: {
      lapPaceDeltaSec: -0.2,
    },
    triggerConditionText: '市街地サーキット（モナコ、バクー、シンガポール等）を走行中',
  },

  TEAMMATE_RIVALRY: {
    id: 'TEAMMATE_RIVALRY',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.8,
    name: 'チームメイト闘志〇 (Teammate Rivalry)',
    badgeLabel: '同僚対抗心',
    tier: 'TITANIUM_TACTICAL',
    category: 'PSYCHOLOGICAL',
    icon: '📻',
    shortDescription: '同一マシンのチームメイトが前方にいる時、最大のライバル意識が点火してペースが激変。',
    tacticalEffectDescription: 'チームメイトが前方 2.0秒 以内にいる時、ERSデプロイ効率+15%、スリップストリーム効果1.25倍。',
    originHistory: '角田 vs ローソン/リカルド、ハミルトン vs ロズベルグ、ノリス vs ピアストリなど「最初の標的は同じ車に乗るチームメイト」というF1の掟に由来。',
    modifiers: {
      lapPaceDeltaSec: -0.18,
      overtakeSuccessBonus: 0.25,
    },
    triggerConditionText: '同一チームのチームメイトが前方 2.0秒 以内にいる時',
  },

  LATE_BRAKER: {
    id: 'LATE_BRAKER',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.65,
    name: '奥深きレイトブレーキング〇 (Late Braker)',
    badgeLabel: '飛び込み巧者',
    tier: 'TITANIUM_TACTICAL',
    category: 'MECHANICAL',
    icon: '🎯',
    shortDescription: '制動限界ギリギリまで踏み遅らせ、イン側にマシンを滑り込ませる飛び込み技術。',
    tacticalEffectDescription: 'コーナー進入でのオーバーテイク成功率+35%、ロックアップ確率 -40%。',
    originHistory: '角田裕毅の天性の深い進入ブレーキや、ダニエル・リカルドの「ハングリー・ハングリー・ヒッポ」飛び込みに由来。',
    modifiers: {
      overtakeSuccessBonus: 0.35,
    },
    triggerConditionText: '前車をオーバーテイクしようとするブレーキングゾーン',
  },

  CLEAN_AIR_DEMON: {
    id: 'CLEAN_AIR_DEMON',
    triggerType: 'GUARANTEED',
    baseActivationChance: 1,
    name: '独走〇 (Clean Air Demon)',
    badgeLabel: '独走〇',
    tier: 'TITANIUM_TACTICAL',
    category: 'SITUATIONAL',
    icon: '👑',
    shortDescription: '首位に立ち前方に障害がない時、乱れのない完璧なメトロノームラップを刻み続ける。',
    tacticalEffectDescription: 'P1を走行し後続と 2.0秒 以上離れている場合、ミス発生率0%、タイヤ摩耗 -15%。',
    originHistory: 'セバスチャン・ベッテルやフェルスタッペンが見せた、1度リードを奪えば誰も手が届かない独走劇に由来。',
    modifiers: {
      tyreWearMultiplier: 0.85,
      incidentRiskModifier: 0.05,
    },
    triggerConditionText: 'P1（首位）走行中で、2位と 2.0秒 以上のギャップがある時',
  },

  // ── 🚨 HAZARD VOLATILITY ──────────────────────────────────────────────────
  RADIO_HEAT: {
    id: 'RADIO_HEAT',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.45,
    name: '激情の無線× (Radio Volatility)',
    badgeLabel: '無線過熱×',
    tier: 'HAZARD_VOLATILITY',
    category: 'PSYCHOLOGICAL',
    icon: '🤬',
    shortDescription: '不本意なピットや妨害に直面すると無線で感情が昂り、一時的にタイヤを痛めやすい。',
    tacticalEffectDescription: '予期せぬトラフィックやピットロス直後の1周、タイヤ表面温度が+4℃上昇し、トラックリミット警告リスク微増。',
    originHistory: '初期の角田裕毅のパッショネイトな無線怒号や、ベッテルの審判批判無線など、勝利への純粋すぎる熱情に由来。',
    modifiers: {
      incidentRiskModifier: 1.4,
    },
    triggerConditionText: 'ピット作業の遅れ、または前車に詰まった直後',
  },

  COLD_TYRE_STUMBLE: {
    id: 'COLD_TYRE_STUMBLE',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.6,
    name: 'コールドタイヤ× (Cold Tyre Stumble)',
    badgeLabel: '冷えタイヤ×',
    tier: 'HAZARD_VOLATILITY',
    category: 'MECHANICAL',
    icon: '❄️',
    shortDescription: 'SC明けやピットアウト直後、タイヤが温まるまで1周だけグリップ不足に苦しむ。',
    tacticalEffectDescription: 'ピットアウト後またはSCリスタート後の最初の1周、ラップタイム +0.35秒 ロス、被オーバーテイク率微増。',
    originHistory: 'タイヤブランケット温度引き下げ規定以降、低熱タイヤのウォームアップに苦しむ近年のF1マシンのリアルな課題に由来。',
    modifiers: {
      lapPaceDeltaSec: +0.35,
    },
    triggerConditionText: 'ピットアウト直後の周回、またはSC明け最初のリスタート周回',
  },

  MONACO_JINX: {
    id: 'MONACO_JINX',
    triggerType: 'PROBABILISTIC',
    baseActivationChance: 0.4,
    name: 'モナコの呪い× (Monaco Jinx)',
    badgeLabel: 'モナコの呪縛×',
    tier: 'HAZARD_VOLATILITY',
    category: 'ENVIRONMENTAL',
    icon: '🇲🇨',
    shortDescription: '故郷モナコで信じられない戦略不運やトラブルが降りかかる不気味なジンクス。',
    tacticalEffectDescription: 'モナコGPにおいて、ピット戦略でのタイムロス確率およびセーフティカー不運率が微増。',
    originHistory: 'ルクレールが長年苦しめられた、地元モナコでのポールポジションからのメカニカルトラブルや戦略ミス連発のドラマに由来（2024年に悲願の克服を果たすまで）。',
    modifiers: {
      incidentRiskModifier: 1.3,
    },
    triggerConditionText: 'モナコ市街地コースを走行中',
  },
};

// ── Driver Trait Assignments (2026 Grid & Key Drivers) ──────────────────────

export const DRIVER_TRAIT_ASSIGNMENTS: Record<string, DriverTraitId[]> = {
  // 🇯🇵 Racing Bulls (RB)
  TSU: ['SUZUKA_SPIRIT', 'LATE_BRAKER', 'TEAMMATE_RIVALRY', 'TYRE_WHISPERER', 'RADIO_HEAT'],
  LAW: ['TEAMMATE_RIVALRY', 'LATE_BRAKER', 'BOX_MARKSMAN'],

  // 🇳🇱 Red Bull Racing
  VER: ['MAD_MAX_HUNT', 'RAIN_DEITY', 'CLEAN_AIR_DEMON', 'SUB_2S_PIT_CREW', 'BOX_MARKSMAN'],
  HAD: ['LAUNCH_MASTER', 'TEAMMATE_RIVALRY'],

  // 🇬🇧 McLaren
  NOR: ['FINAL_LAP_HERO', 'LAUNCH_MASTER', 'SUB_2S_PIT_CREW', 'BOX_MARKSMAN'],
  PIA: ['ICE_COLD_HEART', 'STREET_FIGHTER', 'SUB_2S_PIT_CREW', 'BOX_MARKSMAN'],

  // 🇮🇹 Ferrari
  LEC: ['SATURDAY_MAGICIAN', 'STREET_FIGHTER', 'BOX_MARKSMAN', 'MONACO_JINX'],
  HAM: ['HAMMER_TIME', 'RAIN_DEITY', 'TYRE_WHISPERER', 'LAUNCH_MASTER'],

  // 🇩🇪 Mercedes
  RUS: ['LAUNCH_MASTER', 'SATURDAY_MAGICIAN', 'TEAMMATE_RIVALRY', 'COLD_TYRE_STUMBLE'],
  ANT: ['ICE_COLD_HEART', 'LATE_BRAKER', 'TEAMMATE_RIVALRY'],

  // 🇬🇧 Aston Martin (Honda)
  ALO: ['MINISTER_OF_DEFENCE', 'SMOOTH_OPERATOR', 'CLUTCH_COMEBACK', 'LAUNCH_MASTER'],
  STR: ['RAIN_DEITY', 'LAUNCH_MASTER', 'COLD_TYRE_STUMBLE'],

  // 🇺🇸 Haas
  BEA: ['ICE_COLD_HEART', 'STREET_FIGHTER', 'CLUTCH_COMEBACK'],
  OCO: ['MINISTER_OF_DEFENCE', 'TEAMMATE_RIVALRY', 'RAIN_DEITY'],

  // 🇫🇷 Alpine
  GAS: ['CLUTCH_COMEBACK', 'TEAMMATE_RIVALRY', 'RAIN_DEITY'],
  COL: ['STREET_FIGHTER', 'LATE_BRAKER'],

  // 🇩🇪 Audi / Sauber
  HUL: ['SATURDAY_MAGICIAN', 'CLUTCH_COMEBACK', 'RAIN_DEITY'],
  BOR: ['ICE_COLD_HEART', 'BOX_MARKSMAN'],

  // 🇬🇧 Williams
  ALB: ['CLUTCH_COMEBACK', 'TYRE_WHISPERER', 'BOX_MARKSMAN'],
  SAI: ['SMOOTH_OPERATOR', 'BOX_MARKSMAN', 'TYRE_WHISPERER', 'STREET_FIGHTER'],

  // 🇺🇸 Cadillac
  PER: ['TYRE_WHISPERER', 'MINISTER_OF_DEFENCE', 'STREET_FIGHTER', 'CLUTCH_COMEBACK'],
  BOT: ['SATURDAY_MAGICIAN', 'BOX_MARKSMAN', 'COLD_TYRE_STUMBLE'],

  // 🏆 Hall of Fame Legends
  SEN: ['RAIN_DEITY', 'SATURDAY_MAGICIAN', 'MAD_MAX_HUNT'],
  PRO: ['TYRE_WHISPERER', 'SMOOTH_OPERATOR', 'CLEAN_AIR_DEMON'],
  SCH: ['CLEAN_AIR_DEMON', 'RAIN_DEITY', 'SUB_2S_PIT_CREW'],
};

/**
 * Helper to fetch full trait definitions for a specific driver code
 */
export function getDriverTraits(driverCode: string): DriverTraitDefinition[] {
  const traitIds = DRIVER_TRAIT_ASSIGNMENTS[driverCode] || [];
  return traitIds.map((id) => MASTER_TRAITS[id]).filter(Boolean);
}
