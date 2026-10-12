const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');

// 1. Add getPreviousCompletedRound to imports from f1SeasonData
if (!text.includes('getPreviousCompletedRound')) {
  text = text.replace(/getNextUpcomingRound,/, 'getNextUpcomingRound,\n  getPreviousCompletedRound,');
}

// 2. We want to show a "Previous Race" section if there is a previous race.
// It will be placed just above "1. NEXT RACE HERO".
// Let's create the PreviousRaceHero component and insert it above SeasonHub.

const prevRaceHeroStr = `
// ─────────────────────────────────────────────────────────────
// PREVIOUS RACE HERO (Phase A)
// ─────────────────────────────────────────────────────────────
const PreviousRaceHero = React.memo(function PreviousRaceHero({
  race,
  circuitId,
  isLive,
}: {
  race: RaceWeekendSchedule;
  circuitId: string;
  isLive: boolean;
}) {
  const trackData = useMemo(() => CIRCUIT_TRACK_MAPS[circuitId] || GENERIC_TRACK, [circuitId]);
  const atmosphere = useMemo(() => getAtmospherePhotos(circuitId, race.gpName), [circuitId, race.gpName]);

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900 shadow-xl overflow-hidden mb-8 group">
      <div className="relative h-48 sm:h-56 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-5">
        {/* Background Image */}
        {atmosphere && atmosphere.length > 0 ? (
          <div className="absolute inset-0">
            <img 
              src={atmosphere[0].url} 
              alt={atmosphere[0].tag} 
              className="w-full h-full object-cover brightness-[0.6] contrast-125 saturate-50 transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-slate-900/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
        )}

        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-slate-900/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <span>🏁 PREVIOUS RACE (終了)</span>
          </span>
          <span className="text-white/60 text-xs font-mono">ROUND {race.round}</span>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl"><FlagIcon emojiFlag={race.flag} /></span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                {toJapaneseGpName(race.gpName)}
              </h2>
            </div>
            <p className="text-sm font-mono text-slate-300 drop-shadow-md">{race.circuitName}</p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold font-racing flex items-center gap-2 transition-all opacity-50 cursor-not-allowed">
              <PlayCircle className="w-4 h-4" />
              レース振り返り (開発中)
            </button>
            <span className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-bold">
              // TODO: Phase B 
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

`;

// Insert the component before SeasonHub definition
if (!text.includes('PreviousRaceHero = React.memo')) {
  text = text.replace(/export default function SeasonHub/, prevRaceHeroStr + 'export default function SeasonHub');
}

// 3. We need to compute previousRace inside SeasonHub
if (!text.includes('const previousRace = useMemo')) {
  const newMemo = `
  const previousRace = useMemo(() => {
    const prevRound = getPreviousCompletedRound(activeCalendar);
    if (!prevRound) return null;
    // Don't show it if the user selected a specific past round to view in the hero, 
    // or if the hero is currently showing it.
    // Actually, always show it as a separate section if we want it to be a permanent block.
    // Let's show it if it exists and is different from selectedRound.
    if (prevRound === selectedRound) return null;
    return activeCalendar.find(r => r.round === prevRound);
  }, [activeCalendar, selectedRound]);
`;
  text = text.replace(/const maxTeamPoints = .*;/g, "$&\n" + newMemo);
}

// 4. Inject it into the JSX before NEXT RACE HERO
const insertionTarget = `{/* ─────────────────────────────────────────────────────────────
          1. NEXT RACE HERO: CINEMATIC SHOWCASE & COMMAND COCKPIT
          ───────────────────────────────────────────────────────────── */}`;
const insertionReplacement = `
      {previousRace && (
        <PreviousRaceHero 
          race={previousRace} 
          circuitId={getCircuitIdForRace(previousRace)} 
          isLive={false} 
        />
      )}
      ` + insertionTarget;

if (text.includes(insertionTarget) && !text.includes('<PreviousRaceHero')) {
  text = text.replace(insertionTarget, insertionReplacement);
}

fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
console.log('Updated SeasonHub with PreviousRaceHero');
