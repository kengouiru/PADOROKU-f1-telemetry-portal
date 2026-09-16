'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'f1_gemini_api_key';
const EVENT_NAME = 'f1_gemini_key_changed';

/**
 * Retrieve the Gemini API key currently saved in localStorage.
 * Safe for SSR (returns '' if window is undefined).
 */
export function getStoredGeminiApiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Persist or clear the Gemini API key in localStorage.
 * Dispatches a custom event to notify all active hooks in the same window.
 */
export function setStoredGeminiApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: trimmed }));
  } catch {}
}

/**
 * Get headers object containing 'x-gemini-key' if a user key is configured.
 * Can be spread into any fetch() headers object.
 */
export function getGeminiAuthHeaders(): Record<string, string> {
  const key = getStoredGeminiApiKey();
  return key ? { 'x-gemini-key': key } : {};
}

/**
 * React hook for reading and writing the Gemini API key with cross-component reactivity.
 */
export function useGeminiApiKey(): [string, (key: string) => void] {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    setApiKey(getStoredGeminiApiKey());

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setApiKey(e.newValue || '');
      }
    };

    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setApiKey(customEvent.detail || '');
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(EVENT_NAME, handleCustom);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(EVENT_NAME, handleCustom);
    };
  }, []);

  const updateApiKey = useCallback((newKey: string) => {
    setStoredGeminiApiKey(newKey);
    setApiKey(newKey.trim());
  }, []);

  return [apiKey, updateApiKey];
}
