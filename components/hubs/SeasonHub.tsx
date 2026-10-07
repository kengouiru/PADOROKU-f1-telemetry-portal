'use client';

/**
 * components/hubs/SeasonHub.tsx
 * Formula 1 Season Weekend Companion & Calendar Hub
 * Features:
 *  - 2026 Current Season & 2025 Archive Season Switcher with Auto-Rollover Detection
 *  - Automatic Next GP Resolution based on current date
 *  - Live Ticking Countdown (Days, Hours, Min, Sec)
 *  - Full JST Weekend Schedule (FP, Quali, Sprint, Race in Japan Time)
 *  - Race Calendar (All 24 GPs with flags, Pirelli compounds, Sprint badges)
 *  - Championship Standings (2026 Live Standings & 2025 Annual Finals)
 *  - Grid Showcase (2026 New PU Regs & Audi/Honda Works vs 2025 Grid)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { fetchRaceSummary, constructorColour, type RaceSummary } from '@/lib/jolpicaRaceSummary';
import {
  type SeasonYear,
  getActiveSeasonYear,
  getSeasonCalendar,
  getSeasonGrid,
  getDriverStandings,
  getConstructorStandings,
  getNextUpcomingRound,
  isSeasonConcluded,
  type RaceWeekendSchedule,
  toJapaneseGpName,
} from '@/data/f1SeasonData';
import { getWeatherByRound, getCircuitWeather } from '@/data/f1WeatherData';
import { getGrandPrixReportByRound, getGrandPrixReportByCircuitId } from '@/data/f1GrandPrixReportsData';
import F1BroadcastTrackGuide from '@/components/circuits/F1BroadcastTrackGuide';
import { useCountdown } from '@/lib/useCountdown';
import { getCircuitTimezoneInfo, formatDualSessionTime } from '@/lib/circuitTimezones';
import { useCurrentJstClock, isWeekendInProgress } from '@/lib/systemClock';
import { getSessionClassification } from '@/lib/sessionResultsService';
import { getHistoricalArchive } from '@/data/f1HistoricalArchivesData';
import { getBroadcastTrackData } from '@/data/f1BroadcastTrackData';
import { CIRCUIT_TRACK_MAPS, GENERIC_TRACK, interpolateTrackCoords } from '@/components/telemetry/TelemetryTrackMap';
import { Map, Camera, ExternalLink, X, Maximize2, Compass, ChevronRight } from 'lucide-react';
import SessionResultsModal from './SessionResultsModal';
import AdSlot from '@/components/ads/AdSlot';

interface SeasonHubProps {
  onNavigateToTelemetry?: (gpName?: string) => void;
  onNavigateToTyres?: () => void;
  onNavigateToDrama?: () => void;
  onNavigateToGlossary?: () => void;
  onNavigateToCircuit?: (circuitId: string) => void;
  onNavigateToDriver?: (driverCode: string) => void;
  onNavigateToTeam?: (teamId: string) => void;
  isPro?: boolean;
  onOpenUpgradeModal?: () => void;
  selectedSeasonProp?: SeasonYear;
  onSeasonChangeProp?: (year: SeasonYear) => void;
}

export function getCircuitIdForRace(race: RaceWeekendSchedule): string {
  const name = (race.gpName + ' ' + race.circuitName).toLowerCase();
  if (name.includes('アルバート') || name.includes('albert') || name.includes('オーストラリア')) return 'albert-park';
  if (name.includes('上海') || name.includes('shanghai') || name.includes('中国')) return 'shanghai';
  if (name.includes('鈴鹿') || name.includes('suzuka') || name.includes('日本')) return 'suzuka';
  if (name.includes('サヒール') || name.includes('bahrain') || name.includes('バーレーン')) return 'bahrain-international';
  if (name.includes('ジェッダ') || name.includes('jeddah') || name.includes('サウジ')) return 'jeddah';
  if (name.includes('マイアミ') || name.includes('miami')) return 'miami';
  if (name.includes('イモラ') || name.includes('imola')) return 'imola';
  if (name.includes('モナコ') || name.includes('monaco') || name.includes('モンテカルロ')) return 'circuit-de-monaco';
  if (name.includes('マドリード') || name.includes('madrid') || name.includes('マドリング')) return 'madrid';
  if (name.includes('カタロニア') || name.includes('catalunya') || name.includes('バルセロナ') || name.includes('スペイン')) return 'catalunya';
  if (name.includes('カナダ') || name.includes('モントリオール') || name.includes('ジル') || name.includes('villeneuve')) return 'villeneuve';
  if (name.includes('オーストリア') || name.includes('レッドブル・リンク') || name.includes('redbull')) return 'redbull-ring';
  if (name.includes('シルバーストン') || name.includes('silverstone') || name.includes('イギリス')) return 'silverstone';
  if (name.includes('スパ') || name.includes('spa') || name.includes('ベルギー')) return 'spa-francorchamps';
  if (name.includes('ハンガロリンク') || name.includes('hungaroring') || name.includes('ハンガリー') || name.includes('ブダペスト')) return 'hungaroring';
  if (name.includes('ザントフォールト') || name.includes('zandvoort') || name.includes('オランダ')) return 'zandvoort';
  if (name.includes('モンツァ') || name.includes('monza') || name.includes('イタリア')) return 'monza';
  if (name.includes('バクー') || name.includes('baku') || name.includes('アゼルバイジャン')) return 'baku';
  if (name.includes('シンガポール') || name.includes('singapore') || name.includes('マリーナベイ')) return 'singapore';
  if (name.includes('アメリカ') || name.includes('オースティン') || name.includes('cota')) return 'cota';
  if (name.includes('メキシコ') || name.includes('mexico')) return 'mexico';
  if (name.includes('サンパウロ') || name.includes('ブラジル') || name.includes('インテルラゴス') || name.includes('interlagos')) return 'interlagos';
  if (name.includes('ラスベガス') || name.includes('vegas')) return 'las-vegas';
  if (name.includes('カタール') || name.includes('ルサイル') || name.includes('losail')) return 'losail';
  if (name.includes('アブダビ') || name.includes('ヤス') || name.includes('yas')) return 'yas-marina';
  if (name.includes('セパン') || name.includes('sepang') || name.includes('マレーシア')) return 'sepang';
  return 'suzuka';
}

export const ENGLISH_CIRCUITS_MAP: Record<string, string> = {
  'albert-park': 'Albert Park Circuit',
  'shanghai': 'Shanghai International Circuit',
  'suzuka': 'Suzuka International Racing Course',
  'bahrain-international': 'Bahrain International Circuit',
  'jeddah': 'Jeddah Corniche Circuit',
  'miami': 'Miami International Autodrome',
  'imola': 'Autodromo Enzo e Dino Ferrari',
  'circuit-de-monaco': 'Circuit de Monaco',
  'catalunya': 'Circuit de Barcelona-Catalunya',
  'villeneuve': 'Circuit Gilles-Villeneuve',
  'redbull-ring': 'Red Bull Ring',
  'silverstone': 'Silverstone Circuit',
  'spa-francorchamps': 'Circuit de Spa-Francorchamps',
  'hungaroring': 'Hungaroring',
  'zandvoort': 'Circuit Zandvoort',
  'monza': 'Autodromo Nazionale Monza',
  'baku': 'Baku City Circuit',
  'singapore': 'Marina Bay Street Circuit',
  'cota': 'Circuit of the Americas',
  'mexico': 'Autódromo Hermanos Rodríguez',
  'interlagos': 'Autódromo José Carlos Pace',
  'las-vegas': 'Las Vegas Strip Circuit',
  'losail': 'Lusail International Circuit',
  'yas-marina': 'Yas Marina Circuit',
  'madrid': 'Madring (IFEMA Madrid Circuit)',
  'sepang': 'Sepang International Circuit',
};

export function getDisplayCircuitName(race: RaceWeekendSchedule): string {
  const hasJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(race.circuitName);
  if (!hasJapanese) return race.circuitName;
  const id = getCircuitIdForRace(race);
  return ENGLISH_CIRCUITS_MAP[id] || race.circuitName;
}

export function getTeamIdFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('red bull') || n.includes('レッドブル')) return 'redbull';
  if (n.includes('ferrari') || n.includes('フェラーリ')) return 'ferrari';
  if (n.includes('mclaren') || n.includes('マクラーレン')) return 'mclaren';
  if (n.includes('mercedes') || n.includes('メルセデス')) return 'mercedes';
  if (n.includes('aston') || n.includes('アストン')) return 'aston-martin';
  if (n.includes('alpine') || n.includes('アルピーヌ')) return 'alpine';
  if (n.includes('williams') || n.includes('ウィリアムズ')) return 'williams';
  if (n.includes('rb') || n.includes('レーシングブルズ') || n.includes('cash app') || n.includes('レーシング・ブルズ')) return 'rb';
  if (n.includes('audi') || n.includes('アウディ') || n.includes('sauber') || n.includes('ザウバー')) return 'audi';
  if (n.includes('haas') || n.includes('ハース')) return 'haas';
  if (n.includes('cadillac') || n.includes('キャデラック')) return 'cadillac';
  return 'ferrari';
}

export interface AtmospherePhoto {
  url: string;
  caption: string;
  tag: string;
}

export function getCircuitAtmospherePhotos(circuitId: string, gpName: string): [AtmospherePhoto, AtmospherePhoto] {
  const photoMap: Record<string, [AtmospherePhoto, AtmospherePhoto]> = {
    'suzuka': [
      {
        url: '/images/circuits/circuit_suzuka_real.jpg',
        caption: '鈴鹿名物の大観覧車と超満員のグランドスタンド。世界屈指の熱気',
        tag: 'グランドスタンド＆熱気'
      },
      {
        url: '/images/circuits/circuit_suzuka.jpg',
        caption: '名物S字カーブと逆バンク。200km/h超で駆け抜けるドライバーズサーキット',
        tag: 'S字＆テクニカル区間'
      }
    ],
    'circuit-de-monaco': [
      {
        url: '/images/circuits/circuit_monaco_real.jpg',
        caption: 'モンテカルロ港の豪華ヨット群とカジノ広場。F1屈指の格式と歴史',
        tag: 'ハーバー＆カジノ広場'
      },
      {
        url: '/images/circuits/circuit_monaco.jpg',
        caption: 'フェアモント・ヘアピン（旧ロウズ）とトンネル区間の超絶接近戦',
        tag: '最遅ヘアピン＆トンネル'
      }
    ],
    'spa-francorchamps': [
      {
        url: '/images/circuits/circuit_spa_real.jpg',
        caption: 'アルデンヌの森に轟く轟音。名物オールージュ〜ラディオンの急勾配の絶景',
        tag: 'オールージュ＆森林'
      },
      {
        url: '/images/circuits/circuit_spa.jpg',
        caption: 'ケメルストレートエンドのレ・コームとプーホンの超高速ダブルエイペックス',
        tag: 'ケメル＆プーホン'
      }
    ],
    'monza': [
      {
        url: '/images/circuits/circuit_monza_real.jpg',
        caption: 'ティフォシの深紅の熱気と王立公園に響く超高回転サウンド。速度の神殿',
        tag: 'ティフォシの熱気'
      },
      {
        url: '/images/circuits/circuit_monza.jpg',
        caption: '350km/h超からのフルブレーキング勝負・第1シケインと名物パラボリカ',
        tag: '速度の神殿・シケイン'
      }
    ],
    'silverstone': [
      {
        url: '/images/circuits/circuit_silverstone_real.jpg',
        caption: 'モータースポーツ発祥の地。新ピット棟The Wingと熱狂のホームストレート',
        tag: 'The Wing＆ホーム'
      },
      {
        url: '/images/circuits/circuit_silverstone.jpg',
        caption: 'マゴッツ・ベケッツ・チャペルの極限横G連続切り返しとコプスコーナー',
        tag: 'マゴッツ＆ベケッツ'
      }
    ],
    'albert-park': [
      {
        url: '/images/circuits/circuit_albert_park_real.jpg',
        caption: 'メルボルンの湖畔公園に特設される美しい緑と高層ビル群のコントラスト',
        tag: '湖畔公園＆開幕戦熱狂'
      },
      {
        url: '/images/circuits/circuit_albert_park.jpg',
        caption: '高速化したセクター2とターン9-10の超ハイスピードシケインアプローチ',
        tag: '高速レイクサイド'
      }
    ],
    'shanghai': [
      {
        url: '/images/circuits/circuit_shanghai_real.jpg',
        caption: '漢字の「上」を象った巨大建築メインスタンドと未来的なパドック景観',
        tag: '巨大スタンド＆パドック'
      },
      {
        url: '/images/circuits/circuit_shanghai.jpg',
        caption: 'ターン1-2の巻き込むような「かたつむりコーナー」と1.2kmロングストレート',
        tag: 'ロングストレート'
      }
    ],
    'bahrain-international': [
      {
        url: '/images/circuits/circuit_bahrain_real.jpg',
        caption: '砂漠の夜空を白銀に照らす無数の投光器。ナイトレースの幻想的な輝き',
        tag: '砂漠のナイトレース'
      },
      {
        url: '/images/circuits/circuit_bahrain.jpg',
        caption: 'オアシスタワーと花崗岩アスファルト。激しいタイヤ摩耗とターン10',
        tag: 'オアシスタワー'
      }
    ],
    'jeddah': [
      {
        url: '/images/circuits/circuit_jeddah_real.jpg',
        caption: '紅海沿岸を平均時速250km/h超で駆け抜ける世界最速の市街地サーキット',
        tag: '紅海コーストライン'
      },
      {
        url: '/images/circuits/circuit_jeddah.jpg',
        caption: 'バンク角12度のターン13と連続するブラインド高速コーナーの緊迫感',
        tag: 'バンク＆ブラインドS字'
      }
    ],
    'miami': [
      {
        url: '/images/circuits/circuit_miami_real.jpg',
        caption: 'NFLハードロック・スタジアムを取り囲むアメリカンエンターテインメントの祭典',
        tag: 'スタジアム＆キャンパス'
      },
      {
        url: '/images/circuits/circuit_miami.jpg',
        caption: '高速マリーナセクターとターン14-15の高架下タイトシケイン',
        tag: '高架下シケイン'
      }
    ],
    'imola': [
      {
        url: '/images/circuits/circuit_imola_real.jpg',
        caption: 'サンテルモの丘とエンツォ・エ・ディーノ・フェラーリの歴史と情熱の聖地',
        tag: '歴史の聖地＆丘陵'
      },
      {
        url: '/images/circuits/circuit_imola.jpg',
        caption: 'トサコーナーのすり鉢状バンクとアクエ・ミネラリの超難関ブレーキング',
        tag: 'トサ＆アクエミネラリ'
      }
    ],
    'catalunya': [
      {
        url: '/images/circuits/circuit_catalunya.jpg',
        caption: 'マシンの総合空力性能が白日の下に晒されるバルセロナの名門コース',
        tag: '名門カタロニア全景'
      },
      {
        url: '/images/circuits/circuit_asset_12.jpg',
        caption: '超ロングなターン3のロングスウィープとリニューアルされた最終高速ベンド',
        tag: '高速ターン3'
      }
    ],
    'villeneuve': [
      {
        url: '/images/circuits/circuit_villeneuve_real.jpg',
        caption: 'セント・ローレンス川に浮かぶノートルダム島。緑豊かな万博跡地の特設コース',
        tag: 'ノートルダム島＆水辺'
      },
      {
        url: '/images/circuits/circuit_villeneuve.jpg',
        caption: 'チャンピオンたちの挑戦を阻んできた最終シケイン「チャンピオンの壁」',
        tag: 'チャンピオンの壁'
      }
    ],
    'redbull-ring': [
      {
        url: '/images/circuits/circuit_redbull_ring_real.jpg',
        caption: '雄大なシュタイアーマルク山脈のパノラマと巨大な雄牛モニュメント',
        tag: 'アルプス山脈＆雄牛'
      },
      {
        url: '/images/circuits/circuit_redbull_ring.jpg',
        caption: '急勾配を駆け上がるターン1〜ターン3の強烈なオーバーテイク合戦',
        tag: '急勾配アップヒル'
      }
    ],
    'hungaroring': [
      {
        url: '/images/circuits/circuit_hungaroring.jpg',
        caption: 'すり鉢状の天然スタンドからコースの大半が見渡せる夏の伝統グランプリ',
        tag: '天然すり鉢スタンド'
      },
      {
        url: '/images/circuits/circuit_asset_18.jpg',
        caption: '「壁のないモナコ」と称される息つく暇もない中低速テクニカルコーナー群',
        tag: 'ツイスティ・インフィールド'
      }
    ],
    'zandvoort': [
      {
        url: '/images/circuits/circuit_zandvoort.jpg',
        caption: '北海沿岸の砂丘地帯を縫うように走るオレンジアーミー歓喜のオランダGP',
        tag: '砂丘＆オレンジアーミー'
      },
      {
        url: '/images/circuits/circuit_asset_19.jpg',
        caption: 'バンク角18度のターザンカーブとアリー・ルイエンダイク・バンクの迫力',
        tag: '18度バンクコーナー'
      }
    ],
    'baku': [
      {
        url: '/images/circuits/circuit_baku_real.jpg',
        caption: '世界遺産の旧市街城壁と超近代的なカスピ海プロムナードの強烈な対比',
        tag: '旧市街城壁＆超近代都市'
      },
      {
        url: '/images/circuits/circuit_baku.jpg',
        caption: '幅わずか7.6mの城壁セクションと時速350km/h超の2.2kmメイン直線',
        tag: '城壁狭窄路＆最高速直線'
      }
    ],
    'singapore': [
      {
        url: '/images/circuits/circuit_singapore_real.jpg',
        caption: 'マリーナベイ・サンズを背景に熱帯の夜を疾走する世界初のF1ナイトレース',
        tag: 'マリーナベイ夜景'
      },
      {
        url: '/images/circuits/circuit_singapore.jpg',
        caption: 'アンダーソン橋を渡る歴史的ストリートと湿度80%超の過酷なサバイバル戦',
        tag: 'アンダーソン橋＆シティ'
      }
    ],
    'cota': [
      {
        url: '/images/circuits/circuit_cota_real.jpg',
        caption: '赤白青の星条旗カラーと高さ77mの展望タワーが象徴するテキサスの熱気',
        tag: '展望タワー＆星条旗'
      },
      {
        url: '/images/circuits/circuit_cota.jpg',
        caption: '高低差41mを一気に駆け上がるブラインドの急勾配ターン1ブレーキング',
        tag: '急坂ターン1アプローチ'
      }
    ],
    'mexico': [
      {
        url: '/images/circuits/circuit_mexico_real.jpg',
        caption: '旧野球場フォロ・ソルに作られたスタジアムセクション。4万人の大歓声',
        tag: 'フォロ・ソル野球場'
      },
      {
        url: '/images/circuits/circuit_mexico.jpg',
        caption: '標高2,285mの希薄な空気。最高速350km/hと低下するダウンフォース',
        tag: '高地2285mメイン直線'
      }
    ],
    'interlagos': [
      {
        url: '/images/circuits/circuit_interlagos_real.jpg',
        caption: 'サンパウロの熱狂的なサンバのリズムとセナの魂が宿る伝統のインテルラゴス',
        tag: 'セナの聖地＆大観衆'
      },
      {
        url: '/images/circuits/circuit_interlagos.jpg',
        caption: '下りながら左右に切り返す名物エス・ド・セナと急坂を駆け上がる最終加速',
        tag: 'エス・ド・セナ'
      }
    ],
    'las-vegas': [
      {
        url: '/images/circuits/circuit_las_vegas_real.jpg',
        caption: 'ラスベガス・ストリップ通りを封鎖し、ネオンと巨大Sphereが輝く土曜ナイトレース',
        tag: 'ストリップ通り＆Sphere'
      },
      {
        url: '/images/circuits/circuit_las_vegas.jpg',
        caption: 'ベラージオの噴水前を時速350km/hで駆け抜ける約2kmの超高速ストレート',
        tag: 'ベラージオ噴水前直線'
      }
    ],
    'losail': [
      {
        url: '/images/circuits/circuit_losail_real.jpg',
        caption: '最新鋭のピットビルディングと砂漠を照らすLED照明。中東カタールの豪華舞台',
        tag: 'カタールLEDナイト'
      },
      {
        url: '/images/circuits/circuit_losail.jpg',
        caption: '流れるような中高速コーナーの連続とドライバーを極限まで追い詰める過酷な熱',
        tag: '超高速フローセクション'
      }
    ],
    'yas-marina': [
      {
        url: '/images/circuits/circuit_yas_marina_real.jpg',
        caption: 'Wアブダビ・ホテルのイルミネーションと夕暮れから夜へ移ろうトワイライトレース',
        tag: 'Wホテル＆トワイライト'
      },
      {
        url: '/images/circuits/circuit_yas_marina.jpg',
        caption: '改修された高速バンクコーナーとシーズンフィナーレの華やかな表彰台',
        tag: 'グランドフィナーレ'
      }
    ],
    'madrid': [
      {
        url: '/images/circuits/circuit_madrid.jpg',
        caption: '2026年新設のIFEMAマドリード市街地コース。展示会場と公道が融合した新舞台',
        tag: 'IFEMAマドリード新設'
      },
      {
        url: '/images/circuits/circuit_asset_14.jpg',
        caption: '高速立体交差と市街地ストリートセクションが織りなす次世代のレイアウト',
        tag: '次世代ハイブリッド市街地'
      }
    ],
  };

  const match = photoMap[circuitId];
  if (match) return match;

  return [
    {
      url: `/images/circuits/circuit_${circuitId.replace(/-/g, '_')}_real.jpg`,
      caption: `${gpName} の熱狂に包まれるサーキット全景`,
      tag: 'サーキット全景'
    },
    {
      url: `/images/circuits/circuit_${circuitId.replace(/-/g, '_')}.jpg`,
      caption: `${gpName} の名所コーナーと白熱のコースセクター`,
      tag: '名所コース'
    }
  ];
}

interface HeroTrackMapCardProps {
  circuitId: string;
  race: RaceWeekendSchedule;
  onOpenAnalysis: () => void;
  onOpenEncyclopedia?: () => void;
  onOpen3dModal?: () => void;
}

const HeroTrackMapCard = React.memo(function HeroTrackMapCard({
  circuitId,
  race,
  onOpenAnalysis,
  onOpenEncyclopedia,
  onOpen3dModal,
}: HeroTrackMapCardProps) {
  const trackData = useMemo(() => {
    return CIRCUIT_TRACK_MAPS[circuitId] || GENERIC_TRACK;
  }, [circuitId]);

  const trackInfo = useMemo(() => {
    return getBroadcastTrackData(circuitId);
  }, [circuitId]);

  const handleCardClick = () => {
    if (onOpen3dModal) {
      onOpen3dModal();
    } else {
      onOpenAnalysis();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full bg-slate-950/95 hover:bg-slate-900/95 rounded-2xl border border-slate-400/40 hover:border-slate-300 p-3 sm:p-3.5 shadow-xl relative overflow-hidden group cursor-pointer transition-all hover:shadow-slate-900/60 backdrop-blur-md"
      title="クリックして3Dコース標高図・戦術プロファイルをインタラクティブ操作"
    >
      {/* Background subtle neon glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-slate-400/15 rounded-full blur-2xl pointer-events-none group-hover:bg-slate-300/25 transition-all" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-1.5 relative z-10">
        <span className="text-[11px] font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="truncate">コースレイアウト (TRACK MAP)</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenEncyclopedia && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenEncyclopedia();
              }}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
              title="大百科でサーキット完全解剖を見る"
            >
              <span>大百科 </span>
            </button>
          )}
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-400/25 text-slate-200 border border-slate-300/40 font-bold group-hover:bg-slate-400/40 transition-colors flex items-center gap-1 shadow-sm">
            <span>3D起動</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Track SVG Map Canvas */}
      <div className="relative w-full h-40 sm:h-48 flex items-center justify-center py-1">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full filter drop-shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all group-hover:scale-[1.01]"
        >
          <defs>
            <filter id="hero-track-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="hero-track-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Heavy Asphalt Track Foundation */}
          <path
            d={trackData.svgPath}
            fill="none"
            stroke="#0f172a"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={trackData.svgPath}
            fill="none"
            stroke="#1e293b"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Track Atmosphere Outer Line */}
          <path
            d={trackData.svgPath}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
            filter="url(#hero-track-glow)"
          />

          {/* High-Contrast Centerline */}
          <path
            d={trackData.svgPath}
            fill="none"
            stroke="url(#hero-track-grad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* OVR / OverRide Acceleration Zone Overlays */}
          {trackInfo.overtakeCheckpoints && trackInfo.overtakeCheckpoints.map((cp) => {
            const detCoord = interpolateTrackCoords(trackData.waypoints, cp.detectionPct);
            const actCoord = interpolateTrackCoords(trackData.waypoints, cp.activationPct);
            return (
              <g key={`ovr-zone-${cp.id}`} className="select-none pointer-events-none">
                {/* Detection Point Indicator */}
                <g transform={`translate(${detCoord.x}, ${detCoord.y})`}>
                  <circle r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1.2" filter="drop-shadow(0 0 5px rgba(168,85,247,0.9))" />
                  <g transform="translate(0, -10)">
                    <rect
                      x="-22"
                      y="-7"
                      width="44"
                      height="13"
                      rx="3.5"
                      fill="#3b0764"
                      stroke="#d8b4fe"
                      strokeWidth="1.2"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                    />
                    <text
                      x="0"
                      y="2.5"
                      fontSize="6.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="#f3e8ff"
                      textAnchor="middle"
                    >
                      OVR検知
                    </text>
                  </g>
                </g>

                {/* Activation Start Point Indicator */}
                <g transform={`translate(${actCoord.x}, ${actCoord.y})`}>
                  <circle r="4.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1.2" filter="drop-shadow(0 0 5px rgba(236,72,153,0.9))" />
                  <g transform="translate(0, 12)">
                    <rect
                      x="-17"
                      y="-6"
                      width="34"
                      height="12"
                      rx="3"
                      fill="#500724"
                      stroke="#f472b6"
                      strokeWidth="1.2"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                    />
                    <text
                      x="0"
                      y="2.5"
                      fontSize="6.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="#fce7f3"
                      textAnchor="middle"
                    >
                      OVR
                    </text>
                  </g>
                </g>
              </g>
            );
          })}

          {/* Start / Finish Line Indicator */}
          {trackData.startFinish && (
            <g transform={`translate(${trackData.startFinish.x}, ${trackData.startFinish.y})`} className="select-none pointer-events-none">
              {/* Green Glow Pulse */}
              <circle r="10" fill="#10b981" fillOpacity="0.3" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle r="6" fill="#064e3b" stroke="#10b981" strokeWidth="2" filter="drop-shadow(0 0 6px rgba(16,185,129,0.9))" />
              <circle r="2.5" fill="#ffffff" />
              
              {/* S/F Badge with High Contrast */}
              <g transform="translate(0, -13)">
                <rect
                  x="-23"
                  y="-7"
                  width="46"
                  height="14"
                  rx="3.5"
                  fill="#022c22"
                  stroke="#34d399"
                  strokeWidth="1.3"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))"
                />
                <text
                  x="0"
                  y="2.8"
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="900"
                  fill="#34d399"
                  textAnchor="middle"
                >
                  START
                </text>
              </g>
            </g>
          )}

          {/* High-Contrast Turn Number Badges (All Corners Displayed Clearly) */}
          {trackData.cornerPins &&
            trackData.cornerPins.map((pin) => {
              const isWide = pin.number.length > 2;
              const width = isWide ? 26 : 19;
              return (
                <g
                  key={pin.number}
                  transform={`translate(${pin.x}, ${pin.y})`}
                  className="select-none pointer-events-none"
                >
                  <rect
                    x={-width / 2}
                    y="-8"
                    width={width}
                    height="16"
                    rx="4"
                    fill="#020617"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.95))"
                  />
                  <text
                    x="0"
                    y="3"
                    fontSize="8"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="900"
                    fill="#ffffff"
                    textAnchor="middle"
                  >
                    {pin.number}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Hover Hint Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/50 backdrop-blur-[2px] pointer-events-none rounded-xl">
          <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-slate-500 to-slate-400 text-white text-xs font-racing font-bold tracking-wide flex items-center gap-1.5 shadow-xl border border-slate-200/40 animate-pulse">
            <span>クリックして3D標高モデルを展開</span>
          </span>
        </div>
      </div>

      {/* Legend & Circuit Specs Bar */}
      <div className="mt-1 pt-2 border-t border-white/[0.08] space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="truncate max-w-[160px] text-slate-400 font-bold">
            {race.circuitName}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-200 font-bold">{race.lengthKm.toFixed(3)} km</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 font-semibold">{trackInfo.turnCount} Turns</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">{race.laps} 周</span>
          </div>
        </div>

        {/* Quick Legend Pill Strip */}
        <div className="flex items-center justify-between text-[11px] font-mono px-2 py-1 bg-slate-900/90 rounded-lg border border-white/[0.06] text-slate-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300 font-semibold">START</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-slate-200 font-semibold">OVR区間</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-amber-300 font-semibold">Turn番号</span>
            </span>
          </div>
          <span className="text-slate-300 font-semibold">
            3D解析対応 
          </span>
        </div>
      </div>
    </div>
  );
});

interface RaceCountdownCardProps {
  targetDateUtc: string;
  dates: string;
  circuitId?: string;
  country?: string;
  city?: string;
  gpName?: string;
  winnerNote?: string;
}

const RaceCountdownCard = React.memo(function RaceCountdownCard({
  targetDateUtc,
  dates,
  circuitId,
  country,
  city,
  gpName,
  winnerNote,
}: RaceCountdownCardProps) {
  const timeLeft = useCountdown(targetDateUtc);

  // Compute accurate dual-time race start string
  const targetFormatted = useMemo(() => {
    if (!targetDateUtc) return dates;
    try {
      const d = new Date(targetDateUtc);
      const tz = getCircuitTimezoneInfo(circuitId, country, city);
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const days = ['日', '月', '火', '水', '木', '金', '土'];
      const dow = days[d.getDay()];
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');

      let localH = d.getHours() + tz.diffFromJstHours;
      if (localH < 0) localH += 24;
      else if (localH >= 24) localH -= 24;
      const localHStr = String(localH).padStart(2, '0');

      if (tz.utcOffset === 9) {
        return `${m}/${day} (${dow}) ${hh}:${mm} JST`;
      }
      return `${m}/${day} (${dow}) ${hh}:${mm} JST / 現地 ${localHStr}:${mm} ${tz.tzAbbr}`;
    } catch {
      return dates;
    }
  }, [targetDateUtc, circuitId, country, city, dates]);

  // レース開始後はカウントダウン不要のため非表示（Live表示は上部バッジに集約）
  const isTargetPast = useMemo(() => {
    if (!targetDateUtc) return true;
    try {
      return new Date(targetDateUtc).getTime() <= Date.now();
    } catch {
      return false;
    }
  }, [targetDateUtc]);

  if (isTargetPast || (timeLeft.mounted && timeLeft.isPast)) {
    return null;
  }

  const pad = (n: number | string) => String(n).padStart(2, '0');
  const value = timeLeft.mounted
    ? `${timeLeft.days}日 ${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`
    : '--日 --:--:--';

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <p className="text-sm text-slate-400">
        決勝スタートまで{' '}
        <span className="font-racing text-base text-white tabular-nums" suppressHydrationWarning>{value}</span>
      </p>
      <p className="text-[11px] text-slate-500 tabular-nums">{targetFormatted}</p>
    </div>
  );
});

type MainTab = 'calendar' | 'track_analysis' | 'standings' | 'grid';

export const SEASON_OPTIONS: { value: SeasonYear; label: string }[] = [
  { value: '2026', label: '2026年 (現行シーズン / 全23戦)' },
  { value: '2025', label: '2025年 (L.ノリス / McLaren)' },
  { value: '2024', label: '2024年 (M.フェルスタッペン / McLaren WCC)' },
  { value: '2023', label: '2023年 (M.フェルスタッペン / Red Bull)' },
  { value: '2022', label: '2022年 (M.フェルスタッペン / Red Bull)' },
  { value: '2021', label: '2021年 (M.フェルスタッペン / Mercedes WCC)' },
  { value: '2020', label: '2020年 (L.ハミルトン / Mercedes)' },
  { value: '2019', label: '2019年 (L.ハミルトン / Mercedes)' },
  { value: '2018', label: '2018年 (L.ハミルトン / Mercedes)' },
];

export default function SeasonHub({
  onNavigateToTelemetry,
  onNavigateToTyres,
  onNavigateToDrama,
  onNavigateToGlossary,
  onNavigateToCircuit,
  onNavigateToDriver,
  onNavigateToTeam,
  isPro = false,
  onOpenUpgradeModal,
  selectedSeasonProp,
  onSeasonChangeProp,
}: SeasonHubProps) {
  // Live JST Clock (Telemetry System Reference)
  const jstClock = useCurrentJstClock();

  // Season State: Defaults to current active season (2026), synced with prop if provided
  const [selectedSeasonInternal, setSelectedSeasonInternal] = useState<SeasonYear>(() => selectedSeasonProp || getActiveSeasonYear());
  const selectedSeason = selectedSeasonProp || selectedSeasonInternal;

  useEffect(() => {
    if (selectedSeasonProp && selectedSeasonProp !== selectedSeasonInternal) {
      setSelectedSeasonInternal(selectedSeasonProp);
    }
  }, [selectedSeasonProp, selectedSeasonInternal]);

  const [activeTab, setActiveTab] = useState<MainTab>('calendar');
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'sprint'>('all');
  const [standingsYear, setStandingsYear] = useState<SeasonYear>(() => selectedSeason);
  const [atmosphereModalImage, setAtmosphereModalImage] = useState<AtmospherePhoto | null>(null);

  useEffect(() => {
    setStandingsYear(selectedSeason);
  }, [selectedSeason]);

  const [heroSubView, setHeroSubView] = useState<'schedule' | 'weather'>('schedule');
  const [sessionModalOpen, setSessionModalOpen] = useState<boolean>(false);
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<string>('FP1');
  const [is3dModalOpen, setIs3dModalOpen] = useState<boolean>(false);

  // Active season calendar & grid — starts with local data, upgradeable via API
  const localCalendar = useMemo(() => getSeasonCalendar(selectedSeason), [selectedSeason]);
  const [liveCalendar, setLiveCalendar] = useState<RaceWeekendSchedule[] | null>(null);
  const [calendarSource, setCalendarSource] = useState<'local' | 'api'>('local');

  // Fetch official calendar from API
  useEffect(() => {
    if (selectedSeason !== '2026') {
      setLiveCalendar(null);
      setCalendarSource('local');
      return;
    }

    let cancelled = false;

    async function fetchCalendar() {
      try {
        const res = await fetch(`/api/f1-calendar?year=2026`, {
          signal: AbortSignal.timeout(12000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        const apiRaces: RaceWeekendSchedule[] = data.races;

        // Official FIA API data (apiRaces) provides verified live schedule, dates, and targetDateUtc.
        // Local calendar supplies circuit specifications (compounds, laps, track length).
        const merged = localCalendar.map((localRace) => {
          const apiMatch = apiRaces.find((l) => l.round === localRace.round);
          if (!apiMatch) return localRace;
          return {
            ...localRace,
            dates: apiMatch.dates || localRace.dates,
            targetDateUtc: apiMatch.targetDateUtc || localRace.targetDateUtc,
            scheduleJst: apiMatch.scheduleJst && apiMatch.scheduleJst.length > 0 ? apiMatch.scheduleJst : localRace.scheduleJst,
            isCancelled: apiMatch.isCancelled ?? localRace.isCancelled ?? false,
            isSprint: apiMatch.isSprint ?? localRace.isSprint,
          };
        });

        setLiveCalendar(merged);
        setCalendarSource('api');
        if (!userHasSelectedRoundRef.current) {
          setSelectedRound(getNextUpcomingRound(merged));
        }
      } catch (err) {
        console.warn('[SeasonHub] API calendar fetch failed, using local data:', err);
        setLiveCalendar(null);
        setCalendarSource('local');
      }
    }

    fetchCalendar();
    return () => { cancelled = true; };
  }, [selectedSeason, localCalendar]);

  const activeCalendar = liveCalendar || localCalendar;
  const activeGrid = useMemo(() => getSeasonGrid(selectedSeason), [selectedSeason]);
  const activeDriverStandings = useMemo(() => getDriverStandings(selectedSeason), [selectedSeason]);
  const activeConstructorStandings = useMemo(() => getConstructorStandings(selectedSeason), [selectedSeason]);
  const seasonEnded = useMemo(() => isSeasonConcluded(activeCalendar), [activeCalendar]);

  // Standings Tab Dynamic Archive Data (supports switching to 2026, 2025, 2024...)
  const displayedDriverStandings = useMemo(() => getDriverStandings(standingsYear), [standingsYear]);
  const displayedConstructorStandings = useMemo(() => getConstructorStandings(standingsYear), [standingsYear]);
  const maxDisplayedDriverPoints = useMemo(() => {
    return Math.max(1, ...(displayedDriverStandings.map((d) => d.points) || [1]));
  }, [displayedDriverStandings]);
  const maxDisplayedTeamPoints = useMemo(() => {
    return Math.max(1, ...(displayedConstructorStandings.map((c) => c.points) || [1]));
  }, [displayedConstructorStandings]);
  const standingsArchive = useMemo(() => {
    return standingsYear !== '2026' ? getHistoricalArchive(parseInt(standingsYear, 10)) : null;
  }, [standingsYear]);

  const userHasSelectedRoundRef = React.useRef(false);

  // Selected Round: Auto-defaults to the next upcoming race of that season
  const [selectedRound, setSelectedRound] = useState<number>(() => {
    const defaultYear = getActiveSeasonYear();
    const cal = getSeasonCalendar(defaultYear);
    return getNextUpcomingRound(cal);
  });

  // Handle Season Switching
  const handleSeasonChange = (year: SeasonYear) => {
    setSelectedSeasonInternal(year);
    onSeasonChangeProp?.(year);
    userHasSelectedRoundRef.current = false;
    const cal = getSeasonCalendar(year);
    // When switching season, set focus to next upcoming round or Round 1
    setSelectedRound(getNextUpcomingRound(cal));
  };

  // Selected Race Weekend
  const selectedRace = useMemo(() => {
    return activeCalendar.find((r) => r.round === selectedRound) || activeCalendar[0];
  }, [activeCalendar, selectedRound]);

  const selectedCircuitId = useMemo(() => {
    return getCircuitIdForRace(selectedRace);
  }, [selectedRace]);

  const currentTzInfo = useMemo(() => {
    return getCircuitTimezoneInfo(selectedCircuitId, selectedRace?.country, selectedRace?.city);
  }, [selectedCircuitId, selectedRace]);

  const selectedWeather = useMemo(() => {
    return getCircuitWeather(selectedCircuitId) || getWeatherByRound(selectedRound);
  }, [selectedCircuitId, selectedRound]);

  // Circuit-matched report only. The old round-number fallback showed a different
  // circuit's result (e.g. Monza 2024 for the 2026 Sepang round).
  const selectedReport = useMemo(() => {
    return getGrandPrixReportByCircuitId(selectedCircuitId) ?? null;
  }, [selectedCircuitId]);

  const selectedAtmospherePhotos = useMemo(() => {
    return getCircuitAtmospherePhotos(selectedCircuitId, selectedRace?.gpName || '');
  }, [selectedCircuitId, selectedRace]);

  // Authentic 2026 Race & Quali Classifications
  const raceClassification2026 = useMemo(() => {
    if (selectedSeason !== '2026') return null;
    const res = getSessionClassification('2026', selectedRace.round, '決勝', 101.5, selectedCircuitId);
    return res.status === 'completed' && res.results.length > 0 ? res : null;
  }, [selectedSeason, selectedRace.round, selectedCircuitId]);

  const qualiClassification2026 = useMemo(() => {
    if (selectedSeason !== '2026') return null;
    const res = getSessionClassification('2026', selectedRace.round, '予選', 101.5, selectedCircuitId);
    return res.status === 'completed' && res.results.length > 0 ? res : null;
  }, [selectedSeason, selectedRace.round, selectedCircuitId]);

  // Finished races not yet in static data → fetch official result from Jolpica.
  const [fetchedSummary, setFetchedSummary] = useState<RaceSummary | null>(null);
  const [summaryStatus, setSummaryStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [summaryRetry, setSummaryRetry] = useState(0);
  const raceFinished = useMemo(() => {
    const t = selectedRace?.targetDateUtc ? new Date(selectedRace.targetDateUtc).getTime() : NaN;
    return !isNaN(t) && Date.now() - t > 2.5 * 60 * 60 * 1000;
  }, [selectedRace]);
  useEffect(() => {
    setFetchedSummary(null);
    if (selectedSeason !== '2026' || raceClassification2026 || !raceFinished || selectedRace.isCancelled) {
      setSummaryStatus('idle');
      return;
    }
    const ac = new AbortController();
    setSummaryStatus('loading');
    fetchRaceSummary('2026', selectedRace.round, ac.signal).then((s) => {
      if (ac.signal.aborted) return;
      setFetchedSummary(s);
      setSummaryStatus(s ? 'idle' : 'error');
    });
    return () => ac.abort();
  }, [selectedSeason, selectedRace.round, selectedRace.isCancelled, raceClassification2026, raceFinished, summaryRetry]);

  /** Unified result view: static 2026 classification → fetched → null. */
  const raceResultView = useMemo(() => {
    if (raceClassification2026) {
      return {
        podium: raceClassification2026.results.slice(0, 3).map((p) => ({
          code: p.driverCode, name: p.driverName, team: p.teamName, color: p.teamColor, note: p.gapToLeader,
        })),
        pole: qualiClassification2026?.polePosition
          ? `${qualiClassification2026.polePosition.driverCode} ${qualiClassification2026.polePosition.time}` : null,
        fastest: raceClassification2026.fastestLap
          ? `${raceClassification2026.fastestLap.driverCode} ${raceClassification2026.fastestLap.time}` : null,
        source: raceClassification2026.dataSource,
      };
    }
    if (fetchedSummary) {
      return {
        podium: fetchedSummary.podium.map((p) => ({
          code: p.code, name: p.name, team: p.team, color: constructorColour(p.constructorId), note: p.note,
        })),
        pole: fetchedSummary.pole ? `${fetchedSummary.pole.code} ${fetchedSummary.pole.time}` : null,
        fastest: fetchedSummary.fastestLap ? `${fetchedSummary.fastestLap.code} ${fetchedSummary.fastestLap.time}` : null,
        source: fetchedSummary.source,
      };
    }
    return null;
  }, [raceClassification2026, qualiClassification2026, fetchedSummary]);

  // Live race in-progress status (race started but winner not yet determined, within 6 hours)
  const isRaceLive = useMemo(() => {
    if (selectedSeason !== '2026' || !selectedRace?.targetDateUtc) return false;
    const now = Date.now();
    const startTime = new Date(selectedRace.targetDateUtc).getTime();
    if (isNaN(startTime)) return false;
    const LIVE_GRACE_MS = 6 * 60 * 60 * 1000; // 6 hours
    return now >= startTime && (now - startTime) < LIVE_GRACE_MS && !selectedRace.winnerNote;
  }, [selectedSeason, selectedRace]);

  // Filtered calendar
  const filteredCalendar = useMemo(() => {
    if (calendarFilter === 'sprint') {
      return activeCalendar.filter((r) => r.isSprint);
    }
    return activeCalendar;
  }, [activeCalendar, calendarFilter]);

  const maxDriverPoints = activeDriverStandings[0]?.points || 1;
  const maxTeamPoints = activeConstructorStandings[0]?.points || 1;

  return (
    <div className="space-y-3 sm:space-y-4 pb-8 animate-fade-in max-w-7xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
      {/* ─────────────────────────────────────────────────────────────
          1. NEXT RACE HERO: CINEMATIC SHOWCASE & COMMAND COCKPIT
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-950 shadow-2xl overflow-hidden">
        
        {/* ── TOP HERO BANNER: 100% UNOBSTRUCTED CINEMATIC PHOTO ── */}
        <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6 group">
          {/* Real Photo Background */}
          {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 ? (
            <div className="absolute inset-0">
              <img 
                src={selectedAtmospherePhotos[0].url} 
                alt={selectedAtmospherePhotos[0].tag} 
                className="w-full h-full object-cover object-[center_42%] brightness-115 contrast-110 saturate-125 transition-transform duration-700 group-hover:scale-105" 
              />
              {/* Soft bottom vignette to keep title readable without obscuring the skyline */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-black/20" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
          )}

          {/* Top Row over Photo: Status Badges & Quick Action Buttons */}
          <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {isRaceLive && (
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-racing font-bold tracking-wider uppercase bg-red-600/90 text-white shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
                  <span>LIVE RACING IN PROGRESS</span>
                </span>
              )}
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-slate-950/80 text-red-400 border border-red-500/50 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                <span>🏁</span>
                <span>{selectedSeason}年 第{selectedRace.round}戦 / 全{activeCalendar.length}戦</span>
              </span>
              {selectedRace.isSprint && (
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-racing font-bold bg-slate-950/80 text-cyan-300 border border-cyan-400/50 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                  <span className="text-cyan-400 animate-pulse">⚡</span>
                  <span className="tracking-wider">SPRINT</span>
                </span>
              )}
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono text-slate-200 bg-slate-950/80 border border-white/20 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                <span>📅</span>
                <span>{selectedRace.dates}</span>
              </span>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIs3dModalOpen(true)}
                className="px-3 py-1 rounded-full bg-slate-950/80 hover:bg-sky-950/80 text-sky-300 hover:text-white border border-sky-400/40 backdrop-blur-md text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                title="コース図・3D標高モデルを起動"
              >
                <Map className="w-3.5 h-3.5 text-sky-400" />
                <span>3Dコース ↗</span>
              </button>
              {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAtmosphereModalImage({
                    url: selectedAtmospherePhotos[0].url,
                    caption: selectedAtmospherePhotos[0].caption,
                    tag: `${toJapaneseGpName(selectedRace.gpName)} - ${selectedAtmospherePhotos[0].tag}`
                  })}
                  className="px-3 py-1 rounded-full bg-slate-950/80 hover:bg-amber-950/80 text-amber-300 hover:text-white border border-amber-400/40 backdrop-blur-md text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  title="サーキット現地フォトギャラリーを開く"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>現地写真 ({selectedAtmospherePhotos.length}枚) ↗</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row over Photo: GP Title & Live Countdown */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  {selectedRace.flag}
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                    {toJapaneseGpName(selectedRace.gpName)}
                  </h1>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-slate-200 tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {getDisplayCircuitName(selectedRace)}
                  </span>
                </div>
              </div>

              {/* Quick Circuit Specs */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-200">
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/15 drop-shadow-md">
                  📍 {selectedRace.city}、{selectedRace.country}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/15 drop-shadow-md">
                  🛣️ {selectedRace.lengthKm.toFixed(3)} km
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/15 drop-shadow-md">
                  🔄 {selectedRace.laps} 周
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/15 drop-shadow-md">
                  🛞 {selectedRace.pirelliCompounds}
                </span>
              </div>
            </div>

            {/* Countdown Badge over Photo */}
            <div className="shrink-0 bg-slate-950/85 backdrop-blur-md border border-white/20 p-3 sm:p-3.5 rounded-xl shadow-2xl">
              {selectedSeason === '2026' ? (
                <RaceCountdownCard
                  targetDateUtc={selectedRace.targetDateUtc}
                  dates={selectedRace.dates}
                  circuitId={selectedCircuitId}
                  country={selectedRace.country}
                  city={selectedRace.city}
                  gpName={selectedRace.gpName}
                  winnerNote={selectedRace.winnerNote}
                />
              ) : (
                <div className="text-xs font-mono text-amber-300">
                  🏆 {selectedSeason}年 公式アーカイブ
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── LOWER SECTION: COCKPIT DOCK (TIMETABLE & TRACK MAP) ── */}
        <div className="p-4 sm:p-5 bg-slate-950/95 border-t border-white/10">
          <div className="flex flex-col lg:flex-row gap-5 items-stretch justify-between">
            {/* Left Column: Official Timetable / Weather Forecast */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Switcher & Timezone indicator */}
              <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-white/10">
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setHeroSubView('schedule')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      heroSubView === 'schedule'
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>⏱️</span>
                    <span>公式タイムテーブル ({selectedRace.scheduleJst.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroSubView('weather')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      heroSubView === 'weather'
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🌤️</span>
                    <span>気象・路面予測 {selectedWeather ? ` (${selectedWeather.airTempC}℃)` : ''}</span>
                  </button>
                </div>

                {heroSubView === 'schedule' ? (
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>JST (生中継観戦用)</span>
                    </span>
                    <span className="text-slate-500">/</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/60 border border-sky-500/20 text-sky-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>現地時間 ({currentTzInfo.tzAbbr})</span>
                    </span>
                  </div>
                ) : selectedWeather ? (
                  <span className="text-[11px] text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded-md border border-white/10">
                    降水確率: <strong className={selectedWeather.rainProb > 30 ? 'text-sky-400' : 'text-slate-200'}>{selectedWeather.rainProb}%</strong>
                  </span>
                ) : null}
              </div>

              {/* View 1: 5 Session Timetable Cards */}
              {heroSubView === 'schedule' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 animate-fadeIn">
                  {selectedRace.scheduleJst.map((s) => {
                    const dual = formatDualSessionTime(s.session, s.dayTime, currentTzInfo);
                    return (
                      <button
                        key={s.session}
                        type="button"
                        onClick={() => {
                          setSelectedSessionForModal(s.session);
                          setSessionModalOpen(true);
                        }}
                        className={`text-left flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] ${
                          dual.isFinalRace
                            ? 'col-span-2 sm:col-span-1 bg-red-950/40 hover:bg-red-950/60 border-red-500/60 hover:border-red-400 shadow-xl ring-1 ring-red-500/40'
                            : 'bg-slate-900/90 hover:bg-slate-850 border-white/10 hover:border-sky-400/50 shadow-md'
                        }`}
                        title={`クリックして${s.session}の結果詳細を表示`}
                      >
                        {/* Session Card Header */}
                        <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-white/[0.08] w-full">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className={`text-xs font-mono font-bold tracking-wider uppercase truncate ${
                                dual.isFinalRace ? 'text-red-400' : 'text-slate-200'
                              }`}
                            >
                              {dual.isFinalRace ? '🏁 決勝' : s.session}
                            </span>
                            {dual.isFinalRace ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-600 text-white font-bold tracking-wider shrink-0 shadow-sm">
                                FINAL
                              </span>
                            ) : s.session.includes('スプリント') ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-gradient-to-r from-violet-900/60 to-cyan-900/60 text-cyan-300 border border-cyan-500/30 font-bold shrink-0">
                                SPRINT
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[9px] text-slate-400 group-hover:text-sky-300 font-mono transition-colors shrink-0">
                            詳細↗
                          </span>
                        </div>

                        {/* Session Card Body */}
                        <div className="pt-1.5 space-y-1">
                          <div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                              <span>日本時間</span>
                            </div>
                            <div className="text-sm font-racing font-bold text-white tracking-wide">
                              <span className="text-xs text-slate-300 font-sans mr-1">{dual.jstDay}</span>
                              <span className={dual.isFinalRace ? 'text-red-300 font-black' : 'text-white'}>
                                {dual.jstTime}
                              </span>
                            </div>
                          </div>

                          <div className="pt-1 border-t border-white/[0.06]">
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400/70" />
                              <span>現地時間</span>
                            </div>
                            <div className="text-xs font-racing text-slate-300">
                              <span className="text-[10px] text-slate-400 font-sans mr-1">{dual.localDay}</span>
                              <span className="text-slate-200">{dual.localTime}</span>
                              <span className="text-[9px] text-sky-400/80 font-mono ml-1 font-bold">
                                {dual.tzAbbr}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* View 2: Circuit Weather Forecast & Track Evolution HUD */}
              {heroSubView === 'weather' && selectedWeather && (
                <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 font-mono">気温 (Air)</div>
                      <div className="text-base sm:text-lg font-racing font-black text-amber-300">{selectedWeather.airTempC} ℃</div>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 font-mono">路面温度 (Track)</div>
                      <div className="text-base sm:text-lg font-racing font-black text-rose-300">{selectedWeather.trackTempC} ℃</div>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 font-mono">降水確率 (Rain)</div>
                      <div className={`text-base sm:text-lg font-racing font-black ${selectedWeather.rainProb > 40 ? 'text-sky-300' : 'text-slate-200'}`}>
                        {selectedWeather.rainProb} %
                      </div>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 font-mono">湿度 (Humidity)</div>
                      <div className="text-xs sm:text-sm font-racing font-bold text-slate-200 mt-1">
                        {selectedWeather.humidity}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 border-t border-white/5 pt-2 flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
                      <span>⛅</span>
                      <span>気象ステータス: {selectedWeather.conditionText}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      風速: {selectedWeather.windSpeedKmh} km/h ({selectedWeather.windDirection})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Track Map Card (Docked cleanly beside timetable) */}
            <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0">
              <HeroTrackMapCard
                circuitId={selectedCircuitId}
                race={selectedRace}
                onOpenAnalysis={() => {
                  setActiveTab('track_analysis');
                  setTimeout(() => {
                    document.getElementById('track-analysis-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                onOpenEncyclopedia={onNavigateToCircuit ? () => onNavigateToCircuit(selectedCircuitId) : undefined}
                onOpen3dModal={() => setIs3dModalOpen(true)}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ── Official Broadcast Partner (FOD) Slot ── */}
      {selectedSeason === '2026' && (
        <AdSlot
          position="season_banner"
          isPro={isPro}
          onUpgradeClick={onOpenUpgradeModal}
        />
      )}

      {/* ── 2. SECTION TABS ─────────────────────────────────────────── */}
      <div className="border-b border-white/10 overflow-x-auto no-scrollbar" role="tablist" aria-label="シーズン情報">
        <div className="flex min-w-max gap-1">
          {([
            ['calendar', `カレンダー（${activeCalendar.length}戦）`],
            ['track_analysis', 'コース解析'],
            ['standings', 'ランキング'],
            ['grid', 'チーム・ドライバー'],
          ] as [MainTab, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              className={`relative px-3 py-3 text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === key ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
              {activeTab === key && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-red-500" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 1. CALENDAR
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <span>各グランプリをクリックすると、上部のカウントダウン＆日本時間予定表が切り替わります。</span>
              {calendarSource === 'api' && (
                <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE DATA
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCalendarFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs ${
                  calendarFilter === 'all'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                全{activeCalendar.length}戦
              </button>
              <button
                onClick={() => setCalendarFilter('sprint')}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  calendarFilter === 'sprint'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>スプリント戦のみ ({activeCalendar.filter(r => r.isSprint).length})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filteredCalendar.map((gp) => {
              const isSelected = gp.round === selectedRound;
              const refTime = jstClock.now?.getTime() ?? Date.now();
              const isGpPast = new Date(gp.targetDateUtc).getTime() <= refTime;
              const isGpInProgress = !gp.isCancelled && isWeekendInProgress(gp.targetDateUtc, refTime);

              return (
                <div
                  key={gp.round}
                  onClick={() => {
                    userHasSelectedRoundRef.current = true;
                    setSelectedRound(gp.round);
                  }}
                  className={`cursor-pointer p-2.5 sm:p-3 rounded-xl border transition-all text-left flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/70 ring-1 ring-red-500/50 shadow-md shadow-red-950/60 scale-[1.01]'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`space-y-1 ${gp.isCancelled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          ROUND {gp.round}
                        </span>
                        {gp.isCancelled ? (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                            中止
                          </span>
                        ) : isGpInProgress ? (
                          <span suppressHydrationWarning className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                            進行中 (今夜決勝)
                          </span>
                        ) : isGpPast ? (
                          <span suppressHydrationWarning className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-400 border border-white/10">
                            終了
                          </span>
                        ) : (
                          <span suppressHydrationWarning className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            予定
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {gp.isSprint && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-white/10 text-white border border-white/20 tracking-wider">
                            <span>SPRINT</span>
                          </span>
                        )}
                        <span className="text-sm sm:text-base">{gp.flag}</span>
                      </div>
                    </div>

                    <div>
                      <h3
                        className={`font-bold text-xs sm:text-sm leading-tight transition-colors truncate ${
                          gp.isCancelled ? 'line-through text-slate-500' :
                          isSelected ? 'text-red-300' : 'text-white group-hover:text-red-300'
                        }`}
                      >
                        {toJapaneseGpName(gp.gpName)}
                      </h3>
                      <p className="text-[11px] sm:text-[11px] text-slate-400 font-mono truncate mt-0.5">
                        {getDisplayCircuitName(gp)}
                      </p>
                      {gp.replacementNote && (
                        <p className="text-[11px] text-amber-400 mt-0.5 truncate">{gp.replacementNote}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{gp.dates.replace(/^202[0-9]年\s*/, '')}</span>
                    <div className="flex items-center gap-1.5">
                      {onNavigateToCircuit && !gp.isCancelled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToCircuit(getCircuitIdForRace(gp));
                          }}
                          className="px-1.5 py-0.5 rounded bg-slate-900/60 hover:bg-slate-800 border border-slate-400/30 text-slate-200 hover:text-white text-[11px] transition-colors cursor-pointer"
                          title={`${getDisplayCircuitName(gp)} の大百科コース解剖を開く`}
                        >
                          解剖
                        </button>
                      )}
                      <span className={`text-[11px] font-racing ${isSelected ? 'text-red-400 font-bold' : 'text-slate-600 group-hover:text-slate-400'}`}>
                        {isSelected ? '● 選択中' : '選択 ➔'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 1.5 TRACK & TACTICAL ANALYSIS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'track_analysis' && (
        <div id="track-analysis-section" className="space-y-4 animate-fade-in scroll-mt-6">
          <button
            type="button"
            onClick={() => setIs3dModalOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <span>
              <span className="block text-sm font-semibold text-white">3Dコースガイド</span>
              <span className="block text-xs text-slate-400">標高・コーナー・オーバーテイクゾーンを立体表示</span>
            </span>
            <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
          </button>

      {/* Result: this season's official result if available; otherwise the previous edition
          AT THIS CIRCUIT (circuit-matched report only — never a round-number fallback). */}
          {summaryStatus === 'loading' && !raceResultView && (
            <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-500">公式結果を取得中…</p>
          )}
          {summaryStatus === 'error' && !raceResultView && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">公式結果をまだ取得できません（反映まで数時間かかる場合があります）</p>
              <button
                type="button"
                onClick={() => setSummaryRetry((n) => n + 1)}
                className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                再試行
              </button>
            </div>
          )}
          {(raceResultView || selectedReport) && (
            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-white">
                  {raceResultView ? `${selectedSeason}年 決勝結果` : '前回大会の結果（2024年・同サーキット）'}
                </h3>
                <ol className="mt-3 divide-y divide-white/5">
                  {(raceResultView
                    ? raceResultView.podium
                    : selectedReport!.result2024.podium.map((p) => ({
                        code: p.code, name: p.name, team: p.team, color: p.teamColor, note: `P${p.grid}スタート`,
                      }))
                  ).map((p, idx) => (
                    <li key={p.code} className="flex items-center gap-3 py-2.5">
                      <span className="w-5 text-sm text-slate-400 tabular-nums">{idx + 1}</span>
                      <span className="h-4 w-1 rounded-full shrink-0" style={{ backgroundColor: p.color }} aria-hidden="true" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-white truncate">{p.name}</span>
                        <span className="block text-[11px] text-slate-500 truncate">{p.team}</span>
                      </span>
                      <span className="text-xs text-slate-400 tabular-nums">{p.note}</span>
                    </li>
                  ))}
                </ol>
                <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-white/5 pt-3 text-xs">
                  <div>
                    <dt className="text-slate-500">ポールポジション</dt>
                    <dd className="mt-0.5 text-slate-200 tabular-nums">
                      {raceResultView
                        ? raceResultView.pole ?? '—'
                        : `${selectedReport!.result2024.polePosition.code} ${selectedReport!.result2024.polePosition.time}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">ファステストラップ</dt>
                    <dd className="mt-0.5 text-slate-200 tabular-nums">
                      {raceResultView
                        ? raceResultView.fastest ?? '—'
                        : `${selectedReport!.result2024.fastestLap.code} ${selectedReport!.result2024.fastestLap.time}`}
                    </dd>
                  </div>
                </dl>
                {raceResultView && (
                  <p className="mt-3 text-[11px] text-slate-600">出典: {raceResultView.source}</p>
                )}
              </section>

              {selectedReport && (
                <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <h3 className="text-sm font-semibold text-white">
                    戦略のポイント<span className="ml-2 text-[11px] font-normal text-slate-500">2024年大会</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{selectedReport.result2024.winningStrategy}</p>
                  {selectedReport.result2024.strategicTurningPoint && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{selectedReport.result2024.strategicTurningPoint}</p>
                  )}
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-3 text-xs">
                    <div>
                      <dt className="text-slate-500">レースラップ記録</dt>
                      <dd className="mt-0.5 text-slate-200 tabular-nums">
                        {selectedReport.circuitRecords.raceLapRecord.time}（{selectedReport.circuitRecords.raceLapRecord.driver}）
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">最多勝</dt>
                      <dd className="mt-0.5 text-slate-200">{selectedReport.circuitRecords.mostWinsDriver}</dd>
                    </div>
                  </dl>
                </section>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 2. STANDINGS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>
                    {standingsYear === '2026'
                      ? '2026シーズン 第14戦マドリード終了時点 公式ランキング (全23戦中14戦終了 / 第15戦バクー進行中)'
                      : `${standingsYear}シーズン 年間確定選手権ランキング (全${getSeasonCalendar(standingsYear).length}戦終了 / ${standingsArchive?.championConstructor?.name || ''} WCC)`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {standingsYear === '2026'
                    ? '新PU規定元年。全11チーム・22名体制による2026年公式選手権ランキング（第14戦終了時点）。メルセデスのキミ・アントネッリが292ptで首位。'
                    : standingsArchive?.seasonSummary || `${standingsYear}年公式年間アーカイブ`}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 font-mono text-[11px] self-start sm:self-auto shadow-sm">
                <span>{standingsYear === '2026' ? '2026 公式WDC ＆ WCC ランキング (第14戦終了時点)' : `${standingsYear}年確定 WDC ＆ WCC アーカイブ`}</span>
              </div>
            </div>

            {/* Quick Season Year Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <span>年度切替:</span>
              </span>
              {SEASON_OPTIONS.map((opt) => {
                const isSelected = standingsYear === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStandingsYear(opt.value)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-lg shadow-red-950/60 ring-1 ring-red-400'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{opt.value === '2026' ? '' : ''}</span>
                    <span>{opt.value}年</span>
                    {opt.value === '2026' ? (
                      <span className="text-[11px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
                        現行
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-sans">
                        確定
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Past Season Champion Banner (When viewing 2025, 2024, etc.) */}
          {standingsYear !== '2026' && standingsArchive && (
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                  
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 tracking-wider">
                      {standingsYear}年 ワールドチャンピオン (WDC &amp; WCC)
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      全{standingsArchive.racesCount}戦 確定
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    ドライバー王者: <span className="text-amber-400">{standingsArchive.championDriver?.name || 'M.フェルスタッペン'}</span> ({standingsArchive.championDriver?.team || 'Red Bull'} / {standingsArchive.championDriver?.points || 0}pt)
                    <span className="text-slate-500 mx-2">|</span>
                    製造者王者: <span className="text-slate-200">{standingsArchive.championConstructor?.name || 'Red Bull'}</span> ({standingsArchive.championConstructor?.points || 0}pt)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── DUAL PARALLEL DASHBOARD (WDC 7 cols + WCC 5 cols) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start animate-fade-in">
              {/* Left Column (7 cols): Drivers' Championship Table */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-bold text-xs text-white tracking-wider flex items-center gap-1.5">
                    <span>ドライバーズ選手権 ({standingsYear}年 / 全{displayedDriverStandings.length}名)</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">P1-P10 入賞圏</span>
                </div>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/70 shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs table-auto">
                      <thead className="bg-slate-950/90 text-slate-400 font-racing uppercase text-[11px] border-b border-white/10">
                        <tr>
                          <th className="py-2 px-2 text-center w-10">順位</th>
                          <th className="py-2 px-2">選手名</th>
                          <th className="py-2 px-2">所属チーム</th>
                          <th className="py-2 px-1.5 text-center w-10">勝</th>
                          <th className="py-2 px-1.5 text-center w-10">登壇</th>
                          <th className="py-2 px-2.5 text-right w-24">ポイント</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {displayedDriverStandings.map((d) => {
                          const percentage = (d.points / maxDisplayedDriverPoints) * 100;
                          return (
                            <tr
                              key={d.position}
                              className={`hover:bg-white/[0.04] transition-colors group ${
                                d.position === 10 ? 'border-b-2 border-b-slate-400/30' : ''
                              }`}
                            >
                              <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-300">
                                {d.position === 1 ? (
                                  <span className="text-amber-400 text-xs font-black">1</span>
                                ) : d.position <= 3 ? (
                                  <span className="text-white font-bold">{d.position}</span>
                                ) : (
                                  <span className="text-slate-400">{d.position}</span>
                                )}
                              </td>
                              <td className="py-1.5 px-2 font-semibold text-white group-hover:text-red-300 transition-colors">
                                {onNavigateToDriver ? (
                                  <button
                                    type="button"
                                    onClick={() => onNavigateToDriver(d.driverCode)}
                                    className="flex items-center gap-1.5 min-w-0 text-left hover:text-slate-200 hover:underline cursor-pointer transition-colors"
                                    title={`${d.driverName} の大百科詳細を開く`}
                                  >
                                    <span className="font-mono text-slate-400 text-[11px] shrink-0">[{d.driverCode}]</span>
                                    <span className="truncate max-w-[140px] sm:max-w-[180px]">{d.driverName}</span>
                                    <span className="text-[11px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-mono text-slate-400 text-[11px] shrink-0">[{d.driverCode}]</span>
                                    <span className="truncate max-w-[140px] sm:max-w-[180px]">{d.driverName}</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-1.5 px-2 text-slate-300">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span
                                    className="w-2 h-2 rounded-full inline-block shrink-0"
                                    style={{ backgroundColor: d.teamColor }}
                                  />
                                  <span className="truncate max-w-[110px] sm:max-w-[150px] text-[11px] text-slate-300">{d.team}</span>
                                </div>
                              </td>
                              <td className="py-1.5 px-1.5 text-center font-mono text-slate-300 text-[11px]">
                                {d.wins > 0 ? (
                                  <span className="text-amber-300 font-bold">{d.wins}</span>
                                ) : (
                                  <span className="text-slate-600">-</span>
                                )}
                              </td>
                              <td className="py-1.5 px-1.5 text-center font-mono text-slate-300 text-[11px]">
                                {d.podiums > 0 ? (
                                  <span className="text-slate-200">{d.podiums}</span>
                                ) : (
                                  <span className="text-slate-600">-</span>
                                )}
                              </td>
                              <td className="py-1.5 px-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${percentage}%`,
                                        backgroundColor: d.teamColor,
                                      }}
                                    />
                                  </div>
                                  <span className="font-mono font-bold text-white text-xs text-right whitespace-nowrap">
                                    {d.points} <span className="text-[11px] text-slate-400">pt</span>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Constructors' Standings Table + Title Fight Card */}
              <div className="lg:col-span-5 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-bold text-xs text-white tracking-wider flex items-center gap-1.5">
                      <span>コンストラクターズ ({standingsYear}年 / 全{displayedConstructorStandings.length}組)</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/70 shadow-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs table-auto">
                        <thead className="bg-slate-950/90 text-slate-400 font-racing uppercase text-[11px] border-b border-white/10">
                          <tr>
                            <th className="py-2 px-2 text-center w-10">順位</th>
                            <th className="py-2 px-2">チーム名</th>
                            <th className="py-2 px-2">PU</th>
                            <th className="py-2 px-1.5 text-center w-10">勝</th>
                            <th className="py-2 px-2.5 text-right w-24">獲得点</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {displayedConstructorStandings.map((team) => {
                            const percentage = (team.points / maxDisplayedTeamPoints) * 100;
                            return (
                              <tr
                                key={team.position}
                                className="hover:bg-white/[0.04] transition-colors group"
                              >
                                <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-300">
                                  {team.position === 1 ? (
                                    <span className="text-amber-400 text-xs font-black">1</span>
                                  ) : (
                                    team.position
                                  )}
                                </td>
                                <td className="py-1.5 px-2 font-semibold text-white group-hover:text-red-300 transition-colors">
                                  {onNavigateToTeam ? (
                                    <button
                                      type="button"
                                      onClick={() => onNavigateToTeam(getTeamIdFromName(team.teamName))}
                                      className="flex items-center gap-1.5 min-w-0 text-left hover:text-slate-200 hover:underline cursor-pointer transition-colors"
                                      title={`${team.teamName} の大百科詳細を開く`}
                                    >
                                      <span
                                        className="w-2 h-2 rounded-sm shrink-0 shadow-sm"
                                        style={{ backgroundColor: team.teamColor }}
                                      />
                                      <span className="truncate max-w-[130px] sm:max-w-[160px]">{team.teamName}</span>
                                      <span className="text-[11px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span
                                        className="w-2 h-2 rounded-sm shrink-0 shadow-sm"
                                        style={{ backgroundColor: team.teamColor }}
                                      />
                                      <span className="truncate max-w-[130px] sm:max-w-[160px]">{team.teamName}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="py-1.5 px-2 font-mono text-slate-400 text-[11px] truncate max-w-[90px]">
                                  {team.powerUnit}
                                </td>
                                <td className="py-1.5 px-1.5 text-center font-mono text-slate-300 text-[11px]">
                                  {team.wins > 0 ? (
                                    <span className="text-amber-300 font-bold">{team.wins}</span>
                                  ) : (
                                    <span className="text-slate-600">-</span>
                                  )}
                                </td>
                                <td className="py-1.5 px-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${percentage}%`,
                                          backgroundColor: team.teamColor,
                                        }}
                                      />
                                    </div>
                                    <span className="font-mono font-bold text-white text-xs text-right whitespace-nowrap">
                                      {team.points} <span className="text-[11px] text-slate-400">pt</span>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Title Fight Intelligence & Gap Analysis Card */}
                <div className="glass-card-premium p-3 sm:p-3.5 rounded-xl border border-amber-500/20 shadow-md space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-racing font-bold text-xs text-white uppercase tracking-wider">
                        TITLE FIGHT INTELLIGENCE / 王座争い分析
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {standingsYear === '2026' ? '2026 第14戦終了時点' : `${standingsYear}年確定結果`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[11px] text-slate-400 block font-sans">
                        {standingsYear === '2026' ? 'WDC リードマージン' : `${standingsYear} WDC 王者`}
                      </span>
                      <div className="font-bold text-white text-xs truncate">
                        {displayedDriverStandings[0]?.driverName.split(' ')[0]}
                      </div>
                      <div className="text-emerald-400 text-[11px] font-bold">
                        +{displayedDriverStandings[0]?.points - (displayedDriverStandings[1]?.points || 0)} pt <span className="text-[11px] text-slate-400 font-normal">{standingsYear === '2026' ? 'リード' : '差で戴冠'}</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[11px] text-slate-400 block font-sans">
                        {standingsYear === '2026' ? 'WCC リードマージン' : `${standingsYear} WCC 王者`}
                      </span>
                      <div className="font-bold text-white text-xs truncate">
                        {displayedConstructorStandings[0]?.teamName.split(' ')[0]}
                      </div>
                      <div className="text-emerald-400 text-[11px] font-bold">
                        +{displayedConstructorStandings[0]?.points - (displayedConstructorStandings[1]?.points || 0)} pt <span className="text-[11px] text-slate-400 font-normal">{standingsYear === '2026' ? 'リード' : '差で戴冠'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-white/5 leading-relaxed">
                    {standingsYear === '2026' ? (
                      <>
                        <strong className="text-slate-200">2026シーズン戦況分析 (第14戦マドリード終了時点):</strong> 14戦を終えてメルセデスの新星キミ・アントネッリが8勝を挙げて選手権首位（292pt）。チームメイトのラッセル（211pt・2勝）、フェラーリのハミルトン（191pt・1勝）、マクラーレンのノリス（186pt・2勝）が追走。今夜開催の第15戦バクー決勝が後半戦の天王山となります。
                      </>
                    ) : (
                      <>
                        <strong className="text-amber-300">{standingsYear}年シーズン総括:</strong>{' '}
                        {standingsArchive?.seasonSummary ||
                          `${standingsYear}年シーズンの年間王者は ${displayedDriverStandings[0]?.driverName}（${displayedDriverStandings[0]?.team} / ${displayedDriverStandings[0]?.points}pt）。コンストラクターズ選手権は ${displayedConstructorStandings[0]?.teamName}（${displayedConstructorStandings[0]?.points}pt）が制覇しました。`}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 3. GRID SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 leading-relaxed">
            {selectedSeason === '2026' ? (
              <span>
                <strong className="text-white">2026年 新レギュレーション参戦布陣:</strong> ドイツの名門<strong className="text-red-400">アウディ</strong>とアメリカの巨頭<strong className="text-amber-400">キャデラック（第11チーム）</strong>のF1正式参戦、<strong className="text-emerald-400">アストンマーティン×ホンダ完全ワークス</strong>体制始動、そして<strong className="text-slate-300">レッドブル×フォード新PU</strong>の夜明け！全11チーム・22台が織りなす新時代。
              </span>
            ) : (
              <span>
                <strong className="text-white">{selectedSeason}年 参戦体制アーカイブ:</strong> {getHistoricalArchive(selectedSeason)?.seasonSummary || `${selectedSeason}年の各チームおよびドライバー布陣。`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {activeGrid.map((team) => (
              <div
                key={team.teamName}
                className="p-3 rounded-xl border border-white/10 bg-slate-900/60 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 border-b border-white/10 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: team.teamColor }}
                      />
                      <h3 className="font-racing font-bold text-sm sm:text-base text-white">{team.teamName}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/5 truncate max-w-[140px]">
                      {team.fullName}
                    </span>
                  </div>

                  {/* Team Principal & PU specs pill */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2 text-[11px] font-mono">
                    <span className="bg-slate-950/80 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                      代表: <strong className="text-slate-100">{team.teamPrincipal}</strong>
                    </span>
                    <span className="bg-slate-950/80 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                      PU: <strong className="text-slate-200">{team.powerUnit}</strong>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {team.drivers.map((driver) => (
                      <div
                        key={driver.number}
                        className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-xs text-slate-400 w-6 text-center">
                            #{driver.number}
                          </span>
                          <span className="text-base">{driver.flag}</span>
                          <div>
                            <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                              <span>{driver.name}</span>
                              <span className="text-[11px] font-mono text-slate-400">
                                ({driver.code})
                              </span>
                            </div>
                            {driver.note && (
                              <div className="text-[11px] text-amber-300/90 mt-0.5 font-medium">
                                {driver.note}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {driver.isTransfer && (
                            <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              NEW TEAM
                            </span>
                          )}
                          {driver.isRookie && (
                            <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ROOKIE
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Results & Timing Classification Modal with Spoiler Shield */}
      <SessionResultsModal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        race={selectedRace}
        circuitId={selectedCircuitId}
        initialSessionName={selectedSessionForModal}
        seasonYear={selectedSeason}
        onNavigateToTelemetry={onNavigateToTelemetry}
        onNavigateToDriver={onNavigateToDriver}
      />

      {/* 3D Track Elevation & Tactical Guide Modal */}
      {is3dModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIs3dModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-slate-950 border border-slate-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-900/90">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl sm:text-3xl shrink-0 drop-shadow-md">{selectedRace.flag}</span>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-lg font-racing font-bold text-white flex items-center gap-2 truncate">
                    <span>{toJapaneseGpName(selectedRace.gpName)} : 3D標高＆戦術ガイド</span>
                    <span className="text-xs font-mono text-slate-300 font-normal truncate hidden sm:inline">({selectedRace.circuitName})</span>
                  </h2>
                  <p className="text-[11px] sm:text-xs font-mono text-slate-400 truncate">
                    マウスドラッグ / タッチで360度3D回転・標高ウォール・2026年OVR（オーバーライド）区間を完全再現
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIs3dModalOpen(false);
                    setActiveTab('track_analysis');
                    setTimeout(() => {
                      document.getElementById('track-analysis-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-slate-400/20 text-xs font-mono text-slate-200 hover:text-slate-200 border border-white/10 transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
                  title="ページ下の詳細解析タブへ移動"
                >
                  <span>詳細解析へ </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIs3dModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                  title="閉じる"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: F1BroadcastTrackGuide */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
              <F1BroadcastTrackGuide
                circuitId={selectedCircuitId}
                gpName={selectedRace.gpName}
                round={selectedRace.round}
              />
            </div>
          </div>
        </div>
      )}

      {/* Circuit Atmosphere Photo Fullscreen Lightbox Modal */}
      {atmosphereModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setAtmosphereModalImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/80">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-racing font-bold text-sm sm:text-base text-white truncate">
                  {atmosphereModalImage.tag}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAtmosphereModalImage(null)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                ✕ 閉じる
              </button>
            </div>
            <div className="relative w-full max-h-[70vh] bg-black flex items-center justify-center overflow-hidden p-2">
              <img
                src={atmosphereModalImage.url}
                alt={atmosphereModalImage.tag}
                className="w-full max-h-[68vh] object-contain rounded-xl"
              />
            </div>
            <div className="p-4 bg-slate-950/95 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {atmosphereModalImage.caption}
              </p>
              <button
                type="button"
                onClick={() => setAtmosphereModalImage(null)}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-racing font-bold text-xs shrink-0 transition-colors shadow-md self-end sm:self-auto"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
