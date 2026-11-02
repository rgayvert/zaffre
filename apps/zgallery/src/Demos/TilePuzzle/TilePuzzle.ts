import { GalleryDemo, GalleryTopic } from "../Common";
import { TilePuzzleGame } from "./TilePuzzleGame";
import { tilePuzzleRules } from "./TilePuzzle.rules";

export const TilePuzzle = () => {
  return GalleryDemo(topic, { rules: tilePuzzleRules });
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/TilePuzzle",
  sections: [
    {
      title: "Tile Puzzle",
      componentFn: TilePuzzleGame,
      sources: [
        ["Model", "TilePuzzleModel.ts"],
        ["Box", "BoxTilePuzzle.ts"],
        ["Grid", "GridTilePuzzle.ts"],
        ["Game", "TilePuzzleGame.ts"],
      ],
      markdown: "TilePuzzle.md",
    },
  ],
};

export default TilePuzzle;
