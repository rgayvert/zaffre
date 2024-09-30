import { ZType } from ":foundation";
import { CSSBorderStyle } from "./Tokens";

//
// Type definitions for CSS properties with literal types.
//

export type CSSClipPathGeometry = "margin-box" | "border-box" | "padding-box" | "content-box" | "fill-box" | "stroke-box" | "view-box";
export type CSSFontSizeName = "xx-small" | "x-small" | "small" | "medium" | "large" | "x-large" | "xx-large" | "xxx-large" | "smaller" | "larger" | "math";

export type CSSAspectRatio = number | "auto";
export type CSSBaseLinePosition = "baseline" | "first baseline" | "last baseline";
export type CSSTextAlign = "start" | "end" | "left" | "right" | "center" | "justify" | "match-parent" | "justify-all";
export type CSSTextOverflow = "clip" | "ellipsis" | string;
export type CSSResize = "none" | "auto" | "both" | "horizontal" | "vertical" | "block" | "inline";
export type CSSPosition = "absolute" | "fixed" | "relative" | "static" | "sticky" | "";
export type CSSAlign = "start" | "center" | "end" | "stretch" | "unset" | CSSBaseLinePosition;
export type CSSJustify = CSSAlign | "space-between" | "space-around" | "space-evenly";
export type CSSPositionalAlignment = "center" | "start" | "end" | "self-start" | "self-end" | "flex-start" | "flex-end";
export type CSSAlignSelf = "auto" | "normal" | "stretch" | CSSPositionalAlignment | CSSBaseLinePosition;
export type CSSJustifySelf = CSSAlignSelf;
export type CSSOverflow = "visible" | "hidden" | "clip" | "scroll" | "auto";
export type CSSAppearance = "none" | "auto";
export type CSSBackfaceVisibility = "visible" | "hidden" | "inherit";
export type CSSDisplay = "none" | "block" | "inline" | "inline-block" | "flex" | "inline-flex" | "grid" | "inline-grid" | "flow-root";
export type CSSFlexGrow = number | "inherit";
export type CSSFlexShrink = number | "inherit";
export type CSSFlexWrap = "nowrap" | "wrap" | "wrap-reverse" | "inherit";
export type CSSGridAutoFlow = "row" | "column" | "dense" | "row dense" | "column dense";
export type CSSIsolation = "auto" | "isolate";
export type CSSFlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type CSSPointerEvents = "auto" | "none";
export type CSSTextTransform = "capitalize" | "uppercase" | "lowercase" | "none" | "full-width" | "full-size-kana";
export type CSSUserSelect = "none" | "auto" | "text" | "contain" | "all";
export type CSSVisibility = "" | "visible" | "hidden" | "collapse";
export type CSSWhiteSpace = "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line" | "break-spaces";
export type CSSTransformStyle = "flat" | "preserve-3d";


export type css_align = ZType<CSSAlign>;
export type css_aspectRatio = ZType<CSSAspectRatio>;
export type css_appearance = ZType<CSSAppearance>;
export type css_backfaceVisibility = ZType<CSSBackfaceVisibility>;
export type css_borderStyle = ZType<CSSBorderStyle>;
export type css_position = ZType<CSSPosition>;
export type css_alignSelf = ZType<CSSAlignSelf>;
export type css_resize = ZType<CSSResize>;
export type css_justify = ZType<CSSJustify>;
export type css_justifySelf = ZType<CSSJustifySelf>;
export type css_textAlign = ZType<CSSTextAlign>;
export type css_textOverflow = ZType<CSSTextOverflow>;
export type css_overflow = ZType<CSSOverflow>;
export type css_display = ZType<CSSDisplay>;
export type css_flexGrow = ZType<CSSFlexGrow>;
export type css_flexDirection = ZType<CSSFlexDirection>;
export type css_flexShrink = ZType<CSSFlexShrink>;
export type css_flexWrap = ZType<CSSFlexWrap>;
export type css_gridAutoFlow = ZType<CSSGridAutoFlow>;
export type css_isolation = ZType<CSSIsolation>;
export type css_pointerEvents = ZType<CSSPointerEvents>;
export type css_textTransform = ZType<CSSTextTransform>;
export type css_transformStyle = ZType<CSSTransformStyle>;
export type css_userSelect = ZType<CSSUserSelect>;
export type css_visibility = ZType<CSSVisibility>;
export type css_whiteSpace = ZType<CSSWhiteSpace>;
export type css_zIndex = ZType<number | "auto">;




export type CursorName =
  "auto"
  | "default"
  | "none"
  | "context-menu"
  | "help"
  | "pointer"
  | "progress"
  | "wait"
  | "cell"
  | "crosshair"
  | "text"
  | "vertical-text"
  | "alias"
  | "copy"
  | "move"
  | "no-drop"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "e-resize"
  | "n-resize"
  | "ne-resize"
  | "nw-resize"
  | "s-resize"
  | "se-resize"
  | "sw-resize"
  | "w-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize"
  | "col-resize"
  | "row-resize"
  | "all-scroll"
  | "zoom-in"
  | "zoom-out";
export type css_cursor = ZType<CursorName>;



 