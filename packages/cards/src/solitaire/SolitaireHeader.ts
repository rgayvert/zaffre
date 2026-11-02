import { addClass, HStack, Spacer, TextButton, TextLabel } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";
import { SolitaireHeaderOptions, solitaireHeaderRules } from "./SolitaireHeader.rules";

export const SolitaireHeader = (model: SolitaireModel, inOptions: SolitaireHeaderOptions = {}) => {
  const options = addClass(inOptions, "solitaire-header", solitaireHeaderRules(model));
  return HStack(options).append(
    TextLabel(model.highScoreString),
    Spacer("s4"),
    TextLabel(model.lowTimeString),
    Spacer("s6"),
    TextLabel(model.scoreString),
    Spacer("s4"),
    TextLabel(model.elapsedTime),
    Spacer("s5"),
    TextButton("New Game", { cls: "solitaire-header-button" })
  );
};
