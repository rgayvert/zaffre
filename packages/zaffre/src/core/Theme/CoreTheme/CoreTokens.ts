import { borderToken, colorToken, px, ColorToken, FontToken, RoundingToken, SpaceToken, em, customFont } from ":attributes";

//
// Definitions of the core tokens
//

export const zspaceKeys = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"] as const;
type SpaceType = {
  [Key in (typeof zspaceKeys)[number]]: SpaceToken;
};
export type SpaceKey = keyof SpaceType;
export const space = <SpaceType>Object.fromEntries(zspaceKeys.map((s) => [s, new SpaceToken({ key: s })]));

export const zspace = {
  ...space,
  none: space.s0,
  em: (n: number) => em(n),
}
// NOTE: inherit doesn't work as a token, so just use it directly
const roundingKeys = ["r0", "r1", "r2", "r3", "r4", "r5", "pill", "circle", "none"] as const;
type RoundingType = {
  [Key in (typeof roundingKeys)[number]]: RoundingToken;
};
export const rounding = <RoundingType>Object.fromEntries(roundingKeys.map((s) => [s, new RoundingToken({ key: s })]));

export const zrounding = {
  ...rounding
};

const fontKeys = [
  "display_large",
  "display_medium",
  "display_small",
  "headline_large",
  "headline_medium",
  "headline_small",
  "title_large",
  "title_medium",
  "title_small",
  "body_large",
  "body_medium",
  "body_small",
  "label_large",
  "label_medium",
  "label_small",
  "none",
  "inherit",
] as const;

type FontType = {
  [Key in (typeof fontKeys)[number]]: FontToken;
};
const font = <FontType>Object.fromEntries(fontKeys.map((s) => [s, new FontToken({ key: s })]));

export const zfont = {
  ...font,
  rem: (sz: number, weight?: number) => customFont({ size: sz, weight })
}

const colorKeys = [
  "primary",
  "primaryContainer",
  "secondary",
  "secondaryContainer",
  "tertiary",
  "tertiaryContainer",
  "error",
  "errorContainer",
  "background",
  "surface",
  "outline",
  "shadow",
  "scrim",
  "success",
  "info",
  "warning",
  "danger",
  "blue",
  "cyan",
  "green",
  "indigo",
  "orange",
  "pink",
  "purple",
  "red",
  "teal",
  "yellow",
  "zaffre",
  "white",
  "black",
  "gray",
  "lightgray",
  "darkgray",
  "none",
  "transparent",
  "inherit",
] as const;
type ColorType = {
  [Key in (typeof colorKeys)[number]]: ColorToken;
};
const color = <ColorType>Object.fromEntries(colorKeys.map((s) => [s, colorToken({ key: s })]));

export const zcolor = {
  ...color, 
  rgb: (rgba: string) => colorToken({ rgba: rgba })
}

export const border = {
  thin: borderToken({ key: "thin", width: px(1), borderStyle: "solid", color: zcolor.primary.opacity(0.5) }),
  medium: borderToken({ key: "medium", width: px(2), borderStyle: "solid", color: zcolor.primary.opacity(0.2) }),
  thick: borderToken({ key: "thick", width: px(3), borderStyle: "solid", color: zcolor.primary.opacity(0.2) }),
  none: borderToken({ key: "none" }),
};

export const zborder = {
  ...border,
}

// export const core = {
//   border,
//   color,
//   font,
//   rounding,
//   space,
// };

