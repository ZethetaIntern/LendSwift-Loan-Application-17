import React from 'react';

export default function StepNavigation({
  onPrevious, onNext, onSaveDraft, isFirst, isLast, nextLabel = 'Next',
}) {
  return (
    <div className="flex justify-between items-center mt-8 gap-3">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirst}
        className="min-h-[44px] px-4 py-2 rounded-md border border-slate-300 disabled:opacity-40"
      >
        Previous
      </button>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          className="min-h-[44px] px-4 py-2 rounded-md border border-slate-300"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onNext}
          className="min-h-[44px] px-5 py-2 rounded-md bg-primary text-white"
        >
          {isLast ? 'Submit Application' : nextLabel}
        </button>
      </div>
    </div>
  );
}
