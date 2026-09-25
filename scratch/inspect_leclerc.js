const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const s = content.indexOf("id: 'charles-leclerc'");
const e = content.indexOf('seasonHistory:', s);

console.log('--- LECLERC CURRENT ENTRY ---');
console.log(content.slice(s, e));
