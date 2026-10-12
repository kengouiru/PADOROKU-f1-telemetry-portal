const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');
const lines = text.split('\n');
console.log(lines.slice(1190, 1205).join('\n'));
