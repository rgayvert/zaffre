import { GalleryDemo, GalleryTopic } from "../Common";
import { SolitaireGame } from ":cards";

export const SolitaireDemo = () => {
  return GalleryDemo(topic);
};


const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Solitaire",
  sections: [
    {
      title: "Solitaire",
      componentFn: SolitaireGame,
      sources: [
        ["Model", "SolitaireModel.ts"],
        ["Game", "SolitaireGame.ts"],
        ["Header", "SolitaireHeader.ts"],
        ["Grid", "SolitaireGrid.ts"],
        ["PlayingCard", "PlayingCard.ts"],
      ],
      markdown: "SolitaireGame.md",
    },
  ],
};

export default SolitaireDemo;
