import React from 'react';

export default function SuccessModal({ referenceNumber, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
        <div className="text-4xl mb-2">✅</div>
        <h2 className="font-semibold text-lg mb-2">Application Submitted</h2>
        <p className="text-sm text-slate-600 mb-1">Your reference number is:</p>
        <p className="font-mono text-sm bg-slate-100 rounded px-3 py-2 mb-4 break-all">{referenceNumber}</p>
        <button type="button" onClick={onClose} className="min-h-[44px] px-4 py-2 rounded-md bg-primary text-white">
          Close
        </button>
      </div>
    </div>
  );
}
