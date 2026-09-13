'use client';

/**
 * components/quiz/F1QuizModal.tsx
 * Interactive F1 Quiz & Trivia Challenge Modal (Quiz 2.0).
 * Features:
 * - 120 Curated Questions across 4 Categories & 4 Difficulty Levels (including Master/神域級).
 * - Multi-format questions: Standard, Scenarios, FIA Rule Dilemmas, Track Corner Recognition, Telemetry Tactics.
 * - Game Modes:
 *     1) 🎯 通常検定モード (じっくり考察 & 詳細解説)
 *     2) ⚡ 10秒スプリント・タイムアタック (1問10秒制限の電光石火モード)
 * - Animated 10s Countdown Bar with Dynamic Color Warnings.
 * - Live Instant Feedback with In-depth Explanations and F1大百科 Deep-links.
 * - Dynamic Certification Ranks (Rookie -> Chief Engineer / FIA Steward).
 * - Enhanced X (Twitter) Score Sharing with Mode, Category, Difficulty, Score & Sprint Title.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  QUIZ_QUESTIONS,
  QUIZ_DIFFICULTY_CONFIG,
  QUIZ_CATEGORY_CONFIG,
  QUIZ_FORMAT_CONFIG,
  type QuizDifficulty,
  type QuizCategory,
  type QuestionFormat,
  type QuizQuestion,
} from '@/data/f1QuizData';
// Real FOM Broadcast Audio: using HTML5 Audio element directly

interface F1QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export type QuizGameMode = 'standard' | 'sprint';
type QuizPhase = 'intro' | 'question' | 'result';
type FilterDifficulty = 'all' | QuizDifficulty;
type FilterCategory = 'all' | QuizCategory;
type FilterFormat = 'all' | 'audio_radio' | 'circuit_shape' | 'driver_visual' | 'rule_dilemma' | 'standard';

export default function F1QuizModal({
  isOpen,
  onClose,
  onNavigateToTab,
}: F1QuizModalProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [gameMode, setGameMode] = useState<QuizGameMode>('standard');
  const [selectedFormat, setSelectedFormat] = useState<FilterFormat>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<FilterDifficulty>('all');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);

  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Audio Radio playback state & ref (100% Genuine FOM Archive Recordings)
  const radioAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);

  const stopRadioAudio = React.useCallback(() => {
    if (radioAudioRef.current) {
      radioAudioRef.current.pause();
      radioAudioRef.current.currentTime = 0;
      radioAudioRef.current = null;
    }
    setIsPlayingRadio(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        stopRadioAudio();
        setIsPlayingRadio(false);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Stop radio on unmount
  useEffect(() => {
    return () => {
      stopRadioAudio();
      setIsPlayingRadio(false);
    };
  }, []);

  // Compute matching questions count for current filters
  const matchingPool = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => {
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchFormat =
        selectedFormat === 'all'
          ? true
          : selectedFormat === 'standard'
          ? ['standard', 'scenario', 'track_corner', 'telemetry_tactics'].includes(q.format)
          : q.format === selectedFormat;
      return matchDiff && matchCat && matchFormat;
    });
  }, [selectedDifficulty, selectedCategory, selectedFormat]);

  // Start a new quiz session
  const startQuiz = () => {
    stopRadioAudio();
    setIsPlayingRadio(false);

    const pool = [...matchingPool];
    const count = Math.min(questionCount, pool.length);
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, count);

    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsTimeout(false);
    setTimeLeft(10);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setPhase('question');
  };

  const currentQ = activeQuestions[currentIndex];

  // Stop audio on question change
  useEffect(() => {
    stopRadioAudio();
    setIsPlayingRadio(false);
  }, [currentIndex, phase]);

  // 10s Countdown timer for Sprint mode
  useEffect(() => {
    if (phase !== 'question' || isAnswered || gameMode !== 'sprint') return;

    setTimeLeft(10);
    setIsTimeout(false);
    const startTime = Date.now();
    const durationMs = 10000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setTimeLeft(remaining);

      if (elapsed >= durationMs) {
        clearInterval(timer);
        stopRadioAudio();
        setIsPlayingRadio(false);
        setIsTimeout(true);
        setIsAnswered(true);
        setSelectedOption(-1);
        setStreak(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [phase, currentIndex, isAnswered, gameMode]);

  const handleOptionClick = (index: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setIsTimeout(false);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    stopRadioAudio();
    setIsPlayingRadio(false);

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsTimeout(false);
      setTimeLeft(10);
    } else {
      setPhase('result');
    }
  };

  // Toggle Genuine Radio Audio Playback (FOM official recording)
  const handleToggleRadio = () => {
    if (isPlayingRadio) {
      stopRadioAudio();
      return;
    }

    if (!currentQ?.audioSnippet?.audioUrl) return;

    if (radioAudioRef.current) {
      radioAudioRef.current.pause();
      radioAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(currentQ.audioSnippet.audioUrl);
    radioAudioRef.current = audio;

    audio.onplay = () => setIsPlayingRadio(true);
    audio.onended = () => {
      setIsPlayingRadio(false);
      radioAudioRef.current = null;
    };
    audio.onerror = (e) => {
      console.warn('Official Radio audio playback error:', e);
      setIsPlayingRadio(false);
      radioAudioRef.current = null;
    };

    audio.play().catch((err) => {
      console.warn('Audio play prevented by browser policy:', err);
      setIsPlayingRadio(false);
    });
  };

  // Rank title computation
  const rankInfo = useMemo(() => {
    const total = activeQuestions.length || 1;
    const percentage = Math.round((score / total) * 100);
    const isSprint = gameMode === 'sprint';

    if (selectedDifficulty === 'master' && percentage === 100) {
      return {
        title: isSprint
          ? '⚡ 神域のスプリント・マスター (Supreme Sprint Steward)'
          : '🟣 神域のFIAスチュワード / 伝説のチーフエンジニア',
        subtitle: isSprint ? 'F1ドライバー以上の反射神経と神域の知識' : 'Supreme FIA Steward & Chief Engineer',
        color: 'text-rose-400',
        bg: 'from-rose-500/25 via-purple-600/20 to-transparent border-rose-500/40',
        badge: isSprint ? '神速神域 (Rank SSS+)' : '神域到達 (Rank SSS)',
        comment: isSprint
          ? '驚愕の神業！10秒の過酷な制限時間の中で神域級クイズを全問完全正解！F1ドライバーを凌駕する反射速度と頭脳です！'
          : '信じられない快挙！FIA国際審判団のスチュワード判定、極限の熱力学、そして神懸かりのピット戦略を100%完璧に見抜きました。あなたは世界最高峰のF1頭脳です！',
      };
    }
    if ((selectedDifficulty === 'master' && percentage >= 80) || (selectedDifficulty === 'expert' && percentage === 100)) {
      return {
        title: isSprint ? '⚡ 電光石火のチーフストラテジスト' : '🏆 チーフストラテジスト (Chief Strategist)',
        subtitle: isSprint ? 'Lightning Race Strategist' : 'Head of F1 Race Strategy',
        color: 'text-amber-300',
        bg: 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/40',
        badge: isSprint ? '超速頭脳 (Rank SS)' : '超一流 (Rank SS)',
        comment: isSprint
          ? '電光石火の判断力！緊迫したセーフティカー導入時のピット判断をわずか数秒で下せるトップストラテジストの器です！'
          : '驚異的な知識量と戦術眼！ピットウォールでトップチームのチーフストラテジストとして即座にサインを出せるレベルです。',
      };
    }
    if (percentage >= 80) {
      return {
        title: isSprint ? '⚡ スプリント・エキスパート' : '🏁 パドックVIPアナリスト (Paddock VIP Analyst)',
        subtitle: isSprint ? 'Sprint Speed Master' : 'Senior Paddock Analyst',
        color: 'text-sky-300',
        bg: 'from-sky-500/20 via-blue-500/10 to-transparent border-sky-500/40',
        badge: '上級ファン (Rank S)',
        comment: '素晴らしい正解率！F1のレギュレーションや戦術の機微、サーキット攻略のポイントを深く知り尽くしています。',
      };
    }
    if (percentage >= 60) {
      return {
        title: '🏎️ 熱心なピットクルー (Passionate Crew)',
        subtitle: 'Dedicated Pit Crew Member',
        color: 'text-emerald-300',
        bg: 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/40',
        badge: '中級ファン (Rank A)',
        comment: '見事な好成績！レース観戦がさらに面白くなる知識がしっかり身についています。次戦の観戦が一段と楽しめます！',
      };
    }
    if (percentage >= 40) {
      return {
        title: '🧭 アカデミードライバー (Academy Driver)',
        subtitle: 'Junior Academy Driver',
        color: 'text-purple-300',
        bg: 'from-purple-500/20 via-indigo-500/10 to-transparent border-purple-500/40',
        badge: '初級卒業 (Rank B)',
        comment: '健闘しました！基礎知識はバッチリです。F1大百科で復習して上級や神域級へのステップアップを目指しましょう！',
      };
    }
    return {
      title: '🔰 ルーキードライバー (Rookie Driver)',
      subtitle: 'F1 Beginner Driver',
      color: 'text-slate-300',
      bg: 'from-slate-500/20 via-slate-700/10 to-transparent border-white/10',
      badge: '勉強中 (Rank C)',
      comment: 'ナイスチャレンジ！F1大百科や用語辞典を読み込めば、すぐに知識がグングン伸びます。再挑戦をお待ちしています！',
    };
  }, [score, activeQuestions.length, selectedDifficulty, gameMode]);

  // X (Twitter) Share intent
  const handleShareTwitter = () => {
    const total = activeQuestions.length || 1;
    const pct = Math.round((score / total) * 100);

    const fmtText = QUIZ_FORMAT_CONFIG[selectedFormat]?.label || '全形式';

    const diffText =
      selectedDifficulty === 'all'
        ? '全難易度ミックス'
        : QUIZ_DIFFICULTY_CONFIG[selectedDifficulty].label.split(' ')[1];

    const catText =
      selectedCategory === 'all'
        ? '全ジャンル総合'
        : QUIZ_CATEGORY_CONFIG[selectedCategory].label.split(' ')[1];

    const modeText = gameMode === 'sprint' ? '⚡10秒スプリント' : '🎯通常検定';

    const tweetBody =
      '【F1クイズ＆トリビア検定 (' + modeText + ')】\\n' +
      '出題形式: ' + fmtText + ' | 難易度: ' + diffText + '\\n' +
      'ジャンル: ' + catText + '\\n' +
      '成績: ' + score + ' / ' + total + '問 正解 (' + pct + '点) 🔥最大' + maxStreak + '連問正解\\n' +
      '私のF1認定称号は「' + rankInfo.title.split(' (')[0] + '」でした！🏎️💨\\n\\n' +
      '#PADOROKU #F1 #F1JP #F1クイズ #F1スプリント';

    const text = encodeURIComponent(tweetBody);
    const url = encodeURIComponent(window.location.origin);
    window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank');
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card bg-slate-950/95 border border-amber-500/30 w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-racing font-bold text-white leading-tight">
                  F1クイズ ＆ トリビア検定 (QUIZ 3.0)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                  多形式 {QUIZ_QUESTIONS.length}問収録
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                音声無線・コース形状・ドライバー肖像・FIA公式裁定事件の対話型検定
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopRadioAudio();
              setIsPlayingRadio(false);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            title="閉じる (Esc)"
          >
            ✕
          </button>
        </div>

        {/* ── PHASE 1: INTRO / FILTER & START SCREEN ── */}
        {phase === 'intro' && (
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
            {/* Step 0: Game Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🎮</span>
                <span>挑戦モードを選択</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => setGameMode('standard')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    gameMode === 'standard'
                      ? 'bg-amber-500/15 border-amber-400 text-white shadow-md ring-1 ring-amber-400/40'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-white/5 text-slate-400'
                  }`}
                >
                  <span className="text-2xl mt-0.5">🎯</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-racing font-bold text-white">通常検定モード</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        時間無制限
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      制限時間なし。音声や図解をじっくり吟味し、問題ごとの公式出典や詳細解説を深く学べます。
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setGameMode('sprint')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                    gameMode === 'sprint'
                      ? 'bg-gradient-to-br from-rose-500/20 via-orange-500/15 to-transparent border-orange-400 text-white shadow-md ring-1 ring-orange-400/50'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-white/5 text-slate-400'
                  }`}
                >
                  <span className="text-2xl mt-0.5 animate-pulse">⚡</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-racing font-bold text-orange-300">
                        10秒スプリント・アタック
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                        1問10秒
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      1問わずか10秒の制限時間！F1ドライバー並みの瞬発力と瞬時の決断力を試す電光石火モード。
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 1: Format Selector (NEW in Quiz 3.0) */}
            <div className="space-y-2">
              <label className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>🎨</span>
                  <span>1. 出題形式 (フォーマット) を選択</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono">音声・形状・顔写真・裁定事件</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(QUIZ_FORMAT_CONFIG) as FilterFormat[]).map((fmtKey) => {
                  const cfg = QUIZ_FORMAT_CONFIG[fmtKey];
                  const count =
                    fmtKey === 'all'
                      ? QUIZ_QUESTIONS.length
                      : QUIZ_QUESTIONS.filter((q) =>
                          fmtKey === 'standard'
                            ? ['standard', 'scenario', 'track_corner', 'telemetry_tactics'].includes(q.format)
                            : q.format === fmtKey
                        ).length;
                  const isSel = selectedFormat === fmtKey;

                  return (
                    <button
                      key={fmtKey}
                      onClick={() => setSelectedFormat(fmtKey)}
                      className={`p-2.5 rounded-xl border text-xs font-racing font-bold text-left transition-all cursor-pointer ${
                        isSel
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                          : 'bg-slate-900/60 hover:bg-slate-800 border-white/5 text-slate-400'
                      }`}
                    >
                      <div className="text-xs flex items-center gap-1.5 truncate">
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{count}問収録</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>📚</span>
                <span>2. 出題ジャンルを選択</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`p-2.5 rounded-xl border text-xs font-racing font-bold text-left transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-slate-900/60 hover:bg-slate-800 border-white/5 text-slate-400'
                  }`}
                >
                  <div className="text-sm">🌐 全ジャンル総合</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">すべてから出題</div>
                </button>

                {(Object.keys(QUIZ_CATEGORY_CONFIG) as QuizCategory[]).map((cat) => {
                  const cfg = QUIZ_CATEGORY_CONFIG[cat];
                  const count = QUIZ_QUESTIONS.filter((q) => q.category === cat).length;
                  const isSel = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-2.5 rounded-xl border text-xs font-racing font-bold text-left transition-all cursor-pointer ${
                        isSel
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                          : 'bg-slate-900/60 hover:bg-slate-800 border-white/5 text-slate-400'
                      }`}
                    >
                      <div className="text-xs truncate">{cfg.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{count}問収録</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Difficulty Level */}
            <div className="space-y-2">
              <label className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🎯</span>
                <span>3. 難易度を選択</span>
              </label>
              <div className="space-y-2">
                {/* All difficulty button */}
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedDifficulty === 'all'
                      ? 'bg-amber-500/15 border-amber-400/60 text-white shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <div className="text-sm font-racing font-bold">全難易度ミックス (初級〜神域級)</div>
                      <div className="text-xs text-slate-400 mt-0.5">バランスよく総合的な知識力をテスト</div>
                    </div>
                  </div>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                    selectedDifficulty === 'all' ? 'border-amber-400 bg-amber-400 text-black' : 'border-slate-600'
                  }`}>
                    {selectedDifficulty === 'all' && '✓'}
                  </span>
                </button>

                {(Object.keys(QUIZ_DIFFICULTY_CONFIG) as QuizDifficulty[]).map((diff) => {
                  const cfg = QUIZ_DIFFICULTY_CONFIG[diff];
                  const count = QUIZ_QUESTIONS.filter((q) => q.difficulty === diff).length;
                  const isSel = selectedDifficulty === diff;

                  return (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSel
                          ? 'bg-amber-500/15 border-amber-400/60 text-white shadow-md'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cfg.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-racing font-bold">{cfg.label}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                              {count}問
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{cfg.description}</div>
                        </div>
                      </div>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        isSel ? 'border-amber-400 bg-amber-400 text-black' : 'border-slate-600'
                      }`}>
                        {isSel && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Question Count Selector */}
            <div className="space-y-2">
              <label className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🔢</span>
                <span>4. 出題数を選択</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      questionCount === num
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md font-bold'
                        : 'bg-slate-900/60 hover:bg-slate-800 border-white/5 text-slate-400 font-medium'
                    }`}
                  >
                    <span className="text-sm font-racing">{num} 問</span>
                    <span className="block text-[10px] text-slate-400">
                      {num === 5 ? 'サクッと挑戦' : num === 10 ? '標準検定' : '本格チャレンジ'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={startQuiz}
                disabled={matchingPool.length === 0}
                className={`w-full py-4 rounded-2xl text-black font-racing font-extrabold text-base shadow-lg transition-all transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  gameMode === 'sprint'
                    ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-orange-500/30'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/25'
                }`}
              >
                <span>{gameMode === 'sprint' ? '⚡ 10秒スプリントスタート' : '🚀 検定スタート'}</span>
                <span className="text-xs opacity-80 font-normal">
                  (該当{matchingPool.length}問から{Math.min(questionCount, matchingPool.length)}問を出題)
                </span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE 2: IN-GAME QUESTION ── */}
        {phase === 'question' && currentQ && (
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Progress & Badges Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    QUESTION {currentIndex + 1} / {activeQuestions.length}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-white/5">
                    {currentQ.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-sky-950/60 text-sky-300 border border-sky-500/20">
                    {currentQ.formatLabel}
                  </span>
                  {gameMode === 'sprint' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold flex items-center gap-1">
                      <span>⚡</span>
                      <span>10秒スプリント</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-white/5">
                    {currentQ.difficulty === 'beginner' && '🔰 初級'}
                    {currentQ.difficulty === 'intermediate' && '🧭 中級'}
                    {currentQ.difficulty === 'expert' && '🔬 上級'}
                    {currentQ.difficulty === 'master' && '🟣 神域級'}
                  </span>
                  {streak >= 2 && (
                    <span className="text-xs font-racing font-bold text-orange-400 bg-orange-500/20 border border-orange-500/30 px-2.5 py-0.5 rounded-full animate-bounce">
                      🔥 {streak}連勝中!
                    </span>
                  )}
                </div>
              </div>

              {/* Sprint 10s Countdown Bar (Only active in Sprint mode) */}
              {gameMode === 'sprint' && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-900/80 border border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className={timeLeft <= 3 && !isAnswered ? 'animate-spin' : ''}>⏱️</span>
                      <span>残り思考時間</span>
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-racing text-xs font-bold transition-all ${
                        isAnswered
                          ? 'bg-slate-800 text-slate-400'
                          : timeLeft <= 3
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                          : timeLeft <= 5
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isAnswered ? '回答済' : `${timeLeft} 秒`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full transition-all duration-150 rounded-full ${
                        isAnswered
                          ? 'bg-slate-700'
                          : timeLeft <= 3
                          ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-400 animate-pulse'
                          : timeLeft <= 5
                          ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                          : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
                      }`}
                      style={{ width: isAnswered ? '100%' : `${(timeLeft / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* ── MULTI-FORMAT MEDIA RENDERING ── */}

              {/* Format 1: 🎙️ Team Radio Blind Test (100% Genuine FOM Audio) */}
              {currentQ.format === 'audio_radio' && currentQ.audioSnippet && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 shadow-xl space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎙️</span>
                      <div>
                        <span className="text-xs font-racing font-bold text-emerald-400 uppercase tracking-wider block">
                          公式FOM コックピット無線実音源アーカイブ
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          F1 Official Team Radio Archive Recording
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold">100% 公式実音源</span>
                    </span>
                  </div>

                  {/* Audio Play Button & Real Sound Equalizer */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950/90 p-3.5 rounded-xl border border-white/10 shadow-inner">
                    <button
                      type="button"
                      onClick={handleToggleRadio}
                      className={`w-full sm:w-auto px-5 py-3 rounded-xl font-racing font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                        isPlayingRadio
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse ring-2 ring-rose-400/50'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white ring-1 ring-emerald-400/40 shadow-emerald-500/20'
                      }`}
                    >
                      <span className="text-sm">{isPlayingRadio ? '⏹' : '▶'}</span>
                      <span>{isPlayingRadio ? '音声を停止' : '公式実音源を再生 (実況録音)'}</span>
                    </button>

                    {/* Live Equalizer Wave Animation */}
                    <div className="flex items-center gap-1 h-6 px-3 bg-slate-900/80 rounded-lg py-1 border border-white/5">
                      {[35, 80, 50, 95, 70, 100, 60, 85, 45, 90, 65, 85].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-150 ${
                            isPlayingRadio ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700 h-1.5'
                          }`}
                          style={{ height: isPlayingRadio ? `${h}%` : '20%' }}
                        />
                      ))}
                    </div>

                    <div className="text-[11px] font-mono text-center sm:text-left flex-1">
                      {isPlayingRadio ? (
                        <span className="text-emerald-300 font-bold flex items-center justify-center sm:justify-start gap-1.5 animate-pulse">
                          <span>🔊</span>
                          <span>公式中継アーカイブ実音声を再生中...</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          再生ボタンを押して、ピット交信の実音源をお聞きください
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Transcript quote & translation */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <span>📻</span>
                        <span>交信テキスト (RADIO TRANSCRIPT):</span>
                      </span>
                      {currentQ.audioSnippet.gpName && (
                        <span className="text-[10px] text-amber-400/90 font-sans">
                          📍 {currentQ.audioSnippet.gpName} ({currentQ.audioSnippet.year}年)
                        </span>
                      )}
                    </div>
                    {!isAnswered ? (
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-dashed border-white/15 text-center sm:text-left space-y-1">
                        <p className="text-slate-400 italic tracking-widest text-xs font-sans">
                          「 ？？？？？？？？？？？？？？？？？？？？ 」
                        </p>
                        <p className="text-[11px] text-emerald-400/90 font-sans not-italic font-medium">
                          💡 まずは音声を聴いて選択肢から回答してください。回答後に英語テキストと日本語対訳がアンロックされます！
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/30">
                        <p className="text-emerald-300 font-semibold leading-relaxed text-sm">
                          “{currentQ.audioSnippet.radioQuote}”
                        </p>
                        {currentQ.audioSnippet.transcriptJa && (
                          <div className="text-slate-200 text-xs font-sans leading-relaxed border-t border-white/10 pt-2">
                            <span className="text-amber-400 font-bold mr-1.5">🇯🇵 日本語対訳:</span>
                            <span>{currentQ.audioSnippet.transcriptJa}</span>
                          </div>
                        )}
                        {currentQ.audioSnippet.speakerName && (
                          <div className="text-slate-400 text-[11px] font-sans flex flex-wrap items-center justify-between pt-1.5 border-t border-white/10 gap-2">
                            <span>発言者: <strong className="text-white font-medium">{currentQ.audioSnippet.speakerName}</strong></span>
                            <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">
                              出典: FOD / フジテレビNEXT 中継 & FOM公式アーカイブ
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Format 2: 🏁 Circuit Shape Silhouette */}
              {currentQ.format === 'circuit_shape' && currentQ.circuitVisual && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-black to-slate-900 border border-red-500/30 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <span className="text-xs font-racing font-bold text-red-400 flex items-center gap-1.5">
                      <span>🏁</span>
                      <span>コース・レイアウトシルエット</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      CIRCUIT MAP
                    </span>
                  </div>

                  <div className="relative p-2 flex items-center justify-center w-full min-h-[160px]">
                    <img
                      src={currentQ.circuitVisual.svgMapUrl}
                      alt="Circuit Layout Map"
                      className="max-h-44 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all transform hover:scale-105"
                    />
                  </div>

                  {isAnswered && currentQ.circuitVisual.circuitNameJa && (
                    <div className="mt-2 text-center animate-fade-in">
                      <span className="text-xs font-racing font-bold text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-500/30">
                        正解コース: {currentQ.circuitVisual.circuitNameJa}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Format 3: 👤 Driver Visual Portrait */}
              {currentQ.format === 'driver_visual' && currentQ.driverVisual && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 shadow-lg flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={currentQ.driverVisual.imagePath}
                    alt="Driver Portrait"
                    className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border-2 border-amber-400/40 shadow-xl flex-shrink-0"
                  />
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                      👤 ドライバー肖像クイズ
                    </span>
                    <h4 className="text-sm font-racing font-bold text-white mt-1">
                      {isAnswered ? currentQ.driverVisual.driverNameJa : 'このドライバーは誰？'}
                    </h4>
                    {currentQ.driverVisual.teamName && isAnswered && (
                      <p className="text-xs text-slate-300 font-mono">
                        所属: {currentQ.driverVisual.teamName}
                      </p>
                    )}
                    <p className="text-xs text-slate-400">
                      写真の人物に該当するドライバーを選択肢から選んでください
                    </p>
                  </div>
                </div>
              )}

              {/* Format 4: ⚖️ FIA Rule Dilemma Incident */}
              {currentQ.format === 'rule_dilemma' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/30 flex items-center gap-3">
                  <span className="text-2xl">⚖️</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-racing font-bold text-purple-300">
                        FIA公式審議・インシデント判定
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                        FIA REGULATION
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      実際の歴史的事件とFIA国際競技規則条項に基づく正確な裁定判断が問われます。
                    </p>
                  </div>
                </div>
              )}

              {/* Question Box */}
              <div className="bg-slate-900/70 p-4 rounded-2xl border border-white/10 shadow-inner">
                <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Timeout Warning banner if timed out */}
              {isTimeout && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <span className="text-base">⏰</span>
                  <div>
                    <span className="font-racing">タイムアップ！</span>
                    <span className="font-normal text-rose-200 ml-1">
                      10秒以内に回答がありませんでした（不正解扱い）。瞬時の決断力が求められます！
                    </span>
                  </div>
                </div>
              )}

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-200';

                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50 shadow-lg';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-600/30 border-rose-400 text-rose-200 shadow-md';
                    } else {
                      btnStyle = 'bg-slate-900/40 border-white/5 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={isAnswered}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-racing font-bold text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xs font-mono shrink-0">
                          {['A', 'B', 'C', 'D'][idx]}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <span className="text-emerald-400 text-base font-bold">✓</span>
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <span className="text-rose-400 text-base font-bold">✕</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box (Revealed upon answer or timeout) */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/10 space-y-2.5 animate-fade-in shadow-inner">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {isTimeout ? '⏰ タイムアップ！' : selectedOption === currentQ.correctIndex ? '🎉 正解！' : '😢 残念...'}
                      </span>
                      <span className="text-xs font-racing font-bold text-slate-300">
                        {isTimeout
                          ? '一瞬の迷いが命取り！正解はこちらです'
                          : selectedOption === currentQ.correctIndex
                          ? '素晴らしい戦術眼です！'
                          : '正解はこちらです'}
                      </span>
                    </div>

                    {currentQ.linkSubTab && onNavigateToTab && (
                      <button
                        onClick={() => {
                          stopRadioAudio();
                          setIsPlayingRadio(false);
                          onClose();
                          onNavigateToTab(currentQ.linkSubTab!);
                        }}
                        className="text-[11px] font-racing text-sky-400 hover:text-sky-300 underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>大百科で詳しく見る</span>
                        <span>➔</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {currentQ.explanation}
                  </p>

                  {/* 📚 Source Attribution Banner */}
                  {currentQ.sourceAttribution && (
                    <div className="p-2.5 rounded-xl bg-slate-950/90 border border-amber-500/30 flex items-start gap-2.5 text-left">
                      <span className="text-base shrink-0 mt-0.5">📚</span>
                      <div className="text-[11px] leading-relaxed">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-racing font-bold text-amber-300">公式根拠・出典:</span>
                          <span className="font-mono text-slate-200">{currentQ.sourceAttribution.title}</span>
                        </div>
                        {currentQ.sourceAttribution.archiveNote && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            記録アーカイブ: {currentQ.sourceAttribution.archiveNote}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentQ.funFact && (
                    <p className="text-[11px] text-amber-300/90 font-mono bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      💡 豆知識・観戦ポイント: {currentQ.funFact}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Navigation Row */}
            {isAnswered && (
              <div className="pt-3 border-t border-white/10 flex items-center justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-racing font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{currentIndex < activeQuestions.length - 1 ? '次の問題へ' : '結果を見る'}</span>
                  <span>➔</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE 3: RESULT SCREEN ── */}
        {phase === 'result' && (
          <div className="p-6 sm:p-8 space-y-6 text-center overflow-y-auto">
            {/* Rank Card */}
            <div className={`p-6 rounded-3xl bg-gradient-to-b ${rankInfo.bg} border space-y-3 shadow-xl`}>
              <span className="text-5xl block animate-bounce">
                {score === activeQuestions.length
                  ? '👑'
                  : score >= activeQuestions.length * 0.8
                  ? '🏆'
                  : score >= activeQuestions.length * 0.6
                  ? '🥈'
                  : '🏎️'}
              </span>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    あなたのF1知識力認定称号 ({rankInfo.badge})
                  </span>
                  {gameMode === 'sprint' && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold">
                      ⚡ 10秒スプリント完走
                    </span>
                  )}
                </div>
                <h3 className={`text-lg sm:text-2xl font-racing font-black ${rankInfo.color}`}>
                  {rankInfo.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">{rankInfo.subtitle}</p>
              </div>

              {/* Score Display */}
              <div className="inline-flex items-center justify-center gap-3 bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-white/10 font-mono">
                <span className="text-xs text-slate-400">正解数:</span>
                <strong className="text-2xl text-white font-racing">{score}</strong>
                <span className="text-xs text-slate-400">
                  / {activeQuestions.length} 問 ({Math.round((score / activeQuestions.length) * 100)}点)
                </span>
                {maxStreak >= 2 && (
                  <span className="text-xs text-amber-400 font-racing border-l border-white/10 pl-3">
                    🔥 最大{maxStreak}連続正解
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {rankInfo.comment}
              </p>
            </div>

            {/* Action Buttons: Retry, Change Filters, Share X */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startQuiz}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🔄</span>
                <span>同じ条件で再挑戦</span>
              </button>

              <button
                onClick={() => setPhase('intro')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-racing font-bold text-xs border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚙️ モード・ジャンル変更</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black hover:bg-slate-900 text-white font-racing font-bold text-xs border border-white/20 shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="text-sm">𝕏</span>
                <span>結果をポストする</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
