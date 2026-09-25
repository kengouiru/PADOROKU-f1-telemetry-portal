const fs = require('fs');
const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const ktIdx = content.indexOf('export const KNOWLEDGE_TEAMS');
const ktEnd = content.indexOf('export const KNOWLEDGE_CIRCUITS');
const teamsBlock = content.slice(ktIdx, ktEnd);

const ids = [...teamsBlock.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
console.log('Total teams:', ids.length);

ids.forEach(id => {
  const tStart = teamsBlock.indexOf(`id: '${id}'`);
  const philStart = teamsBlock.indexOf('philosophy:', tStart);
  const refStart = teamsBlock.indexOf('references:', tStart);
  const refEnd = teamsBlock.indexOf('],', refStart);
  const philText = teamsBlock.slice(philStart, refStart);
  const refText = teamsBlock.slice(refStart, refEnd);
  const refCount = (refText.match(/id:\s*\d+/g) || []).length;
  const hasChapters = philText.includes('【第1章');
  const hasCitations = /\[\d+\]/.test(philText);
  console.log(`${id.padEnd(16)} | Chapters: ${String(hasChapters).padEnd(5)} | Citations: ${String(hasCitations).padEnd(5)} | References: ${refCount}`);
});
