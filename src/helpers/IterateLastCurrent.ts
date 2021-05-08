type Callback<T, R> = (last: T | undefined, cur: T, index: number) => R;

export function mapPrevCurrent<T, R = any>(
  items: T[],
  callback: Callback<T, R>
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
