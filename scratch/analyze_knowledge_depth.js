const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const sampleIds = [
  'lando-norris',
  'charles-leclerc',
  'fernando-alonso',
  'oscar-piastri',
  'george-russell',
  'carlos-sainz',
  'sergio-perez',
  'alexander-albon',
  'pierre-gasly',
  'ayrton-senna',
  'michael-schumacher'
];

sampleIds.forEach(id => {
  const start = content.indexOf(`id: '${id}'`);
  if (start !== -1) {
    const end = content.indexOf('seasonHistory:', start);
    const block = content.slice(start, end !== -1 ? end : start + 3000);
    const csIdx = block.indexOf('careerSummary:');
    let csLen = 0;
    if (csIdx !== -1) {
      const rest = block.slice(csIdx + 'careerSummary:'.length).trim();
      const quoteChar = rest[0];
      const closeIdx = rest.indexOf(quoteChar, 1);
      csLen = closeIdx !== -1 ? rest.slice(1, closeIdx).length : 0;
    }
    const hasRefs = block.includes('references:');
    console.log(`${id.padEnd(20)} | careerSummary chars: ${String(csLen).padStart(5)} | hasRefs: ${hasRefs}`);
  }
});
