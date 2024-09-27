import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { CardGrid } from "./CardGrid";

export function CardDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Cards",
  sections: [
    {
      title: "Cards",
      componentFn: CardGrid,
      sources: ["CardGrid.ts"],
      markdown: "CardDemo.md",
    },
  ],
}; 


export default CardDemo;
