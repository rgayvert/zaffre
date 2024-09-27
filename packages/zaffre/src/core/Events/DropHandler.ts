import { zboolean, zlog, zutil } from ":foundation";
import { HandlerTarget } from "./Handler";
import { DragAction, DropHandlerOptions } from "./Events";
import { DragHandler } from "./DragHandler";
import { EventHandler } from "./EventHandler";
import { DropEventType } from "./Listener";

//
//
//

export type DropActions = Record<DropEventType, DragAction>;

const defaultDropHandlerOptions = {
  acceptsDrop: true,
  acceptsData: (): boolean => true,
  dataTransferEffect: "copy",
};

export function dropHandler(inOptions: DropHandlerOptions): DropHandler {
  const options: DropHandlerOptions = zutil.mergeOptions(defaultDropHandlerOptions, inOptions);
  return new DropHandler(options, options.acceptsDrop!);
}

export class DropHandler extends EventHandler<DropEventType, DragEvent> {
  readyForDrop = false;

  constructor(public options: DropHandlerOptions, active: zboolean) {
    const actions = {
      dragover: (evt: DragEvent): void => this.dragOver(evt),
      dragleave: (evt: DragEvent): void => this.dragLeave(evt),
      drop: (evt: DragEvent): void => this.drop(evt),
    };
    super(actions, active);
  }

  afterSetTarget(target: HandlerTarget): void {
    super.afterSetTarget(target);
    //this.addInteractionEffect("draggedOver", this.options.effect);
  }

  dragOver(evt: DragEvent): void {
    evt.preventDefault();
    this.readyForDrop = true;
    if (evt.dataTransfer) {
      //evt.dataTransfer.dropEffect = this.options.dataTransferEffect!;
    }
    if (this.target !== DragHandler.dragSource) {
      //zlog.info("dragOver");
      this.target?.setInteractionState("draggedOver");
    }
  }
  dragLeave(evt: DragEvent): void {
    //zlog.info("dragLeave");
    this.target?.setInteractionState("enabled");
    this.readyForDrop = false;
  }
  drop(evt: DragEvent): void {
    //zlog.info("drop");
    evt.preventDefault();
    this.target?.setInteractionState("enabled");
    if (this.readyForDrop && this.options.acceptsData!(DragHandler.dragData)) {
      this.options.dropAction(DragHandler.dragData);
    }
    this.readyForDrop = false;
  }
}
