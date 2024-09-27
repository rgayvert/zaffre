import { Box, Grid, SimpleViewList, pct } from "zaffre";
import { View, ZStack, atom, core, zget } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";
import { BaseCard, Pile } from "./CardsAndPiles";
import { PlayingCard } from "./PlayingCard";

/**
 *  Grid with 2 rows and 7 columns containing ZStacks of PlayingCards. Each PlayingCard corresponds
 *  to one Card in the deck, and each ZStack corresponds to one of the Piles in the model. 
 */

export function SolitaireGrid(model: SolitaireModel): View {
  const allPlayingCards = new Map(
    [...BaseCard.allBaseCards, ...model.deck].map((card) => [
      card.cardID,
      PlayingCard(card, () => model.cardClicked(card)),
    ])
  );  

  function PileStack(pile: Pile, name: string, offset = "0"): View {
    const items = atom(() => zget(pile.cards).map((card) => allPlayingCards.get(card.cardID)!));
    return ZStack({
      name: name,
      offsetY: offset,
      hasBaseView: true, 
      padding: core.space.s0,
      font: core.font.display_medium,
    }).append(SimpleViewList(items));
  }

  return Grid({
    gap: core.space.s2,
    templateRows: "1fr 4fr",
    ncolumns: 7,
    width: pct(100),
    aspectRatio: 6 / 5,
  }).append(
    PileStack(model.stockPile, "stock"),
    PileStack(model.talonPile, "talon"),
    Box({ name: "filler" }),
    ...model.foundationPiles.map((pile, index) => PileStack(pile, `foundation_${index}`)),
    ...model.tableauPiles.map((pile, index) => PileStack(pile, `tableau_${index}`, "5%"))
  );
}
