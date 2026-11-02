import { GalleryDemo, GalleryTopic } from "../Common";
import { SnakeBoard } from "./SnakeBoard";

export const SnakeDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Snake",
  sections: [
    {
      title: "Snake",
      componentFn: SnakeBoard,
      sources: [
        ["Board", "SnakeBoard.ts"],
        ["Model", "SnakeModel.ts"],
        ["View", "Snake.ts"],
      ],
      markdown: "Snake.md",
    },
  ],
};

export default SnakeDemo;
