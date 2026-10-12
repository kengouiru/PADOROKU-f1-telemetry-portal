const fs = require('fs');
const filePath = 'lib/raceSimulationEngine.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix battery SOC jump in standard mode
content = content.replace(
  'tracker.ersBatterySoc = Math.min(95, Math.max(35, tracker.ersBatterySoc + lapRegen));',
  'tracker.ersBatterySoc = Math.min(95, Math.max(5, tracker.ersBatterySoc + lapRegen));'
);

// We should also look at other SOC limits in the if-else block.
// tracker.ersBatterySoc = Math.max(6, tracker.ersBatterySoc - 18);
// It's okay.

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed battery SOC logic in raceSimulationEngine.');
