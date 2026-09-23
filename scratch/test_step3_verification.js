/**
 * scratch/test_step3_verification.js
 * Comprehensive automated verification script for Step 3:
 * Hall of Fame Legends Expansion, Career Timelines, and Multi-Axis Comparison Integration.
 */

const fs = require('fs');

console.log('=== STEP 3 VERIFICATION RUN ===\n');

let failed = false;

// 1. Check data/f1KnowledgeData.ts
console.log('--- 1. Checking f1KnowledgeData.ts drivers & structures ---');
const knowledgeContent = fs.readFileSync('./data/f1KnowledgeData.ts', 'utf8');

// Parse driver codes by looking for code: '...' or code: "..."
const driverCodeRegex = /code:\s*['"]([A-Z0-9]{3})['"]/g;
const allCodes = [];
let match;
while ((match = driverCodeRegex.exec(knowledgeContent)) !== null) {
  // Only count driver codes inside KNOWLEDGE_DRIVERS (before the exports end of drivers)
  if (!allCodes.includes(match[1])) {
    allCodes.push(match[1]);
  }
}

console.log(`Found ${allCodes.length} unique driver codes in f1KnowledgeData.ts`);

const expectedLegends = ['SEN', 'MSC', 'RIC', 'PRO', 'LAU', 'VET', 'RAI', 'MAN', 'HAK'];
const expectedCurrent = [
  'VER', 'PER', 'HAM', 'RUS', 'LEC', 'SAI', 'NOR', 'PIA',
  'ALO', 'STR', 'GAS', 'OCO', 'ALB', 'TSU', 'BOT', 'ZHO',
  'MAG', 'HUL', 'SAR', 'ANT', 'DOO', 'BEA', 'BOR', 'COL', 'HAD', 'LAW'
];

for (const code of expectedLegends) {
  if (!allCodes.includes(code)) {
    console.error(`FAIL: Legend ${code} is missing from f1KnowledgeData!`);
    failed = true;
  } else {
    // Check specific fields for this legend
    const codeIdx = knowledgeContent.indexOf(`code: '${code}'`) !== -1 
      ? knowledgeContent.indexOf(`code: '${code}'`) 
      : knowledgeContent.indexOf(`code: "${code}"`);
    const nextDriverIdx = knowledgeContent.indexOf('\n  {', codeIdx);
    const block = knowledgeContent.slice(codeIdx, nextDriverIdx !== -1 ? nextDriverIdx : codeIdx + 15000);

    const hasHistory = block.includes('seasonHistory: [');
    const hasStyle = block.includes('drivingStyle: {');
    const hasEng = block.includes('engineeringPreference: {');
    const hasRefs = block.includes('references: [');
    const hasBio = block.includes('biography: {');

    if (!hasHistory || !hasStyle || !hasEng || !hasRefs || !hasBio) {
      console.error(`FAIL: Legend ${code} missing fields: History=${hasHistory}, Style=${hasStyle}, Eng=${hasEng}, Refs=${hasRefs}, Bio=${hasBio}`);
      failed = true;
    } else {
      console.log(`PASS: Legend [${code}] verified with seasonHistory, drivingStyle, engineeringPreference, references, biography`);
    }
  }
}

// 2. Check data/driverComparisonData.ts
console.log('\n--- 2. Checking driverComparisonData.ts ---');
const compContent = fs.readFileSync('./data/driverComparisonData.ts', 'utf8');

for (const code of expectedLegends) {
  if (!compContent.includes(`${code}: {`) && !compContent.includes(`'${code}': {`)) {
    console.error(`FAIL: Missing comparison skill ratings for legend ${code}!`);
    failed = true;
  } else {
    console.log(`PASS: 6-axis ratings present for ${code}`);
  }
}

const classicH2H = [
  { d1: 'VET', d2: 'WEB' },
  { d1: 'RAI', d2: 'MAS' },
  { d1: 'LAU', d2: 'PRO' },
  { d1: 'MAN', d2: 'PIQ' }
];
for (const h2h of classicH2H) {
  if (!compContent.includes(`driver1Code: '${h2h.d1}'`) || !compContent.includes(`driver2Code: '${h2h.d2}'`)) {
    console.error(`FAIL: Missing head-to-head data for ${h2h.d1}-${h2h.d2}!`);
    failed = true;
  } else {
    console.log(`PASS: Head-to-head match-up verified: ${h2h.d1} vs ${h2h.d2}`);
  }
}

// 3. Check data/driverSkillsData.ts
console.log('\n--- 3. Checking driverSkillsData.ts ---');
const skillsContent = fs.readFileSync('./data/driverSkillsData.ts', 'utf8');
for (const code of ['MSC', 'VET', 'RAI', 'MAN', 'HAK', 'LAU', 'RIC']) {
  if (!skillsContent.includes(`${code}: {`) && !skillsContent.includes(`'${code}': {`)) {
    console.error(`FAIL: Missing 5-axis skills for ${code}!`);
    failed = true;
  } else {
    console.log(`PASS: 5-axis skills present for ${code}`);
  }
}

// 4. Check data/driverTraitsData.ts
console.log('\n--- 4. Checking driverTraitsData.ts ---');
const traitsContent = fs.readFileSync('./data/driverTraitsData.ts', 'utf8');
for (const code of ['MSC', 'VET', 'RAI', 'MAN', 'HAK', 'LAU', 'RIC']) {
  if (!traitsContent.includes(`${code}: [`) && !traitsContent.includes(`'${code}': [`)) {
    console.error(`FAIL: Missing tactical traits for ${code}!`);
    failed = true;
  } else {
    console.log(`PASS: Tactical traits present for ${code}`);
  }
}

// 5. Check components/hubs/DriverComparisonTool.tsx
console.log('\n--- 5. Checking DriverComparisonTool.tsx PRESET_MATCHUPS ---');
const compToolContent = fs.readFileSync('./components/hubs/DriverComparisonTool.tsx', 'utf8');
const dreamMatchups = ['MSC', 'HAK', 'VET', 'SEN', 'MAN', 'PRO', 'LAU'];
for (const code of dreamMatchups) {
  if (!compToolContent.includes(`'${code}'`) && !compToolContent.includes(`"${code}"`)) {
    console.error(`FAIL: DriverComparisonTool missing preset reference to ${code}!`);
    failed = true;
  } else {
    console.log(`PASS: Dream matchup reference found for ${code}`);
  }
}

// 6. Check components/hubs/DriverDetailModal.tsx
console.log('\n--- 6. Checking DriverDetailModal.tsx seasonHistory rendering ---');
const modalContent = fs.readFileSync('./components/hubs/DriverDetailModal.tsx', 'utf8');
if (!modalContent.includes('driver.seasonHistory') || !modalContent.includes('歴代シーズン軌跡・在籍体制')) {
  console.error('FAIL: DriverDetailModal missing seasonHistory rendering!');
  failed = true;
} else {
  console.log('PASS: DriverDetailModal seasonHistory timeline deck verified');
}

// 7. Check components/hubs/DriversHub.tsx
console.log('\n--- 7. Checking DriversHub.tsx legends handling ---');
const hubContent = fs.readFileSync('./components/hubs/DriversHub.tsx', 'utf8');
if (!hubContent.includes('totalLegendTitles') || !hubContent.includes('legendDrivers.length')) {
  console.error('FAIL: DriversHub missing dynamic legend statistics!');
  failed = true;
} else {
  console.log('PASS: DriversHub dynamic legend statistics verified');
}

console.log('\n================================');
if (!failed) {
  console.log('>>> ALL STEP 3 VERIFICATIONS PASSED (100% SUCCESS) <<<');
} else {
  console.error('>>> SOME STEP 3 VERIFICATIONS FAILED <<<');
  process.exit(1);
}
