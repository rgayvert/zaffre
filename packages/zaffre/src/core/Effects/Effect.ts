import { zutil, zlog, Rect2D, Atom, Point2D, ToggleAtom } from ":foundation";
import { Attributes, AttrBundle } from ":attributes";
import { AnimationTarget } from "./Animation";
import { EffectType } from "./InteractionTypes";

//
//
//

export interface InteractionEffects {
  enabled?: Effect;
  disabled?: Effect;
  hovered?: Effect;
  focused?: Effect;
  pressed?: Effect;
  clicked?: Effect;
}
export interface Effects extends InteractionEffects {
  mounted?: Effect;
  hidden?: Effect;
  selected?: Effect; 
  contentChanged?: Effect;
  dragged?: Effect;
  draggedOver?: Effect;
} 

export interface EffectTarget extends AnimationTarget {
  overlay: EffectTarget;
  attributeBundle: AttrBundle;
  getProperty(key: string): string;
  distanceFromPreviousLocation(): number;
  previousLocation?: Point2D | undefined;
  translationFromPreviousLocation(): string;
  height: number;
  clientRect(): Rect2D;
  clickPoint?: Point2D;
  waitForAnimationsToFinish(): void;
  isHidden(): boolean;
}

export type EffectPromise = Promise<Animation | boolean>;

// function emptyPromise<T>(val: T): Promise<T> {
//   return Promise.resolve(val); // new Promise((resolve) => { resolve(val); });
// }

// class NullAnimation extends Animation {
//   constructor() {
//     super();
//     this.finished = emptyPromise();
//   }
// }

export interface SimpleAttributes {
  [key: string]: string;
}

type VF<T> = T | ((v: EffectTarget) => T);
function evalVF<T>(value: VF<T>, target: EffectTarget): T {
  return typeof value === "function" ? (<(v: EffectTarget) => T>value)(target) : value;
}
function reverseVF<T>(val: VF<T[]>): VF<T[]> {
  return (v: EffectTarget) => evalVF(val, v).reverse();
}

export type EffectDirection = "" | "in" | "out" | "in&out";
export function isEffectDirection(s: string): s is EffectDirection {
  return s === "" || s === "in" || s === "out" || s === "in&out";
}

export interface EffectOptions {
  name?: string;
  fill?: FillMode
  useOverlay?: boolean;
}

const effectDefaults = {
  name: "",
  fill: "none",
  useOverlay: false,
};

export function disableEffectsWhile(fn: () => void): void {
  Effect.effectsDisabled = true;
  fn();
  // wait a bit before turning back since the effect trigger may be delayed (e.g., Tree.expandTo)
  setTimeout(() => Effect.effectsDisabled = false, 100);
}

export abstract class Effect {

  static effectsDisabled = false;
  options: EffectOptions;

  constructor(public direction: EffectDirection, inOptions: EffectOptions = {}) {
    this.options = zutil.mergeOptions(effectDefaults, inOptions);
  }

  toString(): string {
    return `${this.constructor.name}[${this.options.name || ""}]`;
  }

  abstract applyToTarget(target: EffectTarget, direction: EffectDirection, fill?: FillMode): EffectPromise;
}

export function effectPair(inEffect: Effect, outEffect: Effect): EffectPair {
  return new EffectPair(inEffect, outEffect);
}
export class EffectPair extends Effect {
  constructor(protected inEffect: Effect, protected outEffect: Effect) {
    super("in&out");
  }
  applyToTarget(target: EffectTarget, direction: EffectDirection, fill?: FillMode): EffectPromise {
    return direction === "in" 
      ? this.inEffect.applyToTarget(target, "in", fill) 
      : this.outEffect.applyToTarget(target, "out", fill);
  }

}


/**
 * An AttributeEffect changes the properties of a target directly, not through an animation. As such, it
 * needs to save the target's properties on "in", and restore them on "out".
 */
export class AttributeEffect extends Effect {
  // use a WeakMap to handle the case where the "out" effect is never called
  targetProperties = new WeakMap<EffectTarget, SimpleAttributes>();

  constructor(public attrs: Attributes, direction: EffectDirection, options: EffectOptions = {}) {
    super(direction, options);
  }

  saveAttributesOfTarget(target: EffectTarget): void {
    this.targetProperties.set(target, Object.fromEntries(this.attributeKeys().map((key) => [key, target.getProperty(key)])));
  }
  restoreAttributesOfTarget(target: EffectTarget): void {
    Object.entries(this.targetProperties.get(target) || {}).forEach(([key, val]) => {
      key = zutil.kebabize(key);
      target.setProperty(key, val);
    });
    this.targetProperties.delete(target);
  } 

  attributeKeys(): string[] {
    return Object.keys(this.attrs);
  }

  // TODO: set the style properties with !important so that the specifity is above any others with css-vars
  setStyleProperty(target: EffectTarget, key: string, val: string): void {
    target.setProperty(zutil.kebabize(key), val);
  }

  applyToTarget(target: EffectTarget, direction: EffectDirection, fill: FillMode = "none"): EffectPromise {
    const realTarget = this.options.useOverlay ? target.overlay : target;
    if (direction === "in") {
      this.saveAttributesOfTarget(realTarget);
      Object.entries(this.attrs).forEach(([key, val]) => this.setStyleProperty(realTarget, key, realTarget.attributeBundle.formatValue(val)));
    } else {
      this.restoreAttributesOfTarget(realTarget);
    }
    return Promise.resolve(true);
  }
}


export function simpleEffect(attrs: Attributes): Effect {
  return new AttributeEffect(attrs, "in&out");
}
export function emptyEffect(): Effect {
  return new AttributeEffect({}, "in&out");
}

////////////////


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

// export class AnimationEffect extends Effect {
//   public static create(dir: EffectDirection, name: string, attrs: Attributes): AnimationEffect {
//     return new AnimationEffect(dir, name, attrs);
//   }

//   constructor(dir: EffectDirection, name: string, public attrs: Attributes) {
//     super(dir, name);
//   }
//   applyToTarget(target: EffectTarget, direction: EffectDirection, fill: FillMode = "none"): Promise<boolean> {
//     //target.saveEffectAttributes(Object.keys(this.attrs));
//     //Object.entries(this.attrs).forEach(([key, val]) => target.elt.style.setProperty(key, target.theme.formatValue(zget(val))));
//     return Promise.resolve(false);
//   }
// }

export class SelectionEffect extends AttributeEffect {
  // highlight, underline, change color
}

export class EffectInstance {
  static activeEffects = new WeakMap<EffectTarget, EffectInstance>();

  addSimpleTriggerAction(trigger: Atom<boolean>): void {
    trigger.addAction((val) => {
      const v = this.invertTrigger ? !val : val;
      if (v && this.effect.direction.includes("in")) {
        this.apply("in");
      } else if (!v && this.effect.direction.includes("out")) {
        this.apply("out");
      }
    });
  }

  addDelayedTriggerAction(trigger: ToggleAtom): void {
      trigger.addAction((val: boolean) => {
      const v = this.invertTrigger ? !val : val;
      if (v && this.effect.direction.includes("in")) {
        return this.apply("in");
      } else {
        return Promise.resolve(false);
      }
    });
    trigger.addBeforeAction(async (val: boolean) => {   
      const v = this.invertTrigger ? !val : val;
      if (!v && this.effect.direction.includes("out")) {
        return this.apply("out");
      } else {
        return Promise.resolve(false);
      }
    });
  }
  constructor(
    public effectType: EffectType,
    public target: EffectTarget,
    protected effect: Effect,
    protected trigger: Atom<boolean>,
    protected invertTrigger = false,
    protected fill: FillMode = "none"
  ) {
    if (this.trigger instanceof ToggleAtom) {
      this.addDelayedTriggerAction(this.trigger);
    } else {
      this.addSimpleTriggerAction(this.trigger);
    }
  }

  toString(): string {
    return `EffectInstance[target=${this.target},effect=${this.effect}]`;
  }
  // TODO: if the map has a corresponding "in&out" entry, break it up
  setInMap(map: Map<string, EffectInstance>): void {
    const key = `${this.effectType}/${this.effect.direction}`;
    map.set(key, this);
    zlog.debug("key=" + key);
  }
  apply(dir: EffectDirection): EffectPromise {
    if (Effect.effectsDisabled) {
      return Promise.resolve(true);
    }
    if (dir === "in") {
      const activeEffect = EffectInstance.activeEffects.get(this.target);
      if (activeEffect) {
        //activeEffect.revert();
      }
    }

    zlog.debug("### applying " + this.effectType + "/" + this.effect.options.name + "(" + dir + ") to " + this.target);
    return this.effect.applyToTarget(this.target, dir, this.fill);

    // try {
    //   return this.effect.applyToTarget(this.target, dir, this.fill);
    // } catch(e) {
    //     return Promise.resolve(true);
    // }
    //EffectInstance.activeEffects.set(this.target, this);
  }
  revert(): void {
    zlog.debug("### reverting " + this.effect.options.name + ", trigger=" + this.trigger);
    this.effect.applyToTarget(this.target, "out");
    zlog.debug("*** removing active effect for " + this.target);
    EffectInstance.activeEffects.delete(this.target);
  }
}


////////////////////////////////////
