import { useState, useCallback } from 'react';
import pinCodeData from '../utils/pinCodeData.json';

export function usePinCodeLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lookup = useCallback((pin) => new Promise((resolve) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      const match = pinCodeData[pin];
      if (match) {
        resolve(match);
      } else {
        setError('PIN code not found in our records - please enter city/state manually');
        resolve(null);
      }
    }, 500);
  }), []);

  return { lookup, isLoading, error };
}
