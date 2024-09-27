import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { TilePuzzleGame } from "./TilePuzzleGame";

export function TilePuzzle(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/TilePuzzle",
  sections: [
    {
      title: "Tile Puzzle",
      componentFn: TilePuzzleGame,
      sources: ["TilePuzzleModel.ts", "BoxTilePuzzle.ts", "GridTilePuzzle.ts", "TilePuzzleGame.ts"],
      markdown: "TilePuzzle.md",
    },
  ],
};

export default TilePuzzle;
