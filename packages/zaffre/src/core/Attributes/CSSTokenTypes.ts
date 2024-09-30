import { ZType, LogicalBox } from ":foundation";
import { BackgroundToken, ColorToken, CalcToken, BorderToken, SpaceToken, PercentToken, LengthToken, FilterToken, GradientToken } from "./Tokens";
import { LiteralToken, FontToken, RoundingToken, FlexToken } from "./Tokens";
import { CSSClipPathGeometry, CSSFontSizeName } from "./CSSLiteralTypes";

//
// Type definitions for CSS properties that use tokens.
//


export type CSSOption<T> = ZType<T | LiteralToken | CalcToken | undefined>;

export type css_background = CSSOption<ColorToken | BackgroundToken | GradientToken>;
export type css_border = CSSOption<BorderToken | LogicalBox<BorderToken> | "none">;
export type css_color = CSSOption<ColorToken>;
export type css_filter = ZType<FilterToken | FilterToken[] | "none" | undefined>;
export type css_flex = CSSOption<FlexToken>;
export type css_flexBasis = CSSOption<LengthToken | PercentToken | "max-content" | "min-content" | "fit-content" | "auto" | "content">;
export type css_font = CSSOption<FontToken>;
export type css_fontSize = CSSOption<LengthToken | CalcToken | PercentToken | CSSFontSizeName>;
export type css_fontWeight = CSSOption<number | "normal" | "bold" | "lighter" | "bolder">;
export type css_length = CSSOption<LengthToken>;
export type css_length_pct = CSSOption<LengthToken | PercentToken>;
export type css_percent = CSSOption<PercentToken>;
export type css_rounding = CSSOption<RoundingToken | LengthToken | "inherit">;
export type css_space = CSSOption<CalcToken | SpaceToken>;
export type css_margin = CSSOption<CalcToken | SpaceToken | LengthToken | "auto">;
export type css_padding = css_margin;
export type css_viewOffset = CSSOption<LengthToken | PercentToken | "auto" | "inherit">;  
export type css_width = CSSOption<"auto" | "max-content" | "min-content" | "fit-content" | SpaceToken | LengthToken | PercentToken>;

export type ClipPathToken = LiteralToken;
export type ContentToken = LiteralToken;

export type css_clipPath = CSSOption<CSSClipPathGeometry | ClipPathToken>;
export type css_content = ZType<ContentToken | "normal" | "none">;

