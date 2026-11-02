import { SoftGrid, Card, ElevatedBox, FormField, addClass, imageBoxSpec, textBoxSpec } from "zaffre";
import { rules } from "./CardGrid.rules";
import { CardData, CardGridModel } from "./CardGridModel";

const cardFields = (r: CardData): FormField[] => {
  return [
    imageBoxSpec("image", r.imageSrc).cls("Card.Image").build().setGridArea(1, 1, 6, 11),
    textBoxSpec("title", r.title).cls("Card.Title").build().setGridArea(6, 1, 7, 11),
    textBoxSpec("subtitle", r.subtitle).cls("Card.Subtitle").build().setGridArea(7, 1, 8, 11),
    textBoxSpec("body", r.body).cls("Card.Body").build().setGridArea(8, 1, 11, 11),
  ]
}

export const CardGrid = () => {
  const model = new CardGridModel();
  const options = addClass({}, "CardGrid", rules);

  return SoftGrid(options).append(
    ...model.cardData.map((data) => ElevatedBox().append(Card(cardFields(data))))
  );
};
