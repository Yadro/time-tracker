import { useCallback, useState } from 'react';

type Value = boolean | number | string | any[] | Record<string, any>;
type ParseFn<T> = (raw: string) => T;

function readFromStorage<T extends Value>(
  key: string,
  valueParse?: ParseFn<T>
): T | null {
  const raw = window.localStorage.getItem(key);
  if (raw === null) {
    return raw;
  }
  try {
    const value = JSON.parse(raw);
    if (typeof valueParse === 'function') {
      return valueParse(value);
    }
    return value;
  } catch {
    return null;
  }
}

export default function useLocalStorage<T extends Value>(
  key: string,
  defaultValue: T,
  getFromStorageFirst: boolean,
  valueParse?: (raw: string) => T
): [T, (t: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (getFromStorageFirst) {
      return readFromStorage(key, valueParse) ?? defaultValue;
    }
    return defaultValue;
  });

  const setItem = useCallback(
    (value: T) => {
      window.localStorage.setItem(key, JSON.stringify(value));
      setValue(value);
    },
    [key]
  );

  return [value, setItem];
}
