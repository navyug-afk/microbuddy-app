/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StudyTracker } from './components/StudyTracker';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { StudyTimer } from './components/StudyTimer';
import { StudentGuideModal } from './components/StudentGuideModal';
import { DataOptionsModal } from './components/DataOptionsModal';
import { storage } from './utils/storage';
import { StudyTopic, Flashcard, QuizAttempt, StudyStats } from './types/microbiology';
import { INITIAL_TOPICS, INITIAL_FLASHCARDS, INITIAL_QUIZ } from './data/microbiologyData';
import { HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('tracker');
  const [topics, setTopics] = useState<StudyTopic[]>(() => storage.getTopics());
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => storage.getFlashcards());
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => storage.getQuizHistory());
  const [studyStats, setStudyStats] = useState<StudyStats>(() => storage.getStudyStats());

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDataOptionsOpen, setIsDataOptionsOpen] = useState(false);

  // Sync topics to storage on change
  const handleToggleTopic = (id: string) => {
    setTopics((prev) => {
      const next = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      );
      storage.saveTopics(next);
      return next;
    });
  };

  const handleAddTopic = (newTopicData: Omit<StudyTopic, 'id' | 'createdAt'>) => {
    const newTopic: StudyTopic = {
      ...newTopicData,
      id: `topic-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTopics((prev) => {
      const next = [newTopic, ...prev];
      storage.saveTopics(next);
      return next;
    });
  };

  const handleEditTopic = (id: string, updated: Partial<StudyTopic>) => {
    setTopics((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      storage.saveTopics(next);
      return next;
    });
  };

  const handleDeleteTopic = (id: string) => {
    setTopics((prev) => {
      const next = prev.filter((t) => t.id !== id);
      storage.saveTopics(next);
      return next;
    });
  };

  const handleRestoreDefaultTopics = () => {
    storage.saveTopics(INITIAL_TOPICS);
    setTopics(INITIAL_TOPICS);
  };

  // Flashcards Handlers
  const handleUpdateFlashcard = (id: string, updated: Partial<Flashcard>) => {
    setFlashcards((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...updated } : f));
      storage.saveFlashcards(next);
      return next;
    });
  };

  const handleAddFlashcard = (newCardData: Omit<Flashcard, 'id'>) => {
    const newCard: Flashcard = {
      ...newCardData,
      id: `card-${Date.now()}`,
    };
    setFlashcards((prev) => {
      const next = [newCard, ...prev];
      storage.saveFlashcards(next);
      return next;
    });
  };

  const handleRestoreDefaultFlashcards = () => {
    storage.saveFlashcards(INITIAL_FLASHCARDS);
    setFlashcards(INITIAL_FLASHCARDS);
  };

  // Quiz Handlers
  const handleSaveQuizAttempt = (attempt: QuizAttempt) => {
    const updated = storage.saveQuizAttempt(attempt);
    setQuizHistory(updated);
  };

  // Timer Stats Handlers
  const handleUpdateStats = (newStats: StudyStats) => {
    setStudyStats(newStats);
    storage.saveStudyStats(newStats);
  };

  // Full reload when importing backup or resetting data
  const handleDataReload = useCallback(() => {
    setTopics(storage.getTopics());
    setFlashcards(storage.getFlashcards());
    setQuizHistory(storage.getQuizHistory());
    setStudyStats(storage.getStudyStats());
  }, []);

  // Handle Tab Select
  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'guide') {
      setIsGuideOpen(true);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Derived KPI metrics
  const completedTopicsCount = topics.filter((t) => t.completed).length;
  const totalTopicsCount = topics.length;
  const masteredFlashcardsCount = flashcards.filter((f) => f.status === 'mastered').length;
  const totalFlashcardsCount = flashcards.length;
  const highestQuizScore = quizHistory.length > 0
    ? Math.max(...quizHistory.map((q) => q.percentage))
    : null;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        completedTopicsCount={completedTopicsCount}
        totalTopicsCount={totalTopicsCount}
        onOpenResetModal={() => setIsDataOptionsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Hero banner with generated scientific image & 4 KPI metrics */}
        <HeroBanner
          onSelectTab={handleSelectTab}
          completedTopicsCount={completedTopicsCount}
          totalTopicsCount={totalTopicsCount}
          masteredFlashcardsCount={masteredFlashcardsCount}
          totalFlashcardsCount={totalFlashcardsCount}
          highestQuizScore={highestQuizScore}
          totalFocusMinutes={studyStats.totalFocusMinutes}
        />

        {/* Dynamic View Section based on Active Tab */}
        {activeTab === 'tracker' && (
          <StudyTracker
            topics={topics}
            onToggleComplete={handleToggleTopic}
            onAddTopic={handleAddTopic}
            onEditTopic={handleEditTopic}
            onDeleteTopic={handleDeleteTopic}
            onRestoreDefaults={handleRestoreDefaultTopics}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            flashcards={flashcards}
            onUpdateFlashcard={handleUpdateFlashcard}
            onAddFlashcard={handleAddFlashcard}
            onRestoreDefaultFlashcards={handleRestoreDefaultFlashcards}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            questions={INITIAL_QUIZ}
            quizHistory={quizHistory}
            onSaveQuizAttempt={handleSaveQuizAttempt}
          />
        )}

        {activeTab === 'timer' && (
          <StudyTimer
            stats={studyStats}
            onUpdateStats={handleUpdateStats}
          />
        )}
      </main>

      {/* Student Guide & Troubleshooting Modal */}
      <StudentGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenDataOptions={() => setIsDataOptionsOpen(true)}
      />

      {/* Data Export / Import & Reset Modal */}
      <DataOptionsModal
        isOpen={isDataOptionsOpen}
        onClose={() => setIsDataOptionsOpen(false)}
        onDataReload={handleDataReload}
      />

      {/* Floating Beginner Help Trigger (accessible on mobile & desktop) */}
      <button
        onClick={() => setIsGuideOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-teal-500 text-slate-950 font-semibold text-xs shadow-xl shadow-teal-950/50 hover:bg-teal-400 active:scale-95 transition-all"
        title="Open Beginner Testing & Troubleshooting Guide"
      >
        <HelpCircle className="w-4 h-4 text-slate-950" />
        <span className="hidden sm:inline">Student Guide</span>
      </button>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060a12] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MicroBuddy</span>
            <span aria-hidden="true">·</span>
            <span>College Microbiology Study Companion</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-teal-300 transition-colors"
            >
              Testing Guide
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => setIsDataOptionsOpen(true)}
              className="hover:text-teal-300 transition-colors"
            >
              Export / Reset Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
