import { useEffect } from 'react';

export function useInterval(fn: () => void, intervalMs: number = 1000) {
  useEffect(() => {
    const intervalId = setInterval(fn, intervalMs);
    return () => clearInterval(intervalId);
  }, [fn, intervalMs]);
}
