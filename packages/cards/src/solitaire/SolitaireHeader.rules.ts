import { OptionRules, StackOptions, zfont, zspace } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";

export interface SolitaireHeaderOptions extends StackOptions {}

export const solitaireHeaderRules = (model: SolitaireModel): OptionRules => {
  return {
    "solitaire-header": {
      padding: zspace.s3,
      font: zfont.title_medium,
    },
    "solitaire-header-button": {
      padding: zspace.s0,
      font: zfont.body_large.bold(),
      action: () => model.newGame(),
    },
  };
};
