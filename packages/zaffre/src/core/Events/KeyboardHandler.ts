import { zboolean } from ":foundation";
import { EventHandler } from "./EventHandler";
import { KeyEventType } from "./Listener";
import { KeyBindings, KeyboardAction, handleEvents } from "./Events";

//
//
//

export interface KeyHandlerOptions {
    keydown?: KeyboardAction;
    keyup?: KeyboardAction;
    keyBindings?: KeyBindings;
  }
  
  export function keyHandler(options: KeyHandlerOptions, active: zboolean = true): KeyboardHandler {
    return new KeyboardHandler(options, active);
  }
  
  export class KeyboardHandler extends EventHandler<KeyEventType, KeyboardEvent> {
    constructor(protected options: KeyHandlerOptions, active: zboolean) {
      const keydown = options.keydown || options.keyBindings ? { keydown: (evt: KeyboardEvent): void => this.keyDown(evt) } : {};
      const keyup = options.keyup ? { keyup: (evt: KeyboardEvent): void => this.keyUp(evt) } : {};
      super({ ...keydown, ...keyup }, active);
    }
    generateModifier(evt: KeyboardEvent): string {
      return [
        evt.altKey ? "Alt" : "",
        evt.ctrlKey ? "Ctrl" : "",
        evt.metaKey ? "Meta" : "",
        evt.shiftKey ? "Shift" : ""
      ].filter((m) => m).join("-");
    }
    keyDown(evt: KeyboardEvent): void {
      const keys = Object.keys(this.options.keyBindings || {});
      const modifier = this.generateModifier(evt);
      const keyWithModifier = modifier + "-" + evt.key;
      if (modifier && keys.includes(keyWithModifier)) {
        evt.preventDefault();
        handleEvents(this.options.keyBindings?.[keyWithModifier], evt);
      } else if (keys.includes(evt.key)) {
        evt.preventDefault();
        handleEvents(this.options.keyBindings?.[evt.key], evt);
      } else if (keys.includes(evt.code)) {
        evt.preventDefault();
        handleEvents(this.options.keyBindings?.[evt.code], evt);
      } else {
        handleEvents(this.options.keydown, evt);
      }
    }
    keyUp(evt: KeyboardEvent): void {
      evt.preventDefault();
      handleEvents(this.options.keyup, evt);
    }
  }
  