import { useEffect, useState } from 'react';
import { decryptData } from '../utils/encryption';
import { draftKey, TTL_HOURS } from './useAutoSave';

export function useFormPersistence(loanType) {
  const [draft, setDraft] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(draftKey(loanType));
    if (!raw) { setChecked(true); return; }
    try {
      const { payload, metadata } = JSON.parse(raw);
      const ageHours = (Date.now() - new Date(metadata.timestamp).getTime()) / 36e5;
      if (ageHours > TTL_HOURS) {
        localStorage.removeItem(draftKey(loanType));
        setChecked(true);
        return;
      }
      decryptData(payload).then((data) => {
        setDraft({ data, metadata });
        setChecked(true);
      }).catch(() => {
        localStorage.removeItem(draftKey(loanType));
        setChecked(true);
      });
    } catch {
      localStorage.removeItem(draftKey(loanType));
      setChecked(true);
    }
  }, [loanType]);

  return { draft, checked, dismissDraft: () => setDraft(null) };
}
