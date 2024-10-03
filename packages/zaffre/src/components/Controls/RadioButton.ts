import { Atom, atom, zget, zstring } from ":foundation";
import { BV, View, core, defineBaseOptions, mergeComponentOptions } from ":core";
import { Button, ButtonOptions } from "./Button";

//
// A single RadioButton displays a boolean value as a pair of icons. When the groupValue
// matches the button's value, the on icon is shown; otherwise the off icon is shown.
//

export interface RadioButtonOptions extends ButtonOptions {
  onIcon?: zstring;
  offIcon?: zstring;
}
defineBaseOptions<RadioButtonOptions>("RadioButton", "Button", {
  onIcon: "icon.radio-button-on",
  offIcon: "icon.radio-button-off",
  background: core.color.none,
  border: core.border.none,
});

export function RadioButton(groupValue: Atom<string>, value: zstring, inOptions: BV<RadioButtonOptions> = {}): View {
  const options = mergeComponentOptions("RadioButton", inOptions);

  options.leadingIconURI = atom(() => (zget(groupValue) === value ? zget(options.onIcon!) : zget(options.offIcon!)));
  options.action = (): void => groupValue.set(zget(value));
  return Button(options);
}
