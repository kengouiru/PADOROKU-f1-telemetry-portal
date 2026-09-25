const fs = require('fs');
const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const ktIdx = content.indexOf('export const KNOWLEDGE_TEAMS');
const ktEnd = content.indexOf('export const KNOWLEDGE_DRIVERS');
const teamsBlock = content.slice(ktIdx, ktEnd);
const teamGalleries = [...teamsBlock.matchAll(/visualGallery:\s*\[([\s\S]*?)\]/g)];
console.log('Team galleries found:', teamGalleries.length);

const kcIdx = content.indexOf('export const KNOWLEDGE_CIRCUITS');
const kcEnd = content.indexOf('export const KNOWLEDGE_TECH_TERMS', kcIdx);
const circuitsBlock = content.slice(kcIdx, kcEnd !== -1 ? kcEnd : kcIdx + 40000);
const circuitGalleries = [...circuitsBlock.matchAll(/"visualGallery":\s*\[([\s\S]*?)\]/g)];
console.log('Circuit galleries found:', circuitGalleries.length);
