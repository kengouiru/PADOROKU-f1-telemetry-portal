const fs = require('fs');
let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

// Fix Lotus
kd = kd.replace('worldChampionships: 7,', 'constructorTitles: 7,\n    drivers: ["CLK"],');
kd = kd.replace(
  "iconicCars: ['Lotus 25', 'Lotus 49', 'Lotus 72', 'Lotus 79'],",
  "iconicCars: [ { model: 'Lotus 79', year: 1978, achievement: 'Championship Winner', keyTech: 'Ground Effect' } ],"
);

// Fix Jim Clark
kd = kd.replace("born: '1936-03-04',", "birthDate: '1936-03-04',");
kd = kd.replace("placeOfBirth: 'Kilmany, Fife, Scotland',", "birthPlace: 'Kilmany, Fife, Scotland',");
kd = kd.replace("currentTeamId: 'team-lotus',", "team: 'Team Lotus',\n    teamColor: '#004225',\n    status: 'Legend',\n    nickname: 'Flying Scot',");

kd = kd.replace(/careerStats: \{\s*wins: 25,\s*podiums: 32,\s*poles: 33,\s*fastestLaps: 28,\s*racesStarted: 72,\s*\},/, 
  "wins: 25, poles: 33, podiums: 32, entries: 72,\n    careerSummary: 'スコットランドの農家に生まれ、ラリーやスポーツカーレースで才能を発揮。コーリン・チャップマンに見出されロータスに加入し、F1の歴史に残る天才として活躍した。',");

kd = kd.replace(/biography: \{\s*earlyCareer:.*,\s*f1Journey:.*,\s*drivingStyle:.*,\s*\},/, "");
kd = kd.replace(/engineeringPreference: \{\s*setupBalance:.*,\s*tyreManagement:.*,\s*feedbackQuality:.*,\s*\},/, "");

fs.writeFileSync('data/f1KnowledgeData.ts', kd, 'utf-8');
console.log('Fixed TS errors in Knowledge data');
