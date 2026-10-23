import React, { useState, useMemo } from 'react';
import { StudyTopic, CategoryType, DifficultyLevel } from '../types/microbiology';
import { soundService } from '../utils/audio';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Clock,
  Sparkles,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface StudyTrackerProps {
  topics: StudyTopic[];
  onToggleComplete: (id: string) => void;
  onAddTopic: (topic: Omit<StudyTopic, 'id' | 'createdAt'>) => void;
  onEditTopic: (id: string, updated: Partial<StudyTopic>) => void;
  onDeleteTopic: (id: string) => void;
  onRestoreDefaults: () => void;
}

export const StudyTracker: React.FC<StudyTrackerProps> = ({
  topics,
  onToggleComplete,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onRestoreDefaults,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<StudyTopic | null>(null);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('Gram Staining');
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>('Foundational');
  const [formMinutes, setFormMinutes] = useState(30);
  const [formNotes, setFormNotes] = useState('');
  const [formKeyTerms, setFormKeyTerms] = useState('');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(topics.map((t) => t.category));
    return ['All', ...Array.from(set)];
  }, [topics]);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.keyTerms && t.keyTerms.some((term) => term.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && t.completed) ||
        (statusFilter === 'incomplete' && !t.completed);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [topics, searchQuery, selectedCategory, statusFilter]);

  const completedCount = topics.filter((t) => t.completed).length;
  const totalCount = topics.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalMinutesRemaining = topics
    .filter((t) => !t.completed)
    .reduce((sum, t) => sum + (t.targetMinutes || 0), 0);

  const handleOpenAddModal = () => {
    setFormTitle('');
    setFormCategory('Gram Staining');
    setFormDifficulty('Foundational');
    setFormMinutes(30);
    setFormNotes('');
    setFormKeyTerms('');
    setEditingTopic(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (topic: StudyTopic) => {
    setEditingTopic(topic);
    setFormTitle(topic.title);
    setFormCategory(topic.category as CategoryType);
    setFormDifficulty(topic.difficulty);
    setFormMinutes(topic.targetMinutes);
    setFormNotes(topic.notes);
    setFormKeyTerms(topic.keyTerms ? topic.keyTerms.join(', ') : '');
    setIsAddModalOpen(true);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const termsArray = formKeyTerms
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingTopic) {
      onEditTopic(editingTopic.id, {
        title: formTitle.trim(),
        category: formCategory,
        difficulty: formDifficulty,
        targetMinutes: Number(formMinutes) || 15,
        notes: formNotes.trim(),
        keyTerms: termsArray,
      });
    } else {
      onAddTopic({
        title: formTitle.trim(),
        category: formCategory,
        completed: false,
        difficulty: formDifficulty,
        targetMinutes: Number(formMinutes) || 15,
        notes: formNotes.trim(),
        keyTerms: termsArray,
      });
      soundService.playFeedbackTone(587.33);
    }

    setIsAddModalOpen(false);
    setEditingTopic(null);
  };

  const handleToggle = (id: string, currentCompleted: boolean) => {
    onToggleComplete(id);
    if (!currentCompleted) {
      soundService.playFeedbackTone(659.25);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Summary Banner */}
      <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Microbiology Study Tracker
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{completedCount} of {totalCount} topics mastered</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-mono tabular-nums">{totalMinutesRemaining} min</span> estimated remaining
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Topic</span>
            </button>
          </div>
        </div>

        {/* Progress Bar with tabular nums */}
        <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden mb-5">
          <div
            className="bg-teal-400 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search topics, terms, or mechanisms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Segmented Status Tabs & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Segmented Control */}
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-slate-800 text-teal-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('incomplete')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === 'incomplete'
                    ? 'bg-slate-800 text-teal-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === 'completed'
                    ? 'bg-slate-800 text-teal-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter topics by category"
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

      {/* Topics List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#0b1322] border border-slate-800 rounded-xl">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300 mb-1">No matching topics found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Try adjusting your search query, changing the category filter, or restore the default microbiology syllabus.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleOpenAddModal}
                className="px-3.5 py-2 text-xs font-medium text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors"
              >
                Add Topic
              </button>
              <button
                onClick={onRestoreDefaults}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              >
                Restore Default Topics
              </button>
            </div>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            return (
              <div
                key={topic.id}
                className={`transition-all rounded-xl border bg-[#0b1322] ${
                  topic.completed
                    ? 'border-slate-800/80 bg-slate-900/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                  {/* Completion Checkbox */}
                  <button
                    onClick={() => handleToggle(topic.id, topic.completed)}
                    className="mt-0.5 text-slate-500 hover:text-teal-400 transition-colors focus:outline-none"
                    title={topic.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-teal-400" />
                    )}
                  </button>

                  {/* Main Topic Information */}
                  <div className="flex-1 min-w-0">
                    {/* Unboxed Metadata Header (No pills, clean typographic separators) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="text-teal-400/90 font-medium">{topic.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="font-mono tabular-nums">{topic.targetMinutes} min study</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{topic.difficulty}</span>
                      {topic.completed && topic.completedAt && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-teal-400">Completed</span>
                        </>
                      )}
                    </div>

                    <h3
                      onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      className={`text-base font-semibold cursor-pointer transition-colors ${
                        topic.completed
                          ? 'text-slate-400 line-through decoration-slate-600'
                          : 'text-white hover:text-teal-300'
                      }`}
                    >
                      {topic.title}
                    </h3>

                    {/* Preview / Notes */}
                    <p className={`text-xs text-slate-400 mt-1.5 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {topic.notes}
                    </p>

                    {/* Key terms */}
                    {topic.keyTerms && topic.keyTerms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-slate-400">
                        <span className="text-slate-500 font-mono text-[11px]">Terms:</span>
                        {topic.keyTerms.map((term, i) => (
                          <span key={i} className="text-slate-300">
                            {term}{i < topic.keyTerms!.length - 1 ? ' ·' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Topic Action Controls */}
                  <div className="flex items-center gap-1 shrink-0 self-start">
                    <button
                      onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                      title={isExpanded ? 'Collapse notes' : 'Expand notes'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(topic)}
                      className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors"
                      title="Edit Topic"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete topic "${topic.title}"?`)) {
                          onDeleteTopic(topic.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Delete Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Topic Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0b1322] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                {editingTopic ? 'Edit Study Topic' : 'Add New Microbiology Topic'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Endospore Staining with Malachite Green"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryType)}
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
                    Target Minutes
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={formMinutes}
                    onChange={(e) => setFormMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Foundational">Foundational</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Scientific Terms (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Malachite green, Safranin counterstain, Schaeffer-Fulton"
                  value={formKeyTerms}
                  onChange={(e) => setFormKeyTerms(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Study Notes & Core Mechanisms
                </label>
                <textarea
                  rows={3}
                  placeholder="Key concepts, lab protocol steps, or exam notes..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
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
                  {editingTopic ? 'Save Changes' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
