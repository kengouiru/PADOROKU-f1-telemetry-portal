const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const s = content.indexOf("id: 'lando-norris'");
const e = content.indexOf('seasonHistory:', s);

console.log('--- NORRIS CURRENT ENTRY ---');
console.log(content.slice(s, e));
