import { zboolean } from ":foundation";
import { ClipboardAction, handleEvents } from "./Events";
import { EventHandler } from "./EventHandler";
import { ClipboardEventType } from "./Listener";

//
//
//

export interface ClipboardHandlerOptions {
  cut?: ClipboardAction,
  copy?: ClipboardAction,
  paste?: ClipboardAction,
}

export function clipboardHandler(options: ClipboardHandlerOptions, active: zboolean = true): ClipboardHandler {
  return new ClipboardHandler(options, active);
}

export class ClipboardHandler extends EventHandler<ClipboardEventType, ClipboardEvent> {
  constructor(protected options: ClipboardHandlerOptions, active: zboolean) {
    const actions = {
      cut: (evt: ClipboardEvent): void => this.cut(evt),
      copy: (evt: ClipboardEvent): void => this.copy(evt),
      paste: (evt: ClipboardEvent): void => this.paste(evt),
    };
    super(actions, active);
  }
  cut(evt: ClipboardEvent): void {
    handleEvents(this.options.cut, evt);
  }
  copy(evt: ClipboardEvent): void {
    handleEvents(this.options.copy, evt);
  }
  paste(evt: ClipboardEvent): void {
    handleEvents(this.options.paste, evt);
  }

}
