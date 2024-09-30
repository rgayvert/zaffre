import { zboolean } from ":foundation";
import { InputAction, handleEvents } from "./Events";
import { EventHandler } from "./EventHandler";
import { EventType } from "./Listener";

//
// Handler for input events
//

export interface InputHandlerOptions {
  input?: InputAction,
}

export function inputHandler(options: InputHandlerOptions, active: zboolean = true): InputHandler {
  return new InputHandler(options, active);
}

export class InputHandler extends EventHandler<EventType, InputEvent> {
  constructor(protected options: InputHandlerOptions, active: zboolean) {
    const actions = {
       input: (evt: InputEvent): void => handleEvents(this.options.input, evt),
    };
    super(actions, active);
  }
}
