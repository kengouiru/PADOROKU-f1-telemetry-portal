const fs = require('fs');

const content = fs.readFileSync('./data/f1KnowledgeData.ts', 'utf8');

const legends = ['SEN', 'MSC', 'RIC', 'PRO', 'LAU', 'VET', 'RAI', 'MAN', 'HAK'];

console.log('=== VERIFYING 9 LEGENDS ===');
legends.forEach(code => {
  const codeIdx = content.indexOf(`code: '${code}'`) !== -1 ? content.indexOf(`code: '${code}'`) : content.indexOf(`code: "${code}"`);
  if (codeIdx === -1) {
    console.error(`ERROR: ${code} not found!`);
    return;
  }
  // Find next driver by searching for "\n  {" after codeIdx
  const nextDriverIdx = content.indexOf('\n  {', codeIdx);
  const driverBlock = content.slice(codeIdx, nextDriverIdx !== -1 ? nextDriverIdx : codeIdx + 15000);
  
  const hasHistory = driverBlock.includes('seasonHistory: [');
  const hasStyle = driverBlock.includes('drivingStyle: {');
  const hasEng = driverBlock.includes('engineeringPreference: {');
  const hasRefs = driverBlock.includes('references: [');
  const hasBio = driverBlock.includes('biography: {');

  console.log(`${code}: History=${hasHistory}, Style=${hasStyle}, Eng=${hasEng}, Refs=${hasRefs}, Bio=${hasBio}`);
});
