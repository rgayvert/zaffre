import { Atom, ToggleAtom, zlog } from ":foundation";
import { Effect, EffectDirection, EffectPromise, EffectTarget } from "./Effect";
import { EffectType } from "./EffectTypes";

//
// An EffectInstance tracks the process of applying an effect to an EffectTarget (a View).
//

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
  }
  revert(): void {
    zlog.debug("### reverting " + this.effect.options.name + ", trigger=" + this.trigger);
    this.effect.applyToTarget(this.target, "out");
    zlog.debug("*** removing active effect for " + this.target);
    EffectInstance.activeEffects.delete(this.target);
  }
}
