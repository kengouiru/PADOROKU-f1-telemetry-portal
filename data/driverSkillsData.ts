/**
 * data/driverSkillsData.ts
 * 👤 F1 Driver Core Skill Ratings Database
 *
 * Implements:
 * - 5-Axis Skill Profile (Scale: 60 - 99):
 *     1. rawPace: Pure speed, qualifying single-lap extraction & ultimate car ceiling approach
 *     2. tyreManagement: Smooth steering inputs, throttle modulation & thermal wear reduction
 *     3. wetWeather: Rain sensing, finding grip off the rubbered line & hydroplaning resistance
 *     4. racecraft: Wheel-to-wheel overtaking decisiveness, defensive positioning & DRS train survival
 *     5. consistency: Mental composure, pressure tolerance & minimal lockups/unforced errors
 * - 2026 Official Grid (22 Drivers) + Hall of Fame Legends
 */

export interface DriverSkillProfile {
  code: string;
  name: string;
  number: number;
  team: string;
  skills: {
    rawPace: number;        // 60 - 99
    tyreManagement: number; // 60 - 99
    wetWeather: number;     // 60 - 99
    racecraft: number;      // 60 - 99
    consistency: number;    // 60 - 99
  };
  overallRating: number;    // Weighted rating
  keyStrength: string;
}

export const DRIVER_SKILLS_MASTER: Record<string, DriverSkillProfile> = {
  // 🇯🇵 Racing Bulls (RB)
  TSU: {
    code: 'TSU',
    name: 'Yuki Tsunoda',
    number: 22,
    team: 'Racing Bulls',
    skills: {
      rawPace: 92,
      tyreManagement: 90,
      wetWeather: 88,
      racecraft: 93,
      consistency: 87,
    },
    overallRating: 90,
    keyStrength: '奥深いレイトブレーキング飛び込みと高速S字でのマシンコントロール。母国鈴鹿では能力+15%覚醒。',
  },
  LAW: {
    code: 'LAW',
    name: 'Liam Lawson',
    number: 30,
    team: 'Racing Bulls',
    skills: {
      rawPace: 88,
      tyreManagement: 87,
      wetWeather: 89,
      racecraft: 90,
      consistency: 89,
    },
    overallRating: 89,
    keyStrength: '接近戦での強気なホイール・トゥ・ホイールと高いレース適応力。',
  },

  // 🇳🇱 Red Bull Racing
  VER: {
    code: 'VER',
    name: 'Max Verstappen',
    number: 1,
    team: 'Red Bull Racing',
    skills: {
      rawPace: 98,
      tyreManagement: 94,
      wetWeather: 99,
      racecraft: 97,
      consistency: 97,
    },
    overallRating: 97,
    keyStrength: '雨天での異次元のグリップ感知、獲物を逃さない狩人モード、ノーミスのメトロノームラップ。',
  },
  HAD: {
    code: 'HAD',
    name: 'Isack Hadjar',
    number: 6,
    team: 'Red Bull Racing',
    skills: {
      rawPace: 89,
      tyreManagement: 85,
      wetWeather: 86,
      racecraft: 88,
      consistency: 85,
    },
    overallRating: 87,
    keyStrength: '鋭い瞬発力とアグレッシブなスタート蹴り出し。',
  },

  // 🇬🇧 McLaren
  NOR: {
    code: 'NOR',
    name: 'Lando Norris',
    number: 4,
    team: 'McLaren',
    skills: {
      rawPace: 96,
      tyreManagement: 93,
      wetWeather: 92,
      racecraft: 92,
      consistency: 93,
    },
    overallRating: 94,
    keyStrength: '高ボトムスピードを保つコーナリングとレース終盤の驚異的スパート。',
  },
  PIA: {
    code: 'PIA',
    name: 'Oscar Piastri',
    number: 81,
    team: 'McLaren',
    skills: {
      rawPace: 94,
      tyreManagement: 91,
      wetWeather: 90,
      racecraft: 93,
      consistency: 96,
    },
    overallRating: 93,
    keyStrength: '心拍数が上がらない氷の平常心、奇襲のレイトブレーキングと鉄壁のブロック。',
  },

  // 🇮🇹 Ferrari
  LEC: {
    code: 'LEC',
    name: 'Charles Leclerc',
    number: 16,
    team: 'Ferrari',
    skills: {
      rawPace: 97,
      tyreManagement: 89,
      wetWeather: 91,
      racecraft: 94,
      consistency: 90,
    },
    overallRating: 93,
    keyStrength: 'マシンの限界を超える神がかり的な予選一発アタックと市街地ストリートでの速さ。',
  },
  HAM: {
    code: 'HAM',
    name: 'Lewis Hamilton',
    number: 44,
    team: 'Ferrari',
    skills: {
      rawPace: 96,
      tyreManagement: 96,
      wetWeather: 98,
      racecraft: 95,
      consistency: 95,
    },
    overallRating: 96,
    keyStrength: '第2スティントでの神業タイヤ延命力、雨天での圧倒的センシング、ここぞのハンマータイム。',
  },

  // 🇩🇪 Mercedes
  RUS: {
    code: 'RUS',
    name: 'George Russell',
    number: 63,
    team: 'Mercedes',
    skills: {
      rawPace: 94,
      tyreManagement: 90,
      wetWeather: 92,
      racecraft: 92,
      consistency: 91,
    },
    overallRating: 92,
    keyStrength: '予選での一発の切れ味、電光石火のスタート加速。',
  },
  ANT: {
    code: 'ANT',
    name: 'Andrea Kimi Antonelli',
    number: 12,
    team: 'Mercedes',
    skills: {
      rawPace: 93,
      tyreManagement: 86,
      wetWeather: 89,
      racecraft: 89,
      consistency: 87,
    },
    overallRating: 89,
    keyStrength: '天性の高速コーナリングセンスと恐れを知らない鋭い進入スピード。',
  },

  // 🇬🇧 Aston Martin (Honda)
  ALO: {
    code: 'ALO',
    name: 'Fernando Alonso',
    number: 14,
    team: 'Aston Martin',
    skills: {
      rawPace: 93,
      tyreManagement: 95,
      wetWeather: 95,
      racecraft: 98,
      consistency: 96,
    },
    overallRating: 95,
    keyStrength: '後続を絶対に抜かせない将軍の鉄壁防衛、レース全体を俯瞰する超人的戦略眼。',
  },
  STR: {
    code: 'STR',
    name: 'Lance Stroll',
    number: 18,
    team: 'Aston Martin',
    skills: {
      rawPace: 87,
      tyreManagement: 86,
      wetWeather: 93,
      racecraft: 87,
      consistency: 84,
    },
    overallRating: 87,
    keyStrength: '雨天ウェットでの抜群の勝負勘、オープニングラップでのポジション獲得。',
  },

  // 🇺🇸 Haas
  BEA: {
    code: 'BEA',
    name: 'Oliver Bearman',
    number: 87,
    team: 'Haas',
    skills: {
      rawPace: 89,
      tyreManagement: 86,
      wetWeather: 87,
      racecraft: 90,
      consistency: 89,
    },
    overallRating: 88,
    keyStrength: '代役デビュー時から発揮された冷静な適応力と正確なライン取り。',
  },
  OCO: {
    code: 'OCO',
    name: 'Esteban Ocon',
    number: 31,
    team: 'Haas',
    skills: {
      rawPace: 89,
      tyreManagement: 89,
      wetWeather: 92,
      racecraft: 91,
      consistency: 88,
    },
    overallRating: 90,
    keyStrength: '激しいディフェンス力と濡れた路面での粘り強いレース運び。',
  },

  // 🇫🇷 Alpine
  GAS: {
    code: 'GAS',
    name: 'Pierre Gasly',
    number: 10,
    team: 'Alpine',
    skills: {
      rawPace: 90,
      tyreManagement: 88,
      wetWeather: 91,
      racecraft: 90,
      consistency: 89,
    },
    overallRating: 90,
    keyStrength: '逆境からの驚異的リカバリーと波乱のレースでの表彰台決定力。',
  },
  COL: {
    code: 'COL',
    name: 'Franco Colapinto',
    number: 43,
    team: 'Alpine',
    skills: {
      rawPace: 88,
      tyreManagement: 86,
      wetWeather: 87,
      racecraft: 89,
      consistency: 86,
    },
    overallRating: 87,
    keyStrength: '市街地コースでの度胸あるブレーキングと恐れを知らないアタック。',
  },

  // 🇩🇪 Audi / Sauber
  HUL: {
    code: 'HUL',
    name: 'Nico Hulkenberg',
    number: 27,
    team: 'Audi',
    skills: {
      rawPace: 91,
      tyreManagement: 88,
      wetWeather: 92,
      racecraft: 89,
      consistency: 91,
    },
    overallRating: 90,
    keyStrength: '予選での神業ラップタイム抽出と雨の変わり目での的確な状況判断。',
  },
  BOR: {
    code: 'BOR',
    name: 'Gabriel Bortoleto',
    number: 5,
    team: 'Audi',
    skills: {
      rawPace: 88,
      tyreManagement: 87,
      wetWeather: 86,
      racecraft: 88,
      consistency: 88,
    },
    overallRating: 87,
    keyStrength: 'F3・F2王者としての論理的なレース運びとピットボックス進入精度。',
  },

  // 🇬🇧 Williams
  ALB: {
    code: 'ALB',
    name: 'Alexander Albon',
    number: 23,
    team: 'Williams',
    skills: {
      rawPace: 91,
      tyreManagement: 92,
      wetWeather: 88,
      racecraft: 90,
      consistency: 90,
    },
    overallRating: 90,
    keyStrength: 'ロングスティントでのタイヤ持たせとストレート最高速を活かした防衛。',
  },
  SAI: {
    code: 'SAI',
    name: 'Carlos Sainz',
    number: 55,
    team: 'Williams',
    skills: {
      rawPace: 93,
      tyreManagement: 93,
      wetWeather: 89,
      racecraft: 92,
      consistency: 95,
    },
    overallRating: 93,
    keyStrength: 'ピットウォールを超える戦略眼（スムース・オペレーター）とDRSトレイン防衛術。',
  },

  // 🇺🇸 Cadillac
  PER: {
    code: 'PER',
    name: 'Sergio Perez',
    number: 11,
    team: 'Cadillac',
    skills: {
      rawPace: 89,
      tyreManagement: 96,
      wetWeather: 88,
      racecraft: 92,
      consistency: 88,
    },
    overallRating: 91,
    keyStrength: '「タイヤ・ウィスパラー」の異名をとる驚異のリアタイヤ保護と最後尾からの追い上げ。',
  },
  BOT: {
    code: 'BOT',
    name: 'Valtteri Bottas',
    number: 77,
    team: 'Cadillac',
    skills: {
      rawPace: 91,
      tyreManagement: 88,
      wetWeather: 86,
      racecraft: 87,
      consistency: 92,
    },
    overallRating: 89,
    keyStrength: 'クリーンエアでの高精度メトロノーム走行とピットストップ停車精度。',
  },

  // 🏆 Hall of Fame Legends
  SEN: {
    code: 'SEN',
    name: 'Ayrton Senna',
    number: 12,
    team: 'McLaren Honda',
    skills: {
      rawPace: 99,
      tyreManagement: 93,
      wetWeather: 99,
      racecraft: 99,
      consistency: 96,
    },
    overallRating: 99,
    keyStrength: 'セナ足スロットルによる異次元のトラクション、雨のドニントンで見せた伝説の走り。',
  },
  PRO: {
    code: 'PRO',
    name: 'Alain Prost',
    number: 11,
    team: 'McLaren / Williams',
    skills: {
      rawPace: 97,
      tyreManagement: 99,
      wetWeather: 92,
      racecraft: 96,
      consistency: 99,
    },
    overallRating: 97,
    keyStrength: '「プロフェッサー」の頭脳戦、最小限のタイヤ摩耗でレースを完全制覇。',
  },
  SCH: {
    code: 'MSC',
    name: 'Michael Schumacher',
    number: 1,
    team: 'Ferrari / Benetton',
    skills: {
      rawPace: 99,
      tyreManagement: 96,
      wetWeather: 99,
      racecraft: 98,
      consistency: 98,
    },
    overallRating: 99,
    keyStrength: '全周回を予選ラップのようにプッシュし続ける超人的体力とレインマスター。',
  },
  MSC: {
    code: 'MSC',
    name: 'Michael Schumacher',
    number: 1,
    team: 'Ferrari / Benetton',
    skills: {
      rawPace: 99,
      tyreManagement: 96,
      wetWeather: 99,
      racecraft: 98,
      consistency: 98,
    },
    overallRating: 99,
    keyStrength: '全周回を予選ラップのようにプッシュし続ける超人的体力とレインマスター。',
  },
  VET: {
    code: 'VET',
    name: 'Sebastian Vettel',
    number: 5,
    team: 'Red Bull / Ferrari',
    skills: {
      rawPace: 96,
      tyreManagement: 94,
      wetWeather: 95,
      racecraft: 94,
      consistency: 93,
    },
    overallRating: 95,
    keyStrength: 'ブロウンディフューザーを極限まで引き出すスロットル技術とポールからの独走逃げ切り。',
  },
  RAI: {
    code: 'RAI',
    name: 'Kimi Räikkönen',
    number: 7,
    team: 'Ferrari / McLaren',
    skills: {
      rawPace: 95,
      tyreManagement: 98,
      wetWeather: 92,
      racecraft: 95,
      consistency: 95,
    },
    overallRating: 95,
    keyStrength: 'ステアリング修正の極めて少ない研ぎ澄まされた進入ラインと冷徹なタイヤ保全。',
  },
  MAN: {
    code: 'MAN',
    name: 'Nigel Mansell',
    number: 5,
    team: 'Williams Renault',
    skills: {
      rawPace: 97,
      tyreManagement: 90,
      wetWeather: 92,
      racecraft: 99,
      consistency: 90,
    },
    overallRating: 96,
    keyStrength: '超人的な腕力と闘志で空力限界を押し広げる豪快なオーバーテイクと突っ込み。',
  },
  HAK: {
    code: 'HAK',
    name: 'Mika Häkkinen',
    number: 1,
    team: 'McLaren Mercedes',
    skills: {
      rawPace: 98,
      tyreManagement: 93,
      wetWeather: 92,
      racecraft: 96,
      consistency: 94,
    },
    overallRating: 96,
    keyStrength: '超高速コーナーをフラットアウトで駆け抜ける度胸と左足ブレーキによる極限の車体コントロール。',
  },
  LAU: {
    code: 'LAU',
    name: 'Niki Lauda',
    number: 12,
    team: 'Ferrari / McLaren',
    skills: {
      rawPace: 94,
      tyreManagement: 99,
      wetWeather: 90,
      racecraft: 93,
      consistency: 99,
    },
    overallRating: 95,
    keyStrength: 'コンピューターの如き計算力とマシン開発眼。最小限のリスクで勝利を攫う究極の知性。',
  },
  RIC: {
    code: 'RIC',
    name: 'Daniel Ricciardo',
    number: 3,
    team: 'Red Bull / RB',
    skills: {
      rawPace: 90,
      tyreManagement: 89,
      wetWeather: 88,
      racecraft: 96,
      consistency: 87,
    },
    overallRating: 90,
    keyStrength: '世界最強の飛び込みレイトブレーキングと笑顔のハニーバジャー。',
  },
};

/**
 * Helper to fetch driver skill profile
 */
export function getDriverSkills(driverCode: string): DriverSkillProfile {
  return DRIVER_SKILLS_MASTER[driverCode] || {
    code: driverCode,
    name: driverCode,
    number: 99,
    team: 'Privateer',
    skills: { rawPace: 85, tyreManagement: 85, wetWeather: 85, racecraft: 85, consistency: 85 },
    overallRating: 85,
    keyStrength: '堅実な中団走行。',
  };
}
