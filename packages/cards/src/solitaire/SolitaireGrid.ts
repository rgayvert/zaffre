import { Box, Grid, SimpleViewList, ZStack, atom, zget, addClass } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";
import { BaseCard, Pile } from "./CardsAndPiles";
import { PlayingCard } from "./PlayingCard";
import { pileRules, solitaireGridRules } from "./SolitaireGrid.rules";

/**
 *  Grid with 2 rows and 7 columns containing ZStacks of PlayingCards. Each PlayingCard corresponds
 *  to one Card in the deck, and each ZStack corresponds to one of the Piles in the model.
 */

export const SolitaireGrid = (model: SolitaireModel) => {
  const options = addClass({}, "solitaire-grid", solitaireGridRules);

  const allPlayingCards = new Map(
    [...BaseCard.allBaseCards, ...model.deck].map((card) => [
      card.cardID,
      PlayingCard(card, () => model.cardClicked(card)),
    ])
  );

  const PileStack = (pile: Pile, name: string, offset = "0") => {
    const options = addClass({}, "pile", pileRules(name, offset));
    const items = atom(() => pile.cards.get().map((card) => allPlayingCards.get(card.cardID)!));
    return ZStack(options).append(SimpleViewList(items));
  };

  return Grid(options).append(
    PileStack(model.stockPile, "stock"),
    PileStack(model.talonPile, "talon"),
    Box(),
    ...model.foundationPiles.map((pile, index) => PileStack(pile, `foundation_${index}`)),
    ...model.tableauPiles.map((pile, index) => PileStack(pile, `tableau_${index}`, "5%"))
  );
};
