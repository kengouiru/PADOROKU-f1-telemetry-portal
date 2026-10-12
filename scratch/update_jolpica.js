const fs = require('fs');
let text = fs.readFileSync('lib/jolpicaRaceSummary.ts', 'utf8');

if (!text.includes('fetchLiveOpenF1RaceSummary')) {
  text = "import { fetchLiveOpenF1RaceSummary } from './openf1LiveResult';\n" + text;
  text = text.replace(
    /export async function fetchRaceSummary\(season: string, round: number, signal\?: AbortSignal\): Promise<RaceSummary \| null> \{/,
    `export async function fetchRaceSummary(season: string, round: number, signal?: AbortSignal): Promise<RaceSummary | null> {
  try {
    // Phase B: Try OpenF1 first for real-time results (especially useful immediately after a race)
    const live = await fetchLiveOpenF1RaceSummary(season, round);
    if (live && live.podium.length > 0) return live;
  } catch (e) {
    console.error('OpenF1 Live Result fallback to Jolpica', e);
  }`
  );
  fs.writeFileSync('lib/jolpicaRaceSummary.ts', text, 'utf8');
  console.log('Updated fetchRaceSummary to use OpenF1 fallback');
}
