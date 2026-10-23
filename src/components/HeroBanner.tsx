import React from 'react';
import { NavTab } from './Navbar';
import { BookOpen, Layers, Award, Timer, CheckCircle2, Clock } from 'lucide-react';

interface HeroBannerProps {
  onSelectTab: (tab: NavTab) => void;
  completedTopicsCount: number;
  totalTopicsCount: number;
  masteredFlashcardsCount: number;
  totalFlashcardsCount: number;
  highestQuizScore: number | null;
  totalFocusMinutes: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectTab,
  completedTopicsCount,
  totalTopicsCount,
  masteredFlashcardsCount,
  totalFlashcardsCount,
  highestQuizScore,
  totalFocusMinutes,
}) => {
  const percentComplete = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1424] mb-8">
      {/* Background illustration with measured contrast scrim */}
      <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
        <img
          src="/src/assets/images/microbiology_hero_banner_1792771668149.jpg"
          alt="Microbiology laboratory with Gram stain comparison, autoclave, and bacterial cell structures"
          className="w-full h-full object-cover object-center filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424] via-[#0c1424]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1424]/90 via-[#0c1424]/60 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 md:p-8">
          <div className="max-w-2xl">
            {/* Unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-teal-400 mb-2">
              <span>Bacteriology</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Cell Envelope Chemistry</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Sterilization Protocols</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display mb-2">
              MicroBuddy Study Hub
            </h1>

            <p className="text-sm sm:text-base text-slate-300 line-clamp-2 max-w-xl mb-4">
              Your college microbiology companion. Master Gram staining mechanisms, bacterial structures, and autoclave sterilization with interactive active recall.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectTab('tracker')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                Continue Studying
              </button>
              <button
                onClick={() => onSelectTab('quiz')}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Take Challenge Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Item KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-800/80 divide-y md:divide-y-0 md:divide-x divide-slate-800/80 bg-[#09101d]">
        
        {/* Metric 1: Topics */}
        <div 
          onClick={() => onSelectTab('tracker')} 
          className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Topics Completed</span>
            <BookOpen className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
            {completedTopicsCount} <span className="text-xs text-slate-500 font-sans font-normal">/ {totalTopicsCount}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-teal-400/90">
            <CheckCircle2 className="w-3 h-3" />
            <span className="font-mono tabular-nums">{percentComplete}%</span> completed
          </div>
        </div>

        {/* Metric 2: Flashcards */}
        <div 
          onClick={() => onSelectTab('flashcards')} 
          className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Flashcards Mastered</span>
            <Layers className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
            {masteredFlashcardsCount} <span className="text-xs text-slate-500 font-sans font-normal">/ {totalFlashcardsCount}</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Active recall library
          </div>
        </div>

        {/* Metric 3: Quiz Score */}
        <div 
          onClick={() => onSelectTab('quiz')} 
          className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>High Quiz Score</span>
            <Award className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
            {highestQuizScore !== null ? `${highestQuizScore}%` : 'Not Taken'}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            8 college questions
          </div>
        </div>

        {/* Metric 4: Focus Time */}
        <div 
          onClick={() => onSelectTab('timer')} 
          className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Focus Time Logged</span>
            <Timer className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
            {totalFocusMinutes} <span className="text-xs text-slate-500 font-sans font-normal">mins</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3 h-3 text-teal-400" />
            <span>Pomodoro ready</span>
          </div>
        </div>

      </div>
    </div>
  );
};
