import { Atom, nullish } from ":foundation";
import { addClass, addOptionEvents, afterOptionsMerged, Color } from ":core";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// A ColorInput is a wrapper around a standard <input type="color"> element.
// The value is a reactive Color object, so no parsing is required.
//

export interface ColorInputOptions extends TextInputOptions {
  pickTrigger?: Atom<boolean>;
}

export const ColorInput = (value: Atom<Color | null>, inOptions: ColorInputOptions = {}) => {
  const options = addClass(inOptions, "ColorInput");
  options.inputType = "color";

  afterOptionsMerged(options, (view) => {
    const inputElt = <HTMLInputElement>view.elt;
    options.pickTrigger?.addAction(() => inputElt.showPicker());
    addOptionEvents(options, {
      click: () => inputElt.showPicker(),
    });
  });

  return GenericTextInput(
    value,
    (color: Color | nullish) => (color ? color.asHex() : ""),
    (text: string | nullish) => (text ? Color.fromHex(text) : null),
    options,
  );
};
