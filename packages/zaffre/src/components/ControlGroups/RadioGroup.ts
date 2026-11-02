import { Atom, zstring } from ":foundation";
import { SelectionEnsemble, Stack, StackOptions } from "../Layout";
import { RadioButton } from "../Controls";
import { LabelBox } from "./LabelBox";
import { addClass } from ":view";

//
// A RadioGroup component is a stack of labeled RadioButton controls which share a groupValue,
// so that only one may be in a selected state.
//

export interface RadioGroupOptions extends StackOptions {
  //flexDirection?: css_flexDirection;
  initialValue?: zstring;
}

export const RadioGroup = <T extends string>(groupValue: Atom<T>, values: T[], labels = values, inOptions: RadioGroupOptions = {}) => {
  const options = addClass(inOptions, "RadioGroup");
  options.model = [groupValue, values];

  return Stack(options).append(
    SelectionEnsemble(values, groupValue, (value, index) => LabelBox(labels[index]).append(RadioButton(groupValue, value))),
  );
};
