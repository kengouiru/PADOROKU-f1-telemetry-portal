const fs = require('fs');
let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

kd = kd.replace("country: '英国',\n    flag: '🇬🇧',\n    color:", "color:"); // for Lotus
kd = kd.replace("name: 'ジム・クラーク',\n    fullName:", "fullName:"); // for Clark

fs.writeFileSync('data/f1KnowledgeData.ts', kd, 'utf-8');
console.log('Fixed TS again');
