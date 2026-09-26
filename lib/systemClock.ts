/**
 * lib/systemClock.ts
 * Centralized System & JST Time Management.
 *
 * STRICT COMPLIANCE:
 * - Single source of truth for current time and session lifecycle calculations.
 * - Dynamic verification against the system clock (Date.now()).
 * - Hydration-safe React hooks for UI time displays.
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Returns formatted JST clock string.
 * Example: "2026.09.26 (土) 13:08:24" or "9/26 (土) 13:08"
 */
export function formatJstClock(date: Date = new Date(), options?: { compact?: boolean; includeSeconds?: boolean }): string {
  const d = new Date(date);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const w = weekdays[d.getDay()];

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  if (options?.compact) {
    if (options?.includeSeconds) {
      return `${month}/${day}(${w}) ${hours}:${minutes}:${seconds}`;
    }
    return `${month}/${day} (${w}) ${hours}:${minutes}`;
  }

  if (options?.includeSeconds === false) {
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} (${w}) ${hours}:${minutes} JST`;
  }

  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} (${w}) ${hours}:${minutes}:${seconds} JST`;
}

/**
 * Checks if a specific session has already passed relative to current time.
 */
export function isSessionPast(sessionUtcOrIso: string, referenceTime: number = Date.now()): boolean {
  if (!sessionUtcOrIso) return false;
  const t = new Date(sessionUtcOrIso).getTime();
  if (isNaN(t)) return false;
  return t <= referenceTime;
}

/**
 * Checks if a Grand Prix weekend is currently underway:
 * Weekend has started (first practice session or 2 days before race) AND race has not concluded yet.
 */
export function isWeekendInProgress(targetDateUtc: string, referenceTime: number = Date.now()): boolean {
  if (!targetDateUtc) return false;
  const raceStart = new Date(targetDateUtc).getTime();
  if (isNaN(raceStart)) return false;

  // Race assumed to last ~2.5 hours
  const raceEnd = raceStart + (2.5 * 60 * 60 * 1000);

  // Grand Prix weekend starts ~2.5 days before race start (Thursday/Friday)
  const weekendStart = raceStart - (2.5 * 24 * 60 * 60 * 1000);

  return referenceTime >= weekendStart && referenceTime < raceEnd;
}

/**
 * Hydration-safe React hook providing live updating JST time.
 */
export function useCurrentJstClock(intervalMs: number = 1000) {
  // Initialize with null or empty during SSR to prevent hydration mismatches
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set immediate client time on mount
    setNow(new Date());

    const timer = setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return {
    now,
    isMounted: now !== null,
    formatted: now ? formatJstClock(now) : '',
    formattedCompact: now ? formatJstClock(now, { compact: true }) : '',
    formattedCompactSeconds: now ? formatJstClock(now, { compact: true, includeSeconds: true }) : '',
    formattedNoSeconds: now ? formatJstClock(now, { includeSeconds: false }) : '',
  };
}
