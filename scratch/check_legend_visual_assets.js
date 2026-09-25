const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const legendCodes = ['VET', 'RAI', 'MAN', 'HAK', 'RIC', 'LAU', 'STE', 'CLA', 'FAN', 'VIL'];

legendCodes.forEach(code => {
  const codeIdx = content.indexOf(`code: '${code}'`);
  if (codeIdx !== -1) {
    const vaIdx = content.indexOf('visualAsset:', codeIdx);
    const vaEnd = content.indexOf('},', vaIdx);
    console.log(`--- Driver ${code} ---`);
    console.log(content.slice(vaIdx, vaEnd + 2));
  } else {
    console.log(`Code ${code} not found in f1KnowledgeData.ts`);
  }
});
