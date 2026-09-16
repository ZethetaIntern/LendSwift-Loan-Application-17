import React from 'react';

export default function ResumeModal({ loanType, onResume, onStartFresh }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="font-semibold text-lg mb-2">Welcome back</h2>
        <p className="text-sm text-slate-600 mb-4">
          You have a saved application for {loanType || 'a loan'}. Resume where you left off or start fresh?
        </p>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onStartFresh} className="min-h-[44px] px-4 py-2 rounded-md border border-slate-300">
            Start Fresh
          </button>
          <button type="button" onClick={onResume} className="min-h-[44px] px-4 py-2 rounded-md bg-primary text-white">
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
