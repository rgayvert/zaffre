import { ToggleAtom} from ":foundation";
import { AnimationItem, SimpleAnimationItem } from "./AnimationItem";
import { AnimatorOptions, BasicAnimator } from "./BasicAnimator";

//
// An AnimationModel is the an object which has an animator.
//

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

