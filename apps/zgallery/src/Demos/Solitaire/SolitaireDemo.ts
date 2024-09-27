import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { SolitaireGame } from ":cards";


export function SolitaireDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Solitaire",
  sections: [
    {
      title: "Solitaire",
      componentFn: SolitaireGame,
      sources: ["SolitaireModel.ts", "SolitaireGame.ts", "SolitaireHeader.ts", "SolitaireGrid.ts", "PlayingCard.ts"],
      markdown: "SolitaireGame.md",
    },

  ],
};

export default SolitaireDemo;
