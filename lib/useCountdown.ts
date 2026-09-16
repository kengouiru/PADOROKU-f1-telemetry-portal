'use client';

import { useState, useEffect } from 'react';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  mounted: boolean;
}

/**
 * Lightweight custom hook for countdown calculations with 1-second interval.
 * Includes mounted flag to completely avoid React SSR hydration mismatches.
 */
export function useCountdown(targetDateIso: string): CountdownState {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<Omit<CountdownState, 'mounted'>>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    setMounted(true);

    if (!targetDateIso) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      return;
    }

    const calculateTime = () => {
      const targetTime = new Date(targetDateIso).getTime();
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateIso]);

  return {
    ...timeLeft,
    mounted,
  };
}
