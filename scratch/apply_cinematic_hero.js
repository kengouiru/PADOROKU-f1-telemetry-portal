const fs = require('fs');

const path = 'components/hubs/SeasonHub.tsx';
let content = fs.readFileSync(path, 'utf-8');

// Ensure Camera is imported
if (!content.includes('Camera,')) {
  content = content.replace("import { Map,", "import { Map, Camera,");
}

const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('1. NEXT RACE HERO'));
let end = lines.findIndex(l => l.includes('Official Broadcast Partner') || l.includes('season_banner'));
while (end > 0 && !lines[end].includes('</div>')) {
  end--;
}
// end is the closing </div> of the Hero section, let's find the exact line
let heroCloseIdx = lines.findIndex((l, idx) => idx > start && l.trim() === '</div>' && lines[idx + 1] && lines[idx + 1].includes('Official Broadcast Partner'));
if (heroCloseIdx === -1) {
  heroCloseIdx = lines.findIndex((l, idx) => idx > start && l.trim() === '</div>' && lines[idx + 2] && lines[idx + 2].includes('Official Broadcast Partner'));
}

console.log('Hero start:', start, 'hero close:', heroCloseIdx);

const newHero = `      {/* ─────────────────────────────────────────────────────────────
          1. NEXT RACE HERO: CINEMATIC CIRCUIT BACKDROP & COCKPIT HUD
          ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-950 p-3.5 sm:p-5 shadow-2xl">
        {/* Cinematic Backdrop Photo with Layered Scrim */}
        {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src={selectedAtmospherePhotos[0].url} 
              alt={selectedAtmospherePhotos[0].tag} 
              className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out" 
            />
            {/* Horizontal scrim: Darkens left side for crystal-clear text readability while revealing track visual */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/45" />
            {/* Vertical scrim: Protects bottom timetable and adds cinematic vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            {/* Subtle atmospheric glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          </div>
        )}

        <div className="relative z-10 flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch justify-between">
          {/* Left Column: Race Header, Circuit Metadata, Dual-Time Schedule */}
          <div className="space-y-3 sm:space-y-3.5 flex-1 min-w-0">
            {/* Top row: Status Badges Strip */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {isRaceLive && (
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-racing font-bold tracking-wider uppercase bg-red-600/25 text-red-400 border border-red-500/50 shadow-sm flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                  <span>LIVE RACING IN PROGRESS</span>
                </span>
              )}
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm flex items-center gap-1.5 backdrop-blur-md">
                <span>🏁</span>
                <span>{selectedSeason}年 第{selectedRace.round}戦 / 全{activeCalendar.length}戦</span>
              </span>
              {selectedRace.isSprint && (
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-racing font-bold bg-gradient-to-r from-violet-950/80 via-slate-900 to-cyan-950/80 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-950/40 flex items-center gap-1.5 backdrop-blur-md">
                  <span className="text-cyan-400 text-xs sm:text-sm animate-pulse">⚡</span>
                  <span className="tracking-wider">SPRINT</span>
                </span>
              )}
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono text-slate-300 bg-slate-950/60 border border-white/15 flex items-center gap-1.5 backdrop-blur-md">
                <span>📅</span>
                <span>{selectedRace.dates}</span>
              </span>
            </div>

            {/* Main Title Row: Clean Flag + Authoritative Typography */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <span className="text-2xl sm:text-3xl lg:text-4xl shrink-0 drop-shadow-md">{selectedRace.flag}</span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5 sm:gap-2.5 flex-wrap">
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                    {toJapaneseGpName(selectedRace.gpName)}
                  </h1>
                  <span className="font-mono text-[11px] sm:text-xs font-semibold text-slate-300/80 tracking-wider uppercase truncate">
                    {getDisplayCircuitName(selectedRace)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs Ribbon: Clean Structured Pills + Photo Gallery Trigger */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-200 font-mono">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/10 text-slate-200 font-medium flex items-center gap-1 shadow-sm">
                <span>📍</span>
                <span>{selectedRace.city}、{selectedRace.country}</span>
              </span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/10 text-slate-300 flex items-center gap-1 shadow-sm">
                <span>🛣️</span>
                <span>コース: <strong className="text-white font-bold">{selectedRace.lengthKm.toFixed(3)} km</strong></span>
              </span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/10 text-slate-300 flex items-center gap-1 shadow-sm">
                <span>🔄</span>
                <span>周回: <strong className="text-white font-bold">{selectedRace.laps} 周</strong></span>
              </span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/10 text-slate-300 flex items-center gap-1 shadow-sm">
                <span>🛞</span>
                <span>タイヤ: <strong className="text-slate-100 font-sans font-semibold">{selectedRace.pirelliCompounds}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setIs3dModalOpen(true)}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 backdrop-blur-md border border-sky-500/40 text-sky-300 hover:text-white flex items-center gap-1 shadow-sm transition-all cursor-pointer font-bold group"
                title="コース図・3D標高モデルを起動"
              >
                <Map className="w-3 h-3 text-sky-400 group-hover:scale-110 transition-transform" />
                <span>3Dコース ↗</span>
              </button>
              {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAtmosphereModalImage({
                    url: selectedAtmospherePhotos[0].url,
                    caption: selectedAtmospherePhotos[0].caption,
                    tag: \`\${toJapaneseGpName(selectedRace.gpName)} - \${selectedAtmospherePhotos[0].tag}\`
                  })}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 backdrop-blur-md border border-amber-500/40 text-amber-300 hover:text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer font-bold group"
                  title="サーキット現地フォトギャラリーを開く"
                >
                  <Camera className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>現地写真 (2枚) ↗</span>
                </button>
              )}
            </div>

            {/* Sub-view switcher: Dual Timetable vs Weather */}
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setHeroSubView('schedule')}
                    className={\`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap \${
                      heroSubView === 'schedule'
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }\`}
                  >
                    <span>⏱️</span>
                    <span>
                      <span className="hidden sm:inline">公式タイムテーブル</span>
                      <span className="sm:hidden">タイムテーブル</span> ({selectedRace.scheduleJst.length})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroSubView('weather')}
                    className={\`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap \${
                      heroSubView === 'weather'
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }\`}
                  >
                    <span>🌤️</span>
                    <span>
                      <span className="hidden sm:inline">気象・路面予測</span>
                      <span className="sm:hidden">気象・路面</span>
                      {selectedWeather ? \` (\${selectedWeather.airTempC}℃)\` : ''}
                    </span>
                  </button>
                </div>

                {heroSubView === 'schedule' ? (
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/60 backdrop-blur-md border border-white/10 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>JST (日本時間: 生中継観戦用)</span>
                    </span>
                    <span className="text-slate-500">/</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/60 backdrop-blur-md border border-sky-500/20 text-sky-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>現地時間 ({currentTzInfo.tzAbbr})</span>
                    </span>
                  </div>
                ) : selectedWeather ? (
                  <span className="text-[11px] text-slate-300 font-mono bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                    降水確率: <strong className={selectedWeather.rainProb > 30 ? 'text-sky-400' : 'text-slate-200'}>{selectedWeather.rainProb}%</strong>
                  </span>
                ) : null}
              </div>

              {/* View 1: Professional Dual-Time Session Timetable Cards with Frosted Glass */}
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
                        className={\`text-left flex flex-col justify-between p-2 sm:p-2.5 md:p-3 rounded-xl border backdrop-blur-md transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] \${
                          dual.isFinalRace
                            ? 'col-span-2 sm:col-span-1 bg-gradient-to-b from-red-950/65 via-slate-950/80 to-slate-950/95 border-red-500/50 hover:border-red-400 shadow-lg shadow-red-950/30 ring-1 ring-red-500/30 hover:shadow-red-900/40'
                            : 'bg-slate-950/65 hover:bg-slate-900/80 border-white/10 hover:border-sky-500/40 shadow-md'
                        }\`}
                        title={\`クリックして\${s.session}の結果詳細を表示\`}
                      >
                        {/* Session Card Header */}
                        <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-white/[0.08] w-full">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className={\`text-xs font-mono font-bold tracking-wider uppercase truncate \${
                                dual.isFinalRace ? 'text-red-400' : 'text-slate-200'
                              }\`}
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
                            結果詳細↗
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

                          <div className="pt-1 border-t border-white/[0.04]">
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
                <div className="p-3 sm:p-4 rounded-xl bg-slate-950/75 backdrop-blur-md border border-white/10 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 font-mono">気温 (Air)</div>
                      <div className="text-base sm:text-lg font-racing font-black text-amber-300">{selectedWeather.airTempC} ℃</div>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 font-mono">路面温度 (Track)</div>
                      <div className="text-base sm:text-lg font-racing font-black text-rose-300">{selectedWeather.trackTempC} ℃</div>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 font-mono">降水確率 (Rain)</div>
                      <div className={\`text-base sm:text-lg font-racing font-black \${selectedWeather.rainProb > 40 ? 'text-sky-300' : 'text-slate-200'}\`}>
                        {selectedWeather.rainProb} %
                      </div>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-white/5">
                      <div className="text-[10px] text-slate-400 font-mono">湿度 / 気圧</div>
                      <div className="text-xs sm:text-sm font-racing font-bold text-slate-200 mt-1">
                        {selectedWeather.humidity}% / {selectedWeather.pressureHpa}hPa
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 border-t border-white/5 pt-2 flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
                      <span>⛅</span>
                      <span>気象ステータス: {selectedWeather.conditionJa}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      風速: {selectedWeather.windSpeedKmh} km/h ({selectedWeather.windDirection})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Track Map & Countdown Cockpit */}
          <div className="flex flex-col gap-3 w-full lg:w-[330px] xl:w-[360px] shrink-0">
            {/* 1. Circuit Layout Track Map Card (Always visible track layout) */}
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

            {/* 2. Race Countdown or Archive Card */}
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
              <div className="w-full bg-slate-950/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                <div>
                  <div className="text-[10px] font-mono font-bold text-amber-400 mb-2 flex items-center justify-between uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span>🏆</span>
                      <span>{selectedSeason}年 第{selectedRace.round}戦 公式リザルト</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      アーカイブ確定
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.08] shadow-inner space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-sans font-semibold uppercase tracking-wider">
                      決勝ウィナー (Race Winner)
                    </div>
                    <div className="text-sm sm:text-base font-black font-racing text-white flex items-center gap-2">
                      <span className="text-base sm:text-lg">👑</span>
                      <span className="truncate">{selectedRace.winnerNote || '公式アーカイブ'}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      開催日: {selectedRace.dates} | {selectedRace.circuitName}
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>🏛️ FIA Official Archive</span>
                  <span className="text-emerald-400 font-bold">公式記録保存済</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>`;

const before = lines.slice(0, start);
const after = lines.slice(heroCloseIdx + 1);

const result = before.join('\n') + '\n' + newHero + '\n' + after.join('\n');
fs.writeFileSync(path, result, 'utf-8');
console.log('Successfully updated SeasonHub.tsx with Cinematic Backdrop & Scrim Overlay!');
