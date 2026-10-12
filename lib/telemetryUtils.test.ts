import { describe, it, expect } from 'vitest';
import {
  formatLapTime,
  detectSafetyCarPeriods,
  calculateCumulativeGaps,
  calculateStintDegradation,
  simulatePitStrategy,
} from './telemetryUtils';
import type { Lap, RaceControlMessage, Stint, Driver } from './types';

describe('telemetryUtils', () => {
  describe('formatLapTime', () => {
    it('handles carry correctly for .1000', () => {
      // 60.9999 -> 1:01.000 instead of 1:00.1000
      expect(formatLapTime(60.9999)).toBe('1:01.000');
      expect(formatLapTime(59.9995)).toBe('1:00.000');
      expect(formatLapTime(81.001)).toBe('1:21.001');
    });
  });

  describe('detectSafetyCarPeriods', () => {
    it('distinguishes VSC and SC', () => {
      const msgs: RaceControlMessage[] = [
        { date: '2024-01-01T10:00:00Z', category: 'SafetyCar', message: 'VIRTUAL SAFETY CAR DEPLOYED', flag: 'YELLOW', lap_number: 1 },
        { date: '2024-01-01T10:05:00Z', category: 'SafetyCar', message: 'TRACK CLEAR', flag: 'GREEN', lap_number: 2 },
        { date: '2024-01-01T10:10:00Z', category: 'SafetyCar', message: 'SAFETY CAR DEPLOYED', flag: 'YELLOW', lap_number: 4 },
        { date: '2024-01-01T10:15:00Z', category: 'SafetyCar', message: 'SAFETY CAR IN THIS LAP', flag: 'GREEN', lap_number: 5 },
      ];
      const laps: Lap[] = [
        { lap_number: 1, date_start: '2024-01-01T09:59:00Z' } as Lap,
        { lap_number: 2, date_start: '2024-01-01T10:01:00Z' } as Lap,
        { lap_number: 3, date_start: '2024-01-01T10:06:00Z' } as Lap,
        { lap_number: 4, date_start: '2024-01-01T10:09:00Z' } as Lap,
        { lap_number: 5, date_start: '2024-01-01T10:14:00Z' } as Lap,
        { lap_number: 6, date_start: '2024-01-01T10:16:00Z' } as Lap,
      ];
      
      const periods = detectSafetyCarPeriods(msgs, laps);
      expect(periods).toHaveLength(2);
      expect(periods[0].type).toBe('VSC');
      expect(periods[0].startLap).toBe(1);
      expect(periods[0].endLap).toBe(3);
      
      expect(periods[1].type).toBe('SC');
      expect(periods[1].startLap).toBe(4);
      expect(periods[1].endLap).toBe(6);
    });
  });

  describe('calculateCumulativeGaps', () => {
    it('uses date_start for missing lap_duration and lap_time', () => {
      const lapsCache = {
        '1': [
          { lap_number: 1, lap_duration: 60, date_start: '2024-01-01T10:00:00Z' } as Lap,
          { lap_number: 2, lap_duration: null, lap_time: null, date_start: '2024-01-01T10:01:00Z' } as Lap,
          { lap_number: 3, lap_duration: 60, date_start: '2024-01-01T10:02:00Z' } as Lap,
        ],
        '4': [
          { lap_number: 1, lap_duration: 61, date_start: '2024-01-01T10:00:01Z' } as Lap,
          { lap_number: 2, lap_duration: 61, date_start: '2024-01-01T10:01:02Z' } as Lap,
          { lap_number: 3, lap_duration: 61, date_start: '2024-01-01T10:02:03Z' } as Lap,
        ],
      };
      
      const drivers: Driver[] = [
        { driver_number: 1, name_acronym: 'VER' } as Driver,
        { driver_number: 4, name_acronym: 'NOR' } as Driver,
      ];
      
      const { series } = calculateCumulativeGaps(['1', '4'], drivers, lapsCache, []);
      expect(series).toHaveLength(2);
      
      const norSeries = series.find(s => s.driverNum === '4');
      // Lap 1: 61 vs 60 = +1.0
      expect(norSeries?.points[0].y).toBe(1.0);
      // Lap 2: 61 vs (10:02:00 - 10:01:00 = 60s) = 122 vs 120 = +2.0
      expect(norSeries?.points[1].y).toBe(2.0);
      // Lap 3: 61 vs 60 = 183 vs 180 = +3.0
      expect(norSeries?.points[2].y).toBe(3.0);
    });
  });

  describe('calculateStintDegradation', () => {
    it('computes least-squares linear degradation rate', () => {
      const stints: Stint[] = [
        { driver_number: 1, stint_number: 1, lap_start: 1, lap_end: 5, compound: 'SOFT', tyre_age_at_start: 0 } as Stint,
      ];
      const lapsCache = {
        '1': [
          { lap_number: 1, lap_duration: 70 } as Lap, // will be ignored as lapNumber=1
          { lap_number: 2, lap_duration: 60 } as Lap,
          { lap_number: 3, lap_duration: 60.5 } as Lap,
          { lap_number: 4, lap_duration: 61.0 } as Lap,
          { lap_number: 5, lap_duration: 61.5 } as Lap,
        ]
      };
      const drivers: Driver[] = [{ driver_number: 1 } as Driver];
      
      const results = calculateStintDegradation(['1'], drivers, lapsCache, stints);
      expect(results).toHaveLength(1);
      
      // Points for ls fit:
      // x=2 (lap 2), y=60
      // x=3 (lap 3), y=60.5
      // x=4 (lap 4), y=61.0
      // x=5 (lap 5), y=61.5
      // Deg rate should be exactly 0.5s / lap
      expect(results[0].degRatePerLap).toBe(0.5);
    });
  });

  describe('simulatePitStrategy', () => {
    it('sorts by laps completed then cumulative race time', () => {
      const lapsCache = {
        '1': [
          { lap_number: 1, lap_duration: 60 } as Lap,
          { lap_number: 2, lap_duration: 60 } as Lap,
        ],
        '4': [
          { lap_number: 1, lap_duration: 65 } as Lap,
          // Lap 2 missing (lapped or retired)
        ],
        '16': [
          { lap_number: 1, lap_duration: 61 } as Lap,
          { lap_number: 2, lap_duration: 62 } as Lap,
        ],
      };
      
      const drivers: Driver[] = [
        { driver_number: 1, name_acronym: 'VER' } as Driver,
        { driver_number: 4, name_acronym: 'NOR' } as Driver,
        { driver_number: 16, name_acronym: 'LEC' } as Driver,
      ];
      
      // VER: 2 laps, 120s
      // LEC: 2 laps, 123s
      // NOR: 1 lap, 65s
      
      const results = simulatePitStrategy(['1', '4', '16'], drivers, lapsCache, []);
      
      // Target order: VER, LEC, NOR
      const ver = results.find(r => r.driverNum === '1');
      const lec = results.find(r => r.driverNum === '16');
      const nor = results.find(r => r.driverNum === '4');
      
      expect(ver?.currentPosition).toBe(1); // 120s
      expect(lec?.currentPosition).toBe(2); // 123s
      expect(nor?.currentPosition).toBe(3); // 65s but 1 lap down
    });
  });
});
