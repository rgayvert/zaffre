import { zget, zstring, ZType, Formatter } from ":foundation";
import { addClass, afterOptionsMerged, setInnerHTML } from ":view";
import { t } from ":app";
import { ColorToken } from ":attributes";
import { Box, BoxOptions } from "../HTML";
import { attributeEffect } from ":effect";
import { zcolor } from ":theme";

//
// TextLabel is a component often used by other components. It displays a
// non-wrapping string in a single font and zcolor. Options are provided for positioning
// the text within the box, but normally we just let it take the intrinsic size.
//
// We also have a pair of simple special cases, CenteredText and FormattedText.
//

export const defaultTextButtonInteractionEffects = () => {
  return {
    //enabled: attributeEffect("enabled", zcolor.primary, 1.0),
    disabled: attributeEffect("disabled", zcolor.primary, 0.8),
    hovered: attributeEffect("hovered", zcolor.red, 1.0),
    focused: attributeEffect("focused", zcolor.red, 0.8),
    pressed: attributeEffect("pressed", zcolor.red, 0.8),
    clicked: attributeEffect("clicked", zcolor.primary, 1.0),
  };
};

export type TextPosition = "start" | "center" | "end";

export interface LabelOptions extends BoxOptions {
  textPositionX?: ZType<TextPosition>;
  textPositionY?: ZType<TextPosition>;
  emptyValue?: string;
  disabledOpacity?: number;
}

export const TextLabel = (content: zstring, inOptions: LabelOptions = {}) => {
  const options = addClass(inOptions, "TextLabel");
  options.model = content;

  afterOptionsMerged(options, () => {
    options.onApplyContent = (view): void => {
      setInnerHTML(view, t(zget(content) || options.emptyValue || ""));
    };
    // TODO: this is the right idea, but there are issues with named tokens (e.g., "red") and
    // tokens like 'none' and 'inherit'
    if (options.background instanceof ColorToken) {
      options.color ??= options.background.contrast;
    }
    if (options.textPositionX || options.textPositionY) {
      options.display = "flex";
      options.flexDirection = "column";
      options.flexWrap = "nowrap";
      options.alignItems = options.textPositionX;
      options.justifyContent = options.textPositionY;
    }
    if (options.clickAction) {
      options.effects ??= defaultTextButtonInteractionEffects();
    }
  });
  
  return Box(options);
};

export const CenteredText = (content: zstring, inOptions: LabelOptions = {}) => {
  const options = addClass(inOptions, "CenteredText");
  options.model = content;

  options.textPositionX = "center";
  options.textPositionY = "center";
  return TextLabel(content, options);
};

export const FormattedText = <T>(content: ZType<T>, formatter: Formatter<T>, inOptions: LabelOptions = {}) => {
  const options = addClass(inOptions, "FormattedText");
  options.model = content;

  return TextLabel(() => formatter(zget(content)), options);
};

