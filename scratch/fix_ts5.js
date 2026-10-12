const fs = require('fs');
let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

kd = kd.replace("socialLinks: {\n      website: 'https://www.classicteamlotus.co.uk/',\n    },", "");
kd = kd.replace("poles: 33, podiums: 32,", "podiums: 32,");

fs.writeFileSync('data/f1KnowledgeData.ts', kd, 'utf-8');
console.log('Fixed TS finally 5');
