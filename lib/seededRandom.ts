/**
 * lib/seededRandom.ts
 * Seeded RNG for reproducible simulation scenarios.
 * Uses mulberry32 algorithm.
 */

export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  // Returns a float between 0 (inclusive) and 1 (exclusive)
  public next(): number {
    this.state |= 0;
    this.state = this.state + 0x6D2B79F5 | 0;
    let t = Math.imul(this.state ^ this.state >>> 15, 1 | this.state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  // Generate a random integer between min (inclusive) and max (exclusive)
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  // Pick a random element from an array
  public pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length)];
  }
}

// Global instance for convenience if not passing around
let defaultRng = new SeededRandom(Date.now());

export function setGlobalSeed(seed: number) {
  defaultRng = new SeededRandom(seed);
}

export function seededRandom(): number {
  return defaultRng.next();
}
