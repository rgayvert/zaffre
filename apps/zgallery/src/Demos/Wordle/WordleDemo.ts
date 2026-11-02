import { GalleryDemo, GalleryTopic } from "../Common";
import { Wordle } from "./Wordle";

export const WordleDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Wordle",
  sections: [
    {
      title: "Wordle",
      componentFn: Wordle,
      sources: [
        ["View", "Wordle.ts"],
        ["Model", "WordleModel.ts"],
        ["Keyboard", "Keyboard.ts"],
        ["WordleKeyboard", "WordleKeyboard.ts"],
        ["Guesses", "WordleGuesses.ts"],
      ],
      markdown: "Wordle.md",
    },
  ],
};

export default WordleDemo;
