const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const matches = [...content.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Circuit IDs found:', matches);
