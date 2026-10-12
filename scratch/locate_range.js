const fs = require('fs');
const lines = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf-8').split('\n');
const start = lines.findIndex(l => l.includes('1. RACE HEADER') || l.includes('1. NEXT RACE HERO'));
const end = lines.findIndex(l => l.includes('SECTION TABS') || l.includes('role="tablist"'));

console.log('Current section range:', start, 'to', end);
console.log('Start line:', lines[start]);
console.log('End line:', lines[end]);
