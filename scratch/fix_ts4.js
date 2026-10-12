const fs = require('fs');
let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

kd = kd.replace("history: 'コーリン・チャップマンによって創設され", "// history: 'コーリン・チャップマンによって創設され");
kd = kd.replace("worldChampionships: 2,", "championships: 2,");

fs.writeFileSync('data/f1KnowledgeData.ts', kd, 'utf-8');
console.log('Fixed TS finally 4');
