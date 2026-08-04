import React, { useState } from 'react';
import { 
  Globe, 
  Compass, 
  MapPin, 
  Calendar, 
  Layers, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Award,
  Sparkles,
  ExternalLink,
  Play,
  Video,
  BookOpen
} from 'lucide-react';
import { Galaxy, QuizQuestion } from '../../types';
import { audioEngine } from '../../engine/audioEngine';
import { quizController } from '../../phaser/systems/QuizController';
import GalaxyImage from '../common/GalaxyImage';

interface GalaxyInfoProps {
  galaxy: Galaxy;
  soundEnabled: boolean;
  onReturnToSpace: () => void;
  onQuizSuccess: () => void;
  discoveredIds?: string[];
}

export default function GalaxyInfo({ 
  galaxy, 
  soundEnabled, 
  onReturnToSpace, 
  onQuizSuccess,
  discoveredIds = []
}: GalaxyInfoProps) {
  const [viewState, setViewState] = useState<'INFO' | 'QUIZ' | 'RESULTS'>('INFO');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Translation States
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');
  const [infoTab, setInfoTab] = useState<'FACTS' | 'VIDEO'>('FACTS');

  const quizQuestions = galaxy?.quizzes || [];
  const currentQuestion = quizQuestions[currentQuestionIndex] || null;

  // Helper translation function
  const t = (en: string, bn: string) => (lang === 'BN' ? bn : en);

  // Dynamic getters for galaxy properties based on language
  const getGalaxyName = () => {
    if (lang === 'BN' && galaxy.banglaTranslation) return galaxy.banglaTranslation.name;
    return galaxy.name;
  };

  const getGalaxyType = () => {
    if (lang === 'BN' && galaxy.banglaTranslation) return galaxy.banglaTranslation.type;
    return galaxy.type;
  };

  const getGalaxyDistance = () => {
    if (lang === 'BN' && galaxy.banglaTranslation) return galaxy.banglaTranslation.distance;
    return galaxy.distance;
  };

  const getGalaxyDiameter = () => {
    if (lang === 'BN' && galaxy.banglaTranslation) return galaxy.banglaTranslation.diameter;
    return galaxy.diameter;
  };

  const getGalaxyConstellation = () => {
    if (lang === 'BN' && galaxy.banglaTranslation) return galaxy.banglaTranslation.constellation;
    return galaxy.constellation;
  };

  const getGalaxyAge = () => {
    if (lang === 'BN' && galaxy.banglaTranslation) return galaxy.banglaTranslation.age;
    return galaxy.age;
  };

  const getGalaxyDescription = () => {
    if (lang === 'BN' && galaxy.banglaTranslation) return galaxy.banglaTranslation.description;
    return galaxy.description;
  };

  const getGalaxyFunFacts = () => {
    if (lang === 'BN' && galaxy.banglaTranslation) return galaxy.banglaTranslation.funFacts;
    return galaxy.funFacts;
  };

  // Handle Option selection
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  // Submit Answer & Play Synthesizer indicator bleeps
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);

    const correct = selectedOption === currentQuestion.correctAnswer;
    if (correct) {
      setScore((prev) => prev + 1);
      audioEngine.playSound('powerup', soundEnabled);
    } else {
      audioEngine.playSound('impact', soundEnabled);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setViewState('RESULTS');
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    quizController.startQuiz(galaxy);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 overflow-y-auto p-4 md:p-6 select-none font-sans">
      {/* Immersive radial nebulae backdrop */}
      <div 
        className="absolute w-full h-full inset-0 pointer-events-none opacity-20 filter blur-3xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${galaxy.visualColor}50 0%, rgba(5, 5, 8, 0) 70%)`
        }}
      ></div>

      <div 
        id="galaxy-science-panel"
        className="relative w-full max-w-4xl rounded-sm border border-white/10 bg-[#050508]/95 text-slate-100 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[85vh] glow-gold"
      >
        {/* Glowing border accent */}
        <div 
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: '#c5a059' }}
        ></div>

        {/* LEFT COLUMN: GALAXY GRAPHICS & SPEC CARD */}
        <div className="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-white/10 p-5 md:p-6 flex flex-col items-center justify-center bg-black/40 relative">
          <div className="absolute top-4 left-4">
            <span className="px-2 py-0.5 rounded-sm border border-white/10 bg-black/60 text-[9px] font-mono text-gold uppercase tracking-wider">
              M-ID: {galaxy.id.toUpperCase()}
            </span>
          </div>

          {/* Glowing orbital visual render showing REAL IMAGE */}
          <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full flex items-center justify-center mb-6">
            <div 
              className="absolute inset-0 rounded-full animate-spin duration-30000"
              style={{
                background: `radial-gradient(circle, ${galaxy.visualColor}20 0%, ${galaxy.visualColor}05 60%, rgba(0,0,0,0) 100%)`,
                border: `1.5px dashed ${galaxy.visualColor}40`
              }}
            ></div>
            
            {/* Circular photo box showing authentic NASA/Hubble photo */}
            <div 
              className="w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-white/10 bg-black flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
              style={{ boxShadow: `0 0 25px ${galaxy.visualColor}40` }}
            >
              <GalaxyImage
                src={galaxy.realImageUrl}
                alt={galaxy.name}
                visualColor={galaxy.visualColor}
                type={galaxy.type}
                className="w-full h-full object-cover rounded-full scale-105 hover:scale-125 transition-transform duration-700 pointer-events-auto cursor-zoom-in"
                containerClassName="w-full h-full relative overflow-hidden bg-slate-950 rounded-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-end pb-2.5 text-center pointer-events-none">
                <span className="text-[7.5px] font-mono text-gold font-bold uppercase tracking-widest px-1.5 py-0.5 bg-black/60 rounded-sm">
                  {t('REAL IMAGE', 'বাস্তব ছবি')}
                </span>
              </div>
            </div>
          </div>

          {/* Educational spec grids with translations */}
          <div className="w-full grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 rounded-sm bg-black/40 border border-white/5 shadow-md shadow-black/40">
              <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400 uppercase tracking-[0.15em]">
                <MapPin size={10} className="text-gold" /> {t('Distance', 'দূরত্ব')}
              </span>
              <p className="text-[11px] font-bold text-white mt-0.5 truncate" title={getGalaxyDistance()}>{getGalaxyDistance()}</p>
            </div>
            <div className="p-2.5 rounded-sm bg-black/40 border border-white/5 shadow-md shadow-black/40">
              <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400 uppercase tracking-[0.15em]">
                <Layers size={10} className="text-gold" /> {t('Diameter', 'ব্যাস')}
              </span>
              <p className="text-[11px] font-bold text-white mt-0.5 truncate" title={getGalaxyDiameter()}>{getGalaxyDiameter()}</p>
            </div>
            <div className="p-2.5 rounded-sm bg-black/40 border border-white/5 shadow-md shadow-black/40">
              <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400 uppercase tracking-[0.15em]">
                <Compass size={10} className="text-gold" /> {t('Constellation', 'তারামণ্ডল')}
              </span>
              <p className="text-[11px] font-bold text-white mt-0.5 truncate" title={getGalaxyConstellation()}>{getGalaxyConstellation()}</p>
            </div>
            <div className="p-2.5 rounded-sm bg-black/40 border border-white/5 shadow-md shadow-black/40">
              <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400 uppercase tracking-[0.15em]">
                <Calendar size={10} className="text-gold" /> {t('Star Age', 'নক্ষত্রের বয়স')}
              </span>
              <p className="text-[11px] font-bold text-white mt-0.5 truncate" title={getGalaxyAge()}>{getGalaxyAge()}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FACT SHEET, VIDEO HUB, OR QUIZ INTERACTIVE VIEW */}
        <div className="w-full md:w-3/5 p-5 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full">
          
          {/* Top Toggles Row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
            {/* Fact vs Video tab (Only in INFO view) */}
            {viewState === 'INFO' ? (
              <div className="flex bg-white/[0.03] rounded-sm p-0.5 border border-white/5">
                <button
                  onClick={() => setInfoTab('FACTS')}
                  className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    infoTab === 'FACTS' 
                      ? 'bg-gold text-black shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen size={12} />
                  <span>{t('Facts & Info', 'তথ্য বিবরণী')}</span>
                </button>
                <button
                  onClick={() => setInfoTab('VIDEO')}
                  className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    infoTab === 'VIDEO' 
                      ? 'bg-gold text-black shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video size={12} />
                  <span>{t('HD Video Tour', 'এইচডি ভিডিও ট্যুর')}</span>
                </button>
              </div>
            ) : (
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                {viewState === 'QUIZ' ? t('Astronomy Quiz', 'জ্যোতির্বিজ্ঞান কুইজ') : t('Results Panel', 'ফলাফল প্যানেল')}
              </div>
            )}

            {/* Language Selector Selector */}
            <div className="flex items-center gap-1 bg-white/[0.03] rounded-sm p-0.5 border border-white/5">
              <button
                onClick={() => setLang('EN')}
                className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-sm cursor-pointer transition-all ${
                  lang === 'EN' 
                    ? 'bg-gold/15 border border-gold/30 text-gold font-extrabold' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('BN')}
                className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-sm cursor-pointer transition-all ${
                  lang === 'BN' 
                    ? 'bg-gold/15 border border-gold/30 text-gold font-extrabold' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* VIEW: INFO -> SUB-VIEW: FACTS (Educational textbook facts panel) */}
          {viewState === 'INFO' && infoTab === 'FACTS' && (
            <div id="info-viewport" className="space-y-5">
              <div>
                <h2 className="text-xl md:text-2xl font-serif italic text-white tracking-wide leading-none mb-2.5 font-medium">
                  {getGalaxyName()}
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {getGalaxyDescription()}
                </p>
              </div>

              {/* Dynamic fun facts list */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-1.5">
                  <Lightbulb size={12} /> {t('Amazing Astronomy Trivia', 'অসাধারণ জ্যোতির্বিজ্ঞান সাধারণ জ্ঞান')}
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {getGalaxyFunFacts()?.map((fact, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-sm bg-white/[0.01] border border-white/5 flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed"
                    >
                      <span className="text-gold font-mono font-bold">0{idx + 1}.</span>
                      <p>{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  id="return-map-btn"
                  onClick={onReturnToSpace}
                  className="w-full sm:w-auto px-4 py-2 rounded-sm border border-white/10 hover:border-gold hover:text-gold hover:bg-gold/10 text-slate-300 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} /> {t('Back to Space', 'মহাকাশে ফিরে যান')}
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  {discoveredIds && discoveredIds.includes(galaxy.id) && (
                    <button
                      id="view-saved-certificate-btn"
                      onClick={onQuizSuccess}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-sm border border-gold bg-gold/10 hover:bg-gold/20 text-gold text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                    >
                      <Award size={14} /> {t('View Certificate', 'শংসাপত্র দেখুন')}
                    </button>
                  )}

                  <button
                    id="start-quiz-btn"
                    onClick={() => quizController.startQuiz(galaxy)}
                    className="group w-full sm:w-auto px-5 py-2.5 rounded-sm bg-gold hover:bg-gold-hover text-black text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <span>{discoveredIds && discoveredIds.includes(galaxy.id) ? t('Retake Quiz', 'কুইজ পুনরায় দিন') : t('Test Your Skills', 'দক্ষতা পরীক্ষা করুন')}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-black" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: INFO -> SUB-VIEW: VIDEO (HD Video simulation player) */}
          {viewState === 'INFO' && infoTab === 'VIDEO' && (
            <div id="video-viewport" className="space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl font-serif italic text-white tracking-wide leading-none mb-2 font-medium">
                  {t('HD Video Tour', 'এইচডি ভিডিও ট্যুর')}
                </h2>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {t(
                    `Explore high-definition NASA telescopic simulations and deep observations of the ${galaxy.name}.`,
                    `${getGalaxyName()} সম্পর্কে একটি উচ্চ-সংজ্ঞার নাসা টেলিস্কোপিক সিমুলেশন এবং গভীর বৈজ্ঞানিক গবেষণা ভিডিও চিত্র দেখুন।`
                  )}
                </p>
              </div>

              {/* Interactive YouTube Video Link & Thumbnail */}
              {galaxy.youtubeVideoId ? (
                <div className="space-y-3">
                  <a
                    href={`https://www.youtube.com/watch?v=${galaxy.youtubeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full aspect-video rounded-sm border border-white/15 bg-black overflow-hidden shadow-2xl group cursor-pointer pointer-events-auto"
                    title={t('Click to watch directly on YouTube', 'ইউটিউবে সরাসরি দেখতে ক্লিক করুন')}
                  >
                    {/* YouTube High Quality Cover Image */}
                    <img
                      src={`https://img.youtube.com/vi/${galaxy.youtubeVideoId}/hqdefault.jpg`}
                      alt={`${galaxy.name} Video Cover`}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 transition-opacity" />

                    {/* Styled YouTube Brand Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-11 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:bg-red-500 group-hover:scale-110 group-hover:shadow-red-600/30">
                        <Play size={20} className="text-white fill-white ml-1" />
                      </div>
                    </div>

                    {/* Watch on YouTube Label inside player */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/75 px-2.5 py-1.5 rounded-sm border border-white/10">
                      <ExternalLink size={12} className="text-gold" />
                      <span className="text-[10px] font-mono text-slate-200 uppercase tracking-wider font-semibold">
                        {t('Watch on YouTube', 'ইউটিউবে দেখুন')}
                      </span>
                    </div>
                  </a>

                  {/* Prominent Action Button to Open directly on YouTube */}
                  <a
                    href={`https://www.youtube.com/watch?v=${galaxy.youtubeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-sm border border-red-600/40 bg-red-600/10 hover:bg-red-600 text-slate-100 hover:text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer pointer-events-auto shadow-lg shadow-red-950/10"
                  >
                    <Video size={14} className="text-red-500 group-hover:text-white" />
                    <span>{t('Open Video directly on YouTube', 'সরাসরি ইউটিউবে ভিডিওটি দেখুন')}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-sm border border-white/15 bg-black overflow-hidden shadow-2xl flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                  <span>{t('HD Video feed unavailable', 'এইচডি ভিডিও ফিড পাওয়া যায়নি')}</span>
                </div>
              )}

              <div className="p-3 rounded-sm bg-gold/5 border border-gold/15 text-xs text-slate-300">
                <p className="text-gold font-mono font-bold text-[9px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles size={11} /> {t('EXPLORATION REPORT', 'অনুসন্ধান রিপোর্ট')}
                </p>
                <p className="font-sans text-[11px] leading-relaxed">
                  {t(
                    `Observational telemetry from Hubble and Keck telescopes mapped star density distributions in the core region. Core contains Sagittarius A* (Milky Way) or heavy massive stellar nuclei forming dynamic visual swirls. Select the Quiz to test what you have learned!`,
                    `হাবল এবং কেক টেলিস্কোপের পর্যবেক্ষণমূলক টেলিমেট্রি থেকে গ্যালাক্সির কেন্দ্রে ঘূর্ণায়মান ধূলিকণা এবং তারার ঘনত্বের তীব্র বিস্তৃতি ম্যাপ করা হয়েছে। এটি এর ঘূর্ণনশীল গতিবিদ্যা উন্মোচন করে। আপনার দক্ষতা যাচাই করতে কুইজ এ অংশ নিন!`
                  )}
                </p>
              </div>

              {/* Action row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  id="return-map-btn"
                  onClick={onReturnToSpace}
                  className="w-full sm:w-auto px-4 py-2 rounded-sm border border-white/10 hover:border-gold hover:text-gold hover:bg-gold/10 text-slate-300 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} /> {t('Back to Space', 'মহাকাশে ফিরে যান')}
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  {discoveredIds && discoveredIds.includes(galaxy.id) && (
                    <button
                      id="view-saved-certificate-btn"
                      onClick={onQuizSuccess}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-sm border border-gold bg-gold/10 hover:bg-gold/20 text-gold text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                    >
                      <Award size={14} /> {t('View Certificate', 'শংসাপত্র দেখুন')}
                    </button>
                  )}

                  <button
                    id="start-quiz-btn"
                    onClick={() => quizController.startQuiz(galaxy)}
                    className="group w-full sm:w-auto px-5 py-2.5 rounded-sm bg-gold hover:bg-gold-hover text-black text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <span>{discoveredIds && discoveredIds.includes(galaxy.id) ? t('Retake Quiz', 'কুইজ পুনরায় দিন') : t('Test Your Skills', 'দক্ষতা পরীক্ষা করুন')}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-black" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: QUIZ (Active MCQ evaluation panel) */}
          {viewState === 'QUIZ' && currentQuestion && (
            <div id="quiz-viewport" className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <span className="text-[10px] font-mono tracking-wider text-slate-400">
                  {t(`QUESTION ${currentQuestionIndex + 1} OF ${quizQuestions.length}`, `প্রশ্ন ${currentQuestionIndex + 1} / ${quizQuestions.length}`)}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-gold">
                  {t(`SCORE: ${score}/${quizQuestions.length}`, `প্রাপ্ত স্কোর: ${score}/${quizQuestions.length}`)}
                </span>
              </div>

              <h2 className="text-sm md:text-base font-serif italic text-white tracking-wide leading-snug">
                {currentQuestion.question}
              </h2>

              {/* MCQ Choices */}
              <div className="space-y-2">
                {currentQuestion.options.map((option, idx) => {
                  let btnStyle = 'border-white/10 bg-black/40 text-slate-300 hover:border-gold/40 hover:bg-gold/5';
                  
                  if (selectedOption === idx) {
                    btnStyle = 'border-gold bg-gold/10 text-gold';
                  }
                  if (isAnswered) {
                    if (idx === currentQuestion.correctAnswer) {
                      btnStyle = 'border-green-500 bg-green-500/10 text-green-200';
                    } else if (selectedOption === idx) {
                      btnStyle = 'border-red-500 bg-red-500/10 text-red-200';
                    } else {
                      btnStyle = 'opacity-40 border-white/10 bg-black/40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3 rounded-sm border text-xs md:text-sm transition-all flex items-center justify-between ${btnStyle} disabled:cursor-not-allowed`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-sm border border-white/10 bg-black flex items-center justify-center text-[9px] font-mono text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </span>
                      {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                      {isAnswered && selectedOption === idx && idx !== currentQuestion.correctAnswer && <XCircle size={16} className="text-red-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation section if answered */}
              {isAnswered && (
                <div className="p-3 rounded-sm border border-white/10 bg-black/40 flex gap-2.5 items-start animate-fade-in text-slate-300">
                  <div className="text-gold mt-0.5">
                    <Lightbulb size={16} />
                  </div>
                  <div className="text-xs">
                    <p className="font-mono text-gold text-[10px] tracking-wider uppercase mb-1">{t('FACT CHECK', 'তথ্য পরীক্ষা')}</p>
                    <p className="leading-relaxed font-sans">{currentQuestion.explanation}</p>
                  </div>
                </div>
              )}

              {/* Action row */}
              <div className="flex justify-end pt-2 border-t border-white/10">
                {!isAnswered ? (
                  <button
                    id="submit-answer-btn"
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-sm bg-gold hover:bg-gold-hover text-black text-xs font-mono font-bold tracking-wider uppercase disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    {t('Lock Answer', 'উত্তর লক করুন')}
                  </button>
                ) : (
                  <button
                    id="next-question-btn"
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-sm bg-gold hover:bg-gold-hover text-black text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{currentQuestionIndex < quizQuestions.length - 1 ? t('Next Question', 'পরবর্তী প্রশ্ন') : t('Complete Quiz', 'কুইজ সম্পন্ন করুন')}</span>
                    <ArrowRight size={14} className="text-black" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* VIEW: RESULTS (Evaluate pass / fail score) */}
          {viewState === 'RESULTS' && (
            <div id="results-viewport" className="text-center py-6 space-y-6">
              {score === quizQuestions.length ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold mb-2 shadow-lg">
                    <Award size={32} className="animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif italic text-white font-medium tracking-wide">
                      {t('Quiz Completed Successfully!', 'কুইজ সফলভাবে সম্পন্ন হয়েছে!')}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed font-sans">
                      {t(
                        `Outstanding! You answered all ${quizQuestions.length} questions correctly about the ${galaxy.name}. An official Astronomy Pathshala Discovery Certificate has been unlocked.`,
                        `চমৎকার! আপনি ${getGalaxyName()} সম্পর্কে সবগুলো ${quizQuestions.length}টি প্রশ্নের সঠিক উত্তর দিয়েছেন। একটি অফিসিয়াল অ্যাস্ট্রোনমি পাঠশালা আবিষ্কার শংসাপত্র আনলক করা হয়েছে।`
                      )}
                    </p>
                  </div>

                  <div className="p-3 rounded-sm bg-gold/10 border border-gold/20 text-[9px] font-mono text-gold tracking-widest uppercase max-w-xs mx-auto flex items-center justify-center gap-1">
                    <Sparkles size={12} className="animate-pulse text-gold" />
                    <span>{t('Certificate Unlocked', 'শংসাপত্র আনলক হয়েছে')}</span>
                  </div>

                  <div className="flex gap-3 justify-center pt-4 border-t border-white/10">
                    <button
                      id="claim-certificate-btn"
                      onClick={onQuizSuccess}
                      className="px-6 py-3 rounded-sm bg-gold hover:bg-gold-hover text-black font-extrabold text-xs tracking-widest uppercase flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      <Award size={16} /> {t('Claim Discovery Certificate', 'আবিষ্কার শংসাপত্র দাবি করুন')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-950/20 border border-red-500/20 flex items-center justify-center text-red-400 mb-2 shadow-lg">
                    <XCircle size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif italic text-white font-medium tracking-wide">
                      {t('Knowledge Check Incomplete', 'জ্ঞানের পরিধি যাচাই অসম্পূর্ণ')}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed font-sans">
                      {t(
                        `You got ${score} out of ${quizQuestions.length} questions correct. We require 100% precision to earn the official badge. Read through the spec facts and try again!`,
                        `আপনি ${quizQuestions.length}টি প্রশ্নের মধ্যে ${score}টি সঠিক উত্তর দিয়েছেন। অফিসিয়াল ব্যাজ অর্জন করতে আমাদের ১০০% নির্ভুলতা প্রয়োজন। তথ্য বিবরণী পুনরায় পড়ুন এবং আবার চেষ্টা করুন!`
                      )}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center pt-4 border-t border-white/10">
                    <button
                      id="review-facts-btn"
                      onClick={() => {
                        setViewState('INFO');
                        setInfoTab('FACTS');
                      }}
                      className="px-4 py-2.5 rounded-sm border border-white/10 hover:border-gold hover:text-gold hover:bg-gold/10 text-slate-300 text-xs font-mono font-bold tracking-wider uppercase cursor-pointer"
                    >
                      {t('Review Specs', 'বিবরণীগুলো রিভিউ করুন')}
                    </button>
                    <button
                      id="retry-quiz-btn"
                      onClick={handleRetakeQuiz}
                      className="px-5 py-2.5 rounded-sm bg-gold hover:bg-gold-hover text-black text-xs font-mono font-bold tracking-wider uppercase cursor-pointer"
                    >
                      {t('Retake Quiz', 'কুইজ পুনরায় দিন')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
