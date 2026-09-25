const fs = require('fs');
const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const kdIdx = content.indexOf('export const KNOWLEDGE_DRIVERS');
const kdEnd = content.indexOf('export const KNOWLEDGE_CIRCUITS');
const driversBlock = content.slice(kdIdx, kdEnd);

const ids = [...driversBlock.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
console.log('Total drivers in KNOWLEDGE_DRIVERS:', ids.length);

ids.forEach(id => {
  const dStart = driversBlock.indexOf(`id: '${id}'`);
  const dEnd = driversBlock.indexOf('visualGallery:', dStart);
  const head = driversBlock.slice(dStart, dEnd);
  const hasVerstappenPlaceholder = head.includes('driver_verstappen.jpg') && id !== 'max-verstappen';
  const imgMatch = head.match(/imageUrl:\s*'([^']+)'/);
  const img = imgMatch ? imgMatch[1] : 'NONE';
  const refStart = driversBlock.indexOf('references:', dStart);
  const refEnd = driversBlock.indexOf('],', refStart);
  const refCount = refStart !== -1 ? (driversBlock.slice(refStart, refEnd).match(/id:\s*\d+/g) || []).length : 0;
  console.log(`${id.padEnd(22)} | Ref: ${String(refCount).padEnd(2)} | Bad Placeholder: ${String(hasVerstappenPlaceholder).padEnd(5)} | Image: ${img}`);
});
