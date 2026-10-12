const fs = require('fs');
let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

kd = kd.replace("flag: '🇬🇧',\n", "");
kd = kd.replace("established: 1952,\n    f1Debut: '1958年 モナコGP',\n", "");
kd = kd.replace("technicalDirector: 'Colin Chapman / Maurice Philippe',\n    chassis: 'Lotus 25, 49, 72, 78, 79',\n    powerUnit: 'Ford Cosworth DFV / Climax / Renault',",
  "powerUnit: 'Ford Cosworth DFV / Climax / Renault',\n    structure: { technicalDirector: 'Colin Chapman / Maurice Philippe', aeroHead: '', facility: '' },");

fs.writeFileSync('data/f1KnowledgeData.ts', kd, 'utf-8');
console.log('Fixed TS finally');
