import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// Client-side image compression via Canvas API. PDFs pass through untouched.
async function compressImage(file, maxWidth = 1200, quality = 0.7) {
  if (file.type === 'application/pdf') return file;

  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = dataUrl;
  });

  const scale = Math.min(1, maxWidth / img.width);
  const canvas = document.createElement('canvas');
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  let q = quality;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', q));
    if (blob.size <= 2 * 1024 * 1024 || q <= 0.3) {
      return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
    }
    q -= 0.1;
  }
}

export default function FileUpload({
  label, accept, maxSizeMB = 5, onFileAccepted, error, required,
}) {
  const [status, setStatus] = useState('pending'); // pending | uploaded
  const [preview, setPreview] = useState(null);
  const [sizes, setSizes] = useState(null);

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length) {
      setStatus('pending');
      return;
    }
    const file = accepted[0];
    if (!file) return;
    const originalSize = file.size;
    const compressed = await compressImage(file);
    setSizes({ original: originalSize, compressed: compressed.size });
    setStatus('uploaded');
    if (compressed.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(compressed));
    } else {
      setPreview(null);
    }
    onFileAccepted(compressed);
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    maxFiles: 1,
  });

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700">
        {label}{required && ' *'}
      </span>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer min-h-[44px] ${
          isDragActive ? 'border-primary bg-blue-50' : 'border-slate-300'
        }`}
        aria-live="polite"
      >
        <input {...getInputProps()} />
        {status === 'uploaded' ? (
          <div className="flex flex-col items-center gap-2">
            {preview ? (
              <img src={preview} alt="Uploaded document preview" className="h-20 object-contain" />
            ) : (
              <span className="text-2xl">📄</span>
            )}
            <span className="text-xs text-accent">Uploaded ✓</span>
            {sizes && (
              <span className="text-xs text-slate-500">
                {(sizes.original / 1024).toFixed(0)}KB → {(sizes.compressed / 1024).toFixed(0)}KB
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-slate-500">
            Drag & drop, or click to select (max {maxSizeMB}MB)
          </span>
        )}
      </div>
      {error && <p role="alert" aria-live="polite" className="text-xs text-danger">{error}</p>}
    </div>
  );
}
