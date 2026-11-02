import { HStack, toggleAtom, Switch, Spacer, TextLabel, atom, zspace } from "zaffre";
import { switchExampleRules } from "./SwitchExample.rules";

export const SwitchExample = () => {
  const switchValue = toggleAtom(false);

  return HStack({ rules: switchExampleRules }).append(
    Switch(switchValue, { controlSize: "xs" }),
    Switch(switchValue, { controlSize: "sm" }),
    Switch(switchValue),
    Spacer("s7"),
    TextLabel(() => `Value: ${switchValue.get()}`)
  );
};
