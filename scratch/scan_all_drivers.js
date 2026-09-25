const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const kdStart = content.indexOf('export const KNOWLEDGE_DRIVERS');
const kdEnd = content.indexOf('export const KNOWLEDGE_CIRCUITS');

const driversSection = content.slice(kdStart, kdEnd !== -1 ? kdEnd : undefined);

const driverIds = [...driversSection.matchAll(/id:\s*['"]([a-z0-9-]+)['"]/g)].map(m => m[1]);

console.log('Total drivers in KNOWLEDGE_DRIVERS:', driverIds.length);

driverIds.forEach((id, idx) => {
  const start = driversSection.indexOf(`'${id}'`) !== -1 ? driversSection.indexOf(`'${id}'`) : driversSection.indexOf(`"${id}"`);
  const block = driversSection.slice(start, start + 800);
  const codeM = block.match(/code:\s*['"]([^'"]+)['"]/);
  const nameM = block.match(/(?:fullName|name):\s*['"]([^'"]+)['"]/);
  const imgM = block.match(/imageUrl:\s*['"]([^'"]+)['"]/);
  
  const code = codeM ? codeM[1] : '???';
  const name = nameM ? nameM[1] : '???';
  const img = imgM ? imgM[1] : 'NO_IMAGE';
  const exists = img !== 'NO_IMAGE' ? fs.existsSync('public' + img) : false;
  
  console.log(`${String(idx + 1).padStart(2)}. [${code.padEnd(4)}] ${id.padEnd(24)} | ${name.padEnd(25)} | img: ${img} (exists: ${exists})`);
});
