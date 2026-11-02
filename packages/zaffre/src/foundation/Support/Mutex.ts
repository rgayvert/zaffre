type ResolveFn = (value?: any) => void;

export class Mutex {
  locked = false;
  queue: ResolveFn[] = [];
  async acquire() {
    if (!this.locked) {
      this.locked = true;
      return Promise.resolve();
    } else {
      return new Promise((resolve) => this.queue.push(resolve));
    }
  }
  release(): void {
    const fn = this.queue.shift();
    if (fn) {
      fn();
    } else {
      this.locked = false;
    }
  }
}
