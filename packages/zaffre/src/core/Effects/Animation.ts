import { zlog, ZType, atom } from ":foundation";

//
//
//

export interface AnimationTarget {
  animate(keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeAnimationOptions | undefined): Animation;
  setProperty(key: string, value: string): void;

  }

type VF<T> = T | ((v: AnimationTarget) => T);
function evalVF<T>(value: VF<T>, target: AnimationTarget): T {
  return typeof value === "function" ? (<(v: AnimationTarget) => T>value)(target) : value;
}

export class KeyFrames {
  public static pop(): Keyframe[] {
    return [ { transform: "scale(1.2)", offset: 0.5 }];
  }
  public static push(): Keyframe[] {
    return [ { transform: "scale(0.8)", offset: 0.5 }];
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


export class AnimationSpec {
  animation?: Animation;
  target?: AnimationTarget;
  started = false;

  constructor(public keyframes: AnimationKeyframes, public options: AnimationOptions, public running = atom(false)) {
  }

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
    }
    catch(error) {
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

// export class AnimationTargetAnimation {
//   animation: Animation;

//   constructor(public target: AnimationTarget, public spec: AnimationSpec) {
//     this.animation = target.elt.animate(this.spec.keyframes, this.spec.options);
//     if (this.spec.playState.get() !== "running") {
//       this.animation.pause();
//     }
//     this.spec.playState.addAction(() => this.stateChanged());
//   }
//   stateChanged(): void {
//     const state = this.spec.playState.get();
//     if (state === "running") {
//       this.animation.play();
//     } else if (state === "paused") {
//       this.animation.pause();
//     }
//   }
// }

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
  //getComputedStyle(target.elt);            // Q: is there a point to this?
  target.setProperty("width", "0px");
  target.setProperty("opacity", "1");
  await target.animate([{ width: "0%" }, { width: "20ch" }], { duration: duration * 1000 }).finished;
}

export async function slideOut(target: AnimationTarget, duration = 0.5): Promise<void> {
  target.animate([{ width: "100%" }, { width: "0%" }], { duration: duration * 1000 }).finished;
}

export type EasingFunction = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
export type TransitionPoint = "" | "in" | "in-mount" | "in-visible" | "out" | "out-mount" | "out-visible";
export type EasingFunctionOption = ZType<EasingFunction>;

