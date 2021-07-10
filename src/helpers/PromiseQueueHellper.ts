interface PromiseQueueItem {
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: <T extends Error>(err: T) => void;
}

export default class PromiseQueue {
  private queue: PromiseQueueItem[] = [];
  private pendingPromise: boolean = false;

  add(promise: () => Promise<any>) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        execute: promise,
        resolve,
        reject,
      });
    });
  }

  run() {
    if (this.pendingPromise) {
      return;
    }

    const item = this.queue.shift();

    if (!item) {
      return;
    }

    this.pendingPromise = true;
    item
      ?.execute()
      .then((value) => {
        item.resolve(value);
      })
      .catch((err) => {
        item?.reject(err);
      })
      .finally(() => {
        this.pendingPromise = false;
        this.run();
      });
  }
}
