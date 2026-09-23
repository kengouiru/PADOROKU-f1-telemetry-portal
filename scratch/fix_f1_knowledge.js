const fs = require('fs');

let content = fs.readFileSync('./data/f1KnowledgeData.ts', 'utf8');
const lines = content.split(/\r?\n/);

console.log('Total lines:', lines.length);

// Find index where line has 'Pirelli Engineering Whitepaper'
let deleteStart = -1;
let deleteEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Pirelli Engineering Whitepaper')) {
    // Next line is url, verifiedDate, }, ], seasonHistory: [
    for (let j = i; j < i + 10; j++) {
      if (lines[j].includes('seasonHistory: [')) {
        deleteStart = j;
        break;
      }
    }
  }
  if (deleteStart !== -1 && lines[i].includes("id: 'overcut-dynamics'")) {
    deleteEnd = i - 1; // the line before id: 'overcut-dynamics' which should be '  },'
    break;
  }
}

console.log('deleteStart:', deleteStart, 'deleteEnd:', deleteEnd);

if (deleteStart !== -1 && deleteEnd !== -1) {
  lines.splice(deleteStart, deleteEnd - deleteStart);
  console.log('Cleaned lines. New total lines:', lines.length);
}

fs.writeFileSync('./data/f1KnowledgeData.ts', lines.join('\n'), 'utf8');
console.log('Saved f1KnowledgeData.ts');
