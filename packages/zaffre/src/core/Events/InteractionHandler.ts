import { InteractionState, InteractionEffects } from ":effect";
import { Handler, HandlerTarget } from "./Handler";
import { pointerHandler } from "./PointerHandler";

//
//
//

export function interactionHandler(interactionEffects: InteractionEffects): InteractionHandler {
    return new InteractionHandler(interactionEffects);
  }
  
  export class InteractionHandler extends Handler<InteractionState> {
    ptrHandler = pointerHandler({});
  
    constructor(protected interactionEffects: InteractionEffects) {
      super();
    }
    afterSetTarget(target: HandlerTarget): void {
      this.cue = target.interactionState;
      this.ptrHandler.setTarget(target);
  
      // now add effects
      Object.entries(this.interactionEffects).forEach(([type, effect]) => this.addEffect(type, effect, target.iState(<InteractionState>type)));
    }
  }
  