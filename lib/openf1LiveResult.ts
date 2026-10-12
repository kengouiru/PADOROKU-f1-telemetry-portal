import { fetchSessions, fetchSessionResult, fetchDrivers } from './openf1Api';
import type { RaceSummary, RaceSummaryEntry } from './jolpicaRaceSummary';

export async function fetchLiveOpenF1RaceSummary(season: string, round: number): Promise<RaceSummary | null> {
  try {
    const year = parseInt(season, 10) === 2026 ? 2024 : parseInt(season, 10);
    const sessions = await fetchSessions(year);
    
    // Sort all sessions for this year by date
    const sortedSessions = sessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
    
    // Group by meeting_key (which corresponds to a round/weekend)
    const meetings = new Map<number, typeof sessions>();
    for (const s of sortedSessions) {
      if (!meetings.has(s.meeting_key)) meetings.set(s.meeting_key, []);
      meetings.get(s.meeting_key)!.push(s);
    }
    
    const meetingKeys = Array.from(meetings.keys());
    const meetingKey = meetingKeys[round - 1]; // 1-indexed round
    if (!meetingKey) return null;
    
    const weekendSessions = meetings.get(meetingKey)!;
    const raceSession = weekendSessions.find(s => s.session_name === 'Race');
    const qualiSession = weekendSessions.find(s => s.session_name === 'Qualifying');
    
    if (!raceSession) return null;
    
    // Fetch Race Results
    let results = await fetchSessionResult(raceSession.session_key).catch(() => []);
    let source = 'OpenF1 Live (Race)';
    let isQualiOnly = false;
    
    // If no race results, try Qualifying
    if (!results || results.length === 0) {
      if (!qualiSession) return null;
      results = await fetchSessionResult(qualiSession.session_key).catch(() => []);
      source = 'OpenF1 Live (Qualifying)';
      isQualiOnly = true;
    }
    
    if (!results || results.length === 0) return null;

    const drivers = await fetchDrivers(raceSession.session_key).catch(() => []);
    const driverMap = new Map(drivers.map(d => [d.driver_number, d]));

    const podium: RaceSummaryEntry[] = results
      .filter(r => r.position !== null)
      .sort((a, b) => a.position! - b.position!)
      .map(r => {
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
