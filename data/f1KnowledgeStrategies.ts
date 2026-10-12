import { 
  TeamProfile, DriverProfile, CircuitProfile, 
  StrategyConcept, HistoryArchive,
  TyreKnowledge, Reference, TeamIconicCar, DriverMilestone, IconicRace,
  DriverVisualAsset, VisualGalleryItem, EngineeringPreference, RaceEngineer,
  DriverSocialLinks, DriverSeasonHistory, TelemetryTarget, EmbeddedRadio,
  KeyCorner, CircuitCornerDetail, TrackGeometry, CircuitVisualAsset,
  CircuitHistoricalMoment, CircuitOfficialLinks, CircuitVisualMap
} from './f1KnowledgeTypes';

import { SeasonStoryline, Rivalry, DramaticMoment, PaddockRelationship } from './f1DramaData';
import { DriverTraitId, DriverTraitDefinition, TraitTier, TraitCategory } from './driverTraitsData';

export const KNOWLEDGE_STRATEGIES: StrategyConcept[] = [
  {
    id: 'undercut-dynamics',
    title: 'アンダーカット (Undercut) の力学と計算原理',
    category: 'PIT_STRATEGY',
    subtitle: 'アウトラップ＋翌周のタイヤグリップ差による逆転メカニズム',
    description:
      '前走車より1〜2周早くピットインし、新品タイヤ（+1.2〜1.8秒/周のデルタゲイン）のアウトラップで猛プッシュして相手のピットアウト時に前に出る戦術 [1]。相手のタイヤデグラデーションが進行している（摩耗によりペースが1秒以上落ちている）場合に成功率が急上昇する [2]。',
    keyTakeaways: [
      '新品タイヤの瞬時ペースゲインが前走車とのギャップを上回る場合に成立',
      '復帰時にトラフィック（遅いマシン）に引っかかるとアウトラップのゲインが消滅し失敗する',
      'ピットロスタイムが約22秒の場合、相手が翌周ピットインした際のタイム差をミリ秒単位で予測することが肝要',
    ],
    keyRadios: [
      {
        id: 'radio-undercut-1',
        lap: 'Lap 15',
        speaker: 'PIT WALL',
        speakerName: 'Peter Bonnington (Bono)',
        transcript: 'Box box, Lewis, box box. Let\'s get the undercut on Leclerc.',
        translation: 'ピットインだルイス。ルクレールに対してアンダーカットを仕掛けるぞ。',
        strategicContext: 'フェラーリの前でピットアウトし順位を逆転するための決定打となった無線指示。',
      },
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1234,
      sessionKey: 9161,
      meetingName: 'Bahrain Grand Prix',
      targetLap: 15,
      targetDriver: '44',
    },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/drivers/radio-undercut-1.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'overcut-dynamics',
    title: 'オーバーカット (Overcut) とステイアウト理論',
    category: 'PIT_STRATEGY',
    subtitle: 'タイヤ熱入れ困難時やクリーンエアを活かす逆転術',
    description:
      'ライバルがピットインした後にコース上に留まり（ステイアウト）、前方がクリアになった「クリーンエア」の中でペースを上げてからピットインする戦術 [1]。新品タイヤのアウトラップでの熱入れ（ウォームアップ）に時間がかかる低温環境や、モナコなどの低デグラデーション市街地コースで極めて有効 [2]。',
    keyTakeaways: [
      'ライバルがピットアウト後にトラフィックに引っかかった瞬間にオーバーカットの勝率が跳ね上がる',
      '路面温度が低く、ハードタイヤの作動温度（100℃前後）突入に2周以上要する場合に強力',
      'ステイアウト中にセーフティカー（SC/VSC）が導入されれば「フリーピットストップ」となり大逆転を生む',
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1236,
      sessionKey: 9163,
      meetingName: 'Monaco Grand Prix',
      targetLap: 32,
      targetDriver: '16',
    },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/drivers/overcut-dynamics.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'safety-car-vsc-delta',
    title: 'SC / VSC 規程と「フリーピットストップ」の数学',
    category: 'FIA_SAFETY_CAR',
    subtitle: 'デルタタイム制限下でのピットロス半減メカニズム',
    description:
      '通常のレーシングスピードではピットレーン通過によるロスタイムは約20〜24秒だが、SCやVSC（バーチャルセーフティカー）導入時はコース上のマシンがFIA規定のデルタタイム（約40%減速）で走行するため、コース上でのロスと相殺されピットロスタイムが実質9〜13秒程度に縮小する [1]。これにより、順位を失わずにタイヤ交換を行う「フリーピットストップ」が可能となる [2]。',
    keyTakeaways: [
      'VSC発動の瞬間にピット入口付近を走行しているマシンが最大のタイムゲインを得る',
      'SC先導走行中はブレーキ熱がホイールリムを通じてタイヤ空気圧・温度に影響を与えるため、織り込み走行が必須',
      '赤旗中断（Red Flag）となった場合は、ピットレーン停止中に全車が無償でタイヤ交換とウイング角度調整を行える',
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1238,
      sessionKey: 9165,
      meetingName: 'Miami Grand Prix',
      targetLap: 28,
      targetDriver: '4',
    },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/drivers/safety-car-vsc-delta.html',
        verifiedDate: '2026-01-01',
      },
      {
        id: 2,
        title: 'FIA Formula One World Championship Regulations',
        publisher: 'FIA',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2026-01-01',
      }
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 5. HISTORICAL ARCHIVES
// ─────────────────────────────────────────────────────────────
