import { CounterAtom, zboolean } from ":foundation";

//
//
//

export interface DragHandlerOptions {
  dragData?: any;
  mayDrag?: zboolean;
  blankDragImage?: zboolean;
  dragAction?: (evt: DragEvent) => void;
  dragStartAction?: (evt: DragEvent) => void;
  dragEndAction?: (evt: DragEvent) => void;
}
export interface DropHandlerOptions {
  acceptsDrop?: zboolean;
  acceptsData?: (data: unknown) => boolean;
  dataTransferEffect?: "copy" | "move" | "link" | "none";
  dropAction: (data: unknown) => void;
}


export interface Events {
  click?: MouseAction;
  dblClick?: MouseAction;
  mouseDown?: MouseAction;
  mouseUp?: MouseAction;
  mouseOver?: MouseAction;
  mouseMove?: MouseAction;
  contextMenu?: MouseAction;
  blur?: FocusAction;
  focus?: FocusAction;
  keyDown?: KeyboardAction;
  keyUp?: KeyboardAction;
  input?: InputAction;
  pointerDown?: PointerAction;
  pointerUp?: PointerAction;
  pointerOver?: PointerAction;
  pointerLeave?: PointerAction;
  pointerMove?: PointerAction;
  change?: GenericEventAction;
  select?: GenericEventAction;
  cut?: ClipboardAction;
  copy?: ClipboardAction;
  paste?: ClipboardAction;
  wheel?: WheelAction;

  keyBindings?: KeyBindings;
  drag?: DragHandlerOptions;
  drop?: DropHandlerOptions;
}

export type EventsKey = keyof Events;

export function isEventActionsKey(key: EventsKey): boolean {
  return !["keyBindings", "drag", "drop"].includes(key);
}

export type EventAction<T extends Event> = (event: T) => void;

export type EventActions<E extends Event> = EventAction<E> | EventAction<E>[];

export type GenericEventAction = EventActions<Event>;
export type MouseAction = EventActions<MouseEvent>; 
export type PointerAction = EventActions<PointerEvent>;
export type FocusAction = EventActions<FocusEvent>;
export type InputAction = EventActions<InputEvent>;
export type DragAction = EventActions<DragEvent>; 
export type KeyboardAction = EventActions<KeyboardEvent>; 
export type ClipboardAction = EventActions<ClipboardEvent>;
export type WheelAction = EventActions<WheelEvent>;

export type KeyBindings = { [keyOrCode: string]: KeyboardAction };

export function handleEvents<E extends Event, A extends EventAction<E>>(actions?: A | A[], event?: E): void {
  if (actions && event) {
    if (Array.isArray(actions)) {
      actions.forEach((action) => action(event));
    } else {
      actions(event);
    }
  }
}

export function counterKeyBindings(counter: CounterAtom): KeyBindings {
  return {
    "ArrowDown": (): number => counter.increment(),
    "ArrowUp": (): number => counter.decrement(),
    "Home": (): void => counter.setToMin(),
    "End": (): void => counter.setToMax(),
  };
}


