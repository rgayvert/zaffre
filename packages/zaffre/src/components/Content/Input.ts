import { zget, Atom } from ":foundation";
import { View, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Input - base component for all input components. Here we mostly just establish some
// common defaults. 
//
// TODO:
//  - add more support for patterns and validation
//

export type InputType = "button" | "checkbox" | "color" | "date" | "datetime-local" |
"email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" |
"range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";


export interface InputOptions extends BoxOptions {
  type?: InputType;
  maySetContent?: boolean;
  valid?: Atom<boolean>;
}
defineComponentDefaults<InputOptions>("Input", "Box", {
  color: core.color.primary,
  background: core.color.inherit,
  appearance: "none",
  border: core.border.none,
  outline: core.border.none,
  textAlign: "start",
  tabIndex: 0,
  spellCheck: false,
  tag: "input",
  type: "text",
  maySetContent: true,
});

export function Input(content: Atom<string>, inOptions: InputOptions = {}): View {
  const options = mergeComponentDefaults("Input", inOptions);

  options.model = content;

  options.onGetContent = (): string => zget(content);
  options.onApplyContent = (view: View): void => {
    const inputElt = <HTMLInputElement>view.elt;
    if (options.maySetContent) {
      inputElt.value = zget(content);
    }
    setTimeout(() => options.valid?.set(inputElt.validity.valid), 10);
  };
  return Box(options);
}
