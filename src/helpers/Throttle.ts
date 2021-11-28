export default function throttle(func: (...args: any[]) => void, ms: number) {
  let timer: number | undefined;

  function wrapper(this: any, ...args: any[]) {
    if (timer !== undefined) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      func.apply(this, args);
    }, ms);
  }

  return wrapper;
}
