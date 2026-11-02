import { addClass } from ":core";
import { HStack, StackOptions } from "../Layout";
import { Icon, TextLabel } from "../Content";
import { Tuple2, zstring } from ":foundation";

export type IconLabelTuple = Tuple2<zstring>;

export interface IconLabelOptions extends StackOptions {}

export const IconLabel = (iconLabel: IconLabelTuple, inOptions: IconLabelOptions = {}) => {
  const options = addClass(inOptions, "IconLabel");
  const icon = iconLabel[0] || "blank";
  const label = iconLabel[1] || "&nbsp;";

  return HStack(options).append(
    Icon(icon, { cls: "IconLabel.Icon" }),
    TextLabel(label, { cls: "IconLabel.TextLabel" })
  );
};
