import { lazyinit, zboolean } from ":foundation";
import { DragAction, DragHandlerOptions } from "./Events";
import { HandlerTarget } from "./Handler";
import { EventHandler } from "./EventHandler";
import { DragEventType } from "./Listener";

//
//
//

export type DragActions = Record<DragEventType, DragAction>;

export function dragHandler(options: DragHandlerOptions): DragHandler {
  return new DragHandler(options, options.mayDrag || true);
}

export class DragHandler extends EventHandler<DragEventType, DragEvent> {
  static dragData = {};
  static dragSource: HandlerTarget | undefined;

  @lazyinit static get emptyDragImage(): HTMLImageElement {
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    return img;
  }

  inDrag = false;

  constructor(public options: DragHandlerOptions, active: zboolean) {
    const actions = {
      dragstart: (evt: DragEvent): void => this.dragStart(evt),
      drag: (evt: DragEvent): void => this.drag(evt),
      dragend: (evt: DragEvent): void => this.dragEnd(evt),
    };
    super(actions, active);
    // ensure empty drag image is created before we try to use it
    DragHandler.emptyDragImage;
  }

  afterSetTarget(target: HandlerTarget): void {
    super.afterSetTarget(target);
    //if (this.options.effect) {
    //  this.addInteractionEffect("dragged", this.options.effect);
    //}
  }

  dragStart(evt: DragEvent): void {
    this.inDrag = true;
    DragHandler.dragSource = this.target;
    if (evt.dataTransfer) {
      evt.dataTransfer.setData("text", "drag");
      evt.dataTransfer.effectAllowed = "move";
      if (this.options.blankDragImage) {
        evt.dataTransfer.setDragImage(DragHandler.emptyDragImage, 0, 0);
      }
    }
    DragHandler.dragData = this.options.dragData;
    this.target?.setInteractionState("dragged");
    this.options.dragStartAction?.(evt);
  }
  drag(evt: DragEvent): void {
    if (this.inDrag) {
      if (evt.screenX !== 0) {
        this.options.dragAction?.(evt);
      }
    }
  }
  dragEnd(evt: DragEvent): void {
    if (this.inDrag) {
      this.inDrag = false;
      DragHandler.dragSource = undefined;
      this.target?.setInteractionState("enabled");
      this.options.dragEndAction?.(evt);
    }
  }
}
