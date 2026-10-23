import { StudyTopic, Flashcard, QuizAttempt, StudyStats } from '../types/microbiology';
import { INITIAL_TOPICS, INITIAL_FLASHCARDS } from '../data/microbiologyData';

const STORAGE_KEYS = {
  TOPICS: 'microbuddy_topics_v1',
  FLASHCARDS: 'microbuddy_flashcards_v1',
  QUIZ_HISTORY: 'microbuddy_quiz_history_v1',
  STATS: 'microbuddy_study_stats_v1',
  ACTIVE_TAB: 'microbuddy_active_tab_v1',
} as const;

export const storage = {
  getTopics(): StudyTopic[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TOPICS);
      if (!data) return INITIAL_TOPICS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TOPICS;
    } catch {
      return INITIAL_TOPICS;
    }
  },

  saveTopics(topics: StudyTopic[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
    } catch (e) {
      console.warn('MicroBuddy: Unable to save topics to localStorage', e);
    }
  },

  getFlashcards(): Flashcard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (!data) return INITIAL_FLASHCARDS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FLASHCARDS;
    } catch {
      return INITIAL_FLASHCARDS;
    }
  },

  saveFlashcards(flashcards: Flashcard[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
    } catch (e) {
      console.warn('MicroBuddy: Unable to save flashcards to localStorage', e);
    }
  },

  getQuizHistory(): QuizAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveQuizAttempt(attempt: QuizAttempt): QuizAttempt[] {
    try {
      const history = this.getQuizHistory();
      const updated = [attempt, ...history].slice(0, 20); // keep last 20
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('MicroBuddy: Unable to save quiz attempt', e);
      return [];
    }
  },

  getStudyStats(): StudyStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) {
        return {
          totalFocusMinutes: 45,
          sessionsCompleted: 2,
          lastActiveDate: new Date().toISOString().split('T')[0],
        };
      }
      return JSON.parse(data);
    } catch {
      return {
        totalFocusMinutes: 45,
        sessionsCompleted: 2,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
    }
  },

  saveStudyStats(stats: StudyStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('MicroBuddy: Unable to save study stats', e);
    }
  },

  resetAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOPICS);
      localStorage.removeItem(STORAGE_KEYS.FLASHCARDS);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.STATS);
    } catch (e) {
      console.warn('MicroBuddy: Failed to reset localStorage', e);
    }
  },

  exportBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      topics: this.getTopics(),
      flashcards: this.getFlashcards(),
      quizHistory: this.getQuizHistory(),
      stats: this.getStudyStats(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.topics)) this.saveTopics(data.topics);
      if (Array.isArray(data.flashcards)) this.saveFlashcards(data.flashcards);
      if (Array.isArray(data.quizHistory)) {
        localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(data.quizHistory));
      }
      if (data.stats) this.saveStudyStats(data.stats);
      return true;
    } catch {
      return false;
    }
  }
};
