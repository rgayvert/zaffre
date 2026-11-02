import { ch, OptionRules, px, zborder, zcolor, zfont, zrounding, zspace } from "zaffre";
import { ContrastingColorsModel } from "./ContrastingColorsModel";

export const luminanceRules2 = {
  Slider: {
    knobColor: zcolor.green,
  },
};

export const contrastingColorsRules = (model: ContrastingColorsModel): OptionRules => {
  return {
    Grid: {
      nrows: 3,
      gap: px(1),
      border: zborder.thin,
      background: zcolor.primaryContainer,
    },
    TextLabel: {
      font: zfont.title_medium,
    },
    Button: {
      rounding: zrounding.pill,
    },
    "adjust-bg": {
      label: "Adjust BG",
      action: () => model.adjustBackground(),
    },
    "adjust-fg": {
      label: "Adjust FG",
      action: () => model.adjustForeground(),
    },
    "color-box": {
      color: model.fgToken,
    },
    "color-box-row": {
      padding: zspace.s2,
      gap: zspace.s5,
      border: zborder.thin,
      background: model.bgToken,
    },
    VStack: {
      gap: zspace.s5,
      padding: zspace.s4,
      background: zcolor.background,
    },
    HStack: {
      gap: zspace.s5,
    },
    "luminance-selector": {
      background: zcolor.background,
      gap: zspace.s4,
      padding: zspace.s4,
    },
    DropDownButton: {
      width: ch(10),
    },
    "font-hm": {
      font: zfont.headline_medium
    },
    "font-bm": {
      font: zfont.body_medium
    },
    "font-ls": {
      font: zfont.label_small,
    },
  };
};
