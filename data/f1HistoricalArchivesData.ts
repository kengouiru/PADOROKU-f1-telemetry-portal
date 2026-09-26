/**
 * data/f1HistoricalArchivesData.ts
 * Formula 1 Official Historical Archives (2021 - 2025).
 * Ground truth official records from Jolpica / Ergast API.
 */

export interface HistoricalWinner {
  driverCode: string;
  driverName: string;
  constructorName: string;
  time?: string;
}

export interface HistoricalRaceEvent {
  round: number;
  raceName: string;
  circuitName: string;
  city: string;
  country: string;
  flag: string;
  date: string;
  winner?: HistoricalWinner;
}

export interface HistoricalDriverStanding {
  position: number;
  driverCode: string;
  driverName: string;
  team: string;
  points: number;
  wins: number;
}

export interface HistoricalConstructorStanding {
  position: number;
  teamName: string;
  points: number;
  wins: number;
}

export interface HistoricalSeasonArchive {
  year: number;
  racesCount: number;
  championDriver: {
    name: string;
    code: string;
    team: string;
    points: number;
    wins: number;
  };
  championConstructor: {
    name: string;
    points: number;
    wins: number;
  };
  seasonSummary: string;
  driverStandings: HistoricalDriverStanding[];
  constructorStandings: HistoricalConstructorStanding[];
  calendar: HistoricalRaceEvent[];
}

export const HISTORICAL_ARCHIVES: Record<number, HistoricalSeasonArchive> = {
  // ── 2020 SEASON ARCHIVE ──
  2020: {
    year: 2020,
    racesCount: 17,
    championDriver: {
      name: 'Lewis Hamilton',
      code: 'HAM',
      team: 'Mercedes',
      points: 347,
      wins: 11,
    },
    championConstructor: {
      name: 'Mercedes',
      points: 573,
      wins: 13,
    },
    seasonSummary: '新型コロナ禍による異例の全17戦変則シーズン。ハミルトンがミハエル・シューマッハに並ぶ歴代最多タイ『7度目の世界王者』を達成し、歴代最多勝記録も更新した。',
    driverStandings: [
      {
            "position": 1,
            "driverCode": "HAM",
            "driverName": "Lewis Hamilton",
            "team": "Mercedes",
            "points": 347,
            "wins": 11
      },
      {
            "position": 2,
            "driverCode": "BOT",
            "driverName": "Valtteri Bottas",
            "team": "Mercedes",
            "points": 223,
            "wins": 2
      },
      {
            "position": 3,
            "driverCode": "VER",
            "driverName": "Max Verstappen",
            "team": "Red Bull",
            "points": 214,
            "wins": 2
      },
      {
            "position": 4,
            "driverCode": "PER",
            "driverName": "Sergio Pérez",
            "team": "Racing Point",
            "points": 125,
            "wins": 1
      },
      {
            "position": 5,
            "driverCode": "RIC",
            "driverName": "Daniel Ricciardo",
            "team": "Renault",
            "points": 119,
            "wins": 0
      },
      {
            "position": 6,
            "driverCode": "SAI",
            "driverName": "Carlos Sainz",
            "team": "McLaren",
            "points": 105,
            "wins": 0
      },
      {
            "position": 7,
            "driverCode": "ALB",
            "driverName": "Alexander Albon",
            "team": "Red Bull",
            "points": 105,
            "wins": 0
      },
      {
            "position": 8,
            "driverCode": "LEC",
            "driverName": "Charles Leclerc",
            "team": "Ferrari",
            "points": 98,
            "wins": 0
      },
      {
            "position": 9,
            "driverCode": "NOR",
            "driverName": "Lando Norris",
            "team": "McLaren",
            "points": 97,
            "wins": 0
      },
      {
            "position": 10,
            "driverCode": "GAS",
            "driverName": "Pierre Gasly",
            "team": "AlphaTauri",
            "points": 75,
            "wins": 1
      },
      {
            "position": 11,
            "driverCode": "STR",
            "driverName": "Lance Stroll",
            "team": "Racing Point",
            "points": 75,
            "wins": 0
      },
      {
            "position": 12,
            "driverCode": "OCO",
            "driverName": "Esteban Ocon",
            "team": "Renault",
            "points": 62,
            "wins": 0
      },
      {
            "position": 13,
            "driverCode": "VET",
            "driverName": "Sebastian Vettel",
            "team": "Ferrari",
            "points": 33,
            "wins": 0
      },
      {
            "position": 14,
            "driverCode": "KVY",
            "driverName": "Daniil Kvyat",
            "team": "AlphaTauri",
            "points": 32,
            "wins": 0
      },
      {
            "position": 15,
            "driverCode": "HUL",
            "driverName": "Nico Hülkenberg",
            "team": "Racing Point",
            "points": 10,
            "wins": 0
      },
      {
            "position": 16,
            "driverCode": "RAI",
            "driverName": "Kimi Räikkönen",
            "team": "Alfa Romeo",
            "points": 4,
            "wins": 0
      },
      {
            "position": 17,
            "driverCode": "GIO",
            "driverName": "Antonio Giovinazzi",
            "team": "Alfa Romeo",
            "points": 4,
            "wins": 0
      },
      {
            "position": 18,
            "driverCode": "RUS",
            "driverName": "George Russell",
            "team": "Williams",
            "points": 3,
            "wins": 0
      },
      {
            "position": 19,
            "driverCode": "GRO",
            "driverName": "Romain Grosjean",
            "team": "Haas F1 Team",
            "points": 2,
            "wins": 0
      },
      {
            "position": 20,
            "driverCode": "MAG",
            "driverName": "Kevin Magnussen",
            "team": "Haas F1 Team",
            "points": 1,
            "wins": 0
      },
      {
            "position": 21,
            "driverCode": "LAT",
            "driverName": "Nicholas Latifi",
            "team": "Williams",
            "points": 0,
            "wins": 0
      },
      {
            "position": 22,
            "driverCode": "AIT",
            "driverName": "Jack Aitken",
            "team": "Williams",
            "points": 0,
            "wins": 0
      },
      {
            "position": 23,
            "driverCode": "FIT",
            "driverName": "Pietro Fittipaldi",
            "team": "Haas F1 Team",
            "points": 0,
            "wins": 0
      }
],
    constructorStandings: [
      {
            "position": 1,
            "teamName": "Mercedes",
            "points": 573,
            "wins": 13
      },
      {
            "position": 2,
            "teamName": "Red Bull",
            "points": 319,
            "wins": 2
      },
      {
            "position": 3,
            "teamName": "McLaren",
            "points": 202,
            "wins": 0
      },
      {
            "position": 4,
            "teamName": "Racing Point",
            "points": 195,
            "wins": 1
      },
      {
            "position": 5,
            "teamName": "Renault",
            "points": 181,
            "wins": 0
      },
      {
            "position": 6,
            "teamName": "Ferrari",
            "points": 131,
            "wins": 0
      },
      {
            "position": 7,
            "teamName": "AlphaTauri",
            "points": 107,
            "wins": 1
      },
      {
            "position": 8,
            "teamName": "Alfa Romeo",
            "points": 8,
            "wins": 0
      },
      {
            "position": 9,
            "teamName": "Haas F1 Team",
            "points": 3,
            "wins": 0
      },
      {
            "position": 10,
            "teamName": "Williams",
            "points": 0,
            "wins": 0
      }
],
    calendar: [
      {
            "round": 1,
            "raceName": "Austrian Grand Prix",
            "circuitName": "Red Bull Ring",
            "city": "Spielberg",
            "country": "Austria",
            "flag": "🇦🇹",
            "date": "2020-07-05",
            "winner": {
                  "driverCode": "BOT",
                  "driverName": "Valtteri Bottas",
                  "constructorName": "Mercedes",
                  "time": "1:30:55.739"
            }
      },
      {
            "round": 2,
            "raceName": "Styrian Grand Prix",
            "circuitName": "Red Bull Ring",
            "city": "Spielberg",
            "country": "Austria",
            "flag": "🇦🇹",
            "date": "2020-07-12",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:22:50.683"
            }
      },
      {
            "round": 3,
            "raceName": "Hungarian Grand Prix",
            "circuitName": "Hungaroring",
            "city": "Budapest",
            "country": "Hungary",
            "flag": "🇭🇺",
            "date": "2020-07-19",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:36:12.473"
            }
      },
      {
            "round": 4,
            "raceName": "British Grand Prix",
            "circuitName": "Silverstone Circuit",
            "city": "Silverstone",
            "country": "UK",
            "flag": "🇬🇧",
            "date": "2020-08-02",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:28:01.283"
            }
      },
      {
            "round": 5,
            "raceName": "70th Anniversary Grand Prix",
            "circuitName": "Silverstone Circuit",
            "city": "Silverstone",
            "country": "UK",
            "flag": "🇬🇧",
            "date": "2020-08-09",
            "winner": {
                  "driverCode": "VER",
                  "driverName": "Max Verstappen",
                  "constructorName": "Red Bull",
                  "time": "1:19:41.993"
            }
      },
      {
            "round": 6,
            "raceName": "Spanish Grand Prix",
            "circuitName": "Circuit de Barcelona-Catalunya",
            "city": "Barcelona",
            "country": "Spain",
            "flag": "🇪🇸",
            "date": "2020-08-16",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:31:45.279"
            }
      },
      {
            "round": 7,
            "raceName": "Belgian Grand Prix",
            "circuitName": "Circuit de Spa-Francorchamps",
            "city": "Spa",
            "country": "Belgium",
            "flag": "🇧🇪",
            "date": "2020-08-30",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:24:08.761"
            }
      },
      {
            "round": 8,
            "raceName": "Italian Grand Prix",
            "circuitName": "Autodromo Nazionale di Monza",
            "city": "Monza",
            "country": "Italy",
            "flag": "🇮🇹",
            "date": "2020-09-06",
            "winner": {
                  "driverCode": "GAS",
                  "driverName": "Pierre Gasly",
                  "constructorName": "AlphaTauri",
                  "time": "1:47:06.056"
            }
      },
      {
            "round": 9,
            "raceName": "Tuscan Grand Prix",
            "circuitName": "Autodromo Internazionale del Mugello",
            "city": "Mugello",
            "country": "Italy",
            "flag": "🇮🇹",
            "date": "2020-09-13",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "2:19:35.060"
            }
      },
      {
            "round": 10,
            "raceName": "Russian Grand Prix",
            "circuitName": "Sochi Autodrom",
            "city": "Sochi",
            "country": "Russia",
            "flag": "🇷🇺",
            "date": "2020-09-27",
            "winner": {
                  "driverCode": "BOT",
                  "driverName": "Valtteri Bottas",
                  "constructorName": "Mercedes",
                  "time": "1:34:00.364"
            }
      },
      {
            "round": 11,
            "raceName": "Eifel Grand Prix",
            "circuitName": "Nürburgring",
            "city": "Nürburg",
            "country": "Germany",
            "flag": "🇩🇪",
            "date": "2020-10-11",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:35:49.641"
            }
      },
      {
            "round": 12,
            "raceName": "Portuguese Grand Prix",
            "circuitName": "Autódromo Internacional do Algarve",
            "city": "Portimão",
            "country": "Portugal",
            "flag": "🇵🇹",
            "date": "2020-10-25",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:29:56.828"
            }
      },
      {
            "round": 13,
            "raceName": "Emilia Romagna Grand Prix",
            "circuitName": "Autodromo Enzo e Dino Ferrari",
            "city": "Imola",
            "country": "Italy",
            "flag": "🇮🇹",
            "date": "2020-11-01",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:28:32.430"
            }
      },
      {
            "round": 14,
            "raceName": "Turkish Grand Prix",
            "circuitName": "Istanbul Park",
            "city": "Istanbul",
            "country": "Turkey",
            "flag": "🇹🇷",
            "date": "2020-11-15",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:42:19.313"
            }
      },
      {
            "round": 15,
            "raceName": "Bahrain Grand Prix",
            "circuitName": "Bahrain International Circuit",
            "city": "Sakhir",
            "country": "Bahrain",
            "flag": "🇧🇭",
            "date": "2020-11-29",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "2:59:47.515"
            }
      },
      {
            "round": 16,
            "raceName": "Sakhir Grand Prix",
            "circuitName": "Bahrain International Circuit",
            "city": "Sakhir",
            "country": "Bahrain",
            "flag": "🇧🇭",
            "date": "2020-12-06",
            "winner": {
                  "driverCode": "PER",
                  "driverName": "Sergio Pérez",
                  "constructorName": "Racing Point",
                  "time": "1:31:15.114"
            }
      },
      {
            "round": 17,
            "raceName": "Abu Dhabi Grand Prix",
            "circuitName": "Yas Marina Circuit",
            "city": "Abu Dhabi",
            "country": "UAE",
            "flag": "🇦🇪",
            "date": "2020-12-13",
            "winner": {
                  "driverCode": "VER",
                  "driverName": "Max Verstappen",
                  "constructorName": "Red Bull",
                  "time": "1:36:28.645"
            }
      }
],
  },
  // ── 2019 SEASON ARCHIVE ──
  2019: {
    year: 2019,
    racesCount: 21,
    championDriver: {
      name: 'Lewis Hamilton',
      code: 'HAM',
      team: 'Mercedes',
      points: 413,
      wins: 11,
    },
    championConstructor: {
      name: 'Mercedes',
      points: 739,
      wins: 15,
    },
    seasonSummary: '開幕5戦連続ワンツーフィニッシュを飾ったメルセデスが圧倒。ハミルトンが6度目の王座を獲得し、ホンダがオーストリアGPでフェルスタッペンと共に13年ぶりの歴史的勝利を飾った。',
    driverStandings: [
      {
            "position": 1,
            "driverCode": "HAM",
            "driverName": "Lewis Hamilton",
            "team": "Mercedes",
            "points": 413,
            "wins": 11
      },
      {
            "position": 2,
            "driverCode": "BOT",
            "driverName": "Valtteri Bottas",
            "team": "Mercedes",
            "points": 326,
            "wins": 4
      },
      {
            "position": 3,
            "driverCode": "VER",
            "driverName": "Max Verstappen",
            "team": "Red Bull",
            "points": 278,
            "wins": 3
      },
      {
            "position": 4,
            "driverCode": "LEC",
            "driverName": "Charles Leclerc",
            "team": "Ferrari",
            "points": 264,
            "wins": 2
      },
      {
            "position": 5,
            "driverCode": "VET",
            "driverName": "Sebastian Vettel",
            "team": "Ferrari",
            "points": 240,
            "wins": 1
      },
      {
            "position": 6,
            "driverCode": "SAI",
            "driverName": "Carlos Sainz",
            "team": "McLaren",
            "points": 96,
            "wins": 0
      },
      {
            "position": 7,
            "driverCode": "GAS",
            "driverName": "Pierre Gasly",
            "team": "Red Bull",
            "points": 95,
            "wins": 0
      },
      {
            "position": 8,
            "driverCode": "ALB",
            "driverName": "Alexander Albon",
            "team": "Toro Rosso",
            "points": 92,
            "wins": 0
      },
      {
            "position": 9,
            "driverCode": "RIC",
            "driverName": "Daniel Ricciardo",
            "team": "Renault",
            "points": 54,
            "wins": 0
      },
      {
            "position": 10,
            "driverCode": "PER",
            "driverName": "Sergio Pérez",
            "team": "Racing Point",
            "points": 52,
            "wins": 0
      },
      {
            "position": 11,
            "driverCode": "NOR",
            "driverName": "Lando Norris",
            "team": "McLaren",
            "points": 49,
            "wins": 0
      },
      {
            "position": 12,
            "driverCode": "RAI",
            "driverName": "Kimi Räikkönen",
            "team": "Alfa Romeo",
            "points": 43,
            "wins": 0
      },
      {
            "position": 13,
            "driverCode": "KVY",
            "driverName": "Daniil Kvyat",
            "team": "Toro Rosso",
            "points": 37,
            "wins": 0
      },
      {
            "position": 14,
            "driverCode": "HUL",
            "driverName": "Nico Hülkenberg",
            "team": "Renault",
            "points": 37,
            "wins": 0
      },
      {
            "position": 15,
            "driverCode": "STR",
            "driverName": "Lance Stroll",
            "team": "Racing Point",
            "points": 21,
            "wins": 0
      },
      {
            "position": 16,
            "driverCode": "MAG",
            "driverName": "Kevin Magnussen",
            "team": "Haas F1 Team",
            "points": 20,
            "wins": 0
      },
      {
            "position": 17,
            "driverCode": "GIO",
            "driverName": "Antonio Giovinazzi",
            "team": "Alfa Romeo",
            "points": 14,
            "wins": 0
      },
      {
            "position": 18,
            "driverCode": "GRO",
            "driverName": "Romain Grosjean",
            "team": "Haas F1 Team",
            "points": 8,
            "wins": 0
      },
      {
            "position": 19,
            "driverCode": "KUB",
            "driverName": "Robert Kubica",
            "team": "Williams",
            "points": 1,
            "wins": 0
      },
      {
            "position": 20,
            "driverCode": "RUS",
            "driverName": "George Russell",
            "team": "Williams",
            "points": 0,
            "wins": 0
      }
],
    constructorStandings: [
      {
            "position": 1,
            "teamName": "Mercedes",
            "points": 739,
            "wins": 15
      },
      {
            "position": 2,
            "teamName": "Ferrari",
            "points": 504,
            "wins": 3
      },
      {
            "position": 3,
            "teamName": "Red Bull",
            "points": 417,
            "wins": 3
      },
      {
            "position": 4,
            "teamName": "McLaren",
            "points": 145,
            "wins": 0
      },
      {
            "position": 5,
            "teamName": "Renault",
            "points": 91,
            "wins": 0
      },
      {
            "position": 6,
            "teamName": "Toro Rosso",
            "points": 85,
            "wins": 0
      },
      {
            "position": 7,
            "teamName": "Racing Point",
            "points": 73,
            "wins": 0
      },
      {
            "position": 8,
            "teamName": "Alfa Romeo",
            "points": 57,
            "wins": 0
      },
      {
            "position": 9,
            "teamName": "Haas F1 Team",
            "points": 28,
            "wins": 0
      },
      {
            "position": 10,
            "teamName": "Williams",
            "points": 1,
            "wins": 0
      }
],
    calendar: [
      {
            "round": 1,
            "raceName": "Australian Grand Prix",
            "circuitName": "Albert Park Grand Prix Circuit",
            "city": "Melbourne",
            "country": "Australia",
            "flag": "🇦🇺",
            "date": "2019-03-17",
            "winner": {
                  "driverCode": "BOT",
                  "driverName": "Valtteri Bottas",
                  "constructorName": "Mercedes",
                  "time": "1:25:27.325"
            }
      },
      {
            "round": 2,
            "raceName": "Bahrain Grand Prix",
            "circuitName": "Bahrain International Circuit",
            "city": "Sakhir",
            "country": "Bahrain",
            "flag": "🇧🇭",
            "date": "2019-03-31",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:34:21.295"
            }
      },
      {
            "round": 3,
            "raceName": "Chinese Grand Prix",
            "circuitName": "Shanghai International Circuit",
            "city": "Shanghai",
            "country": "China",
            "flag": "🇨🇳",
            "date": "2019-04-14",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:32:06.350"
            }
      },
      {
            "round": 4,
            "raceName": "Azerbaijan Grand Prix",
            "circuitName": "Baku City Circuit",
            "city": "Baku",
            "country": "Azerbaijan",
            "flag": "🇦🇿",
            "date": "2019-04-28",
            "winner": {
                  "driverCode": "BOT",
                  "driverName": "Valtteri Bottas",
                  "constructorName": "Mercedes",
                  "time": "1:31:52.942"
            }
      },
      {
            "round": 5,
            "raceName": "Spanish Grand Prix",
            "circuitName": "Circuit de Barcelona-Catalunya",
            "city": "Barcelona",
            "country": "Spain",
            "flag": "🇪🇸",
            "date": "2019-05-12",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:35:50.443"
            }
      },
      {
            "round": 6,
            "raceName": "Monaco Grand Prix",
            "circuitName": "Circuit de Monaco",
            "city": "Monte Carlo",
            "country": "Monaco",
            "flag": "🇲🇨",
            "date": "2019-05-26",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:43:28.437"
            }
      },
      {
            "round": 7,
            "raceName": "Canadian Grand Prix",
            "circuitName": "Circuit Gilles Villeneuve",
            "city": "Montreal",
            "country": "Canada",
            "flag": "🇨🇦",
            "date": "2019-06-09",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:29:07.084"
            }
      },
      {
            "round": 8,
            "raceName": "French Grand Prix",
            "circuitName": "Circuit Paul Ricard",
            "city": "Le Castellet",
            "country": "France",
            "flag": "🇫🇷",
            "date": "2019-06-23",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:24:31.198"
            }
      },
      {
            "round": 9,
            "raceName": "Austrian Grand Prix",
            "circuitName": "Red Bull Ring",
            "city": "Spielberg",
            "country": "Austria",
            "flag": "🇦🇹",
            "date": "2019-06-30",
            "winner": {
                  "driverCode": "VER",
                  "driverName": "Max Verstappen",
                  "constructorName": "Red Bull",
                  "time": "1:22:01.822"
            }
      },
      {
            "round": 10,
            "raceName": "British Grand Prix",
            "circuitName": "Silverstone Circuit",
            "city": "Silverstone",
            "country": "UK",
            "flag": "🇬🇧",
            "date": "2019-07-14",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:21:08.452"
            }
      },
      {
            "round": 11,
            "raceName": "German Grand Prix",
            "circuitName": "Hockenheimring",
            "city": "Hockenheim",
            "country": "Germany",
            "flag": "🇩🇪",
            "date": "2019-07-28",
            "winner": {
                  "driverCode": "VER",
                  "driverName": "Max Verstappen",
                  "constructorName": "Red Bull",
                  "time": "1:44:31.275"
            }
      },
      {
            "round": 12,
            "raceName": "Hungarian Grand Prix",
            "circuitName": "Hungaroring",
            "city": "Budapest",
            "country": "Hungary",
            "flag": "🇭🇺",
            "date": "2019-08-04",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:35:03.796"
            }
      },
      {
            "round": 13,
            "raceName": "Belgian Grand Prix",
            "circuitName": "Circuit de Spa-Francorchamps",
            "city": "Spa",
            "country": "Belgium",
            "flag": "🇧🇪",
            "date": "2019-09-01",
            "winner": {
                  "driverCode": "LEC",
                  "driverName": "Charles Leclerc",
                  "constructorName": "Ferrari",
                  "time": "1:23:45.710"
            }
      },
      {
            "round": 14,
            "raceName": "Italian Grand Prix",
            "circuitName": "Autodromo Nazionale di Monza",
            "city": "Monza",
            "country": "Italy",
            "flag": "🇮🇹",
            "date": "2019-09-08",
            "winner": {
                  "driverCode": "LEC",
                  "driverName": "Charles Leclerc",
                  "constructorName": "Ferrari",
                  "time": "1:15:26.665"
            }
      },
      {
            "round": 15,
            "raceName": "Singapore Grand Prix",
            "circuitName": "Marina Bay Street Circuit",
            "city": "Marina Bay",
            "country": "Singapore",
            "flag": "🇸🇬",
            "date": "2019-09-22",
            "winner": {
                  "driverCode": "VET",
                  "driverName": "Sebastian Vettel",
                  "constructorName": "Ferrari",
                  "time": "1:58:33.667"
            }
      },
      {
            "round": 16,
            "raceName": "Russian Grand Prix",
            "circuitName": "Sochi Autodrom",
            "city": "Sochi",
            "country": "Russia",
            "flag": "🇷🇺",
            "date": "2019-09-29",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:33:38.992"
            }
      },
      {
            "round": 17,
            "raceName": "Japanese Grand Prix",
            "circuitName": "Suzuka Circuit",
            "city": "Suzuka",
            "country": "Japan",
            "flag": "🇯🇵",
            "date": "2019-10-13",
            "winner": {
                  "driverCode": "BOT",
                  "driverName": "Valtteri Bottas",
                  "constructorName": "Mercedes",
                  "time": "1:21:46.755"
            }
      },
      {
            "round": 18,
            "raceName": "Mexican Grand Prix",
            "circuitName": "Autódromo Hermanos Rodríguez",
            "city": "Mexico City",
            "country": "Mexico",
            "flag": "🇲🇽",
            "date": "2019-10-27",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:36:48.904"
            }
      },
      {
            "round": 19,
            "raceName": "United States Grand Prix",
            "circuitName": "Circuit of the Americas",
            "city": "Austin",
            "country": "USA",
            "flag": "🇺🇸",
            "date": "2019-11-03",
            "winner": {
                  "driverCode": "BOT",
                  "driverName": "Valtteri Bottas",
                  "constructorName": "Mercedes",
                  "time": "1:33:55.653"
            }
      },
      {
            "round": 20,
            "raceName": "Brazilian Grand Prix",
            "circuitName": "Autódromo José Carlos Pace",
            "city": "São Paulo",
            "country": "Brazil",
            "flag": "🇧🇷",
            "date": "2019-11-17",
            "winner": {
                  "driverCode": "VER",
                  "driverName": "Max Verstappen",
                  "constructorName": "Red Bull",
                  "time": "1:33:14.678"
            }
      },
      {
            "round": 21,
            "raceName": "Abu Dhabi Grand Prix",
            "circuitName": "Yas Marina Circuit",
            "city": "Abu Dhabi",
            "country": "UAE",
            "flag": "🇦🇪",
            "date": "2019-12-01",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:34:05.715"
            }
      }
],
  },
  // ── 2018 SEASON ARCHIVE ──
  2018: {
    year: 2018,
    racesCount: 21,
    championDriver: {
      name: 'Lewis Hamilton',
      code: 'HAM',
      team: 'Mercedes',
      points: 408,
      wins: 11,
    },
    championConstructor: {
      name: 'Mercedes',
      points: 655,
      wins: 11,
    },
    seasonSummary: 'ハミルトンとベッテルの『5度目の戴冠』を懸けた激闘。シーズン後半にメルセデスが怒涛の連勝劇を演じ、ルイス・ハミルトンが通算5度目のワールドチャンピオンに輝いた。',
    driverStandings: [
      {
            "position": 1,
            "driverCode": "HAM",
            "driverName": "Lewis Hamilton",
            "team": "Mercedes",
            "points": 408,
            "wins": 11
      },
      {
            "position": 2,
            "driverCode": "VET",
            "driverName": "Sebastian Vettel",
            "team": "Ferrari",
            "points": 320,
            "wins": 5
      },
      {
            "position": 3,
            "driverCode": "RAI",
            "driverName": "Kimi Räikkönen",
            "team": "Ferrari",
            "points": 251,
            "wins": 1
      },
      {
            "position": 4,
            "driverCode": "VER",
            "driverName": "Max Verstappen",
            "team": "Red Bull",
            "points": 249,
            "wins": 2
      },
      {
            "position": 5,
            "driverCode": "BOT",
            "driverName": "Valtteri Bottas",
            "team": "Mercedes",
            "points": 247,
            "wins": 0
      },
      {
            "position": 6,
            "driverCode": "RIC",
            "driverName": "Daniel Ricciardo",
            "team": "Red Bull",
            "points": 170,
            "wins": 2
      },
      {
            "position": 7,
            "driverCode": "HUL",
            "driverName": "Nico Hülkenberg",
            "team": "Renault",
            "points": 69,
            "wins": 0
      },
      {
            "position": 8,
            "driverCode": "PER",
            "driverName": "Sergio Pérez",
            "team": "Force India",
            "points": 62,
            "wins": 0
      },
      {
            "position": 9,
            "driverCode": "MAG",
            "driverName": "Kevin Magnussen",
            "team": "Haas F1 Team",
            "points": 56,
            "wins": 0
      },
      {
            "position": 10,
            "driverCode": "SAI",
            "driverName": "Carlos Sainz",
            "team": "Renault",
            "points": 53,
            "wins": 0
      },
      {
            "position": 11,
            "driverCode": "ALO",
            "driverName": "Fernando Alonso",
            "team": "McLaren",
            "points": 50,
            "wins": 0
      },
      {
            "position": 12,
            "driverCode": "OCO",
            "driverName": "Esteban Ocon",
            "team": "Force India",
            "points": 49,
            "wins": 0
      },
      {
            "position": 13,
            "driverCode": "LEC",
            "driverName": "Charles Leclerc",
            "team": "Sauber",
            "points": 39,
            "wins": 0
      },
      {
            "position": 14,
            "driverCode": "GRO",
            "driverName": "Romain Grosjean",
            "team": "Haas F1 Team",
            "points": 37,
            "wins": 0
      },
      {
            "position": 15,
            "driverCode": "GAS",
            "driverName": "Pierre Gasly",
            "team": "Toro Rosso",
            "points": 29,
            "wins": 0
      },
      {
            "position": 16,
            "driverCode": "VAN",
            "driverName": "Stoffel Vandoorne",
            "team": "McLaren",
            "points": 12,
            "wins": 0
      },
      {
            "position": 17,
            "driverCode": "ERI",
            "driverName": "Marcus Ericsson",
            "team": "Sauber",
            "points": 9,
            "wins": 0
      },
      {
            "position": 18,
            "driverCode": "STR",
            "driverName": "Lance Stroll",
            "team": "Williams",
            "points": 6,
            "wins": 0
      },
      {
            "position": 19,
            "driverCode": "HAR",
            "driverName": "Brendon Hartley",
            "team": "Toro Rosso",
            "points": 4,
            "wins": 0
      },
      {
            "position": 20,
            "driverCode": "SIR",
            "driverName": "Sergey Sirotkin",
            "team": "Williams",
            "points": 1,
            "wins": 0
      }
],
    constructorStandings: [
      {
            "position": 1,
            "teamName": "Mercedes",
            "points": 655,
            "wins": 11
      },
      {
            "position": 2,
            "teamName": "Ferrari",
            "points": 571,
            "wins": 6
      },
      {
            "position": 3,
            "teamName": "Red Bull",
            "points": 419,
            "wins": 4
      },
      {
            "position": 4,
            "teamName": "Renault",
            "points": 122,
            "wins": 0
      },
      {
            "position": 5,
            "teamName": "Force India",
            "points": 111,
            "wins": 0
      },
      {
            "position": 6,
            "teamName": "Haas F1 Team",
            "points": 93,
            "wins": 0
      },
      {
            "position": 7,
            "teamName": "McLaren",
            "points": 62,
            "wins": 0
      },
      {
            "position": 8,
            "teamName": "Sauber",
            "points": 48,
            "wins": 0
      },
      {
            "position": 9,
            "teamName": "Toro Rosso",
            "points": 33,
            "wins": 0
      },
      {
            "position": 10,
            "teamName": "Williams",
            "points": 7,
            "wins": 0
      }
],
    calendar: [
      {
            "round": 1,
            "raceName": "Australian Grand Prix",
            "circuitName": "Albert Park Grand Prix Circuit",
            "city": "Melbourne",
            "country": "Australia",
            "flag": "🇦🇺",
            "date": "2018-03-25",
            "winner": {
                  "driverCode": "VET",
                  "driverName": "Sebastian Vettel",
                  "constructorName": "Ferrari",
                  "time": "1:29:33.283"
            }
      },
      {
            "round": 2,
            "raceName": "Bahrain Grand Prix",
            "circuitName": "Bahrain International Circuit",
            "city": "Sakhir",
            "country": "Bahrain",
            "flag": "🇧🇭",
            "date": "2018-04-08",
            "winner": {
                  "driverCode": "VET",
                  "driverName": "Sebastian Vettel",
                  "constructorName": "Ferrari",
                  "time": "1:32:01.940"
            }
      },
      {
            "round": 3,
            "raceName": "Chinese Grand Prix",
            "circuitName": "Shanghai International Circuit",
            "city": "Shanghai",
            "country": "China",
            "flag": "🇨🇳",
            "date": "2018-04-15",
            "winner": {
                  "driverCode": "RIC",
                  "driverName": "Daniel Ricciardo",
                  "constructorName": "Red Bull",
                  "time": "1:35:36.380"
            }
      },
      {
            "round": 4,
            "raceName": "Azerbaijan Grand Prix",
            "circuitName": "Baku City Circuit",
            "city": "Baku",
            "country": "Azerbaijan",
            "flag": "🇦🇿",
            "date": "2018-04-29",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:43:44.291"
            }
      },
      {
            "round": 5,
            "raceName": "Spanish Grand Prix",
            "circuitName": "Circuit de Barcelona-Catalunya",
            "city": "Barcelona",
            "country": "Spain",
            "flag": "🇪🇸",
            "date": "2018-05-13",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:35:29.972"
            }
      },
      {
            "round": 6,
            "raceName": "Monaco Grand Prix",
            "circuitName": "Circuit de Monaco",
            "city": "Monte Carlo",
            "country": "Monaco",
            "flag": "🇲🇨",
            "date": "2018-05-27",
            "winner": {
                  "driverCode": "RIC",
                  "driverName": "Daniel Ricciardo",
                  "constructorName": "Red Bull",
                  "time": "1:42:54.807"
            }
      },
      {
            "round": 7,
            "raceName": "Canadian Grand Prix",
            "circuitName": "Circuit Gilles Villeneuve",
            "city": "Montreal",
            "country": "Canada",
            "flag": "🇨🇦",
            "date": "2018-06-10",
            "winner": {
                  "driverCode": "VET",
                  "driverName": "Sebastian Vettel",
                  "constructorName": "Ferrari",
                  "time": "1:28:31.377"
            }
      },
      {
            "round": 8,
            "raceName": "French Grand Prix",
            "circuitName": "Circuit Paul Ricard",
            "city": "Le Castellet",
            "country": "France",
            "flag": "🇫🇷",
            "date": "2018-06-24",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:30:11.385"
            }
      },
      {
            "round": 9,
            "raceName": "Austrian Grand Prix",
            "circuitName": "Red Bull Ring",
            "city": "Spielberg",
            "country": "Austria",
            "flag": "🇦🇹",
            "date": "2018-07-01",
            "winner": {
                  "driverCode": "VER",
                  "driverName": "Max Verstappen",
                  "constructorName": "Red Bull",
                  "time": "1:21:56.024"
            }
      },
      {
            "round": 10,
            "raceName": "British Grand Prix",
            "circuitName": "Silverstone Circuit",
            "city": "Silverstone",
            "country": "UK",
            "flag": "🇬🇧",
            "date": "2018-07-08",
            "winner": {
                  "driverCode": "VET",
                  "driverName": "Sebastian Vettel",
                  "constructorName": "Ferrari",
                  "time": "1:27:29.784"
            }
      },
      {
            "round": 11,
            "raceName": "German Grand Prix",
            "circuitName": "Hockenheimring",
            "city": "Hockenheim",
            "country": "Germany",
            "flag": "🇩🇪",
            "date": "2018-07-22",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:32:29.845"
            }
      },
      {
            "round": 12,
            "raceName": "Hungarian Grand Prix",
            "circuitName": "Hungaroring",
            "city": "Budapest",
            "country": "Hungary",
            "flag": "🇭🇺",
            "date": "2018-07-29",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:37:16.427"
            }
      },
      {
            "round": 13,
            "raceName": "Belgian Grand Prix",
            "circuitName": "Circuit de Spa-Francorchamps",
            "city": "Spa",
            "country": "Belgium",
            "flag": "🇧🇪",
            "date": "2018-08-26",
            "winner": {
                  "driverCode": "VET",
                  "driverName": "Sebastian Vettel",
                  "constructorName": "Ferrari",
                  "time": "1:23:34.476"
            }
      },
      {
            "round": 14,
            "raceName": "Italian Grand Prix",
            "circuitName": "Autodromo Nazionale di Monza",
            "city": "Monza",
            "country": "Italy",
            "flag": "🇮🇹",
            "date": "2018-09-02",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:16:54.484"
            }
      },
      {
            "round": 15,
            "raceName": "Singapore Grand Prix",
            "circuitName": "Marina Bay Street Circuit",
            "city": "Marina Bay",
            "country": "Singapore",
            "flag": "🇸🇬",
            "date": "2018-09-16",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:51:11.611"
            }
      },
      {
            "round": 16,
            "raceName": "Russian Grand Prix",
            "circuitName": "Sochi Autodrom",
            "city": "Sochi",
            "country": "Russia",
            "flag": "🇷🇺",
            "date": "2018-09-30",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:27:25.181"
            }
      },
      {
            "round": 17,
            "raceName": "Japanese Grand Prix",
            "circuitName": "Suzuka Circuit",
            "city": "Suzuka",
            "country": "Japan",
            "flag": "🇯🇵",
            "date": "2018-10-07",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:27:17.062"
            }
      },
      {
            "round": 18,
            "raceName": "United States Grand Prix",
            "circuitName": "Circuit of the Americas",
            "city": "Austin",
            "country": "USA",
            "flag": "🇺🇸",
            "date": "2018-10-21",
            "winner": {
                  "driverCode": "RAI",
                  "driverName": "Kimi Räikkönen",
                  "constructorName": "Ferrari",
                  "time": "1:34:18.643"
            }
      },
      {
            "round": 19,
            "raceName": "Mexican Grand Prix",
            "circuitName": "Autódromo Hermanos Rodríguez",
            "city": "Mexico City",
            "country": "Mexico",
            "flag": "🇲🇽",
            "date": "2018-10-28",
            "winner": {
                  "driverCode": "VER",
                  "driverName": "Max Verstappen",
                  "constructorName": "Red Bull",
                  "time": "1:38:28.851"
            }
      },
      {
            "round": 20,
            "raceName": "Brazilian Grand Prix",
            "circuitName": "Autódromo José Carlos Pace",
            "city": "São Paulo",
            "country": "Brazil",
            "flag": "🇧🇷",
            "date": "2018-11-11",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:27:09.066"
            }
      },
      {
            "round": 21,
            "raceName": "Abu Dhabi Grand Prix",
            "circuitName": "Yas Marina Circuit",
            "city": "Abu Dhabi",
            "country": "UAE",
            "flag": "🇦🇪",
            "date": "2018-11-25",
            "winner": {
                  "driverCode": "HAM",
                  "driverName": "Lewis Hamilton",
                  "constructorName": "Mercedes",
                  "time": "1:39:40.382"
            }
      }
],
  },
  "2021": {
    "year": 2021,
    "racesCount": 22,
    "championDriver": {
      "name": "Max Verstappen",
      "code": "VER",
      "team": "Red Bull",
      "points": 395.5,
      "wins": 10
    },
    "championConstructor": {
      "name": "Mercedes",
      "points": 613.5,
      "wins": 9
    },
    "seasonSummary": "2021年シーズン：マックス・フェルスタッペンとルイス・ハミルトンによるF1史上最高峰のタイトル死闘。全くの同ポイントで迎えた最終戦アブダビGPのファイナルラップでフェルスタッペンが劇的な逆転オーバーテイクを決め、初のワールドチャンピオンに戴冠。",
    "driverStandings": [
      {
        "position": 1,
        "driverCode": "VER",
        "driverName": "Max Verstappen",
        "team": "Red Bull",
        "points": 395.5,
        "wins": 10
      },
      {
        "position": 2,
        "driverCode": "HAM",
        "driverName": "Lewis Hamilton",
        "team": "Mercedes",
        "points": 387.5,
        "wins": 8
      },
      {
        "position": 3,
        "driverCode": "BOT",
        "driverName": "Valtteri Bottas",
        "team": "Mercedes",
        "points": 226,
        "wins": 1
      },
      {
        "position": 4,
        "driverCode": "PER",
        "driverName": "Sergio Pérez",
        "team": "Red Bull",
        "points": 190,
        "wins": 1
      },
      {
        "position": 5,
        "driverCode": "SAI",
        "driverName": "Carlos Sainz",
        "team": "Ferrari",
        "points": 164.5,
        "wins": 0
      },
      {
        "position": 6,
        "driverCode": "NOR",
        "driverName": "Lando Norris",
        "team": "McLaren",
        "points": 160,
        "wins": 0
      },
      {
        "position": 7,
        "driverCode": "LEC",
        "driverName": "Charles Leclerc",
        "team": "Ferrari",
        "points": 159,
        "wins": 0
      },
      {
        "position": 8,
        "driverCode": "RIC",
        "driverName": "Daniel Ricciardo",
        "team": "McLaren",
        "points": 115,
        "wins": 1
      },
      {
        "position": 9,
        "driverCode": "GAS",
        "driverName": "Pierre Gasly",
        "team": "AlphaTauri",
        "points": 110,
        "wins": 0
      },
      {
        "position": 10,
        "driverCode": "ALO",
        "driverName": "Fernando Alonso",
        "team": "Alpine F1 Team",
        "points": 81,
        "wins": 0
      },
      {
        "position": 11,
        "driverCode": "OCO",
        "driverName": "Esteban Ocon",
        "team": "Alpine F1 Team",
        "points": 74,
        "wins": 1
      },
      {
        "position": 12,
        "driverCode": "VET",
        "driverName": "Sebastian Vettel",
        "team": "Aston Martin",
        "points": 43,
        "wins": 0
      },
      {
        "position": 13,
        "driverCode": "STR",
        "driverName": "Lance Stroll",
        "team": "Aston Martin",
        "points": 34,
        "wins": 0
      },
      {
        "position": 14,
        "driverCode": "TSU",
        "driverName": "Yuki Tsunoda",
        "team": "AlphaTauri",
        "points": 32,
        "wins": 0
      },
      {
        "position": 15,
        "driverCode": "RUS",
        "driverName": "George Russell",
        "team": "Williams",
        "points": 16,
        "wins": 0
      },
      {
        "position": 16,
        "driverCode": "RAI",
        "driverName": "Kimi Räikkönen",
        "team": "Alfa Romeo",
        "points": 10,
        "wins": 0
      },
      {
        "position": 17,
        "driverCode": "LAT",
        "driverName": "Nicholas Latifi",
        "team": "Williams",
        "points": 7,
        "wins": 0
      },
      {
        "position": 18,
        "driverCode": "GIO",
        "driverName": "Antonio Giovinazzi",
        "team": "Alfa Romeo",
        "points": 3,
        "wins": 0
      },
      {
        "position": 19,
        "driverCode": "MSC",
        "driverName": "Mick Schumacher",
        "team": "Haas F1 Team",
        "points": 0,
        "wins": 0
      },
      {
        "position": 20,
        "driverCode": "KUB",
        "driverName": "Robert Kubica",
        "team": "Alfa Romeo",
        "points": 0,
        "wins": 0
      },
      {
        "position": 21,
        "driverCode": "MAZ",
        "driverName": "Nikita Mazepin",
        "team": "Haas F1 Team",
        "points": 0,
        "wins": 0
      }
    ],
    "constructorStandings": [
      {
        "position": 1,
        "teamName": "Mercedes",
        "points": 613.5,
        "wins": 9
      },
      {
        "position": 2,
        "teamName": "Red Bull",
        "points": 585.5,
        "wins": 11
      },
      {
        "position": 3,
        "teamName": "Ferrari",
        "points": 323.5,
        "wins": 0
      },
      {
        "position": 4,
        "teamName": "McLaren",
        "points": 275,
        "wins": 1
      },
      {
        "position": 5,
        "teamName": "Alpine F1 Team",
        "points": 155,
        "wins": 1
      },
      {
        "position": 6,
        "teamName": "AlphaTauri",
        "points": 142,
        "wins": 0
      },
      {
        "position": 7,
        "teamName": "Aston Martin",
        "points": 77,
        "wins": 0
      },
      {
        "position": 8,
        "teamName": "Williams",
        "points": 23,
        "wins": 0
      },
      {
        "position": 9,
        "teamName": "Alfa Romeo",
        "points": 13,
        "wins": 0
      },
      {
        "position": 10,
        "teamName": "Haas F1 Team",
        "points": 0,
        "wins": 0
      }
    ],
    "calendar": [
      {
        "round": 1,
        "raceName": "Bahrain Grand Prix",
        "circuitName": "Bahrain International Circuit",
        "city": "Sakhir",
        "country": "Bahrain",
        "flag": "🇧🇭",
        "date": "2021-03-28",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:32:03.897"
        }
      },
      {
        "round": 2,
        "raceName": "Emilia Romagna Grand Prix",
        "circuitName": "Autodromo Enzo e Dino Ferrari",
        "city": "Imola",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2021-04-18",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "2:02:34.598"
        }
      },
      {
        "round": 3,
        "raceName": "Portuguese Grand Prix",
        "circuitName": "Autódromo Internacional do Algarve",
        "city": "Portimão",
        "country": "Portugal",
        "flag": "🇵🇹",
        "date": "2021-05-02",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:34:31.421"
        }
      },
      {
        "round": 4,
        "raceName": "Spanish Grand Prix",
        "circuitName": "Circuit de Barcelona-Catalunya",
        "city": "Barcelona",
        "country": "Spain",
        "flag": "🇪🇸",
        "date": "2021-05-09",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:33:07.680"
        }
      },
      {
        "round": 5,
        "raceName": "Monaco Grand Prix",
        "circuitName": "Circuit de Monaco",
        "city": "Monte Carlo",
        "country": "Monaco",
        "flag": "🇲🇨",
        "date": "2021-05-23",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:38:56.820"
        }
      },
      {
        "round": 6,
        "raceName": "Azerbaijan Grand Prix",
        "circuitName": "Baku City Circuit",
        "city": "Baku",
        "country": "Azerbaijan",
        "flag": "🇦🇿",
        "date": "2021-06-06",
        "winner": {
          "driverCode": "PER",
          "driverName": "Sergio Pérez",
          "constructorName": "Red Bull",
          "time": "2:13:36.410"
        }
      },
      {
        "round": 7,
        "raceName": "French Grand Prix",
        "circuitName": "Circuit Paul Ricard",
        "city": "Le Castellet",
        "country": "France",
        "flag": "🇫🇷",
        "date": "2021-06-20",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:27:25.770"
        }
      },
      {
        "round": 8,
        "raceName": "Styrian Grand Prix",
        "circuitName": "Red Bull Ring",
        "city": "Spielberg",
        "country": "Austria",
        "flag": "🇦🇹",
        "date": "2021-06-27",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:22:18.925"
        }
      },
      {
        "round": 9,
        "raceName": "Austrian Grand Prix",
        "circuitName": "Red Bull Ring",
        "city": "Spielberg",
        "country": "Austria",
        "flag": "🇦🇹",
        "date": "2021-07-04",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:23:54.543"
        }
      },
      {
        "round": 10,
        "raceName": "British Grand Prix",
        "circuitName": "Silverstone Circuit",
        "city": "Silverstone",
        "country": "UK",
        "flag": "🇬🇧",
        "date": "2021-07-18",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:58:23.284"
        }
      },
      {
        "round": 11,
        "raceName": "Hungarian Grand Prix",
        "circuitName": "Hungaroring",
        "city": "Budapest",
        "country": "Hungary",
        "flag": "🇭🇺",
        "date": "2021-08-01",
        "winner": {
          "driverCode": "OCO",
          "driverName": "Esteban Ocon",
          "constructorName": "Alpine F1 Team",
          "time": "2:04:43.199"
        }
      },
      {
        "round": 12,
        "raceName": "Belgian Grand Prix",
        "circuitName": "Circuit de Spa-Francorchamps",
        "city": "Spa",
        "country": "Belgium",
        "flag": "🇧🇪",
        "date": "2021-08-29",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "3:27.071"
        }
      },
      {
        "round": 13,
        "raceName": "Dutch Grand Prix",
        "circuitName": "Circuit Park Zandvoort",
        "city": "Zandvoort",
        "country": "Netherlands",
        "flag": "🇳🇱",
        "date": "2021-09-05",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:30:05.395"
        }
      },
      {
        "round": 14,
        "raceName": "Italian Grand Prix",
        "circuitName": "Autodromo Nazionale di Monza",
        "city": "Monza",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2021-09-12",
        "winner": {
          "driverCode": "RIC",
          "driverName": "Daniel Ricciardo",
          "constructorName": "McLaren",
          "time": "1:21:54.365"
        }
      },
      {
        "round": 15,
        "raceName": "Russian Grand Prix",
        "circuitName": "Sochi Autodrom",
        "city": "Sochi",
        "country": "Russia",
        "flag": "🇷🇺",
        "date": "2021-09-26",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:30:41.001"
        }
      },
      {
        "round": 16,
        "raceName": "Turkish Grand Prix",
        "circuitName": "Istanbul Park",
        "city": "Istanbul",
        "country": "Turkey",
        "flag": "🇹🇷",
        "date": "2021-10-10",
        "winner": {
          "driverCode": "BOT",
          "driverName": "Valtteri Bottas",
          "constructorName": "Mercedes",
          "time": "1:31:04.103"
        }
      },
      {
        "round": 17,
        "raceName": "United States Grand Prix",
        "circuitName": "Circuit of the Americas",
        "city": "Austin",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2021-10-24",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:34:36.552"
        }
      },
      {
        "round": 18,
        "raceName": "Mexico City Grand Prix",
        "circuitName": "Autódromo Hermanos Rodríguez",
        "city": "Mexico City",
        "country": "Mexico",
        "flag": "🇲🇽",
        "date": "2021-11-07",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:38:39.086"
        }
      },
      {
        "round": 19,
        "raceName": "São Paulo Grand Prix",
        "circuitName": "Autódromo José Carlos Pace",
        "city": "São Paulo",
        "country": "Brazil",
        "flag": "🇧🇷",
        "date": "2021-11-14",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:32:22.851"
        }
      },
      {
        "round": 20,
        "raceName": "Qatar Grand Prix",
        "circuitName": "Lusail International Circuit",
        "city": "Lusail",
        "country": "Qatar",
        "flag": "🇶🇦",
        "date": "2021-11-21",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:24:28.471"
        }
      },
      {
        "round": 21,
        "raceName": "Saudi Arabian Grand Prix",
        "circuitName": "Jeddah Corniche Circuit",
        "city": "Jeddah",
        "country": "Saudi Arabia",
        "flag": "🇸🇦",
        "date": "2021-12-05",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "2:06:15.118"
        }
      },
      {
        "round": 22,
        "raceName": "Abu Dhabi Grand Prix",
        "circuitName": "Yas Marina Circuit",
        "city": "Abu Dhabi",
        "country": "UAE",
        "flag": "🇦🇪",
        "date": "2021-12-12",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:30:17.345"
        }
      }
    ]
  },
  "2022": {
    "year": 2022,
    "racesCount": 22,
    "championDriver": {
      "name": "Max Verstappen",
      "code": "VER",
      "team": "Red Bull",
      "points": 454,
      "wins": 15
    },
    "championConstructor": {
      "name": "Red Bull",
      "points": 759,
      "wins": 17
    },
    "seasonSummary": "2022年シーズン：グラウンドエフェクトカー新規定が導入された新時代の幕開け。シーズン序盤はフェラーリのルクレールと首位争いを繰り広げたフェルスタッペンが、年間最多15勝をマークして2連覇を達成。レッドブルも8年ぶりにダブルタイトルを獲得。",
    "driverStandings": [
      {
        "position": 1,
        "driverCode": "VER",
        "driverName": "Max Verstappen",
        "team": "Red Bull",
        "points": 454,
        "wins": 15
      },
      {
        "position": 2,
        "driverCode": "LEC",
        "driverName": "Charles Leclerc",
        "team": "Ferrari",
        "points": 308,
        "wins": 3
      },
      {
        "position": 3,
        "driverCode": "PER",
        "driverName": "Sergio Pérez",
        "team": "Red Bull",
        "points": 305,
        "wins": 2
      },
      {
        "position": 4,
        "driverCode": "RUS",
        "driverName": "George Russell",
        "team": "Mercedes",
        "points": 275,
        "wins": 1
      },
      {
        "position": 5,
        "driverCode": "SAI",
        "driverName": "Carlos Sainz",
        "team": "Ferrari",
        "points": 246,
        "wins": 1
      },
      {
        "position": 6,
        "driverCode": "HAM",
        "driverName": "Lewis Hamilton",
        "team": "Mercedes",
        "points": 240,
        "wins": 0
      },
      {
        "position": 7,
        "driverCode": "NOR",
        "driverName": "Lando Norris",
        "team": "McLaren",
        "points": 122,
        "wins": 0
      },
      {
        "position": 8,
        "driverCode": "OCO",
        "driverName": "Esteban Ocon",
        "team": "Alpine F1 Team",
        "points": 92,
        "wins": 0
      },
      {
        "position": 9,
        "driverCode": "ALO",
        "driverName": "Fernando Alonso",
        "team": "Alpine F1 Team",
        "points": 81,
        "wins": 0
      },
      {
        "position": 10,
        "driverCode": "BOT",
        "driverName": "Valtteri Bottas",
        "team": "Alfa Romeo",
        "points": 49,
        "wins": 0
      },
      {
        "position": 11,
        "driverCode": "RIC",
        "driverName": "Daniel Ricciardo",
        "team": "McLaren",
        "points": 37,
        "wins": 0
      },
      {
        "position": 12,
        "driverCode": "VET",
        "driverName": "Sebastian Vettel",
        "team": "Aston Martin",
        "points": 37,
        "wins": 0
      },
      {
        "position": 13,
        "driverCode": "MAG",
        "driverName": "Kevin Magnussen",
        "team": "Haas F1 Team",
        "points": 25,
        "wins": 0
      },
      {
        "position": 14,
        "driverCode": "GAS",
        "driverName": "Pierre Gasly",
        "team": "AlphaTauri",
        "points": 23,
        "wins": 0
      },
      {
        "position": 15,
        "driverCode": "STR",
        "driverName": "Lance Stroll",
        "team": "Aston Martin",
        "points": 18,
        "wins": 0
      },
      {
        "position": 16,
        "driverCode": "MSC",
        "driverName": "Mick Schumacher",
        "team": "Haas F1 Team",
        "points": 12,
        "wins": 0
      },
      {
        "position": 17,
        "driverCode": "TSU",
        "driverName": "Yuki Tsunoda",
        "team": "AlphaTauri",
        "points": 12,
        "wins": 0
      },
      {
        "position": 18,
        "driverCode": "ZHO",
        "driverName": "Guanyu Zhou",
        "team": "Alfa Romeo",
        "points": 6,
        "wins": 0
      },
      {
        "position": 19,
        "driverCode": "ALB",
        "driverName": "Alexander Albon",
        "team": "Williams",
        "points": 4,
        "wins": 0
      },
      {
        "position": 20,
        "driverCode": "LAT",
        "driverName": "Nicholas Latifi",
        "team": "Williams",
        "points": 2,
        "wins": 0
      },
      {
        "position": 21,
        "driverCode": "DEV",
        "driverName": "Nyck de Vries",
        "team": "Williams",
        "points": 2,
        "wins": 0
      },
      {
        "position": 22,
        "driverCode": "HUL",
        "driverName": "Nico Hülkenberg",
        "team": "Aston Martin",
        "points": 0,
        "wins": 0
      }
    ],
    "constructorStandings": [
      {
        "position": 1,
        "teamName": "Red Bull",
        "points": 759,
        "wins": 17
      },
      {
        "position": 2,
        "teamName": "Ferrari",
        "points": 554,
        "wins": 4
      },
      {
        "position": 3,
        "teamName": "Mercedes",
        "points": 515,
        "wins": 1
      },
      {
        "position": 4,
        "teamName": "Alpine F1 Team",
        "points": 173,
        "wins": 0
      },
      {
        "position": 5,
        "teamName": "McLaren",
        "points": 159,
        "wins": 0
      },
      {
        "position": 6,
        "teamName": "Alfa Romeo",
        "points": 55,
        "wins": 0
      },
      {
        "position": 7,
        "teamName": "Aston Martin",
        "points": 55,
        "wins": 0
      },
      {
        "position": 8,
        "teamName": "Haas F1 Team",
        "points": 37,
        "wins": 0
      },
      {
        "position": 9,
        "teamName": "AlphaTauri",
        "points": 35,
        "wins": 0
      },
      {
        "position": 10,
        "teamName": "Williams",
        "points": 8,
        "wins": 0
      }
    ],
    "calendar": [
      {
        "round": 1,
        "raceName": "Bahrain Grand Prix",
        "circuitName": "Bahrain International Circuit",
        "city": "Sakhir",
        "country": "Bahrain",
        "flag": "🇧🇭",
        "date": "2022-03-20",
        "winner": {
          "driverCode": "LEC",
          "driverName": "Charles Leclerc",
          "constructorName": "Ferrari",
          "time": "1:37:33.584"
        }
      },
      {
        "round": 2,
        "raceName": "Saudi Arabian Grand Prix",
        "circuitName": "Jeddah Corniche Circuit",
        "city": "Jeddah",
        "country": "Saudi Arabia",
        "flag": "🇸🇦",
        "date": "2022-03-27",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:24:19.293"
        }
      },
      {
        "round": 3,
        "raceName": "Australian Grand Prix",
        "circuitName": "Albert Park Grand Prix Circuit",
        "city": "Melbourne",
        "country": "Australia",
        "flag": "🇦🇺",
        "date": "2022-04-10",
        "winner": {
          "driverCode": "LEC",
          "driverName": "Charles Leclerc",
          "constructorName": "Ferrari",
          "time": "1:27:46.548"
        }
      },
      {
        "round": 4,
        "raceName": "Emilia Romagna Grand Prix",
        "circuitName": "Autodromo Enzo e Dino Ferrari",
        "city": "Imola",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2022-04-24",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:32:07.986"
        }
      },
      {
        "round": 5,
        "raceName": "Miami Grand Prix",
        "circuitName": "Miami International Autodrome",
        "city": "Miami",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2022-05-08",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:34:24.258"
        }
      },
      {
        "round": 6,
        "raceName": "Spanish Grand Prix",
        "circuitName": "Circuit de Barcelona-Catalunya",
        "city": "Barcelona",
        "country": "Spain",
        "flag": "🇪🇸",
        "date": "2022-05-22",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:37:20.475"
        }
      },
      {
        "round": 7,
        "raceName": "Monaco Grand Prix",
        "circuitName": "Circuit de Monaco",
        "city": "Monte Carlo",
        "country": "Monaco",
        "flag": "🇲🇨",
        "date": "2022-05-29",
        "winner": {
          "driverCode": "PER",
          "driverName": "Sergio Pérez",
          "constructorName": "Red Bull",
          "time": "1:56:30.265"
        }
      },
      {
        "round": 8,
        "raceName": "Azerbaijan Grand Prix",
        "circuitName": "Baku City Circuit",
        "city": "Baku",
        "country": "Azerbaijan",
        "flag": "🇦🇿",
        "date": "2022-06-12",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:34:05.941"
        }
      },
      {
        "round": 9,
        "raceName": "Canadian Grand Prix",
        "circuitName": "Circuit Gilles Villeneuve",
        "city": "Montreal",
        "country": "Canada",
        "flag": "🇨🇦",
        "date": "2022-06-19",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:36:21.757"
        }
      },
      {
        "round": 10,
        "raceName": "British Grand Prix",
        "circuitName": "Silverstone Circuit",
        "city": "Silverstone",
        "country": "UK",
        "flag": "🇬🇧",
        "date": "2022-07-03",
        "winner": {
          "driverCode": "SAI",
          "driverName": "Carlos Sainz",
          "constructorName": "Ferrari",
          "time": "2:17:50.311"
        }
      },
      {
        "round": 11,
        "raceName": "Austrian Grand Prix",
        "circuitName": "Red Bull Ring",
        "city": "Spielberg",
        "country": "Austria",
        "flag": "🇦🇹",
        "date": "2022-07-10",
        "winner": {
          "driverCode": "LEC",
          "driverName": "Charles Leclerc",
          "constructorName": "Ferrari",
          "time": "1:24:24.312"
        }
      },
      {
        "round": 12,
        "raceName": "French Grand Prix",
        "circuitName": "Circuit Paul Ricard",
        "city": "Le Castellet",
        "country": "France",
        "flag": "🇫🇷",
        "date": "2022-07-24",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:30:02.112"
        }
      },
      {
        "round": 13,
        "raceName": "Hungarian Grand Prix",
        "circuitName": "Hungaroring",
        "city": "Budapest",
        "country": "Hungary",
        "flag": "🇭🇺",
        "date": "2022-07-31",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:39:35.912"
        }
      },
      {
        "round": 14,
        "raceName": "Belgian Grand Prix",
        "circuitName": "Circuit de Spa-Francorchamps",
        "city": "Spa",
        "country": "Belgium",
        "flag": "🇧🇪",
        "date": "2022-08-28",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:25:52.894"
        }
      },
      {
        "round": 15,
        "raceName": "Dutch Grand Prix",
        "circuitName": "Circuit Park Zandvoort",
        "city": "Zandvoort",
        "country": "Netherlands",
        "flag": "🇳🇱",
        "date": "2022-09-04",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:36:42.773"
        }
      },
      {
        "round": 16,
        "raceName": "Italian Grand Prix",
        "circuitName": "Autodromo Nazionale di Monza",
        "city": "Monza",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2022-09-11",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:20:27.511"
        }
      },
      {
        "round": 17,
        "raceName": "Singapore Grand Prix",
        "circuitName": "Marina Bay Street Circuit",
        "city": "Marina Bay",
        "country": "Singapore",
        "flag": "🇸🇬",
        "date": "2022-10-02",
        "winner": {
          "driverCode": "PER",
          "driverName": "Sergio Pérez",
          "constructorName": "Red Bull",
          "time": "2:02:20.238"
        }
      },
      {
        "round": 18,
        "raceName": "Japanese Grand Prix",
        "circuitName": "Suzuka Circuit",
        "city": "Suzuka",
        "country": "Japan",
        "flag": "🇯🇵",
        "date": "2022-10-09",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "3:01:44.004"
        }
      },
      {
        "round": 19,
        "raceName": "United States Grand Prix",
        "circuitName": "Circuit of the Americas",
        "city": "Austin",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2022-10-23",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:42:11.687"
        }
      },
      {
        "round": 20,
        "raceName": "Mexico City Grand Prix",
        "circuitName": "Autódromo Hermanos Rodríguez",
        "city": "Mexico City",
        "country": "Mexico",
        "flag": "🇲🇽",
        "date": "2022-10-30",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:38:36.729"
        }
      },
      {
        "round": 21,
        "raceName": "São Paulo Grand Prix",
        "circuitName": "Autódromo José Carlos Pace",
        "city": "São Paulo",
        "country": "Brazil",
        "flag": "🇧🇷",
        "date": "2022-11-13",
        "winner": {
          "driverCode": "RUS",
          "driverName": "George Russell",
          "constructorName": "Mercedes",
          "time": "1:38:34.044"
        }
      },
      {
        "round": 22,
        "raceName": "Abu Dhabi Grand Prix",
        "circuitName": "Yas Marina Circuit",
        "city": "Abu Dhabi",
        "country": "UAE",
        "flag": "🇦🇪",
        "date": "2022-11-20",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:27:45.914"
        }
      }
    ]
  },
  "2023": {
    "year": 2023,
    "racesCount": 22,
    "championDriver": {
      "name": "Max Verstappen",
      "code": "VER",
      "team": "Red Bull",
      "points": 575,
      "wins": 19
    },
    "championConstructor": {
      "name": "Red Bull",
      "points": 860,
      "wins": 21
    },
    "seasonSummary": "2023年シーズン：レッドブルが22戦中21勝というF1史上最も圧倒的な支配を演じた伝説のシーズン。マックス・フェルスタッペンは個人19勝・勝率86.4%という空前絶後の大記録を樹立して3連覇を達成。",
    "driverStandings": [
      {
        "position": 1,
        "driverCode": "VER",
        "driverName": "Max Verstappen",
        "team": "Red Bull",
        "points": 575,
        "wins": 19
      },
      {
        "position": 2,
        "driverCode": "PER",
        "driverName": "Sergio Pérez",
        "team": "Red Bull",
        "points": 285,
        "wins": 2
      },
      {
        "position": 3,
        "driverCode": "HAM",
        "driverName": "Lewis Hamilton",
        "team": "Mercedes",
        "points": 234,
        "wins": 0
      },
      {
        "position": 4,
        "driverCode": "ALO",
        "driverName": "Fernando Alonso",
        "team": "Aston Martin",
        "points": 206,
        "wins": 0
      },
      {
        "position": 5,
        "driverCode": "LEC",
        "driverName": "Charles Leclerc",
        "team": "Ferrari",
        "points": 206,
        "wins": 0
      },
      {
        "position": 6,
        "driverCode": "NOR",
        "driverName": "Lando Norris",
        "team": "McLaren",
        "points": 205,
        "wins": 0
      },
      {
        "position": 7,
        "driverCode": "SAI",
        "driverName": "Carlos Sainz",
        "team": "Ferrari",
        "points": 200,
        "wins": 1
      },
      {
        "position": 8,
        "driverCode": "RUS",
        "driverName": "George Russell",
        "team": "Mercedes",
        "points": 175,
        "wins": 0
      },
      {
        "position": 9,
        "driverCode": "PIA",
        "driverName": "Oscar Piastri",
        "team": "McLaren",
        "points": 97,
        "wins": 0
      },
      {
        "position": 10,
        "driverCode": "STR",
        "driverName": "Lance Stroll",
        "team": "Aston Martin",
        "points": 74,
        "wins": 0
      },
      {
        "position": 11,
        "driverCode": "GAS",
        "driverName": "Pierre Gasly",
        "team": "Alpine F1 Team",
        "points": 62,
        "wins": 0
      },
      {
        "position": 12,
        "driverCode": "OCO",
        "driverName": "Esteban Ocon",
        "team": "Alpine F1 Team",
        "points": 58,
        "wins": 0
      },
      {
        "position": 13,
        "driverCode": "ALB",
        "driverName": "Alexander Albon",
        "team": "Williams",
        "points": 27,
        "wins": 0
      },
      {
        "position": 14,
        "driverCode": "TSU",
        "driverName": "Yuki Tsunoda",
        "team": "AlphaTauri",
        "points": 17,
        "wins": 0
      },
      {
        "position": 15,
        "driverCode": "BOT",
        "driverName": "Valtteri Bottas",
        "team": "Alfa Romeo",
        "points": 10,
        "wins": 0
      },
      {
        "position": 16,
        "driverCode": "HUL",
        "driverName": "Nico Hülkenberg",
        "team": "Haas F1 Team",
        "points": 9,
        "wins": 0
      },
      {
        "position": 17,
        "driverCode": "RIC",
        "driverName": "Daniel Ricciardo",
        "team": "AlphaTauri",
        "points": 6,
        "wins": 0
      },
      {
        "position": 18,
        "driverCode": "ZHO",
        "driverName": "Guanyu Zhou",
        "team": "Alfa Romeo",
        "points": 6,
        "wins": 0
      },
      {
        "position": 19,
        "driverCode": "MAG",
        "driverName": "Kevin Magnussen",
        "team": "Haas F1 Team",
        "points": 3,
        "wins": 0
      },
      {
        "position": 20,
        "driverCode": "LAW",
        "driverName": "Liam Lawson",
        "team": "AlphaTauri",
        "points": 2,
        "wins": 0
      },
      {
        "position": 21,
        "driverCode": "SAR",
        "driverName": "Logan Sargeant",
        "team": "Williams",
        "points": 1,
        "wins": 0
      },
      {
        "position": 22,
        "driverCode": "DEV",
        "driverName": "Nyck de Vries",
        "team": "AlphaTauri",
        "points": 0,
        "wins": 0
      }
    ],
    "constructorStandings": [
      {
        "position": 1,
        "teamName": "Red Bull",
        "points": 860,
        "wins": 21
      },
      {
        "position": 2,
        "teamName": "Mercedes",
        "points": 409,
        "wins": 0
      },
      {
        "position": 3,
        "teamName": "Ferrari",
        "points": 406,
        "wins": 1
      },
      {
        "position": 4,
        "teamName": "McLaren",
        "points": 302,
        "wins": 0
      },
      {
        "position": 5,
        "teamName": "Aston Martin",
        "points": 280,
        "wins": 0
      },
      {
        "position": 6,
        "teamName": "Alpine F1 Team",
        "points": 120,
        "wins": 0
      },
      {
        "position": 7,
        "teamName": "Williams",
        "points": 28,
        "wins": 0
      },
      {
        "position": 8,
        "teamName": "AlphaTauri",
        "points": 25,
        "wins": 0
      },
      {
        "position": 9,
        "teamName": "Alfa Romeo",
        "points": 16,
        "wins": 0
      },
      {
        "position": 10,
        "teamName": "Haas F1 Team",
        "points": 12,
        "wins": 0
      }
    ],
    "calendar": [
      {
        "round": 1,
        "raceName": "Bahrain Grand Prix",
        "circuitName": "Bahrain International Circuit",
        "city": "Sakhir",
        "country": "Bahrain",
        "flag": "🇧🇭",
        "date": "2023-03-05",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:33:56.736"
        }
      },
      {
        "round": 2,
        "raceName": "Saudi Arabian Grand Prix",
        "circuitName": "Jeddah Corniche Circuit",
        "city": "Jeddah",
        "country": "Saudi Arabia",
        "flag": "🇸🇦",
        "date": "2023-03-19",
        "winner": {
          "driverCode": "PER",
          "driverName": "Sergio Pérez",
          "constructorName": "Red Bull",
          "time": "1:21:14.894"
        }
      },
      {
        "round": 3,
        "raceName": "Australian Grand Prix",
        "circuitName": "Albert Park Grand Prix Circuit",
        "city": "Melbourne",
        "country": "Australia",
        "flag": "🇦🇺",
        "date": "2023-04-02",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "2:32:38.371"
        }
      },
      {
        "round": 4,
        "raceName": "Azerbaijan Grand Prix",
        "circuitName": "Baku City Circuit",
        "city": "Baku",
        "country": "Azerbaijan",
        "flag": "🇦🇿",
        "date": "2023-04-30",
        "winner": {
          "driverCode": "PER",
          "driverName": "Sergio Pérez",
          "constructorName": "Red Bull",
          "time": "1:32:42.436"
        }
      },
      {
        "round": 5,
        "raceName": "Miami Grand Prix",
        "circuitName": "Miami International Autodrome",
        "city": "Miami",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2023-05-07",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:27:38.241"
        }
      },
      {
        "round": 6,
        "raceName": "Monaco Grand Prix",
        "circuitName": "Circuit de Monaco",
        "city": "Monte Carlo",
        "country": "Monaco",
        "flag": "🇲🇨",
        "date": "2023-05-28",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:48:51.980"
        }
      },
      {
        "round": 7,
        "raceName": "Spanish Grand Prix",
        "circuitName": "Circuit de Barcelona-Catalunya",
        "city": "Barcelona",
        "country": "Spain",
        "flag": "🇪🇸",
        "date": "2023-06-04",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:27:57.940"
        }
      },
      {
        "round": 8,
        "raceName": "Canadian Grand Prix",
        "circuitName": "Circuit Gilles Villeneuve",
        "city": "Montreal",
        "country": "Canada",
        "flag": "🇨🇦",
        "date": "2023-06-18",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:33:58.348"
        }
      },
      {
        "round": 9,
        "raceName": "Austrian Grand Prix",
        "circuitName": "Red Bull Ring",
        "city": "Spielberg",
        "country": "Austria",
        "flag": "🇦🇹",
        "date": "2023-07-02",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:25:33.607"
        }
      },
      {
        "round": 10,
        "raceName": "British Grand Prix",
        "circuitName": "Silverstone Circuit",
        "city": "Silverstone",
        "country": "UK",
        "flag": "🇬🇧",
        "date": "2023-07-09",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:25:16.938"
        }
      },
      {
        "round": 11,
        "raceName": "Hungarian Grand Prix",
        "circuitName": "Hungaroring",
        "city": "Budapest",
        "country": "Hungary",
        "flag": "🇭🇺",
        "date": "2023-07-23",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:38:08.634"
        }
      },
      {
        "round": 12,
        "raceName": "Belgian Grand Prix",
        "circuitName": "Circuit de Spa-Francorchamps",
        "city": "Spa",
        "country": "Belgium",
        "flag": "🇧🇪",
        "date": "2023-07-30",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:22:30.450"
        }
      },
      {
        "round": 13,
        "raceName": "Dutch Grand Prix",
        "circuitName": "Circuit Park Zandvoort",
        "city": "Zandvoort",
        "country": "Netherlands",
        "flag": "🇳🇱",
        "date": "2023-08-27",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "2:24:04.411"
        }
      },
      {
        "round": 14,
        "raceName": "Italian Grand Prix",
        "circuitName": "Autodromo Nazionale di Monza",
        "city": "Monza",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2023-09-03",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:13:41.143"
        }
      },
      {
        "round": 15,
        "raceName": "Singapore Grand Prix",
        "circuitName": "Marina Bay Street Circuit",
        "city": "Marina Bay",
        "country": "Singapore",
        "flag": "🇸🇬",
        "date": "2023-09-17",
        "winner": {
          "driverCode": "SAI",
          "driverName": "Carlos Sainz",
          "constructorName": "Ferrari",
          "time": "1:46:37.418"
        }
      },
      {
        "round": 16,
        "raceName": "Japanese Grand Prix",
        "circuitName": "Suzuka Circuit",
        "city": "Suzuka",
        "country": "Japan",
        "flag": "🇯🇵",
        "date": "2023-09-24",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:30:58.421"
        }
      },
      {
        "round": 17,
        "raceName": "Qatar Grand Prix",
        "circuitName": "Lusail International Circuit",
        "city": "Lusail",
        "country": "Qatar",
        "flag": "🇶🇦",
        "date": "2023-10-08",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:27:39.168"
        }
      },
      {
        "round": 18,
        "raceName": "United States Grand Prix",
        "circuitName": "Circuit of the Americas",
        "city": "Austin",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2023-10-22",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:35:21.362"
        }
      },
      {
        "round": 19,
        "raceName": "Mexico City Grand Prix",
        "circuitName": "Autódromo Hermanos Rodríguez",
        "city": "Mexico City",
        "country": "Mexico",
        "flag": "🇲🇽",
        "date": "2023-10-29",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "2:02:30.814"
        }
      },
      {
        "round": 20,
        "raceName": "São Paulo Grand Prix",
        "circuitName": "Autódromo José Carlos Pace",
        "city": "São Paulo",
        "country": "Brazil",
        "flag": "🇧🇷",
        "date": "2023-11-05",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:56:48.894"
        }
      },
      {
        "round": 21,
        "raceName": "Las Vegas Grand Prix",
        "circuitName": "Las Vegas Strip Street Circuit",
        "city": "Las Vegas",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2023-11-19",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:29:08.289"
        }
      },
      {
        "round": 22,
        "raceName": "Abu Dhabi Grand Prix",
        "circuitName": "Yas Marina Circuit",
        "city": "Abu Dhabi",
        "country": "UAE",
        "flag": "🇦🇪",
        "date": "2023-11-26",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:27:02.624"
        }
      }
    ]
  },
  "2024": {
    "year": 2024,
    "racesCount": 24,
    "championDriver": {
      "name": "Max Verstappen",
      "code": "VER",
      "team": "Red Bull",
      "points": 437,
      "wins": 9
    },
    "championConstructor": {
      "name": "McLaren",
      "points": 666,
      "wins": 6
    },
    "seasonSummary": "2024年シーズン：前半戦はマックス・フェルスタッペンがリードするも、中盤以降マクラーレンとフェラーリが猛追。フェルスタッペンがドライバーズ4連覇を死守した一方、コンストラクターズ選手権はマクラーレンが1998年以来26年ぶりとなる王座奪還を果たした。",
    "driverStandings": [
      {
        "position": 1,
        "driverCode": "VER",
        "driverName": "Max Verstappen",
        "team": "Red Bull",
        "points": 437,
        "wins": 9
      },
      {
        "position": 2,
        "driverCode": "NOR",
        "driverName": "Lando Norris",
        "team": "McLaren",
        "points": 374,
        "wins": 4
      },
      {
        "position": 3,
        "driverCode": "LEC",
        "driverName": "Charles Leclerc",
        "team": "Ferrari",
        "points": 356,
        "wins": 3
      },
      {
        "position": 4,
        "driverCode": "PIA",
        "driverName": "Oscar Piastri",
        "team": "McLaren",
        "points": 292,
        "wins": 2
      },
      {
        "position": 5,
        "driverCode": "SAI",
        "driverName": "Carlos Sainz",
        "team": "Ferrari",
        "points": 290,
        "wins": 2
      },
      {
        "position": 6,
        "driverCode": "RUS",
        "driverName": "George Russell",
        "team": "Mercedes",
        "points": 245,
        "wins": 2
      },
      {
        "position": 7,
        "driverCode": "HAM",
        "driverName": "Lewis Hamilton",
        "team": "Mercedes",
        "points": 223,
        "wins": 2
      },
      {
        "position": 8,
        "driverCode": "PER",
        "driverName": "Sergio Pérez",
        "team": "Red Bull",
        "points": 152,
        "wins": 0
      },
      {
        "position": 9,
        "driverCode": "ALO",
        "driverName": "Fernando Alonso",
        "team": "Aston Martin",
        "points": 70,
        "wins": 0
      },
      {
        "position": 10,
        "driverCode": "GAS",
        "driverName": "Pierre Gasly",
        "team": "Alpine F1 Team",
        "points": 42,
        "wins": 0
      },
      {
        "position": 11,
        "driverCode": "HUL",
        "driverName": "Nico Hülkenberg",
        "team": "Haas F1 Team",
        "points": 41,
        "wins": 0
      },
      {
        "position": 12,
        "driverCode": "TSU",
        "driverName": "Yuki Tsunoda",
        "team": "RB F1 Team",
        "points": 30,
        "wins": 0
      },
      {
        "position": 13,
        "driverCode": "STR",
        "driverName": "Lance Stroll",
        "team": "Aston Martin",
        "points": 24,
        "wins": 0
      },
      {
        "position": 14,
        "driverCode": "OCO",
        "driverName": "Esteban Ocon",
        "team": "Alpine F1 Team",
        "points": 23,
        "wins": 0
      },
      {
        "position": 15,
        "driverCode": "MAG",
        "driverName": "Kevin Magnussen",
        "team": "Haas F1 Team",
        "points": 16,
        "wins": 0
      },
      {
        "position": 16,
        "driverCode": "ALB",
        "driverName": "Alexander Albon",
        "team": "Williams",
        "points": 12,
        "wins": 0
      },
      {
        "position": 17,
        "driverCode": "RIC",
        "driverName": "Daniel Ricciardo",
        "team": "RB F1 Team",
        "points": 12,
        "wins": 0
      },
      {
        "position": 18,
        "driverCode": "BEA",
        "driverName": "Oliver Bearman",
        "team": "Ferrari",
        "points": 7,
        "wins": 0
      },
      {
        "position": 19,
        "driverCode": "COL",
        "driverName": "Franco Colapinto",
        "team": "Williams",
        "points": 5,
        "wins": 0
      },
      {
        "position": 20,
        "driverCode": "ZHO",
        "driverName": "Guanyu Zhou",
        "team": "Sauber",
        "points": 4,
        "wins": 0
      },
      {
        "position": 21,
        "driverCode": "LAW",
        "driverName": "Liam Lawson",
        "team": "RB F1 Team",
        "points": 4,
        "wins": 0
      },
      {
        "position": 22,
        "driverCode": "BOT",
        "driverName": "Valtteri Bottas",
        "team": "Sauber",
        "points": 0,
        "wins": 0
      },
      {
        "position": 23,
        "driverCode": "SAR",
        "driverName": "Logan Sargeant",
        "team": "Williams",
        "points": 0,
        "wins": 0
      },
      {
        "position": 24,
        "driverCode": "DOO",
        "driverName": "Jack Doohan",
        "team": "Alpine F1 Team",
        "points": 0,
        "wins": 0
      }
    ],
    "constructorStandings": [
      {
        "position": 1,
        "teamName": "McLaren",
        "points": 666,
        "wins": 6
      },
      {
        "position": 2,
        "teamName": "Ferrari",
        "points": 652,
        "wins": 5
      },
      {
        "position": 3,
        "teamName": "Red Bull",
        "points": 589,
        "wins": 9
      },
      {
        "position": 4,
        "teamName": "Mercedes",
        "points": 468,
        "wins": 4
      },
      {
        "position": 5,
        "teamName": "Aston Martin",
        "points": 94,
        "wins": 0
      },
      {
        "position": 6,
        "teamName": "Alpine F1 Team",
        "points": 65,
        "wins": 0
      },
      {
        "position": 7,
        "teamName": "Haas F1 Team",
        "points": 58,
        "wins": 0
      },
      {
        "position": 8,
        "teamName": "RB F1 Team",
        "points": 46,
        "wins": 0
      },
      {
        "position": 9,
        "teamName": "Williams",
        "points": 17,
        "wins": 0
      },
      {
        "position": 10,
        "teamName": "Sauber",
        "points": 4,
        "wins": 0
      }
    ],
    "calendar": [
      {
        "round": 1,
        "raceName": "Bahrain Grand Prix",
        "circuitName": "Bahrain International Circuit",
        "city": "Sakhir",
        "country": "Bahrain",
        "flag": "🇧🇭",
        "date": "2024-03-02",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:31:44.742"
        }
      },
      {
        "round": 2,
        "raceName": "Saudi Arabian Grand Prix",
        "circuitName": "Jeddah Corniche Circuit",
        "city": "Jeddah",
        "country": "Saudi Arabia",
        "flag": "🇸🇦",
        "date": "2024-03-09",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:20:43.273"
        }
      },
      {
        "round": 3,
        "raceName": "Australian Grand Prix",
        "circuitName": "Albert Park Grand Prix Circuit",
        "city": "Melbourne",
        "country": "Australia",
        "flag": "🇦🇺",
        "date": "2024-03-24",
        "winner": {
          "driverCode": "SAI",
          "driverName": "Carlos Sainz",
          "constructorName": "Ferrari",
          "time": "1:20:26.843"
        }
      },
      {
        "round": 4,
        "raceName": "Japanese Grand Prix",
        "circuitName": "Suzuka Circuit",
        "city": "Suzuka",
        "country": "Japan",
        "flag": "🇯🇵",
        "date": "2024-04-07",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:54:23.566"
        }
      },
      {
        "round": 5,
        "raceName": "Chinese Grand Prix",
        "circuitName": "Shanghai International Circuit",
        "city": "Shanghai",
        "country": "China",
        "flag": "🇨🇳",
        "date": "2024-04-21",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:40:52.554"
        }
      },
      {
        "round": 6,
        "raceName": "Miami Grand Prix",
        "circuitName": "Miami International Autodrome",
        "city": "Miami",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2024-05-05",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:30:49.876"
        }
      },
      {
        "round": 7,
        "raceName": "Emilia Romagna Grand Prix",
        "circuitName": "Autodromo Enzo e Dino Ferrari",
        "city": "Imola",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2024-05-19",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:25:25.252"
        }
      },
      {
        "round": 8,
        "raceName": "Monaco Grand Prix",
        "circuitName": "Circuit de Monaco",
        "city": "Monte Carlo",
        "country": "Monaco",
        "flag": "🇲🇨",
        "date": "2024-05-26",
        "winner": {
          "driverCode": "LEC",
          "driverName": "Charles Leclerc",
          "constructorName": "Ferrari",
          "time": "2:23:15.554"
        }
      },
      {
        "round": 9,
        "raceName": "Canadian Grand Prix",
        "circuitName": "Circuit Gilles Villeneuve",
        "city": "Montreal",
        "country": "Canada",
        "flag": "🇨🇦",
        "date": "2024-06-09",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:45:47.927"
        }
      },
      {
        "round": 10,
        "raceName": "Spanish Grand Prix",
        "circuitName": "Circuit de Barcelona-Catalunya",
        "city": "Barcelona",
        "country": "Spain",
        "flag": "🇪🇸",
        "date": "2024-06-23",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:28:20.227"
        }
      },
      {
        "round": 11,
        "raceName": "Austrian Grand Prix",
        "circuitName": "Red Bull Ring",
        "city": "Spielberg",
        "country": "Austria",
        "flag": "🇦🇹",
        "date": "2024-06-30",
        "winner": {
          "driverCode": "RUS",
          "driverName": "George Russell",
          "constructorName": "Mercedes",
          "time": "1:24:22.798"
        }
      },
      {
        "round": 12,
        "raceName": "British Grand Prix",
        "circuitName": "Silverstone Circuit",
        "city": "Silverstone",
        "country": "UK",
        "flag": "🇬🇧",
        "date": "2024-07-07",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:22:27.059"
        }
      },
      {
        "round": 13,
        "raceName": "Hungarian Grand Prix",
        "circuitName": "Hungaroring",
        "city": "Budapest",
        "country": "Hungary",
        "flag": "🇭🇺",
        "date": "2024-07-21",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:38:01.989"
        }
      },
      {
        "round": 14,
        "raceName": "Belgian Grand Prix",
        "circuitName": "Circuit de Spa-Francorchamps",
        "city": "Spa",
        "country": "Belgium",
        "flag": "🇧🇪",
        "date": "2024-07-28",
        "winner": {
          "driverCode": "HAM",
          "driverName": "Lewis Hamilton",
          "constructorName": "Mercedes",
          "time": "1:19:57.566"
        }
      },
      {
        "round": 15,
        "raceName": "Dutch Grand Prix",
        "circuitName": "Circuit Park Zandvoort",
        "city": "Zandvoort",
        "country": "Netherlands",
        "flag": "🇳🇱",
        "date": "2024-08-25",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:30:45.519"
        }
      },
      {
        "round": 16,
        "raceName": "Italian Grand Prix",
        "circuitName": "Autodromo Nazionale di Monza",
        "city": "Monza",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2024-09-01",
        "winner": {
          "driverCode": "LEC",
          "driverName": "Charles Leclerc",
          "constructorName": "Ferrari",
          "time": "1:14:40.727"
        }
      },
      {
        "round": 17,
        "raceName": "Azerbaijan Grand Prix",
        "circuitName": "Baku City Circuit",
        "city": "Baku",
        "country": "Azerbaijan",
        "flag": "🇦🇿",
        "date": "2024-09-15",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:32:58.007"
        }
      },
      {
        "round": 18,
        "raceName": "Singapore Grand Prix",
        "circuitName": "Marina Bay Street Circuit",
        "city": "Marina Bay",
        "country": "Singapore",
        "flag": "🇸🇬",
        "date": "2024-09-22",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:40:52.571"
        }
      },
      {
        "round": 19,
        "raceName": "United States Grand Prix",
        "circuitName": "Circuit of the Americas",
        "city": "Austin",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2024-10-20",
        "winner": {
          "driverCode": "LEC",
          "driverName": "Charles Leclerc",
          "constructorName": "Ferrari",
          "time": "1:35:09.639"
        }
      },
      {
        "round": 20,
        "raceName": "Mexico City Grand Prix",
        "circuitName": "Autódromo Hermanos Rodríguez",
        "city": "Mexico City",
        "country": "Mexico",
        "flag": "🇲🇽",
        "date": "2024-10-27",
        "winner": {
          "driverCode": "SAI",
          "driverName": "Carlos Sainz",
          "constructorName": "Ferrari",
          "time": "1:40:55.800"
        }
      },
      {
        "round": 21,
        "raceName": "São Paulo Grand Prix",
        "circuitName": "Autódromo José Carlos Pace",
        "city": "São Paulo",
        "country": "Brazil",
        "flag": "🇧🇷",
        "date": "2024-11-03",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "2:06:54.430"
        }
      },
      {
        "round": 22,
        "raceName": "Las Vegas Grand Prix",
        "circuitName": "Las Vegas Strip Street Circuit",
        "city": "Las Vegas",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2024-11-23",
        "winner": {
          "driverCode": "RUS",
          "driverName": "George Russell",
          "constructorName": "Mercedes",
          "time": "1:22:05.969"
        }
      },
      {
        "round": 23,
        "raceName": "Qatar Grand Prix",
        "circuitName": "Lusail International Circuit",
        "city": "Lusail",
        "country": "Qatar",
        "flag": "🇶🇦",
        "date": "2024-12-01",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:31:05.323"
        }
      },
      {
        "round": 24,
        "raceName": "Abu Dhabi Grand Prix",
        "circuitName": "Yas Marina Circuit",
        "city": "Abu Dhabi",
        "country": "UAE",
        "flag": "🇦🇪",
        "date": "2024-12-08",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:26:33.291"
        }
      }
    ]
  },
  "2025": {
    "year": 2025,
    "racesCount": 24,
    "championDriver": {
      "name": "Lando Norris",
      "code": "NOR",
      "team": "McLaren",
      "points": 423,
      "wins": 7
    },
    "championConstructor": {
      "name": "McLaren",
      "points": 833,
      "wins": 14
    },
    "seasonSummary": "2025年シーズン：マクラーレンのランド・ノリスとレッドブルのマックス・フェルスタッペンによる激闘の末、ノリスが自身初となるドライバーズワールドチャンピオンを獲得。コンストラクターズタイトルもマクラーレンが2連覇を達成。",
    "driverStandings": [
      {
        "position": 1,
        "driverCode": "NOR",
        "driverName": "Lando Norris",
        "team": "McLaren",
        "points": 423,
        "wins": 7
      },
      {
        "position": 2,
        "driverCode": "VER",
        "driverName": "Max Verstappen",
        "team": "Red Bull",
        "points": 421,
        "wins": 8
      },
      {
        "position": 3,
        "driverCode": "PIA",
        "driverName": "Oscar Piastri",
        "team": "McLaren",
        "points": 410,
        "wins": 7
      },
      {
        "position": 4,
        "driverCode": "RUS",
        "driverName": "George Russell",
        "team": "Mercedes",
        "points": 319,
        "wins": 2
      },
      {
        "position": 5,
        "driverCode": "LEC",
        "driverName": "Charles Leclerc",
        "team": "Ferrari",
        "points": 242,
        "wins": 0
      },
      {
        "position": 6,
        "driverCode": "HAM",
        "driverName": "Lewis Hamilton",
        "team": "Ferrari",
        "points": 156,
        "wins": 0
      },
      {
        "position": 7,
        "driverCode": "ANT",
        "driverName": "Andrea Kimi Antonelli",
        "team": "Mercedes",
        "points": 150,
        "wins": 0
      },
      {
        "position": 8,
        "driverCode": "ALB",
        "driverName": "Alexander Albon",
        "team": "Williams",
        "points": 73,
        "wins": 0
      },
      {
        "position": 9,
        "driverCode": "SAI",
        "driverName": "Carlos Sainz",
        "team": "Williams",
        "points": 64,
        "wins": 0
      },
      {
        "position": 10,
        "driverCode": "ALO",
        "driverName": "Fernando Alonso",
        "team": "Aston Martin",
        "points": 56,
        "wins": 0
      },
      {
        "position": 11,
        "driverCode": "HUL",
        "driverName": "Nico Hülkenberg",
        "team": "Sauber",
        "points": 51,
        "wins": 0
      },
      {
        "position": 12,
        "driverCode": "HAD",
        "driverName": "Isack Hadjar",
        "team": "RB F1 Team",
        "points": 51,
        "wins": 0
      },
      {
        "position": 13,
        "driverCode": "BEA",
        "driverName": "Oliver Bearman",
        "team": "Haas F1 Team",
        "points": 41,
        "wins": 0
      },
      {
        "position": 14,
        "driverCode": "LAW",
        "driverName": "Liam Lawson",
        "team": "Red Bull",
        "points": 38,
        "wins": 0
      },
      {
        "position": 15,
        "driverCode": "OCO",
        "driverName": "Esteban Ocon",
        "team": "Haas F1 Team",
        "points": 38,
        "wins": 0
      },
      {
        "position": 16,
        "driverCode": "STR",
        "driverName": "Lance Stroll",
        "team": "Aston Martin",
        "points": 33,
        "wins": 0
      },
      {
        "position": 17,
        "driverCode": "TSU",
        "driverName": "Yuki Tsunoda",
        "team": "RB F1 Team",
        "points": 33,
        "wins": 0
      },
      {
        "position": 18,
        "driverCode": "GAS",
        "driverName": "Pierre Gasly",
        "team": "Alpine F1 Team",
        "points": 22,
        "wins": 0
      },
      {
        "position": 19,
        "driverCode": "BOR",
        "driverName": "Gabriel Bortoleto",
        "team": "Sauber",
        "points": 19,
        "wins": 0
      },
      {
        "position": 20,
        "driverCode": "COL",
        "driverName": "Franco Colapinto",
        "team": "Alpine F1 Team",
        "points": 0,
        "wins": 0
      },
      {
        "position": 21,
        "driverCode": "DOO",
        "driverName": "Jack Doohan",
        "team": "Alpine F1 Team",
        "points": 0,
        "wins": 0
      }
    ],
    "constructorStandings": [
      {
        "position": 1,
        "teamName": "McLaren",
        "points": 833,
        "wins": 14
      },
      {
        "position": 2,
        "teamName": "Mercedes",
        "points": 469,
        "wins": 2
      },
      {
        "position": 3,
        "teamName": "Red Bull",
        "points": 451,
        "wins": 8
      },
      {
        "position": 4,
        "teamName": "Ferrari",
        "points": 398,
        "wins": 0
      },
      {
        "position": 5,
        "teamName": "Williams",
        "points": 137,
        "wins": 0
      },
      {
        "position": 6,
        "teamName": "RB F1 Team",
        "points": 92,
        "wins": 0
      },
      {
        "position": 7,
        "teamName": "Aston Martin",
        "points": 89,
        "wins": 0
      },
      {
        "position": 8,
        "teamName": "Haas F1 Team",
        "points": 79,
        "wins": 0
      },
      {
        "position": 9,
        "teamName": "Sauber",
        "points": 70,
        "wins": 0
      },
      {
        "position": 10,
        "teamName": "Alpine F1 Team",
        "points": 22,
        "wins": 0
      }
    ],
    "calendar": [
      {
        "round": 1,
        "raceName": "Australian Grand Prix",
        "circuitName": "Albert Park Grand Prix Circuit",
        "city": "Melbourne",
        "country": "Australia",
        "flag": "🇦🇺",
        "date": "2025-03-16",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:42:06.304"
        }
      },
      {
        "round": 2,
        "raceName": "Chinese Grand Prix",
        "circuitName": "Shanghai International Circuit",
        "city": "Shanghai",
        "country": "China",
        "flag": "🇨🇳",
        "date": "2025-03-23",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:30:55.026"
        }
      },
      {
        "round": 3,
        "raceName": "Japanese Grand Prix",
        "circuitName": "Suzuka Circuit",
        "city": "Suzuka",
        "country": "Japan",
        "flag": "🇯🇵",
        "date": "2025-04-06",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:22:06.983"
        }
      },
      {
        "round": 4,
        "raceName": "Bahrain Grand Prix",
        "circuitName": "Bahrain International Circuit",
        "city": "Sakhir",
        "country": "Bahrain",
        "flag": "🇧🇭",
        "date": "2025-04-13",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:35:39.435"
        }
      },
      {
        "round": 5,
        "raceName": "Saudi Arabian Grand Prix",
        "circuitName": "Jeddah Corniche Circuit",
        "city": "Jeddah",
        "country": "Saudi Arabia",
        "flag": "🇸🇦",
        "date": "2025-04-20",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:21:06.758"
        }
      },
      {
        "round": 6,
        "raceName": "Miami Grand Prix",
        "circuitName": "Miami International Autodrome",
        "city": "Miami",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2025-05-04",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:28:51.587"
        }
      },
      {
        "round": 7,
        "raceName": "Emilia Romagna Grand Prix",
        "circuitName": "Autodromo Enzo e Dino Ferrari",
        "city": "Imola",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2025-05-18",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:31:33.199"
        }
      },
      {
        "round": 8,
        "raceName": "Monaco Grand Prix",
        "circuitName": "Circuit de Monaco",
        "city": "Monte Carlo",
        "country": "Monaco",
        "flag": "🇲🇨",
        "date": "2025-05-25",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:40:33.843"
        }
      },
      {
        "round": 9,
        "raceName": "Spanish Grand Prix",
        "circuitName": "Circuit de Barcelona-Catalunya",
        "city": "Barcelona",
        "country": "Spain",
        "flag": "🇪🇸",
        "date": "2025-06-01",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:32:57.375"
        }
      },
      {
        "round": 10,
        "raceName": "Canadian Grand Prix",
        "circuitName": "Circuit Gilles Villeneuve",
        "city": "Montreal",
        "country": "Canada",
        "flag": "🇨🇦",
        "date": "2025-06-15",
        "winner": {
          "driverCode": "RUS",
          "driverName": "George Russell",
          "constructorName": "Mercedes",
          "time": "1:31:52.688"
        }
      },
      {
        "round": 11,
        "raceName": "Austrian Grand Prix",
        "circuitName": "Red Bull Ring",
        "city": "Spielberg",
        "country": "Austria",
        "flag": "🇦🇹",
        "date": "2025-06-29",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:23:47.693"
        }
      },
      {
        "round": 12,
        "raceName": "British Grand Prix",
        "circuitName": "Silverstone Circuit",
        "city": "Silverstone",
        "country": "UK",
        "flag": "🇬🇧",
        "date": "2025-07-06",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:37:15.735"
        }
      },
      {
        "round": 13,
        "raceName": "Belgian Grand Prix",
        "circuitName": "Circuit de Spa-Francorchamps",
        "city": "Spa",
        "country": "Belgium",
        "flag": "🇧🇪",
        "date": "2025-07-27",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:25:22.601"
        }
      },
      {
        "round": 14,
        "raceName": "Hungarian Grand Prix",
        "circuitName": "Hungaroring",
        "city": "Budapest",
        "country": "Hungary",
        "flag": "🇭🇺",
        "date": "2025-08-03",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:35:21.231"
        }
      },
      {
        "round": 15,
        "raceName": "Dutch Grand Prix",
        "circuitName": "Circuit Park Zandvoort",
        "city": "Zandvoort",
        "country": "Netherlands",
        "flag": "🇳🇱",
        "date": "2025-08-31",
        "winner": {
          "driverCode": "PIA",
          "driverName": "Oscar Piastri",
          "constructorName": "McLaren",
          "time": "1:38:29.849"
        }
      },
      {
        "round": 16,
        "raceName": "Italian Grand Prix",
        "circuitName": "Autodromo Nazionale di Monza",
        "city": "Monza",
        "country": "Italy",
        "flag": "🇮🇹",
        "date": "2025-09-07",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:13:24.325"
        }
      },
      {
        "round": 17,
        "raceName": "Azerbaijan Grand Prix",
        "circuitName": "Baku City Circuit",
        "city": "Baku",
        "country": "Azerbaijan",
        "flag": "🇦🇿",
        "date": "2025-09-21",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:33:26.408"
        }
      },
      {
        "round": 18,
        "raceName": "Singapore Grand Prix",
        "circuitName": "Marina Bay Street Circuit",
        "city": "Marina Bay",
        "country": "Singapore",
        "flag": "🇸🇬",
        "date": "2025-10-05",
        "winner": {
          "driverCode": "RUS",
          "driverName": "George Russell",
          "constructorName": "Mercedes",
          "time": "1:40:22.367"
        }
      },
      {
        "round": 19,
        "raceName": "United States Grand Prix",
        "circuitName": "Circuit of the Americas",
        "city": "Austin",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2025-10-19",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:34:00.161"
        }
      },
      {
        "round": 20,
        "raceName": "Mexico City Grand Prix",
        "circuitName": "Autódromo Hermanos Rodríguez",
        "city": "Mexico City",
        "country": "Mexico",
        "flag": "🇲🇽",
        "date": "2025-10-26",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:37:58.574"
        }
      },
      {
        "round": 21,
        "raceName": "São Paulo Grand Prix",
        "circuitName": "Autódromo José Carlos Pace",
        "city": "São Paulo",
        "country": "Brazil",
        "flag": "🇧🇷",
        "date": "2025-11-09",
        "winner": {
          "driverCode": "NOR",
          "driverName": "Lando Norris",
          "constructorName": "McLaren",
          "time": "1:32:01.596"
        }
      },
      {
        "round": 22,
        "raceName": "Las Vegas Grand Prix",
        "circuitName": "Las Vegas Strip Street Circuit",
        "city": "Las Vegas",
        "country": "USA",
        "flag": "🇺🇸",
        "date": "2025-11-23",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:21:08.429"
        }
      },
      {
        "round": 23,
        "raceName": "Qatar Grand Prix",
        "circuitName": "Lusail International Circuit",
        "city": "Lusail",
        "country": "Qatar",
        "flag": "🇶🇦",
        "date": "2025-11-30",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:24:38.241"
        }
      },
      {
        "round": 24,
        "raceName": "Abu Dhabi Grand Prix",
        "circuitName": "Yas Marina Circuit",
        "city": "Abu Dhabi",
        "country": "UAE",
        "flag": "🇦🇪",
        "date": "2025-12-07",
        "winner": {
          "driverCode": "VER",
          "driverName": "Max Verstappen",
          "constructorName": "Red Bull",
          "time": "1:26:07.469"
        }
      }
    ]
  }
};

export function getHistoricalArchive(year: number | string): HistoricalSeasonArchive | null {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  return HISTORICAL_ARCHIVES[y] || null;
}

export const AVAILABLE_ARCHIVE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018] as const;
