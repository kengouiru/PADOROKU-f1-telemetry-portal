const fs = require('fs');

function updateFile(file, updater) {
    let content = fs.readFileSync(file, 'utf8');
    content = updater(content);
    fs.writeFileSync(file, content, 'utf8');
}

// 1. f1KnowledgeData.ts
updateFile('C:/CreationKengo/F1analyisis-app/f1-telemetry-next/data/f1KnowledgeData.ts', content => {
    // VER championships
    content = content.replace(/(id: 'max-verstappen'[\s\S]*?)championships: 3,/, '$1championships: 4,');
    
    // VER carNumber in 2026
    content = content.replace(/({ year: 2026, team: 'Red Bull Racing Honda', teamId: 'red-bull', role: 'Regular', carNumber: )1(,)/, '$13$2');
    content = content.replace(/(id: 'max-verstappen',\s*code: 'VER',\s*number: )1,/, '$13,');
    content = content.replace(/year: 2026, team: 'Red Bull Racing'([^{}]*?)carNumber: 1/g, "year: 2026, team: 'Red Bull Racing'$1carNumber: 3");

    // McLaren constructors' titles
    content = content.replace(/(id: 'mclaren',[\s\S]*?)constructorTitles: 9,/, '$1constructorTitles: 10,');

    // Audi TP
    content = content.replace(/(id: 'audi',[\s\S]*?teamPrincipal: ')Mattia Binotto(',)/, '$1Jonathan Wheatley$2');

    // Cadillac TP
    content = content.replace(/(id: 'cadillac',[\s\S]*?teamPrincipal: ')Marcin Budkowski(',)/, '$1Graeme Lowdon$2');

    // RB drivers
    content = content.replace(/(id: 'rb',[\s\S]*?)'TSU', 'LAW'(\])/, "$1'LAW', 'LIN'$2");

    // Senna from Williams champions
    content = content.replace(/(id: 'williams',[\s\S]*?champions: \[.*?)'Ayrton Senna',\s*(.*?\])/, '$1$2');
    content = content.replace(/(id: 'williams',[\s\S]*?champions: \[.*?)'Ayrton Senna'(\])/, '$1$2');

    // Doohan debut year
    content = content.replace(/(id: 'jack-doohan',[\s\S]*?f1Debut: ')[0-9]{4}(年 オーストラリアGP \(Alpine\)',)/, '$12025$2');

    // Bearman first ever
    content = content.replace(/first ever/g, 'first');
    content = content.replace(/史上初/g, '初'); // if it's in Japanese

    // Update Reference type
    content = content.replace(/export interface Reference \{([^}]+)\}/, 
        "export interface Reference {$1  type?: 'official' | 'press' | 'encyclopedia' | 'other';\n  accessedDate?: string;\n  archiveUrl?: string;\n}"
    );

    // statsAsOf
    content = content.replace(/export interface DriverProfile \{/, 
        "export interface DriverProfile {\n  statsAsOf?: string;"
    );
    content = content.replace(/export interface TeamProfile \{/, 
        "export interface TeamProfile {\n  statsAsOf?: string;"
    );

    // Add statsAsOf to VER
    content = content.replace(/(id: 'max-verstappen',[\s\S]*?)championships: 4,/, "$1statsAsOf: '2026-10-05',\n    championships: 4,");

    // Lindblad Profile
    if (!content.includes("id: 'arvid-lindblad'")) {
        let lindbladProfile = `
  {
    id: 'arvid-lindblad',
    code: 'LIN',
    number: 41,
    fullName: 'Arvid Lindblad',
    country: 'イギリス 🇬🇧',
    team: 'Visa Cash App RB',
    teamColor: '#6692FF',
    status: 'Current',
    nickname: '',
    birthDate: '2007-08-08',
    birthPlace: 'Surrey, United Kingdom',
    f1Debut: '2026年 オーストラリアGP (RB)',
    driverType: 'Smooth',
    numberOrigin: 'F2/F3時代からの番号',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/default.jpg',
      caption: 'Arvid Lindblad (Visa Cash App RB)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org'
    },
    visualGallery: [],
    engineeringPreference: { setupBalance: 'Neutral', pedalFeel: 'Stiff', steeringWeight: 'Medium' },
    raceEngineer: { name: 'Pierre Hamelin', callsign: 'Pierre', dynamic: 'Supportive' },
    socialLinks: {},
    careerSummary: 'レッドブルジュニアチームの有望株として、2026年にVisa Cash App RBからF1デビューを果たしたイギリス人ドライバー。',
    statsAsOf: '2026-10-05',
    entries: 16,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    championships: 0,
    biography: { personality: 'Calm', hobbies: [], rivalries: '' },
    milestones: [],
    references: [
      { id: 1, title: 'Arvid Lindblad - F1 Driver Profile', publisher: 'Formula 1 Official', url: 'https://www.formula1.com/en/drivers/arvid-lindblad', verifiedDate: '2026-10-05', type: 'official' }
    ],
    seasonHistory: [
      { year: 2026, team: 'Visa Cash App RB', teamId: 'rb', role: 'Regular', carNumber: 41, note: 'ルーキーシーズン' }
    ]
  },`;
        content = content.replace(/(export const f1DriversData: DriverProfile\[\] = \[)/, "$1" + lindbladProfile);
    }

    return content;
});

console.log('Done');
