import { zlog } from "../Util";
import { Atom, AtomOptions } from "./Atom";

//
// A PollAtom atom evaluates a given function every interval msecs until the function does not return
// undefined, or until the given timeout is exceeded.
//

export interface PollAtomOptions extends AtomOptions {
  initialDelay?: number;
}
export function pollAtom<T>(fn: () => T | undefined, timeout: number, interval: number, options: PollAtomOptions = {}): PollAtom<T> {
  return new PollAtom(fn, timeout, interval, options);
}

async function waitUntil(condition: () => boolean, interval: number) {
  while (!condition()) {
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return;
}
export class PollAtom<T> extends Atom<T | undefined> {
  timerRef?: ReturnType<typeof setTimeout>;
  elapsedMillis = 0;
  startMillis = 0;
  timedOut = false;
  
  constructor(public fn: () => T | undefined,  protected timeout: number, protected interval: number, public options: PollAtomOptions) {
    super(fn(), options);
    this.startMillis = Date.now();
    if (!this.done()) {
      this.eval();
    }
  }
  done(): boolean {
    return Boolean(this.get()) || this.timedOut;
  }
  eval(): void {
    //zlog.info("eval: "+this.id);
    setTimeout(() => {
      const val = this.fn();
      //zlog.info("PollAtom("+this.id+").eval: val="+val);

      this.timedOut = Date.now() - this.startMillis >= this.timeout;
      if (val || this.timedOut) {
        //zlog.info("PollAtom("+this.id+").eval + setAndFire: val="+val);
        this.setAndFire(val);
      } else {
        //zlog.info("PollAtom("+this.id+") calling eval again, interval="+this.interval);
        this.eval();
      }
    }, this.interval);
  }
  async wait(): Promise<T | undefined> {
    await waitUntil(() => this.done(), this.interval);
    //zlog.info("PollAtom("+this.id+").wait");
    return this.get();
  }

}

