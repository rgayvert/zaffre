import { Atom, BasicAction, Point2D, point2D, Rect2D, ToggleAtom, vector2D, atom, toggleAtom } from ":foundation";

//
//
//

export type AnimatorCallback = (t: number) => void;

export interface AnimationItem {
  step: (deltaT: number, elapsed: number) => void;
  begin?: BasicAction;
  end?: BasicAction;
}

export class SimpleAnimationItem implements AnimationItem {
  location = atom(point2D(0, 0));
  velocity = atom(vector2D(0, 0));
  bounds?: Rect2D;
  speed = atom(() => this.velocity.get().magnitude());

  constructor(public initialLocation = point2D(0, 0), public initialVelocity = vector2D(0, 0)) {
    this.setToInitialValues();
  }
  setLocation(pt: Point2D): void {
    this.location.set(pt.clampToRect(this.bounds));
  }
  setVelocity(vx: number, vy: number): void {
    this.velocity.set(vector2D(vx, vy));
  }
  step(deltaT: number, elapsed: number): void {
    this.setLocation(this.location.get().add(this.velocity.get().scalarMultiply(deltaT)));
  }
  begin(): void {
    // hook
    this.setToInitialValues();
  }
  end(): void {
    // hook
    this.setToInitialValues();
  }
  setToInitialValues(): void {
    this.setLocation(this.initialLocation);
    this.velocity.set(this.initialVelocity);
  }
  transformPxLocation(): string {
    return `translate(${this.location.get().x}px, ${this.location.get().y}px)`
  }
}

export interface AnimatorOptions {
  duration?: number;
}
export type AnimatorState = "running" | "stopped" | "paused";

export class AnimationModel {
  public animator: BasicAnimator;
  public running: ToggleAtom;

  constructor(options: AnimatorOptions = {}) {
    this.animator = this.basicAnimator(); 
    this.running = this.animator.running;
  }
  basicAnimator(): BasicAnimator {
    return new BasicAnimator();
  }

  get isRunning(): boolean {
    return this.animator.isRunning;
  }
  start(): void {
    this.animator.start();
  }
  pause(): void {
    this.animator.pause();
  }
  stop(): void {
    this.animator.stop();
  }
  startOrStop(): void {
    this.isRunning ? this.stop() : this.start();
  }
  add(...items: AnimationItem[]): void {
    this.animator.add(...items);
  }
  setItems(items: SimpleAnimationItem[]): void {
    this.animator.setItems(items);
  }
}

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
