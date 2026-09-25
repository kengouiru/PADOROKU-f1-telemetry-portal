const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const targetTeams = [
  'red-bull',
  'ferrari',
  'mclaren',
  'mercedes'
];

targetTeams.forEach(id => {
  const ktIdx = content.indexOf('export const KNOWLEDGE_TEAMS');
  const start = content.indexOf(`id: '${id}'`, ktIdx);
  const end = content.indexOf('references:', start);
  const refEnd = content.indexOf('],', end);
  console.log(`Team: ${id} | start: ${start} | end: ${end} | refEnd: ${refEnd}`);
});
