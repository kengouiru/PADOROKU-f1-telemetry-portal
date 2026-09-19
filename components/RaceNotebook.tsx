'use client';

/**
 * components/RaceNotebook.tsx
 * Personal race analysis notebook with localStorage persistence.
 *
 * Features:
 * - Add notes manually or from AI Strategist ("Add to Notebook")
 * - Delete individual notes
 * - Copy all notes as Markdown
 * - Supabase-ready: data shape uses a typed NoteEntry interface
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface NoteEntry {
  id: string;
  content: string;
  source: 'ai' | 'manual';
  timestamp: string;   // ISO 8601
  sessionTag?: string; // e.g. "2024 BHR Race"
}

const STORAGE_KEY = 'f1_race_notebook';

// ── Persistence helpers ────────────────────────────────────────────────────

function loadNotes(): NoteEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NoteEntry[]) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: NoteEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    console.warn('[RaceNotebook] localStorage write failed');
  }
}

// ── Main Component ─────────────────────────────────────────────────────────

interface RaceNotebookProps {
  /** Called externally to add an AI-generated note */
  notebookRef?: React.RefObject<RaceNotebookHandle>;
  sessionTag?: string;
}

export interface RaceNotebookHandle {
  addNote: (content: string, source: 'ai' | 'manual') => void;
}

// Expose handle via forwardRef
const RaceNotebook = React.forwardRef<RaceNotebookHandle, RaceNotebookProps>(
  function RaceNotebook({ sessionTag }, ref) {
    const [notes, setNotes] = useState<NoteEntry[]>([]);
    const [draft, setDraft] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load on mount
    useEffect(() => {
      setNotes(loadNotes());
    }, []);

    // Persist on change
    useEffect(() => {
      saveNotes(notes);
    }, [notes]);

    // Expose addNote via ref
    React.useImperativeHandle(ref, () => ({
      addNote(content: string, source: 'ai' | 'manual') {
        const entry: NoteEntry = {
          id: crypto.randomUUID(),
          content,
          source,
          timestamp: new Date().toISOString(),
          sessionTag,
        };
        setNotes(prev => [entry, ...prev]);
      },
    }));

    const addManualNote = useCallback(() => {
      if (!draft.trim()) return;
      const entry: NoteEntry = {
        id: crypto.randomUUID(),
        content: draft.trim(),
        source: 'manual',
        timestamp: new Date().toISOString(),
        sessionTag,
      };
      setNotes(prev => [entry, ...prev]);
      setDraft('');
      textareaRef.current?.focus();
    }, [draft, sessionTag]);

    const deleteNote = useCallback((id: string) => {
      setNotes(prev => prev.filter(n => n.id !== id));
    }, []);

    const copyAllMarkdown = useCallback(async () => {
      const md = notes
        .map(n => {
          const dateStr = new Date(n.timestamp).toLocaleString('ja-JP');
          const tag = n.sessionTag ? ` [${n.sessionTag}]` : '';
          const badge = n.source === 'ai' ? '🤖 AI分析' : '✏️ メモ';
          return `### ${badge}${tag}\n*${dateStr}*\n\n${n.content}`;
        })
        .join('\n\n---\n\n');
      await navigator.clipboard.writeText(md);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }, [notes]);

    return (
      <div className="flex flex-col flex-1 min-h-0 glass-card overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-steel-blue pl-2 uppercase">
              RACE NOTEBOOK
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{notes.length}件</span>
              {notes.length > 0 && (
                <button
                  onClick={copyAllMarkdown}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 px-2 py-1 rounded border border-white/10 hover:border-white/20"
                >
                  {copiedAll ? '✓ コピー済' : '📋 MD'}
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            AIの分析や自分のメモを記録できます
          </p>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 min-h-0">
          {notes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs gap-2 text-center">
              <span className="text-3xl">📓</span>
              <span>メモがまだありません<br />AIの分析やノートを追加してください</span>
            </div>
          )}

          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              isExpanded={expandedId === note.id}
              onToggleExpand={() => setExpandedId(prev => prev === note.id ? null : note.id)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>

        {/* Draft input */}
        <div className="flex-shrink-0 border-t border-white/10 p-3">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                addManualNote();
              }
            }}
            placeholder="メモを入力... (Ctrl+Enter で保存)"
            rows={3}
            className="w-full bg-slate-800/60 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/60 placeholder:text-slate-600 resize-none"
          />
          <div className="flex justify-end mt-1.5">
            <button
              onClick={addManualNote}
              disabled={!draft.trim()}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors"
            >
              ✏️ メモを保存
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default RaceNotebook;

// ── Note Card ───────────────────────────────────────────────────────────────

function NoteCard({
  note,
  isExpanded,
  onToggleExpand,
  onDelete,
}: {
  note: NoteEntry;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
}) {
  const dateStr = new Date(note.timestamp).toLocaleString('ja-JP', {
    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
  });

  const preview = note.content.slice(0, 80) + (note.content.length > 80 ? '...' : '');

  return (
    <div
      className={`rounded-lg border text-xs transition-all ${
        note.source === 'ai'
          ? 'border-blue-500/20 bg-blue-950/20'
          : 'border-white/8 bg-slate-800/40'
      }`}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 rounded-t-lg"
        onClick={onToggleExpand}
      >
        <span className="flex-shrink-0">
          {note.source === 'ai' ? '🤖' : '✏️'}
        </span>
        <span suppressHydrationWarning className="text-slate-400 flex-shrink-0">{dateStr}</span>
        {note.sessionTag && (
          <span className="text-slate-600 text-xs truncate">{note.sessionTag}</span>
        )}
        <span className="flex-1" />
        <span className="text-slate-600">{isExpanded ? '▲' : '▼'}</span>
      </div>

      {/* Content */}
      <div className="px-3 pb-2">
        {isExpanded ? (
          <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{note.content}</p>
        ) : (
          <p className="text-slate-400 leading-relaxed">{preview}</p>
        )}
      </div>

      {/* Footer actions (when expanded) */}
      {isExpanded && (
        <div className="flex items-center gap-3 px-3 pb-2 pt-1 border-t border-white/5">
          <button
            onClick={() => navigator.clipboard.writeText(note.content)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            コピー
          </button>
          <button
            onClick={onDelete}
            className="text-red-600/70 hover:text-red-400 transition-colors ml-auto"
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
}
