import { znumber, zstring } from ":foundation";
import { css_border, css_color, css_font, css_space, css_margin, css_width, css_rounding, css_backfaceVisibility, css_fontWeight, css_verticalAlign, css_boxShadow, css_objectFit, css_backgroundClip, css_backgroundAttachment, css_backgroundOrigin } from ":attributes";
import { css_background, css_gridAutoFlow, css_textTransform, css_padding } from ":attributes";
import { css_viewOffset, css_aspectRatio, css_clipPath, css_content, css_cursor, css_filter } from ":attributes";
import { css_flexGrow, css_flexShrink, css_flexBasis, css_flex, css_flexWrap, css_display, css_fontSize } from ":attributes";
import { css_isolation, css_flexDirection, css_overflow, css_pointerEvents, css_zIndex, css_userSelect } from ":attributes";
import { css_visibility, css_whiteSpace, css_transformStyle } from ":attributes";
import { css_align, css_alignSelf, css_appearance, css_borderStyle, css_position, css_justify, css_justifySelf } from ":attributes";
import { css_length, css_resize, css_textAlign, css_textOverflow } from ":attributes";

//
// Options that are converted into CSS attributes.
//

export interface CSSAttributeOptions {
  alignItems?: css_align;
  //alignmentBaseline?: string;   // not supported on Firefox
  alignSelf?: css_alignSelf;
  appearance?: css_appearance;
  aspectRatio?: css_aspectRatio;
  backdropFilter?: css_filter;
  backfaceVisibility?: css_backfaceVisibility;

  background?: css_background;
  backgroundClip?: css_backgroundClip;

  backgroundAttachment?: css_backgroundAttachment;
  backgroundBlendMode?: zstring;
  backgroundImage?: zstring;
  backgroundOrigin?: css_backgroundOrigin,
  backgroundPosition?: "center",
  backgroundPositionX?: "center",
  backgroundPositionY?: "center",
  backgroundRepeat?: "no-repeat",
  backgroundSize?: "contain",

  border?: css_border;
  borderImage?: zstring;
  borderImageWidth?: zstring;
  borderTop?: css_border;
  borderTopColor?: css_color;
  borderRight?: css_border;
  borderRightColor?: css_color;
  borderBottom?: css_border;
  borderBottomColor?: css_color;
  borderLeft?: css_border;
  borderLeftColor?: css_color;
  borderColor?: css_color;
  borderRadius?: css_rounding;
  borderStyle?: css_borderStyle;
  borderWidth?: css_length;
  bottom?: css_viewOffset;
  boxShadow?: css_boxShadow;
  clipPath?: css_clipPath;
  color?: css_color;
  columnGap?: css_space;
  content?: css_content;
  cursor?: css_cursor;
  display?: css_display;
  filter?: css_filter;
  flex?: css_flex;
  flexBasis?: css_flexBasis;
  flexDirection?: css_flexDirection;
  flexGrow?: css_flexGrow;
  flexShrink?: css_flexShrink;
  flexWrap?: css_flexWrap;
  font?: css_font;
  fontSize?: css_fontSize;
  fontWeight?: css_fontWeight;
  gap?: css_space;
  gridArea?: zstring;
  gridColumn?: number;
  gridRow?: number;
  gridAutoFlow?: css_gridAutoFlow;
  gridTemplateAreas?: zstring;
  gridTemplateColumns?: zstring;
  gridTemplateRows?: zstring;
  height?: css_width;
  inset?: css_viewOffset;
  isolation?: css_isolation;
  justifyContent?: css_justify;
  justifyItems?: css_justify;
  justifySelf?: css_justifySelf;
  left?: css_viewOffset;
  lineHeight?: css_length;
  margin?: css_margin;
  marginBottom?: css_margin;
  marginLeft?: css_margin;
  marginRight?: css_margin;
  marginTop?: css_margin;
  marginBlock?: css_margin;
  marginBlockEnd?: css_margin;
  marginBlockStart?: css_margin;
  marginInline?: css_margin;
  marginInlineEnd?: css_margin;
  marginInlineStart?: css_margin;
  maxHeight?: css_width;
  maxWidth?: css_width;
  minBlockSize?: css_width;
  minHeight?: css_width;
  minInlineSize?: css_width;
  minWidth?: css_width;
  objectFit?: css_objectFit;
  opacity?: znumber;
  order?: znumber;
  outline?: css_border;
  overflow?: css_overflow;
  overflowX?: css_overflow;
  overflowY?: css_overflow;
  padding?: css_padding;
  paddingBlock?: css_padding;
  paddingBlockEnd?: css_padding;
  paddingBlockStart?: css_padding;
  paddingInline?: css_padding;
  paddingInlineEnd?: css_padding;
  paddingInlineStart?: css_padding;
  paddingTop?: css_padding;
  paddingRight?: css_padding;
  paddingBottom?: css_padding;
  paddingLeft?: css_padding;
  placeContent?: zstring;
  placeItems?: zstring;
  placeSelf?: zstring;
  pointerEvents?: css_pointerEvents;
  position?: css_position;
  resize?: css_resize;           
  right?: css_viewOffset;
  rowGap?: css_space;
  textAlign?: css_textAlign;
  textDecoration?: zstring;
  textOverflow?: zstring;
  textTransform?: css_textTransform;
  top?: css_viewOffset;
  transform?: zstring;
  transformOrigin?: zstring;
  transformStyle?: css_transformStyle;
  transition?: zstring;
  userSelect?: css_userSelect;
  verticalAlign?: css_verticalAlign | css_length;
  visibility?: css_visibility;
  whiteSpace?: css_whiteSpace;
  width?: css_width;
  zIndex?: css_zIndex;
}

export const cssOptionKeys = [
  "alignItems",
  //"alignmentBaseline",   // not supported on Firefox
  "alignSelf",
  "appearance",
  "aspectRatio",
  "backdropFilter",
  "backfaceVisibility",
  "background",
  "backgroundAttachment",
  "backgroundBlendMode",
  "backgroundClip",
  "backgroundImage",
  "backgroundOrigin",
  "backgroundPosition",
  "backgroundPositionX",
  "backgroundPositionY",
  "backgroundRepeat",
  "backgroundSize",
  "border",
  "borderImage",
  "borderImageWidth",
  "borderTop",
  "borderTopColor",
  "borderRight",
  "borderRightColor",
  "borderBottom",
  "borderBottomColor",
  "borderLeft",
  "borderLeftColor",
  "borderColor",
  "borderRadius",
  "borderStyle",
  "borderWidth",
  "bottom",
  "boxShadow",
  "clipPath",
  "color",
  "columnGap",
  "content",
  "cursor",
  "display",
  "filter",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "font",
  "fontSize",
  "fontWeight",
  "gap",
  "gridArea",
  "gridAutoFlow",
  "gridColumn",
  "gridRow",
  "gridTemplateAreas",
  "gridTemplateColumns",
  "gridTemplateRows",
  "height",
  "inset",
  "isolation",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  "left",
  "lineHeight",
  "margin",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marginBlock",
  "marginBlockEnd",
  "marginBlockStart",
  "marginInline",
  "marginInlineEnd",
  "marginInlineStart",
  "maxHeight",
  "maxWidth",
  "minBlockSize",
  "minHeight",
  "minInlineSize",
  "minWidth",
  "objectFit",
  "opacity",
  "order",
  "outline",
  "overflow",
  "overflowX",
  "overflowY",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "paddingBlock",
  "paddingBlockEnd",
  "paddingBlockStart",
  "paddingInline",
  "paddingInlineEnd",
  "paddingInlineStart",
  "placeContent",
  "placeItems",
  "placeSelf",
  "pointerEvents",
  "position",
  "resize",
  "right",
  "rowGap",
  "textAlign",
  "textDecoration",
  "textOverflow",
  "textTransform",
  "top",
  "transform",
  "transformOrigin",
  "transformStyle",
  "transition",
  "userSelect",
  "verticalAlign",
  "visibility",
  "whiteSpace",
  "width",
  "zIndex",
] as const;

export type CSSOptionKey = (typeof cssOptionKeys)[number];
export const cssOptionKeyList: string[] = [...cssOptionKeys];


export const addRule = <T>(ruleName: string, options: () => T, values: any): void => {

}

export const addRules = (rules: any): void => {
}
