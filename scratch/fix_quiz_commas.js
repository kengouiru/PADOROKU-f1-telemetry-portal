const fs = require('fs');
let content = fs.readFileSync('data/f1QuizData.ts', 'utf-8');

content = content.replace(/"options":\s*\[\s*([\s\S]*?)\s*\]/g, (match, optsStr) => {
  let lines = optsStr.split('\n').map(l => l.trim()).filter(l => l);
  lines = lines.map(l => l.replace(/,$/, ''));
  return '"options": [\n    ' + lines.join(',\n    ') + '\n  ]';
});

fs.writeFileSync('data/f1QuizData.ts', content, 'utf-8');
console.log('Fixed options formatting');
