export type Tier = 1 | 2 | 3;

export interface LibraryReference {
  title: string;
  url: string;
  publisher: string;
  tier: Tier;
  accessedDate: string;
}

export interface ChampionSeason {
  year: number;
  driverChampion: {
    name: string;
    nameJa: string;
    nationality: string;
    team: string;
    wins?: number;
    points?: number;
  };
  constructorChampion?: {
    name: string;
    nameJa: string;
  };
  references: LibraryReference[];
}

export interface LegendDriver {
  id: string;
  name: string;
  nameJa: string;
  nationality: string;
  born: string;
  died?: string;
  years: string;
  teams: string[];
  championships: number;
  championshipYears: number[];
  wins: number;
  poles: number;
  podiums: number;
  starts: number;
  statsAsOf: string;
  summaryJa: string;
  signatureMoments: {
    year: number;
    titleJa: string;
    descriptionJa: string;
  }[];
  references: LibraryReference[];
}

export interface DefunctTeam {
  id: string;
  name: string;
  nameJa: string;
  activeYears: string;
  wins: number;
  championships: number;
  summaryJa: string;
  references: LibraryReference[];
}

export interface HistoricCar {
  id: string;
  name: string;
  nameJa: string;
  constructor: string;
  year: number;
  wins: number;
  championshipsWon: number;
  summaryJa: string;
  references: LibraryReference[];
}

export interface FamousRace {
  id: string;
  year: number;
  grandPrix: string;
  grandPrixJa: string;
  circuit: string;
  winner: string;
  summaryJa: string;
  references: LibraryReference[];
}

export interface SafetyMilestone {
  id: string;
  year: number;
  title: string;
  titleJa: string;
  descriptionJa: string;
  references: LibraryReference[];
}

export interface HistoricCircuit {
  id: string;
  name: string;
  nameJa: string;
  location: string;
  country: string;
  lengthKm: number;
  turns: number;
  summaryJa: string;
  references: LibraryReference[];
}
