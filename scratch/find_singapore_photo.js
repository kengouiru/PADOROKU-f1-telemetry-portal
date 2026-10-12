const fs = require('fs');
const content = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf-8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('circuit_singapore')) {
    console.log('Line', i, ':', lines.slice(Math.max(0, i - 4), i + 8).join('\n'));
  }
}
