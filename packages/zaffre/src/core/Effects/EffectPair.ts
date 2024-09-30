import { Effect, EffectDirection, EffectPromise, EffectTarget } from "./Effect";

//
// An EffectPair is a pair of two effects, one for each direction (in & out).
//

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
