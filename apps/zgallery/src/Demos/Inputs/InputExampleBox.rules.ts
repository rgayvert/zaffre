import { ch, pct, px, zborder, zcolor, zfont, OptionRules, Atom } from "zaffre";
import { GridOptions, InputOptions, LabelBoxOptions, LabelOptions } from "zaffre";

export const inputExampleBoxRules: OptionRules = {
  "Grid": {
    templateColumns: "repeat(3, 1fr)",
    width: pct(90),
    maxWidth: ch(120),
  } satisfies GridOptions,
  "Input": {
    font: zfont.label_large,
    border: zborder.thin,
    justifySelf: "end",
  } satisfies InputOptions,
  "LabelBox": {
    font: zfont.label_large,
    border: zborder.none,
  } satisfies LabelBoxOptions,
  "TextLabel": {
    font: zfont.label_large,
  } satisfies LabelOptions,
  "PasswordInput": {
    border: zborder.thin.color(zcolor.blue),
  },
  "input-container": {
    gap: px(4),
    justifyContent: "end",
  },
};
