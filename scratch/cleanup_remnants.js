const fs = require('fs');
let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

// For Team Lotus remnant
let remnant1 = `    // history: 'コーリン・チャップマンによって創設され、ジム・クラーク、ヨッヘン・リント、エマーソン・フィッティパルディ、マリオ・アンドレッティといった名手と共に一時代を築いた。F1の技術進化の歴史はロータスの歴史と言っても過言ではない。',
    iconicCars: [ { model: 'Lotus 79', year: 1978, achievement: 'Championship Winner', keyTech: 'Ground Effect' } ],
    
    visualGallery: [
      {
        imageUrl: '/images/teams/team_lotus_79.jpg',
        caption: 'Lotus 79: ブラックビューティーと呼ばれたグラウンド・エフェクトカー',
        tag: 'Machine',
        credit: 'Classic Team Lotus',
        license: 'Fair Use',
        sourceUrl: 'https://www.classicteamlotus.co.uk/',
      }
    ],
    references: [
      {
        id: 1,
        title: 'Classic Team Lotus History',
        publisher: 'Classic Team Lotus',
        url: 'https://www.classicteamlotus.co.uk/',
        verifiedDate: '2026-01-01',
      }
    ],
  },
`;
// Normalize line endings before replace just in case
remnant1 = remnant1.replace(/\r\n/g, '\n');

// For Jim Clark remnant
let remnant2 = `    visualGallery: [],
    
    
    wins: 25, podiums: 32, entries: 72,
    careerSummary: 'スコットランドの農家に生まれ、ラリーやスポーツカーレースで才能を発揮。コーリン・チャップマンに見出されロータスに加入し、F1の歴史に残る天才として活躍した。',
    references: [
      {
        id: 1,
        title: 'Jim Clark - Hall of Fame',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/championship/inside-f1/hall-of-fame/Jim_Clark.html',
        verifiedDate: '2026-01-01',
      }
    ],
  },
`;
remnant2 = remnant2.replace(/\r\n/g, '\n');

let normalizedKd = kd.replace(/\r\n/g, '\n');

console.log("Found remnant 1: ", normalizedKd.includes(remnant1));
console.log("Found remnant 2: ", normalizedKd.includes(remnant2));

normalizedKd = normalizedKd.replace(remnant1, '');
normalizedKd = normalizedKd.replace(remnant2, '');

fs.writeFileSync('data/f1KnowledgeData.ts', normalizedKd, 'utf-8');
console.log('Cleaned up remnants');
