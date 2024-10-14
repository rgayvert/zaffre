import { zstring } from ":foundation";
import { BV, View, core, defineComponentBundle, mergeComponentOptions, restoreOptions } from ":core";
import { HStack, Spacer, StackOptions } from "../Layout";
import { TextLabel, TextLabelOptions, Icon, IconOptions } from "../Content";

//
// LabelWithIcons: a horizontal stack with optional icons on either side.
// This is a common pattern used in multiple places, including buttons and list boxes.
// You can use one, two or three parts.
// The three parts are independent, other than their layout position. There is no
// assumption here about how they are related otherwise.
//

export interface LabelWithIconsOptions extends StackOptions {
  /** the text label to display */
  label?: zstring;
  /** options for the label */
  textLabelOptions?: TextLabelOptions;
  /** the uri of the leading icon */
  leadingIconURI?: zstring;
  /** the uri of the trailing icon */
  trailingIconURI?: zstring;
  /** options for the leading icon */
  leadingIconOptions?: IconOptions;
  /** options for the trailing icon */
  trailingIconOptions?: IconOptions;
}
const defaultIconOptions: IconOptions = {
  color: core.color.inherit,
  font: core.font.inherit,
  selectionColor: core.color.secondaryContainer,
};
defineComponentBundle<LabelWithIconsOptions>("LabelWithIcons", "Stack", {
  flexDirection: "row",
  background: core.color.inherit,
  rounding: core.rounding.none,
  alignItems: "center",
  outline: core.border.none,
  textLabelOptions: {
    background: core.color.inherit,
    padding: core.space.s2,
  },
  leadingIconOptions: {
    ...defaultIconOptions,
  },
  trailingIconOptions: {
    ...defaultIconOptions,
    selectionColor: core.color.primary,
  },
});

export function LabelWithIcons(inOptions: BV<LabelWithIconsOptions> = {}): View {
  const options = mergeComponentOptions("LabelWithIcons", inOptions);

  const labelOptions: TextLabelOptions = {
    selected: options.selected,
    selectionColor: options.selectionColor,
    ...options.textLabelOptions,
  };
  const label = options.label ? TextLabel(options.label, labelOptions) : undefined;
  const leadingIcon = options.leadingIconURI ? Icon(options.leadingIconURI, options.leadingIconOptions) : undefined;
  const trailingIcon = options.trailingIconURI ? Icon(options.trailingIconURI, options.trailingIconOptions) : undefined;
  const trailingSpacer = options.alignItems === "stretch" ? Spacer(1) : undefined;

  return restoreOptions(HStack(options).append(leadingIcon, label, trailingSpacer, trailingIcon));
}
