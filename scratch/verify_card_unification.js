const fs = require('fs');

// Simple verification of f1SeasonData exports
const code = fs.readFileSync('data/f1SeasonData.ts', 'utf8');

console.log('toJapaneseGpName exists in f1SeasonData:', code.includes('export function toJapaneseGpName'));
console.log('formatArchiveDates exists in f1SeasonData:', code.includes('export function formatArchiveDates'));

// Check SeasonHub
const hubCode = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');
console.log('getDisplayCircuitName exists in SeasonHub:', hubCode.includes('export function getDisplayCircuitName'));
console.log('winnerNote removed from card in SeasonHub:', !hubCode.includes('gp.winnerNote &&'));
console.log('pirelliCompounds removed from card in SeasonHub:', !hubCode.includes('gp.pirelliCompounds &&'));
