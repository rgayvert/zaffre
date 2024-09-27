import { zboolean } from ":foundation";
import { FocusAction, handleEvents } from "./Events";
import { EventHandler } from "./EventHandler";
import { FocusEventType } from "./Listener";

//
//
//

export interface FocusHandlerOptions {
  focus?: FocusAction,
  blur?: FocusAction,
}

export function focusHandler(options: FocusHandlerOptions, active: zboolean = true): FocusHandler {
  return new FocusHandler(options, active);
}

export class FocusHandler extends EventHandler<FocusEventType, FocusEvent> {
  constructor(protected options: FocusHandlerOptions, active: zboolean) {
    const actions = {
      focus: (evt: FocusEvent): void => this.focus(evt),
      blur: (evt: FocusEvent): void => this.blur(evt),
    };
    super(actions, active);
  }
  focus(evt: FocusEvent): void {
    this.target?.setInteractionState("focused");
    handleEvents(this.options.focus, evt);
  }
  // TODO: handle interaction state
  blur(evt: FocusEvent): void {
    handleEvents(this.options.blur, evt);
  }
}
