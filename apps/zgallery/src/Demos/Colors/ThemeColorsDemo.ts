import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { ThemeColorsExample } from "./ThemeColorsExample";

export function ColorDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Theme Colors",
      componentFn: ThemeColorsExample,
      sources: ["ThemeSelector.ts", "ThemeColorsExample.ts", "ThemeColorsGrid.ts", "ThemeColorsModel.ts"],
      markdown: "ThemeColorsExample.md",
    },

  ],
};

export default ColorDemo;
