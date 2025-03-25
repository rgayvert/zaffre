import { Atom, atom } from ":foundation";
import { BV, core, defineComponentBundle, mergeComponentOptions, pct, restoreOptions, View } from ":core";
import { StackOptions, VStack } from "../Layout";
import { TextLabel } from "../Content";

//
// A ValidBox is a borderless box that wraps around an input field, and
// includes a text label that displays a string that comes from a validationFn.
// If the validation string is empty, the text label will be hidden.
//
// TODO: Provide more options here, including different kinds of validation boxes.
//

export interface ValidBoxOptions extends StackOptions {}
defineComponentBundle<ValidBoxOptions>("ValidBox", "Stack", {
  alignItems: "start",
  width: pct(100),
  background: undefined
});

export function ValidBox<T>(inputView: View, value: Atom<T>, validationFn: (val: T) => string, inOptions: BV<ValidBoxOptions> = {}): View {
  const options = mergeComponentOptions("ValidBox", inOptions);
  const message = atom(() => validationFn(value.get()));

  return restoreOptions(
    VStack(options).append(
      inputView,
      TextLabel(
        message,
        {
          font: core.font.label_small,
          color: core.color.error,
          hidden: atom(() => message.get() === ""),
        }
      )
    )
  );
}
