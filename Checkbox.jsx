import React, { forwardRef } from 'react';

const Checkbox = forwardRef(({ label, error, id, ...rest }, ref) => (
  <div>
    <label htmlFor={id} className="flex items-start gap-2 min-h-[44px] cursor-pointer">
      <input id={id} ref={ref} type="checkbox" className="h-4 w-4 mt-1" {...rest} />
      <span className="text-sm">{label}</span>
    </label>
    {error && <p role="alert" aria-live="polite" className="text-xs text-danger ml-6">{error}</p>}
  </div>
));

Checkbox.displayName = 'Checkbox';
export default Checkbox;
