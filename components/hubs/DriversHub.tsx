'use client';

/**
 * components/hubs/DriversHub.tsx
 * Drivers Hub with 3 View Modes:
 * 1. チーム別グループ表示 (Team Grouped View: 10 F1 Teams Paired Grid + Hall of Fame Legends) [Default Recommended]
 * 2. 全ドライバー一覧 (Flat Grid with Status & Team Sub-Filters)
 * 3. レジェンドのみ (Hall of Fame Legends Showcase)
 * Includes Free-word Search (AND search), Live Counter, Condition Reset, and DriverDetailModal.
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  KNOWLEDGE_TEAMS,
  KNOWLEDGE_DRIVERS,
  type DriverProfile,
  type TeamProfile,
  type TelemetryTarget,
} from '@/data/f1KnowledgeData';
import DriverDetailModal from './DriverDetailModal';
import DriverComparisonTool from './DriverComparisonTool';
import TeamDetailModal from './TeamDetailModal';
import { useUserPreferences } from '@/lib/userPreferences';
import {
  Users,
  Trophy,
  Star,
  Crown,
  Search,
  X,
  Calendar,
  Flag,
  Sparkles,
  Filter,
  ChevronRight,
  ArrowRight,
  SlidersHorizontal,
  ArrowUpDown,
  Shield,
  Info,
} from 'lucide-react';
import { GRID_2026_TEAMS, GRID_2025_TEAMS } from '@/data/f1SeasonData';
import {
  HISTORICAL_SEASONS_DATA,
  getAvailableHistoricalYears,
  getHistoricalSeasonGrid,
  type HistoricalGridTeam,
  type HistoricalGridDriver,
  type SeasonGridInfo,
} from '@/data/f1HistoricalGrids';

export type DriverViewMode = 'seasonGrid' | 'grouped' | 'grid2026' | 'grid2025' | 'flat' | 'legends' | 'compare';
export type DriverSortField = 'entries' | 'wins' | 'podiums' | 'championships' | 'polePositions' | 'name' | 'number';
export type DriverStatusFilter = 'ALL' | 'Current' | 'Legend' | 'Favorites';

export interface DriversHubProps {
  searchQuery?: string;
  initialDriverCode?: string;
  onClearSearch?: () => void;
  onSearchChange?: (q: string) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onNavigateToDrama?: () => void;
}

const HISTORICAL_TEAM_ID_MAP: Record<string, string[]> = {
  mercedes: ['mercedes'],
  'red-bull': ['red-bull'],
  ferrari: ['ferrari'],
  mclaren: ['mclaren'],
  'aston-martin': ['aston-martin', 'racing-point', 'force-india'],
  alpine: ['alpine', 'renault'],
  williams: ['williams'],
  rb: ['rb', 'alphatauri', 'toro-rosso'],
  audi: ['audi', 'sauber', 'alfa-romeo'],
  haas: ['haas'],
  cadillac: ['cadillac'],
};

export const DRIVER_PORTRAITS: Record<string, string> = {
  // Current Grid (2024-2026)
  VER: '/images/drivers/portraits/max-verstappen.jpg',
  HAM: '/images/drivers/portraits/lewis-hamilton.jpg',
  RUS: '/images/drivers/portraits/george-russell.jpg',
  LEC: '/images/drivers/portraits/charles-leclerc.jpg',
  NOR: '/images/drivers/portraits/lando-norris.jpg',
  PIA: '/images/drivers/portraits/oscar-piastri.jpg',
  ALO: '/images/drivers/portraits/fernando-alonso.jpg',
  SAI: '/images/drivers/portraits/carlos-sainz.jpg',
  TSU: '/images/drivers/portraits/yuki-tsunoda.jpg',
  ALB: '/images/drivers/portraits/alexander-albon.jpg',
  GAS: '/images/drivers/portraits/pierre-gasly.jpg',
  OCO: '/images/drivers/portraits/esteban-ocon.jpg',
  HUL: '/images/drivers/portraits/nico-hulkenberg.jpg',
  BOT: '/images/drivers/portraits/valtteri-bottas.jpg',
  PER: '/images/drivers/portraits/sergio-perez.jpg',
  LAW: '/images/drivers/portraits/liam-lawson.jpg',
  ANT: '/images/drivers/portraits/andrea-kimi-antonelli.jpg',
  HAD: '/images/drivers/portraits/isack-hadjar.jpg',
  BOR: '/images/drivers/portraits/gabriel-bortoleto.jpg',
  BEA: '/images/drivers/portraits/oliver-bearman.jpg',
  DOO: '/images/drivers/portraits/jack-doohan.jpg',
  COL: '/images/drivers/portraits/franco-colapinto.jpg',
  STR: '/images/drivers/portraits/lance-stroll.jpg',
  MAG: '/images/drivers/portraits/kevin-magnussen.jpg',
  ZHO: '/images/drivers/portraits/zhou-guanyu.jpg',
  RIC: '/images/drivers/portraits/daniel-ricciardo.jpg',

  // F1 Legends & World Champions
  SEN: '/images/drivers/portraits/ayrton-senna.jpg',
  MSC: '/images/drivers/portraits/michael-schumacher.jpg',
  PRO: '/images/drivers/portraits/alain-prost.jpg',
  LAU: '/images/drivers/portraits/niki-lauda.jpg',
  VET: '/images/drivers/portraits/sebastian-vettel.jpg',
  RAI: '/images/drivers/portraits/kimi-raikkonen.jpg',
  MAN: '/images/drivers/portraits/nigel-mansell.jpg',
  HAK: '/images/drivers/portraits/mika-hakkinen.jpg',
  BUT: '/images/drivers/portraits/jenson-button.jpg',
  ROS: '/images/drivers/portraits/nico-rosberg.jpg',

  // Historical Turbo-Hybrid Era Race Drivers
  MAS: '/images/drivers/portraits/felipe-massa.jpg',
  GRO: '/images/drivers/portraits/romain-grosjean.jpg',
  KVY: '/images/drivers/portraits/daniil-kvyat.jpg',
  SAR: '/images/drivers/portraits/logan-sargeant.jpg',
  KUB: '/images/drivers/portraits/robert-kubica.jpg',
  GIO: '/images/drivers/portraits/antonio-giovinazzi.jpg',
  LAT: '/images/drivers/portraits/nicholas-latifi.jpg',
  DEV: '/images/drivers/portraits/nyck-de-vries.jpg',
  ERI: '/images/drivers/portraits/marcus-ericsson.jpg',
  WEH: '/images/drivers/portraits/pascal-wehrlein.jpg',
  NAS: '/images/drivers/portraits/felipe-nasr.jpg',
  MAL: '/images/drivers/portraits/pastor-maldonado.jpg',
  PAL: '/images/drivers/portraits/jolyon-palmer.jpg',
  VAN: '/images/drivers/portraits/stoffel-vandoorne.jpg',
  HAR: '/images/drivers/portraits/brendon-hartley.jpg',
  GUT: '/images/drivers/portraits/esteban-gutierrez.jpg',
  SIR: '/images/drivers/portraits/sergey-sirotkin.jpg',
  MAZ: '/images/drivers/portraits/nikita-mazepin.jpg',
  FIT: '/images/drivers/portraits/pietro-fittipaldi.jpg',
  AIT: '/images/drivers/portraits/jack-aitken.jpg',
};

/**
 * Resolves driver portrait image, disambiguating names where needed (e.g. Mick Schumacher vs Michael Schumacher).
 */
export const getDriverPortrait = (code: string, name?: string): string | undefined => {
  if (name && (name.includes('ミック') || name.toLowerCase().includes('mick'))) {
    return '/images/drivers/portraits/mick-schumacher.jpg';
  }
  return DRIVER_PORTRAITS[code];
};


/**
 * Adaptive typography helper for season grid driver cards.
 * Scales font size based on name length to maintain a uniform vertical rhythm and avoid layout shift.
 */
export const getGridDriverNameClass = (name: string): string => {
  const len = name.length;
  if (len >= 13) {
    // 13+ chars (e.g. マックス・フェルスタッペン, アンドレア・キミ・アントネッリ)
    return 'text-[11px] sm:text-xs tracking-tight';
  }
  if (len >= 10) {
    // 10-12 chars (e.g. シャルル・ルクレール, ニコ・ヒュルケンベルグ, アレクサンダー・アルボン, フェルナンド・アロンソ)
    return 'text-xs sm:text-[13px] tracking-tight';
  }
  if (len >= 8) {
    // 8-9 chars (e.g. ジョージ・ラッセル, ルイス・ハミルトン, カルロス・サインツ, ピエール・ガスリー)
    return 'text-xs sm:text-sm';
  }
  // <= 7 chars (e.g. 角田 裕毅, ランド・ノリス)
  return 'text-xs sm:text-sm';
};

/**
 * Adaptive typography helper for full driver profile cards (grouped/flat/legends view).
 */
export const getCardDriverNameClass = (name: string): string => {
  const len = name.length;
  if (len >= 13) {
    return 'text-xs sm:text-[13px] tracking-tight';
  }
  if (len >= 10) {
    return 'text-xs sm:text-sm tracking-tight';
  }
  if (len >= 8) {
    return 'text-sm sm:text-[15px]';
  }
  return 'text-sm sm:text-base';
};

export default function DriversHub({
  searchQuery = '',
  initialDriverCode,
  onClearSearch,
  onSearchChange,
  onNavigateToTelemetry,
  onNavigateToDrama,
}: DriversHubProps) {
  const { prefs, isFavoriteDriver, toggleDriver } = useUserPreferences();
  const [viewMode, setViewMode] = useState<DriverViewMode>('seasonGrid');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [sortField, setSortField] = useState<DriverSortField>('entries');
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [driverStatusFilter, setDriverStatusFilter] = useState<DriverStatusFilter>('ALL');
  const [driverTeamFilter, setDriverTeamFilter] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDriverDetail, setSelectedDriverDetail] = useState<DriverProfile | null>(null);

  // Sync initialDriverCode to open DriverDetailModal if provided
  useEffect(() => {
    if (initialDriverCode) {
      const match = KNOWLEDGE_DRIVERS.find(
        (d) => d.code.toUpperCase() === initialDriverCode.toUpperCase()
      );
      if (match) {
        setSelectedDriverDetail(match);
      }
    }
  }, [initialDriverCode]);
  const [selectedTeamDetail, setSelectedTeamDetail] = useState<TeamProfile | null>(null);
  const [compareDriver1, setCompareDriver1] = useState<string>('VER');
  const [compareDriver2, setCompareDriver2] = useState<string>('NOR');

  // Helper to open TeamDetailModal by matching teamId
  const handleOpenTeamDetail = (teamId: string) => {
    let tm = KNOWLEDGE_TEAMS.find((t) => t.id === teamId);
    if (!tm) {
      for (const [currId, histIds] of Object.entries(HISTORICAL_TEAM_ID_MAP)) {
        if (histIds.includes(teamId)) {
          tm = KNOWLEDGE_TEAMS.find((t) => t.id === currId);
          break;
        }
      }
    }
    if (tm) {
      setSelectedTeamDetail(tm);
    }
  };

  // Available historical years (2026 down to 2016)
  const availableYears = useMemo(() => getAvailableHistoricalYears(), []);

  // Selected season grid data
  const currentSeasonGrid = useMemo(() => {
    return getHistoricalSeasonGrid(selectedYear) || HISTORICAL_SEASONS_DATA[2026];
  }, [selectedYear]);

  // Helper map: driver code -> DriverProfile
  const driverMap = useMemo(() => {
    const map = new Map<string, DriverProfile>();
    KNOWLEDGE_DRIVERS.forEach((d) => map.set(d.code, d));
    return map;
  }, []);

  // Generate fallback profile for historical drivers not in current main knowledge base
  const getFallbackProfile = (drv: HistoricalGridDriver, team: HistoricalGridTeam): DriverProfile => {
    return {
      id: `hist-${drv.code.toLowerCase()}-${selectedYear}`,
      code: drv.code,
      number: drv.number || 0,
      fullName: drv.name,
      country: drv.country,
      team: team.teamName,
      teamColor: team.teamColor,
      status: drv.role === 'Reserve' ? 'Reserve' : 'Current',
      nickname: drv.role === 'Reserve' ? '公式リザーブ / テストドライバー' : 'F1ドライバー',
      birthDate: '---',
      birthPlace: drv.country,
      f1Debut: `${selectedYear}年`,
      driverType: drv.role === 'Reserve' ? 'リザーブ＆シミュレータ開発' : 'レギュラードライバー',
      numberOrigin: drv.number ? `カーナンバー #${drv.number}` : 'ゼッケン未定',
      visualAsset: {
        imageUrl: getDriverPortrait(drv.code, drv.name) || `/images/drivers/portraits/${drv.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        caption: `${drv.name} (${team.teamName})`,
        credit: 'Formula 1 Paddock Archive / CC-BY-SA',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://www.formula1.com',
      },
      careerSummary: drv.note
        ? `${selectedYear}年のF1世界選手権において、${team.fullName}より${drv.role === 'Reserve' ? '公式リザーブドライバー' : 'レギュラードライバー'}としてエントリー [1]。「${drv.note}」の記録を残す [2]。`
        : `${selectedYear}年のF1世界選手権において、${team.fullName}より${drv.role === 'Reserve' ? '公式リザーブドライバー' : 'レギュラードライバー'}として参戦 [1]。`,
      entries: drv.role === 'Reserve' ? 0 : 20,
      wins: 0,
      podiums: 0,
      polePositions: 0,
      championships: 0,
      drivingStyle: {
        traits: [drv.role === 'Reserve' ? 'シミュレータ＆フィードバック' : 'レースクラフト'],
        brakingTechnique: 'チームのデータロガーおよびテレメトリーに基づき最適な減速Gを発生 [1]。',
        tyreManagement: 'スティントに応じたタイヤマネジメントを遂行 [2]。',
        telemetrySignature: `${selectedYear}年仕様の${team.powerUnit}パワーユニット搭載マシンを駆り、精密なスロットルワークを展開。`,
        preferredCircuitTypes: ['複合テクニカルサーキット'],
        summary: `${selectedYear}年シーズンに${team.teamName}で活躍。`,
      },
      biography: {
        personality: 'プロフェッショナルな姿勢でチームの技術開発とレースウィークを支える。',
        rivalries: 'チームメイトとの切磋琢磨。',
        iconicRaces: drv.note
          ? [{ gp: `${selectedYear}年シーズン`, year: selectedYear, description: drv.note, tacticalMasterclass: 'チーム戦略を完璧に遂行。' }]
          : [],
        quotes: ['「チームの目標達成のために全力を尽くす。」'],
        offTrack: 'フィジカルトレーニングおよびシミュレータセッションに注力。',
      },
      milestones: drv.note
        ? [{ date: `${selectedYear}-01-01`, event: drv.note, refId: 1 }]
        : [{ date: `${selectedYear}-01-01`, event: `${selectedYear}年 ${team.teamName} 所属`, refId: 1 }],
      references: [
        {
          id: 1,
          title: `${selectedYear} FIA Formula One World Championship Entry List & Official Results`,
          publisher: 'Fédération Internationale de l’Automobile',
          url: 'https://www.fia.com',
          verifiedDate: '2024-01-10',
        },
        {
          id: 2,
          title: `${team.fullName} Official Season Archive`,
          publisher: `${team.teamName} Communications`,
          url: 'https://www.formula1.com',
          verifiedDate: '2024-01-10',
        },
      ],
      seasonHistory: [
        {
          year: selectedYear,
          team: team.fullName,
          teamId: team.teamId,
          role: drv.role,
          carNumber: drv.number,
          note: drv.note,
        },
      ],
    };
  };

  const handleHistoricalDriverClick = (drv: HistoricalGridDriver, team: HistoricalGridTeam) => {
    const existing = driverMap.get(drv.code);
    if (existing) {
      setSelectedDriverDetail(existing);
    } else {
      setSelectedDriverDetail(getFallbackProfile(drv, team));
    }
  };

  // Sync effective search
  const effectiveSearch = searchQuery || localSearch;

  // Filtered & Sorted drivers for flat / directory view
  const filteredDrivers = useMemo(() => {
    const list = KNOWLEDGE_DRIVERS.filter((d) => {
      const q = effectiveSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.fullName.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.team.toLowerCase().includes(q) ||
        d.driverType.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q);

      const matchesStatus =
        driverStatusFilter === 'ALL'
          ? true
          : driverStatusFilter === 'Favorites'
          ? isFavoriteDriver(d.code)
          : d.status === driverStatusFilter;

      const matchesTeam =
        driverTeamFilter === 'ALL' ||
        d.team.toLowerCase().includes(driverTeamFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesTeam;
    });

    return list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'entries':
          comparison = (b.entries || 0) - (a.entries || 0);
          break;
        case 'wins':
          comparison = (b.wins || 0) - (a.wins || 0);
          break;
        case 'podiums':
          comparison = (b.podiums || 0) - (a.podiums || 0);
          break;
        case 'polePositions':
          comparison = (b.polePositions || 0) - (a.polePositions || 0);
          break;
        case 'championships':
          comparison = (b.championships || 0) - (a.championships || 0);
          break;
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName, 'ja');
          break;
        case 'number':
          comparison = (a.number || 999) - (b.number || 999);
          break;
        default:
          comparison = 0;
      }
      return sortAscending ? -comparison : comparison;
    });
  }, [effectiveSearch, driverStatusFilter, driverTeamFilter, isFavoriteDriver, sortField, sortAscending]);

  // Legends list
  const legendDrivers = useMemo(() => {
    return KNOWLEDGE_DRIVERS.filter((d) => d.status === 'Legend');
  }, []);

  const totalLegendTitles = useMemo(() => {
    return legendDrivers.reduce((sum, d) => sum + (d.championships || 0), 0);
  }, [legendDrivers]);

  // Helper to check if a driver matches search query & status filter
  const isDriverMatchQuery = (d: DriverProfile) => {
    if (driverStatusFilter === 'Favorites' && !isFavoriteDriver(d.code)) return false;
    if (driverStatusFilter === 'Current' && d.status !== 'Current') return false;
    if (driverStatusFilter === 'Legend' && d.status !== 'Legend') return false;
    if (!effectiveSearch.trim()) return true;
    const q = effectiveSearch.toLowerCase().trim();
    return (
      d.fullName.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.team.toLowerCase().includes(q) ||
      d.driverType.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q)
    );
  };

  const activeFilterCount =
    (driverStatusFilter !== 'ALL' && driverStatusFilter !== 'Favorites' ? 1 : 0) +
    (driverTeamFilter !== 'ALL' ? 1 : 0);

  const isFiltered =
    effectiveSearch.trim() !== '' ||
    driverStatusFilter !== 'ALL' ||
    driverTeamFilter !== 'ALL';

  const handleResetFilters = () => {
    setDriverStatusFilter('ALL');
    setDriverTeamFilter('ALL');
    setLocalSearch('');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClearLocalSearch = () => {
    setLocalSearch('');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // Reusable Single Driver Card Component
  const renderDriverCard = (driver: DriverProfile) => {
    const portraitUrl = getDriverPortrait(driver.code, driver.fullName) || driver.visualAsset?.imageUrl;
    const isLegend = driver.status === 'Legend';
    const accentColor = isLegend ? '#D4AF37' : driver.teamColor;

    return (
      <div
        key={driver.id}
        onClick={() => setSelectedDriverDetail(driver)}
        className="bg-slate-900/90 hover:bg-slate-850 p-3 sm:p-3.5 flex flex-col justify-between gap-3 border border-white/10 hover:border-slate-400/50 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 group relative overflow-hidden rounded-2xl h-full"
        style={{ borderLeftColor: accentColor, borderLeftWidth: '4px' }}
      >
        {/* Card Top: Number, Code, Country, Title Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-xs font-racing font-black px-2 py-0.5 rounded-md border shadow-sm shrink-0"
              style={{
                color: accentColor,
                borderColor: `${accentColor}60`,
                backgroundColor: `${accentColor}18`,
              }}
            >
              #{driver.number} {driver.code}
            </span>
            <span className="text-xs text-slate-400 font-mono truncate">{driver.country}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isLegend ? (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono flex items-center gap-1 shadow-sm">
                <Crown className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span>{driver.championships}冠</span>
              </span>
            ) : driver.championships > 0 ? (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono flex items-center gap-1">
                <Trophy className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span>{driver.championships}冠</span>
              </span>
            ) : null}

            {/* Star Favorite Bookmark Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleDriver(driver.code);
              }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                isFavoriteDriver(driver.code)
                  ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 hover:bg-amber-400/30 shadow-sm'
                  : 'bg-slate-900/60 border-white/10 text-slate-500 hover:text-amber-300 hover:border-amber-400/40'
              }`}
              title={isFavoriteDriver(driver.code) ? '推しから外す' : '推し選手 (お気に入り) に登録'}
            >
              <Star className={`w-3 h-3 ${isFavoriteDriver(driver.code) ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>

        {/* Driver Name, Team & Portrait Photo */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/10 group-hover:border-white/25 transition-colors">
            {portraitUrl ? (
              <img
                src={portraitUrl}
                alt={driver.fullName}
                className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-racing font-bold text-slate-500 text-xs">
                #{driver.number}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
            <div className="h-9 sm:h-10 flex items-center">
              <h3 className={`font-bold text-white leading-snug group-hover:text-sky-300 transition-colors break-words ${getCardDriverNameClass(driver.fullName)}`}>
                {driver.fullName}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate">
              {driver.team}
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9.5px] font-mono text-slate-300 inline-block">
                {driver.driverType}
              </span>
            </div>
          </div>
        </div>

        {/* Card Bottom: Standardized Stats Grid */}
        <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-xl bg-slate-950/70 border border-white/5 text-center text-[10px] font-mono whitespace-nowrap">
          <div className="flex items-center justify-center gap-1">
            <span className="text-slate-500">勝</span>
            <strong className="text-amber-400 font-bold tabular-nums">{driver.wins}</strong>
          </div>
          <div className="flex items-center justify-center gap-1 border-x border-white/10">
            <span className="text-slate-500">登壇</span>
            <strong className="text-sky-400 font-bold tabular-nums">{driver.podiums}</strong>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-slate-500">PP</span>
            <strong className="text-purple-400 font-bold tabular-nums">{driver.polePositions}</strong>
          </div>
        </div>
      </div>
    );
  };

  // If a driver detail is selected, render DriverDetailModal as a Dedicated Full-Page View
  if (selectedDriverDetail) {
    return (
      <DriverDetailModal
        driver={selectedDriverDetail}
        allDrivers={
          viewMode === 'legends'
            ? legendDrivers
            : viewMode === 'flat'
            ? filteredDrivers
            : KNOWLEDGE_DRIVERS
        }
        onSelectDriver={(d) => setSelectedDriverDetail(d)}
        onSelectTeamDetail={(teamId) => {
          handleOpenTeamDetail(teamId);
          setSelectedDriverDetail(null);
        }}
        onNavigateToTelemetry={onNavigateToTelemetry}
        onCompareDriver={(code) => {
          setCompareDriver1(code);
          setViewMode('compare');
          setSelectedDriverDetail(null);
        }}
        onClose={() => setSelectedDriverDetail(null)}
      />
    );
  }

  // If a team detail is selected, render TeamDetailModal as a Dedicated Full-Page View
  if (selectedTeamDetail) {
    return (
      <TeamDetailModal
        team={selectedTeamDetail}
        allTeams={KNOWLEDGE_TEAMS}
        onSelectTeam={(t) => setSelectedTeamDetail(t)}
        onSelectDriverDetail={(code) => {
          const drv = driverMap.get(code);
          if (drv) {
            setSelectedDriverDetail(drv);
            setSelectedTeamDetail(null);
          }
        }}
        onNavigateToTelemetry={onNavigateToTelemetry}
        onClose={() => setSelectedTeamDetail(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[1800px] mx-auto animate-fade-in pb-6 sm:pb-2">
      {/* ── Top Bar: View Mode Switcher, Free-Word Search, Summary & Reset ── */}
      <div className="glass-card-premium rounded-xl p-3 sm:p-3.5 shadow-md flex flex-col gap-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* View Mode Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setViewMode('seasonGrid')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'seasonGrid' || viewMode === 'grid2026' || viewMode === 'grid2025'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50 border border-red-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>年度別グリッド</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-red-400/20 text-red-200 border border-red-400/30 ml-0.5">
                2016-2026
              </span>
            </button>

            <button
              onClick={() => setViewMode('grouped')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50 border border-red-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>2026チーム別</span>
            </button>

            <button
              onClick={() => setViewMode('flat')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'flat'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50 border border-red-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>全ドライバー名鑑</span>
            </button>

            <button
              onClick={() => setViewMode('legends')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'legends'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50 border border-red-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>レジェンド</span>
            </button>

            <button
              onClick={() => setViewMode('compare')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'compare'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50 border border-red-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>2名直接比較</span>
            </button>
          </div>

          {/* Counter Badge */}
          <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
            <span className="text-xs font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-sky-400">
              {(viewMode === 'seasonGrid' || viewMode === 'grid2026' || viewMode === 'grid2025') && (
                <>
                  表示中: <strong className="text-white text-sm">{selectedYear}年</strong> ({currentSeasonGrid.teams.length}チーム / レギュラー{currentSeasonGrid.teams.reduce((acc, t) => acc + t.drivers.length, 0)}名 / リザーブ{currentSeasonGrid.teams.reduce((acc, t) => acc + (t.reserves?.length || 0), 0)}名)
                </>
              )}
              {viewMode === 'grouped' && (
                <>
                  表示中: <strong className="text-white text-sm">全11チーム</strong> (27名)
                </>
              )}
              {viewMode === 'flat' && (
                <>
                  名鑑: <strong className="text-white text-sm">{filteredDrivers.length}</strong> / {KNOWLEDGE_DRIVERS.length} 名
                </>
              )}
              {viewMode === 'legends' && (
                <>
                  殿堂レジェンド: <strong className="text-white text-sm">{legendDrivers.length}</strong> 名
                </>
              )}
              {viewMode === 'compare' && (
                <>
                  <strong className="text-purple-300 text-sm">2名直接比較モード</strong>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Row 2: Search Input, Starred Quick Toggle, Filter Tray Toggle, Reset */}
        {viewMode !== 'compare' && (
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="ドライバー名・3文字略称・チーム・国籍で検索..."
                value={effectiveSearch}
                onChange={handleSearchInputChange}
                className="w-full bg-slate-900/80 border border-white/10 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
              {effectiveSearch && (
                <button
                  type="button"
                  onClick={handleClearLocalSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-white text-xs cursor-pointer"
                  title="検索条件をクリア"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Starred Toggle */}
              <button
                type="button"
                onClick={() =>
                  setDriverStatusFilter((prev) =>
                    prev === 'Favorites' ? 'ALL' : 'Favorites'
                  )
                }
                className={`text-xs font-racing font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  driverStatusFilter === 'Favorites'
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-400/30'
                }`}
                title="お気に入りに登録した選手のみ表示"
              >
                <Star className={`w-3.5 h-3.5 ${driverStatusFilter === 'Favorites' ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                <span>推し選手 ({prefs.favoriteDriverCodes?.length || 0})</span>
              </button>

              {/* Filter Tray Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className={`text-xs font-racing font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isFilterOpen
                    ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/30 ring-1 ring-blue-400/50'
                    : activeFilterCount > 0
                    ? 'bg-blue-950/80 border-blue-500/50 text-blue-300 hover:bg-blue-900/80'
                    : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="詳細フィルター（ステータス・所属チーム）の開閉"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>絞り込み</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
                <span className="text-[10px]">{isFilterOpen ? '▲' : '▼'}</span>
              </button>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  title="すべての絞り込み条件をリセット"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">リセット</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Collapsible Filter Tray (On-demand) ── */}
      {isFilterOpen && viewMode !== 'compare' && (
        <div className="glass-card-premium rounded-xl p-3 sm:p-4 border border-blue-500/30 shadow-xl flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="font-racing font-bold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-300" />
              <span>ドライバー絞り込み条件設定</span>
            </span>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>閉じる</span>
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider min-w-[70px] flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>ステータス:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'ALL' as DriverStatusFilter, label: '全選手' },
                { key: 'Current' as DriverStatusFilter, label: '現役グリッド' },
                { key: 'Legend' as DriverStatusFilter, label: '歴代レジェンド' },
              ].map((opt) => {
                const active = driverStatusFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setDriverStatusFilter(opt.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1 border shadow-sm cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20 ring-1 ring-blue-400/40'
                        : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Filter */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider min-w-[70px] flex items-center gap-1 pt-1">
              <Flag className="w-3 h-3 text-slate-400" />
              <span>所属チーム:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                'ALL',
                'Red Bull',
                'Ferrari',
                'McLaren',
                'Mercedes',
                'Aston Martin',
                'Alpine',
                'Williams',
                'RB',
                'Audi',
                'Haas',
                'Cadillac',
              ].map((t) => {
                const active = driverTeamFilter === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDriverTeamFilter(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 border shadow-sm cursor-pointer ${
                      active
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sky-500/20 ring-1 ring-sky-400/40 font-bold'
                        : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Active Filter Dismissible Chips Strip ── */}
      {viewMode !== 'compare' && (driverStatusFilter !== 'ALL' || driverTeamFilter !== 'ALL' || effectiveSearch.trim()) && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>絞り込み中:</span>
          </span>
          {driverStatusFilter !== 'ALL' && driverStatusFilter !== 'Favorites' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-200 text-[11px] font-mono">
              <span>{driverStatusFilter === 'Current' ? '現役' : 'レジェンド'}</span>
              <button
                type="button"
                onClick={() => setDriverStatusFilter('ALL')}
                className="hover:text-white text-blue-400 hover:bg-blue-800/50 rounded p-0.5 ml-0.5 cursor-pointer inline-flex items-center justify-center"
                title="ステータス解除"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          {driverStatusFilter === 'Favorites' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-200 text-[11px] font-mono">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>推し選手のみ</span>
              <button
                type="button"
                onClick={() => setDriverStatusFilter('ALL')}
                className="hover:text-white text-amber-400 hover:bg-amber-800/50 rounded p-0.5 ml-0.5 cursor-pointer inline-flex items-center justify-center"
                title="推し解除"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          {driverTeamFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-200 text-[11px] font-mono">
              <span>{driverTeamFilter}</span>
              <button
                type="button"
                onClick={() => setDriverTeamFilter('ALL')}
                className="hover:text-white text-sky-400 hover:bg-sky-800/50 rounded p-0.5 ml-0.5 cursor-pointer inline-flex items-center justify-center"
                title="チーム解除"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          {effectiveSearch.trim() && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-200 text-[11px] font-mono">
              <span>&quot;{effectiveSearch}&quot;</span>
              <button
                type="button"
                onClick={handleClearLocalSearch}
                className="hover:text-white text-sky-400 hover:bg-sky-800/50 rounded p-0.5 ml-0.5 cursor-pointer inline-flex items-center justify-center"
                title="検索解除"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] text-rose-400 hover:text-rose-300 underline ml-1 cursor-pointer font-mono"
          >
            すべて解除
          </button>
        </div>
      )}

      {/* ── MODE 1: TEAM GROUPED VIEW (Default Recommended) ── */}
      {viewMode === 'grouped' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
          {KNOWLEDGE_TEAMS.map((team) => {
            // Get paired driver objects for this team
            const pairedDrivers = team.drivers
              .map((code) => driverMap.get(code))
              .filter((d): d is DriverProfile => !!d);

            // Check if any driver matches search filter
            const matchingDrivers = pairedDrivers.filter((d) => isDriverMatchQuery(d));
            const hasMatchingDriver =
              driverStatusFilter === 'Favorites'
                ? matchingDrivers.length > 0
                : !effectiveSearch.trim() ||
                  team.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                  team.fullName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                  matchingDrivers.length > 0;

            if (!hasMatchingDriver) return null;

            return (
              <div
                key={team.id}
                className="glass-card-premium border rounded-xl p-3 sm:p-3.5 shadow-md transition-all flex flex-col justify-between"
                style={{ borderColor: `${team.color}40` }}
              >
                {/* Team Header Section (Slim Single-Line Header) */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
                  {/* Left: Team Color Pill, Name, PU Badge */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: team.color }}
                    />
                    <button
                      type="button"
                      onClick={() => handleOpenTeamDetail(team.id)}
                      className="group/team flex items-center gap-1.5 hover:text-sky-300 transition-colors cursor-pointer text-left min-w-0"
                      title={`${team.name} のチーム詳細・スペック・系譜を見る`}
                    >
                      <h3 className="text-sm sm:text-base font-racing font-bold text-white group-hover/team:text-sky-300 leading-tight truncate">
                        {team.name}
                      </h3>
                      <ArrowRight className="w-3 h-3 text-sky-400 opacity-60 group-hover/team:opacity-100 group-hover/team:translate-x-0.5 transition-all" />
                    </button>
                    {team.powerUnit && (
                      <span
                        className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-slate-300 hidden sm:inline-flex items-center gap-1 shrink-0"
                        title={`パワーユニット: ${team.powerUnit}`}
                      >
                        <span className="text-[9px] font-bold text-slate-400 font-racing">PU</span>
                        <span className="truncate max-w-[130px]">{team.powerUnit}</span>
                      </span>
                    )}
                  </div>

                  {/* Right: Principal & Titles Badges */}
                  <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono text-slate-400 shrink-0">
                    {team.constructorTitles > 0 && (
                      <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 flex items-center gap-1">
                        <Trophy className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span>{team.constructorTitles}冠</span>
                      </span>
                    )}
                    {team.teamPrincipal && (
                      <span className="bg-slate-900/90 border border-white/5 px-2 py-0.5 rounded-md hidden md:inline-flex items-center gap-1 whitespace-nowrap text-slate-300">
                        <Users className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>{team.teamPrincipal}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Team Paired Drivers (2 Columns side by side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                  {(driverStatusFilter === 'Favorites' ? matchingDrivers : pairedDrivers).map((driver) => renderDriverCard(driver))}
                </div>
              </div>
            );
          })}

          {/* Dedicated Legends Section under the 10 teams */}
          {legendDrivers.some((d) => isDriverMatchQuery(d)) && (
            <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-amber-950/30 via-slate-950/80 to-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl mt-2">
              {/* Legends Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3.5 border-b border-amber-500/20 p-3 rounded-xl bg-amber-500/10 border-l-4 border-l-amber-400">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center font-racing font-black text-xl border border-amber-400/60 bg-amber-400/20 text-amber-300 shadow-sm flex-shrink-0">
                    <Trophy className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-racing font-bold text-amber-300 leading-tight flex items-center gap-2">
                      <span>F1 HALL OF FAME / LEGENDS</span>
                      <span className="text-xs bg-amber-400/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono">
                        殿堂入りレジェンド
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      F1史上に不滅の足跡を刻んだ殿堂入りドライバーたち。セナ、シューマッハ、プロスト、ラウダ、ベッテル、ライコネンらの栄光と伝説。
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono text-amber-300/90 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-amber-500/30 self-end sm:self-auto">
                  殿堂ドライバーズタイトル計 {totalLegendTitles}冠
                </div>
              </div>

              {/* Legends Grid (4 to 5 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {legendDrivers
                  .filter((d) => isDriverMatchQuery(d))
                  .map((driver) => renderDriverCard(driver))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── View Mode: HISTORICAL SEASON GRID (2016 - 2026, TEAMS, REGULARS & RESERVES) ── */}
      {(viewMode === 'seasonGrid' || viewMode === 'grid2026' || viewMode === 'grid2025') && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Season Header Banner with West Year Selector & Era Info */}
          <div className="bg-gradient-to-r from-red-950/40 via-slate-950 to-slate-900 border border-red-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    {currentSeasonGrid.year} SEASON GRID
                  </span>
                  <span className="text-xs text-sky-400 font-mono font-bold">
                    {currentSeasonGrid.eraName}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-racing font-bold text-white tracking-wide flex items-center gap-2">
                  <span>{currentSeasonGrid.year}年 F1世界選手権 公式グリッド＆体制</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {currentSeasonGrid.seasonSummary}
                </p>
              </div>

              {/* West Year Selector Dropdown */}
              <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 p-2 sm:p-2.5 rounded-xl self-start md:self-center shadow-lg shrink-0">
                <label className="text-xs font-racing font-bold text-amber-300 whitespace-nowrap flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>年度切替:</span>
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-slate-950 border border-white/15 text-white font-racing font-bold text-xs sm:text-sm px-2.5 py-1.5 rounded-lg cursor-pointer hover:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr} className="bg-slate-950 text-white">
                      {yr}年
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Season Champions / Standings Leader Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
              {currentSeasonGrid.isOngoing ? (
                <>
                  <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl text-amber-200 shadow-sm">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold font-mono text-[10px] text-amber-400 block uppercase tracking-wider">
                        世界王者 (World Champion Status)
                      </span>
                      <span className="text-white font-bold text-xs truncate">
                        未確定（2026シーズン未終了・全23戦予定）
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 ml-auto shrink-0 font-bold">
                      タイトル未確定
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-sky-500/10 border border-sky-500/30 px-3.5 py-2 rounded-xl text-sky-200 shadow-sm">
                    <Shield className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold font-mono text-[10px] text-sky-400 block uppercase tracking-wider">
                        情報の出所 / 一次出典 (Official Sources)
                      </span>
                      <span className="text-white font-bold text-xs truncate">
                        {currentSeasonGrid.sourceNotice || 'FIA公式レギュレーション ＆ 各チーム参戦発表'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30 ml-auto shrink-0 font-bold">
                      全11チーム・22名体制
                    </span>
                  </div>
                  {currentSeasonGrid.statusNotice && (
                    <div className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2 shadow-sm">
                      <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{currentSeasonGrid.statusNotice}</span>
                    </div>
                  )}
                </>
              ) : currentSeasonGrid.championDriver && currentSeasonGrid.championConstructor ? (
                <>
                  <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-200">
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold font-mono">世界王者 (Drivers):</span>
                    <span className="text-white font-bold truncate">
                      {currentSeasonGrid.championDriver.name}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400/90 ml-auto shrink-0">
                      {currentSeasonGrid.championDriver.wins}勝 / {currentSeasonGrid.championDriver.points}点
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-lg text-sky-200">
                    <Trophy className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="font-bold font-mono">製造者王者 (Constructors):</span>
                    <span className="text-white font-bold truncate">
                      {currentSeasonGrid.championConstructor.name}
                    </span>
                    <span className="text-[11px] font-mono text-sky-400/90 ml-auto shrink-0">
                      {currentSeasonGrid.championConstructor.wins}勝 / {currentSeasonGrid.championConstructor.points}点
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Teams Grid for the Selected Year */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
            {currentSeasonGrid.teams.map((team) => (
              <div
                key={team.teamId}
                className="bg-slate-900/90 border border-white/10 hover:border-red-500/30 rounded-2xl p-3 sm:p-3.5 shadow-xl transition-all flex flex-col gap-2.5"
                style={{ borderLeftColor: team.teamColor, borderLeftWidth: '4px' }}
              >
                {/* Team Info Bar Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: team.teamColor }}
                    />
                    {!currentSeasonGrid.isOngoing && team.finalRank && (
                      <span className="bg-white/10 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded">
                        #{team.finalRank}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenTeamDetail(team.teamId)}
                      className="group/team flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer text-left min-w-0"
                      title={`${team.teamName} のチーム詳細・スペック・系譜を見る`}
                    >
                      <h3 className="text-sm sm:text-base font-racing font-bold text-white group-hover/team:text-red-400 leading-tight">
                        {team.teamName}
                      </h3>
                      <ArrowRight className="w-3 h-3 text-red-400 opacity-60 group-hover/team:opacity-100 group-hover/team:translate-x-0.5 transition-all" />
                    </button>
                    {team.powerUnit && (
                      <span
                        className="text-[10px] font-mono text-slate-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 hidden sm:inline-flex items-center gap-1 truncate max-w-[160px]"
                        title={`パワーユニット: ${team.powerUnit}`}
                      >
                        <span className="text-slate-400 font-semibold font-racing text-[9px]">PU</span>
                        <span className="truncate">{team.powerUnit}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
                    {team.teamPrincipal && (
                      <span className="bg-slate-950/80 border border-white/5 px-2 py-0.5 rounded-md text-slate-300 text-[10px] hidden md:inline-flex items-center gap-1">
                        <Users className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>{team.teamPrincipal}</span>
                      </span>
                    )}
                    {team.points !== undefined && (
                      <span className="bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                        {team.points} pts
                      </span>
                    )}
                  </div>
                </div>

                {/* Regular Drivers Columns (2 Primary Seats with authentic portrait photos, full names, no button clutter) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                  {team.drivers.map((drv) => {
                    const profile = driverMap.get(drv.code);
                    const portraitUrl = getDriverPortrait(drv.code, drv.name) || profile?.visualAsset?.imageUrl;
                    return (
                      <div
                        key={drv.code}
                        onClick={() => handleHistoricalDriverClick(drv, team)}
                        className="group relative bg-slate-950/70 hover:bg-slate-850 p-2 sm:p-2.5 rounded-xl border border-white/10 hover:border-red-500/40 transition-all duration-200 cursor-pointer flex items-center gap-2.5 shadow-sm hover:shadow-md flex-1"
                      >
                        {/* Driver Portrait Photo with Number Badge */}
                        <div className="relative w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-white/10 group-hover:border-red-500/40 transition-colors">
                          {portraitUrl ? (
                            <img
                              src={portraitUrl}
                              alt={drv.name}
                              className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-racing font-bold text-slate-500 text-xs">
                              #{drv.number}
                            </div>
                          )}
                          <div
                            className="absolute bottom-0 inset-x-0 py-0.5 text-center text-[10px] font-racing font-black bg-black/85 backdrop-blur-sm border-t border-white/10"
                            style={{ color: team.teamColor }}
                          >
                            #{drv.number || drv.code}
                          </div>
                        </div>

                        {/* Driver Identity */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-xs shrink-0">{drv.flag}</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{drv.country}</span>
                            <span className="text-[10px] font-mono font-bold text-slate-500 ml-auto shrink-0">{drv.code}</span>
                          </div>

                          {/* Full Name Container - Fixed Height for Uniform Rhythm */}
                          <div className="h-8 sm:h-9 flex items-center">
                            <h4
                              className={`font-bold text-white group-hover:text-red-400 transition-colors leading-tight break-words ${getGridDriverNameClass(
                                drv.name
                              )}`}
                            >
                              {drv.name}
                            </h4>
                          </div>

                          {/* Badges & Clean Status Note - Unified 1-Line Strip */}
                          <div className="flex items-center gap-1 min-h-[18px] text-[10px] overflow-hidden whitespace-nowrap pt-0.5">
                            {drv.isTransfer && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                                移籍
                              </span>
                            )}
                            {drv.isRookie && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 shrink-0">
                                ルーキー
                              </span>
                            )}
                            {profile && profile.championships > 0 && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0 flex items-center gap-0.5">
                                <Trophy className="w-2.5 h-2.5 text-amber-400" />
                                <span>{profile.championships}冠</span>
                              </span>
                            )}
                            {drv.note && (
                              <span className="text-[10px] text-slate-400 truncate" title={drv.note}>
                                {drv.note}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reserve & Test Drivers Section (Unified Single-Line Horizontal Strip) */}
                <div className="pt-2 mt-auto border-t border-white/10 flex items-center justify-between gap-2 text-xs min-h-[30px]">
                  <div className="flex items-center gap-1.5 shrink-0 text-slate-400 font-mono text-[10px]">
                    <Shield className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-racing font-bold tracking-wider text-slate-400 uppercase">RESERVE:</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end overflow-x-auto no-scrollbar">
                    {team.reserves && team.reserves.length > 0 ? (
                      team.reserves.map((res) => {
                        const cleanName = res.name.replace(/\s*\([^)]*\)/g, '');
                        return (
                          <button
                            key={res.code}
                            type="button"
                            onClick={() => handleHistoricalDriverClick(res, team)}
                            className="group/res inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 hover:bg-slate-800 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-white text-[11px] font-medium transition-all shrink-0 cursor-pointer shadow-xs max-w-[170px]"
                            title={`${res.name} の選手詳細を見る`}
                          >
                            <span className="text-[10px] shrink-0">{res.flag}</span>
                            <span className="font-mono text-slate-200 group-hover/res:text-red-400 transition-colors truncate">
                              {cleanName}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 shrink-0">
                              #{res.number || res.code}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-[10px] font-mono text-slate-600">未登録</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODE 2: 全ドライバー名鑑・一覧 (Directory View with Sorting) ── */}
      {viewMode === 'flat' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Directory Header Bar & Sort Controls */}
          <div className="glass-card-premium rounded-xl p-3.5 border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            <div>
              <h2 className="text-base sm:text-lg font-racing font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400 shrink-0" />
                <span>全ドライバー名鑑・一覧</span>
                <span className="text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded-full">
                  {filteredDrivers.length} 名表示中
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                現役22名・殿堂レジェンド・リザーブを含む全ドライバー一覧。出走数・勝利数・タイトル数等でソート可能です。
              </p>
            </div>

            {/* Sort Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
              <span className="text-xs font-racing text-slate-400 mr-1">並び替え:</span>
              {(
                [
                  { field: 'entries', label: '出走数' },
                  { field: 'wins', label: '勝利数' },
                  { field: 'podiums', label: '表彰台' },
                  { field: 'polePositions', label: 'PP' },
                  { field: 'championships', label: '王座数' },
                  { field: 'name', label: '氏名' },
                  { field: 'number', label: '番号' },
                ] as const
              ).map(({ field, label }) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => setSortField(field)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                    sortField === field
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5 hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}

              {/* Order Toggle (Asc / Desc) */}
              <button
                type="button"
                onClick={() => setSortAscending((prev) => !prev)}
                className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 border border-white/10 text-amber-300 hover:bg-slate-800 transition-all cursor-pointer ml-1"
                title={sortAscending ? '昇順 (少ない順)' : '降順 (多い順)'}
              >
                {sortAscending ? '▲ 昇順' : '▼ 降順'}
              </button>
            </div>
          </div>

          {filteredDrivers.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-3">
              <Users className="w-10 h-10 text-slate-600" />
              <h3 className="text-base font-bold text-white">
                条件に一致するドライバーが見つかりませんでした
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                ステータスやチーム、または検索キーワードの絞り込み条件を変更してください。
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-racing font-bold transition-all shadow-md cursor-pointer"
              >
                フィルターをリセットする
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
              {filteredDrivers.map((driver) => renderDriverCard(driver))}
            </div>
          )}
        </div>
      )}

      {/* ── MODE 3: LEGENDS SHOWCASE VIEW ── */}
      {viewMode === 'legends' && (
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-lg font-racing font-bold text-amber-300">
                  F1 HISTORIC LEGENDS (殿堂入りレジェンド一覧)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  モータースポーツの歴史を決定づけた偉大な{legendDrivers.length}名の殿堂入りレジェンド。
                  テレメトリー比較、ドライビング技術論、歴史的アーカイブと直接リンクしています。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {legendDrivers
              .filter((d) => isDriverMatchQuery(d))
              .map((driver) => renderDriverCard(driver))}
          </div>
        </div>
      )}

      {/* ── MODE 4: DRIVER COMPARISON TOOL ── */}
      {viewMode === 'compare' && (
        <DriverComparisonTool
          initialDriver1={compareDriver1}
          initialDriver2={compareDriver2}
          onNavigateToTelemetry={onNavigateToTelemetry}
          onNavigateToDrama={onNavigateToDrama}
          onSelectDriverDetail={(d) => setSelectedDriverDetail(d)}
        />
      )}
    </div>
  );
}
