import { useEffect } from 'react';

export function useInterval(fn: () => void, intervalMs: number = 1000) {
  useEffect(() => {
    let intervalId = setTimeout(function run() {
      fn();
      intervalId = setTimeout(run, intervalMs);
    }, intervalMs);
    return () => clearTimeout(intervalId);
  }, [fn]);
}
