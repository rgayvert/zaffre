import { Atom, BasicAction, zstring } from ":foundation";
import { addClass, View } from ":view";
import { HStack } from "../Layout";
import { Button } from "../Controls";
import { URLInput } from "./TextInput";
import { BoxOptions } from "../HTML";

export interface URLInputBoxOptions extends BoxOptions {
  iconName?: zstring;
  action?: BasicAction;
}

// TODO: merge this with URLInput w/ an option to show icon
export const URLInputBox = (text: Atom<string>, inOptions: URLInputBoxOptions = {}): View => {
  const options = addClass(inOptions, "URLInputBox");
  options.model = text;
  options.action ??= () => openURL();

  // TODO: setting the action this way doesn't seem to work; from a ValueField, the openAction option works fine
  //options.action ??= () => window.open(text.get());

  const openURL = () => {
    window.open(text.get());
  };
  return HStack(options).append(URLInput(text), Button({ action: options.action }));
};
