import { zboolean, zutil } from ":foundation";
import { Effect } from ":effect";
import { EventHandler } from "./EventHandler";
import { MouseEventType } from "./Listener";
import { MouseAction, handleEvents } from "./Events";

//
// Handler for mouse events: click, dblClick, mouseDown, mouseUp, mouseOver, mouseMove, contentMenu
//

export type MouseActions = Record<MouseEventType, MouseAction>;

export type MouseHandlerOptions = {
  click?: MouseAction; 
  dblclick?: MouseAction;
  mousedown?: MouseAction;
  mouseup?: MouseAction;
  mouseover?: MouseAction;
  mousemove?: MouseAction;
  contextmenu?: MouseAction;
  effect?: Effect;
  active?: zboolean;
};
const defaultMouseHandlerOptions: MouseHandlerOptions = {
  active: true,
};

export function mouseHandler(inOptions: MouseHandlerOptions): MouseHandler {
  const options: MouseHandlerOptions = zutil.mergeOptions(defaultMouseHandlerOptions, inOptions);
  return new MouseHandler(options, options.active!, options.effect);
}



export class MouseHandler extends EventHandler<MouseEventType, MouseEvent> {
  constructor(protected options: MouseHandlerOptions, active: zboolean, protected effect?: Effect) {
    const clickAction = options.click ? { click: (evt: MouseEvent): Promise<void> => this.click(evt) } : undefined;
    const dblClickAction = options.dblclick ? { dblclick: (evt: MouseEvent): Promise<void> => this.dblClick(evt) } : undefined;
    const contextMenuAction = options.contextmenu ? { contextmenu: (evt: MouseEvent): Promise<void> => this.contextMenu(evt) } : undefined;
    const downAction = options.mousedown ? { mousedown: (evt: MouseEvent): Promise<void> => this.mouseDown(evt) } : undefined;
    const upAction = options.mouseup ? { mouseup: (evt: MouseEvent): Promise<void> => this.mouseUp(evt) } : undefined;
    const overAction = options.mouseover ? { mouseover: (evt: MouseEvent): Promise<void> => this.mouseOver(evt) } : undefined;
    const moveAction = options.mousemove ? { mousemove: (evt: MouseEvent): Promise<void> => this.mouseMove(evt) } : undefined;
    super({ ...clickAction, ...dblClickAction, ...downAction, ...upAction, ...overAction, ...moveAction, ...contextMenuAction }, active);
  }
  async click(evt: MouseEvent): Promise<void> {
    evt.stopPropagation();
    evt.preventDefault();
    this.target?.setInteractionState("clicked");
    this.target?.setClickPointFromEvent(evt);
    handleEvents(this.options.click, evt); // ?.(evt);
  }
  async dblClick(evt: MouseEvent): Promise<void> {
    handleEvents(this.options.dblclick, evt);
  }
  async mouseDown(evt: MouseEvent): Promise<void> {
    handleEvents(this.options.mousedown, evt);
  }
  async mouseUp(evt: MouseEvent): Promise<void> {
    handleEvents(this.options.mouseup, evt);
  }
  async mouseOver(evt: MouseEvent): Promise<void> {
    handleEvents(this.options.mouseover, evt);
  }
  async mouseMove(evt: MouseEvent): Promise<void> {
    handleEvents(this.options.mousemove, evt);
  }
  async contextMenu(evt: MouseEvent): Promise<void> {
    evt.preventDefault();
    handleEvents(this.options.contextmenu, evt);
  }
  
  performClickAction(): void {
    handleEvents(this.options.click, new MouseEvent("click"));
  }
}
