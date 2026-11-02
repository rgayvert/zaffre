import { ch, pct, BoxOptions, zborder, OptionRules, CenterBoxOptions } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";

export interface SolitaireGameOptions extends BoxOptions {}

export const solitaireGameRules = (model: SolitaireModel): OptionRules => {
  return {
    "solitaire-game": {
      width: pct(100),
      maxWidth: ch(100),
      outline: zborder.none,
      events: {
        keyBindings: {
          "Space": () => model.turnTopStockCard(),
        },
      },
      onIntersectionVisible: (view) => view.focus(true),
    } satisfies CenterBoxOptions,
  };
};
