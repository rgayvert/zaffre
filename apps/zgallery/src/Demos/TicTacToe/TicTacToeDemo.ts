import { GalleryDemo, GalleryTopic } from "../Common";
import { TicTacToe } from "./TicTacToe";

export const TicTacToeDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/TicTacToe",
  sections: [
    {
      title: "Tic Tac Toe",
      componentFn: TicTacToe,
      sources: [
        ["View", "TicTacToe.ts"],
        ["Model", "TicTacToeModel.ts"],
      ],
      markdown: "TicTacToe.md",
    },
  ],
};

export default TicTacToeDemo;
