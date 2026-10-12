const fs = require('fs');

function shuffleOptions(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  const fixes = [
    { id: 'quiz-2026-pu-split', toIdx: 2 },
    { id: 'quiz-2026-active-aero', toIdx: 1 },
    { id: 'quiz-2026-override-mode', toIdx: 3 },
    { id: 'quiz-madrid-circuit-feature', toIdx: 1 },
    { id: 'quiz-madrid-location', toIdx: 2 },
    { id: 'quiz-2026-audi-entry', toIdx: 0 },
    { id: 'quiz-2026-cadillac-entry', toIdx: 3 },
    { id: 'quiz-2026-aston-honda', toIdx: 1 }
  ];

  let lines = content.split('\n');
  let currentId = null;
  let optionsStartIndex = -1;
  let optionsLines = [];
  let inOptions = false;
  let correctIndexLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const idMatch = lines[i].match(/"id":\s*"([^"]+)"/);
    if (idMatch) {
      currentId = idMatch[1];
    }

    if (lines[i].includes('"options": [')) {
      inOptions = true;
      optionsStartIndex = i;
      optionsLines = [];
      continue;
    }

    if (inOptions && lines[i].includes('],')) {
      inOptions = false;
      
      const fix = fixes.find(f => f.id === currentId);
      if (fix && fix.toIdx !== 0 && optionsLines.length === 4) {
        // Rearrange options
        // correct option is at index 0 currently
        const correctOpt = optionsLines[0];
        const newOptions = [...optionsLines];
        newOptions.splice(0, 1); // remove from 0
        newOptions.splice(fix.toIdx, 0, correctOpt); // insert at toIdx

        // update the lines
        for (let j = 0; j < 4; j++) {
          lines[optionsStartIndex + 1 + j] = newOptions[j];
        }
        
        // now find correctIndex and update it
        for (let j = optionsStartIndex; j < optionsStartIndex + 20; j++) {
          if (lines[j].includes('"correctIndex":')) {
            lines[j] = lines[j].replace(/"correctIndex":\s*\d+/, `"correctIndex": ${fix.toIdx}`);
            break;
          }
        }
      }
      continue;
    }

    if (inOptions) {
      optionsLines.push(lines[i]);
    }
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log('Done!');
}

shuffleOptions('C:/CreationKengo/F1analyisis-app/f1-telemetry-next/data/f1QuizData.ts');
