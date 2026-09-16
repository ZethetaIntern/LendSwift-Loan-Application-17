import React, { forwardRef } from 'react';
import { formatINR } from '../../utils/emiCalculator';

// Shows a live INR-formatted preview under a plain number input.
// Kept as an uncontrolled input so it works directly with RHF's register().
const CurrencyInput = forwardRef(({
  label, error, id, value, ...rest
}, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
      <input
        id={id}
        ref={ref}
        type="number"
        inputMode="numeric"
        className={`w-full min-h-[44px] rounded-md border pl-7 pr-3 py-2 focus-ring ${
          error ? 'border-danger' : 'border-slate-300'
        }`}
        aria-invalid={!!error}
        {...rest}
      />
    </div>
    {value > 0 && !error && (
      <p className="text-xs text-slate-500">{formatINR(Number(value))}</p>
    )}
    {error && <p role="alert" aria-live="polite" className="text-xs text-danger">{error}</p>}
  </div>
));

CurrencyInput.displayName = 'CurrencyInput';
export default CurrencyInput;
