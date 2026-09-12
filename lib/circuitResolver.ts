/**
 * lib/circuitResolver.ts
 * Resolves circuit ID, official total laps, and telemetry baseline benchmarks
 * from Grand Prix session metadata.
 */

import type { Session } from './types';

export interface CircuitBenchmark {
  circuitId: string;
  name: string;
  location: string;
  totalLaps: number;
  baseLapTimeSec: number;
  pit1Lap: number;
  pit2Lap: number;
  topSpeedKmh: number;
}

export const CIRCUIT_BENCHMARKS: Record<string, CircuitBenchmark> = {
  'albert-park': {
    circuitId: 'albert-park',
    name: 'Albert Park Circuit',
    location: 'Melbourne',
    totalLaps: 58,
    baseLapTimeSec: 78.5, // ~1:18.500
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 335,
  },
  'shanghai': {
    circuitId: 'shanghai',
    name: 'Shanghai International Circuit',
    location: 'Shanghai',
    totalLaps: 56,
    baseLapTimeSec: 96.0, // ~1:36.000
    pit1Lap: 16,
    pit2Lap: 36,
    topSpeedKmh: 340,
  },
  'suzuka': {
    circuitId: 'suzuka',
    name: 'Suzuka International Racing Course',
    location: 'Suzuka',
    totalLaps: 53,
    baseLapTimeSec: 92.5, // ~1:32.500
    pit1Lap: 15,
    pit2Lap: 34,
    topSpeedKmh: 326,
  },
  'bahrain-international': {
    circuitId: 'bahrain-international',
    name: 'Bahrain International Circuit',
    location: 'Sakhir',
    totalLaps: 57,
    baseLapTimeSec: 93.8, // ~1:33.800
    pit1Lap: 17,
    pit2Lap: 37,
    topSpeedKmh: 330,
  },
  'jeddah': {
    circuitId: 'jeddah',
    name: 'Jeddah Corniche Circuit',
    location: 'Jeddah',
    totalLaps: 50,
    baseLapTimeSec: 89.5, // ~1:29.500
    pit1Lap: 19,
    pit2Lap: 38,
    topSpeedKmh: 345,
  },
  'miami': {
    circuitId: 'miami',
    name: 'Miami International Autodrome',
    location: 'Miami',
    totalLaps: 57,
    baseLapTimeSec: 89.8, // ~1:29.800
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 345,
  },
  'imola': {
    circuitId: 'imola',
    name: 'Autodromo Internazionale Enzo e Dino Ferrari',
    location: 'Imola',
    totalLaps: 63,
    baseLapTimeSec: 78.5, // ~1:18.500
    pit1Lap: 22,
    pit2Lap: 43,
    topSpeedKmh: 325,
  },
  'circuit-de-monaco': {
    circuitId: 'circuit-de-monaco',
    name: 'Circuit de Monaco',
    location: 'Monaco',
    totalLaps: 78,
    baseLapTimeSec: 74.0, // ~1:14.000
    pit1Lap: 28,
    pit2Lap: 52,
    topSpeedKmh: 295,
  },
  'catalunya': {
    circuitId: 'catalunya',
    name: 'Circuit de Barcelona-Catalunya',
    location: 'Barcelona',
    totalLaps: 66,
    baseLapTimeSec: 76.5, // ~1:16.500
    pit1Lap: 19,
    pit2Lap: 42,
    topSpeedKmh: 332,
  },
  'villeneuve': {
    circuitId: 'villeneuve',
    name: 'Circuit Gilles Villeneuve',
    location: 'Montreal',
    totalLaps: 70,
    baseLapTimeSec: 74.5, // ~1:14.500
    pit1Lap: 21,
    pit2Lap: 46,
    topSpeedKmh: 338,
  },
  'redbull-ring': {
    circuitId: 'redbull-ring',
    name: 'Red Bull Ring',
    location: 'Spielberg',
    totalLaps: 71,
    baseLapTimeSec: 67.5, // ~1:07.500
    pit1Lap: 21,
    pit2Lap: 48,
    topSpeedKmh: 328,
  },
  'silverstone': {
    circuitId: 'silverstone',
    name: 'Silverstone Circuit',
    location: 'Silverstone',
    totalLaps: 52,
    baseLapTimeSec: 88.5, // ~1:28.500
    pit1Lap: 16,
    pit2Lap: 35,
    topSpeedKmh: 330,
  },
  'hungaroring': {
    circuitId: 'hungaroring',
    name: 'Hungaroring',
    location: 'Budapest',
    totalLaps: 70,
    baseLapTimeSec: 79.5, // ~1:19.500
    pit1Lap: 20,
    pit2Lap: 44,
    topSpeedKmh: 315,
  },
  'spa-francorchamps': {
    circuitId: 'spa-francorchamps',
    name: 'Circuit de Spa-Francorchamps',
    location: 'Spa-Francorchamps',
    totalLaps: 44,
    baseLapTimeSec: 105.5, // ~1:45.500
    pit1Lap: 14,
    pit2Lap: 29,
    topSpeedKmh: 345,
  },
  'zandvoort': {
    circuitId: 'zandvoort',
    name: 'Circuit Zandvoort',
    location: 'Zandvoort',
    totalLaps: 72,
    baseLapTimeSec: 72.8, // ~1:12.800
    pit1Lap: 24,
    pit2Lap: 49,
    topSpeedKmh: 318,
  },
  'monza': {
    circuitId: 'monza',
    name: 'Autodromo Nazionale Monza',
    location: 'Monza',
    totalLaps: 53,
    baseLapTimeSec: 81.2, // ~1:21.200
    pit1Lap: 18,
    pit2Lap: 36,
    topSpeedKmh: 355,
  },
  'baku': {
    circuitId: 'baku',
    name: 'Baku City Circuit',
    location: 'Baku',
    totalLaps: 51,
    baseLapTimeSec: 102.5, // ~1:42.500
    pit1Lap: 15,
    pit2Lap: 34,
    topSpeedKmh: 352,
  },
  'singapore': {
    circuitId: 'singapore',
    name: 'Marina Bay Street Circuit',
    location: 'Singapore',
    totalLaps: 62,
    baseLapTimeSec: 96.0, // ~1:36.000
    pit1Lap: 20,
    pit2Lap: 43,
    topSpeedKmh: 315,
  },
  'cota': {
    circuitId: 'cota',
    name: 'Circuit of the Americas',
    location: 'Austin',
    totalLaps: 56,
    baseLapTimeSec: 96.5, // ~1:36.500
    pit1Lap: 17,
    pit2Lap: 36,
    topSpeedKmh: 335,
  },
  'mexico': {
    circuitId: 'mexico',
    name: 'Autódromo Hermanos Rodríguez',
    location: 'Mexico City',
    totalLaps: 71,
    baseLapTimeSec: 79.5, // ~1:19.500
    pit1Lap: 23,
    pit2Lap: 48,
    topSpeedKmh: 352,
  },
  'interlagos': {
    circuitId: 'interlagos',
    name: 'Autódromo José Carlos Pace',
    location: 'Sao Paulo',
    totalLaps: 71,
    baseLapTimeSec: 71.8, // ~1:11.800
    pit1Lap: 22,
    pit2Lap: 47,
    topSpeedKmh: 332,
  },
  'las-vegas': {
    circuitId: 'las-vegas',
    name: 'Las Vegas Strip Circuit',
    location: 'Las Vegas',
    totalLaps: 50,
    baseLapTimeSec: 94.5, // ~1:34.500
    pit1Lap: 17,
    pit2Lap: 35,
    topSpeedKmh: 350,
  },
  'losail': {
    circuitId: 'losail',
    name: 'Lusail International Circuit',
    location: 'Lusail',
    totalLaps: 57,
    baseLapTimeSec: 83.5, // ~1:23.500
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 336,
  },
  'yas-marina': {
    circuitId: 'yas-marina',
    name: 'Yas Marina Circuit',
    location: 'Yas Marina',
    totalLaps: 58,
    baseLapTimeSec: 86.5, // ~1:26.500
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 335,
  },
  'madrid': {
    circuitId: 'madrid',
    name: 'Madring (IFEMA Madrid Hybrid Circuit)',
    location: 'Madrid',
    totalLaps: 55,
    baseLapTimeSec: 81.5, // ~1:21.500
    pit1Lap: 18,
    pit2Lap: 38,
    topSpeedKmh: 340,
  },
};

// Monaco alias for backwards compatibility
CIRCUIT_BENCHMARKS['monaco'] = CIRCUIT_BENCHMARKS['circuit-de-monaco'];

/**
 * Resolves a circuit identifier and its telemetry benchmark for any given session.
 */
export function resolveCircuitForSession(session: Session | null | undefined): CircuitBenchmark {
  if (!session) {
    return CIRCUIT_BENCHMARKS['bahrain-international'];
  }

  const query = `${session.meeting_name ?? ''} ${session.location ?? ''} ${session.meeting_official_name ?? ''}`.toLowerCase();

  if (query.includes('melbourne') || query.includes('australi') || query.includes('albert')) {
    return CIRCUIT_BENCHMARKS['albert-park'];
  }
  if (query.includes('shanghai') || query.includes('chin')) {
    return CIRCUIT_BENCHMARKS['shanghai'];
  }
  if (query.includes('suzuka') || query.includes('japan')) {
    return CIRCUIT_BENCHMARKS['suzuka'];
  }
  if (query.includes('bahrain') || query.includes('sakhir')) {
    return CIRCUIT_BENCHMARKS['bahrain-international'];
  }
  if (query.includes('jeddah') || query.includes('saudi')) {
    return CIRCUIT_BENCHMARKS['jeddah'];
  }
  if (query.includes('miami')) {
    return CIRCUIT_BENCHMARKS['miami'];
  }
  if (query.includes('imola') || query.includes('emilia') || query.includes('dino ferrari')) {
    return CIRCUIT_BENCHMARKS['imola'];
  }
  if (query.includes('monaco') || query.includes('monte carlo')) {
    return CIRCUIT_BENCHMARKS['circuit-de-monaco'];
  }
  if (query.includes('madrid') || query.includes('madring') || query.includes('ifema')) {
    return CIRCUIT_BENCHMARKS['madrid'];
  }
  if (query.includes('catalunya') || query.includes('barcelona') || query.includes('spani') || query.includes('españa')) {
    return CIRCUIT_BENCHMARKS['catalunya'];
  }
  if (query.includes('montreal') || query.includes('canad') || query.includes('villeneuve')) {
    return CIRCUIT_BENCHMARKS['villeneuve'];
  }
  if (query.includes('spielberg') || query.includes('austria') || query.includes('red bull ring')) {
    return CIRCUIT_BENCHMARKS['redbull-ring'];
  }
  if (query.includes('silverstone') || query.includes('british') || query.includes('great britain')) {
    return CIRCUIT_BENCHMARKS['silverstone'];
  }
  if (query.includes('hungaroring') || query.includes('hungar') || query.includes('budapest')) {
    return CIRCUIT_BENCHMARKS['hungaroring'];
  }
  if (query.includes('spa') || query.includes('belgi') || query.includes('francorchamps')) {
    return CIRCUIT_BENCHMARKS['spa-francorchamps'];
  }
  if (query.includes('zandvoort') || query.includes('dutch') || query.includes('netherland')) {
    return CIRCUIT_BENCHMARKS['zandvoort'];
  }
  if (query.includes('monza') || query.includes('ital')) {
    return CIRCUIT_BENCHMARKS['monza'];
  }
  if (query.includes('baku') || query.includes('azerbaijan')) {
    return CIRCUIT_BENCHMARKS['baku'];
  }
  if (query.includes('singapore') || query.includes('marina bay')) {
    return CIRCUIT_BENCHMARKS['singapore'];
  }
  if (query.includes('austin') || query.includes('united states') || query.includes('cota') || query.includes('americas')) {
    return CIRCUIT_BENCHMARKS['cota'];
  }
  if (query.includes('mexico') || query.includes('rodriguez')) {
    return CIRCUIT_BENCHMARKS['mexico'];
  }
  if (query.includes('interlagos') || query.includes('sao paulo') || query.includes('brazil') || query.includes('brasil')) {
    return CIRCUIT_BENCHMARKS['interlagos'];
  }
  if (query.includes('vegas')) {
    return CIRCUIT_BENCHMARKS['las-vegas'];
  }
  if (query.includes('losail') || query.includes('lusail') || query.includes('qatar')) {
    return CIRCUIT_BENCHMARKS['losail'];
  }
  if (query.includes('yas marina') || query.includes('abu dhabi')) {
    return CIRCUIT_BENCHMARKS['yas-marina'];
  }

  return CIRCUIT_BENCHMARKS['bahrain-international'];
}
