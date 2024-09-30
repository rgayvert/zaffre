import { atom, zget, Atom, zboolean } from ":foundation";

//
// A View delegates event handling to a set of listeners. A Listener has a reactive
// currentEvent. When View.addEventListener sends events here to handleEvent(), which
// set the currentEvent. 
//

export type GenericEventType = string; // "change" | "select" + possibly others
export type InputEventType = "input";
export type WheelEventType = "wheel";
export type FocusEventType = "focus" | "blur";
export type MouseEventType = "click" | "dblclick";
export type DragEventType = "dragstart" | "drag" | "dragend";
export type DropEventType = "dragover" | "dragenter" | "dragleave" | "drop";
export type PointerEventType = "pointerdown" | "pointerup" | "pointerover" | "pointerleave" | "pointermove";
export type KeyEventType = "keydown" | "keyup";
export type EventType = GenericEventType | InputEventType | FocusEventType | MouseEventType | DragEventType | DropEventType | PointerEventType | KeyEventType;
export type ClipboardEventType = "cut" | "copy" | "paste";


export interface ListenerTarget {
  zname: string;
  disabled: Atom<boolean>;
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

export class Listener<E extends Event> implements EventListenerObject {

  currentEvent: Atom<E | undefined> = atom(undefined);
  isActive: Atom<boolean>;

  constructor(public target: ListenerTarget, public type: EventType, public active: zboolean = true) {
    target.disabled.addAction(() => this.enableOrDisable());
    if (active instanceof Atom) {
      active.addAction(() => this.enableOrDisable());
    }
    this.isActive = atom(() => !this.target.disabled.get() && zget(this.active), { action: () => this.enableOrDisable() });
    this.enableOrDisable();
  }

  // add or remove event listener when our active state changes
  enableOrDisable(): void {
    if (this.isActive.get()) {
      this.target.addEventListener(this.type, this);
    } else {
      this.target.removeEventListener(this.type, this);
    }
  }

  // Note: this method gets called for any type registered with the target because
  // we called addEventListener with this object
  handleEvent(evt: E): void {
    if (evt.type === this.type) {
      this.currentEvent.set(evt);
    }
  }
}
