import { zcolor, customFont, transitions, zborder, zfont, zrounding, zspace, OptionRules } from "zaffre";

// Rules for all hello world demos

export const helloWorldRules: OptionRules = {
  "Button": {
    rounding: zrounding.pill,
    padding: zspace.s0,
    font: zfont.label_large,
  },
  "Switch": {
    font: zfont.label_large,
    widthInEm: 3,
  },
  "TextInput": {
    border: zborder.thin,
    rounding: zrounding.pill,
    textAlign: "center",
    font: zfont.headline_medium,
    placeholder: "Enter some text",
    setOnInput: true,
  },
  "sofia-text": {
    color: zcolor.primary.tone(70),
    font: customFont({ name: "Sofia", size: 32 }),
    effects: { contentChanged: transitions.fadeIn("in", 0.5) },
  },
  "TextLabel": {
    color: zcolor.primary,
    font: zfont.body_large,
  },
};
