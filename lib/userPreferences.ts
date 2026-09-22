'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  customAvatarUrl?: string;
  displayName?: string;
  favoriteTeamId?: string;
  favoriteDriverCode?: string;
  fanType?: string;
  // Phase 3-D: Multi-item bookmarks
  favoriteDriverCodes?: string[];
  favoriteTeamIds?: string[];
  favoriteCircuitIds?: string[];
  // Strategist Titles & Aura
  equippedTitleId?: string;
  unlockedTitleIds?: string[];
}

const STORAGE_KEY = 'padoroku_user_preferences';

export const DEFAULT_PREFERENCES: UserPreferences = {
  customAvatarUrl: '',
  displayName: '',
  favoriteTeamId: 'ferrari',
  favoriteDriverCode: 'HAM',
  fanType: '推し活・ドラマ派',
  favoriteDriverCodes: ['HAM', 'VER', 'NOR', 'TSU'],
  favoriteTeamIds: ['ferrari', 'redbull', 'mclaren'],
  favoriteCircuitIds: ['suzuka', 'monaco', 'spa'],
  equippedTitleId: 'rookie_tactician',
  unlockedTitleIds: ['rookie_tactician'],
};

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      favoriteDriverCodes: Array.isArray(parsed.favoriteDriverCodes)
        ? parsed.favoriteDriverCodes
        : DEFAULT_PREFERENCES.favoriteDriverCodes,
      favoriteTeamIds: Array.isArray(parsed.favoriteTeamIds)
        ? parsed.favoriteTeamIds
        : DEFAULT_PREFERENCES.favoriteTeamIds,
      favoriteCircuitIds: Array.isArray(parsed.favoriteCircuitIds)
        ? parsed.favoriteCircuitIds
        : DEFAULT_PREFERENCES.favoriteCircuitIds,
    };
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

export function toggleFavoriteDriver(code: string): boolean {
  const current = getUserPreferences();
  const list = current.favoriteDriverCodes || [];
  const exists = list.includes(code);
  const nextList = exists ? list.filter((c) => c !== code) : [...list, code];
  saveUserPreferences({ favoriteDriverCodes: nextList });
  return !exists;
}

export function toggleFavoriteTeam(id: string): boolean {
  const current = getUserPreferences();
  const list = current.favoriteTeamIds || [];
  const exists = list.includes(id);
  const nextList = exists ? list.filter((t) => t !== id) : [...list, id];
  saveUserPreferences({ favoriteTeamIds: nextList });
  return !exists;
}

export function toggleFavoriteCircuit(id: string): boolean {
  const current = getUserPreferences();
  const list = current.favoriteCircuitIds || [];
  const exists = list.includes(id);
  const nextList = exists ? list.filter((c) => c !== id) : [...list, id];
  saveUserPreferences({ favoriteCircuitIds: nextList });
  return !exists;
}

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Re-sync on mount on client from localStorage
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

  const isFavoriteDriver = useCallback(
    (code: string) => (prefs.favoriteDriverCodes || []).includes(code),
    [prefs.favoriteDriverCodes]
  );

  const isFavoriteTeam = useCallback(
    (id: string) => (prefs.favoriteTeamIds || []).includes(id),
    [prefs.favoriteTeamIds]
  );

  const isFavoriteCircuit = useCallback(
    (id: string) => (prefs.favoriteCircuitIds || []).includes(id),
    [prefs.favoriteCircuitIds]
  );

  const toggleDriver = useCallback(
    (code: string) => {
      toggleFavoriteDriver(code);
    },
    []
  );

  const toggleTeam = useCallback(
    (id: string) => {
      toggleFavoriteTeam(id);
    },
    []
  );

  const toggleCircuit = useCallback(
    (id: string) => {
      toggleFavoriteCircuit(id);
    },
    []
  );

  return {
    prefs,
    update,
    isLoaded,
    isFavoriteDriver,
    isFavoriteTeam,
    isFavoriteCircuit,
    toggleDriver,
    toggleTeam,
    toggleCircuit,
  };
}
