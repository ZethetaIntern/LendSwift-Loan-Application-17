import React, { forwardRef, useState } from 'react';

// Text input that masks its value once verified/blurred, showing only the
// last 4 characters, per the PII masking requirement.
const MaskedInput = forwardRef(({
  label, error, id, verified, verifiedValue, onReveal, ...rest
}, ref) => {
  const [revealed, setRevealed] = useState(false);

  if (verified && !revealed) {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        <div className="flex items-center gap-2 min-h-[44px] rounded-md border border-accent bg-green-50 px-3">
          <span className="text-accent">✓</span>
          <span className="font-mono">{verifiedValue}</span>
          <button
            type="button"
            className="ml-auto text-xs text-primary underline"
            onClick={() => { setRevealed(true); if (onReveal) onReveal(); }}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        id={id}
        ref={ref}
        className={`w-full min-h-[44px] rounded-md border px-3 py-2 font-mono focus-ring ${
          error ? 'border-danger' : 'border-slate-300'
        }`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <p role="alert" aria-live="polite" className="text-xs text-danger">{error}</p>}
    </div>
  );
});

MaskedInput.displayName = 'MaskedInput';
export default MaskedInput;
