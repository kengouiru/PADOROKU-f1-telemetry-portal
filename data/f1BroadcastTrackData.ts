/**
 * data/f1BroadcastTrackData.ts
 * Formula 1 Official Broadcast Track Guide & 2026 Regulation Telemetry Master
 * 
 * Features:
 * - Elevation Profiles (Peak, Lowest, Total Elevation Diff, Max Gradient %, Waveform)
 * - 2026 Active Aero Zones (Straight Low-Drag 'X-Mode' zones with -55% drag)
 * - 2026 Manual Override Mode (MOM) & Overtake Checkpoints (1.0s gap detection triggers)
 * - Sector 1, 2, 3 Split Percentages & Official Broadcast Color Coding
 * - Speed Traps (⚡ expected 2026 top speed) & Telemetry Specs (Full Throttle %, Tyre Stress, etc.)
 * - Native support for all 24 Rounds + 2026 Madrid IFEMA Street Circuit
 */

export interface ElevationPoint {
  distPct: number; // 0 ~ 100% of lap distance
  elevationM: number; // Elevation in meters
  label?: string; // e.g. "Turn 1 Apex", "Eau Rouge / Raidillon", "130R"
  gradientPct?: number; // e.g. +17.5%, -8.2%
}

export interface ActiveAeroZone {
  id: number;
  name: string; // e.g. "ACTIVE AERO ZONE 1"
  type: 'X-Mode';
  startPct: number; // 0 ~ 100%
  endPct: number;
  label: string; // e.g. "メインストレート (Low Drag X-Mode)"
  lengthMeters: number;
}

export interface OvertakeCheckpoint {
  id: number;
  name: string; // e.g. "MOM CHECKPOINT 1"
  detectionPct: number; // 0 ~ 100% (Detection point)
  activationPct: number; // 0 ~ 100% (Override boost activation)
  brakingZonePct: number; // 0 ~ 100% (Key braking apex)
  detectionLabel: string; // e.g. "T16手前 (ギャップ1.0s判定)"
  targetAction: string; // e.g. "T1進入でのイン刺しブレーキング勝負"
}

export interface SpeedTrap {
  pct: number;
  label: string;
  expectedSpeedKmh: number; // e.g. 338 km/h
}

export interface BroadcastTrackInfo {
  circuitId: string;
  officialName: string;
  shortName: string;
  country: string;
  flag: string;
  lengthKm: number;
  laps: number;
  turnCount: number;
  turnRightCount: number;
  turnLeftCount: number;
  elevation: {
    highestM: number;
    lowestM: number;
    diffM: number;
    maxGradientPct: number;
    climbLocation: string;
    profile: ElevationPoint[];
  };
  sectors: {
    s1EndPct: number; // 0 ~ 100%
    s2EndPct: number;
    s1Description: string;
    s2Description: string;
    s3Description: string;
  };
  activeAeroZones: ActiveAeroZone[];
  overtakeCheckpoints: OvertakeCheckpoint[];
  speedTrap: SpeedTrap;
  telemetrySpecs: {
    fullThrottlePct: number;
    gearChangesPerLap: number;
    tyreStress: 'Low' | 'Medium' | 'High' | 'Very High';
    downforceLevel: 'Low' | 'Medium' | 'Medium-High' | 'High' | 'Maximum';
    brakingEnergy: 'Low' | 'Medium' | 'High' | 'Heavy' | 'Very Heavy';
    pitlaneTimeLossSec: number;
  };
  // Fallback / Dedicated SVG Path & Waypoints for circuits without TelemetryTrackMap entry (e.g. Madrid 2026)
  customPath?: string;
  customWaypoints?: Array<{ pct: number; x: number; y: number }>;
}

export const BROADCAST_TRACK_DATABASE: Record<string, BroadcastTrackInfo> = {
  "suzuka": {
    circuitId: "suzuka",
    officialName: "鈴鹿サーキット (Suzuka Circuit)",
    shortName: "鈴鹿 (Suzuka)",
    country: "日本",
    flag: "🇯🇵",
    lengthKm: 5.807,
    laps: 53,
    turnCount: 18,
    turnRightCount: 10,
    turnLeftCount: 8,
    elevation: {
      highestM: 68.2,
      lowestM: 27.8,
      diffM: 40.4,
      maxGradientPct: 8.2,
      climbLocation: "S字〜ダンロップ〜デグナーへの持続的登坂 (最大+8.2%)",
      profile: [
        { distPct: 0, elevationM: 52.0, label: "Start/Finish" },
        { distPct: 12, elevationM: 42.5, label: "T1-T2 初回下り" },
        { distPct: 22, elevationM: 27.8, label: "S字最底部 (最低標高)" },
        { distPct: 32, elevationM: 54.0, label: "ダンロップ登り頂上 (+8.2%)", gradientPct: 8.2 },
        { distPct: 40, elevationM: 52.0, label: "デグナー 1 & 2" },
        { distPct: 48, elevationM: 41.0, label: "立体交差 (下部アンダーパス)" },
        { distPct: 55, elevationM: 44.5, label: "ヘアピン進入" },
        { distPct: 65, elevationM: 60.5, label: "200R〜スプーン進入" },
        { distPct: 75, elevationM: 68.2, label: "西ストレート最高点 (最高標高)" },
        { distPct: 84, elevationM: 64.0, label: "立体交差 (上部オーバーパス)" },
        { distPct: 91, elevationM: 58.0, label: "超高速 130R" },
        { distPct: 95, elevationM: 54.0, label: "日立Astemoシケイン" },
        { distPct: 100, elevationM: 52.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 29.5,
      s2EndPct: 70.0,
      s1Description: "メインストレート〜T1〜S字〜逆バンク (ドライバーズサーキット)",
      s2Description: "ダンロップ〜デグナー〜立体交差〜ヘアピン〜スプーン",
      s3Description: "西ストレート(X-Mode)〜超高速130R〜シケイン決着"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 96.5,
        endPct: 8.5,
        label: "メインストレート (Low Drag X-Mode: -55% 抵抗低減)",
        lengthMeters: 900
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 72.0,
        endPct: 89.0,
        label: "西ストレート (スプーン脱出〜130R手前)",
        lengthMeters: 1050
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 92.5,
        activationPct: 96.0,
        brakingZonePct: 10.0,
        detectionLabel: "シケイン進入前 (ギャップ1.0s判定)",
        targetAction: "メインストレートからT1進入でのイン飛び込み"
      },
      {
        id: 2,
        name: "MOM CHECKPOINT 2",
        detectionPct: 68.0,
        activationPct: 72.5,
        brakingZonePct: 93.0,
        detectionLabel: "スプーン脱出時 (ギャップ1.0s判定)",
        targetAction: "西ストレートでのMOM電撃加速〜シケイン飛び込み"
      }
    ],
    speedTrap: {
      pct: 88.0,
      label: "西ストレートエンド (130R進入直前)",
      expectedSpeedKmh: 336
    },
    telemetrySpecs: {
      fullThrottlePct: 69,
      gearChangesPerLap: 48,
      tyreStress: "Very High",
      downforceLevel: "High",
      brakingEnergy: "Medium",
      pitlaneTimeLossSec: 22.8
    }
  },

  "spa-francorchamps": {
    circuitId: "spa-francorchamps",
    officialName: "スパ・フランコルシャン (Circuit de Spa-Francorchamps)",
    shortName: "スパ (Spa)",
    country: "ベルギー",
    flag: "🇧🇪",
    lengthKm: 7.004,
    laps: 44,
    turnCount: 19,
    turnRightCount: 10,
    turnLeftCount: 9,
    elevation: {
      highestM: 468.0,
      lowestM: 365.8,
      diffM: 102.2,
      maxGradientPct: 17.5,
      climbLocation: "名物オー・ルージュ〜ラディオンへの垂直登坂 (最大+17.5%)",
      profile: [
        { distPct: 0, elevationM: 405.0, label: "Start/Finish (ラ・ソース手前)" },
        { distPct: 6, elevationM: 408.0, label: "T1 ラ・ソース (低速ヘアピン)" },
        { distPct: 14, elevationM: 375.0, label: "オー・ルージュ底部 (強烈なG圧縮)" },
        { distPct: 19, elevationM: 418.0, label: "ラディオン頂上 (+17.5%激坂)", gradientPct: 17.5 },
        { distPct: 28, elevationM: 468.0, label: "ケメルストレート最高地点 (最高標高)" },
        { distPct: 35, elevationM: 458.0, label: "レ・コーム (絶好のオーバーテイク地点)" },
        { distPct: 45, elevationM: 412.0, label: "ブリュッセル (下りヘアピン)" },
        { distPct: 54, elevationM: 395.0, label: "名物ダブルレフト プーオン" },
        { distPct: 66, elevationM: 365.8, label: "スタヴロ (最低標高地点 366m)" },
        { distPct: 77, elevationM: 382.0, label: "ポール・フレール" },
        { distPct: 88, elevationM: 398.0, label: "全開ブランシモン (310km/h)" },
        { distPct: 96, elevationM: 404.0, label: "バスストップ・シケイン" },
        { distPct: 100, elevationM: 405.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 31.0,
      s2EndPct: 69.5,
      s1Description: "ラ・ソース〜オー・ルージュ〜ケメルストレート全開区間",
      s2Description: "レ・コーム〜ブリュッセル〜プーオン〜スタヴロ (ダウンフォース)",
      s3Description: "ポール・フレール〜超高速ブランシモン〜バスストップ"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 20.0,
        endPct: 33.5,
        label: "ケメルストレート (ラディオン脱出〜レ・コーム進入)",
        lengthMeters: 1050
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 97.5,
        endPct: 4.5,
        label: "メインストレート (バスストップ脱出〜ラ・ソース手前)",
        lengthMeters: 750
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 11.0,
        activationPct: 20.5,
        brakingZonePct: 34.5,
        detectionLabel: "ラ・ソース脱出時 (ギャップ1.0s判定)",
        targetAction: "ケメルストレートでのスリップストリーム〜レ・コームでの制動勝負"
      },
      {
        id: 2,
        name: "MOM CHECKPOINT 2",
        detectionPct: 89.0,
        activationPct: 96.5,
        brakingZonePct: 5.5,
        detectionLabel: "ブランシモン進入前 (ギャップ1.0s判定)",
        targetAction: "バスストップシケイン＆T1ラ・ソース飛び込み"
      }
    ],
    speedTrap: {
      pct: 32.5,
      label: "ケメルストレートエンド (レ・コーム進入)",
      expectedSpeedKmh: 348
    },
    telemetrySpecs: {
      fullThrottlePct: 74,
      gearChangesPerLap: 44,
      tyreStress: "Very High",
      downforceLevel: "Medium",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 21.0
    }
  },

  "circuit-de-monaco": {
    circuitId: "circuit-de-monaco",
    officialName: "モンテカルロ市街地コース (Circuit de Monaco)",
    shortName: "モナコ (Monaco)",
    country: "モナコ",
    flag: "🇲🇨",
    lengthKm: 3.337,
    laps: 78,
    turnCount: 19,
    turnRightCount: 11,
    turnLeftCount: 8,
    elevation: {
      highestM: 46.5,
      lowestM: 4.5,
      diffM: 42.0,
      maxGradientPct: 8.5,
      climbLocation: "サン・デボーテからカジノ広場への急勾配 (+8.5%)",
      profile: [
        { distPct: 0, elevationM: 14.0, label: "Start/Finish" },
        { distPct: 10, elevationM: 8.0, label: "サン・デボーテ (T1進入)" },
        { distPct: 22, elevationM: 38.0, label: "ボー・リバージュ急坂 (+8.5%)", gradientPct: 8.5 },
        { distPct: 28, elevationM: 46.5, label: "マセネ〜カジノ広場 (最高標高)" },
        { distPct: 35, elevationM: 36.0, label: "ミラボー・オート (急降下開始)" },
        { distPct: 42, elevationM: 20.0, label: "フェアモント・ヘアピン (最急カーブ 45km/h)" },
        { distPct: 50, elevationM: 7.5, label: "ポルティエ (地中海レベル)" },
        { distPct: 62, elevationM: 4.5, label: "トンネル出口〜ヌーベルシケイン (最低標高)" },
        { distPct: 75, elevationM: 6.0, label: "タバコ・コーナー" },
        { distPct: 85, elevationM: 7.0, label: "ルイ・シロン〜プールサイド" },
        { distPct: 93, elevationM: 10.0, label: "ラスカス" },
        { distPct: 100, elevationM: 14.0, label: "アントニー・ノゲス〜Finish" }
      ]
    },
    sectors: {
      s1EndPct: 32.0,
      s2EndPct: 69.0,
      s1Description: "サン・デボーテ〜ボー・リバージュ急坂〜カジノ広場",
      s2Description: "ミラボー〜ヘアピン〜トンネル〜ヌーベルシケイン",
      s3Description: "タバコ〜プールサイドシケイン〜ラスカス"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 96.0,
        endPct: 7.0,
        label: "メインストレート (アントニー・ノゲス脱出〜サン・デボーテ手前)",
        lengthMeters: 550
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 53.0,
        endPct: 62.0,
        label: "トンネル区間 (ポルティエ脱出〜シケイン進入)",
        lengthMeters: 420
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 51.0,
        activationPct: 54.0,
        brakingZonePct: 63.5,
        detectionLabel: "ポルティエ脱出時 (ギャップ1.0s判定)",
        targetAction: "トンネル脱出からヌーベルシケイン飛び込み"
      }
    ],
    speedTrap: {
      pct: 61.5,
      label: "トンネル出口 (シケイン手前)",
      expectedSpeedKmh: 295
    },
    telemetrySpecs: {
      fullThrottlePct: 50,
      gearChangesPerLap: 52,
      tyreStress: "Low",
      downforceLevel: "Maximum",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 24.5
    }
  },

  "madrid": {
    circuitId: "madrid",
    officialName: "マドリング (Circuito IFEMA Madring)",
    shortName: "マドリード (Madrid)",
    country: "スペイン",
    flag: "🇪🇸",
    lengthKm: 5.474,
    laps: 55,
    turnCount: 20,
    turnRightCount: 12,
    turnLeftCount: 8,
    elevation: {
      highestM: 650.0,
      lowestM: 607.5,
      diffM: 42.5,
      maxGradientPct: 6.2,
      climbLocation: "IFEMA見本市会場パビリオン間のアップダウン (+6.2%)",
      profile: [
        { distPct: 0, elevationM: 620.0, label: "Start/Finish" },
        { distPct: 10, elevationM: 625.0, label: "T1-T2 90度コーナー" },
        { distPct: 22, elevationM: 642.0, label: "パビリオン連絡路クライム (+6.2%)", gradientPct: 6.2 },
        { distPct: 30, elevationM: 650.0, label: "T8 アリーナ頂上 (最高標高)" },
        { distPct: 42, elevationM: 635.0, label: "名物T10 バンクカーブ進入" },
        { distPct: 55, elevationM: 612.0, label: "M-11高架下アンダーパス" },
        { distPct: 65, elevationM: 607.5, label: "トンネルセクション (最低標高)" },
        { distPct: 78, elevationM: 615.0, label: "バルデベバス複合コーナー" },
        { distPct: 88, elevationM: 618.0, label: "T18-T19 ダブルアペックス" },
        { distPct: 100, elevationM: 620.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 32.0,
      s2EndPct: 68.0,
      s1Description: "メインストレート〜IFEMA見本市アリーナ登坂区間",
      s2Description: "急角度バンクT10〜高速下り〜M-11道路トンネル潜行",
      s3Description: "バルデベバス超高速ストレート〜テクニカルシケイン"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 95.0,
        endPct: 8.0,
        label: "メインストレート (Low Drag X-Mode)",
        lengthMeters: 880
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 68.0,
        endPct: 82.0,
        label: "バルデベバス・バックストレート",
        lengthMeters: 960
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 90.0,
        activationPct: 95.0,
        brakingZonePct: 9.0,
        detectionLabel: "T19手前 (ギャップ1.0s判定)",
        targetAction: "メインストレートでのMOMブースト〜T1進入ブレーキング勝負"
      },
      {
        id: 2,
        name: "MOM CHECKPOINT 2",
        detectionPct: 63.0,
        activationPct: 68.0,
        brakingZonePct: 83.0,
        detectionLabel: "トンネル脱出時 (ギャップ1.0s判定)",
        targetAction: "バックストレートでのスリップストリーム〜T16飛び込み"
      }
    ],
    speedTrap: {
      pct: 81.0,
      label: "バルデベバス・ストレートエンド",
      expectedSpeedKmh: 338
    },
    telemetrySpecs: {
      fullThrottlePct: 68,
      gearChangesPerLap: 50,
      tyreStress: "High",
      downforceLevel: "Medium-High",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 22.0
    },
    // Custom SVG path & waypoints for Madrid 2026
    customPath: "M 130 190 L 130 90 L 145 65 L 180 50 L 220 50 L 250 70 L 280 110 L 310 130 L 330 160 L 320 190 L 290 210 L 250 200 L 220 180 L 190 220 L 170 250 L 140 260 L 120 240 L 130 190 Z",
    customWaypoints: [
      { pct: 0, x: 130, y: 190 },
      { pct: 10, x: 130, y: 110 },
      { pct: 20, x: 145, y: 65 },
      { pct: 30, x: 200, y: 50 },
      { pct: 40, x: 250, y: 70 },
      { pct: 50, x: 290, y: 115 },
      { pct: 60, x: 330, y: 160 },
      { pct: 70, x: 300, y: 205 },
      { pct: 80, x: 220, y: 180 },
      { pct: 90, x: 160, y: 250 },
      { pct: 100, x: 130, y: 190 }
    ]
  },

  "monza": {
    circuitId: "monza",
    officialName: "モンツァ・サーキット (Autodromo Nazionale Monza)",
    shortName: "モンツァ (Monza)",
    country: "イタリア",
    flag: "🇮🇹",
    lengthKm: 5.793,
    laps: 53,
    turnCount: 11,
    turnRightCount: 7,
    turnLeftCount: 4,
    elevation: {
      highestM: 182.0,
      lowestM: 162.0,
      diffM: 20.0,
      maxGradientPct: 2.8,
      climbLocation: "ロッジアからレズモへ至る緩やかな起伏 (+2.8%)",
      profile: [
        { distPct: 0, elevationM: 172.0, label: "Start/Finish" },
        { distPct: 15, elevationM: 168.0, label: "プリマ・ヴァリアンテ (T1-T2シケイン)" },
        { distPct: 28, elevationM: 182.0, label: "クルバ・グランデ頂点 (最高標高)" },
        { distPct: 38, elevationM: 170.0, label: "ヴァリアンテ・デッラ・ロッジア" },
        { distPct: 48, elevationM: 165.0, label: "レズモ 1 & レズモ 2" },
        { distPct: 60, elevationM: 162.0, label: "セッラヴァッレ (最低標高)" },
        { distPct: 75, elevationM: 166.0, label: "ヴァリアンテ・アスカリ" },
        { distPct: 88, elevationM: 170.0, label: "クルバ・アルボレート (旧パラボリカ)" },
        { distPct: 100, elevationM: 172.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 30.0,
      s2EndPct: 71.0,
      s1Description: "メインストレート〜T1シケイン〜超高速クルバ・グランデ",
      s2Description: "ロッジア・シケイン〜レズモ1・2〜旧オーバル下アンダーパス",
      s3Description: "アスカリ・シケイン〜パラボリカ〜全開メインストレート"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 92.0,
        endPct: 12.0,
        label: "メインストレート (パラボリカ脱出〜T1シケイン)",
        lengthMeters: 1120
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 49.0,
        endPct: 71.0,
        label: "レズモ脱出〜アスカリ進入ストレート",
        lengthMeters: 850
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 86.0,
        activationPct: 92.0,
        brakingZonePct: 14.0,
        detectionLabel: "パラボリカ進入時 (ギャップ1.0s判定)",
        targetAction: "メインストレートエンド 355km/hからの超ヘビーブレーキングT1進入"
      }
    ],
    speedTrap: {
      pct: 12.5,
      label: "メインストレートエンド (T1シケイン手前)",
      expectedSpeedKmh: 356
    },
    telemetrySpecs: {
      fullThrottlePct: 80,
      gearChangesPerLap: 36,
      tyreStress: "Medium",
      downforceLevel: "Low",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 23.5
    }
  },

  "silverstone": {
    circuitId: "silverstone",
    officialName: "シルバーストン・サーキット (Silverstone Circuit)",
    shortName: "シルバーストン (Silverstone)",
    country: "イギリス",
    flag: "🇬🇧",
    lengthKm: 5.891,
    laps: 52,
    turnCount: 18,
    turnRightCount: 10,
    turnLeftCount: 8,
    elevation: {
      highestM: 153.0,
      lowestM: 141.7,
      diffM: 11.3,
      maxGradientPct: 3.0,
      climbLocation: "コプスからマゴッツ・ベケッツへの緩やかなアップダウン",
      profile: [
        { distPct: 0, elevationM: 148.0, label: "ハミルトン・ストレート" },
        { distPct: 12, elevationM: 145.0, label: "アビー〜ファームカーブ" },
        { distPct: 22, elevationM: 142.0, label: "ヴィレッジ〜ザ・ループ" },
        { distPct: 34, elevationM: 146.0, label: "ウェリントン・ストレート" },
        { distPct: 44, elevationM: 141.7, label: "ブルックランズ (最低標高)" },
        { distPct: 52, elevationM: 148.0, label: "超高速 コプス" },
        { distPct: 62, elevationM: 153.0, label: "マゴッツ・ベケッツ・チャペル (最高標高)" },
        { distPct: 75, elevationM: 149.0, label: "ハンガー・ストレート" },
        { distPct: 85, elevationM: 144.0, label: "ストウ・コーナー" },
        { distPct: 94, elevationM: 146.0, label: "ヴェイル〜クラブ" },
        { distPct: 100, elevationM: 148.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 28.0,
      s2EndPct: 68.0,
      s1Description: "ハミルトン・ストレート〜アビー〜低速ループ",
      s2Description: "ウェリントン・ストレート〜コプス〜マゴッツ・ベケッツ",
      s3Description: "ハンガー・ストレート〜ストウ〜ヴェイル・クラブ"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 25.0,
        endPct: 39.0,
        label: "ウェリントン・ストレート",
        lengthMeters: 750
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 67.0,
        endPct: 83.0,
        label: "ハンガー・ストレート (チャペル脱出〜ストウ進入)",
        lengthMeters: 900
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 64.0,
        activationPct: 68.0,
        brakingZonePct: 84.0,
        detectionLabel: "ベケッツ脱出時 (ギャップ1.0s判定)",
        targetAction: "ハンガー・ストレートでのMOM加速〜ストウ進入飛び込み"
      }
    ],
    speedTrap: {
      pct: 82.0,
      label: "ハンガー・ストレートエンド (ストウ進入)",
      expectedSpeedKmh: 342
    },
    telemetrySpecs: {
      fullThrottlePct: 72,
      gearChangesPerLap: 40,
      tyreStress: "Very High",
      downforceLevel: "High",
      brakingEnergy: "Medium",
      pitlaneTimeLossSec: 28.0
    }
  },

  "redbull-ring": {
    circuitId: "redbull-ring",
    officialName: "レッドブル・リンク (Red Bull Ring)",
    shortName: "レッドブル・リンク (Spielberg)",
    country: "オーストリア",
    flag: "🇦🇹",
    lengthKm: 4.318,
    laps: 71,
    turnCount: 10,
    turnRightCount: 7,
    turnLeftCount: 3,
    elevation: {
      highestM: 737.0,
      lowestM: 672.0,
      diffM: 65.0,
      maxGradientPct: 12.0,
      climbLocation: "T1脱出からT3レムスヘアピンへの巨大な上り坂 (+12.0%)",
      profile: [
        { distPct: 0, elevationM: 672.0, label: "Start/Finish (最低標高 672m)" },
        { distPct: 12, elevationM: 688.0, label: "T1 ニキ・ラウダ" },
        { distPct: 25, elevationM: 737.0, label: "T3 レムス (最高峰・最急坂頂上 737m)", gradientPct: 12.0 },
        { distPct: 40, elevationM: 708.0, label: "T4 ラウホ (下りブレーキング勝負)" },
        { distPct: 55, elevationM: 692.0, label: "T6 レフトハンド" },
        { distPct: 75, elevationM: 680.0, label: "T7 リンクス" },
        { distPct: 88, elevationM: 675.0, label: "T9 ヨッヘン・リント" },
        { distPct: 100, elevationM: 672.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 30.0,
      s2EndPct: 68.0,
      s1Description: "メインストレート〜T1〜名物T3激坂ヘアピン",
      s2Description: "急降下ストレート〜T4〜テクニカル中高速セクション",
      s3Description: "下り高速コーナー〜T9〜T10〜メインストレート"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 91.0,
        endPct: 9.0,
        label: "メインストレート (Low Drag X-Mode)",
        lengthMeters: 750
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 13.0,
        endPct: 27.0,
        label: "T1脱出〜T3上りストレート",
        lengthMeters: 800
      },
      {
        id: 3,
        name: "ACTIVE AERO ZONE 3",
        type: "X-Mode",
        startPct: 30.0,
        endPct: 42.0,
        label: "T3脱出〜T4下りストレート",
        lengthMeters: 650
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 10.0,
        activationPct: 14.0,
        brakingZonePct: 28.0,
        detectionLabel: "T1脱出時 (ギャップ1.0s判定)",
        targetAction: "T3急坂ヘアピンへのイン飛び込み"
      }
    ],
    speedTrap: {
      pct: 26.0,
      label: "T3進入手前",
      expectedSpeedKmh: 340
    },
    telemetrySpecs: {
      fullThrottlePct: 75,
      gearChangesPerLap: 38,
      tyreStress: "High",
      downforceLevel: "Medium",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 20.2
    }
  },

  "cota": {
    circuitId: "cota",
    officialName: "サーキット・オブ・ジ・アメリカズ (Circuit of the Americas)",
    shortName: "オースティン (COTA)",
    country: "アメリカ",
    flag: "🇺🇸",
    lengthKm: 5.513,
    laps: 56,
    turnCount: 20,
    turnRightCount: 9,
    turnLeftCount: 11,
    elevation: {
      highestM: 184.0,
      lowestM: 143.0,
      diffM: 41.0,
      maxGradientPct: 11.2,
      climbLocation: "メインストレートからT1頂上へのブラインド急登 (+11.2%)",
      profile: [
        { distPct: 0, elevationM: 152.0, label: "Start/Finish" },
        { distPct: 10, elevationM: 184.0, label: "T1 ブラインド急坂頂点 (最高標高)", gradientPct: 11.2 },
        { distPct: 22, elevationM: 160.0, label: "高速エス字セクション" },
        { distPct: 35, elevationM: 150.0, label: "T9-T10 ヘアピンアプローチ" },
        { distPct: 48, elevationM: 143.0, label: "T11 最低標高地点 (143m)" },
        { distPct: 62, elevationM: 154.0, label: "1.2km バックストレート" },
        { distPct: 72, elevationM: 156.0, label: "T12 ヘビーブレーキング勝負所" },
        { distPct: 82, elevationM: 155.0, label: "スタジアムセクション" },
        { distPct: 92, elevationM: 152.0, label: "T16-T18 マルチアペックス" },
        { distPct: 100, elevationM: 152.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 30.0,
      s2EndPct: 67.0,
      s1Description: "T1激坂クライム〜超高速エス字セクション",
      s2Description: "ヘアピン〜最長1.2kmバックストレート〜T12",
      s3Description: "スタジアム複合コーナー〜3連アペックス高速ターン"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 94.0,
        endPct: 8.0,
        label: "メインストレート (T1ブラインド坂進入まで)",
        lengthMeters: 700
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 50.0,
        endPct: 70.0,
        label: "1.2km バックストレート (T11脱出〜T12進入)",
        lengthMeters: 1150
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 46.0,
        activationPct: 51.0,
        brakingZonePct: 71.0,
        detectionLabel: "T11ヘアピン進入前 (ギャップ1.0s判定)",
        targetAction: "1.2kmストレートでのMOM電撃スリップ〜T12フルブレーキング勝負"
      }
    ],
    speedTrap: {
      pct: 69.5,
      label: "バックストレートエンド (T12進入)",
      expectedSpeedKmh: 341
    },
    telemetrySpecs: {
      fullThrottlePct: 65,
      gearChangesPerLap: 54,
      tyreStress: "High",
      downforceLevel: "High",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 21.5
    }
  },

  "interlagos": {
    circuitId: "interlagos",
    officialName: "インテルラゴス・サーキット (Autodromo Jose Carlos Pace)",
    shortName: "サンパウロ (Interlagos)",
    country: "ブラジル",
    flag: "🇧🇷",
    lengthKm: 4.309,
    laps: 71,
    turnCount: 15,
    turnRightCount: 5,
    turnLeftCount: 10,
    elevation: {
      highestM: 795.0,
      lowestM: 752.0,
      diffM: 43.0,
      maxGradientPct: 8.5,
      climbLocation: "ジャンソンからメインストレートへの長い登坂 (+8.5%)",
      profile: [
        { distPct: 0, elevationM: 795.0, label: "Start/Finish (最高標高 795m)" },
        { distPct: 12, elevationM: 780.0, label: "セナ・エス進入 (下り勾配)" },
        { distPct: 25, elevationM: 752.0, label: "クルバ・ド・ソル (最低標高 752m)" },
        { distPct: 38, elevationM: 755.0, label: "レタ・オポスト (バックストレート)" },
        { distPct: 52, elevationM: 760.0, label: "フェラドゥーラ (高速右)" },
        { distPct: 65, elevationM: 768.0, label: "ピネイリーニョ〜ビコ・デ・パト" },
        { distPct: 80, elevationM: 762.0, label: "メルグーリョ" },
        { distPct: 88, elevationM: 775.0, label: "ジャンソン (登り急加速開始)", gradientPct: 8.5 },
        { distPct: 100, elevationM: 795.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 30.0,
      s2EndPct: 69.0,
      s1Description: "メインストレート〜セナ・エス急降下〜クルバ・ド・ソル",
      s2Description: "レタ・オポスト〜フェラドゥーラ〜低速インフィールド",
      s3Description: "メルグーリョ〜ジャンソン強烈な登り坂〜全開フィニッシュ"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 89.0,
        endPct: 9.0,
        label: "メインストレート (ジャンソン登坂〜セナ・エス進入)",
        lengthMeters: 900
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 26.0,
        endPct: 38.0,
        label: "レタ・オポスト (バックストレート)",
        lengthMeters: 650
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 85.0,
        activationPct: 90.0,
        brakingZonePct: 11.0,
        detectionLabel: "ジャンソン進入時 (ギャップ1.0s判定)",
        targetAction: "登りメインストレートでの加速〜セナ・エス進入イン差し"
      }
    ],
    speedTrap: {
      pct: 8.5,
      label: "メインストレートエンド (セナ・エス手前)",
      expectedSpeedKmh: 335
    },
    telemetrySpecs: {
      fullThrottlePct: 70,
      gearChangesPerLap: 42,
      tyreStress: "High",
      downforceLevel: "Medium-High",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 21.0
    }
  },

  "mexico": {
    circuitId: "mexico",
    officialName: "エルマノス・ロドリゲス・サーキット (Autodromo Hermanos Rodriguez)",
    shortName: "メキシコ (Mexico City)",
    country: "メキシコ",
    flag: "🇲🇽",
    lengthKm: 4.304,
    laps: 71,
    turnCount: 17,
    turnRightCount: 10,
    turnLeftCount: 7,
    elevation: {
      highestM: 2285.2,
      lowestM: 2282.0,
      diffM: 3.2,
      maxGradientPct: 1.5,
      climbLocation: "海抜2,285mの超高地（空気密度が低くトップスピード激増）",
      profile: [
        { distPct: 0, elevationM: 2284.0, label: "Start/Finish" },
        { distPct: 20, elevationM: 2282.0, label: "T1-T3 シケイン" },
        { distPct: 35, elevationM: 2283.0, label: "バックストレート" },
        { distPct: 50, elevationM: 2284.0, label: "S字スタジアムアプローチ" },
        { distPct: 70, elevationM: 2285.2, label: "高速S字頂点" },
        { distPct: 85, elevationM: 2283.0, label: "フォロ・ソル野球場スタジアム" },
        { distPct: 100, elevationM: 2284.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 32.0,
      s2EndPct: 68.0,
      s1Description: "最長1.3kmメインストレート〜T1-T3シケイン",
      s2Description: "バックストレート〜高速テクニカルS字",
      s3Description: "大観衆のフォロ・ソルスタジアム〜マンセルコーナー"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 88.0,
        endPct: 16.0,
        label: "1.3km 超長メインストレート",
        lengthMeters: 1300
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 24.0,
        endPct: 36.0,
        label: "バックストレート",
        lengthMeters: 650
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 84.0,
        activationPct: 89.0,
        brakingZonePct: 18.0,
        detectionLabel: "最終コーナー脱出時 (ギャップ1.0s判定)",
        targetAction: "1.3kmストレートで350km/h超からのT1超絶ブレーキング勝負"
      }
    ],
    speedTrap: {
      pct: 16.5,
      label: "メインストレートエンド (T1手前)",
      expectedSpeedKmh: 355
    },
    telemetrySpecs: {
      fullThrottlePct: 68,
      gearChangesPerLap: 45,
      tyreStress: "Medium",
      downforceLevel: "Maximum",
      brakingEnergy: "Very Heavy",
      pitlaneTimeLossSec: 22.0
    }
  },

  "baku": {
    circuitId: "baku",
    officialName: "バクー市街地コース (Baku City Circuit)",
    shortName: "バクー (Baku)",
    country: "アゼルバイジャン",
    flag: "🇦🇿",
    lengthKm: 6.003,
    laps: 51,
    turnCount: 20,
    turnRightCount: 8,
    turnLeftCount: 12,
    elevation: {
      highestM: -12.0,
      lowestM: -28.0,
      diffM: 16.0,
      maxGradientPct: 6.5,
      climbLocation: "カスピ海沿岸（海抜マイナス28m）から古城セクションへの登坂 (+6.5%)",
      profile: [
        { distPct: 0, elevationM: -26.0, label: "Start/Finish (海抜下 -26m)" },
        { distPct: 12, elevationM: -25.0, label: "T1 90度ターン" },
        { distPct: 25, elevationM: -22.0, label: "T3 90度ターン" },
        { distPct: 38, elevationM: -18.0, label: "旧市街アプローチ" },
        { distPct: 48, elevationM: -12.0, label: "古城セクション最狭幅7.6m (最高標高 -12m)", gradientPct: 6.5 },
        { distPct: 60, elevationM: -18.0, label: "下り高速S字 T13-T15" },
        { distPct: 72, elevationM: -28.0, label: "T16脱出 海岸通り (最低標高 -28m)" },
        { distPct: 88, elevationM: -27.0, label: "2.2km 全開海岸ストレート" },
        { distPct: 100, elevationM: -26.0, label: "Finish Line" }
      ]
    },
    sectors: {
      s1EndPct: 30.0,
      s2EndPct: 68.0,
      s1Description: "メインストレート〜市街地90度直角コーナー群",
      s2Description: "最狭幅7.6mの古城セクション登坂〜下り高速ターン",
      s3Description: "F1最長2.2km全開超高速フラットアウトストレート"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 73.0,
        endPct: 10.0,
        label: "2.2km 超長メインストレート (T16脱出〜T1進入)",
        lengthMeters: 2200
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 13.0,
        endPct: 24.0,
        label: "第2ストレート (T2脱出〜T3進入)",
        lengthMeters: 600
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 70.0,
        activationPct: 74.0,
        brakingZonePct: 11.5,
        detectionLabel: "T16進入時 (ギャップ1.0s判定)",
        targetAction: "2.2km全開ストレートでの超高速スリップストリーム〜T1飛び込み"
      }
    ],
    speedTrap: {
      pct: 9.5,
      label: "メインストレートエンド (T1手前)",
      expectedSpeedKmh: 358
    },
    telemetrySpecs: {
      fullThrottlePct: 76,
      gearChangesPerLap: 68,
      tyreStress: "Medium",
      downforceLevel: "Low",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 20.8
    }
  }
};

/**
 * Fallback generator for remaining circuits (generic high-fidelity telemetry info)
 */
export function getBroadcastTrackData(circuitId: string): BroadcastTrackInfo {
  if (BROADCAST_TRACK_DATABASE[circuitId]) {
    return BROADCAST_TRACK_DATABASE[circuitId];
  }

  // Fallback defaults for remaining rounds
  const defaults: Record<string, Partial<BroadcastTrackInfo>> = {
    "albert-park": {
      officialName: "アルバート・パーク・サーキット (Albert Park Circuit)",
      shortName: "メルボルン (Melbourne)",
      country: "オーストラリア",
      flag: "🇦🇺",
      lengthKm: 5.278,
      laps: 58,
      turnCount: 14,
      elevation: { highestM: 13.0, lowestM: 7.8, diffM: 5.2, maxGradientPct: 1.8, climbLocation: "湖畔沿いの緩やかな起伏", profile: [] },
      speedTrap: { pct: 88, label: "T9手前 高速湖畔ストレート", expectedSpeedKmh: 335 }
    },
    "shanghai": {
      officialName: "上海インターナショナル・サーキット (Shanghai International Circuit)",
      shortName: "上海 (Shanghai)",
      country: "中国",
      flag: "🇨🇳",
      lengthKm: 5.451,
      laps: 56,
      turnCount: 16,
      elevation: { highestM: 16.0, lowestM: 8.6, diffM: 7.4, maxGradientPct: 3.2, climbLocation: "渦巻き状T1-T3およびバックストレート", profile: [] },
      speedTrap: { pct: 75, label: "1.2km バックストレートエンド", expectedSpeedKmh: 345 }
    },
    "bahrain-international": {
      officialName: "バーレーン・インターナショナル・サーキット (Bahrain International Circuit)",
      shortName: "サヒール (Sakhir)",
      country: "バーレーン",
      flag: "🇧🇭",
      lengthKm: 5.412,
      laps: 57,
      turnCount: 15,
      elevation: { highestM: 17.5, lowestM: 0.5, diffM: 17.0, maxGradientPct: 4.8, climbLocation: "T4からT9へのアップダウン", profile: [] },
      speedTrap: { pct: 98, label: "メインストレートエンド (T1手前)", expectedSpeedKmh: 338 }
    },
    "jeddah": {
      officialName: "ジェッダ・コーニッシュ・サーキット (Jeddah Corniche Circuit)",
      shortName: "ジェッダ (Jeddah)",
      country: "サウジアラビア",
      flag: "🇸🇦",
      lengthKm: 6.174,
      laps: 50,
      turnCount: 27,
      elevation: { highestM: 12.0, lowestM: 2.0, diffM: 10.0, maxGradientPct: 2.0, climbLocation: "紅海沿岸の超高速湾曲路", profile: [] },
      speedTrap: { pct: 96, label: "最終ストレートエンド", expectedSpeedKmh: 345 }
    },
    "miami": {
      officialName: "マイアミ・インターナショナル・オートドローム (Miami International Autodrome)",
      shortName: "マイアミ (Miami)",
      country: "アメリカ",
      flag: "🇺🇸",
      lengthKm: 5.412,
      laps: 57,
      turnCount: 19,
      elevation: { highestM: 11.0, lowestM: 2.0, diffM: 9.0, maxGradientPct: 4.0, climbLocation: "ハイウェイ交差部スロープ", profile: [] },
      speedTrap: { pct: 70, label: "バックストレートエンド", expectedSpeedKmh: 342 }
    },
    "imola": {
      officialName: "イモラ・サーキット (Autodromo Enzo e Dino Ferrari)",
      shortName: "イモラ (Imola)",
      country: "イタリア",
      flag: "🇮🇹",
      lengthKm: 4.909,
      laps: 63,
      turnCount: 19,
      elevation: { highestM: 78.0, lowestM: 44.0, diffM: 34.0, maxGradientPct: 7.8, climbLocation: "ピラテッラからアクア・ミネラリへの急降下", profile: [] },
      speedTrap: { pct: 98, label: "タンブレロ手前", expectedSpeedKmh: 336 }
    },
    "villeneuve": {
      officialName: "ジル・ヴィルヌーヴ・サーキット (Circuit Gilles Villeneuve)",
      shortName: "モントリオール (Montreal)",
      country: "カナダ",
      flag: "🇨🇦",
      lengthKm: 4.361,
      laps: 70,
      turnCount: 14,
      elevation: { highestM: 15.0, lowestM: 9.8, diffM: 5.2, maxGradientPct: 2.0, climbLocation: "人工島ノートルダム島の平坦路", profile: [] },
      speedTrap: { pct: 76, label: "カジノ・ストレートエンド (チャンピオンの壁手前)", expectedSpeedKmh: 348 }
    },
    "catalunya": {
      officialName: "カタロニア・サーキット (Circuit de Barcelona-Catalunya)",
      shortName: "バルセロナ (Catalunya)",
      country: "スペイン",
      flag: "🇪🇸",
      lengthKm: 4.657,
      laps: 66,
      turnCount: 14,
      elevation: { highestM: 145.0, lowestM: 115.0, diffM: 30.0, maxGradientPct: 5.5, climbLocation: "T3ルノーからT4レプソルへの登坂", profile: [] },
      speedTrap: { pct: 98, label: "メインストレートエンド (T1手前)", expectedSpeedKmh: 339 }
    },
    "hungaroring": {
      officialName: "ハンガロリンク (Hungaroring)",
      shortName: "ブダペスト (Hungaroring)",
      country: "ハンガリー",
      flag: "🇭🇺",
      lengthKm: 4.381,
      laps: 70,
      turnCount: 14,
      elevation: { highestM: 264.0, lowestM: 230.0, diffM: 34.0, maxGradientPct: 6.8, climbLocation: "T3からT4へのブラインド登坂", profile: [] },
      speedTrap: { pct: 98, label: "メインストレートエンド", expectedSpeedKmh: 326 }
    },
    "zandvoort": {
      officialName: "ザントフォールト・サーキット (Circuit Zandvoort)",
      shortName: "ザントフォールト (Zandvoort)",
      country: "オランダ",
      flag: "🇳🇱",
      lengthKm: 4.259,
      laps: 72,
      turnCount: 14,
      elevation: { highestM: 14.5, lowestM: 5.6, diffM: 8.9, maxGradientPct: 18.0, climbLocation: "T3ヒューゲンホルツ＆T14ルイエンダイク 18度バンク", profile: [] },
      speedTrap: { pct: 98, label: "メインストレートエンド", expectedSpeedKmh: 330 }
    },
    "singapore": {
      officialName: "マリーナベイ市街地コース (Marina Bay Street Circuit)",
      shortName: "シンガポール (Marina Bay)",
      country: "シンガポール",
      flag: "🇸🇬",
      lengthKm: 4.940,
      laps: 62,
      turnCount: 19,
      elevation: { highestM: 15.0, lowestM: 7.0, diffM: 8.0, maxGradientPct: 3.5, climbLocation: "アンダーソン橋アプローチ", profile: [] },
      speedTrap: { pct: 45, label: "ラッフルズ・ブルバード", expectedSpeedKmh: 325 }
    },
    "las-vegas": {
      officialName: "ラスベガス・ストリップ・サーキット (Las Vegas Strip Circuit)",
      shortName: "ラスベガス (Las Vegas)",
      country: "アメリカ",
      flag: "🇺🇸",
      lengthKm: 6.201,
      laps: 50,
      turnCount: 17,
      elevation: { highestM: 625.0, lowestM: 618.0, diffM: 7.0, maxGradientPct: 2.0, climbLocation: "ストリップ通りフラット高速路", profile: [] },
      speedTrap: { pct: 70, label: "ラスベガス・ストリップエンド", expectedSpeedKmh: 350 }
    },
    "losail": {
      officialName: "ルサイル・インターナショナル・サーキット (Lusail International Circuit)",
      shortName: "カタール (Lusail)",
      country: "カタール",
      flag: "🇶🇦",
      lengthKm: 5.419,
      laps: 57,
      turnCount: 16,
      elevation: { highestM: 18.0, lowestM: 7.0, diffM: 11.0, maxGradientPct: 3.0, climbLocation: "中高速コーナー群のうねり", profile: [] },
      speedTrap: { pct: 98, label: "メインストレートエンド (T1手前)", expectedSpeedKmh: 340 }
    },
    "yas-marina": {
      officialName: "ヤス・マリーナ・サーキット (Yas Marina Circuit)",
      shortName: "アブダビ (Yas Marina)",
      country: "UAE",
      flag: "🇦🇪",
      lengthKm: 5.281,
      laps: 58,
      turnCount: 16,
      elevation: { highestM: 15.0, lowestM: 3.0, diffM: 12.0, maxGradientPct: 3.5, climbLocation: "ホテルセクションへの緩やかな勾配", profile: [] },
      speedTrap: { pct: 45, label: "最長バックストレートエンド", expectedSpeedKmh: 343 }
    }
  };

  const def = defaults[circuitId] || {};
  const highM = def.elevation?.highestM ?? 45.0;
  const lowM = def.elevation?.lowestM ?? 15.0;
  const diffM = def.elevation?.diffM ?? (highM - lowM);
  const midM = (highM + lowM) / 2;

  // Build high-fidelity profile
  const profile: ElevationPoint[] = [
    { distPct: 0, elevationM: midM, label: "Start/Finish" },
    { distPct: 15, elevationM: lowM, label: "T1-T3 Sector 1" },
    { distPct: 35, elevationM: highM, label: "Mid Sector High Peak", gradientPct: def.elevation?.maxGradientPct ?? 5.0 },
    { distPct: 55, elevationM: (highM + midM) / 2, label: "Back Straight" },
    { distPct: 75, elevationM: lowM + 2, label: "Sector 3 Approach" },
    { distPct: 90, elevationM: midM - 2, label: "Final Chicane" },
    { distPct: 100, elevationM: midM, label: "Finish Line" }
  ];

  return {
    circuitId,
    officialName: def.officialName || "Grand Prix Circuit",
    shortName: def.shortName || circuitId,
    country: def.country || "FIA Official",
    flag: def.flag || "🏁",
    lengthKm: def.lengthKm || 5.3,
    laps: def.laps || 55,
    turnCount: def.turnCount || 16,
    turnRightCount: Math.ceil((def.turnCount || 16) * 0.6),
    turnLeftCount: Math.floor((def.turnCount || 16) * 0.4),
    elevation: {
      highestM: highM,
      lowestM: lowM,
      diffM: diffM,
      maxGradientPct: def.elevation?.maxGradientPct ?? 5.0,
      climbLocation: def.elevation?.climbLocation || "コース中盤の勾配変化",
      profile
    },
    sectors: {
      s1EndPct: 30,
      s2EndPct: 68,
      s1Description: "スタート〜第1セクター",
      s2Description: "中盤テクニカル・バックストレート",
      s3Description: "終盤シケイン〜メインストレート"
    },
    activeAeroZones: [
      {
        id: 1,
        name: "ACTIVE AERO ZONE 1",
        type: "X-Mode",
        startPct: 92,
        endPct: 12,
        label: "メインストレート (Low Drag X-Mode)",
        lengthMeters: 850
      },
      {
        id: 2,
        name: "ACTIVE AERO ZONE 2",
        type: "X-Mode",
        startPct: 45,
        endPct: 62,
        label: "バックストレート (X-Mode)",
        lengthMeters: 750
      }
    ],
    overtakeCheckpoints: [
      {
        id: 1,
        name: "MOM CHECKPOINT 1",
        detectionPct: 88,
        activationPct: 92,
        brakingZonePct: 14,
        detectionLabel: "最終コーナー手前 (ギャップ1.0s判定)",
        targetAction: "メインストレートエンドでのブレーキング勝負"
      }
    ],
    speedTrap: def.speedTrap || {
      pct: 95,
      label: "メインストレートエンド",
      expectedSpeedKmh: 338
    },
    telemetrySpecs: {
      fullThrottlePct: 68,
      gearChangesPerLap: 46,
      tyreStress: "High",
      downforceLevel: "Medium-High",
      brakingEnergy: "Heavy",
      pitlaneTimeLossSec: 22.0
    }
  };
}
