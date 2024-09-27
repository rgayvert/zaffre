import { indexedArrayAtom, zstring, zget } from ":foundation";
import { View, place, handleEvents, addOptionEvents } from ":core";
import { core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Button, ButtonOptions } from "../Controls";
import { ToastStack } from "./Toast";

//
// A ToastButton is a button that displays a toast item when clicked. This is usually intended to indicate
// that some action has been performed (e.g., copy to clipboard). This is implemented by giving the button
// its own ToastStack.
//

export interface ToastButtonOptions extends ButtonOptions {}
defineComponentDefaults<ButtonOptions>("ToastButton", "Button", {});
export function ToastButton(message: zstring, inOptions: ToastButtonOptions = {}): View {
  const options = mergeComponentDefaults("ToastButton", inOptions);
  addOptionEvents(options, { click: (evt) => handleClick(evt) });

  const toastItems = indexedArrayAtom<string>([]);

  function handleClick(evt: MouseEvent): void {
    evt.preventDefault();
    handleEvents(options.action, evt);
    if (options.preserveFocus) {
      setTimeout(() => View.lastFocus?.focus(), 10);
    }
    toastItems.addValue(zget(message));
  }
  return Button(options).append(
    ToastStack(toastItems, {
      placement: place.top,
      maxItems: 1,
      duration: 1500,
      itemOptions: {
        font: core.font.label_small,
        padding: core.space.s1,
        background: core.color.primary,
        color: core.color.white,
        rounding: core.rounding.r0,
      },
    })
  );
}
