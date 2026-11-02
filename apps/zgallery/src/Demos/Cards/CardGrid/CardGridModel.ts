import { lorem, zutil } from "zaffre";

export interface CardData {
  title: string;
  subtitle: string;
  body: string;
  imageSrc: string;
}

export class CardGridModel {
  cardData: CardData[] = zutil.sequence(0, 13).map((_idx) => ({
    imageSrc: lorem.image(400, 300),
    title: lorem.words(2),
    subtitle: lorem.words(2),
    body: lorem.words(10, 20),
  }));
}
