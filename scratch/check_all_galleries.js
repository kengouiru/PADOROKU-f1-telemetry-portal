const fs = require('fs');
const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const kdIdx = content.indexOf('export const KNOWLEDGE_DRIVERS');
const kdEnd = content.indexOf('export const KNOWLEDGE_CIRCUITS');
const driversBlock = content.slice(kdIdx, kdEnd);

const driverIds = [...driversBlock.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
driverIds.forEach(id => {
  const dStart = driversBlock.indexOf(`id: '${id}'`);
  const galStart = driversBlock.indexOf('visualGallery:', dStart);
  const galEnd = driversBlock.indexOf('],', galStart);
  if (galStart !== -1 && galEnd > galStart) {
    const galText = driversBlock.slice(galStart, galEnd);
    const images = [...galText.matchAll(/imageUrl:\s*'([^']+)'/g)].map(m => m[1]);
    const tags = [...galText.matchAll(/tag:\s*'([^']+)'/g)].map(m => m[1]);
    console.log(id, images.length, tags.join(', '));
  }
});
