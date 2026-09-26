const fs = require('fs');

const content = fs.readFileSync('./data/f1KnowledgeData.ts', 'utf8');
const circuitsStart = content.indexOf('export const KNOWLEDGE_CIRCUITS: CircuitProfile[] = [');
const circuitsEnd = content.indexOf('export const KNOWLEDGE_REGULATIONS', circuitsStart);
const circuitsBlock = content.substring(circuitsStart, circuitsEnd > 0 ? circuitsEnd : undefined);

// Parse all circuit objects
const idMatches = [...circuitsBlock.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);

console.log('Total circuits:', idMatches.length);

idMatches.forEach(id => {
  const start = circuitsBlock.indexOf(`"id": "${id}"`);
  const nextStart = circuitsBlock.indexOf(`"id": "`, start + 10);
  const block = circuitsBlock.substring(start, nextStart > 0 ? nextStart : start + 3000);

  const images = [...block.matchAll(/"imageUrl":\s*"([^"]+)"/g)].map(m => m[1]);
  console.log(`=== ${id} ===`);
  console.log('Images:', images);
});
