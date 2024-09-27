import { Atom, AtomOptions, BasicAction, atom } from "./Atom";

//
// A timer atom changes its value at a given interval (in msec) according to a given function.
//
// TODO: allow interval to be (t, idx) => number
//

export interface TimerAtomOptions extends AtomOptions {
  beforeStart?: BasicAction;
  afterStop?: BasicAction;
  runImmediately?: boolean;
}
export function timerAtom<T>(fn: (msec: number) => T, interval: number | number[] = 1000, options: TimerAtomOptions = {}): TimerAtom<T> {
  return new TimerAtom(fn, interval, options);
}

type TimerState = "stopped" | "running" | "paused";

export class TimerAtom<T> extends Atom<T> {
  timerRef?: ReturnType<typeof setTimeout>;
  state: Atom<TimerState> = atom("stopped");
  elapsedMillis = 0;
  lastMillis = 0;
  intervalIndex = 0;
  intervals: number[];

  constructor(public fn: (msec: number) => T,  protected interval: number | number[], public options: TimerAtomOptions) {
    super(fn(0), options);
    this.intervals = Array.isArray(interval) ? interval : [interval];
    if (this.options.runImmediately) {
      this.start();
    }
  }
  isStopped(): boolean {
    return this.state.get() === "stopped";
  }
  isRunning(): boolean {
    return this.state.get() === "running";
  }
  isPaused(): boolean {
    return this.state.get() === "paused";
  }
  setState(newState: TimerState): void {
    this.state.set(newState);
  }
  elapsedMilliseconds(): number {
    return this.elapsedMillis;
  }
  setElapsedMillis(millis: number): void {
    this.elapsedMillis = millis;
    this.updateValue();
  }
  setTimer(): void {
    this.timerRef = setTimeout(() => this.increment(), this.intervals[this.intervalIndex]);
    if (this.intervals.length > 1) {
      this.intervalIndex = (this.intervalIndex + 1) % this.intervals.length;
    }
  }
  start(): void {
    if (!this.isRunning()) {
      this.options.beforeStart?.();
      this.lastMillis = Date.now();
      this.setElapsedMillis(0);
      this.setTimer();
      this.state.set("running");
    }
  }
  increment(): void {
    const now = Date.now();
    this.elapsedMillis += (now - this.lastMillis);
    this.lastMillis = now;
    this.updateValue();
    if (this.isRunning()) {
      this.setTimer();
    }
  }
  updateValue(): void {
    this.set(this.fn(this.elapsedMillis));
  }
  clearTimer(): void {
    if (this.timerRef) {
      clearTimeout(this.timerRef);
      this.timerRef = undefined;
    }
  }
  pause(): void {
    if (this.isRunning()) {
      this.clearTimer();
      this.state.set("paused");
    }
  }
  stop(): void {
    this.clearTimer();
    this.intervalIndex = 0;
    this.state.set("stopped");
    this.options.afterStop?.();
  }
  resume(): void {
    if (this.isPaused()) {
      this.lastMillis = Date.now();
      this.setTimer();
      this.state.set("running");
    }
  }
  toggle(): void {
    if (this.isRunning()) {
      this.stop();
    } else {
      this.start();
    }
  }
  restart(): void {
    this.stop();
    this.start();
  }
}
