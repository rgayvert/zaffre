import { indexedArrayAtom, zstring, zget } from ":foundation";
import { place, handleEvents, addOptionEvents, lastFocusView, addClass } from ":core";
import { zcolor, zfont, zrounding, zspace } from ":core";
import { Button, ButtonOptions } from "../Controls";
import { ToastStack } from "./Toast";

//
// A ToastButton is a button that displays a toast item when clicked. This is usually intended to indicate
// that some action has been performed (e.g., copy to clipboard). This is implemented by giving the button
// its own ToastStack.
//

export interface ToastButtonOptions extends ButtonOptions {}


export const ToastButton = (message: zstring, inOptions: ToastButtonOptions = {}) => {
  const options = addClass(inOptions, "ToastButton");

  addOptionEvents(options, { click: (evt) => handleClick(evt) });

  const toastItems = indexedArrayAtom<string>([]);

  const handleClick = (evt: MouseEvent): void => {
    evt.preventDefault();
    handleEvents(options.action, evt);
    if (options.preserveFocus) {
      setTimeout(() => lastFocusView?.focus(), 10);
    }
    toastItems.addValue(zget(message));
  };
  return Button(options).append(
    ToastStack(toastItems, {
      placement: place.top,
      maxItems: 1,
      duration: 1500,
      itemOptions: {
        font: zfont.label_medium,
        padding: zspace.s1,
        background: zcolor.primary,
        color: zcolor.white,
        rounding: zrounding.none,
      },
    })
  );
};
