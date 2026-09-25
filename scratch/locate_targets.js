const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const targetDrivers = [
  'lando-norris',
  'charles-leclerc',
  'oscar-piastri',
  'fernando-alonso',
  'ayrton-senna',
  'michael-schumacher'
];

targetDrivers.forEach(id => {
  const start = content.indexOf(`id: '${id}'`);
  const end = content.indexOf('seasonHistory:', start);
  console.log(`Driver: ${id} | start: ${start} | end: ${end}`);
});
