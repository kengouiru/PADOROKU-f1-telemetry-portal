'use client';

import React, { useState } from 'react';
import {
  Award,
  Trophy,
  SlidersHorizontal,
  Zap,
  Flag,
  ShieldAlert,
  Compass,
  CheckCircle2,
  RotateCcw,
  CloudRain,
  Sun,
  CloudDrizzle,
  Waves,
  Gauge,
  MapPin,
  ChevronRight,
  Shield,
  Timer,
  Car,
  Radio,
  Camera,
  Sparkles,
  Layers,
  Volume2,
} from 'lucide-react';
import type { SavedCareerData } from '@/lib/raceDebriefAnalysis';
import {
  SIM_CIRCUITS,
  GRID_DRIVERS,
  PRESET_CHALLENGES,
  MISSION_CHALLENGES,
  type WeatherType,
  type IncidentFrequency,
  type ChallengeScenario,
} from '@/lib/raceSimulationEngine';
import { CIRCUIT_TRACK_MAPS } from '@/components/telemetry/TelemetryTrackMap';
import { HISTORIC_LEGENDARY_CARS, CAR_PACKAGES_2026 } from '@/data/carPerformanceData';
import type { GameMajorCategory, ChallengeModeType } from '../types';

export interface ModeSelectScreenProps {
  careerData: SavedCareerData;
  majorCategory: GameMajorCategory;
  setMajorCategory: (cat: GameMajorCategory) => void;
  gameMode: ChallengeModeType;
  setGameMode: (mode: ChallengeModeType) => void;
  presetIdx: number;
  selectedMissionIdx: number;
  customScenario: ChallengeScenario | null;
  setCustomScenario: (sc: ChallengeScenario | null) => void;
  selectedCircuitId: string;
  setSelectedCircuitId: (id: string) => void;
  selectedPlayerCode: string;
  setSelectedPlayerCode: (code: string) => void;
  sandboxLaps: number;
  setSandboxLaps: (laps: number) => void;
  sandboxWeather: WeatherType;
  setSandboxWeather: (w: WeatherType) => void;
  sandboxRainLap: number;
  setSandboxRainLap: (lap: number) => void;
  sandboxIncidentFreq: IncidentFrequency;
  setSandboxIncidentFreq: (freq: IncidentFrequency) => void;
  startPresetCrisis: (idx: number) => void;
  startSprintRace: (circuitId: string, playerCode: string) => void;
  startMission: (idx: number) => void;
  startProceduralCrisis: () => void;
  selectedCarPackageId?: string;
  setSelectedCarPackageId?: (pkg: string) => void;
  startSandboxMode: (overrides?: {
    circuitId?: string;
    playerCode?: string;
    totalLaps?: number;
    weatherType?: WeatherType;
    rainStartLap?: number;
    incidentFrequency?: IncidentFrequency;
    carPackageId?: string;
  }) => void;
  onOpenCareerModal: () => void;
}

// ── Authentic Circuit Scenery Photography Dictionary ──────────────────────────
export const CIRCUIT_HERO_IMAGES: Record<string, string> = {
  suzuka: '/images/circuits/circuit_suzuka_real.jpg',
  monza: '/images/circuits/circuit_monza_real.jpg',
  silverstone: '/images/circuits/circuit_silverstone_real.jpg',
  spa: '/images/circuits/circuit_spa_real.jpg',
  monaco: '/images/circuits/circuit_monaco_real.jpg',
  singapore: '/images/circuits/circuit_singapore_real.jpg',
  madrid: '/images/circuits/circuit_madrid.jpg',
  madring: '/images/circuits/circuit_madrid.jpg',
  melbourne: '/images/circuits/circuit_albert_park_real.jpg',
  'albert-park': '/images/circuits/circuit_albert_park_real.jpg',
  bahrain: '/images/circuits/circuit_bahrain_real.jpg',
  jeddah: '/images/circuits/circuit_jeddah_real.jpg',
  miami: '/images/circuits/circuit_miami_real.jpg',
  imola: '/images/circuits/circuit_imola_real.jpg',
  montreal: '/images/circuits/circuit_villeneuve_real.jpg',
  villeneuve: '/images/circuits/circuit_villeneuve_real.jpg',
  barcelona: '/images/circuits/circuit_catalunya.jpg',
  catalunya: '/images/circuits/circuit_catalunya.jpg',
  spielberg: '/images/circuits/circuit_redbull_ring_real.jpg',
  'redbull-ring': '/images/circuits/circuit_redbull_ring_real.jpg',
  hungaroring: '/images/circuits/circuit_hungaroring.jpg',
  zandvoort: '/images/circuits/circuit_zandvoort.jpg',
  baku: '/images/circuits/circuit_baku_real.jpg',
  austin: '/images/circuits/circuit_cota_real.jpg',
  cota: '/images/circuits/circuit_cota_real.jpg',
  mexico: '/images/circuits/circuit_mexico_real.jpg',
  interlagos: '/images/circuits/circuit_interlagos_real.jpg',
  las_vegas: '/images/circuits/circuit_las_vegas_real.jpg',
  'las-vegas': '/images/circuits/circuit_las_vegas_real.jpg',
  losail: '/images/circuits/circuit_losail_real.jpg',
  yas_marina: '/images/circuits/circuit_yas_marina_real.jpg',
  'yas-marina': '/images/circuits/circuit_yas_marina_real.jpg',
  shanghai: '/images/circuits/circuit_shanghai_real.jpg',
};

// ── Circuit Landmarks & Atmosphere Intel ─────────────────────────────────────
export const CIRCUIT_LANDMARKS: Record<string, { landmark: string; desc: string }> = {
  suzuka: { landmark: '立体交差 & スプーンカーブ', desc: '世界唯一の8の字立体交差と超高速連続S字' },
  monza: { landmark: '高速神殿 & パラボリカ', desc: '最高速360km/hに迫るティフォシの熱狂' },
  silverstone: { landmark: 'マゴッツ・ベケッツ', desc: '超高速複合コーナーと変わりやすい英気候' },
  spa: { landmark: 'オー・ルージュ & ラディオン', desc: 'アルデンヌの深い森と名物スパ・ウェザー' },
  monaco: { landmark: 'モナコ港湾 & カジノ前', desc: '世界一狭隘なガードレール公道チェス' },
  singapore: { landmark: 'マリーナベイ熱帯夜景', desc: '湿度80%の過酷なナイトセッション' },
  madrid: { landmark: 'IFEMA ハイブリッド公道', desc: '10度傾斜バンクと直角市街地セクション' },
  melbourne: { landmark: 'アルバート・パーク湖畔', desc: '湖畔を周回する高速セミストリート' },
  bahrain: { landmark: 'サヒール砂漠ナイトコース', desc: '高粗度アスファルトと強烈なブレーキング' },
  jeddah: { landmark: '紅海コーニッシュ超高速公道', desc: '平均速度250km/h超の超危険市街地' },
  miami: { landmark: 'ハードロック・スタジアム', desc: '超ロングストレートとテクニカルシケイン' },
  imola: { landmark: 'エンツォ・エ・ディーノ', desc: '高低差と縁石アタックのクラシック' },
  montreal: { landmark: 'チャンピオンの壁', desc: '過酷なブレーキングとタイトなシケイン' },
  barcelona: { landmark: 'カタロニア名物ターン3', desc: 'ダウンフォースの真価が試される高速複合' },
  spielberg: { landmark: 'シュタイアーマルク山麓', desc: '高低差65mの超短距離ジェットコースター' },
  hungaroring: { landmark: 'ハンガロリンクすり鉢', desc: '壁なきモナコと呼ばれるテクニカル' },
  zandvoort: { landmark: '北海デューン＆バンク', desc: '傾斜19度の超絶バンクコーナー' },
  baku: { landmark: '旧市街城壁 & 2.2km直線', desc: '世界最長ストレートと狭小城壁セクション' },
  austin: { landmark: 'COTA 激坂ターン1', desc: '高低差40mの登り坂ブラインドターン' },
  mexico: { landmark: '標高2200m ロドリゲス', desc: '薄い空気と野球場スタジアムセクション' },
  interlagos: { landmark: 'サンパウロ・エス・ド・セナ', desc: '反時計回りの高低差と突発スコール' },
  las_vegas: { landmark: 'ラスベガス・ストリップ', desc: 'ネオン街を350km/hで駆け抜ける夜' },
  losail: { landmark: 'ルサイル高速コーナー群', desc: '過酷な横Gとタイヤデグラの砂漠コース' },
  yas_marina: { landmark: 'ヤス・ホテル＆マリーナ', desc: 'トワイライトからナイトへの最終決戦' },
  shanghai: { landmark: '巨大カタツムリターン1', desc: '超ロング半径の複合旋回と1.2km直線' },
};

// ── Scenario Radio Transmission Intel & Driver Avatar ─────────────────────────
export const SCENARIO_RADIO_INTEL: Record<
  string,
  { quote: string; speaker: string; avatar: string; teamColor: string; driverNumber: string }
> = {
  silverstone_drying_gamble: {
    quote: '「インターのゴムがオーバーヒートで千切れそうだ！スリックはまだ早いのか？！」',
    speaker: 'George Russell (Mercedes)',
    avatar: '/images/drivers/driver_russell.jpg',
    teamColor: '#22c55e',
    driverNumber: '63',
  },
  suzuka_rain_gamble: {
    quote: '「バイザーに雨粒が当たってる！西コースはすでに濡れ始めてるぞ！」',
    speaker: 'Yuki Tsunoda (Red Bull)',
    avatar: '/images/drivers/driver_tsunoda.jpg',
    teamColor: '#1d4ed8',
    driverNumber: '22',
  },
  monza_undercut_ambush: {
    quote: '「超接近戦でフロントタイヤが125℃を超えている！クリーンエアへ脱出させろ！」',
    speaker: 'Lando Norris (McLaren)',
    avatar: '/images/drivers/driver_norris.jpg',
    teamColor: '#f97316',
    driverNumber: '4',
  },
  spa_sc_double_stack: {
    quote: '「SC出動！2台同時にピットへ入れると4.5秒の待機ロスが発生するぞ！」',
    speaker: 'Charles Leclerc (Ferrari)',
    avatar: '/images/drivers/driver_leclerc.jpg',
    teamColor: '#ef4444',
    driverNumber: '16',
  },
  monaco_overcut_chess: {
    quote: '「前がピットに入った！今こそタイヤの全グリップを絞り出してオーバーカットしろ！」',
    speaker: 'Charles Leclerc (Ferrari)',
    avatar: '/images/drivers/driver_leclerc.jpg',
    teamColor: '#ef4444',
    driverNumber: '16',
  },
  singapore_chaos_sc: {
    quote: '「周囲はステイアウトだが、我々は新品ソフトで勝負に出る！」',
    speaker: 'Fernando Alonso (Aston Martin)',
    avatar: '/images/drivers/driver_alonso.jpg',
    teamColor: '#00594f',
    driverNumber: '14',
  },
  suzuka_double_stack_dilemma: {
    quote: '「Box Box！2台同時に入れるのか？！同一周回だと後続に飲まれるぞ！」',
    speaker: 'Yuki Tsunoda (Red Bull)',
    avatar: '/images/drivers/driver_tsunoda.jpg',
    teamColor: '#1d4ed8',
    driverNumber: '22',
  },
  spa_weather_chaos_kemmel: {
    quote: '「前が全く見えない！アクアプレーニングでコントロール不能だ！」',
    speaker: 'Lando Norris (McLaren)',
    avatar: '/images/drivers/driver_norris.jpg',
    teamColor: '#f97316',
    driverNumber: '4',
  },
  madrid_inaugural_duel: {
    quote: '「VSC出動！熱ダレするタイヤをチープピットで救うか、バンクで仕留めるか？！」',
    speaker: 'Yuki Tsunoda (Red Bull)',
    avatar: '/images/drivers/driver_tsunoda.jpg',
    teamColor: '#1d4ed8',
    driverNumber: '22',
  },
  cadillac_p22_miracle: {
    quote: '「最後尾P22から執念のロングスティント。初参戦初ポイントを奪い取れ！」',
    speaker: 'Sergio Perez (Cadillac F1)',
    avatar: '/images/drivers/driver_perez.jpg',
    teamColor: '#eab308',
    driverNumber: '11',
  },
  no_pit_gamble_monza: {
    quote: '「もうグリップが残っていない、どうする？！タイヤ無交換で逃げ切るぞ！」',
    speaker: 'Charles Leclerc (Ferrari)',
    avatar: '/images/drivers/driver_leclerc.jpg',
    teamColor: '#ef4444',
    driverNumber: '16',
  },
  papaya_rules_1_2: {
    quote: '「パパヤ・ルール（同士討ち厳禁・チーム最優先）。冷徹なチームオーダーで1-2を完遂せよ！」',
    speaker: 'Lando Norris & Oscar Piastri (McLaren)',
    avatar: '/images/drivers/driver_norris.jpg',
    teamColor: '#f97316',
    driverNumber: '4',
  },
  slick_on_damp_madness: {
    quote: '「全車がインターの中、我々だけがソフトスリック。野獣を手懐けて毎周3秒削れ！」',
    speaker: 'Max Verstappen (Red Bull)',
    avatar: '/images/drivers/driver_verstappen.jpg',
    teamColor: '#1d4ed8',
    driverNumber: '1',
  },
};

// ── Driver Portraits Mapping for Grid Drivers ─────────────────────────────────
export const DRIVER_PORTRAITS: Record<string, string> = {
  TSU: '/images/drivers/driver_tsunoda.jpg',
  VER: '/images/drivers/driver_verstappen.jpg',
  NOR: '/images/drivers/driver_norris.jpg',
  PIA: '/images/drivers/driver_piastri.jpg',
  LEC: '/images/drivers/driver_leclerc.jpg',
  HAM: '/images/drivers/driver_hamilton.jpg',
  RUS: '/images/drivers/driver_russell.jpg',
  ALO: '/images/drivers/driver_alonso.jpg',
  PER: '/images/drivers/driver_perez.jpg',
  BOT: '/images/drivers/driver_bottas.jpg',
  GAS: '/images/drivers/driver_gasly.jpg',
  ALB: '/images/drivers/driver_albon.jpg',
  HUL: '/images/drivers/driver_hulkenberg.jpg',
  OCO: '/images/drivers/driver_ocon.jpg',
  STR: '/images/drivers/driver_stroll.jpg',
  MAG: '/images/drivers/driver_magnussen.jpg',
  ZHO: '/images/drivers/driver_zhou.jpg',
  COL: '/images/drivers/driver_colapinto.jpg',
  RIC: '/images/drivers/driver_ricciardo.jpg',
  SAI: '/images/drivers/driver_sainz.jpg',
};

// ── Historic Legendary Car Photo Assets ──────────────────────────────────────
export const HISTORIC_CAR_IMAGES: Record<string, string> = {
  mclaren_mp4_4: '/images/teams/team_mclaren_mp4_4.jpg',
  ferrari_f2004: '/images/teams/team_ferrari_f2004.jpg',
  williams_fw14b: '/images/teams/team_williams_fw14b.jpg',
  mercedes_w11: '/images/teams/team_mercedes_w11.jpg',
  redbull_rb19: '/images/teams/team_redbull_rb19.jpg',
};

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  careerData,
  majorCategory,
  setMajorCategory,
  gameMode,
  setGameMode,
  presetIdx,
  selectedMissionIdx,
  customScenario,
  setCustomScenario,
  selectedCircuitId,
  setSelectedCircuitId,
  selectedPlayerCode,
  setSelectedPlayerCode,
  sandboxLaps,
  setSandboxLaps,
  sandboxWeather,
  setSandboxWeather,
  sandboxRainLap,
  setSandboxRainLap,
  sandboxIncidentFreq,
  setSandboxIncidentFreq,
  startPresetCrisis,
  startSprintRace,
  startMission,
  startProceduralCrisis,
  selectedCarPackageId = 'standard',
  setSelectedCarPackageId,
  startSandboxMode,
  onOpenCareerModal,
}) => {
  // Local preview state for live tactical preview deck (GT7 / F1 24 style split layout)
  const [previewPresetIdx, setPreviewPresetIdx] = useState<number>(presetIdx >= 0 ? presetIdx : 0);
  const [previewMissionIdx, setPreviewMissionIdx] = useState<number>(
    selectedMissionIdx >= 0 ? selectedMissionIdx : 0
  );
  // View mode for the tactical hero canvas: hybrid (photo + SVG), photo (pure landscape), map (2D GPS vector)
  const [trackViewMode, setTrackViewMode] = useState<'hybrid' | 'photo' | 'map'>('hybrid');

  // Active scenario data for live preview
  const currentPreset = PRESET_CHALLENGES[previewPresetIdx] || PRESET_CHALLENGES[0];
  const currentMission = MISSION_CHALLENGES[previewMissionIdx] || MISSION_CHALLENGES[0];

  // Helper to fetch vector track SVG data
  const getTrackSvg = (circuitId: string) => {
    return CIRCUIT_TRACK_MAPS[circuitId] || CIRCUIT_TRACK_MAPS['suzuka'];
  };

  // Weather badge helper
  const getWeatherBadge = (weather?: WeatherType, rainMm?: number) => {
    switch (weather) {
      case 'monsoon':
        return {
          icon: <Waves className="w-3.5 h-3.5 text-blue-400" />,
          label: `豪雨モンスーン (${rainMm ?? 4.5}mm)`,
          bg: 'bg-blue-950/70 border-blue-500/40 text-blue-300',
        };
      case 'drizzle':
        return {
          icon: <CloudDrizzle className="w-3.5 h-3.5 text-cyan-400" />,
          label: `雨上がりダンプ (${rainMm ?? 1.5}mm)`,
          bg: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
        };
      case 'variable':
        return {
          icon: <CloudRain className="w-3.5 h-3.5 text-sky-400" />,
          label: `降雨急変警戒 (${rainMm ?? 2.5}mm)`,
          bg: 'bg-sky-950/70 border-sky-500/40 text-sky-300',
        };
      case 'dry':
      default:
        return {
          icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
          label: '快晴ドライ',
          bg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
        };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* ════════════════════════════════════════════════════════════════════════
          1. 🏛️ FIA STRATEGIST CAREER BAR (洗練されたパドックステータス)
          ════════════════════════════════════════════════════════════════════════ */}
      <div className="glass-card-premium p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-950 via-[#0B0F17] to-slate-900 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-xl shadow-lg shadow-amber-950/50 border border-amber-400/50 shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold tracking-wider uppercase">
                  FIA STRATEGIST LICENSE
                </span>
                <span className="px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-racing font-black text-[11px] shadow-sm">
                  GRADE {careerData.grade}
                </span>
              </div>
              <h2 className="font-racing font-black text-white text-base sm:text-lg tracking-wide flex items-center gap-2">
                <span>F1 ピットウォール司令塔シミュレーター</span>
              </h2>
            </div>
          </div>

          {/* Quick Metrics & Hall of Fame Button */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-center min-w-[65px]">
              <div className="text-[9px] font-mono text-slate-400">累計CP</div>
              <div className="font-racing font-bold text-amber-400 text-xs sm:text-sm">
                {careerData.totalCp.toLocaleString()}
              </div>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-amber-500/30 text-center min-w-[70px]">
              <div className="text-[9px] font-mono text-amber-400">トロフィー</div>
              <div className="font-racing font-bold text-amber-300 text-xs sm:text-sm flex items-center justify-center gap-0.5">
                <span>🏆</span>
                <span>{Object.keys(careerData.clearedScenarios || {}).length}</span>
              </div>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-center min-w-[65px]">
              <div className="text-[9px] font-mono text-slate-400">通算勝率</div>
              <div className="font-racing font-bold text-white text-xs sm:text-sm">
                {careerData.totalWins}勝 / {careerData.totalRacesCompleted}戦
              </div>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-center min-w-[65px]">
              <div className="text-[9px] font-mono text-slate-400">最高得点</div>
              <div className="font-racing font-bold text-emerald-400 text-xs sm:text-sm">
                {careerData.highestScore}点
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCareerModal}
              className="px-3 py-1.5 rounded-lg text-xs font-racing font-bold text-amber-300 bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/50 flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:border-amber-400"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>🏛️ パドック殿堂 ➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          2. 🧭 MAJOR MODE SELECTOR (実践シナリオ vs 自由練習)
          ════════════════════════════════════════════════════════════════════════ */}
      <div className="glass-card-premium p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4 bg-slate-950/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
              SELECT GAME MODE / ゲームモード選択
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              本番の戦術シナリオに挑むか、自由練習で戦略物理を検証するかを選択してください。
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMajorCategory('battle');
                if (gameMode === 'sandbox') setGameMode('crisis');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                majorCategory === 'battle'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-950 ring-1 ring-sky-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>⚔️ 実践シナリオチャレンジ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMajorCategory('practice');
                setGameMode('sandbox');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                majorCategory === 'practice'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-950 ring-1 ring-teal-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-300" />
              <span>🔬 自由練習 (Sandbox Lab)</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            3. 🚀 SPLIT COMMAND DECK LAYOUT (スプリット・コマンドデッキ)
            ════════════════════════════════════════════════════════════════════════ */}
        {majorCategory === 'battle' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* ─────────────────────────────────────────────────────────────
                LEFT COLUMN (lg:col-span-5): Sub-tabs & Scenario Select List
                ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-5 space-y-3">
              {/* Sub-mode Tab Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setGameMode('crisis');
                    setCustomScenario(null);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-racing font-bold transition-all cursor-pointer ${
                    gameMode === 'crisis' || gameMode === 'scenario'
                      ? 'bg-sky-950 border border-sky-400 text-sky-200 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>名場面 (5-9周)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameMode('sprint')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-racing font-bold transition-all cursor-pointer ${
                    gameMode === 'sprint'
                      ? 'bg-amber-950 border border-amber-400 text-amber-200 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5 text-yellow-400" />
                  <span>スプリント</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameMode('mission')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-racing font-bold transition-all cursor-pointer ${
                    gameMode === 'mission'
                      ? 'bg-purple-950 border border-purple-400 text-purple-200 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                  <span>特務指令</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameMode('procedural')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-racing font-bold transition-all cursor-pointer ${
                    gameMode === 'procedural'
                      ? 'bg-rose-950 border border-rose-400 text-rose-200 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-rose-400" />
                  <span>突発危機</span>
                </button>
              </div>

              {/* VIEW 1: PRESET SCENARIOS LIST */}
              {(gameMode === 'crisis' || gameMode === 'scenario') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-racing text-slate-400 font-bold uppercase tracking-wider">
                      SCENARIO ARCHIVE / 名場面一覧
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      全{PRESET_CHALLENGES.length}戦 収録
                    </span>
                  </div>

                  <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {PRESET_CHALLENGES.map((sc, idx) => {
                      const isSelected = previewPresetIdx === idx;
                      const clearRecord = careerData.clearedScenarios?.[sc.id];
                      const driverAvatar = DRIVER_PORTRAITS[sc.playerConfig.code] || '/images/drivers/driver_tsunoda.jpg';
                      const landmarkInfo = CIRCUIT_LANDMARKS[sc.circuit.id];
                      return (
                        <div
                          key={sc.id}
                          onClick={() => setPreviewPresetIdx(idx)}
                          className={`p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col gap-1.5 cursor-pointer group ${
                            isSelected
                              ? 'bg-gradient-to-r from-sky-950/70 via-slate-900/90 to-slate-900 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.18)] ring-1 ring-sky-400/50'
                              : 'bg-slate-900/70 border-white/10 hover:border-sky-500/40 hover:bg-slate-850/80'
                          }`}
                        >
                          {/* Active Neon Bar indicator */}
                          {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                          )}

                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                              <span className="text-sm">{sc.circuit.flag}</span>
                              <span className="font-bold text-white group-hover:text-sky-300 transition-colors">
                                {sc.circuit.name.split(' ')[0]}
                              </span>
                              {landmarkInfo && (
                                <span className="text-[10px] text-slate-400 hidden sm:inline">
                                  ({landmarkInfo.landmark.split('&')[0].trim()})
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-1">
                              {clearRecord && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-racing font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  {clearRecord.trophy === 'gold' ? '🏆 GOLD' : clearRecord.trophy === 'silver' ? '🥈 SILVER' : '🥉 BRONZE'}
                                </span>
                              )}
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold ${
                                  sc.difficulty === 'hard'
                                    ? 'bg-red-950 text-red-300 border border-red-500/40'
                                    : sc.difficulty === 'normal'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                }`}
                              >
                                {sc.difficulty}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full overflow-hidden border shrink-0 bg-slate-800"
                              style={{ borderColor: sc.playerConfig.color || '#38bdf8' }}
                            >
                              <img
                                src={driverAvatar}
                                alt={sc.playerConfig.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-racing font-bold text-xs sm:text-sm text-slate-100 line-clamp-1 group-hover:text-sky-200">
                                {sc.title}
                              </h4>
                              <span className="text-[10px] font-mono text-slate-400 block truncate">
                                #{sc.playerConfig.number} {sc.playerConfig.name} ({sc.playerConfig.team})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5">
                            <span className="text-amber-400 font-bold">目標: P{sc.targetPosition}以内</span>
                            <span>全{sc.totalLaps}周</span>
                            <span className="text-sky-400 text-[10px] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                              <span>詳細プレビュー</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VIEW 2: SPRINT RACE SELECTION */}
              {gameMode === 'sprint' && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-amber-400" />
                    <div>
                      <h4 className="font-racing font-bold text-white text-xs sm:text-sm">
                        スプリント全周回レース設定
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        15〜20周の本格周回。タイヤ無交換または奇襲ピットで勝利せよ。
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-white/10 space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 block">開催サーキット</label>
                      <select
                        value={selectedCircuitId}
                        onChange={(e) => setSelectedCircuitId(e.target.value)}
                        className="w-full bg-transparent text-white font-racing font-bold text-xs p-1 rounded border border-white/10 cursor-pointer focus:outline-none"
                      >
                        {SIM_CIRCUITS.map((c) => (
                          <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                            {c.flag} {c.name} ({c.country})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-white/10 space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 block">担当自車ドライバー</label>
                      <select
                        value={selectedPlayerCode}
                        onChange={(e) => setSelectedPlayerCode(e.target.value)}
                        className="w-full bg-transparent text-white font-racing font-bold text-xs p-1 rounded border border-white/10 cursor-pointer focus:outline-none"
                      >
                        {GRID_DRIVERS.map((d) => (
                          <option key={d.code} value={d.code} className="bg-slate-900 text-white">
                            #{d.number} {d.name} ({d.team})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: SPECIAL MISSIONS LIST */}
              {gameMode === 'mission' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-racing text-purple-300 font-bold uppercase tracking-wider">
                      GRAND MISSIONS / 特務指令
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      全{MISSION_CHALLENGES.length}ミッション
                    </span>
                  </div>

                  <div className="space-y-2">
                    {MISSION_CHALLENGES.map((m, idx) => {
                      const isSelected = previewMissionIdx === idx;
                      const clearRecord = careerData.clearedScenarios?.[m.id];
                      const driverAvatar = DRIVER_PORTRAITS[m.playerConfig.code] || '/images/drivers/driver_norris.jpg';
                      return (
                        <div
                          key={m.id}
                          onClick={() => setPreviewMissionIdx(idx)}
                          className={`p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col gap-1.5 cursor-pointer group ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-slate-900 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] ring-1 ring-purple-400/50'
                              : 'bg-slate-900/70 border-white/10 hover:border-purple-500/40 hover:bg-slate-855'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                          )}

                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1">
                              <span>#{m.playerConfig.number} {m.playerConfig.code}</span>
                              <span className="text-slate-400">({m.circuit.name.split(' ')[0]})</span>
                            </span>
                            <div className="flex items-center gap-1">
                              {clearRecord && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-racing font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  🏆 制覇済
                                </span>
                              )}
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                                {m.difficulty}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full overflow-hidden border shrink-0 bg-slate-800"
                              style={{ borderColor: m.playerConfig.color || '#c084fc' }}
                            >
                              <img
                                src={driverAvatar}
                                alt={m.playerConfig.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-racing font-bold text-xs sm:text-sm text-slate-100 line-clamp-1 group-hover:text-purple-200">
                                {m.title}
                              </h4>
                              <span className="text-[10px] font-mono text-slate-400 block truncate">
                                #{m.playerConfig.number} {m.playerConfig.name} ({m.playerConfig.team})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5">
                            <span className="text-purple-300 font-bold">目標: P{m.targetPosition}以内</span>
                            <span>全{m.totalLaps}周</span>
                            <span className="text-purple-400 text-[10px] flex items-center gap-0.5">
                              <span>詳細プレビュー</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VIEW 4: PROCEDURAL CRISIS */}
              {gameMode === 'procedural' && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-rose-400" />
                    <div>
                      <h4 className="font-racing font-bold text-white text-xs sm:text-sm">
                        突発クライシス (一期一会のランダム危機)
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        サーキット、天候急変、セーフティカー出動がすべてランダムに生成される無限のシナリオです。
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-white/10 text-xs font-mono space-y-1 text-slate-300">
                    <div className="text-rose-300 font-bold">🎲 PRNG シード自動乱数システム</div>
                    <div className="text-[11px] text-slate-400">
                      毎回異なる路面水量、タイヤ摩耗度、SC周回が決定されます。
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─────────────────────────────────────────────────────────────
                RIGHT COLUMN (lg:col-span-7): Live Tactical Preview Deck (右側大型プレビュー)
                ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-7 sticky top-4 space-y-3.5 bg-gradient-to-br from-slate-950 via-[#0B0F17] to-slate-900 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl">
              {/* Context Selector: Determine active preview target */}
              {(() => {
                const isSprint = gameMode === 'sprint';
                const isMission = gameMode === 'mission';
                const isProcedural = gameMode === 'procedural';

                const targetCircuit = isSprint
                  ? SIM_CIRCUITS.find((c) => c.id === selectedCircuitId) || SIM_CIRCUITS[2]
                  : isMission
                  ? currentMission.circuit
                  : currentPreset.circuit;

                const targetTitle = isSprint
                  ? `🏆 ${targetCircuit.name} スプリント決勝 (全${targetCircuit.sprintLaps}周)`
                  : isMission
                  ? currentMission.title
                  : isProcedural
                  ? '🎲 突発クライシス・ランダム危機脱出'
                  : currentPreset.title;

                const targetDesc = isSprint
                  ? `${targetCircuit.name}のフルグリッド22台とのリアルタイム戦略戦。タイヤマネジメントとオーバーカットの攻防が勝敗を分ける。`
                  : isMission
                  ? currentMission.description
                  : isProcedural
                  ? '未知の気象レーダー、突如発生するイエローフラッグとSC出動。瞬時の判断力で入賞圏内へマシンを導け。'
                  : currentPreset.description;

                const targetLaps = isSprint
                  ? targetCircuit.sprintLaps
                  : isMission
                  ? currentMission.totalLaps
                  : isProcedural
                  ? 8
                  : currentPreset.totalLaps;

                const targetGoal = isSprint ? 3 : isMission ? currentMission.targetPosition : currentPreset.targetPosition;
                const weatherInfo = getWeatherBadge(
                  isSprint ? 'variable' : isMission ? currentMission.startWeather : currentPreset.startWeather,
                  isSprint ? 1.0 : isMission ? currentMission.actualRainIntensity : currentPreset.actualRainIntensity
                );

                const trackData = getTrackSvg(targetCircuit.id);
                const circuitHeroImg = CIRCUIT_HERO_IMAGES[targetCircuit.id] || '/images/circuits/circuit_suzuka_real.jpg';
                const landmarkInfo = CIRCUIT_LANDMARKS[targetCircuit.id] || {
                  landmark: targetCircuit.name,
                  desc: `${targetCircuit.city}, ${targetCircuit.country}`,
                };

                const scenarioKey = isSprint ? 'sprint' : isMission ? currentMission.id : isProcedural ? 'procedural' : currentPreset.id;
                const radioIntel = SCENARIO_RADIO_INTEL[scenarioKey] || {
                  quote: isSprint
                    ? '「スプリント全周回決戦。スタート直後から攻めのポジションアップを狙え！」'
                    : '「ピットウォールより指示。刻々と変わるタイヤグリップと間隔を見極めよ！」',
                  speaker: isSprint
                    ? (GRID_DRIVERS.find((d) => d.code === selectedPlayerCode)?.name || 'ドライバー')
                    : 'チームピット司令塔',
                  avatar: DRIVER_PORTRAITS[isSprint ? selectedPlayerCode : 'TSU'] || '/images/drivers/driver_tsunoda.jpg',
                  teamColor: '#38bdf8',
                  driverNumber: isSprint
                    ? (GRID_DRIVERS.find((d) => d.code === selectedPlayerCode)?.number || '0')
                    : '22',
                };

                const playerCode = isSprint
                  ? selectedPlayerCode
                  : isMission
                  ? currentMission.playerConfig.code
                  : isProcedural
                  ? 'TSU'
                  : currentPreset.playerConfig.code;
                const driverAvatar = DRIVER_PORTRAITS[playerCode] || radioIntel.avatar;
                const driverNum = isSprint
                  ? (GRID_DRIVERS.find((d) => d.code === selectedPlayerCode)?.number || '22')
                  : isMission
                  ? currentMission.playerConfig.number
                  : isProcedural
                  ? '22'
                  : currentPreset.playerConfig.number;
                const driverName = isSprint
                  ? (GRID_DRIVERS.find((d) => d.code === selectedPlayerCode)?.name || 'Player Driver')
                  : isMission
                  ? currentMission.playerConfig.name
                  : isProcedural
                  ? '角田 裕毅'
                  : currentPreset.playerConfig.name;
                const teamName = isSprint
                  ? (GRID_DRIVERS.find((d) => d.code === selectedPlayerCode)?.team || 'Constructor')
                  : isMission
                  ? currentMission.playerConfig.team
                  : isProcedural
                  ? 'Red Bull Racing'
                  : currentPreset.playerConfig.team;
                const teamColor = isSprint
                  ? (GRID_DRIVERS.find((d) => d.code === selectedPlayerCode)?.color || '#38bdf8')
                  : isMission
                  ? (currentMission.playerConfig.color || '#a855f7')
                  : isProcedural
                  ? '#f43f5e'
                  : (currentPreset.playerConfig.color || '#38bdf8');

                return (
                  <div className="space-y-3.5">
                    {/* Header: Track Identity & Direct Briefing Action */}
                    <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/10">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xl shrink-0">{targetCircuit.flag}</span>
                          <h3 className="font-racing font-black text-white text-base sm:text-lg tracking-wide truncate">
                            {targetCircuit.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block truncate">
                          {targetCircuit.city}, {targetCircuit.country}
                        </span>
                      </div>

                      {/* ═════════════════════════════════════════════════════════
                          PRIMARY ACTION BUTTON: INLINE HEADER POSITION
                          (距離やPIT Lossの代わりにヘッダー右端に配置)
                          ═════════════════════════════════════════════════════════ */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isSprint) {
                            startSprintRace(selectedCircuitId, selectedPlayerCode);
                          } else if (isMission) {
                            startMission(previewMissionIdx);
                          } else if (isProcedural) {
                            startProceduralCrisis();
                          } else {
                            startPresetCrisis(previewPresetIdx);
                          }
                        }}
                        className="shrink-0 py-2 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-racing font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-red-950/60 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-red-400/40"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 shrink-0" />
                        <span className="whitespace-nowrap">作戦ブリーフィングへ進む ➔</span>
                      </button>
                    </div>

                    {/* ═════════════════════════════════════════════════════════
                        SCENARIO DRAMA & DRIVER SPOTLIGHT CARD
                        (このシナリオを表す写真・ドライバーコックピット＆無線交信)
                        ═════════════════════════════════════════════════════════ */}
                    <div className="rounded-xl bg-slate-900/85 border border-white/10 p-3.5 space-y-2.5 shadow-lg relative overflow-hidden">
                      {/* Ambient background glow using team color */}
                      <div
                        className="absolute -right-10 -top-10 w-36 h-36 rounded-full opacity-15 blur-3xl pointer-events-none"
                        style={{ backgroundColor: teamColor }}
                      />

                      {/* Top Row: Driver Avatar & Tactical Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {/* Driver Photo Avatar */}
                          <div
                            className="w-11 h-11 rounded-full overflow-hidden border-2 shadow-md shrink-0 relative bg-slate-800"
                            style={{ borderColor: teamColor }}
                          >
                            <img
                              src={driverAvatar}
                              alt={driverName}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div
                              className="absolute bottom-0 inset-x-0 text-[8px] font-racing font-black text-center text-white py-0.2"
                              style={{ backgroundColor: teamColor }}
                            >
                              #{driverNum}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-slate-400">{teamName}</span>
                              <span
                                className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold"
                                style={{ backgroundColor: `${teamColor}25`, color: teamColor }}
                              >
                                #{driverNum} {playerCode}
                              </span>
                            </div>
                            <h4 className="font-racing font-bold text-white text-xs sm:text-sm">
                              {driverName} 司令コックピット
                            </h4>
                          </div>
                        </div>

                        {/* Scenario Drama Tag */}
                        <div className="shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-950/80 text-sky-300 border border-sky-400/40">
                            {isSprint ? '🏁 全周回戦略戦' : isMission ? currentMission.tag : isProcedural ? '🎲 乱数波乱' : currentPreset.tag}
                          </span>
                        </div>
                      </div>

                      {/* Team Radio Dispatch Transcript Box */}
                      <div className="p-2.5 rounded-xl bg-slate-950/90 border border-sky-500/20 shadow-inner flex items-start gap-2.5">
                        <div className="mt-0.5 p-1 rounded-md bg-sky-500/20 text-sky-400 shrink-0">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-sky-400 font-bold tracking-wider uppercase flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              LIVE PIT RADIO DISPATCH
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 truncate">
                              {radioIntel.speaker}
                            </span>
                          </div>
                          <p className="text-xs text-white font-medium italic leading-relaxed">
                            {radioIntel.quote}
                          </p>
                        </div>
                      </div>

                      {/* Scenario Narrative Description */}
                      <p className="text-xs text-slate-300 leading-relaxed font-sans pt-0.5">
                        {targetDesc}
                      </p>
                    </div>

                    {/* Tactical Telemetry Summary Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 block">作戦目標</span>
                        <span className="font-bold text-amber-300 font-racing text-sm sm:text-base flex items-center gap-1">
                          <span>🏆</span>
                          <span>P{targetGoal} 以内</span>
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 block">総周回数</span>
                        <span className="font-bold text-white font-racing text-sm sm:text-base">
                          {targetLaps} Laps
                        </span>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${weatherInfo.bg} flex flex-col justify-between`}>
                        <span className="text-[9px] text-slate-400 block">予報天候</span>
                        <div className="flex items-center gap-1.5 font-bold text-xs truncate">
                          {weatherInfo.icon}
                          <span className="truncate">{weatherInfo.label}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 block">タイヤ攻撃度</span>
                        <span className="font-bold text-rose-400 font-racing text-xs sm:text-sm">
                          {targetCircuit.tyreAggression >= 1.4 ? '極大 (BRUTAL)' : targetCircuit.tyreAggression >= 1.2 ? '高 (HIGH)' : '中 (MODERATE)'}
                        </span>
                      </div>
                    </div>

                    {/* ═════════════════════════════════════════════════════════
                        CINEMATIC CIRCUIT HERO CANVAS WITH ATMOSPHERIC SCENERY
                        (高精細サーキット景観写真 + ネオンコース図オーバーレイ: 一番下に配置)
                        ═════════════════════════════════════════════════════════ */}
                    <div className="w-full h-52 sm:h-64 rounded-xl bg-black/80 border border-white/15 relative overflow-hidden flex items-center justify-center p-2 group shadow-xl">
                      {/* Authentic Circuit Scenery Photography */}
                      <img
                        src={circuitHeroImg}
                        alt={targetCircuit.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                          trackViewMode === 'map'
                            ? 'opacity-15 filter grayscale blur-[2px]'
                            : 'opacity-90 group-hover:scale-105'
                        }`}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />

                      {/* Cinematic Lighting Vignette / Gradient Overlay */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          trackViewMode === 'photo'
                            ? 'bg-gradient-to-t from-[#0B0F17] via-transparent to-black/40'
                            : 'bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/55 to-black/50'
                        }`}
                      />

                      {/* Technical Grid Overlay */}
                      {trackViewMode !== 'photo' && (
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf810_1px,transparent_1px),linear-gradient(to_bottom,#38bdf810_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                      )}

                      {/* View Mode Switcher Pill (Floating Top-Left) */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 p-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[10px] font-mono z-10 shadow-lg">
                        <button
                          type="button"
                          onClick={() => setTrackViewMode('hybrid')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                            trackViewMode === 'hybrid'
                              ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>重畳</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrackViewMode('photo')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                            trackViewMode === 'photo'
                              ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Camera className="w-3 h-3" />
                          <span>景観</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrackViewMode('map')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                            trackViewMode === 'map'
                              ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>GPS図</span>
                        </button>
                      </div>

                      {/* Real-time Atmospheric Forecast Pill (Floating Top-Right) */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-200 z-10 shadow-lg">
                        {weatherInfo.icon}
                        <span className="font-bold">{weatherInfo.label}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-amber-300 font-bold">
                          路面 {isSprint ? '38℃' : isMission ? '42℃' : '44℃'}
                        </span>
                      </div>

                      {/* Live Neon SVG Track Path (Shown in Hybrid or Map mode) */}
                      {trackViewMode !== 'photo' && (
                        <svg
                          viewBox="0 0 400 300"
                          className="w-full h-full max-h-full transition-transform duration-500 group-hover:scale-105 z-5 relative"
                        >
                          <defs>
                            <filter id="previewGlow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="4" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Base Dark Outline */}
                          <path
                            d={trackData.svgPath}
                            fill="none"
                            stroke="#0f172a"
                            strokeWidth="9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={0.8}
                          />

                          {/* Neon Active Track Path */}
                          <path
                            d={trackData.svgPath}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#previewGlow)"
                          />

                          {/* Start/Finish Line Indicator */}
                          {trackData.startFinish && (
                            <g transform={`translate(${trackData.startFinish.x}, ${trackData.startFinish.y})`}>
                              <circle r="5" fill="#f59e0b" className="animate-ping opacity-75" />
                              <circle r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                              <text
                                x="8"
                                y="3"
                                fill="#f59e0b"
                                fontSize="9"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                S/F
                              </text>
                            </g>
                          )}
                        </svg>
                      )}

                      {/* Floating Landmark Tag (Bottom-Left) */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-200 z-10 max-w-[85%] truncate shadow-lg">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="text-sky-300 font-bold">{landmarkInfo.landmark}</span>
                        <span className="text-slate-400 truncate hidden sm:inline">— {landmarkInfo.desc}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          /* ════════════════════════════════════════════════════════════════════
             4. 🔬 SANDBOX / PRACTICE SPLIT COMMAND DECK
             ════════════════════════════════════════════════════════════════════ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left: Sandbox Parameters Setup */}
            <div className="lg:col-span-5 space-y-3 p-4 rounded-xl bg-slate-900/90 border border-teal-500/30">
              <div className="flex items-center gap-2 pb-2 border-b border-teal-500/20">
                <span className="text-base">🧪</span>
                <div>
                  <h4 className="font-racing font-bold text-white text-xs sm:text-sm">
                    自由練習パラメータ設定 (Sandbox Config)
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    サーキット、天候、周回数、マシンパッケージを自在に設定。
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Circuit Selector */}
                <div className="p-2 rounded-lg bg-slate-950 border border-white/10 space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block">開催サーキット</label>
                  <select
                    value={selectedCircuitId}
                    onChange={(e) => {
                      setSelectedCircuitId(e.target.value);
                      startSandboxMode({ circuitId: e.target.value });
                    }}
                    className="w-full bg-transparent text-white font-racing font-bold text-xs p-1 rounded focus:outline-none cursor-pointer"
                  >
                    {SIM_CIRCUITS.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver Selector */}
                <div className="p-2 rounded-lg bg-slate-950 border border-white/10 space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block">自車ドライバー</label>
                  <select
                    value={selectedPlayerCode}
                    onChange={(e) => {
                      setSelectedPlayerCode(e.target.value);
                      startSandboxMode({ playerCode: e.target.value });
                    }}
                    className="w-full bg-transparent text-white font-racing font-bold text-xs p-1 rounded focus:outline-none cursor-pointer"
                  >
                    {GRID_DRIVERS.map((d) => (
                      <option key={d.code} value={d.code} className="bg-slate-900 text-white">
                        #{d.number} {d.name} ({d.team})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Machine Package Selector */}
                <div className="p-2 rounded-lg bg-slate-950 border border-amber-500/30 space-y-1">
                  <label className="text-[10px] font-mono text-amber-300 font-bold block flex items-center gap-1">
                    <span>🏎️</span>
                    <span>搭乗マシンパッケージ</span>
                  </label>
                  <select
                    value={selectedCarPackageId || 'standard'}
                    onChange={(e) => {
                      setSelectedCarPackageId?.(e.target.value);
                      startSandboxMode({ carPackageId: e.target.value });
                    }}
                    className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="standard" className="bg-slate-900 text-white">
                      🏎️ 2026年 ワークスマシン規定車
                    </option>
                    <option value="mclaren_mp4_4" className="bg-slate-900 text-amber-300">
                      🏆【伝説】McLaren-Honda MP4/4 (1988)
                    </option>
                    <option value="ferrari_f2004" className="bg-slate-900 text-red-400">
                      🏆【伝説】Ferrari F2004 (2004)
                    </option>
                    <option value="williams_fw14b" className="bg-slate-900 text-blue-400">
                      🏆【伝説】Williams-Renault FW14B (1992)
                    </option>
                    <option value="mercedes_w11" className="bg-slate-900 text-teal-400">
                      🏆【伝説】Mercedes-AMG W11 EQ (2020)
                    </option>
                    <option value="redbull_rb19" className="bg-slate-900 text-blue-300">
                      🏆【伝説】Red Bull Racing RB19 (2023)
                    </option>
                  </select>
                </div>

                {/* Laps & Weather Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-950 border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">周回数</label>
                    <select
                      value={sandboxLaps}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSandboxLaps(val);
                        startSandboxMode({ totalLaps: val });
                      }}
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer"
                    >
                      {[5, 8, 10, 15, 20].map((l) => (
                        <option key={l} value={l} className="bg-slate-900 text-white">
                          全{l}周
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">天候</label>
                    <select
                      value={sandboxWeather}
                      onChange={(e) => {
                        const val = e.target.value as WeatherType;
                        setSandboxWeather(val);
                        startSandboxMode({ weatherType: val });
                      }}
                      className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="dry" className="bg-slate-900 text-white">☀️ 快晴ドライ</option>
                      <option value="variable" className="bg-slate-900 text-white">⛅ 急変警戒</option>
                      <option value="drizzle" className="bg-slate-900 text-white">🌤️ 雨上がり</option>
                      <option value="monsoon" className="bg-slate-900 text-white">🌊 豪雨</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sandbox Preview & Launch */}
            <div className="lg:col-span-7 sticky top-4 space-y-3.5 bg-gradient-to-br from-slate-950 via-[#0B0F17] to-slate-900 border border-teal-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl">
              {(() => {
                const targetCircuit =
                  SIM_CIRCUITS.find((c) => c.id === selectedCircuitId) || SIM_CIRCUITS[2];
                const trackData = getTrackSvg(targetCircuit.id);
                const circuitHeroImg = CIRCUIT_HERO_IMAGES[targetCircuit.id] || '/images/circuits/circuit_suzuka_real.jpg';
                const landmarkInfo = CIRCUIT_LANDMARKS[targetCircuit.id] || {
                  landmark: targetCircuit.name,
                  desc: `${targetCircuit.city}, ${targetCircuit.country}`,
                };
                const legendCar =
                  selectedCarPackageId && selectedCarPackageId !== 'standard'
                    ? HISTORIC_LEGENDARY_CARS[selectedCarPackageId]
                    : null;
                const carImage = legendCar
                  ? HISTORIC_CAR_IMAGES[selectedCarPackageId] || '/images/f1_garage_briefing.jpg'
                  : '/images/f1_garage_briefing.jpg';

                return (
                  <div className="space-y-3.5">
                    {/* Header: Track Identity & Direct Sandbox Launch */}
                    <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xl shrink-0">{targetCircuit.flag}</span>
                          <div>
                            <h3 className="font-racing font-black text-white text-base sm:text-lg truncate">
                              {targetCircuit.name}
                            </h3>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              {targetCircuit.city}, {targetCircuit.country}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Launch Button: Header Right Position */}
                      <button
                        type="button"
                        onClick={() => startSandboxMode()}
                        className="shrink-0 py-2 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 hover:from-teal-500 hover:to-emerald-500 text-white font-racing font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-teal-950/60 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-teal-400/40"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-teal-200 shrink-0" />
                        <span className="whitespace-nowrap">自由作戦室へ進む ➔</span>
                      </button>
                    </div>

                    {/* Machine Performance & Aesthetic Card */}
                    <div className="rounded-xl bg-slate-900/80 border border-teal-500/20 p-3.5 space-y-2.5 shadow-lg relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Car Image Thumbnail */}
                        <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-slate-950 relative">
                          <img
                            src={carImage}
                            alt={legendCar ? legendCar.name : 'Works F1 2026'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {legendCar && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded text-[8px] font-racing font-bold bg-amber-500 text-slate-950 shadow-sm">
                              HISTORIC
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-racing font-bold text-white text-xs sm:text-sm truncate">
                              {legendCar ? `🏆 ${legendCar.name}` : '🏎️ 2026年 ワークスマシン規定車'}
                            </span>
                            {legendCar && (
                              <span className="px-2 py-0.5 rounded font-racing font-black text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                                総合 {legendCar.overallRating}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                            {legendCar ? legendCar.description : '全チーム均等空力＆新ICE/MGU-Kパワーユニット規格。物理エンジンが純粋な戦略とセットアップの差を再現します。'}
                          </p>
                        </div>
                      </div>

                      {/* 5-Axis Specs Bars if Historic Car */}
                      {legendCar && (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-2 border-t border-white/10 text-[9px] font-mono">
                          <div className="p-1 rounded bg-slate-950/80 border border-white/5 text-center">
                            <span className="text-slate-400 block">直線速度</span>
                            <span className="text-amber-400 font-bold">{legendCar.stats.topSpeed}</span>
                          </div>
                          <div className="p-1 rounded bg-slate-950/80 border border-white/5 text-center">
                            <span className="text-slate-400 block">高速空力</span>
                            <span className="text-amber-400 font-bold">{legendCar.stats.highSpeedAero}</span>
                          </div>
                          <div className="p-1 rounded bg-slate-950/80 border border-white/5 text-center">
                            <span className="text-slate-400 block">旋回性</span>
                            <span className="text-amber-400 font-bold">{legendCar.stats.lowSpeedGrip}</span>
                          </div>
                          <div className="p-1 rounded bg-slate-950/80 border border-white/5 text-center">
                            <span className="text-slate-400 block">タイヤ保護</span>
                            <span className="text-amber-400 font-bold">{legendCar.stats.tyrePreservation}</span>
                          </div>
                          <div className="p-1 rounded bg-slate-950/80 border border-white/5 text-center col-span-2 sm:col-span-1">
                            <span className="text-slate-400 block">ダーティエア耐性</span>
                            <span className="text-amber-400 font-bold">{legendCar.stats.dirtyAirTolerance}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Circuit Hero Canvas with Scenery Photography & View Mode Switcher (一番下に配置) */}
                    <div className="w-full h-48 sm:h-56 rounded-xl bg-black/80 border border-teal-500/30 relative overflow-hidden flex items-center justify-center p-2 group shadow-xl">
                      {/* Authentic Circuit Scenery Photography */}
                      <img
                        src={circuitHeroImg}
                        alt={targetCircuit.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                          trackViewMode === 'map'
                            ? 'opacity-15 filter grayscale blur-[2px]'
                            : 'opacity-90 group-hover:scale-105'
                        }`}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          trackViewMode === 'photo'
                            ? 'bg-gradient-to-t from-[#0B0F17] via-transparent to-black/40'
                            : 'bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/55 to-black/50'
                        }`}
                      />

                      {/* Technical Grid Overlay */}
                      {trackViewMode !== 'photo' && (
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a610_1px,transparent_1px),linear-gradient(to_bottom,#14b8a610_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                      )}

                      {/* View Mode Switcher Pill */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 p-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[10px] font-mono z-10 shadow-lg">
                        <button
                          type="button"
                          onClick={() => setTrackViewMode('hybrid')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                            trackViewMode === 'hybrid'
                              ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>重畳</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrackViewMode('photo')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                            trackViewMode === 'photo'
                              ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Camera className="w-3 h-3" />
                          <span>景観</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrackViewMode('map')}
                          className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                            trackViewMode === 'map'
                              ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>GPS図</span>
                        </button>
                      </div>

                      {/* Live Neon SVG Track Path */}
                      {trackViewMode !== 'photo' && (
                        <svg
                          viewBox="0 0 400 300"
                          className="w-full h-full max-h-full transition-transform duration-500 group-hover:scale-105 z-5 relative"
                        >
                          <path
                            d={trackData.svgPath}
                            fill="none"
                            stroke="#042f2e"
                            strokeWidth="9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={0.8}
                          />
                          <path
                            d={trackData.svgPath}
                            fill="none"
                            stroke="#14b8a6"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}

                      {/* Floating Landmark Tag */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-200 z-10 max-w-[85%] truncate shadow-lg">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="text-teal-300 font-bold">{landmarkInfo.landmark}</span>
                        <span className="text-slate-400 truncate hidden sm:inline">— {landmarkInfo.desc}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
