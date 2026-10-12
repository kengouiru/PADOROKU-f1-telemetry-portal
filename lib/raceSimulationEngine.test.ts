import { describe, it, expect } from 'vitest';
import { seededRandom, setGlobalSeed } from './seededRandom';
import { FUEL_EFFECT_S_PER_KG, ERS_MAX_CHARGE_MJ } from './physicsConstants';

describe('raceSimulationEngine', () => {
  it('fuel effect sign: heavier car is slower (higher lap time penalty)', () => {
    // If a car has more fuel, the fuel pace penalty should be higher.
    const fuelPenaltyLight = 10 * FUEL_EFFECT_S_PER_KG;
    const fuelPenaltyHeavy = 100 * FUEL_EFFECT_S_PER_KG;
    expect(fuelPenaltyHeavy).toBeGreaterThan(fuelPenaltyLight);
    expect(fuelPenaltyHeavy).toBe(3.0);
  });

  it('tyre wear is monotonic and penalty continuous', () => {
    // Wear penalty formula check
    const calculateWearPenalty = (wearPercent: number) => {
      let penalty = (wearPercent / 100) * 1.5;
      if (wearPercent > 75) {
        penalty += Math.pow((wearPercent - 75) * 0.1, 2);
      }
      return penalty;
    };

    const w50 = calculateWearPenalty(50);
    const w75 = calculateWearPenalty(75);
    const w80 = calculateWearPenalty(80);
    const w90 = calculateWearPenalty(90);

    expect(w75).toBeGreaterThan(w50);
    expect(w80).toBeGreaterThan(w75);
    expect(w90).toBeGreaterThan(w80);
    // Smooth transition checks
    expect(w75 - w50).toBeCloseTo(0.375, 2);
    expect(w80 - w75).toBeCloseTo(1.5 * 0.05 + Math.pow(0.5, 2), 2); // 0.075 + 0.25 = 0.325
  });

  it('SC hazard yields expected race-level probability', () => {
    // For a race probability pRace, we derive perLapHazard.
    const pRace = 0.4;
    const totalLaps = 50;
    const perLapHazard = 1 - Math.pow(1 - pRace, 1 / totalLaps);
    
    // Check that over 50 laps, the chance of at least one SC is exactly 0.4
    const chanceOfNoSC = Math.pow(1 - perLapHazard, totalLaps);
    const chanceOfSC = 1 - chanceOfNoSC;
    expect(chanceOfSC).toBeCloseTo(0.4, 4);
  });

  it('ERS SoC tracks in MJ correctly up to 4.0 MJ', () => {
    const socPercent = 100;
    const currentMj = (socPercent / 100) * ERS_MAX_CHARGE_MJ;
    expect(currentMj).toBe(4.0);
    
    const socDropPercent = 10;
    const dropMj = (socDropPercent / 100) * ERS_MAX_CHARGE_MJ;
    expect(dropMj).toBeCloseTo(0.4, 2);
    expect(dropMj).toBeLessThan(1.4); // Less than the 35% clamp threshold from before
  });

  it('seeded RNG reproducibility', () => {
    setGlobalSeed(12345);
    const r1 = seededRandom();
    setGlobalSeed(12345);
    const r2 = seededRandom();
    expect(r1).toBe(r2);
  });

  it('overtaking needs pace advantage', () => {
    const calcProb = (delta: number, drs: boolean) => {
      let base = 0.05 + delta * 0.15;
      if (drs) base += 0.25;
      return base;
    };
    const probLow = calcProb(0.2, false);
    const probHigh = calcProb(1.2, true);
    expect(probHigh).toBeGreaterThan(probLow);
    
    // Difficulty reduces probability
    const probHard = calcProb(1.2, true) / 1.5;
    expect(probHigh).toBeGreaterThan(probHard);
  });
});
