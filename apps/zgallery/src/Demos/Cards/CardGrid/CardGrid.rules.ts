import { ch, ImageBoxOptions, pct, TextBoxOptions, transitions, zcolor, zfont, zrounding, zspace } from "zaffre";

const hoverEffect = transitions.pullDownOverlay("in&out", "#44000000", "#44000025", 0.3, 0, "forwards");

export const rules = {
  CardGrid: {
    minColumnWidth: ch(30),
    gap: zspace.s6,
    padding: zspace.s4,
  },
  Card: {
    rounding: zrounding.r3,
    effects: { hovered: hoverEffect },
  },
  ElevatedBox: {
    rounding: zrounding.r3,
  },
  "Card>Card.Title": {
    textTransform: "capitalize",
    placeSelf: "center",
    font: zfont.title_medium,
    color: zcolor.primary,
    padding: zspace.s2,
  } satisfies TextBoxOptions,
  "Card>Card.Subtitle": {
    placeSelf: "center",
    font: zfont.body_medium,
    color: zcolor.primary,
  } satisfies TextBoxOptions,
  "Card>Card.Body": {
    font: zfont.body_medium,
    color: zcolor.primary,
    padding: zspace.s2,
  } satisfies TextBoxOptions,
  "Card>Card.Image": {
    width: pct(100),
  } satisfies ImageBoxOptions,
};
