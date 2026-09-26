const fs = require('fs');

const code = fs.readFileSync('data/f1SeasonData.ts', 'utf8');

// Find all occurrences of isSprint in 2026 and 2025
function extractSprints(sectionName) {
  const parts = code.split(sectionName);
  if (parts.length < 2) return [];
  const sec = parts[1].split('export const')[0];
  const rounds = [];
  const lines = sec.split('\n');
  let currentRound = null;
  let currentGp = null;
  for (const line of lines) {
    const roundMatch = line.match(/"round":\s*(\d+)/);
    if (roundMatch) currentRound = parseInt(roundMatch[1], 10);
    const gpMatch = line.match(/"gpName":\s*"([^"]+)"/);
    if (gpMatch) currentGp = gpMatch[1];
    if (line.includes('"isSprint": true') || line.includes('isSprint: true')) {
      rounds.push({ round: currentRound, gpName: currentGp });
    }
  }
  return rounds;
}

console.log('2026 Sprints:', extractSprints('SEASON_2026_CALENDAR'));
console.log('2025 Sprints:', extractSprints('SEASON_2025_CALENDAR'));
