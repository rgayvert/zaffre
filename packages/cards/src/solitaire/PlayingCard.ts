import { Box, DragHandler, Events, ImageBox, ImageBoxOptions, BasicAction, View, atom, inDarkMode } from "zaffre";
import { css_brightness, pct, simpleEffect, transitions } from "zaffre";
import { Card, BaseCard } from "./CardsAndPiles";

export function PlayingCard(card: Card, clickAction: BasicAction): View {
  function borderForDragData(card: Card): string {
    const data = DragHandler.dragData;
    return data instanceof Card ? (card.willAcceptCard(data) ? "2px solid green" : "") : "";
  }
  function eventsForBaseCard(): Events {
    return { click: clickAction }; 
  }
  function eventsForOtherCard(card: Card): Events {
    return {
      click: clickAction,
      drag: {
        dragData: card,
        mayDrag: atom(() => card.isFaceUp() && (card.isOnTalonPile() || card.isOnTableauPile())),
      },
      drop: {
        acceptsDrop: atom(() => card.willAcceptDrop()),
        acceptsData: (data) => data instanceof Card && card.willAcceptCard(data),
        dataTransferEffect: "move",
        dropAction: (data: unknown) => card.pile?.acceptCard(<Card>data),
      },
    };
  }
  function eventsForCard(card: Card): Events {
    return card instanceof BaseCard ? eventsForBaseCard() : eventsForOtherCard(card);
  }
  const options: ImageBoxOptions = {
    id: card.cardID.toString(),
    name: card.fullName,
    model: card,
    height: "fit-content",
    position: "relative",
    filter: atom(() => (inDarkMode() ? css_brightness(0.7) : undefined)),
    retainOnRemove: true,
    componentName: "Card",
    events: eventsForCard(card),
    effects: {
      mounted: transitions.slideFromPreviousLocation("in"),
      dragged: simpleEffect({ filter: "brightness(0.75)" }),
      draggedOver: simpleEffect({ border: atom(() => borderForDragData(card)) }),
    },
  };
  return Box(options).append(ImageBox(card.imageName, { width: pct(100) }));
}
