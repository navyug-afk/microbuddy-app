import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Flashcard, CategoryType } from '../types/microbiology';
import { soundService } from '../utils/audio';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  CheckCircle,
  BookOpen,
  Plus,
  HelpCircle,
  Lightbulb,
  X,
  Filter,
  Layers,
} from 'lucide-react';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcard: (id: string, updated: Partial<Flashcard>) => void;
  onAddFlashcard: (card: Omit<Flashcard, 'id'>) => void;
  onRestoreDefaultFlashcards: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  onUpdateFlashcard,
  onAddFlashcard,
  onRestoreDefaultFlashcards,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'starred' | 'learning' | 'mastered'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Card Form
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('Gram Staining');
  const [newMnemonic, setNewMnemonic] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');

  // Categories
  const categories = useMemo(() => {
    const set = new Set(flashcards.map((f) => f.category));
    return ['All', ...Array.from(set)];
  }, [flashcards]);

  // Filtered Cards
  const activeDeck = useMemo(() => {
    return flashcards.filter((card) => {
      const matchCategory = selectedCategory === 'All' || card.category === selectedCategory;
      const matchFilter =
        filterMode === 'all' ||
        (filterMode === 'starred' && card.starred) ||
        (filterMode === 'learning' && card.status === 'learning') ||
        (filterMode === 'mastered' && card.status === 'mastered');

      return matchCategory && matchFilter;
    });
  }, [flashcards, filterMode, selectedCategory]);

  // Reset index when deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterMode, selectedCategory]);

  const currentCard = activeDeck[currentIndex] || null;

  const handleNext = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
    soundService.playFeedbackTone(520);
  }, [activeDeck.length]);

  const handlePrev = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
    soundService.playFeedbackTone(480);
  }, [activeDeck.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
    soundService.playFeedbackTone(600);
  }, []);

  const handleShuffle = () => {
    if (activeDeck.length <= 1) return;
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * activeDeck.length);
    setCurrentIndex(randomIndex);
    soundService.playFeedbackTone(660);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAddModalOpen) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, handleFlip, handleNext, handlePrev]);

  const handleToggleStar = (card: Flashcard, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateFlashcard(card.id, { starred: !card.starred });
    soundService.playFeedbackTone(700);
  };

  const handleSetStatus = (card: Flashcard, status: 'learning' | 'mastered', e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateFlashcard(card.id, { status });
    soundService.playFeedbackTone(status === 'mastered' ? 880 : 440);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    onAddFlashcard({
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory,
      mnemonic: newMnemonic.trim() || undefined,
      keyTakeaway: newTakeaway.trim() || undefined,
      status: 'learning',
      starred: false,
    });

    setNewQuestion('');
    setNewAnswer('');
    setNewMnemonic('');
    setNewTakeaway('');
    setIsAddModalOpen(false);
    soundService.playFeedbackTone(784);
  };

  const masteredCount = flashcards.filter((f) => f.status === 'mastered').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Deck Controls */}
      <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Active Recall Flashcards
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{masteredCount} of {flashcards.length} cards mastered</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-400">Press Spacebar to flip, Arrow keys to navigate</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Flashcard</span>
            </button>
          </div>
        </div>

        {/* Filters and Deck Selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          {/* Segmented Filter Control */}
          <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({flashcards.length})
            </button>
            <button
              onClick={() => setFilterMode('learning')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterMode === 'learning'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Still Learning
            </button>
            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterMode === 'mastered'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mastered
            </button>
            <button
              onClick={() => setFilterMode('starred')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterMode === 'starred'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Starred
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter flashcards by category"
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Flashcard Stage */}
      {activeDeck.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#0b1322] border border-slate-800 rounded-2xl">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300 mb-1">No cards match this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try switching back to &apos;All Cards&apos; or restore the default microbiology deck.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setFilterMode('all');
                setSelectedCategory('All');
              }}
              className="px-3.5 py-2 text-xs font-medium text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors"
            >
              View All Cards
            </button>
            <button
              onClick={onRestoreDefaultFlashcards}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              Restore Deck Defaults
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Counter & Star */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center gap-2">
              <span className="font-mono tabular-nums text-slate-300 font-semibold">
                Card {currentIndex + 1} of {activeDeck.length}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-teal-400/90 font-medium">{currentCard.category}</span>
            </div>

            <button
              onClick={(e) => handleToggleStar(currentCard, e)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Star
                className={`w-4 h-4 ${
                  currentCard.starred ? 'text-amber-400 fill-amber-400' : 'text-slate-500'
                }`}
              />
              <span>{currentCard.starred ? 'Starred' : 'Star for review'}</span>
            </button>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={handleFlip}
            className="perspective-1000 cursor-pointer min-h-[320px] sm:min-h-[340px] select-none"
          >
            <div
              className={`relative w-full h-full min-h-[320px] sm:min-h-[340px] transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Card FRONT */}
              <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-b from-[#0e192e] to-[#091120] border border-teal-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-slate-950/50 hover:border-teal-400/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="font-mono text-teal-400 tracking-wider uppercase text-[11px]">
                      Question / Concept
                    </span>
                    <span className="text-slate-500 text-[11px]">Click or press Space to reveal answer</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed mt-2">
                    {currentCard.question}
                  </h3>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-teal-400" />
                    <span>Flip card for full explanation</span>
                  </span>

                  <span
                    className={`text-xs font-mono tabular-nums ${
                      currentCard.status === 'mastered' ? 'text-teal-400' : 'text-slate-500'
                    }`}
                  >
                    Status: {currentCard.status === 'mastered' ? 'Mastered' : 'Learning'}
                  </span>
                </div>
              </div>

              {/* Card BACK */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-b from-[#091522] to-[#060c18] border border-teal-500/40 p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-slate-950/50">
                <div className="space-y-3 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-mono text-teal-400 tracking-wider uppercase text-[11px]">
                      Scientific Rationale & Answer
                    </span>
                    <span className="text-slate-500 text-[11px]">Click to flip back</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                    {currentCard.answer}
                  </p>

                  {/* Key Takeaway */}
                  {currentCard.keyTakeaway && (
                    <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/20 text-xs text-teal-300">
                      <span className="font-semibold block mb-0.5 text-teal-200">Key Lab Principle:</span>
                      {currentCard.keyTakeaway}
                    </div>
                  )}

                  {/* Mnemonic / Memory Trick */}
                  {currentCard.mnemonic && (
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-300">Memory Trick: </span>
                        {currentCard.mnemonic}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleSetStatus(currentCard, 'learning', e)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        currentCard.status === 'learning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                      }`}
                    >
                      Still Learning
                    </button>
                    <button
                      onClick={(e) => handleSetStatus(currentCard, 'mastered', e)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        currentCard.status === 'mastered'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                      }`}
                    >
                      Mark Mastered
                    </button>
                  </div>

                  <span className="text-xs text-slate-500">Tap to flip</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deck Action Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFlip}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>Flip Card</span>
              </button>

              <button
                onClick={handleShuffle}
                title="Shuffle deck"
                className="p-2.5 text-slate-300 hover:text-teal-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Flashcard Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0b1322] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Create Microbiology Flashcard
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Gram Staining">Gram Staining</option>
                  <option value="Cell Structure">Cell Structure</option>
                  <option value="Sterilization">Sterilization</option>
                  <option value="Bacterial Physiology">Bacterial Physiology</option>
                  <option value="Antimicrobial Agents">Antimicrobial Agents</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Card Front (Question or Term) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Why does boiling at 100°C fail to sterilize medical equipment?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Card Back (Answer & Mechanism) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Bacterial endospores from Bacillus and Clostridium survive boiling temperatures up to several hours due to dehydration and calcium dipicolinate."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Memory Trick / Mnemonic (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. “Boiling Bypasses Bacterial Spores”"
                  value={newMnemonic}
                  onChange={(e) => setNewMnemonic(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Lab Takeaway (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autoclave pressure (15 psi) is required to exceed 100°C up to 121°C."
                  value={newTakeaway}
                  onChange={(e) => setNewTakeaway(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow transition-colors"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
