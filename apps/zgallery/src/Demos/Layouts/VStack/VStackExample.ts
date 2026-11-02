import { TextLabel, VStack, Button, Icon, Spacer, zspace } from "zaffre";
import { vstackExampleRules } from "./VStackExample.rules";
 
export const VStackExample = () => {

  return VStack({ rules: vstackExampleRules }).append(
    TextLabel("TextLabel"), 
    Button({ label: "Button" }),
    Spacer("s5"), 
    Icon("icon.shopping-cart"), 
  );
}
  