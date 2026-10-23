import React, { useState } from 'react';
import { QuizQuestion, QuizAttempt } from '../types/microbiology';
import { soundService } from '../utils/audio';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shuffle,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  quizHistory: QuizAttempt[];
  onSaveQuizAttempt: (attempt: QuizAttempt) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  quizHistory,
  onSaveQuizAttempt,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>(questions);
  const [instantFeedback, setInstantFeedback] = useState(true);

  const currentQ = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).reduce((count, [qIdxStr, chosenOption]) => {
    const qIndex = Number(qIdxStr);
    const q = shuffledQuestions[qIndex];
    if (q && chosenOption === q.correctAnswerIndex) {
      return count + 1;
    }
    return count;
  }, 0);

  const percentageScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handleSelectOption = (optionIndex: number) => {
    if (isQuizSubmitted) return;
    if (instantFeedback && isAnswered) return; // prevent changing after revealed

    const updated = {
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    };
    setSelectedAnswers(updated);

    if (optionIndex === currentQ.correctAnswerIndex) {
      soundService.playFeedbackTone(659.25);
    } else {
      soundService.playFeedbackTone(330);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    setIsQuizSubmitted(true);
    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      score: correctCount,
      total: totalQuestions,
      percentage: percentageScore,
      date: new Date().toISOString(),
    };
    onSaveQuizAttempt(newAttempt);
    soundService.playTimerCompleteChime();
  };

  const handleRetake = (shuffle = false) => {
    let nextQuestions = [...questions];
    if (shuffle) {
      nextQuestions = nextQuestions.sort(() => Math.random() - 0.5);
    }
    setShuffledQuestions(nextQuestions);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsQuizSubmitted(false);
  };

  const highestScore = quizHistory.length > 0
    ? Math.max(...quizHistory.map((h) => h.percentage))
    : null;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Microbiology Knowledge Challenge
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{totalQuestions} high-yield exam questions</span>
              <span aria-hidden="true">·</span>
              <span>Gram Staining, Cell Wall, Autoclaving & Antibiotics</span>
              {highestScore !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-teal-400 font-mono tabular-nums">All-time High: {highestScore}%</span>
                </>
              )}
            </div>
          </div>

          {!isQuizSubmitted && (
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={instantFeedback}
                  onChange={(e) => setInstantFeedback(e.target.checked)}
                  className="rounded border-slate-700 text-teal-500 focus:ring-0 bg-slate-900"
                />
                <span>Instant Explanation Mode</span>
              </label>
            </div>
          )}
        </div>

        {/* Progress bar across questions */}
        {!isQuizSubmitted && (
          <div className="mt-4 pt-3 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-mono tabular-nums text-slate-300">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-teal-400 font-mono tabular-nums">
                Answered: {Object.keys(selectedAnswers).length}/{totalQuestions}
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-teal-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* QUIZ ACTIVE VIEW */}
      {!isQuizSubmitted ? (
        <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-xl">
          {/* Question Category & Difficulty */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <span className="text-teal-400 font-medium">{currentQ.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Difficulty: {currentQ.difficulty}</span>
          </div>

          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white leading-relaxed mb-6">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;
              const showResult = instantFeedback && isAnswered;

              let optionStyle = 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200';

              if (showResult) {
                if (isCorrect) {
                  optionStyle = 'border-teal-500 bg-teal-950/40 text-teal-200';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                } else {
                  optionStyle = 'border-slate-800/60 bg-slate-900/40 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-teal-400 bg-teal-500/15 text-white';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${optionStyle}`}
                >
                  <span className="w-6 h-6 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-xs font-mono font-semibold shrink-0 text-slate-300">
                    {letter}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed flex-1 mt-0.5">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant explanation callout */}
          {instantFeedback && isAnswered && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm space-y-1 mb-6">
              <div className="flex items-center gap-2 font-semibold text-teal-400">
                <HelpCircle className="w-4 h-4" />
                <span>Microbiology Explanation:</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-6">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Bottom navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
            >
              Previous Question
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 disabled:opacity-40 disabled:hover:bg-teal-400 rounded-lg shadow-sm transition-colors"
            >
              <span>{currentQuestionIndex === totalQuestions - 1 ? 'Finish & See Score' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ RESULTS VIEW */
        <div className="bg-[#0b1322] border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl">
          <div className="text-center pb-6 border-b border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto mb-3">
              <Trophy className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-white font-display">
              Quiz Completed!
            </h3>

            <div className="text-4xl font-extrabold text-teal-400 font-mono tabular-nums my-2">
              {correctCount} / {totalQuestions} ({percentageScore}%)
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              {percentageScore >= 85
                ? 'Excellent mastery of core microbiology principles and laboratory protocols!'
                : percentageScore >= 70
                ? 'Solid understanding of Gram staining and cell structures. Review the explanations below to polish your knowledge.'
                : 'Good effort! Review the flashcards and study notes on sterilization and bacterial cell walls to strengthen your fundamentals.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <button
                onClick={() => handleRetake(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Same Questions</span>
              </button>
              <button
                onClick={() => handleRetake(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                <span>Shuffle & Retake</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-200">
              Exam Review & Explanations:
            </h4>

            {shuffledQuestions.map((q, idx) => {
              const chosen = selectedAnswers[idx];
              const isCorrect = chosen === q.correctAnswerIndex;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono tabular-nums text-slate-400 font-semibold">Q{idx + 1}.</span>
                      <span className="text-teal-400">{q.category}</span>
                    </div>
                    {isCorrect ? (
                      <span className="text-xs text-teal-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-xs text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Missed
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 font-medium">
                    {q.question}
                  </p>

                  <div className="text-xs text-slate-400 space-y-1 pt-1">
                    <div>
                      <span className="text-slate-500 font-semibold">Correct Answer: </span>
                      <span className="text-teal-300">{q.options[q.correctAnswerIndex]}</span>
                    </div>
                    {!isCorrect && chosen !== undefined && (
                      <div>
                        <span className="text-slate-500 font-semibold">Your Selection: </span>
                        <span className="text-rose-300">{q.options[chosen]}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 pt-1.5 border-t border-slate-800/80 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
