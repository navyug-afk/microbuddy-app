import React, { useState, useEffect, useRef } from 'react';
import { StudyStats } from '../types/microbiology';
import { soundService } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  CheckCircle,
  Coffee,
  Brain,
} from 'lucide-react';

interface StudyTimerProps {
  stats: StudyStats;
  onUpdateStats: (newStats: StudyStats) => void;
}

type TimerMode = 'pomodoro' | 'short_break' | 'long_break' | 'custom';

export const StudyTimer: React.FC<StudyTimerProps> = ({ stats, onUpdateStats }) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(30);

  // Initial duration in seconds
  const getInitialSeconds = (m: TimerMode, customM: number): number => {
    switch (m) {
      case 'pomodoro':
        return 25 * 60;
      case 'short_break':
        return 5 * 60;
      case 'long_break':
        return 15 * 60;
      case 'custom':
        return customM * 60;
    }
  };

  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<number | null>(null);

  // Switch modes
  const handleSelectMode = (newMode: TimerMode) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const secs = getInitialSeconds(newMode, customMinutes);
    setMode(newMode);
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
  };

  const handleApplyCustomMinutes = (mins: number) => {
    const validMins = Math.max(1, Math.min(120, mins));
    setCustomMinutes(validMins);
    if (mode === 'custom') {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setTotalSeconds(validMins * 60);
      setSecondsRemaining(validMins * 60);
    }
  };

  // Timer Tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);

            if (soundEnabled) {
              soundService.playTimerCompleteChime();
            }

            // Log focus minutes if it was a focus session
            if (mode === 'pomodoro' || mode === 'custom') {
              const minutesCompleted = Math.round(totalSeconds / 60);
              const updatedStats: StudyStats = {
                ...stats,
                totalFocusMinutes: stats.totalFocusMinutes + minutesCompleted,
                sessionsCompleted: stats.sessionsCompleted + 1,
                lastActiveDate: new Date().toISOString().split('T')[0],
              };
              onUpdateStats(updatedStats);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, soundEnabled, mode, totalSeconds, stats, onUpdateStats]);

  const handleStart = () => {
    setIsRunning(true);
    soundService.playFeedbackTone(523.25);
  };

  const handlePause = () => {
    setIsRunning(false);
    soundService.playFeedbackTone(392.0);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsRemaining(totalSeconds);
    soundService.playFeedbackTone(440);
  };

  // Format time
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Circular math
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Microbiology Study Timer
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Scientific Pomodoro Technique</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-teal-400">
                {stats.totalFocusMinutes} mins logged today
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {stats.sessionsCompleted} sessions completed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Audio Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chime Muted</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 mt-5 p-1 bg-slate-900 border border-slate-800 rounded-lg max-w-md overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSelectMode('pomodoro')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
              mode === 'pomodoro'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>25m Focus</span>
          </button>

          <button
            onClick={() => handleSelectMode('short_break')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
              mode === 'short_break'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>5m Break</span>
          </button>

          <button
            onClick={() => handleSelectMode('long_break')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 ${
              mode === 'long_break'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>15m Break</span>
          </button>

          <button
            onClick={() => handleSelectMode('custom')}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'custom'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Custom</span>
          </button>
        </div>

        {/* Custom duration slider if custom mode selected */}
        {mode === 'custom' && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-4 max-w-md">
            <span className="text-xs text-slate-400 whitespace-nowrap">Duration:</span>
            <input
              type="range"
              min="5"
              max="90"
              step="5"
              value={customMinutes}
              onChange={(e) => handleApplyCustomMinutes(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <span className="font-mono text-xs text-teal-300 w-16 text-right">
              {customMinutes} mins
            </span>
          </div>
        )}
      </div>

      {/* Main Timer Display */}
      <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto flex flex-col items-center justify-center shadow-xl">
        {/* Circular SVG Dial */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
            {/* Background Circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-800/80"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-teal-400 transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {formattedTime}
            </span>
            <span className="text-xs text-slate-400 mt-2 font-medium tracking-wide uppercase">
              {isRunning
                ? mode === 'pomodoro' || mode === 'custom'
                  ? 'Active Recall Session'
                  : 'Resting & Hydrating'
                : 'Ready to Study'}
            </span>
            {secondsRemaining === 0 && (
              <span className="text-xs text-teal-400 mt-1 font-semibold">
                Session Complete!
              </span>
            )}
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleReset}
            className="p-3 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {isRunning ? (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-8 py-3.5 text-base font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-950/30 transition-all transform active:scale-95"
            >
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-3.5 text-base font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-lg shadow-teal-950/40 transition-all transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{secondsRemaining === totalSeconds ? 'Start Timer' : 'Resume'}</span>
            </button>
          )}

          <div className="w-11" /> {/* Visual balance spacer */}
        </div>

        {/* Study Advice */}
        <div className="mt-8 text-center max-w-sm text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
          <span className="text-teal-400 font-semibold block mb-0.5">Microbiology Study Tip:</span>
          Use the 25-minute block to write out the Gram staining flow or draw bacterial flagellar motors from memory.
        </div>
      </div>
    </div>
  );
};
