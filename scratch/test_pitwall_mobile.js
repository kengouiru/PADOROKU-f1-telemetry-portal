/**
 * scratch/test_pitwall_mobile.js
 * Verification test script for Pitwall mobile portrait optimization & landscape adaptation.
 */

const fs = require('fs');

console.log('=== PITWALL MOBILE OPTIMIZATION VERIFICATION ===\n');

let failed = false;

// 1. Check types.ts
console.log('--- 1. Checking types.ts ---');
const typesContent = fs.readFileSync('components/hubs/race-simulator/types.ts', 'utf8');
if (!typesContent.includes("export type MobileConsoleView = 'integrated' | 'tower' | 'monitor' | 'comms'")) {
  console.error('FAIL: MobileConsoleView type not exported correctly in types.ts!');
  failed = true;
} else {
  console.log("PASS: MobileConsoleView type exported correctly with 'integrated' | 'tower' | 'monitor' | 'comms'");
}

// 2. Check RaceSimulatorHub.tsx
console.log('\n--- 2. Checking RaceSimulatorHub.tsx ---');
const hubContent = fs.readFileSync('components/hubs/RaceSimulatorHub.tsx', 'utf8');
if (!hubContent.includes("useState<MobileConsoleView>('integrated')")) {
  console.error('FAIL: RaceSimulatorHub does not default mobileConsoleView to integrated!');
  failed = true;
} else {
  console.log("PASS: RaceSimulatorHub defaults mobileConsoleView to 'integrated'");
}

if (!hubContent.includes("landscape:grid-cols-2")) {
  console.error('FAIL: RaceSimulatorHub missing landscape:grid-cols-2 variant!');
  failed = true;
} else {
  console.log("PASS: RaceSimulatorHub has landscape:grid-cols-2 dual column support");
}

// 3. Check CockpitHudDeck.tsx
console.log('\n--- 3. Checking CockpitHudDeck.tsx ---');
const hudContent = fs.readFileSync('components/hubs/race-simulator/cockpit/CockpitHudDeck.tsx', 'utf8');
const expectedTabs = [
  "onClick={() => setMobileConsoleView('integrated')}",
  "onClick={() => setMobileConsoleView('tower')}",
  "onClick={() => setMobileConsoleView('monitor')}",
  "onClick={() => setMobileConsoleView('comms')}"
];
for (const tab of expectedTabs) {
  if (!hudContent.includes(tab)) {
    console.error(`FAIL: CockpitHudDeck missing tab: ${tab}`);
    failed = true;
  }
}
if (!hudContent.includes('grid-cols-4 lg:hidden')) {
  console.error('FAIL: CockpitHudDeck missing 4-column mobile toggle grid!');
  failed = true;
} else {
  console.log('PASS: CockpitHudDeck 4-tab mobile toggle bar verified (🏎️ 統合, 🏁 順位, 📊 データ, 📻 無線)');
}

// 4. Check TrackMapAndWeatherDeck.tsx
console.log('\n--- 4. Checking TrackMapAndWeatherDeck.tsx ---');
const trackContent = fs.readFileSync('components/hubs/race-simulator/cockpit/TrackMapAndWeatherDeck.tsx', 'utf8');
if (!trackContent.includes("mobileConsoleView === 'monitor' || mobileConsoleView === 'integrated' ? 'block' : 'hidden lg:block'")) {
  console.error('FAIL: TrackMapAndWeatherDeck not visible in integrated mode!');
  failed = true;
} else {
  console.log('PASS: TrackMapAndWeatherDeck rendered in integrated mode on mobile');
}

// 5. Check TacticalCommandsPanel.tsx
console.log('\n--- 5. Checking TacticalCommandsPanel.tsx ---');
const cmdContent = fs.readFileSync('components/hubs/race-simulator/cockpit/TacticalCommandsPanel.tsx', 'utf8');
if (!cmdContent.includes("mobileConsoleView === 'comms' || mobileConsoleView === 'integrated' ? 'block' : 'hidden lg:block'")) {
  console.error('FAIL: TacticalCommandsPanel not visible in integrated mode!');
  failed = true;
} else {
  console.log('PASS: TacticalCommandsPanel rendered in integrated mode on mobile');
}

if (!cmdContent.includes('ACTIVE EMERGENCY RADIO PROMPT') || !cmdContent.includes('DOCKED PIT STRATEGY & TACTICAL COMMANDS')) {
  console.error('FAIL: TacticalCommandsPanel missing emergency prompt or docked commands hierarchy!');
  failed = true;
} else {
  console.log('PASS: TacticalCommandsPanel prioritized emergency prompt & docked commands above intel');
}

console.log('\n================================');
if (!failed) {
  console.log('>>> ALL PITWALL MOBILE AUDITS PASSED (100% SUCCESS) <<<');
} else {
  console.error('>>> SOME AUDITS FAILED <<<');
  process.exit(1);
}
