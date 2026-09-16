import React, { forwardRef } from 'react';

const RadioGroup = forwardRef(({
  label, error, name, options, value, onChange, onBlur,
}, ref) => (
  <div className="flex flex-col gap-2">
    {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
    <div className="flex flex-wrap gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 min-h-[44px] cursor-pointer">
          <input
            type="radio"
            ref={ref}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            onBlur={onBlur}
            className="h-4 w-4"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
    {error && <p role="alert" aria-live="polite" className="text-xs text-danger">{error}</p>}
  </div>
));

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
