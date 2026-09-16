import { useState, useCallback } from 'react';

// Simulates an NSDL/UIDAI verification call: 1.5s delay, success for valid
// format, failure otherwise. No real network call is made.
export function useVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);

  const verify = useCallback((isValidFormat) => {
    setIsVerifying(true);
    setIsVerified(false);
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsVerifying(false);
        if (isValidFormat) {
          setIsVerified(true);
          resolve(true);
        } else {
          setError('Verification failed');
          resolve(false);
        }
      }, 1500);
    });
  }, []);

  const reset = useCallback(() => {
    setIsVerifying(false);
    setIsVerified(false);
    setError(null);
  }, []);

  return {
    isVerifying, isVerified, error, verify, reset,
  };
}
