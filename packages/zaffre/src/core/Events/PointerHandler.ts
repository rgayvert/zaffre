import { zboolean, zutil } from ":foundation";
import { Effect } from ":effect";
import { PointerAction, handleEvents } from "./Events";
import { EventHandler } from "./EventHandler";
import { PointerEventType } from "./Listener";

//
//
//

export type PointerActions = Record<PointerEventType, PointerAction>;

export interface PointerHandlerOptions {
  pointerdown?: PointerAction;
  pointerup?: PointerAction;
  pointerover?: PointerAction;
  pointerleave?: PointerAction;
  pointermove?: PointerAction;

}
const defaultPointerHandlerOptions: PointerHandlerOptions = {
};

export function pointerHandler(inOptions: PointerHandlerOptions): PointerHandler {
  const options: PointerHandlerOptions = zutil.mergeOptions(defaultPointerHandlerOptions, inOptions);
  return new PointerHandler(options);  // options.active, options.effect);
}


export class PointerHandler extends EventHandler<PointerEventType, PointerEvent> {
  constructor(protected options: PointerHandlerOptions, active?: zboolean, protected effect?: Effect) {
    const actions = {
      pointerdown: (evt: PointerEvent): void => this.pointerDown(evt),
      pointerup: (evt: PointerEvent): void => this.pointerUp(evt),
      pointerover: (evt: PointerEvent): void => this.pointerOver(evt),
      pointerleave: (evt: PointerEvent): void => this.pointerLeave(evt),
      pointermove: (evt: PointerEvent): void => this.pointerMove(evt),
    };
    super(actions, true); // active);
  }
  pointerDown(evt: PointerEvent): void {
    this.target?.setInteractionState("pressed");
    handleEvents(this.options.pointerdown, evt);
  }
  pointerUp(evt: PointerEvent): void {
    this.target?.setInteractionState("hovered");
    handleEvents(this.options.pointerup, evt);
  }
  pointerOver(evt: PointerEvent): void {
    this.target?.setInteractionState("hovered");
    handleEvents(this.options.pointerover, evt);
  }
  pointerLeave(evt: PointerEvent): void {
    this.target?.setInteractionState("enabled");
    handleEvents(this.options.pointerleave, evt);
  }
  pointerMove(evt: PointerEvent): void {
    handleEvents(this.options.pointermove, evt);
  }
}