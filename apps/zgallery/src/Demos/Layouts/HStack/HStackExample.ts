import { TextLabel, Button, Icon, Spacer, HStack } from "zaffre";
import { hstackExampleRules } from "./HStackExample.rules";

export const HStackExample = () => {
  return HStack({ rules: hstackExampleRules, cls: "container" }).append(
    TextLabel("TextLabel"),
    Button({ label: "Button" }),
    Spacer(1),
    Icon("icon.shopping-cart")
  );
}
