/**
 * lib/physicsConstants.ts
 * Centralized physics and strategy constants for PITWALL simulation and Race Weekend Briefing.
 * Source: FIA 2026 Technical Regulations (Article 5 Power Unit) & Pirelli / FIA Pit Lane Timing Analysis.
 */

// Fuel effect: ~0.03 s/kg. Source: Generally accepted engineering estimate for modern F1 cars (approx 10kg = 0.3s).
export const FUEL_EFFECT_S_PER_KG = 0.03;

// Base fuel mass for a full race: ~110kg limit per FIA Technical Regulations.
export const BASE_RACE_FUEL_KG = 110;

// ERS Constants: 2026 FIA PU Regulations (MGU-K 350kW, Manual Override Mode within 1.0s)
export const ERS_MAX_CHARGE_MJ = 4.0;
export const ERS_MAX_HARVEST_PER_LAP_MJ = 8.5;
export const ERS_MIN_CHARGE_PERCENT = 0;
export const ERS_MAX_CHARGE_PERCENT = 100;
export const MGU_K_MAX_POWER_KW = 350;

// Defend team order penalty (s)
export const TEAM_ORDER_DEFEND_PENALTY_S = 0.6;

// Dirty air / Manual Override Mode (OVR) activation threshold (s)
export const DIRTY_AIR_THRESHOLD_S = 1.0;

// Standard Green-Flag Pit Stop Time Loss baseline (s) & Safety Car Pit Loss reduction factor
// Source: Pirelli F1 Strategy Guide average pit lane transit + stationary time (2.4s).
export const DEFAULT_GREEN_PIT_LOSS_S = 21.8;
export const SC_PIT_LOSS_FACTOR = 0.52;

// Fresh compound 1-lap undercut pace advantage baseline (s/lap for Soft/Medium fresh vs worn Hard/Medium)
export const BASE_UNDERCUT_GAIN_S = 1.65;
