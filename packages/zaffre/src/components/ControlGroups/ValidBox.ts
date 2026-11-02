import { Atom, atom } from ":foundation";
import { addClass, View } from ":core";
import { StackOptions, VStack } from "../Layout";
import { TextLabel } from "../Content";

//
// A ValidBox is a borderless box that wraps around an input field, and
// includes a label that displays a string that comes from a validationFn.
// If the validation string is empty, the label will be hidden.
//
// TODO: Provide more options here, including different kinds of validation boxes.
//

export interface ValidBoxOptions extends StackOptions {}

export const ValidBox = <T>(inputView: View, value: Atom<T>, validationFn: (val: T) => string, inOptions: ValidBoxOptions = {}) => {
  const options = addClass(inOptions, "ValidBox");
  options.model = [inputView, value];

  const message = atom(() => validationFn(value.get()));

  return VStack(options).append(inputView, TextLabel(message, { hidden: () => message.get() === "" }));
};
