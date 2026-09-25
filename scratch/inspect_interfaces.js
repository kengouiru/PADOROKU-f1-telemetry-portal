const fs = require('fs');
const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

function printInterface(name) {
  const idx = content.indexOf(`export interface ${name}`);
  if (idx !== -1) {
    console.log(`--- ${name} ---`);
    console.log(content.slice(idx, idx + 1200));
  }
}

printInterface('CircuitProfile');
printInterface('TeamProfile');
