'use client';

/**
 * components/Sidebar.tsx
 * Session selection panel + driver grid + Gemini API key input.
 */

import React, { useMemo, useState } from 'react';
import type { Session, Driver } from '@/lib/types';
import { formatColor } from '@/lib/telemetryUtils';

// Minimal unique meeting shape for dropdown
interface UniqueMeeting {
  meeting_key: number;
  meeting_name: string;
  date_start: Date;
}

interface SidebarProps {
  // Selectors
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedMeetingKey: number | null;
  onMeetingChange: (key: number) => void;
  selectedSessionKey: number | null;
  onSessionChange: (key: number) => void;
  sessions: Session[];
  // Driver grid
  drivers: Driver[];
  selectedDrivers: string[];
  onDriverToggle: (num: string, checked: boolean) => void;
  // Gemini
  geminiApiKey: string;
  onGeminiKeyChange: (key: string) => void;
  // Status
  isDemoMode: boolean;
  isLoading: boolean;
}

const AVAILABLE_YEARS = ['2024', '2023', '2022', '2021'];

function buildUniqueMeetings(sessions: Session[]): UniqueMeeting[] {
  const seen = new Set<number>();
  const result: UniqueMeeting[] = [];
  for (const s of sessions) {
    if (!seen.has(s.meeting_key)) {
      seen.add(s.meeting_key);
      const rawName =
        s.meeting_official_name?.trim() ||
        s.meeting_name?.trim() ||
        (s.location ? `${s.location} Grand Prix` : null) ||
        `Round ${result.length + 1}`;
      // Strip demo label for cleaner display
      const cleanName = rawName.replace(/\s*\(デモ用サンプル\)/g, '').trim();
      result.push({
        meeting_key: s.meeting_key,
        meeting_name: cleanName,
        date_start: new Date(s.date_start),
      });
    }
  }
  return result.sort((a, b) => a.date_start.getTime() - b.date_start.getTime());
}

export default function Sidebar({
  selectedYear,
  onYearChange,
  selectedMeetingKey,
  onMeetingChange,
  selectedSessionKey,
  onSessionChange,
  sessions,
  drivers,
  selectedDrivers,
  onDriverToggle,
  geminiApiKey,
  onGeminiKeyChange,
  isDemoMode,
  isLoading,
}: SidebarProps) {
  const [showKey, setShowKey] = useState(false);

  const meetings = useMemo(() => buildUniqueMeetings(sessions), [sessions]);

  const filteredSessions = useMemo(
    () => sessions.filter(s => s.meeting_key === selectedMeetingKey),
    [sessions, selectedMeetingKey]
  );

  const selectClass =
    'w-full bg-slate-800/60 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors';

  return (
    <aside className="flex flex-col gap-5 min-h-0">
      {/* API Status Badge */}
      <div
        className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border w-fit ${
          isDemoMode
            ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300'
            : 'border-green-500/40 bg-green-500/10 text-green-300'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`} />
        {isDemoMode ? 'DEMO MODE' : 'LIVE API'}
      </div>

      {/* ── Session Selectors ── */}
      <section>
        <SectionTitle>SESSION</SectionTitle>
        <div className="flex flex-col gap-2.5">
          {/* Year */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">YEAR</label>
            <select
              value={selectedYear}
              onChange={e => onYearChange(e.target.value)}
              className={selectClass}
            >
              {AVAILABLE_YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Grand Prix */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">GRAND PRIX</label>
            <select
              value={selectedMeetingKey ?? ''}
              onChange={e => onMeetingChange(Number(e.target.value))}
              className={selectClass}
              disabled={isLoading || meetings.length === 0}
            >
              {meetings.length === 0 && (
                <option value="">読み込み中...</option>
              )}
              {meetings.map(m => (
                <option key={m.meeting_key} value={m.meeting_key}>
                  {m.meeting_name}
                </option>
              ))}
            </select>
          </div>

          {/* Session */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">SESSION</label>
            <select
              value={selectedSessionKey ?? ''}
              onChange={e => onSessionChange(Number(e.target.value))}
              className={selectClass}
              disabled={isLoading || filteredSessions.length === 0}
            >
              {filteredSessions.length === 0 && (
                <option value="">GPを選択してください</option>
              )}
              {filteredSessions.map(s => (
                <option key={s.session_key} value={s.session_key}>
                  {s.session_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Driver Grid ── */}
      <section className="flex-1 min-h-0">
        <SectionTitle>
          DRIVERS
          <span className="ml-2 text-slate-500 font-normal text-xs">
            {selectedDrivers.length}/3
          </span>
        </SectionTitle>

        {drivers.length === 0 ? (
          <div className="text-slate-500 text-xs text-center py-6">
            セッションを選択してください
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1.5 overflow-y-auto max-h-72 pr-0.5">
            {drivers.map(driver => {
              const num = driver.driver_number.toString();
              const isChecked = selectedDrivers.includes(num);
              const isDisabled = !isChecked && selectedDrivers.length >= 3;
              const color = formatColor(driver.team_colour);

              return (
                <button
                  key={driver.driver_number}
                  onClick={() => !isDisabled && onDriverToggle(num, !isChecked)}
                  disabled={isDisabled}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all text-sm ${
                    isChecked
                      ? 'border-transparent bg-slate-700/60'
                      : isDisabled
                      ? 'border-white/5 bg-slate-900/30 opacity-40 cursor-not-allowed'
                      : 'border-white/10 bg-slate-800/40 hover:bg-slate-700/40 hover:border-white/20'
                  }`}
                  style={isChecked ? { borderColor: `${color}50`, boxShadow: `0 0 0 1px ${color}30` } : {}}
                >
                  {/* Team colour indicator */}
                  <span
                    className="w-1 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    readOnly
                    checked={isChecked}
                    className="w-3.5 h-3.5 accent-blue-500 flex-shrink-0"
                  />
                  {/* Driver info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-racing text-xs font-bold text-white">
                        {driver.name_acronym}
                      </span>
                      <span className="text-slate-500 text-xs">#{driver.driver_number}</span>
                    </div>
                    <div className="text-slate-400 text-xs truncate">
                      {driver.team_name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Gemini API Key ── */}
      <section>
        <SectionTitle>AI SETTINGS</SectionTitle>
        <label className="text-xs text-slate-500 mb-1.5 block">GEMINI API KEY</label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={geminiApiKey}
            onChange={e => onGeminiKeyChange(e.target.value)}
            placeholder="AIza..."
            className="w-full bg-slate-800/60 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2 pr-9 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 font-mono"
          />
          <button
            type="button"
            onClick={() => setShowKey(v => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
          >
            {showKey ? '🙈' : '👁'}
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          チーム無線の文字起こしに使用（未入力でも動作可）
        </p>
      </section>
    </aside>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 mb-3 uppercase">
      {children}
    </h3>
  );
}
