const fs = require('fs');

let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

// Verstappen
kd = kd.replace(/code: 'VER',([\s\S]*?)worldChampionships: 3,/, "code: 'VER',$1worldChampionships: 4,");
kd = kd.replace(/number: 1,([\s\S]*?)code: 'VER',/, "number: 33,$1code: 'VER',");

// Norris
kd = kd.replace(/code: 'NOR',([\s\S]*?)worldChampionships: 0,/, "code: 'NOR',$1worldChampionships: 1,");

// Audi Principal
kd = kd.replace(/teamPrincipal: 'Mattia Binotto'([\s\S]*?)teamName: 'Audi'/, "teamPrincipal: 'Jonathan Wheatley'$1teamName: 'Audi'");

// Cadillac Principal 
kd = kd.replace(/teamPrincipal: 'Marcin Budkowski'([\s\S]*?)teamName: 'Cadillac'/, "teamPrincipal: 'Graeme Lowdon'$1teamName: 'Cadillac'");

// Tsunoda 
kd = kd.replace(/code: 'TSU',([\s\S]*?)currentTeamId: 'rb',/, "code: 'TSU',$1currentTeamId: 'red-bull',");

// Doohan
kd = kd.replace(/f1Debut: '2025年 オーストラリアGP \((.*?)\)',([\s\S]*?)code: 'DOO',/, "f1Debut: '2024年 アブダビGP ($1)',$2code: 'DOO',");

// Senna (if he's listed as Williams champion, fix to McLaren)
kd = kd.replace(/titles: \[1988, 1990, 1991\],\s+championTeam: 'Williams',/, "titles: [1988, 1990, 1991],\n      championTeam: 'McLaren',");

fs.writeFileSync('data/f1KnowledgeData.ts', kd, 'utf-8');

let sd = fs.readFileSync('data/f1SeasonData.ts', 'utf-8');
sd = sd.replace(/Mattia Binotto/g, 'Jonathan Wheatley');
sd = sd.replace(/Marcin Budkowski/g, 'Graeme Lowdon');
fs.writeFileSync('data/f1SeasonData.ts', sd, 'utf-8');

let de = fs.readFileSync('data/f1DramaData.ts', 'utf-8');
de = de.replace(/ビノット代表/g, 'ウィートリー代表');
de = de.replace(/バドコウスキー代表/g, 'ロードン代表');
fs.writeFileSync('data/f1DramaData.ts', de, 'utf-8');

console.log('Fact check applied!');
