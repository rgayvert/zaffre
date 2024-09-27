import { Atom } from ":foundation";
import { Effect } from ":effect";
import { Handler, HandlerTarget } from "./Handler";

//
//
//

type TriggerFn = (target: HandlerTarget) => Atom<boolean>;

export function stateHandler(stateName: string, triggerFn: TriggerFn, effect: Effect): Handler<boolean> {
  return new StateHandler(stateName, triggerFn, effect);
}

export class StateHandler extends Handler<boolean> {
  constructor(protected stateName: string, protected triggerFn: TriggerFn, protected effect: Effect) {
    super();
  }
  afterSetTarget(target: HandlerTarget): void {
    const trigger = this.triggerFn(target);
    this.cue = trigger;
    const invertTrigger = this.stateName === "hidden";
    this.addEffect(this.stateName, this.effect, trigger, invertTrigger);
  }
}

export function mountedHandler(effect: Effect): Handler<boolean> {
  return stateHandler("mounted", (target) => target.mountedState, effect);
}
export function hiddenHandler(effect: Effect): Handler<boolean> {
  return stateHandler("hidden", (target) => target.hiddenState, effect);
}
export function contentChangedHandler(effect: Effect): Handler<boolean> {
  return stateHandler("contentChanged", (target) => target.contentChangedState, effect);
}
export function selectedHandler(effect: Effect): Handler<boolean> {
  return stateHandler("selected", (target) => target.selectedState, effect);
}
