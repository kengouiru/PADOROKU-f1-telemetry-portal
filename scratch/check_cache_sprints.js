const fs = require('fs');
const path = require('path');

const years = [2021, 2022, 2023, 2024, 2025];
for (const y of years) {
  const p = path.join(__dirname, 'historical_cache', `${y}_full.json`);
  if (!fs.existsSync(p)) continue;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`\n=== Year ${y} ===`);
  const sprints = [];
  for (const r of d.races) {
    // Check if race has Sprint in race details or if sprint result exists
    // Also check Ergast schedule
    sprints.push({ round: r.round, name: r.raceName });
  }
}
