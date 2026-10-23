export type CategoryType =
  | 'Gram Staining'
  | 'Cell Structure'
  | 'Sterilization'
  | 'Bacterial Physiology'
  | 'Antimicrobial Agents';

export type DifficultyLevel = 'Foundational' | 'Intermediate' | 'Advanced';

export interface StudyTopic {
  id: string;
  title: string;
  category: CategoryType | string;
  completed: boolean;
  targetMinutes: number;
  difficulty: DifficultyLevel;
  notes: string;
  keyTerms?: string[];
  completedAt?: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  category: CategoryType | string;
  question: string;
  answer: string;
  mnemonic?: string;
  keyTakeaway?: string;
  status: 'unstudied' | 'learning' | 'mastered';
  starred?: boolean;
}

export interface QuizQuestion {
  id: string;
  category: CategoryType | string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizAttempt {
  id: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface StudyStats {
  totalFocusMinutes: number;
  sessionsCompleted: number;
  lastActiveDate: string;
}
