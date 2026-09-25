const fs = require('fs');
const content = fs.readFileSync('data/f1RegulationsData.ts', 'utf8');

const matches = [...content.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
console.log('Total regulation articles:', matches.length);
matches.forEach(id => {
  const start = content.indexOf(`id: '${id}'`);
  const end = content.indexOf('category:', start);
  const titleMatch = content.slice(start, start + 300).match(/title:\s*'([^']+)'/);
  const catMatch = content.slice(start, start + 300).match(/category:\s*'([^']+)'/);
  console.log(id.padEnd(28), (catMatch ? catMatch[1] : '').padEnd(12), titleMatch ? titleMatch[1] : '');
});
