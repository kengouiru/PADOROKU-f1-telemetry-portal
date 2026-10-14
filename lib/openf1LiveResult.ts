import { fetchSessions, fetchSessionResult, fetchDrivers } from './openf1Api';
import type { RaceSummary, RaceSummaryEntry } from './jolpicaRaceSummary';
import type { SessionDriverResult } from './sessionResultsService';
import { getSeasonCalendar, type SeasonYear } from '@/data/f1SeasonData';

export interface LiveOpenF1Summary extends RaceSummary {
  verificationStatus: 'OFFICIAL' | 'PROVISIONAL';
  fullResults?: SessionDriverResult[];
}

/**
 * Resolves the OpenF1 weekend sessions for a given season and round,
 * excluding pre-season testing and matching by targetDateUtc when available.
 */
async function resolveWeekendSessions(year: number, season: string, round: number) {
  const sessions = await fetchSessions(year);
  if (!sessions || sessions.length === 0) return null;

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
  );

  const meetings = new Map<number, typeof sessions>();
  for (const s of sortedSessions) {
    if (!meetings.has(s.meeting_key)) meetings.set(s.meeting_key, []);
    meetings.get(s.meeting_key)!.push(s);
  }

  const raceMeetings = Array.from(meetings.values()).filter((m) =>
    m.some((s) => s.session_name === 'Race' || s.session_name === 'Qualifying')
  );

  const calendar = getSeasonCalendar(season as SeasonYear);
  const calRace = calendar.find((r) => r.round === round);
  let weekendSessions: typeof sessions | undefined;

  if (calRace?.targetDateUtc) {
    const targetMs = new Date(calRace.targetDateUtc).getTime();
    const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
    weekendSessions = raceMeetings.find((m) => {
      const raceS = m.find((s) => s.session_name === 'Race') || m[m.length - 1];
      return Math.abs(new Date(raceS.date_start).getTime() - targetMs) <= FOUR_DAYS_MS;
    });
  }

  if (!weekendSessions) {
    weekendSessions = raceMeetings[round - 1];
  }
  return weekendSessions || null;
}

export async function fetchLiveOpenF1RaceSummary(season: string, round: number): Promise<LiveOpenF1Summary | null> {
  try {
    const year = parseInt(season, 10);
    if (isNaN(year)) return null;

    const weekendSessions = await resolveWeekendSessions(year, season, round);
    if (!weekendSessions) return null;

    const raceSession = weekendSessions.find((s) => s.session_name === 'Race');
    const qualiSession = weekendSessions.find((s) => s.session_name === 'Qualifying');

    if (!raceSession) return null;

    // Do not query future sessions that haven't started yet
    if (
      new Date(raceSession.date_start).getTime() > Date.now() &&
      (!qualiSession || new Date(qualiSession.date_start).getTime() > Date.now())
    ) {
      return null;
    }

    let results = await fetchSessionResult(raceSession.session_key).catch(() => []);
    let source = 'OpenF1 Live Timing (PROVISIONAL Race)';
    let isQualiOnly = false;
    let activeSessionKey = raceSession.session_key;

    if (!results || results.length === 0) {
      if (!qualiSession || new Date(qualiSession.date_start).getTime() > Date.now()) return null;
      results = await fetchSessionResult(qualiSession.session_key).catch(() => []);
      source = 'OpenF1 Live Timing (PROVISIONAL Qualifying)';
      isQualiOnly = true;
      activeSessionKey = qualiSession.session_key;
    }

    if (!results || results.length === 0) return null;

    const drivers = await fetchDrivers(activeSessionKey).catch(() => []);
    const driverMap = new Map(drivers.map((d) => [d.driver_number, d]));

    const sorted = results
      .filter((r) => r.position !== null)
      .sort((a, b) => a.position! - b.position!);

    const podium: RaceSummaryEntry[] = sorted.slice(0, 3).map((r) => {
      const d = driverMap.get(r.driver_number);
      let note = isQualiOnly ? 'Q' + (r.position || '') : `${r.number_of_laps || 0} Laps`;
      if (r.dnf) note = 'DNF';
      if (r.dsq) note = 'DSQ';
      if (r.dns) note = 'DNS';

      return {
        position: r.position!,
        code: d?.name_acronym || r.driver_number.toString(),
        name: d?.full_name || `#${r.driver_number}`,
        team: d?.team_name || 'F1 Team',
        constructorId: d?.team_name?.toLowerCase().replace(/ /g, '_') || 'unknown',
        note,
      };
    });

    const fullResults: SessionDriverResult[] = sorted.map((r) => {
      const d = driverMap.get(r.driver_number);
      const status: SessionDriverResult['status'] = r.dsq
        ? 'DSQ'
        : r.dns
        ? 'DNS'
        : r.dnf
        ? 'RETIRED'
        : 'FINISHED';
      const rawGap = (r as { gap_to_leader?: number | string | Array<number | string> }).gap_to_leader;
      const gapVal = Array.isArray(rawGap) ? rawGap[rawGap.length - 1] : rawGap;
      const gapStr =
        r.position === 1
          ? 'WINNER'
          : typeof gapVal === 'number'
          ? `+${gapVal.toFixed(3)}s`
          : typeof gapVal === 'string'
          ? gapVal
          : status !== 'FINISHED'
          ? status
          : '-';

      return {
        position: r.position!,
        driverCode: d?.name_acronym || String(r.driver_number),
        driverName: d?.full_name || `#${r.driver_number}`,
        driverNumber: r.driver_number,
        teamName: d?.team_name || 'F1 Team',
        teamColor: d?.team_colour ? `#${d.team_colour.replace('#', '')}` : '#94a3b8',
        bestLapTime: '-',
        gapToLeader: gapStr,
        lapsCompleted: r.number_of_laps ?? 0,
        status,
      };
    });

    return {
      season,
      round,
      raceName: raceSession.meeting_name || raceSession.location || `Round ${round}`,
      podium,
      pole: isQualiOnly && podium[0] ? { code: podium[0].code, time: '-' } : null,
      fastestLap: null,
      source,
      verificationStatus: 'PROVISIONAL',
      fullResults,
    };
  } catch (e) {
    console.error('Failed to fetch OpenF1 live result', e);
    return null;
  }
}
