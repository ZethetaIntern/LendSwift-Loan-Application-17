import React from 'react';

export default function ProgressBar({ steps, currentStep }) {
  const activeSteps = steps.filter((s) => s.active);
  const currentIndex = activeSteps.findIndex((s) => s.number === currentStep);
  const pct = Math.round(((currentIndex + 1) / activeSteps.length) * 100);

  return (
    <div className="mb-6">
      <div
        className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Step ${currentIndex + 1} of ${activeSteps.length}`}
      >
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-slate-500 mt-2">
        Step {currentIndex + 1} of {activeSteps.length}: {activeSteps[currentIndex]?.label}
      </p>
    </div>
  );
}
