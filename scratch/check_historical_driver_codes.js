const fs = require('fs');

const content = fs.readFileSync('data/f1HistoricalGrids.ts', 'utf8');

const driverCodes = [...content.matchAll(/code:\s*['"]([A-Z0-9]+)['"]/g)].map(m => m[1]);
const uniqueCodes = [...new Set(driverCodes)];
console.log('Unique driver codes in f1HistoricalGrids.ts:', uniqueCodes);
