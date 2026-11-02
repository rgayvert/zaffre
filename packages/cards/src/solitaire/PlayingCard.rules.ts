import { OptionRules, BasicAction, DragHandler, Events, inDarkMode } from "zaffre";
import { simpleEffect, transitions, css_brightness, pct } from "zaffre";
import { BaseCard, Card } from "./CardsAndPiles";

const borderForDragData = (card: Card): string => {
  const data = DragHandler.dragData;
  return data instanceof Card ? (card.willAcceptCard(data) ? "2px solid green" : "") : "";
};

export const playingCardRules = (card: Card, clickAction: BasicAction): OptionRules => {
  const eventsForBaseCard = (): Events => {
    return { click: clickAction };
  };
  const eventsForOtherCard = (): Events => {
    return {
      click: clickAction,
      drag: {
        dragData: card,
        mayDrag: () => card.isFaceUp() && (card.isOnTalonPile() || card.isOnTableauPile()),
      },
      drop: {
        acceptsDrop: () => card.willAcceptDrop(),
        acceptsData: (data) => data instanceof Card && card.willAcceptCard(data),
        dataTransferEffect: "move",
        dropAction: (data: unknown) => card.pile?.acceptCard(<Card>data),
      },
    };
  };
  const eventsForCard = (): Events => {
    return card instanceof BaseCard ? eventsForBaseCard() : eventsForOtherCard();
  };

  return {
    "playing-card": {
      id: card.cardID.toString(),
      name: card.fullName,
      model: card,
      height: "fit-content",
      position: "relative",
      filter: () => (inDarkMode() ? css_brightness(0.7) : undefined),
      retainOnRemove: true,
      events: eventsForCard(),
      effects: {
        mounted: transitions.slideFromPreviousLocation("in"),
        dragged: simpleEffect({ filter: "brightness(0.75)" }),
        draggedOver: simpleEffect({ border: () => borderForDragData(card) }),
      },
    },
    "card-image": {
        width: pct(100)
    }
  };
};
