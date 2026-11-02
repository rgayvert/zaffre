import { OptionRules } from ":view";
import { zfont, zspace } from ":theme";
import { pct } from ":attributes";

export const solitaireGridRules: OptionRules = {
    "solitaire-grid": {
      gap: zspace.s2,
      templateRows: "1fr 4fr",
      ncolumns: 7,
      width: pct(100),
      aspectRatio: 6 / 5,
    },
};

export const pileRules = (name: string, offset = "0"): OptionRules => {
  return {
    "pile": {
      name: name,
      offsetY: offset,
      hasBaseView: true,
      padding: zspace.s0,
      font: zfont.display_medium,
    },
  };
};
