import { atom, zget, ztoggle, Atom } from ":foundation";
import { View, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Button, ButtonOptions } from "./Button";

//
// A Checkbox is a simple toggle control with a pair of icons that switch
// when the value changes.
//

export interface CheckboxOptions extends ButtonOptions {
  checkedIcon?: string;
  uncheckedIcon?: string;
}
defineComponentDefaults<CheckboxOptions>("Checkbox", "Button", {
  checkedIcon: "icon.checkbox-on",
  uncheckedIcon: "icon.checkbox-off",
  background: core.color.none, 
  border: core.border.none, 
  controlSize: "lg"
});

export function Checkbox(value: Atom<boolean>, inOptions: CheckboxOptions = {}): View {
  const options = mergeComponentDefaults("Checkbox", inOptions);

  options.leadingIconURI = atom(() => (zget(value) ? options.checkedIcon! : options.uncheckedIcon!));
  options.action = (): void => ztoggle(value); 

  return Button(options);
}
