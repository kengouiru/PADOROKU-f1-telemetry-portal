const fs = require('fs');

let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

const lotusTeam = `  {
    id: 'team-lotus',
    name: 'Team Lotus',
    fullName: 'Team Lotus',
    base: 'Hethel, Norfolk, United Kingdom',
    country: '英国',
    flag: '🇬🇧',
    color: '#004225', // British Racing Green
    established: 1952,
    f1Debut: '1958年 モナコGP',
    worldChampionships: 7,
    teamPrincipal: 'Colin Chapman',
    technicalDirector: 'Colin Chapman / Maurice Philippe',
    chassis: 'Lotus 25, 49, 72, 78, 79',
    powerUnit: 'Ford Cosworth DFV / Climax / Renault',
    philosophy: {
      description: '「軽さは速さ」を信条とし、モノコック構造、ウィング、グラウンド・エフェクトなどF1に革命的な技術を次々と持ち込んだ伝説的チーム。',
      aeroFocus: 'グラウンド・エフェクト・カーの発明',
      mechanicalFocus: 'アルミニウム・モノコックの導入',
    },
    history: 'コーリン・チャップマンによって創設され、ジム・クラーク、ヨッヘン・リント、エマーソン・フィッティパルディ、マリオ・アンドレッティといった名手と共に一時代を築いた。F1の技術進化の歴史はロータスの歴史と言っても過言ではない。',
    iconicCars: ['Lotus 25', 'Lotus 49', 'Lotus 72', 'Lotus 79'],
    socialLinks: {
      website: 'https://www.classicteamlotus.co.uk/',
    },
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

const jimClark = `  {
    code: 'CLK',
    name: 'ジム・クラーク',
    fullName: 'James Clark Jr.',
    number: 0,
    country: '英国',
    flag: '🇬🇧',
    currentTeamId: 'team-lotus',
    born: '1936-03-04',
    placeOfBirth: 'Kilmany, Fife, Scotland',
    worldChampionships: 2,
    f1Debut: '1960年 オランダGP',
    driverType: '天性のナチュラル・スピード',
    numberOrigin: '当時は固定ナンバー制ではなかった',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/jim-clark.jpg',
      caption: 'Jim Clark (Team Lotus)',
      credit: 'Wikimedia Commons',
      license: 'Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jim_Clark_1965.jpg',
    },
    visualGallery: [],
    engineeringPreference: {
      setupBalance: 'どんなマシンでも限界を引き出す適応力',
      tyreManagement: '非常にスムーズでタイヤをすり減らさない',
      feedbackQuality: 'マシンの欠陥をドライビングでカバーしてしまうため、メカニックが問題を把握しづらいほどだった',
    },
    biography: {
      earlyCareer: 'スコットランドの農家に生まれ、ラリーやスポーツカーレースで才能を発揮。コーリン・チャップマンに見出されロータスに加入。',
      f1Journey: 'ロータス一筋で走り続け、1963年と1965年にワールドチャンピオンを獲得。インディ500でも優勝を果たす。',
      drivingStyle: '信じられないほどスムーズで流れるようなドライビング。マシンに負担をかけず、誰よりも速く走る「天才」の代名詞。',
    },
    careerStats: {
      wins: 25,
      podiums: 32,
      poles: 33,
      fastestLaps: 28,
      racesStarted: 72,
    },
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

// Insert into KNOWLEDGE_TEAMS
kd = kd.replace('export const KNOWLEDGE_TEAMS: TeamProfile[] = [', 'export const KNOWLEDGE_TEAMS: TeamProfile[] = [\n' + lotusTeam);

// Insert into KNOWLEDGE_DRIVERS
kd = kd.replace('export const KNOWLEDGE_DRIVERS: DriverProfile[] = [', 'export const KNOWLEDGE_DRIVERS: DriverProfile[] = [\n' + jimClark);

fs.writeFileSync('data/f1KnowledgeData.ts', kd, 'utf-8');
console.log('Added Team Lotus and Jim Clark to library');
