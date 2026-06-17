import React from 'react';

interface SummaryCardProps {
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-teal-400 mb-4 border-b border-slate-750 pb-2">Document Summary</h3>
      <div className="prose prose-invert text-slate-355 max-w-none whitespace-pre-line leading-relaxed text-sm">
        {summary}
      </div>
    </div>
  );
};
