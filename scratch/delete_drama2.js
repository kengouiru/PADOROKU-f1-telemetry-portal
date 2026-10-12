const fs = require('fs');
let content = fs.readFileSync('data/f1DramaData.ts', 'utf-8');

const startIdx = content.indexOf("id: 'season-2026-new-regulations-eleventh-team',");
if (startIdx !== -1) {
  const objStart = content.lastIndexOf('{', startIdx);
  let braces = 0;
  let objEnd = -1;
  for (let i = objStart; i < content.length; i++) {
    if (content[i] === '{') braces++;
    if (content[i] === '}') {
      braces--;
      if (braces === 0) {
        objEnd = i + 1;
        if (content[objEnd] === ',') objEnd++;
        break;
      }
    }
  }
  
  if (objEnd !== -1) {
    content = content.substring(0, objStart) + content.substring(objEnd);
    fs.writeFileSync('data/f1DramaData.ts', content, 'utf-8');
    console.log('Deleted 2026 fictional storyline');
  }
}
