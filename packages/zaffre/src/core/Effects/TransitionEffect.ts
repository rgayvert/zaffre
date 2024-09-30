import { zutil } from ":foundation";
import { Effect, effectDefaults, EffectDirection, EffectOptions, EffectPromise } from "./Effect";
import { EffectTarget, evalVF, reverseVF, VF } from "./Effect";

//
// Standard effects to apply to a view when changing state (mounted, hidden, ...)
//


export interface TransitionEffectOptions extends EffectOptions {
  duration?: VF<number>;
  delay?: number;
}

const transitionEffectDefaults = {
  ...effectDefaults,
  duration: 0.2,
  delay: 0,
};

export class TransitionEffect extends Effect {
  options: TransitionEffectOptions;

  constructor(public keyFrames: VF<Keyframe[]>, direction: EffectDirection, inOptions: TransitionEffectOptions) {
    const options: TransitionEffectOptions = zutil.mergeOptions(transitionEffectDefaults, inOptions);
    super(direction, options);
    this.options = options;
  }

  reverse(): TransitionEffect {
    return new TransitionEffect(reverseVF(this.keyFrames), this.direction, this.options);
  }

  applyToTarget(target: EffectTarget, direction: EffectDirection, fill: FillMode = "none"): EffectPromise {
    const realTarget = this.options.useOverlay ? target.overlay : target;
    const options: KeyframeAnimationOptions = {
      duration: evalVF(this.options.duration!, target) * 1000,
      fill: this.options.fill,
      easing: "ease-in-out",
      delay: this.options.delay! * 1000,
      direction: direction === "out" ? "reverse" : "normal",
    };

    return realTarget.animate(evalVF(this.keyFrames, realTarget), options).finished;
  }
}



export const transitions = {
  pop: (dir: EffectDirection = "in", duration = 0.3): TransitionEffect => {
    const keyFrames = [{ transform: "scale(1.2)", offset: 0.5 }];
    return new TransitionEffect(keyFrames, dir, { name: "pop", duration: duration } );
  },

  push: (dir: EffectDirection = "in", duration = 0.4): TransitionEffect => {
    const keyFrames = [{ transform: "scale(0.8)", offset: 0.5 }];
    return new TransitionEffect(keyFrames, dir, { name: "push", duration: duration } );
  },

  pulse: (dir: EffectDirection = "in", duration = 0.5): TransitionEffect => {
    const keyFrames = [
        { transform: "scale(0.9)", offset: 0.25 },
        { transform: "scale(1.1)", offset: 0.75 },
      ];
    return new TransitionEffect(keyFrames, dir, { name: "pulse", duration: duration } );
  },

  bounce: (dir: EffectDirection = "in", duration = 0.5): TransitionEffect => {
    const keyFrames = [
        { transform: "scale(0)" },
        { transform: "scale(1.25)", offset: 0.5 },
        { transform: "scale(1)" },
      ];
    return new TransitionEffect(keyFrames, dir, { name: "bounce", duration: duration } );
  },

  fadeIn: (dir: EffectDirection = "in", duration = 0.3, delay = 0.0, fill: FillMode = "none"): TransitionEffect => {
    const keyFrames = [{ opacity: 0.0 }, { opacity: 1.0 }];
    return new TransitionEffect(keyFrames, dir, { name: "fadeIn", duration: duration, delay: delay, fill: fill });
  },

  fadeOut: (dir: EffectDirection = "out", duration = 0.3): TransitionEffect => {
    const keyFrames = [{ opacity: 1.0 }, { opacity: 0.0 }];
    return new TransitionEffect(keyFrames, dir, { name: "fadeOut", duration: duration });
  },

  shrink: (dir: EffectDirection = "out", duration = 0.3): TransitionEffect => {
    const keyFrames =[
        { opacity: 1.0, transform: "scale(1.0)" },
        { opacity: 0.0, transform: "scale(0.0)" },
      ];
    return new TransitionEffect(keyFrames, dir, { name: "shrink", duration: duration } );
  },

  grow: (dir: EffectDirection, duration = 0.3, delay = 0.0, fill: FillMode = "none"): TransitionEffect => {
    const keyFrames = [
      { transformOrigin: "top center", opacity: 0.0, transform: "scaleY(0.0)" },
      { transformOrigin: "top center", opacity: 1.0, transform: "scaleY(1.0)" },
    ];
    return new TransitionEffect(keyFrames, dir, { name: "grow", duration: duration, delay: delay, fill: fill });
  },

  slide: (dir: EffectDirection, side: "left" | "top" | "right" | "bottom", duration = 0.3, delay = 0.0): TransitionEffect => {
    const translate = side === "left" || side === "right" ? "translateX" : "translateY";
    const pct = side === "left" || side === "top" ? "-100%" : "100%";
    const keyFrames = [
      { opacity: 0.0, transform: `${translate}(${pct})` },
      { opacity: 1.0, transform: `${translate}(0)` },
    ];

    return new TransitionEffect(keyFrames, dir, { name: "slide", duration: duration, delay: delay });
  },

  collapse: (dir: EffectDirection, duration = 0.3, delay = 0.0): TransitionEffect => {
    const keyFrames = (v: EffectTarget): Keyframe[] => [
      { height: "0px", overflow: "hidden" },
      { height: `${v.height}px`, overflow: "hidden" },
    ];
    return new TransitionEffect(keyFrames, dir, { name: "collapse", duration: duration, delay: delay });
  },

  slideFromPreviousLocation: (dir: EffectDirection): TransitionEffect => {
    const keyFrames = (v: EffectTarget): Keyframe[] =>
      v.previousLocation
        ? [
            { zIndex: "9", transform: v.translationFromPreviousLocation() },
            { zIndex: "0", transform: "translate(0px, 0px)" },
          ]
        : [];

    return new TransitionEffect(keyFrames, dir, { name: "slideFromPreviousLocation", duration: (v: EffectTarget) => v.distanceFromPreviousLocation() / 4000 });
  },

  scaledOverlay: (
    name: string,
    dir: EffectDirection,
    initialColor: string,
    terminalColor: string,
    transformOrigin: string,
    initialTransform: string,
    terminalTransform: string,
    duration = 0.3,
    delay = 0.0,
    fill: FillMode = "forwards"
  ): TransitionEffect => {
    const keyFrames = [
      { transformOrigin: transformOrigin, background: initialColor, transform: initialTransform },
      { transformOrigin: transformOrigin, background: terminalColor, transform: terminalTransform },
    ];
    return new TransitionEffect(keyFrames, dir, { name: name, useOverlay: true, duration: duration, delay: delay, fill: fill });
  },

  growOutOverlay: (dir: EffectDirection, initialColor: string, terminalColor: string, duration = 0.3, delay = 0.0, fill: FillMode = "forwards"): TransitionEffect => {
    return transitions.scaledOverlay("growOutOverlay", dir, initialColor, terminalColor, "center", "scale(0.0)", "scale(1.0)", duration, delay, fill);
  },

  pullDownOverlay: (dir: EffectDirection, initialColor: string, terminalColor: string, duration = 0.3, delay = 0.0, fill: FillMode = "forwards"): TransitionEffect => {
    return transitions.scaledOverlay("pullDownOverlay", dir, initialColor, terminalColor, "top center", "scaleY(0.0)", "scaleY(1.0)", duration, delay, fill);
  },

  diagonalOverlay: (dir: EffectDirection, initialColor: string, terminalColor: string, duration = 0.3, delay = 0.0, fill: FillMode = "forwards"): TransitionEffect => {
    return transitions.scaledOverlay("diagonalOverlay", dir, initialColor, terminalColor, "top left", "scale(0.0)", "scale(1.0)", duration, delay, fill);
  },


  blink: (dir: EffectDirection, blinkColor: string, duration = 0.1, delay = 0.0, fill: FillMode = "none"): TransitionEffect => {
    const keyFrames = [
      { background: "" },
      { background: "", offset: 0.29 },
      { background: blinkColor, offset: 0.3 },
      { background: blinkColor, offset: 0.7 },
      { background: "", offset: 0.71 },
      { background: "" },
    ];
    return new TransitionEffect(keyFrames, dir, { name: "blink", duration: duration, delay: delay, fill: fill });
  },
};
