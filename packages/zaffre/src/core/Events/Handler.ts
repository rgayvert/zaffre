import { Atom, atom, BasicAction } from ":foundation";
import { Effect, EffectTarget, EffectInstance, InteractionState, EffectType } from ":effect";
import { EventAction } from "./Events";
import { EventType } from "./Listener";

//
//
//

export type EventActionsRecord<L extends Partial<EventType>, E extends Event> = Partial<Record<L, EventAction<E> | undefined>>;

export interface HandlerTarget extends EffectTarget {
  overlay: HandlerTarget;
  setClickPointFromEvent(event: MouseEvent): void;
  mountedState: Atom<boolean>;
  hiddenState: Atom<boolean>;
  contentChangedState: Atom<boolean>;
  selectedState: Atom<boolean>;
  interactionState: Atom<InteractionState>;
  iState(state: InteractionState): Atom<boolean>;
  setInteractionState(state: InteractionState, action?: BasicAction): void;
  addListenerAction<E extends Event>(type: EventType, action: EventAction<E>): void;
}


export abstract class Handler<T> {
  target?: HandlerTarget;
  cue: Atom<T | undefined>;

  constructor(alwaysFireCue = false) {
    this.cue = atom(undefined, { alwaysFire: alwaysFireCue });
  }
  setTarget(target: HandlerTarget): void {
    if (!this.target) {
      this.target = target;
      this.afterSetTarget(target);
    }
  }
  abstract afterSetTarget(target: HandlerTarget): void;

  effectInstances: EffectInstance[] = [];

  addEffect(type: EffectType, effect: Effect, trigger: Atom<boolean>, invertTrigger?: boolean): void {
    const effInstance = new EffectInstance(type, this.target!, effect, trigger, invertTrigger);
    this.effectInstances.push(effInstance);
  }
  addInteractionEffect(type: InteractionState, effect: Effect): void {
    effect.options.useOverlay = true;
    this.addEffect(type, effect, this.target!.iState(type));
  }
}
