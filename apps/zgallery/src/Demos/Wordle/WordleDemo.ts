import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { Wordle } from "./Wordle";

export function WordleDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Wordle",
  sections: [
    {
      title: "Wordle",
      componentFn: Wordle,
      sources: ["Wordle.ts", "WordleModel.ts", "Keyboard.ts", "WordleKeyboard.ts", "WordleGuesses.ts"],
      markdown: "Wordle.md",
    },

  ],
};

export default WordleDemo;
