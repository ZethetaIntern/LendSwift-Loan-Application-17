import { useEffect, useRef, useState } from 'react';
import { encryptData } from '../utils/encryption';

const SCHEMA_VERSION = '1.0';
const TTL_HOURS = 72;

export function draftKey(loanType) {
  return `lendswift_draft_${loanType || 'unset'}`;
}

/**
 * Serialises `formState` to encrypted localStorage every `interval` ms
 * while it changes. Non-blocking: encryption + write happen in a
 * fire-and-forget async call so typing is never delayed.
 */
export function useAutoSave(formState, currentStep, loanType, interval = 30000) {
  const timerRef = useRef(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const payload = await encryptData(formState);
        const metadata = {
          version: SCHEMA_VERSION,
          timestamp: new Date().toISOString(),
          step: currentStep,
          loanType,
        };
        localStorage.setItem(draftKey(loanType), JSON.stringify({ payload, metadata }));
        setLastSavedAt(new Date());
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (err) {
        // Auto-save failures should never interrupt the user's flow.
        // eslint-disable-next-line no-console
        console.warn('Auto-save failed:', err.message);
      }
    }, interval);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formState), currentStep, loanType, interval]);

  return { lastSavedAt, showToast };
}

export function clearDraft(loanType) {
  localStorage.removeItem(draftKey(loanType));
}

export { SCHEMA_VERSION, TTL_HOURS };
