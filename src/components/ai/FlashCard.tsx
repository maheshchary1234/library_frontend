import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

interface FlashcardProps {
  question: string;
  answer: string;
}

export const FlashCard: React.FC<FlashcardProps> = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-full max-w-md h-64 mx-auto cursor-pointer perspective"
    >
      <div
        className={`relative w-full h-full duration-500 preserve-3d transition-transform ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-xl backface-hidden">
          <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">Question</div>
          <div className="flex-1 flex items-center justify-center text-center text-lg font-bold text-white px-4">
            {question}
          </div>
          <div className="flex justify-center items-center text-xs text-teal-400 font-semibold gap-1.5">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click to flip and reveal answer</span>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full bg-teal-950/40 border border-teal-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-xl backface-hidden rotate-y-180">
          <div className="text-teal-400 font-bold text-xs uppercase tracking-wider">Answer</div>
          <div className="flex-1 flex items-center justify-center text-center text-md font-medium text-slate-200 px-4 whitespace-pre-line">
            {answer}
          </div>
          <div className="flex justify-center items-center text-xs text-teal-400 font-semibold gap-1.5">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click to flip back to question</span>
          </div>
        </div>
      </div>
    </div>
  );
};
