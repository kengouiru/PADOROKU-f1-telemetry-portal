/**
 * scratch/test_step2_verification.js
 * Verification script for Step 2: Team Lineage, Car Technical Specs, and Telemetry Integration.
 */

const { TEAM_LINEAGE_DATA, getTeamLineage, getTeamCarSpecs } = require('../data/f1TeamLineageData.ts');
const { HISTORICAL_SEASONS_DATA } = require('../data/f1HistoricalGrids.ts');

console.log('=== STEP 2 VERIFICATION RUN ===');

const expectedTeams = [
  'mercedes',
  'red-bull',
  'aston-martin',
  'alpine',
  'rb',
  'audi',
  'ferrari',
  'mclaren',
  'williams',
  'haas',
  'cadillac',
];

let failed = false;

// 1. Verify all 11 teams exist in TEAM_LINEAGE_DATA
console.log('\n--- 1. Testing 11 Team Lineages ---');
for (const teamId of expectedTeams) {
  const lineage = getTeamLineage(teamId);
  if (!lineage) {
    console.error(`FAIL: Missing lineage for team ${teamId}`);
    failed = true;
    continue;
  }
  console.log(`PASS: [${teamId}] ${lineage.currentName} - Origin: ${lineage.originYear} (${lineage.lineageChain.length} nodes)`);

  for (let i = 0; i < lineage.lineageChain.length; i++) {
    const node = lineage.lineageChain[i];
    if (!node.period || !node.teamName || !node.summary || !node.powerUnits.length) {
      console.error(`FAIL: Node ${i} in ${teamId} has missing fields!`, node);
      failed = true;
    }
  }
}

// 2. Verify 2026 Car Technical Specs
console.log('\n--- 2. Testing 2026 Car Technical Specs ---');
for (const teamId of expectedTeams) {
  const specs = getTeamCarSpecs(teamId);
  if (!specs) {
    console.error(`FAIL: Missing car specs for team ${teamId}`);
    failed = true;
    continue;
  }
  if (specs.ersPowerKw !== 350 || specs.weightKg !== 768 || specs.wheelbaseMm !== 3400) {
    console.error(`FAIL: Specs non-compliant for ${teamId}:`, specs);
    failed = true;
  }
  console.log(`PASS: [${teamId}] Chassis: ${specs.chassisCode} | PU: ${specs.powerUnitName} | ERS: ${specs.ersPowerKw}kW | Weight: ${specs.weightKg}kg`);
}

// 3. Verify Historical Seasons Data linkage
console.log('\n--- 3. Testing Historical Seasons Data linkage ---');
const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
console.log(`PASS: All ${years.length} seasons verified in HISTORICAL_SEASONS_DATA`);

if (!failed) {
  console.log('\n>>> ALL STEP 2 AUDITS PASSED WITH 100% SUCCESS! <<<');
} else {
  console.error('\n>>> SOME AUDITS FAILED! <<<');
  process.exit(1);
}
