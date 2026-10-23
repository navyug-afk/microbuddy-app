import React from 'react';
import { BookOpen, Layers, HelpCircle, Timer, Award, Info, RefreshCw } from 'lucide-react';

export type NavTab = 'tracker' | 'flashcards' | 'quiz' | 'timer' | 'guide';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  completedTopicsCount: number;
  totalTopicsCount: number;
  onOpenResetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  completedTopicsCount,
  totalTopicsCount,
  onOpenResetModal,
}) => {
  const completionPercentage = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  const navItems = [
    { id: 'tracker' as NavTab, label: 'Study Tracker', icon: BookOpen },
    { id: 'flashcards' as NavTab, label: 'Flashcards', icon: Layers },
    { id: 'quiz' as NavTab, label: 'Quiz Challenge', icon: Award },
    { id: 'timer' as NavTab, label: 'Study Timer', icon: Timer },
    { id: 'guide' as NavTab, label: 'Student Guide', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8 h-16">
        
        {/* Zone 1: Brand wordmark (single text element wordmark) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <span className="font-bold text-lg font-mono">µ</span>
          </div>
          <span 
            onClick={() => onSelectTab('tracker')}
            className="text-lg sm:text-xl font-bold tracking-tight text-white font-display cursor-pointer select-none"
          >
            Micro<span className="text-teal-400">Buddy</span>
          </span>
        </div>

        {/* Zone 2: Single-line navigation links (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-teal-300 bg-teal-500/15 border border-teal-500/30 shadow-sm shadow-teal-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pr-2 border-r border-slate-800">
            <span>Progress:</span>
            <span className="font-mono tabular-nums text-teal-400 font-medium">
              {completedTopicsCount}/{totalTopicsCount} ({completionPercentage}%)
            </span>
          </div>

          <button
            onClick={onOpenResetModal}
            title="Manage Data & Reset Defaults"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Data Options</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar (sticky below main bar on smaller screens) */}
      <div className="md:hidden flex items-center justify-between border-t border-slate-800/70 py-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded transition-colors ${
                isActive ? 'text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
