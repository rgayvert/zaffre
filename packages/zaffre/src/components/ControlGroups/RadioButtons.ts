import { Atom, zstring } from ":foundation";
import { View, css_flexDirection, core, defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
import { SelectionEnsemble, Stack } from "../Layout";
import { RadioButton, RadioButtonOptions } from "../Controls";
import { LabelBox, LabelBoxOptions } from "./LabelBox";

//
// A RadioButtons component is a stack of labeled RadioButton controls which share a groupValue,
// so that only one may be in a selected state.
//

export interface RadioButtonsOptions extends RadioButtonOptions {
  flexDirection?: css_flexDirection;
  initialValue?: zstring;
  radioButtonOptions?: RadioButtonOptions;
  labelBoxOptions?: LabelBoxOptions;
}
defineComponentBundle<RadioButtonsOptions>("RadioButtons", "RadioButton", {
  flexDirection: "column",
  background: core.color.none,
  border: core.border.none,
});

export function RadioButtons(
  groupValue: Atom<string>,
  values: string[],
  labels = values,
  inOptions: BV<RadioButtonsOptions> = {}
): View {
  const options = mergeComponentOptions("RadioButtons", inOptions);
  return restoreOptions(
    Stack({ flexDirection: options.flexDirection, gap: core.space.s4 }).append(
      SelectionEnsemble(values, groupValue, (value, index) =>
        LabelBox(labels[index], options.labelBoxOptions).append(
          RadioButton(groupValue, value, options.radioButtonOptions)
        )
      )
    )
  );
}
