import { Atom, zget, zstring } from ":foundation";
import { Button, ButtonOptions } from "./Button";
import { addClass } from ":view";

//
// A single RadioButton displays a boolean value as a pair of icons. When the groupValue
// matches the button's value, the on icon is shown; otherwise the off icon is shown.
//

export interface RadioButtonOptions extends ButtonOptions {
  onIcon?: zstring;
  offIcon?: zstring;
}

export const RadioButton = (groupValue: Atom<string>, value: zstring, inOptions: RadioButtonOptions = {}) => {
  const options = addClass(inOptions, "RadioButton");
  options.model = [groupValue, value];

  options.clickAction = (): void => groupValue.set(zget(value));
  options.model = [groupValue, value];

  options.leadingIconURI = () => (groupValue.get() === zget(value) ? zget(options.onIcon!) : zget(options.offIcon!));

  return Button(options);
};
