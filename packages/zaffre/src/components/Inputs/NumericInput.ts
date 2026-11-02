import { Atom, nullish } from ":foundation";
import { addClass } from ":view";
import { HStack } from "../Layout";
import { Button } from "../Controls";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// NumericInput 
//

export interface NumericInputOptions extends TextInputOptions {
  decimalPlaces?: number;
}

export const NumericInput = (value: Atom<number>, inOptions: NumericInputOptions = {}) => {
  const options = addClass(inOptions, "NumericInput");
    options.model = value;

  options.inputType = "text";

  // TODO: why are we extracting a set of options here??
  const textOptions = {
    keyFilter: (key: string) => {
        return key === "Backspace" || /[0-9.]+/.test(key);
    },
    placeholder: options.placeholder,
    size: options.size
  };
  const incrementBy = (delta: number): void => {
    value.set(value.get() + delta);
  };

  const formatNumber = (value: number | nullish) => {
    return value ? value.toString() : "";
  };

  const parseNumericString = (s: string | nullish): number => {
    const num = s ? parseFloat(s) : 0;
    return isNaN(num) ? 0 : num;
  };

  return HStack(options).append(
    Button({ leadingIconURI: "icon.remove", action: () => incrementBy(-1) }),
    GenericTextInput(value, formatNumber, parseNumericString, textOptions),
    Button({ leadingIconURI: "icon.add", action: () => incrementBy(1) }),
  );
};


