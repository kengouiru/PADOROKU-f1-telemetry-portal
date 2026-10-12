const fs = require('fs');
const filePath = 'lib/raceSimulationEngine.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Fix fuelPaceBonus
// Find: const fuelPaceBonus = -((totalLaps - currentLap) * 0.033);
// Replace: const fuelPaceBonus = (tracker.fuelKg / 10) * 0.3; (which is roughly tracker.fuelKg * 0.03)
content = content.replace(
  'const fuelPaceBonus = -((totalLaps - currentLap) * 0.033);',
  'const fuelPaceBonus = (tracker.fuelKg * 0.033);'
);

// 2. Fix tyreWearPacePenalty
// Find: tracker.tyreAge * tyreProp.wearRate * circuit.tyreAggression * wearMultiplier * wearScale * combinedPhysicsFactor
// Replace with something based on wearPercent directly, to avoid jumps when combinedPhysicsFactor changes
content = content.replace(
  /const tyreWearPacePenalty =[\s\S]*?combinedPhysicsFactor;/m,
  'const tyreWearPacePenalty = (wearPercent / 100) * 3.5 * wearMultiplier;'
);

// 3. Fix SC frequency
// Find: if (roll < incidentRiskPercent * 0.75) {
// Replace: if (roll < (incidentRiskPercent / totalLaps) * 0.75) {
content = content.replace(
  /if \(roll < incidentRiskPercent \* 0\.75\) \{/g,
  'if (roll < (incidentRiskPercent / totalLaps) * 0.75) {'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed raceSimulationEngine formulas.');
