import { InteractionState } from ":effect";
import { Handler, HandlerTarget } from "./Handler";
import { pointerHandler } from "./PointerHandler";
import { InteractionEffectsBundle } from "../Effects";

//
// Handler for interaction effects
//
// TODO: figure out what this does, if anything
//

export function interactionHandler(interactionEffects: InteractionEffectsBundle): InteractionHandler {
    return new InteractionHandler(interactionEffects);
  }
  
  export class InteractionHandler extends Handler<InteractionState> {
    ptrHandler = pointerHandler({});
  
    constructor(protected interactionEffects: InteractionEffectsBundle) {
      super();
    }
    afterSetTarget(target: HandlerTarget): void {
      this.cue = target.interactionState;
      this.ptrHandler.setTarget(target);
  
      // now add effects
      Object.entries(this.interactionEffects).forEach(([type, effect]) => this.addEffect(type, effect, target.iState(<InteractionState>type)));
    }
  }
  