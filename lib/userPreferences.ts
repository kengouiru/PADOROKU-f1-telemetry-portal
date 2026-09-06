'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  customAvatarUrl?: string;
  displayName?: string;
  favoriteTeamId?: string;
  favoriteDriverCode?: string;
  fanType?: string;
}

const STORAGE_KEY = 'padoroku_user_preferences';

export const DEFAULT_PREFERENCES: UserPreferences = {
  customAvatarUrl: '',
  displayName: '',
  favoriteTeamId: 'ferrari',
  favoriteDriverCode: 'HAM',
  fanType: '推し活・ドラマ派',
};

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const current = getUserPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('padoroku_user_prefs_updated', { detail: updated }));
    return updated;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(() => getUserPreferences());
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    // Re-sync on mount in case storage changed
    setPrefs(getUserPreferences());
    setIsLoaded(true);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserPreferences>;
      if (customEvent.detail) {
        setPrefs(customEvent.detail);
      } else {
        setPrefs(getUserPreferences());
      }
    };

    window.addEventListener('padoroku_user_prefs_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('padoroku_user_prefs_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const update = useCallback((newPrefs: Partial<UserPreferences>) => {
    const saved = saveUserPreferences(newPrefs);
    setPrefs(saved);
  }, []);

  return { prefs, update, isLoaded };
}
