import { Atom, znumber, zstring } from ":foundation";
import { addClass, afterOptionsMerged, View } from ":view";
import { HStack, Spacer, StackOptions } from "../Layout";
import { TextLabel, Icon } from "../Content";
import { Box } from "../HTML";
import { px } from ":attributes";

//
// ExpansionLabels are used in Tree and Disclosure components. The layout of an item is
// just an HStack containing a label and an icon; the icon may appear either on the left
// or on the right. The icon will typically be transformed to indicate whether the item is
// expanded or collapsed, either by changing the iconName, or by applying a transform (e.g.,
// rotated). Each item that can be expanded should be configured with a click action that
// modifies the underlying model.
//

export interface ExpansionLabelOptions extends StackOptions {
  label?: zstring;
  iconSide?: "left" | "right";
  expanded?: Atom<boolean>;
  iconName?: zstring;
  iconOpacity?: znumber;
  iconTransform?: zstring;
  iconTransition?: zstring;
  alwaysExpanded?: boolean;
  avatar?: View;
}

export const ExpansionLabel = (label: zstring, inOptions: ExpansionLabelOptions = {}) => {
  const options = addClass(inOptions, "ExpansionLabel");
  options.model = label;

  afterOptionsMerged(options, (view) => {
    const text = TextLabel(label || "", { selected: options.selected, cls: "ExpansionLabel.TextLabel" });
    const avatar = options.avatar;
    const avatarBox = avatar ? Box({ marginTop: px(1), paddingRight: px(2) }).append(avatar) : undefined;
    const icon = options.alwaysExpanded
      ? undefined
      : Icon(options.iconName!, {
          cls: "ExpansionLabel.Icon",
          transform: options.iconTransform,
          opacity: options.iconOpacity,
        });
    const parts = options.iconSide === "right" ? [avatarBox, text, Spacer(1), icon] : [icon, avatarBox, text, Spacer(1)];
    view.append(...parts);
  });
  
  return HStack(options);
};
