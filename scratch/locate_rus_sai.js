const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

['george-russell', 'carlos-sainz'].forEach(id => {
  const start = content.indexOf(`id: '${id}'`);
  const end = content.indexOf('seasonHistory:', start);
  console.log(`Driver: ${id} | start: ${start} | end: ${end}`);
});
