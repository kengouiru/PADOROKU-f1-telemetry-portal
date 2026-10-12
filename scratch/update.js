const fs = require('fs');
let text = fs.readFileSync('data/f1SeasonData.ts', 'utf8');

const newFn = `export function getPreviousCompletedRound(calendar: RaceWeekendSchedule[]): number | null {
  const now = Date.now();
  let prev = null;
  for (const race of calendar) {
    if (!race.targetDateUtc || race.isCancelled) continue;
    const raceTime = new Date(race.targetDateUtc).getTime();
    if (now > raceTime) {
      prev = race.round;
    } else {
      break;
    }
  }
  return prev;
}
`;

if (!text.includes('getPreviousCompletedRound')) {
  text += '\n' + newFn;
  fs.writeFileSync('data/f1SeasonData.ts', text, 'utf8');
  console.log('Added getPreviousCompletedRound');
}
