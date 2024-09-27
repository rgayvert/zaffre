import { Atom, zutil } from ":foundation";
import { View, ch, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { GenericTextInput, TextInputOptions } from "./GenericTextInput";

//
// NumberInput uses a standard "number" input, but the value is a reactive number.
// The numeric value can be rounded using the decimalPlaces options.
//

export interface NumberInputOptions extends TextInputOptions {
  decimalPlaces?: number;
}
defineComponentDefaults<NumberInputOptions>("NumberInput", "TextInput", {
  decimalPlaces: 0,
  width: ch(10),
});

export function NumberInput(value: Atom<number>, inOptions: NumberInputOptions = {}): View {
  const options = mergeComponentDefaults("NumberInput", inOptions);

  function parseNumericString(s: string): number {
    const num = parseFloat(s);
    return isNaN(num) ? 0 : num;
  }

  return GenericTextInput(
    value,
    "number",
    (num: number) => zutil.roundTo(num, options.decimalPlaces!).toString(),
    (text: string) => parseNumericString(text),
    options
  );
}