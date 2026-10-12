/**
 * lib/physicsConstants.ts
 * Centralized physics and strategy constants for PITWALL simulation.
 */

// Fuel effect: ~0.03 s/kg. Source: Generally accepted engineering estimate for modern F1 cars (approx 10kg = 0.3s).
export const FUEL_EFFECT_S_PER_KG = 0.03; 

// Base fuel mass for a full race: ~110kg limit per FIA Technical Regulations.
export const BASE_RACE_FUEL_KG = 110;

// ERS Constants: 2026 FIA PU Regulations
// MGU-K max 350 kW (not directly used in basic lap time math but context).
// Energy Store (ES) usable energy window is 4 MJ.
export const ERS_MAX_CHARGE_MJ = 4.0;
// Harvest up to 8.5 MJ per lap (estimate based on 2026 regen targets).
export const ERS_MAX_HARVEST_PER_LAP_MJ = 8.5;
// ERS minimum state of charge (can drop to 0% of the usable 4MJ window).
export const ERS_MIN_CHARGE_PERCENT = 0;
export const ERS_MAX_CHARGE_PERCENT = 100;

// Defend team order penalty (s)
export const TEAM_ORDER_DEFEND_PENALTY_S = 0.6;

// Dirty air threshold (s)
export const DIRTY_AIR_THRESHOLD_S = 1.0;
