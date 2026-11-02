import { zget } from ":foundation";
import { clipboardHandler, ClipboardHandlerOptions, dragHandler, DragHandlerOptions, dropHandler } from ":events";
import { DropHandlerOptions, Events, focusHandler, FocusHandlerOptions, genericEventHandler } from ":events";
import { GenericEventHandlerOptions, Handler, inputHandler, InputHandlerOptions, keyHandler } from ":events";
import { KeyHandlerOptions, mouseHandler, MouseHandlerOptions, pointerHandler, PointerHandler } from ":events";
import { PointerHandlerOptions, wheelHandler, WheelHandlerOptions } from ":events";
import { View, ViewOptions } from "./View";

/*
  TODO: 
    // restore the focus after a click if preserveFocus is set
    const handleClick = (evt: MouseEvent): void => {
      evt.preventDefault();
      handleEvents(options.action, evt);
      if (options.preserveFocus) {
        setTimeout(() => lastFocusView?.focus(), 10);
      }
    };
*/

export class EventDelegate {
  constructor(public view: View) {
    //this.initializeEvents();    
  }

  get events(): Events {
    return this.view.options.events || {};
  }
  get options(): ViewOptions {
    return this.view.options;
  }

  initializeEvents(): void {
    const evts = this.events;
    if (
      evts.click ||
      evts.dblClick ||
      evts.mouseDown ||
      evts.mouseUp ||
      evts.mouseOver ||
      evts.mouseMove ||
      evts.contextMenu
    ) {
      this.addMouseHandler({
        click: evts.click,
        dblclick: evts.dblClick,
        mousedown: evts.mouseDown,
        mouseup: evts.mouseUp,
        mouseover: evts.mouseOver,
        mousemove: evts.mouseMove,
        contextmenu: evts.contextMenu,
      });
    }

    (evts.blur || evts.focus) && this.addFocusHandler({ blur: evts.blur, focus: evts.focus });
    evts.wheel && this.addWheelHandler({ wheel: evts.wheel });

    if (evts.keyDown || evts.keyUp || evts.keyBindings) {
      this.view.options.tabIndex = 0;
      this.addKeyHandler({ keydown: evts.keyDown, keyup: evts.keyUp, keyBindings: evts.keyBindings });
    }
    evts.drag && this.addDragHandler(evts.drag);
    evts.drop && this.addDropHandler(evts.drop);

    if (this.needsPointerEvents() && !this.view.handlers.some((h) => h instanceof PointerHandler)) {
      this.addPointerHandler({
        pointerdown: evts.pointerDown,
        pointerup: evts.pointerUp,
        pointerover: evts.pointerOver,
        pointerleave: evts.pointerLeave,
        pointermove: evts.pointerMove,
      });
    }
    evts.input && this.addInputHandler({ input: evts.input });
    evts.change && this.addGenericHandler({ change: evts.change });
    evts.select && this.addGenericHandler({ select: evts.select });

    if (evts.cut || evts.copy || evts.paste) {
      this.addClipboardHandler({ cut: evts.cut, copy: evts.copy, paste: evts.paste });
    }
  }

  addHandler(handler: Handler<unknown>): void {
    this.view.addHandler(handler);
  }

  addDragHandler(options: DragHandlerOptions): void {
    this.addHandler(dragHandler(options));
  }
  addDropHandler(options: DropHandlerOptions): void {
    this.addHandler(dropHandler(options));
  }
  addFocusHandler(options: FocusHandlerOptions): void {
    this.addHandler(focusHandler(options));
  }
  addWheelHandler(options: WheelHandlerOptions): void {
    this.addHandler(wheelHandler(options));
  }
  addGenericHandler(options: GenericEventHandlerOptions): void {
    this.addHandler(genericEventHandler(options));
  }
  addInputHandler(options: InputHandlerOptions): void {
    this.addHandler(inputHandler(options));
  }
  addKeyHandler(options: KeyHandlerOptions): void {
    this.addHandler(keyHandler(options));
  }
  addMouseHandler(options: MouseHandlerOptions): void {
    this.addHandler(mouseHandler(options));
  }
  addPointerHandler(options: PointerHandlerOptions): void {
    this.addHandler(pointerHandler(options));
  }
  addClipboardHandler(options: ClipboardHandlerOptions): void {
    this.addHandler(clipboardHandler(options));
  }

  needsPointerEvents(): boolean {
    const evts = this.events;
    return (
      Boolean(zget(this.options.tooltip)) ||
      zget(this.options.needsPointerEvents) ||
      Boolean(
        evts?.pointerMove ||
          evts?.pointerDown ||
          evts?.pointerUp ||
          evts?.pointerOver ||
          evts?.pointerLeave ||
          this.options.sharedState?.hovered
      )
    );
  }

}


export const getURLOfDroppedImageFromEvent = (e: DragEvent) => {
  const html = e.dataTransfer?.getData('text/html') || "";
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html").querySelector('img')?.src;
};
