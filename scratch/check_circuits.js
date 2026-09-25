const fs = require('fs');

const content = fs.readFileSync('./data/f1KnowledgeData.ts', 'utf8');
const circuitsStart = content.indexOf('export const KNOWLEDGE_CIRCUITS: CircuitProfile[] = [');
const circuitsEnd = content.indexOf('export const KNOWLEDGE_REGULATIONS', circuitsStart);
const circuitsBlock = content.substring(circuitsStart, circuitsEnd > 0 ? circuitsEnd : undefined);

const idMatches = [...circuitsBlock.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total circuits found:', idMatches.length);
console.log(idMatches.join('\n'));
