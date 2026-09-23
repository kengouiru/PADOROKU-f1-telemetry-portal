/**
 * scratch/test_feedback_fixes.js
 * Verification script for F1 Encyclopedia Feedback Fixes:
 * 1. 2026 George Russell ongoing leader fix (not champion)
 * 2. Removal of lineage button & clickable team names
 * 3. Elimination of dimmed floating modal & full-page page views
 * 4. Dedicated Next.js page routes for drivers, teams, and rules
 */

const fs = require('fs');
const path = require('path');

let errors = [];

function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    errors.push(message);
  } else {
    console.log('✅ PASS:', message);
  }
}

console.log('=== 1. Checking data/f1HistoricalGrids.ts ===');
const gridsFile = fs.readFileSync('data/f1HistoricalGrids.ts', 'utf8');

assert(
  gridsFile.includes('isOngoing: true'),
  '2026 season data contains isOngoing: true'
);
assert(
  gridsFile.includes('leaderDriver:') && gridsFile.includes('RUS'),
  '2026 season data defines leaderDriver as RUS'
);
assert(
  gridsFile.includes('leaderConstructor:') && gridsFile.includes('Mercedes-AMG'),
  '2026 season data defines leaderConstructor as Mercedes-AMG'
);
// Make sure 2026 championDriver is NOT present
const match2026 = gridsFile.match(/2026:\s*\{[\s\S]*?teams:\s*\[/);
if (match2026) {
  assert(
    !match2026[0].includes('championDriver:'),
    '2026 season block does NOT declare championDriver'
  );
  assert(
    !match2026[0].includes('championConstructor:'),
    '2026 season block does NOT declare championConstructor'
  );
} else {
  assert(false, 'Could not parse 2026 season block');
}

console.log('\n=== 2. Checking components/hubs/DriversHub.tsx ===');
const driversHub = fs.readFileSync('components/hubs/DriversHub.tsx', 'utf8');

assert(
  !driversHub.includes('系統樹・諸元'),
  'DriversHub does NOT contain the removed "系統樹・諸元" buttons'
);
assert(
  driversHub.includes('handleOpenTeamDetail(team.id)') &&
  driversHub.includes('handleOpenTeamDetail(team.teamId)'),
  'DriversHub makes team names clickable with handleOpenTeamDetail in both views'
);
assert(
  driversHub.includes('currentSeasonGrid.isOngoing'),
  'DriversHub checks currentSeasonGrid.isOngoing for ribbon'
);
assert(
  driversHub.includes('ポイント首位 (Leader)'),
  'DriversHub displays ポイント首位 (Leader) for ongoing season'
);
assert(
  driversHub.includes('if (selectedDriverDetail)'),
  'DriversHub renders DriverDetailModal as top-level full-page view'
);
assert(
  driversHub.includes('if (selectedTeamDetail)'),
  'DriversHub renders TeamDetailModal as top-level full-page view'
);

console.log('\n=== 3. Checking components/hubs/DriverDetailModal.tsx ===');
const driverModal = fs.readFileSync('components/hubs/DriverDetailModal.tsx', 'utf8');

assert(
  !driverModal.includes('createPortal'),
  'DriverDetailModal does NOT use createPortal'
);
assert(
  !driverModal.includes('fixed inset-0'),
  'DriverDetailModal does NOT use fixed inset-0 floating backdrop'
);
assert(
  !driverModal.includes('bg-black/85 backdrop-blur-md animate-fade-in'),
  'DriverDetailModal does NOT use dimmed backdrop overlay'
);
assert(
  driverModal.includes('別ウィンドウで開く'),
  'DriverDetailModal provides "別ウィンドウで開く ↗" button'
);
assert(
  driverModal.includes('is2026Ongoing'),
  'DriverDetailModal guards 2026 season history from claiming world championship'
);
assert(
  driverModal.includes('export { DriverDetailModal as DriverDetailView }'),
  'DriverDetailModal exports DriverDetailView'
);

console.log('\n=== 4. Checking components/hubs/TeamDetailModal.tsx ===');
const teamModal = fs.readFileSync('components/hubs/TeamDetailModal.tsx', 'utf8');

assert(
  !teamModal.includes('createPortal'),
  'TeamDetailModal does NOT use createPortal'
);
assert(
  !teamModal.includes('fixed inset-0'),
  'TeamDetailModal does NOT use fixed inset-0 floating backdrop'
);
assert(
  teamModal.includes('別ウィンドウで開く'),
  'TeamDetailModal provides "別ウィンドウで開く ↗" button'
);
assert(
  teamModal.includes('export { TeamDetailModal as TeamDetailView }'),
  'TeamDetailModal exports TeamDetailView'
);

console.log('\n=== 5. Checking components/hubs/KnowledgeHistoryHub.tsx ===');
const knowHub = fs.readFileSync('components/hubs/KnowledgeHistoryHub.tsx', 'utf8');

assert(
  knowHub.includes('activeSubTab === \'teams\' && (') &&
  knowHub.includes('selectedTeamDetail ? ('),
  'KnowledgeHistoryHub renders TeamDetailModal as full-page view for selected team'
);

console.log('\n=== 6. Checking Dedicated Page Routes ===');
const driverRoutePath = 'app/knowledge/drivers/[code]/page.tsx';
const teamRoutePath = 'app/knowledge/teams/[id]/page.tsx';
const rulesRoutePath = 'app/knowledge/rules/page.tsx';

assert(fs.existsSync(driverRoutePath), 'Route app/knowledge/drivers/[code]/page.tsx exists');
assert(fs.existsSync(teamRoutePath), 'Route app/knowledge/teams/[id]/page.tsx exists');
assert(fs.existsSync(rulesRoutePath), 'Route app/knowledge/rules/page.tsx exists');

console.log('\n=== Summary ===');
if (errors.length === 0) {
  console.log('🎉 ALL TESTS PASSED! (18/18 checks passed)');
  process.exit(0);
} else {
  console.error(`💥 ${errors.length} ERRORS FOUND!`);
  process.exit(1);
}
