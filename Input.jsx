import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label, error, helpText, id, ...rest
}, ref) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
    )}
    <input
      id={id}
      ref={ref}
      className={`w-full min-h-[44px] rounded-md border px-3 py-2 focus-ring ${
        error ? 'border-danger' : 'border-slate-300'
      }`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...rest}
    />
    {helpText && !error && <p className="text-xs text-slate-500">{helpText}</p>}
    {error && (
      <p id={`${id}-error`} role="alert" aria-live="polite" className="text-xs text-danger">
        {error}
      </p>
    )}
  </div>
));

Input.displayName = 'Input';
export default Input;
