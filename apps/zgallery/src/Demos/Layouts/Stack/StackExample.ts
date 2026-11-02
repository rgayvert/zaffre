import { TextLabel, Button, Icon, Spacer, Stack, LabelBox, CSSFlexDirection, simpleMenuItemList, atom } from "zaffre";
import { HStack, DropDownButton } from "zaffre";
import { stackExampleRules } from "./StackExample.rules";

const directions = ["row", "row-reverse", "column", "column-reverse"] as const;

export const StackExample = () => {
  const selectedDirection = atom(<CSSFlexDirection>"row");
  const flexDirectionList = simpleMenuItemList([...directions], selectedDirection);
  return HStack({ rules: stackExampleRules, cls: "sample-top" }).append(
    LabelBox("Direction:").append(
      DropDownButton(flexDirectionList)
    ),
    Stack({ cls: "sample-stack", flexDirection: () => selectedDirection.get() }).append(
      TextLabel("TextLabel"),
      Button({ label: "Button" }),
      Spacer("s5"),
      Icon("icon.shopping-cart")
    )
  );
};
