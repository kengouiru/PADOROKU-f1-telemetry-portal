const fs = require('fs');
const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const idx = content.indexOf('"id": "suzuka"');
if (idx !== -1) {
  console.log('--- SUZUKA ENTRY (first 1200 chars) ---');
  console.log(content.slice(idx, idx + 1200));
} else {
  console.log('Suzuka not found with double quotes');
}
