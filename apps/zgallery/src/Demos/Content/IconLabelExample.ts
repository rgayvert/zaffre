import { HStack, zspace, IconLabel, addClass } from "zaffre";
import { iconLabelExampleRules } from "./IconLabelExample.rules";

export const IconLabelExample = () => {
  const options = addClass({}, "icon-label-example", iconLabelExampleRules);
  return HStack(options).append(
    IconLabel(["icon.shopping-cart", "Large label"], { cls: "icon-label-1" }),
    IconLabel(["icon.shopping-cart", "Small label"], { cls: "icon-label-2" }),
  );
};
