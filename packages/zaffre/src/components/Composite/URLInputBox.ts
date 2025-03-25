import { Atom, BasicAction, zstring } from ":foundation";
import { SimpleTextInput, TextInputOptions } from "../Inputs";
import { core } from ":theme";
import { defineComponentBundle, mergeComponentOptions, restoreOptions, View } from ":view";
import { BoxOptions } from "../HTML";
import { HStack } from "../Layout";
import { Button } from "../Controls";

export interface URLInputBoxOptions extends BoxOptions {
  iconName?: zstring;
  textInputOptions?: TextInputOptions;
  action?: BasicAction;
}
defineComponentBundle<URLInputBoxOptions>("URLInputBox", "Box", {
  iconName: "icon.open-link",
  border: core.border.none,
  textInputOptions: {},
  gap: core.space.s3,
});

export function URLInputBox(text: Atom<string>, inOptions: URLInputBoxOptions = {}): View {
  const options = mergeComponentOptions("URLInputBox", inOptions);
  // TODO: setting the action this way doesn't seem to work; from a FormField, the openAction option works fine
  //options.action ??= () => window.open(text.get());
  options.action ??= () => openURL();
  options.model = text;
  function openURL(): void {
    window.open(text.get());
  }
  return restoreOptions(
    HStack(options).append(
      SimpleTextInput(text, "url", options.textInputOptions),
      Button({
        leadingIconURI: options.iconName,
        border: core.border.none,
        action: options.action,
        controlSize: "lg",
      })
    )
  );
}
