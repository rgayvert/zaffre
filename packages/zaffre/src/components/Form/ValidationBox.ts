import { Atom, atom } from ":foundation";
import { addClass, px, View, zcolor, zfont } from ":core";
import { StackOptions, VStack } from "../Layout";
import { TextLabel } from "../Content";
import { FormField } from "./FormField";
import { Box } from "../HTML";

//
// A ValidationBox is a borderless box that wraps around a form field, and
// includes a label that displays a string that comes from a validator.
// If the field is valid, the label will be hidden.
//
// TODO: Provide more options here, including different kinds of validation boxes.
//

export interface ValidationBoxOptions extends StackOptions {
}

export const ValidationBox = <R extends {}, T>(
  field: FormField,
  inputView: View,
  readOnly = atom(false),
  inOptions: ValidationBoxOptions = {},
) => {
  const options = addClass(inOptions, "ValidationBox");

  const staticValue = atom(() => field.getDisplayValue());

  return Box(options).append(
    TextLabel(staticValue, { cls: "ValidationBox.staticValue", hidden: () => !readOnly.get() }),
    VStack({ cls: "ValidationBox.stack", hidden: () => readOnly!.get() }).append(
      inputView,
      TextLabel(
        atom(() => field.validationMessage?.get() || ""),
        {
          font: zfont.label_medium,
          fontSize: px(12),
          color: zcolor.error,
          hidden: () => field.isValid!.get(),
        },
      ),
    ),
  );
};
