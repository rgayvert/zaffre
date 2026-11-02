import { zget, ztoggle, Atom, atom } from ":foundation";
import { addClass, afterOptionsMerged } from ":view";
import { Button } from "./Button";
import { ButtonOptions } from "./Button";

//
// A Checkbox is a simple toggle control with a pair of icons that switch
// when the value changes.
//

export interface CheckboxOptions extends ButtonOptions {
  checkedIcon?: string;
  uncheckedIcon?: string;
}

export const Checkbox = (value: Atom<boolean>, inOptions: CheckboxOptions = {}) => {
  const options = addClass(inOptions, "Checkbox");
  options.model = value;

  afterOptionsMerged(options, () => {
    options.action = (): void => ztoggle(value);
    options.leadingIconURI = atom(() => (zget(value) ? options.checkedIcon! : options.uncheckedIcon!));
  });

  return Button(options);
};
