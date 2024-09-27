import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { TicTacToe } from "./TicTacToe";

export function TicTacToeDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/TicTacToe",
  sections: [
    {
      title: "Tic Tac Toe",
      componentFn: TicTacToe,
      sources: ["TicTacToe.ts", "TicTacToeModel.ts"],
      markdown: "TicTacToe.md",
    },

  ],
};

export default TicTacToeDemo;
