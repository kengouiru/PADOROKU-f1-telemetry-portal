const fs = require('fs');
const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const ktIdx = content.indexOf('export const KNOWLEDGE_TEAMS');
['audi', 'haas', 'cadillac'].forEach(id => {
  const start = content.indexOf(`id: '${id}'`, ktIdx);
  const pStart = content.indexOf('philosophy:', start);
  const refEnd = content.indexOf('],', pStart) + 2;
  console.log(`=== ${id} ===`);
  console.log(content.slice(pStart, refEnd));
});
