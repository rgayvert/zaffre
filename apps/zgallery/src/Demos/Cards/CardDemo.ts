import { GalleryDemo, GalleryTopic } from "../Common";
import { CardGrid } from "./CardGrid/CardGrid";

export const CardDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Cards",
  sections: [
    {
      title: "Card Grid",
      componentFn: CardGrid,
      sources: [
        ["View", "CardGrid/CardGrid.ts"],
        ["Model", "CardGrid/CardGridModel.ts"],
        ["Rules", "CardGrid/CardGrid.rules.ts"],
      ],
      markdown: "CardGrid/CardGrid.md",
    },
  ],
};

export default CardDemo;
