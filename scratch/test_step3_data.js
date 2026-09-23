const fs = require('fs');

// Check that the data structures and seasons are complete
const VET_DATA = {
  id: 'sebastian-vettel',
  code: 'VET',
  number: 5,
  fullName: 'Sebastian Vettel',
  country: 'ドイツ 🇩🇪',
  team: 'Red Bull / Ferrari / Aston Martin',
  teamColor: '#D4AF37',
  status: 'Legend',
  nickname: 'ベイビー・シューミ / The Finger / ブロウンディフューザーの神童',
  birthDate: '1987-07-03',
  birthPlace: 'Heppenheim, Germany',
  f1Debut: '2007年 アメリカGP (BMW Sauber)',
  driverType: '超絶エイペックス加速＆予選からのポールトゥウィン',
  numberOrigin: 'カート時代からのラッキーナンバーであり、レッドブル・フェラーリ・アストンマーティンで背負った「5」番。',
  careerSummary: 'BMWザウバーで代役デビュー入賞後、トロロッソで史上最年少ポール＆初優勝の奇跡を達成 [1]。レッドブル・レーシングへ昇格すると、2010年から2013年にかけて前人未到のドライバーズタイトル4連覇を成し遂げた [2]。グランプリ通算53勝（歴代4位）、ポールポジション57回を記録した近代F1の偉大なる王者。',
  entries: 299,
  wins: 53,
  podiums: 122,
  polePositions: 57,
  championships: 4,
  championshipYears: [2010, 2011, 2012, 2013],
};

console.log('Vettel check:', VET_DATA.fullName, VET_DATA.championships);
