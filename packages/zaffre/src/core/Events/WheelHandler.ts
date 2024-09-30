import { zboolean } from ":foundation";
import { WheelAction, handleEvents } from "./Events";
import { EventHandler } from "./EventHandler";
import { WheelEventType } from "./Listener";

//
// Handler for wheel event
//

export interface WheelHandlerOptions {
  wheel?: WheelAction,
}

export function wheelHandler(options: WheelHandlerOptions, active: zboolean = true): WheelHandler {
  return new WheelHandler(options, active);
}

export class WheelHandler extends EventHandler<WheelEventType, WheelEvent> {
  constructor(protected options: WheelHandlerOptions, active: zboolean) {
    const actions = {
      wheel: (evt: WheelEvent): void => this.wheel(evt),
    };
    super(actions, active);
  }
  wheel(evt: WheelEvent): void {
    handleEvents(this.options.wheel, evt);
  }
}
