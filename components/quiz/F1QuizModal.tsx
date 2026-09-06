'use client';

/**
 * components/quiz/F1QuizModal.tsx
 * Interactive F1 Quiz & Trivia Challenge Modal (Quiz 2.0).
 * Features:
 * - 120 Curated Questions across 4 Categories & 4 Difficulty Levels (including Master/神域級).
 * - Multi-format questions: Standard, Scenarios, FIA Rule Dilemmas, Track Corner Recognition, Telemetry Tactics.
 * - Customizable Question Count (5 / 10 / 20 questions).
 * - Live Instant Feedback with In-depth Explanations and F1大百科 Deep-links.
 * - Dynamic Certification Ranks (Rookie -> Chief Engineer / FIA Steward).
 * - Enhanced X (Twitter) Score Sharing with Category, Difficulty, Score & Title.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  QUIZ_QUESTIONS,
  QUIZ_DIFFICULTY_CONFIG,
  QUIZ_CATEGORY_CONFIG,
  type QuizDifficulty,
  type QuizCategory,
  type QuizQuestion,
} from '@/data/f1QuizData';

interface F1QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

type QuizPhase = 'intro' | 'question' | 'result';
type FilterDifficulty = 'all' | QuizDifficulty;
type FilterCategory = 'all' | QuizCategory;

export default function F1QuizModal({
  isOpen,
  onClose,
  onNavigateToTab,
}: F1QuizModalProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [selectedDifficulty, setSelectedDifficulty] = useState<FilterDifficulty>('all');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);

  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Compute matching questions count for current filters
  const matchingPool = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => {
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
      return matchDiff && matchCat;
    });
  }, [selectedDifficulty, selectedCategory]);

  // Start a new quiz session
  const startQuiz = () => {
    const pool = [...matchingPool];
    // Shuffle pool
    const count = Math.min(questionCount, pool.length);
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, count);

    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setPhase('question');
  };

  const currentQ = activeQuestions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(index);
    setIsAnswered(true);

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
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setPhase('result');
    }
  };

  // Rank title computation
  const rankInfo = useMemo(() => {
    const total = activeQuestions.length || 1;
    const percentage = Math.round((score / total) * 100);

    if (selectedDifficulty === 'master' && percentage === 100) {
      return {
        title: '🟣 神域のFIAスチュワード / 伝説のチーフエンジニア',
        subtitle: 'Supreme FIA Steward & Chief Engineer',
        color: 'text-rose-400',
        bg: 'from-rose-500/25 via-purple-600/20 to-transparent border-rose-500/40',
        badge: '神域到達 (Rank SSS)',
        comment: '信じられない快挙！FIA国際審判団のスチュワード判定、極限の熱力学、そして神懸かりのピット戦略を100%完璧に見抜きました。あなたは世界最高峰のF1頭脳です！',
      };
    }
    if ((selectedDifficulty === 'master' && percentage >= 80) || (selectedDifficulty === 'expert' && percentage === 100)) {
      return {
        title: '🏆 チーフストラテジスト (Chief Strategist)',
        subtitle: 'Head of F1 Race Strategy',
        color: 'text-amber-300',
        bg: 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/40',
        badge: '超一流 (Rank SS)',
        comment: '驚異的な知識量と戦術眼！ピットウォールでトップチームのチーフストラテジストとして即座にサインを出せるレベルです。',
      };
    }
    if (percentage >= 80) {
      return {
        title: '🏁 パドックVIPアナリスト (Paddock VIP Analyst)',
        subtitle: 'Senior Paddock Analyst',
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
  }, [score, activeQuestions.length, selectedDifficulty]);

  // X (Twitter) Share intent
  const handleShareTwitter = () => {
    const total = activeQuestions.length || 1;
    const pct = Math.round((score / total) * 100);

    const diffText =
      selectedDifficulty === 'all'
        ? '全難易度ミックス'
        : QUIZ_DIFFICULTY_CONFIG[selectedDifficulty].label.split(' ')[1];

    const catText =
      selectedCategory === 'all'
        ? '全ジャンル総合'
        : QUIZ_CATEGORY_CONFIG[selectedCategory].label.split(' ')[1];

    const text = encodeURIComponent(
      `【F1クイズ＆トリビア検定】\n` +
      `ジャンル: ${catText} | 難易度: ${diffText}\n` +
      `成績: ${score} / ${total}問 正解 (${pct}点) 🔥最大${maxStreak}連問正解\n` +
      `私のF1認定称号は「${rankInfo.title.split(' (')[0]}」でした！🏎️💨\n\n` +
      `#PADOROKU #F1 #F1JP #F1クイズ #F1雑学`
    );
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
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
                  F1クイズ ＆ トリビア検定 (QUIZ 2.0)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                  全120問収録
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                ルール・歴史・コース攻略・戦術テレメトリーの本格対話型検定
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            title="閉じる (Esc)"
          >
            ✕
          </button>
        </div>

        {/* ── PHASE 1: INTRO / FILTER & START SCREEN ── */}
        {phase === 'intro' && (
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
            {/* Step 1: Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>📚</span>
                <span>1. 出題ジャンルを選択</span>
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

            {/* Step 2: Difficulty Level */}
            <div className="space-y-2">
              <label className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🎯</span>
                <span>2. 難易度を選択</span>
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

            {/* Step 3: Question Count Selector */}
            <div className="space-y-2">
              <label className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🔢</span>
                <span>3. 出題数を選択</span>
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
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-racing font-extrabold text-base shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🚀 検定スタート</span>
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

              {/* Question Box */}
              <div className="bg-slate-900/70 p-4 rounded-2xl border border-white/10 shadow-inner">
                <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

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

              {/* Explanation Box (Revealed upon answer) */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/10 space-y-2 animate-fade-in shadow-inner">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {selectedOption === currentQ.correctIndex ? '🎉 正解！' : '😢 残念...'}
                      </span>
                      <span className="text-xs font-racing font-bold text-slate-300">
                        {selectedOption === currentQ.correctIndex ? '素晴らしい戦術眼です！' : '正解はこちらです'}
                      </span>
                    </div>

                    {currentQ.linkSubTab && onNavigateToTab && (
                      <button
                        onClick={() => {
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
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  あなたのF1知識力認定称号 ({rankInfo.badge})
                </span>
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
                <span>⚙️ ジャンル・難易度変更</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black hover:bg-slate-900 text-white font-racing font-bold text-xs border border-sky-500/40 hover:border-sky-400 shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="X (旧Twitter) でスコアをシェア"
              >
                <span>𝕏</span>
                <span>結果をシェアする</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
