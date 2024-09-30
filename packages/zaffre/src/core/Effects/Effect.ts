import { zutil, Rect2D, Point2D } from ":foundation";
import { AttrBundle } from ":attributes";
import { AnimationTarget } from "./Animation";

//
// Base class for effects. An effect is an animation controlled by a reactive trigger. 
// Each view has reactive state values for mounted, hidden, selected, and contentChanged, 
// along with an interaction value for enabled, disabled, hovered, pressed, focused, dragged, 
// and draggedOver.
//

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

export interface SimpleAttributes {
  [key: string]: string;
}

export type VF<T> = T | ((v: EffectTarget) => T);

export function evalVF<T>(value: VF<T>, target: EffectTarget): T {
  return typeof value === "function" ? (<(v: EffectTarget) => T>value)(target) : value;
}
export function reverseVF<T>(val: VF<T[]>): VF<T[]> {
  return (v: EffectTarget) => evalVF(val, v).reverse();
}

export type EffectDirection = "" | "in" | "out" | "in&out";
export function isEffectDirection(s: string): s is EffectDirection {
  return s === "" || s === "in" || s === "out" || s === "in&out";
}

export interface EffectOptions {
  name?: string;
  fill?: FillMode;
  useOverlay?: boolean;
}

export const effectDefaults = {
  name: "",
  fill: "none",
  useOverlay: false,
};

export function disableEffectsWhile(fn: () => void): void {
  Effect.effectsDisabled = true;
  fn();
  // wait a bit before turning back since the effect trigger may be delayed (e.g., Tree.expandTo)
  setTimeout(() => (Effect.effectsDisabled = false), 100);
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


