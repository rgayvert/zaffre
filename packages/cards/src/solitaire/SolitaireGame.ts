import { CenterBox, addClass } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";
import { SolitaireHeader } from "./SolitaireHeader";
import { SolitaireGrid } from "./SolitaireGrid";
import { SolitaireGameOptions, solitaireGameRules } from "./SolitaireGame.rules";

export const SolitaireGame = (inOptions: SolitaireGameOptions = {}) => {
  const model = new SolitaireModel();
  const options = addClass(inOptions, "solitaire-game", solitaireGameRules(model));
  model.deal();

  return CenterBox(options).append(SolitaireHeader(model), SolitaireGrid(model));
};
