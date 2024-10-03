import { Atom } from ":foundation";
import { View, addOptionEvents, Color, beforeAddedToDOM, BV } from ":core";
import { defineBaseOptions, mergeComponentOptions } from ":core";
import { InputOptions } from "../Content";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// A ColorInput is a wrapper around a standard <input type="color"> element.
// The value is a reactive Color object, so no parsing is required.
//

export interface ColorInputOptions extends InputOptions {
  pickTrigger?: Atom<boolean>;
}
defineBaseOptions<ColorInputOptions>("ColorInput", "Input", {});

export function ColorInput(value: Atom<Color>, inOptions: BV<ColorInputOptions> = {}): View {
  const options = mergeComponentOptions("ColorInput", inOptions);

  beforeAddedToDOM(options, (view: View): void => {
    const inputElt = <HTMLInputElement>view.elt;
    const viewOptions = <ColorInputOptions>view.options;
    viewOptions.pickTrigger?.addAction(() => inputElt.showPicker());
    addOptionEvents(viewOptions, {
      click: () => inputElt.showPicker(),
    });
  });

  return GenericTextInput(
    value,
    "color",
    (color: Color) => color.asHex(),
    (text: string) => Color.fromHex(text),
    <TextInputOptions>options
  );
}
