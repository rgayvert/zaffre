import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { SnakeBoard } from "./SnakeBoard";

export function SnakeDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Snake",
  sections: [ 
    {
      title: "Snake",
      componentFn: SnakeBoard,
      sources: ["SnakeBoard.ts", "SnakeModel.ts", "Snake.ts"],
      markdown: "Snake.md",
    }
  ],
};

export default SnakeDemo;
