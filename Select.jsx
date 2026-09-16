import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label, error, id, options, placeholder, ...rest
}, ref) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
    )}
    <select
      id={id}
      ref={ref}
      className={`w-full min-h-[44px] rounded-md border px-3 py-2 bg-white focus-ring ${
        error ? 'border-danger' : 'border-slate-300'
      }`}
      aria-invalid={!!error}
      {...rest}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p role="alert" aria-live="polite" className="text-xs text-danger">{error}</p>}
  </div>
));

Select.displayName = 'Select';
export default Select;
