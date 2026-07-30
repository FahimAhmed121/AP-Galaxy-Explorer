import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  Radio,
  Cpu,
  X,
  Flame,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileText,
  Database,
  ArrowLeft
} from 'lucide-react';
import { Galaxy, QuizQuestion } from '../../core/types';
import { eventBus } from '../../core/events';
import { quizController } from '../../phaser/systems/QuizController';
import { audioEngine } from '../../engine/audioEngine';
import { useGameStore } from '../../store/useGameStore';

export const QuizAssessmentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<'INTRO' | 'QUESTION' | 'FEEDBACK' | 'RESULTS' | 'DISCOVERY_LOG'>('INTRO');
  
  const [galaxy, setGalaxy] = useState<Galaxy | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  
  // Scoring & Stats
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Settings & Language
  const { settings } = useGameStore();
  const [lang, setLang] = useState<'EN' | 'BN'>(settings.language || 'EN');
  const t = (en: string, bn: string) => (lang === 'BN' ? bn : en);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // EventBus Listeners
  useEffect(() => {
    const handleStarted = (payload: { galaxyId: string; galaxyName: string; totalQuestions: number; questions: QuizQuestion[] }) => {
      setGalaxy(quizController.getCurrentGalaxy());
      setQuestions(payload.questions);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setStep('INTRO');
      setIsOpen(true);
    };

    const handleAnswered = (payload: { isCorrect: boolean; currentScore: number; streak: number }) => {
      setScore(payload.currentScore);
      setStreak(payload.streak);
      setIsAnswered(true);
      setStep('FEEDBACK');

      if (payload.isCorrect) {
        audioEngine.playSound('powerup', settings.soundEnabled, settings.sfxVolume * 0.7);
      } else {
        audioEngine.playSound('impact', settings.soundEnabled, settings.sfxVolume * 0.5);
      }
    };

    const handleCompleted = (payload: { passed: boolean; score: number; accuracy: number; totalTimeSeconds: number }) => {
      setIsPassed(payload.passed);
      setAccuracy(payload.accuracy);
      setTotalTimeSeconds(payload.totalTimeSeconds);
      setMaxStreak(quizController.getMaxStreak());
      setStep('RESULTS');
    };

    eventBus.on('QUIZ_STARTED', handleStarted);
    eventBus.on('QUESTION_ANSWERED', handleAnswered);
    eventBus.on('QUIZ_COMPLETED', handleCompleted);

    return () => {
      eventBus.off('QUIZ_STARTED', handleStarted);
      eventBus.off('QUESTION_ANSWERED', handleAnswered);
      eventBus.off('QUIZ_COMPLETED', handleCompleted);
    };
  }, [settings.soundEnabled, settings.sfxVolume]);

  const [totalTimeSeconds, setTotalTimeSeconds] = useState<number>(0);

  // Helper actions
  const handleBeginAssessment = () => {
    quizController.beginQuestions();
    setStep('QUESTION');
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    quizController.submitAnswer(selectedOption);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    quizController.nextQuestion();
    if (quizController.getState() === 'QUESTION') {
      setCurrentIndex(quizController.getCurrentIndex());
      setStep('QUESTION');
    }
  };

  const handleRetryAssessment = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    quizController.retryQuiz();
    setCurrentIndex(0);
    setStep('QUESTION');
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setGalaxy(null);
    quizController.destroy();
  }, []);

  const handleOpenDiscoveryLog = () => {
    setStep('DISCOVERY_LOG');
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (step === 'INTRO' && e.key === 'Enter') {
        e.preventDefault();
        handleBeginAssessment();
        return;
      }

      if (step === 'QUESTION') {
        if (['1', 'a', 'A'].includes(e.key)) handleSelectOption(0);
        if (['2', 'b', 'B'].includes(e.key)) handleSelectOption(1);
        if (['3', 'c', 'C'].includes(e.key)) handleSelectOption(2);
        if (['4', 'd', 'D'].includes(e.key)) handleSelectOption(3);
        
        if (e.key === 'Enter' && selectedOption !== null) {
          e.preventDefault();
          handleSubmitAnswer();
        }
      }

      if (step === 'FEEDBACK' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNextQuestion();
      }

      if (step === 'RESULTS' && e.key === 'Enter') {
        e.preventDefault();
        if (isPassed) {
          handleOpenDiscoveryLog();
        } else {
          handleRetryAssessment();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, selectedOption, isPassed, handleClose]);

  if (!isOpen || !galaxy) return null;

  const currentQ: QuizQuestion | null = questions[currentIndex] || null;
  const totalQuestions = questions.length;
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Translation helpers
  const getQuestionText = () => {
    if (!currentQ) return '';
    if (lang === 'BN' && currentQ.banglaTranslation) return currentQ.banglaTranslation.question;
    return currentQ.question;
  };

  const getOptionText = (idx: number) => {
    if (!currentQ || !currentQ.options[idx]) return '';
    if (lang === 'BN' && currentQ.banglaTranslation && currentQ.banglaTranslation.options[idx]) {
      return currentQ.banglaTranslation.options[idx];
    }
    return currentQ.options[idx];
  };

  const getExplanationText = () => {
    if (!currentQ) return '';
    if (lang === 'BN' && currentQ.banglaTranslation) return currentQ.banglaTranslation.explanation;
    return currentQ.explanation;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-2xl select-none font-sans overflow-y-auto">
      
      {/* Outer Console Shell */}
      <div className="w-full max-w-4xl rounded-xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden relative text-slate-100 my-auto">
        
        {/* Background Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

        {/* 1. TOP CONSOLE HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-md">
              <Radio size={20} className={prefersReducedMotion ? '' : 'animate-pulse'} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  {t('NASA MISSION CONSOLE', 'নাসা মিশন কনসোল')}
                </span>
                <span className="text-xs text-slate-600">/</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">
                  {t('SCIENTIFIC ASSESSMENT', 'বৈজ্ঞানিক মূল্যায়ন')}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-serif italic font-bold text-white tracking-wide">
                {galaxy.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-950/80 rounded border border-cyan-500/30 p-0.5 font-mono text-[10px]">
              <button
                onClick={() => setLang('EN')}
                className={`px-2 py-1 rounded ${lang === 'EN' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('BN')}
                className={`px-2 py-1 rounded ${lang === 'BN' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                বাংলা
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title="Abort Assessment (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2. MAIN BODY PANEL */}
        <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">

          {/* STEP A: AURA ASSESSMENT INTRO */}
          {step === 'INTRO' && (
            <div className="space-y-6 animate-fade-in">
              {/* AURA Banner */}
              <div className="p-5 rounded-lg bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-4 relative">
                <div className="w-12 h-12 rounded-full bg-cyan-900/60 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0 shadow-lg">
                  <Cpu size={26} className={prefersReducedMotion ? '' : 'animate-pulse'} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    AURA ASSESSMENT PROTOCOL // DEBRIEFING INITIATED
                  </span>
                  <p className="text-sm md:text-base text-slate-200 italic font-sans leading-relaxed">
                    "{t(
                      `Explorer, scientific briefing on ${galaxy.name} is complete. Standard research protocol requires a knowledge verification assessment before official telemetry archiving.`,
                      `অভিযাত্রী, ${galaxy.name} সম্পর্কিত বৈজ্ঞানিক ব্রিফিং সম্পন্ন হয়েছে। অফিসিয়াল তথ্য সংরক্ষণের পূর্বে গবেষণা প্রোটোকল অনুযায়ী জ্ঞান যাচাই মূল্যায়ন প্রয়োজনীয়।`
                    )}"
                  </p>
                </div>
              </div>

              {/* Mission Assessment Metadata Card */}
              <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider">
                    {t('MISSION ASSESSMENT SPECIFICATIONS:', 'মিশন মূল্যায়ন বিবরণ:')}
                  </span>
                  <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                    {t('PASS THRESHOLD: 80%', 'উত্তীর্ণের মাত্রা: ৮০%')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-black/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">{t('QUESTIONS', 'প্রশ্ন সংখ্যা')}</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{totalQuestions} {t('Evaluations', 'টি মূল্যায়ন')}</span>
                  </div>
                  <div className="p-3 rounded bg-black/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">{t('FORMAT', 'ফরম্যাট')}</span>
                    <span className="text-sm font-bold text-cyan-300 mt-0.5 block">{t('Multiple Choice', 'বহুনির্বাচনী (MCQ)')}</span>
                  </div>
                  <div className="p-3 rounded bg-black/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">{t('NAVIGATION', 'ন্যাভিগেশন')}</span>
                    <span className="text-sm font-bold text-amber-300 mt-0.5 block">{t('Keys 1-4 / Enter', 'কিবোর্ড ১-৪ / এন্টার')}</span>
                  </div>
                </div>
              </div>

              {/* Begin Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleBeginAssessment}
                  className="px-8 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold tracking-widest uppercase flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <span>{t('BEGIN ASSESSMENT', 'মূল্যায়ন শুরু করুন')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP B & C: QUESTION VIEW & IMMEDIATE FEEDBACK */}
          {(step === 'QUESTION' || step === 'FEEDBACK') && currentQ && (
            <div className="space-y-6">
              
              {/* Progress & Live HUD Metrics Header */}
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                {/* Question counter & Tag */}
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    {t(`QUESTION ${currentIndex + 1} OF ${totalQuestions}`, `প্রশ্ন ${currentIndex + 1} / ${totalQuestions}`)}
                  </span>
                  {currentQ.tags && currentQ.tags.length > 0 && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[10px] border border-slate-800 uppercase">
                      #{currentQ.tags[0]}
                    </span>
                  )}
                  {currentQ.difficulty && (
                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border ${
                      currentQ.difficulty === 'HARD' ? 'bg-red-950/80 text-red-400 border-red-500/30' :
                      currentQ.difficulty === 'MEDIUM' ? 'bg-amber-950/80 text-amber-400 border-amber-500/30' :
                      'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {currentQ.difficulty}
                    </span>
                  )}
                </div>

                {/* Score & Streak counter */}
                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Flame size={14} className={streak > 0 && !prefersReducedMotion ? 'animate-bounce text-amber-400' : ''} />
                    <span>{streak} {t('STREAK', 'ধারাবাহিক')}</span>
                  </div>
                  <div className="text-cyan-400 font-bold">
                    <span>{t('SCORE:', 'স্কোর:')} {score}/{totalQuestions}</span>
                  </div>
                </div>
              </div>

              {/* Question Text Display */}
              <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  {t('TELEMETRY QUERY:', 'টেলিমেট্রি প্রশ্ন:')}
                </div>
                <h2 className="text-base md:text-lg font-serif italic text-white font-medium leading-relaxed">
                  {getQuestionText()}
                </h2>
              </div>

              {/* Options List (A, B, C, D) */}
              <div className="space-y-3">
                {currentQ.options.map((_, idx) => {
                  let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-cyan-500/40 hover:bg-cyan-950/20';

                  if (selectedOption === idx) {
                    btnStyle = 'border-cyan-400 bg-cyan-950/60 text-cyan-200';
                  }

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswer) {
                      btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200 font-bold';
                    } else if (selectedOption === idx) {
                      btnStyle = 'border-red-500 bg-red-950/60 text-red-200';
                    } else {
                      btnStyle = 'opacity-30 border-slate-800 bg-slate-950/40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-lg border text-xs md:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle} disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-black/80 border border-slate-700 flex items-center justify-center font-mono text-xs text-slate-400 font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{getOptionText(idx)}</span>
                      </div>

                      {isAnswered && idx === currentQ.correctAnswer && (
                        <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && selectedOption === idx && idx !== currentQ.correctAnswer && (
                        <XCircle size={18} className="text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Box */}
              {isAnswered && (
                <div className={`p-4 rounded-lg border flex items-start gap-3 animate-fade-in ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-100'
                }`}>
                  <div className="p-2 rounded-full bg-slate-950 shrink-0">
                    {selectedOption === currentQ.correctAnswer ? (
                      <CheckCircle size={20} className="text-emerald-400" />
                    ) : (
                      <ShieldAlert size={20} className="text-amber-400" />
                    )}
                  </div>
                  <div className="space-y-1 text-xs md:text-sm">
                    <div className="font-mono text-[10px] uppercase font-bold tracking-wider">
                      {selectedOption === currentQ.correctAnswer
                        ? t('TELEMETRY VERIFIED // AURA CONFIRMATION', 'টেলিমেট্রি নিশ্চিত // অরা অনুমোদন')
                        : t('ANOMALOUS DATA // AURA ANALYSIS', 'অনিয়মিত তথ্য // অরা বিশ্লেষণ')}
                    </div>
                    <p className="font-sans leading-relaxed text-slate-200">
                      {getExplanationText()}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Action */}
              <div className="flex justify-end pt-2 border-t border-slate-800">
                {!isAnswered ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-widest disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    {t('SUBMIT ANALYSIS', 'উত্তর জমা দিন')}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <span>
                      {currentIndex < totalQuestions - 1
                        ? t('NEXT QUESTION', 'পরবর্তী প্রশ্ন')
                        : t('VIEW FINAL RESULTS', 'ফলাফল দেখুন')}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

            </div>
          )}

          {/* STEP D: FINAL RESULTS VIEW */}
          {step === 'RESULTS' && (
            <div className="space-y-6 text-center animate-fade-in">
              {isPassed ? (
                /* PASSED RESULTS (>= 80%) */
                <div className="space-y-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-500/20">
                    <Award size={40} className={prefersReducedMotion ? '' : 'animate-bounce'} />
                  </div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs uppercase font-bold tracking-widest">
                      {t('AURA DEBRIEFING PASSED', 'অরা মূল্যায়ন সফল')}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif italic text-white font-bold">
                      {t('Scientific Knowledge Verified', 'বৈজ্ঞানিক জ্ঞান সুপ্রতিষ্ঠিত')}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
                      {t(
                        `Outstanding analysis, Explorer! You achieved ${accuracy}% precision on ${galaxy.name}. Telemetry parameters have been archived into your permanent research log.`,
                        `অসাধারণ বিশ্লেষণ, অভিযাত্রী! আপনি ${galaxy.name} মূল্যায়নে ${accuracy}% নির্ভুলতা অর্জন করেছেন। তথ্যসমূহ আপনার গবেষণা লগ-এ সংকলিত হয়েছে।`
                      )}
                    </p>
                  </div>

                  {/* Score Breakdown Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto font-mono text-xs">
                    <div className="p-3 rounded bg-black/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t('ACCURACY', 'নির্ভুলতা')}</span>
                      <span className="text-base font-bold text-emerald-400 mt-1 block">{accuracy}%</span>
                    </div>
                    <div className="p-3 rounded bg-black/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t('SCORE', 'প্রাপ্ত নম্বর')}</span>
                      <span className="text-base font-bold text-cyan-300 mt-1 block">{score}/{totalQuestions}</span>
                    </div>
                    <div className="p-3 rounded bg-black/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t('MAX STREAK', 'সর্বোচ্চ ধারাবাহিক')}</span>
                      <span className="text-base font-bold text-amber-400 mt-1 block">{maxStreak}</span>
                    </div>
                    <div className="p-3 rounded bg-black/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t('TIME TAKEN', 'সময়')}</span>
                      <span className="text-base font-bold text-slate-200 mt-1 block">{totalTimeSeconds}s</span>
                    </div>
                  </div>

                  {/* Next Step Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={handleOpenDiscoveryLog}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                    >
                      <FileText size={16} />
                      <span>{t('PROCEED TO DISCOVERY LOG', 'ডিসকভারি লগে যান')}</span>
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <span>{t('RETURN TO GAMEPLAY', 'গেমপ্লেতে ফিরুন')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* FAILED RESULTS (< 80%) */
                <div className="space-y-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shadow-xl">
                    <ShieldAlert size={40} />
                  </div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded bg-red-950/80 border border-red-500/40 text-red-400 font-mono text-xs uppercase font-bold tracking-widest">
                      {t('ASSESSMENT UNRESOLVED (<80% REQUIREMENT)', 'মূল্যায়ন অসম্পূর্ণ (৮০% প্রয়োজন)')}
                    </span>
                    <h2 className="text-2xl font-serif italic text-white font-bold">
                      {t('Additional Research Required', 'অতিরিক্ত গবেষণা প্রয়োজন')}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
                      {t(
                        `You scored ${score}/${totalQuestions} (${accuracy}%). A minimum accuracy of 80% is required to clear AURA scientific certification. The galaxy remains discovered; you may review briefing data and retry anytime.`,
                        `আপনি ${totalQuestions}-এর মধ্যে ${score} পেয়েছিন (${accuracy}%)। অরা সার্টিফিকেট অর্জন করতে কমপক্ষে ৮০% স্কোর প্রয়োজন। গ্যালাক্সিটির আবিষ্কার অক্ষুণ্ণ রয়েছে; আপনি পরবর্তীতে পুনরায় মূল্যায়ন দিতে পারেন।`
                      )}
                    </p>
                  </div>

                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto font-mono text-xs">
                    <div className="p-3 rounded bg-black/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t('ACCURACY', 'নির্ভুলতা')}</span>
                      <span className="text-base font-bold text-red-400 mt-1 block">{accuracy}%</span>
                    </div>
                    <div className="p-3 rounded bg-black/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t('REQUIRED', 'প্রয়োজন')}</span>
                      <span className="text-base font-bold text-emerald-400 mt-1 block">80%</span>
                    </div>
                    <div className="p-3 rounded bg-black/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t('TIME TAKEN', 'সময়')}</span>
                      <span className="text-base font-bold text-slate-200 mt-1 block">{totalTimeSeconds}s</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={handleRetryAssessment}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      <span>{t('RETRY ASSESSMENT', 'পুনরায় মূল্যায়ন দিন')}</span>
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <span>{t('RETURN TO GAMEPLAY', 'গেমপ্লেতে ফিরুন')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP E: DISCOVERY LOG (PLACEHOLDER STEP) */}
          {step === 'DISCOVERY_LOG' && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="p-6 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-4">
                <div className="w-14 h-14 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 mx-auto shadow-lg">
                  <Database size={28} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    {t('NASA ARCHIVAL REGISTER // DISCOVERY LOG PLACEHOLDER', 'নাসা আরকাইভাল রেজিস্টার // ডিসকভারি লগ')}
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif italic text-white font-bold">
                    {galaxy.name} {t('Catalog Entry Encoded', 'ক্যাটালগ এন্ট্রি সংরক্ষিত')}
                  </h2>
                </div>

                <div className="p-4 rounded bg-black/80 border border-slate-800 text-left font-mono text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-[10px]">
                    <span className="text-slate-400">ARCHIVE RECORD ID:</span>
                    <span className="text-cyan-400 font-bold">{galaxy.id.toUpperCase()}-VERIFIED</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-[10px]">
                    <span className="text-slate-400">TELEMETRY ACCURACY:</span>
                    <span className="text-emerald-400 font-bold">{accuracy}%</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">RESEARCH STATUS:</span>
                    <span className="text-emerald-400 font-bold">OFFICIALLY CATALOGED</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic">
                  {t(
                    'Full interactive multi-sector Discovery Log catalog will expand in future mission releases.',
                    'সম্পূর্ণ ডিসকভারি লগ ক্যাটালগ আগামী মিশন সংস্করণে বিস্তারিতভাবে প্রকাশিত হবে।'
                  )}
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle size={16} />
                  <span>{t('RETURN TO GAMEPLAY', 'গেমপ্লেতে ফিরুন')}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 3. CONSOLE FOOTER */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Radio size={12} className="text-cyan-400 animate-pulse" />
            <span>AURA TELEMETRY ASSESSOR v2.0</span>
          </div>
          <span>KEYBOARD NAV: [1-4] OPTION | [ENTER] CONFIRM | [ESC] EXIT</span>
        </div>

      </div>

    </div>
  );
};

export default QuizAssessmentModal;
