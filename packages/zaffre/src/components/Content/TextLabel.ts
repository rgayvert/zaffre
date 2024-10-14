import { zget, zstring, ZType, atom, Formatter } from ":foundation";
import { t, View, setInnerHTML, ColorToken, core } from ":core";
import { defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// TextLabel is the most common component, used by many other components. It displays a
// non-wrapping string in a single font and color. Options are provided for positioning
// the text within the box, but normally we just let it take the intrinsic size.
//
// We also have a pair of simple special cases, CenteredTextLabel and FormattedLabel.
//

type TextPosition = "start" | "center" | "end";

export interface TextLabelOptions extends BoxOptions {
  textPositionX?: ZType<TextPosition>;
  textPositionY?: ZType<TextPosition>;
  emptyValue?: string;
}
defineComponentBundle<TextLabelOptions>("TextLabel", "Box", {
  font: core.font.body_medium,
  color: core.color.surface.contrast,
  selectionColor: core.color.secondaryContainer,
  background: core.color.inherit,
  outline: core.border.none,
  userSelect: "none",
  whiteSpace: "nowrap",
});

export function TextLabel(content: zstring, inOptions: BV<TextLabelOptions> = {}): View {
  const options = mergeComponentOptions("TextLabel", inOptions);
  const emptyValue = options.emptyValue || "";

  // TODO: this is the right idea, but there are issues with named tokens (e.g., "red") and
  // tokens like 'none' and 'inherit'
  if (options.background instanceof ColorToken) {
    options.color ??= options.background.contrast;
  }

  if (options.textPositionX || options.textPositionX) {
    options.display = "flex";
    options.flexDirection = "column";
    options.flexWrap = "nowrap";
    options.alignItems = options.textPositionX;
    options.justifyContent = options.textPositionY;
  }
  options.model ??= content;
  options.onGetContent = (): string => zget(content) || emptyValue;
  options.onApplyContent = (view: View): void => {
    setInnerHTML(view, t(zget(content) || emptyValue));
  };
  return restoreOptions(Box(options));
}

export interface CenteredTextLabelOptions extends TextLabelOptions {}

defineComponentBundle<CenteredTextLabelOptions>("CenteredTextLabel", "TextLabel", {
  textPositionX: "center",
  textPositionY: "center",
});
export function CenteredTextLabel(content: zstring, inOptions: BV<TextLabelOptions> = {}): View {
  const options = mergeComponentOptions("CenteredTextLabel", inOptions);
  return restoreOptions(TextLabel(content, options));
}

export interface FormattedLabelOptions extends TextLabelOptions {}

defineComponentBundle<FormattedLabelOptions>("FormattedLabel", "TextLabel", {});

export function FormattedLabel<T>(
  content: ZType<T>,
  formatter: Formatter<T>,
  inOptions: BV<FormattedLabelOptions> = {}
): View {
  const options = mergeComponentOptions("FormattedLabel", inOptions);
  return restoreOptions(
    TextLabel(
      atom(() => formatter(zget(content))),
      options
    )
  );
}
