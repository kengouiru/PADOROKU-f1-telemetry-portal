const fs = require('fs');
const content = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf-8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes("'singapore':"));
console.log(lines.slice(idx, idx + 18).join('\n'));
