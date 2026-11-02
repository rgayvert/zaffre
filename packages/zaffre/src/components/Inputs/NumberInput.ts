import { Atom, nullish, zutil } from ":foundation";
import { addClass } from ":view";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// NumberInput uses a standard "number" input, but the value is a reactive number.
// The numeric value can be rounded using the decimalPlaces options.
//

export interface NumberInputOptions extends TextInputOptions {
  decimalPlaces?: number;
}

export const NumberInput = (value: Atom<number>, inOptions: NumberInputOptions = {}) => {
  const options = addClass(inOptions, "NumberInput");
  options.inputType = "text";
  if (options.decimalPlaces) {
    options.step = Math.pow(10, -options.decimalPlaces).toString();
  }

  const parseNumericString = (s: string): number => {
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
  };
  const formatNumber = (num: number): string => {
    return num ? zutil.roundTo(num, options.decimalPlaces).toString() : "0"
  }

  return GenericTextInput(
    value,
    (num: number | nullish) => formatNumber(num || 0),
    (text: string | nullish) => parseNumericString(text || ""),
    options
  );
};

