import { zboolean } from ":foundation";
import { GenericEventAction, handleEvents } from "./Events";
import { EventHandler } from "./EventHandler";
import { EventType } from "./Listener";

//
//
//

export interface GenericEventHandlerOptions {
  change?: GenericEventAction,
  select?: GenericEventAction,
}

export function genericEventHandler(options: GenericEventHandlerOptions, active: zboolean = true): GenericEventHandler {
  return new GenericEventHandler(options, active);
}

export class GenericEventHandler extends EventHandler<EventType, Event> {
  constructor(protected options: GenericEventHandlerOptions, active: zboolean) {
    const actions = {
       change: (evt: Event): void => handleEvents(this.options.change, evt),
       select: (evt: Event): void => handleEvents(this.options.select, evt)
    };
    super(actions, active);
  }
}
