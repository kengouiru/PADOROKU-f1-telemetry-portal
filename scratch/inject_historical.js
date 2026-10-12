const fs = require('fs');

let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

const injection = `
// ─────────────────────────────────────────────────────────────
// HISTORICAL DATA INJECTION (Phase 5 Modular Expansion)
// ─────────────────────────────────────────────────────────────
import { HISTORICAL_TEAMS } from './f1HistoricalTeams';
import { HISTORICAL_DRIVERS } from './f1HistoricalDrivers';

KNOWLEDGE_TEAMS.push(...HISTORICAL_TEAMS);
KNOWLEDGE_DRIVERS.push(...HISTORICAL_DRIVERS);
`;

if (!kd.includes('HISTORICAL_DATA_INJECTION')) {
  fs.writeFileSync('data/f1KnowledgeData.ts', kd + '\n' + injection, 'utf-8');
  console.log('Appended historical data exports safely.');
} else {
  console.log('Already injected.');
}
