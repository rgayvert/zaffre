import { Attributes } from ":attributes";
import { Effect, EffectDirection, EffectOptions, EffectPromise, EffectTarget, SimpleAttributes } from "./Effect";
import { zutil } from ":foundation";
 
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
    this.targetProperties.set(
      target,
      Object.fromEntries(this.attributeKeys().map((key) => [key, target.getProperty(key)]))
    );
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
      Object.entries(this.attrs).forEach(([key, val]) =>
        this.setStyleProperty(realTarget, key, realTarget.attributeBundle.formatValue(val))
      );
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

// TODO: selection should be an effect, not just a color

export class SelectionEffect extends AttributeEffect {
  // highlight, underline, change color
}
