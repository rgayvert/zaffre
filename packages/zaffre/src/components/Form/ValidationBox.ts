import { atom } from ":foundation";
import { BV, core, defineComponentBundle, mergeComponentOptions, pct, restoreOptions, View } from ":core";
import { StackOptions, VStack } from "../Layout";
import { FormField, formFieldValidationMessage } from "./FormField";
import { TextLabel } from "../Content";

//
// A ValidationBox is a borderless box that wraps around a form field, and
// includes a text label that displays a string that comes from a validator.
// If the field is valid, the text label will be hidden.
//
// TODO: Provide more options here, including different kinds of validation boxes.
//

export interface ValidationBoxOptions extends StackOptions {}
defineComponentBundle<ValidationBoxOptions>("ValidationBox", "Stack", {
  alignItems: "start",
  width: pct(100),
});

export function ValidationBox<T>(field: FormField<T>, inputView: View, inOptions: BV<ValidationBoxOptions> = {}): View {
  const options = mergeComponentOptions("ValidationBox", inOptions);

  return restoreOptions(
    VStack(options).append(
      inputView,
      TextLabel(
        atom(() => formFieldValidationMessage(field)),
        {
          font: core.font.label_small,
          color: core.color.error,
          hidden: atom(() => field.isValid.get()),
        }
      )
    )
  );
}
