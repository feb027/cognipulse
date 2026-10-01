/**
 * Stroop Component: StroopFeedback
 * Umpan balik visual instan untuk respon Go vs No-Go.
 */

import React from 'react';

interface StroopFeedbackProps {
  feedback: { isSuccess: boolean; text: string } | null;
}

export const StroopFeedback: React.FC<StroopFeedbackProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div
      className={`px-3 py-1.5 rounded text-xs font-mono font-semibold border ${
        feedback.isSuccess
          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
          : 'bg-rose-950/80 text-rose-300 border-rose-800'
      }`}
    >
      {feedback.text}
    </div>
  );
};
