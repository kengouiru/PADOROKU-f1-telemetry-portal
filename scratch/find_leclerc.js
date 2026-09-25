const fs = require('fs');
const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes("id: 'charles-leclerc'")) {
    console.log('Leclerc at line:', i + 1);
  }
});
