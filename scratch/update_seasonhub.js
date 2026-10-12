const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');
text = text.replace(
  "if (selectedSeason !== '2026' || raceClassification2026 || !raceFinished || selectedRace.isCancelled)",
  "if (selectedSeason !== '2026' || raceClassification2026 || selectedRace.isCancelled) // Try to fetch live Quali/Race results even if raceFinished is false"
);
fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
console.log('Updated SeasonHub.tsx fetch condition');
