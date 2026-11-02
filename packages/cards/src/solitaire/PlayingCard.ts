import { Box, ImageBox, BasicAction, addClass } from "zaffre";
import { Card } from "./CardsAndPiles";
import { playingCardRules } from "./PlayingCard.rules";

export const PlayingCard = (card: Card, clickAction: BasicAction) => {
  const options = addClass({}, "playing-card", playingCardRules(card, clickAction));

  return Box(options).append(ImageBox(card.imageName, { cls: "card-image" }));
};
