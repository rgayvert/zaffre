import { addOptionEvents, BV, restoreOptions, View } from ":core";
import { defineComponentBundle, mergeComponentOptions } from ":core";
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
defineComponentBundle<DownButtonOptions>("DownButton", "Button", {
  intervalMillis: 100,
});

export function DownButton(inOptions: BV<DownButtonOptions> = {}): View {
  const options = mergeComponentOptions("DownButton", inOptions);
  let timerID: ReturnType<typeof setTimeout> | undefined;
  function mouseDown(evt: MouseEvent): void {
    options.downAction?.(evt);
    timerID = setTimeout(() => mouseDown(evt), options.intervalMillis);
  }
  addOptionEvents(options, {
    mouseDown: (evt) => mouseDown(evt),
    mouseUp: () => clearTimeout(timerID),
  });

  return restoreOptions(Button(options));
}
