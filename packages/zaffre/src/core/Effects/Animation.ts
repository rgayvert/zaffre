import { zlog, ZType, atom } from ":foundation";

//
// Support for CSS keyframe animation. A View (aka AnimationTarget) can have
// a list of animation specs.
// 

export interface AnimationTarget {
  animate(
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions | undefined
  ): Animation;
  setProperty(key: string, value: string): void;
}

type VF<T> = T | ((v: AnimationTarget) => T);
function evalVF<T>(value: VF<T>, target: AnimationTarget): T {
  return typeof value === "function" ? (<(v: AnimationTarget) => T>value)(target) : value;
}

export class KeyFrames {
  public static pop(): Keyframe[] {
    return [{ transform: "scale(1.2)", offset: 0.5 }];
  }
  public static push(): Keyframe[] {
    return [{ transform: "scale(0.8)", offset: 0.5 }];
  }
  public static pulse(): Keyframe[] {
    return [
      { transform: "scale(0.9)", offset: 0.25 },
      { transform: "scale(1.1)", offset: 0.75 },
    ];
  }
}

type AnimationKeyframes = Keyframe[] | PropertyIndexedKeyframes;
type AnimationOptions = number | KeyframeAnimationOptions;

export type EasingFunction = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
export type TransitionPoint = "" | "in" | "in-mount" | "in-visible" | "out" | "out-mount" | "out-visible";
export type EasingFunctionOption = ZType<EasingFunction>;

export class AnimationSpec {
  animation?: Animation;
  target?: AnimationTarget;
  started = false;

  constructor(public keyframes: AnimationKeyframes, public options: AnimationOptions, public running = atom(false)) {}

  setTarget(target: AnimationTarget): void {
    this.target = target;
    this.running.addAction(() => this.runStateChanged());
    if (this.running.get()) {
      this.start();
    }
  }

  async start(): Promise<void> {
    this.animation = this.target?.animate(this.keyframes, this.options);
    try {
      await this.animation?.finished;
    } catch (error) {
      zlog.info("animation interrupted");
    }
    this.animation = undefined;
    this.running.set(false);
  }
  runStateChanged(): void {
    const running = this.running.get();
    if (running && !this.animation) {
      this.start();
    }
    if (running) {
      this.animation?.play();
    } else {
      this.animation?.pause();
    }
  }
}

// TODO: the function below do not appear to be used

export async function slideInOrOut(target: AnimationTarget, out: boolean, duration = 0.5): Promise<void> {
  if (out) {
    await slideOut(target, duration);
  } else {
    await slideIn(target, duration);
  }
}

export async function slideIn(target: AnimationTarget, duration = 0.5): Promise<void> {
  target.setProperty("opacity", "0");
  target.setProperty("display", "block");
  target.setProperty("width", "0px");
  target.setProperty("opacity", "1");
  await target.animate([{ width: "0%" }, { width: "20ch" }], { duration: duration * 1000 }).finished;
}

export async function slideOut(target: AnimationTarget, duration = 0.5): Promise<void> {
  target.animate([{ width: "100%" }, { width: "0%" }], { duration: duration * 1000 }).finished;
}
