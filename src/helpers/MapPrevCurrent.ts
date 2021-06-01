type CallbackPrev<T, R> = (prev: T | undefined, cur: T, index: number) => R;

export function mapPrevCurrent<T, R = any>(
  items: T[],
  callback: CallbackPrev<T, R>
): R[] {
  const result: R[] = [];
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

export function mapCurrentNext<T, R = any>(
  items: T[],
  callback: CallbackNext<T, R>
): R[] {
  const result: R[] = [];
  for (let i = 0; i < items.length; i++) {
    if (i === items.length - 1) {
      result.push(callback(items[i], undefined, i));
    } else {
      result.push(callback(items[i], items[i + 1], i));
    }
  }
  return result;
}
