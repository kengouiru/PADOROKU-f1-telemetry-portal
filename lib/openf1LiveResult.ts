import { fetchSessions, fetchSessionResult, fetchDrivers } from './openf1Api';
import type { RaceSummary, RaceSummaryEntry } from './jolpicaRaceSummary';
import { getSeasonCalendar, type SeasonYear } from '@/data/f1SeasonData';

export async function fetchLiveOpenF1RaceSummary(season: string, round: number): Promise<RaceSummary | null> {
  try {
    const year = parseInt(season, 10);
    if (isNaN(year)) return null;
    const sessions = await fetchSessions(year);
    if (!sessions || sessions.length === 0) return null;

    // Sort all sessions for this year by date
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );

    // Group by meeting_key (which corresponds to a weekend) and exclude Pre-Season Testing
    const meetings = new Map<number, typeof sessions>();
    for (const s of sortedSessions) {
      if (!meetings.has(s.meeting_key)) meetings.set(s.meeting_key, []);
      meetings.get(s.meeting_key)!.push(s);
    }

    const raceMeetings = Array.from(meetings.values()).filter((m) =>
      m.some((s) => s.session_name === 'Race' || s.session_name === 'Qualifying')
    );

    // Match by targetDateUtc from calendar when available, otherwise by round index
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
    if (!weekendSessions) return null;

    const raceSession = weekendSessions.find((s) => s.session_name === 'Race');
    const qualiSession = weekendSessions.find((s) => s.session_name === 'Qualifying');

    if (!raceSession) return null;

    // Do not query future sessions that haven't started yet
    if (new Date(raceSession.date_start).getTime() > Date.now() && (!qualiSession || new Date(qualiSession.date_start).getTime() > Date.now())) {
      return null;
    }

    // Fetch Race Results
    let results = await fetchSessionResult(raceSession.session_key).catch(() => []);
    let source = 'OpenF1 Official Timing (Race)';
    let isQualiOnly = false;

    // If no race results yet, try Qualifying
    if (!results || results.length === 0) {
      if (!qualiSession || new Date(qualiSession.date_start).getTime() > Date.now()) return null;
      results = await fetchSessionResult(qualiSession.session_key).catch(() => []);
      source = 'OpenF1 Official Timing (Qualifying)';
      isQualiOnly = true;
    }

    if (!results || results.length === 0) return null;

    const drivers = await fetchDrivers(raceSession.session_key).catch(() => []);
    const driverMap = new Map(drivers.map((d) => [d.driver_number, d]));

    const podium: RaceSummaryEntry[] = results
      .filter((r) => r.position !== null)
      .sort((a, b) => a.position! - b.position!)
      .slice(0, 3)
      .map((r) => {
        const d = driverMap.get(r.driver_number);
        let note = isQualiOnly ? 'Q' + (r.position || '') : `${r.number_of_laps || 0} Laps`;
        if (r.dnf) note = 'DNF';
        if (r.dsq) note = 'DSQ';
        if (r.dns) note = 'DNS';

        return {
          position: r.position!,
          code: d?.name_acronym || r.driver_number.toString(),
          name: d?.full_name || 'Unknown',
          team: d?.team_name || 'Unknown',
          constructorId: d?.team_name?.toLowerCase().replace(/ /g, '_') || 'unknown',
          note,
        };
      });

    return {
      season,
      round,
      raceName: raceSession.meeting_name || raceSession.location || `Round ${round}`,
      podium,
      pole: null,
      fastestLap: null,
      source,
    };
  } catch (e) {
    console.error('Failed to fetch OpenF1 live result', e);
    return null;
  }
}
