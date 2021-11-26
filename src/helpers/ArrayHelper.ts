type CallbackPrev<T, R> = (prev: T | undefined, cur: T, index: number) => R;

export function iterPrevCurrent<T>(
  items: T[],
  callback: CallbackPrev<T, void>
) {
  for (let i = 0; i < items.length; i++) {
    if (i === 0) {
      callback(undefined, items[i], i);
    } else {
      callback(items[i - 1], items[i], i);
    }
  }
}

export function mapPrevCurrent<T, Result = any>(
  items: T[],
  callback: CallbackPrev<T, Result>
): Result[] {
  const result: Result[] = [];
  for (let i = 0; i < items.length; i++) {
    if (i === 0) {
      result.push(callback(undefined, items[i], i));
    } else {
      result.push(callback(items[i - 1], items[i], i));
    }
  }
  return result;
}

type CallbackNext<T, R> = (cur: T, next: T | undefined, index: number) => R;

export function mapCurrentNext<T, Result = any>(
  items: T[],
  callback: CallbackNext<T, Result>
): Result[] {
  const result: Result[] = [];
  for (let i = 0; i < items.length; i++) {
    if (i === items.length - 1) {
      result.push(callback(items[i], undefined, i));
    } else {
      result.push(callback(items[i], items[i + 1], i));
    }
  }
  return result;
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
