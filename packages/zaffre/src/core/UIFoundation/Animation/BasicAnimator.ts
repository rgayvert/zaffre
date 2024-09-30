import { Atom, atom, toggleAtom } from ":foundation";
import { AnimationItem } from "./AnimationItem";

//
// An Animator runs an Animation using window.requestAnimationFrame(). It contains a list
// of items, each of which gets called with step() for each animation frame.
// 
// An animator maintains a state (running/stopped/paused), so it will only request a
// frame when it in a running state. 
// 

export interface AnimatorOptions {
  duration?: number;
}
export type AnimatorState = "running" | "stopped" | "paused";


export class BasicAnimator {
  startTimestamp = 0;
  previousTimestamp = 0;
  elapsed = 0;
  duration: number;
  items: Set<AnimationItem> = new Set([]);
  state: Atom<AnimatorState> = atom("stopped");
  running = toggleAtom(false, { action: (b) => b ? this.start(): this.stop() });

  constructor(options: AnimatorOptions = {}) {
    this.duration = options.duration || Number.MAX_VALUE;
  }
  setItems(items: Iterable<AnimationItem>): void {
    this.items = new Set([...items]);
  }

  add(...elts: AnimationItem[]): void {
    elts.forEach((elt) => this.items.add(elt));
  }
  remove(elt: AnimationItem): void {
    this.items.delete(elt);
  }
  requestFrame(): void {
    if (this.isRunning) {
      window.requestAnimationFrame((ms) => this.step(ms));
    }
  }
  get isRunning(): boolean {
    return this.state.get() === "running";
  }
  start(): void {
    if (this.state.get() !== "running") {
      this.state.set("running");
      this.running.set(true);
      this.items.forEach((item) => item.begin?.());
      this.requestFrame();
    }
  }
  stop(): void {
    this.state.set("stopped");
    this.running.set(false);
    this.startTimestamp = 0;
    this.items.forEach((item) => item.end?.());
  }
  pause(): void {
    this.state.set("paused");
    this.startTimestamp = 0;
  }
  resume(): void {
    this.start();
  }

  step(timestamp: number): void {
    if (!this.isRunning) {
      return;
    }
    if (this.startTimestamp === 0) {
      this.startTimestamp = timestamp;
      this.previousTimestamp = timestamp;
    }
    this.elapsed = timestamp - this.startTimestamp;
    const deltaT = timestamp - this.previousTimestamp;
    if (deltaT !== 0) {
      this.items.forEach((item) => item.step(deltaT, this.elapsed));
      if (this.elapsed >= this.duration) {
        this.stop();
      }
    }
    this.previousTimestamp = timestamp;
    this.requestFrame();
  }
}
