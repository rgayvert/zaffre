import { px, zcolor,zborder, zfont, zrounding } from "zaffre";

export const tilePuzzleRules = {
  "Square": {
    rounding: zrounding.none,
    color: zcolor.background.contrast,
    ripple: false,
  },
  "Square>TextLabel": {
    font: zfont.inherit,
  },
  "GridTilePuzzle": {
    gap: px(2),
    background: zcolor.blue,
    aspectRatio: 1.0,
    border: zborder.medium.color(zcolor.blue),
  },
  "BoxTilePuzzle": {
    background: zcolor.blue,
    aspectRatio: 1.0,
  },
};
