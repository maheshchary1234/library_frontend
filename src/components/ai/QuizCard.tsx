import React, { useState } from 'react';
import { QuizQuestion } from '../../services/aiService';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleOptionClick = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
  };

  const handleAnswerSubmit = () => {
    if (!selectedOption || answered) return;
    setAnswered(true);
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setAnswered(false);
    setSelectedOption(null);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
      if (onComplete) {
        onComplete(score);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-800 border border-slate-700 rounded-2xl">
        No quiz questions available.
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="w-full max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <h3 className="text-3xl font-extrabold text-white">Quiz Completed!</h3>
        <p className="text-slate-400 text-sm">Here is how you performed on this document:</p>
        
        <div className="py-6 flex flex-col items-center">
          <div className="text-6xl font-extrabold text-teal-400">
            {score} <span className="text-3xl text-slate-500">/ {questions.length}</span>
          </div>
          <div className="text-slate-355 font-semibold text-lg mt-3">
            {score === questions.length ? 'Perfect Score! 🎉' : score >= questions.length / 2 ? 'Good Job! 👍' : 'Keep Studying! 📚'}
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Retake Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl space-y-6">
      {/* Progress Header */}
      <div className="flex justify-between items-center text-sm font-semibold border-b border-slate-750 pb-4">
        <span className="text-teal-400">Question {currentIdx + 1} of {questions.length}</span>
        <span className="text-slate-500">Score: {score}</span>
      </div>

      {/* Question */}
      <h3 className="text-xl font-bold text-white leading-snug">
        {currentQuestion.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option) => {
          let optionStyle = "bg-slate-900 border-slate-750 text-slate-200 hover:bg-slate-750/30";
          if (selectedOption === option) {
            optionStyle = "bg-teal-900/30 border-teal-500 text-teal-200";
          }
          if (answered) {
            if (option === currentQuestion.answer) {
              optionStyle = "bg-teal-900/40 border-teal-500 text-teal-200";
            } else if (selectedOption === option) {
              optionStyle = "bg-red-900/40 border-red-500 text-red-200";
            } else {
              optionStyle = "bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed";
            }
          }

          return (
            <button
              key={option}
              disabled={answered}
              onClick={() => handleOptionClick(option)}
              className={`w-full text-left px-5 py-4 border rounded-xl font-medium transition-all flex justify-between items-center ${optionStyle}`}
            >
              <span>{option}</span>
              {answered && option === currentQuestion.answer && (
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
              )}
              {answered && selectedOption === option && option !== currentQuestion.answer && (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {answered && (
        <div className="p-4 bg-slate-900/60 border border-slate-750 rounded-xl space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Explanation</h4>
          <p className="text-sm text-slate-300">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-4 flex justify-end">
        {!answered ? (
          <button
            onClick={handleAnswerSubmit}
            disabled={!selectedOption}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <span>{currentIdx + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
