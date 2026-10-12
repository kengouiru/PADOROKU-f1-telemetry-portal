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

export const KNOWLEDGE_HISTORY: HistoryArchive[] = [
  {
    id: '1998-hungary',
    year: 1998,
    grandPrix: 'ハンガリーGP (Hungaroring)',
    title: 'ミハエル・シューマッハとロス・ブラウンの伝説の3ストップ大作戦',
    subtitle: '「毎周予選アタックのペースで走れ」という無線と奇跡の逆転劇',
    strategicNarrative: 'コース上でマクラーレンを抜けないと判断したフェラーリの戦略家ロス・ブラウンは、突如「3ストップ作戦」への変更を決断。シューマッハに対し「ピットアウト後に25秒のギャップを作るため、毎周予選アタックのペースで走れ」と指示。シューマッハは異次元のファステストラップを連発し、見事マクラーレン勢の前でピットアウトして歴史的勝利を飾った。',
    outcome: 'フェラーリ M.シューマッハ優勝（マクラーレンを戦略と超絶ドライビングで完全粉砕）',
    keyRadios: [
      {
        id: 'radio-1998-1',
        lap: 'Lap 43',
        speaker: 'PIT WALL',
        speakerName: 'Ross Brawn (Technical Director)',
        transcript: 'Michael, you have 19 laps to pull out 25 seconds. We need 19 qualifying laps from you.',
        translation: 'ミハエル、25秒のギャップを作るのに残り19周ある。お前の予選アタックラップを19周連続で見せてくれ。',
        strategicContext: '3ストップ成功のための絶対条件をドライバーに課したF1史に残る伝説の無線。',
      },
      {
        id: 'radio-1998-2',
        lap: 'Lap 44',
        speaker: 'DRIVER',
        speakerName: 'Michael Schumacher',
        transcript: 'Thank you very much. Copy that.',
        translation: '了解、任せてくれ。',
        strategicContext: '不可能とも思える過酷な要求に即座に応じ、毎周1秒ずつマクラーレンを引き離す鬼神の走りを開始した瞬間。',
      },
    ],
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/drivers/radio-1998-2.html',
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
    id: '2011-canada',
    year: 2011,
    grandPrix: 'カナダGP (Circuit Gilles Villeneuve)',
    title: 'ジェンソン・バトン、最後尾からの6回ピット・4時間超えの大逆転劇',
    subtitle: '豪雨・赤旗・パンク・ペナルティを乗り越えた最終周の奇跡',
    strategicNarrative: '豪雨による2時間の中断、チームメイトとの接触、ドライブスルーペナルティ、パンクなどにより一時最下位（21位）まで転落したバトン。しかし路面が乾きゆく中で誰よりも早くインターミディエイト、ドライタイヤへのスイッチを決断。驚異的なペースで全車をゴボウ抜きし、最終ラップのターン6でトップのベッテルにプレッシャーをかけてミスを誘発し劇的な逆転優勝を果たした。',
    outcome: 'マクラーレン J.バトン優勝（F1史上最長時間レース 4時間4分39秒を制覇）',
    keyRadios: [
      {
        id: 'radio-2011-1',
        lap: 'Lap 51',
        speaker: 'DRIVER',
        speakerName: 'Jenson Button',
        transcript: 'The slick tyre is definitely the right tyre now. I have mega grip!',
        translation: '今スリックタイヤに替えるのが絶対に正解だ。ものすごいグリップがある！',
        strategicContext: 'ウェット路面が乾くクロスオーバーポイントを誰よりも早く見極め、怒涛の追い上げの引き金を引いた無線。',
      },
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1237,
      sessionKey: 9164,
      meetingName: 'Canadian Grand Prix (Circuit Gilles Villeneuve)',
      targetLap: 70,
      targetDriver: '4',
    },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/drivers/radio-2011-1.html',
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
    id: '2021-abudhabi',
    year: 2021,
    grandPrix: 'アブダビGP (Yas Marina Circuit)',
    title: '2021年 最終戦アブダビGP ─ ファイナルラップの歴史的死闘',
    subtitle: '同ポイントで迎えた最終戦、セーフティカー解除直後の運命の1周',
    strategicNarrative: 'シーズン全22戦を戦い抜き、フェルスタッペンとハミルトンが全くの同ポイントで迎えた最終決戦。レース終盤ラティフィのクラッシュによりセーフティカーが導入。レッドブルは新品ソフトタイヤへのギャンブルピットを敢行し、ステイアウトしたハミルトン（摩耗したハード）との最終周スプリント勝負に持ち込み、ターン5で劇的オーバーテイクを決めて悲願の初タイトルを獲得した。',
    outcome: 'レッドブル M.フェルスタッペン優勝（初の王座戴冠）',
    keyRadios: [
      {
        id: 'radio-2021-1',
        lap: 'Lap 53',
        speaker: 'PIT WALL',
        speakerName: 'Gianpiero Lambiase (GP)',
        transcript: 'Safety car deployed. Box, Max, box for Softs! Opportunity for a free stop.',
        translation: 'セーフティカー導入だ。ピットインだマックス、ソフトタイヤを履く！フリーストップの好機だ。',
        strategicContext: 'ステイアウトを選択したメルセデスに対し、首位陥落のリスクを賭けてソフトタイヤへ履き替える勝負手となったピットコール。',
      },
      {
        id: 'radio-2021-2',
        lap: 'Finish',
        speaker: 'PIT WALL',
        speakerName: 'Christian Horner',
        transcript: 'MAX VERSTAPPEN! YOU ARE THE WORLD CHAMPION! THE WORLD CHAMPION!',
        translation: 'マックス・フェルスタッペン！君が世界チャンピオンだ！世界チャンピオンだ！',
        strategicContext: 'ファイナルラップでの逆転劇の後、チーム代表ホーナーが絶叫した戴冠の瞬間。',
      },
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1250,
      sessionKey: 9200,
      meetingName: 'Abu Dhabi Grand Prix (Yas Marina Circuit)',
      targetLap: 58,
      targetDriver: '1',
    },
    references: [
      {
        id: 1,
        title: 'Official F1 Documentation & Statistics',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/drivers/radio-2021-2.html',
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
