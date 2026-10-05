import type { TeamProfile } from './f1KnowledgeData';

export const HISTORICAL_TEAMS: TeamProfile[] = [
  {
    id: 'team-lotus',
    name: 'Team Lotus',
    fullName: 'Team Lotus',
    teamPrincipal: 'Colin Chapman',
    powerUnit: 'Ford Cosworth DFV / Climax / Renault',
    base: 'Hethel, Norfolk, United Kingdom',
    constructorTitles: 7,
    championshipYears: [1963, 1965, 1968, 1970, 1972, 1973, 1978],
    drivers: ['CLK', 'RND', 'FIT', 'AND', 'SEN'],
    color: '#004225', // British Racing Green
    structure: {
      technicalDirector: 'Colin Chapman / Maurice Philippe',
      aeroHead: 'Peter Wright',
      facility: 'Hethel Engineering Facility',
    },
    iconicCars: [
      {
        model: 'Lotus 79',
        year: 1978,
        achievement: 'Championship Winner',
        keyTech: 'Ground Effect (ベンチュリ・トンネル構造)',
      },
      {
        model: 'Lotus 49',
        year: 1967,
        achievement: 'Championship Winner',
        keyTech: 'Ford Cosworth DFV エンジンのストレスメンバー化',
      }
    ],
    philosophy: {
      aeroFocus: 'グラウンド・エフェクトによる圧倒的なダウンフォース',
      mechanicalFocus: '「軽さは速さ」に基づく徹底した軽量化とモノコック構造',
      description: 'コーリン・チャップマン率いる伝説的チーム。モノコック、ウィング、グラウンドエフェクトなど、現代F1の基礎となる技術革命を次々と起こし、モータースポーツの歴史を塗り替えた。',
    },
    references: [
      {
        id: 1,
        title: 'Team Lotus - F1 Constructor Profile',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/Lotus.html',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'brabham',
    name: 'Brabham',
    fullName: 'Motor Racing Developments Ltd',
    teamPrincipal: 'Jack Brabham / Bernie Ecclestone',
    powerUnit: 'Repco / Ford Cosworth DFV / BMW',
    base: 'Chessington / Milton Keynes, United Kingdom',
    constructorTitles: 2,
    championshipYears: [1966, 1967],
    drivers: ['BRA', 'HUL', 'LAU', 'PIQ'],
    color: '#000080', // Brabham Blue (Dark)
    structure: {
      technicalDirector: 'Ron Tauranac / Gordon Murray',
      aeroHead: 'Gordon Murray',
      facility: 'Chessington Factory',
    },
    iconicCars: [
      {
        model: 'BT46B',
        year: 1978,
        achievement: '1 Race, 1 Win',
        keyTech: 'ファン・カー (Fan Car) 構造',
      },
      {
        model: 'BT52',
        year: 1983,
        achievement: 'Drivers Championship Winner (N. Piquet)',
        keyTech: 'ダート・シェイプ空力とBMWターボエンジン',
      }
    ],
    philosophy: {
      aeroFocus: 'ファン・カーなどルールを極限まで解釈した革新的エアロ',
      mechanicalFocus: 'ピットストップ給油戦術の導入と信頼性の追求',
      description: 'ジャック・ブラバムが設立し、後にバーニー・エクレストンが率いた名門。ゴードン・マレーによる奇抜で革新的なマシン設計（ファン・カーなど）と、給油作戦の導入など戦術面でも歴史に名を刻む。',
    },
    references: [
      {
        id: 1,
        title: 'Brabham - Constructor History',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/Brabham.html',
        verifiedDate: '2026-01-01',
      }
    ],
  },
  {
    id: 'tyrrell',
    name: 'Tyrrell',
    fullName: 'Tyrrell Racing Organisation',
    teamPrincipal: 'Ken Tyrrell',
    powerUnit: 'Ford Cosworth DFV / Renault / Yamaha / Honda',
    base: 'Ockham, Surrey, United Kingdom',
    constructorTitles: 1,
    championshipYears: [1971],
    drivers: ['STE', 'CEV', 'ALB', 'SAL', 'ALE'],
    color: '#002366', // Tyrrell Blue
    structure: {
      technicalDirector: 'Derek Gardner / Harvey Postlethwaite',
      aeroHead: 'Jean-Claude Migeot',
      facility: 'Ockham Woods Facility',
    },
    iconicCars: [
      {
        model: 'P34',
        year: 1976,
        achievement: '1 Win, 14 Podiums',
        keyTech: '6輪車（フロント4輪配置による空気抵抗低減）',
      },
      {
        model: '019',
        year: 1990,
        achievement: 'Pioneering Aero',
        keyTech: 'ハイノーズとアンヘドラルウイングの採用',
      }
    ],
    philosophy: {
      aeroFocus: 'ハイノーズ設計による床下気流の最大化',
      mechanicalFocus: '6輪車構想に代表される既成概念にとらわれないパッケージング',
      description: '「木こり」ことケン・ティレルが率いたプライベーターの星。P34（6輪車）や019（元祖ハイノーズ）など、F1の歴史に永遠に語り継がれる奇抜かつ合理的なマシンを生み出した。',
    },
    references: [
      {
        id: 1,
        title: 'Tyrrell - Historical Constructor',
        publisher: 'Formula 1 Official',
        url: 'https://www.formula1.com/en/teams/Tyrrell.html',
        verifiedDate: '2026-01-01',
      }
    ],
  }
];
