import { zstring, znumber, Atom } from ":foundation";
import { View, css_color, core, defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
import { HStack, Spacer, StackOptions } from "../Layout";
import { TextLabel, TextLabelOptions, Icon, IconOptions } from "../Content";

//
// ExpandableItems are used in Tree and Disclosure components. The layout of an item is
// just an HStack containing a label and an icon; the icon may appear either on the left
// or on the right. The icon will typically be transformed to indicate whether the item is
// expanded or collapsed, either by changing the iconName, or by applying a transform (e.g.,
// rotated). Each item that can be expanded should be configured with a click action that
// modifies the underlying model.
//
// TODO: consider implementing this using LabelWithIcons (or eliminating it entirely
// and go straight from SimpleDisclosureList to LabelWithIcons).

export interface ExpandableItemOptions extends StackOptions {
  label?: zstring;
  extraLabelClasses?: string;
  textColor?: css_color;
  expanded?: Atom<boolean>;
  iconName?: zstring;
  iconTransform?: zstring;
  iconTransition?: zstring;
  iconSide?: "left" | "right";
  iconOpacity?: znumber;
  alwaysExpanded?: boolean;
  textLabelOptions?: TextLabelOptions;
}
defineComponentBundle<ExpandableItemOptions>("ExpandableItem", "HStack", {
  background: core.color.surface,
  rounding: core.rounding.none,
  padding: core.space.s2,
  textColor: core.color.surface.contrast,
  font: core.font.title_medium,
  selectionColor: core.color.secondaryContainer,
  alignItems: "stretch",
  outline: core.border.none,
});

export function ExpandableItem(inOptions: BV<ExpandableItemOptions> = {}): View {
  const options = mergeComponentOptions("ExpandableItem", inOptions);

  const labelOptions: TextLabelOptions = {
    extraClasses: options.extraLabelClasses,
    background: core.color.none,
    font: core.font.body_medium,
    textPositionX: "start",
    color: options.textColor,
    selected: options.selected,
    overflow: "hidden",
    ...options.textLabelOptions,
  };

  const label = TextLabel(options.label || "", labelOptions);
  const iconOptions: IconOptions = {
    color: core.color.surface.contrast,
    opacity: options.iconOpacity,
    transform: options.iconTransform,
    transition: options.iconTransition,
  };
  const icon = options.alwaysExpanded ? undefined : Icon(options.iconName!, iconOptions);

  return restoreOptions(
    options.iconSide === "right"
      ? HStack(options).append(label, Spacer(1), icon)
      : HStack(options).append(icon, label, Spacer(1))
  );
}
