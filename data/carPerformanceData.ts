/**
 * data/carPerformanceData.ts
 * 🏎️ F1 Car Performance Packages & Historic Legendary Cars Database
 *
 * Implements:
 * - Constructor-level Holistic Packages (Strict anti-gacha / No Frankenstein parts)
 * - 5-Axis Performance Profile (Scale: 60 - 99):
 *     1. topSpeed: Straightline speed / Low-drag efficiency / Pure ICE & MGU power
 *     2. highSpeedAero: Downforce in high-lateral G sweeping complexes (Suzuka S's, Silverstone)
 *     3. lowSpeedGrip: Mechanical grip, agile turn-in & traction on exit (Monaco, Singapore)
 *     4. tyrePreservation: Suspension kinematics & chassis rigidity preventing thermal degradation
 *     5. dirtyAirTolerance: Floor sealing & vortex control when running within 1.5s of car ahead
 * - Historic Legends (Unlocked via in-game racing achievements)
 */

export interface CarPerformanceProfile {
  id: string;
  name: string;
  constructorName: string;
  year: number;
  engineSupplier: string;
  isHistoricLegend?: boolean;
  unlockRequirementText?: string;
  achievementKey?: string;
  color: string;
  stats: {
    topSpeed: number;          // 60 - 99
    highSpeedAero: number;     // 60 - 99
    lowSpeedGrip: number;      // 60 - 99
    tyrePreservation: number;  // 60 - 99
    dirtyAirTolerance: number; // 60 - 99
  };
  overallRating: number;       // Weighted average (rounded)
  description: string;
  strengthsSummary: string;
}

// ── 2026 Official Grid Car Packages (11 Constructors) ───────────────────────

export const CAR_PACKAGES_2026: Record<string, CarPerformanceProfile> = {
  mclaren: {
    id: 'mclaren_mcl39',
    name: 'MCL39',
    constructorName: 'McLaren',
    year: 2026,
    engineSupplier: 'Mercedes-AMG M17',
    color: '#f97316',
    stats: {
      topSpeed: 93,
      highSpeedAero: 96,
      lowSpeedGrip: 95,
      tyrePreservation: 95,
      dirtyAirTolerance: 94,
    },
    overallRating: 95,
    description: '全サーキットで死角のない驚異的バランスを誇る2026年最強の万能パッケージ。',
    strengthsSummary: '高速コーナリング、優れたタイヤ摩耗保護、あらゆる天候への適応力。',
  },
  redbull: {
    id: 'redbull_rb22',
    name: 'RB22',
    constructorName: 'Red Bull Racing',
    year: 2026,
    engineSupplier: 'Red Bull Ford Powertrains',
    color: '#3b82f6',
    stats: {
      topSpeed: 94,
      highSpeedAero: 97,
      lowSpeedGrip: 90,
      tyrePreservation: 93,
      dirtyAirTolerance: 96,
    },
    overallRating: 94,
    description: '卓越したグラウンドエフェクト空力と圧倒的フロアダウンフォースを誇る高速の絶対王者。',
    strengthsSummary: '鈴鹿、シルバーストン、スパなど高横Gサーキットでの圧倒的旋回力。',
  },
  ferrari: {
    id: 'ferrari_sf26',
    name: 'SF-26',
    constructorName: 'Ferrari',
    year: 2026,
    engineSupplier: 'Ferrari 066/12',
    color: '#ef4444',
    stats: {
      topSpeed: 91,
      highSpeedAero: 92,
      lowSpeedGrip: 96,
      tyrePreservation: 89,
      dirtyAirTolerance: 91,
    },
    overallRating: 92,
    description: '鋭い回頭性とリアトラクションが武器の低速シケイン＆ストリート・スペシャリスト。',
    strengthsSummary: 'モナコ、シンガポール、ハンガロリンクでの一発タイムと立ち上がり加速。',
  },
  mercedes: {
    id: 'mercedes_w17',
    name: 'W17',
    constructorName: 'Mercedes-AMG',
    year: 2026,
    engineSupplier: 'Mercedes-AMG M17 Works',
    color: '#22c55e',
    stats: {
      topSpeed: 96,
      highSpeedAero: 90,
      lowSpeedGrip: 91,
      tyrePreservation: 92,
      dirtyAirTolerance: 93,
    },
    overallRating: 92,
    description: '新規定PU「M17」の350kW電動ブーストと低ドラッグが火を吹くストレートモンスター。',
    strengthsSummary: 'モンツァ、バクー、スパでの最高速、ロングストレートでの追い越し力。',
  },
  astonmartin: {
    id: 'astonmartin_amr26',
    name: 'AMR26',
    constructorName: 'Aston Martin',
    year: 2026,
    engineSupplier: 'Honda Works RA626H',
    color: '#059669',
    stats: {
      topSpeed: 92,
      highSpeedAero: 94,
      lowSpeedGrip: 91,
      tyrePreservation: 90,
      dirtyAirTolerance: 92,
    },
    overallRating: 92,
    description: 'エイドリアン・ニューウェイ設計の流麗な空力と、ホンダ完全ワークスPUの革新的融合。',
    strengthsSummary: '開発アップデート速度、高速流体制御、ホンダPUの高効率バッテリー回生。',
  },
  racingbulls: {
    id: 'racingbulls_vcarb03',
    name: 'VCARB 03',
    constructorName: 'Racing Bulls',
    year: 2026,
    engineSupplier: 'Red Bull Ford Powertrains',
    color: '#06b6d4',
    stats: {
      topSpeed: 88,
      highSpeedAero: 87,
      lowSpeedGrip: 89,
      tyrePreservation: 88,
      dirtyAirTolerance: 86,
    },
    overallRating: 88,
    description: '中団上位の台風の目。軽快なハンドリングで低速〜中速コーナーの俊敏性が光る。',
    strengthsSummary: '低速テクニカルコースでの入賞力、ピット作業の俊敏さ。',
  },
  williams: {
    id: 'williams_fw48',
    name: 'FW48',
    constructorName: 'Williams',
    year: 2026,
    engineSupplier: 'Mercedes-AMG M17',
    color: '#38bdf8',
    stats: {
      topSpeed: 93,
      highSpeedAero: 85,
      lowSpeedGrip: 84,
      tyrePreservation: 86,
      dirtyAirTolerance: 84,
    },
    overallRating: 86,
    description: '伝統のローダウンフォース＆高効率直線スピード。ストレート勝負ではトップに迫る。',
    strengthsSummary: 'モンツァやスパでの強烈なストレート速度とDRS最高速。',
  },
  alpine: {
    id: 'alpine_a526',
    name: 'A526',
    constructorName: 'Alpine',
    year: 2026,
    engineSupplier: 'Mercedes-AMG M17',
    color: '#0284c7',
    stats: {
      topSpeed: 89,
      highSpeedAero: 86,
      lowSpeedGrip: 86,
      tyrePreservation: 85,
      dirtyAirTolerance: 85,
    },
    overallRating: 86,
    description: 'メルセデスPUへ換装し信頼性と直線の伸びが大幅進化。波乱時の入賞決定力を持つ。',
    strengthsSummary: '荒れたレースでのサバイバル力、雨天での粘り強さ。',
  },
  haas: {
    id: 'haas_vf26',
    name: 'VF-26',
    constructorName: 'Haas',
    year: 2026,
    engineSupplier: 'Ferrari 066/12',
    color: '#f43f5e',
    stats: {
      topSpeed: 90,
      highSpeedAero: 85,
      lowSpeedGrip: 87,
      tyrePreservation: 82,
      dirtyAirTolerance: 84,
    },
    overallRating: 86,
    description: '予選一発の速さに定評があるマシン。タイヤデグラデーション管理が決勝での鍵。',
    strengthsSummary: '予選Q3進出の瞬発力、ストップ＆ゴー型サーキットでの制動安定性。',
  },
  sauber_audi: {
    id: 'audi_c46',
    name: 'Audi R8 F1 (C46)',
    constructorName: 'Audi',
    year: 2026,
    engineSupplier: 'Audi Works Powertrain',
    color: '#ef4444',
    stats: {
      topSpeed: 87,
      highSpeedAero: 86,
      lowSpeedGrip: 85,
      tyrePreservation: 86,
      dirtyAirTolerance: 84,
    },
    overallRating: 86,
    description: 'アウディ完全ワークス初年度の意欲作。高い剛性感とドイツ工学の信頼性が強み。',
    strengthsSummary: '高いシャシー耐久性、ヒュルケンベルグによる安定したレース完走力。',
  },
  cadillac: {
    id: 'cadillac_ct6_f1',
    name: 'Cadillac V-Series F1',
    constructorName: 'Cadillac',
    year: 2026,
    engineSupplier: 'Ferrari (Andretti Global)',
    color: '#eab308',
    stats: {
      topSpeed: 88,
      highSpeedAero: 84,
      lowSpeedGrip: 85,
      tyrePreservation: 85,
      dirtyAirTolerance: 83,
    },
    overallRating: 85,
    description: 'F1新規参戦11番目のチーム。ペレスとボッタスのベテラン開発陣とともに着実に進化。',
    strengthsSummary: 'ペレスのタイヤケア能力と相性の良い穏やかなタイヤデグラデーション。',
  },
};

// ── 🏆 Historic Legendary Cars (Unlocked via Racing Achievements) ───────────

export const HISTORIC_LEGENDARY_CARS: Record<string, CarPerformanceProfile> = {
  mclaren_mp4_4: {
    id: 'mclaren_mp4_4',
    name: 'McLaren-Honda MP4/4',
    constructorName: 'McLaren Honda',
    year: 1988,
    engineSupplier: 'Honda RA168E 1.5L V6 Turbo',
    isHistoricLegend: true,
    achievementKey: 'ACH_SUZUKA_PODIUM',
    unlockRequirementText: '【鈴鹿の奇跡】角田裕毅で鈴鹿サーキット（日本GP）表彰台（P3以上）を獲得する',
    color: '#ef4444',
    stats: {
      topSpeed: 97,
      highSpeedAero: 98,
      lowSpeedGrip: 96,
      tyrePreservation: 98,
      dirtyAirTolerance: 98,
    },
    overallRating: 98,
    description: '1988年16戦15勝。セナとプロストが世界を完全制覇したF1史上最も象徴的なターボモンスター。',
    strengthsSummary: 'ホンダV6ターボの圧倒的トルク、驚異的な空力低ドラッグ設計。',
  },
  ferrari_f2004: {
    id: 'ferrari_f2004',
    name: 'Ferrari F2004',
    constructorName: 'Scuderia Ferrari',
    year: 2004,
    engineSupplier: 'Ferrari 053 3.0L V10 (19,000 RPM)',
    isHistoricLegend: true,
    achievementKey: 'ACH_MONZA_FASTEST_LAP',
    unlockRequirementText: '【スピード・キング】モンツァでファステストラップを記録する',
    color: '#dc2626',
    stats: {
      topSpeed: 99,
      highSpeedAero: 99,
      lowSpeedGrip: 98,
      tyrePreservation: 97,
      dirtyAirTolerance: 99,
    },
    overallRating: 99,
    description: 'ミハエル・シューマッハ黄金期の極致。19,000回転V10が奏でるF1史上最速のコーナリングマシン。',
    strengthsSummary: 'モンツァ等多くのコースレコードを長年保持した伝説の最高速＆高回転パワー。',
  },
  williams_fw14b: {
    id: 'williams_fw14b',
    name: 'Williams-Renault FW14B',
    constructorName: 'Williams Renault',
    year: 1992,
    engineSupplier: 'Renault RS3C/RS4 3.5L V10',
    isHistoricLegend: true,
    achievementKey: 'ACH_RAIN_RACE_WIN',
    unlockRequirementText: '【ハイテクの極致】雨天レース（DrizzleまたはMonsoon）で優勝を達成する',
    color: '#2563eb',
    stats: {
      topSpeed: 96,
      highSpeedAero: 99,
      lowSpeedGrip: 99,
      tyrePreservation: 95,
      dirtyAirTolerance: 97,
    },
    overallRating: 97,
    description: 'エイドリアン・ニューウェイ設計＋アクティブサスペンション。人間離れした横Gでマンセルが独走したハイテクの怪物。',
    strengthsSummary: 'あらゆるコーナーで車高をミリ単位で水平に保ち、異次元のダウンフォースを発生。',
  },
  mercedes_w11: {
    id: 'mercedes_w11',
    name: 'Mercedes-AMG F1 W11 EQ Performance',
    constructorName: 'Mercedes-AMG',
    year: 2020,
    engineSupplier: 'Mercedes-AMG M11 EQ Performance V6 Turbo',
    isHistoricLegend: true,
    achievementKey: 'ACH_POLE_TO_WIN',
    unlockRequirementText: '【黒の絶対王者】ポール・トゥ・ウィン（P1スタートから独走優勝）を達成する',
    color: '#064e3b',
    stats: {
      topSpeed: 98,
      highSpeedAero: 99,
      lowSpeedGrip: 99,
      tyrePreservation: 99,
      dirtyAirTolerance: 98,
    },
    overallRating: 99,
    description: 'F1史上歴代最速のダウンフォースモンスター。ハミルトンがシルバーストン等を3輪走行でも制した漆黒の矢。',
    strengthsSummary: 'DAS（二軸ステアリング）システムと究極の空力フロアによる異次元のグリップ。',
  },
  redbull_rb19: {
    id: 'redbull_rb19',
    name: 'Red Bull Racing RB19',
    constructorName: 'Red Bull Racing',
    year: 2023,
    engineSupplier: 'Honda RBPTH001 1.6L V6 Turbo',
    isHistoricLegend: true,
    achievementKey: 'ACH_SPRINT_AND_MAIN_SWEEP',
    unlockRequirementText: '【連戦連勝の覇者】スプリントレースと決勝レースの両方で完全優勝を達成する',
    color: '#1e3a8a',
    stats: {
      topSpeed: 97,
      highSpeedAero: 99,
      lowSpeedGrip: 96,
      tyrePreservation: 98,
      dirtyAirTolerance: 99,
    },
    overallRating: 98,
    description: '2023年22戦21勝。フェルスタッペンが10連勝を記録した近代F1で最も完璧な王者マシン。',
    strengthsSummary: 'DRSを開けた瞬間の爆発的加速と、タイヤに極限まで優しい超高効率サスペンション。',
  },
};

/**
 * Get car package for a specific constructor or legend
 */
export function getCarPackage(carIdOrTeam: string): CarPerformanceProfile {
  const normalized = carIdOrTeam.toLowerCase().replace(/\s+/g, '_');
  // Check 2026 packages
  for (const [key, pkg] of Object.entries(CAR_PACKAGES_2026)) {
    if (key === normalized || pkg.id === normalized || pkg.constructorName.toLowerCase().includes(normalized)) {
      return pkg;
    }
  }
  // Check Historic Legends
  for (const [key, legend] of Object.entries(HISTORIC_LEGENDARY_CARS)) {
    if (key === normalized || legend.id === normalized) {
      return legend;
    }
  }
  // Fallback to McLaren
  return CAR_PACKAGES_2026.mclaren;
}
