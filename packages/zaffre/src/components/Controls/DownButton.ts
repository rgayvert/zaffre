import { addOptionEvents, View } from ":core";
import { defineComponentDefaults, mergeComponentDefaults } from ":core";
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
  defineComponentDefaults<DownButtonOptions>("DownButton", "Button", {
    intervalMillis: 100,
  });
  
  export function DownButton(inOptions: DownButtonOptions = {}): View {
    const options = mergeComponentDefaults("DownButton", inOptions);
    let timerID: ReturnType<typeof setTimeout> | undefined;
    function mouseDown(evt: MouseEvent): void {
      options.downAction?.(evt)
      timerID = setTimeout(() => mouseDown(evt), options.intervalMillis);
    }
    addOptionEvents(options, {
      mouseDown: (evt) => mouseDown(evt),
      mouseUp: () => clearTimeout(timerID),
    });
  
    return Button(options);
  }
  