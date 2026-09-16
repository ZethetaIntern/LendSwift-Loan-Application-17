import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function SignatureCanvasField({ label, onChange, error }) {
  const sigRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleEnd = () => {
    if (sigRef.current) {
      const empty = sigRef.current.isEmpty();
      setIsEmpty(empty);
      onChange(empty ? null : sigRef.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    sigRef.current.clear();
    setIsEmpty(true);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="border border-slate-300 rounded-md w-full max-w-md">
        <SignatureCanvas
          ref={sigRef}
          penColor="#1F4E79"
          canvasProps={{ className: 'w-full h-40', 'aria-label': 'Signature capture area' }}
          onEnd={handleEnd}
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="self-start text-sm text-primary underline min-h-[44px]"
      >
        Clear
      </button>
      {isEmpty && error && (
        <p role="alert" aria-live="polite" className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
