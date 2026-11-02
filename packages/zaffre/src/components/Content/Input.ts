import { zget, Atom } from ":foundation";
import { Box, BoxOptions } from "../HTML";
import { addClass } from ":view";

//
// Input - base component for all input components. Here we mostly just establish some
// common defaults.
//
// TODO:
//  - add more support for patterns and validation
//

export type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export interface InputOptions extends BoxOptions {
  type?: InputType;
  maySetContent?: boolean;
  valid?: Atom<boolean>;
}

export const Input = (textValue: Atom<string>, inOptions: InputOptions = {}) => {
  const options = addClass(inOptions, "Input");
  options.tag = "input";
  options.model = textValue;

  options.onApplyContent = (view): void => {
    const inputElt = <HTMLInputElement>view.elt;
    if (options.maySetContent) {
      inputElt.value = zget(textValue);
    }
    setTimeout(() => options.valid?.set(inputElt.validity.valid), 10);
  };
  return Box(options);
};
