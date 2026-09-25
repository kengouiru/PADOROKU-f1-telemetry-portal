const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

// Check Teams
console.log('--- TEAMS CHECK ---');
const teamMatch = content.match(/export const KNOWLEDGE_TEAMS:[\s\S]*?\[([\s\S]*?)\];/);
if (teamMatch) {
  const teamIds = [...teamMatch[1].matchAll(/id:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);
  console.log('Found team IDs:', teamIds);
  teamIds.forEach(id => {
    const start = content.indexOf(`id: '${id}'`);
    const descIdx = content.indexOf('description:', start);
    let descLen = 0;
    if (descIdx !== -1) {
      const rest = content.slice(descIdx + 'description:'.length).trim();
      const quote = rest[0];
      const close = rest.indexOf(quote, 1);
      descLen = close !== -1 ? rest.slice(1, close).length : 0;
    }
    console.log(`Team: ${id.padEnd(16)} | descLen: ${descLen}`);
  });
}

// Check Circuits
console.log('--- CIRCUITS CHECK ---');
const circMatch = content.match(/export const KNOWLEDGE_CIRCUITS:[\s\S]*?\[([\s\S]*?)\];/);
if (circMatch) {
  const circIds = [...circMatch[1].matchAll(/id:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);
  console.log('Total circuits:', circIds.length);
  circIds.slice(0, 5).forEach(id => {
    const start = content.indexOf(`id: '${id}'`);
    const descIdx = content.indexOf('description:', start);
    let descLen = 0;
    if (descIdx !== -1) {
      const rest = content.slice(descIdx + 'description:'.length).trim();
      const quote = rest[0];
      const close = rest.indexOf(quote, 1);
      descLen = close !== -1 ? rest.slice(1, close).length : 0;
    }
    console.log(`Circuit: ${id.padEnd(20)} | descLen: ${descLen}`);
  });
}
