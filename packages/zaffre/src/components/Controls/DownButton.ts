import { addClass, addOptionEvents } from ":core";
import { Button, ButtonOptions } from "./Button";

//
// A DownButton is a Button that repeats an action while the mouse is down at a fixed interval
//
// TODO: clear the interval when the mouse moves outside the button (maybe an option to capture?)
//

export interface DownButtonOptions extends ButtonOptions {
  intervalMillis?: number;
  downAction?: (evt: MouseEvent) => void;
}


export const DownButton = (inOptions: DownButtonOptions = {}) => {
const options = addClass(inOptions, "DownButton");

  let timerID: ReturnType<typeof setTimeout> | undefined;
  const mouseDown = (evt: MouseEvent): void => {
    options.downAction?.(evt);
    timerID = setTimeout(() => mouseDown(evt), options.intervalMillis);
  }
  addOptionEvents(options, {
    mouseDown: (evt) => mouseDown(evt),
    mouseUp: () => clearTimeout(timerID),
  });

  return Button(options);
}
