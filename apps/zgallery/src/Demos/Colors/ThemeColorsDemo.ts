import { GalleryDemo, GalleryTopic } from "../Common";
import { ThemeColorsExample } from "./ThemeColors";

export const ColorDemo = () => {
  return GalleryDemo(topic);
}; 

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Theme Colors",
      componentFn: ThemeColorsExample,
      sources: [
        ["Selector", "ThemeSelector.ts"],
        ["Grid", "ThemeColorsGrid.ts"],
        ["View", "ThemeColorsExample.ts"],
        ["Model", "ThemeColorsModel.ts"],
      ],
      markdown: "ThemeColorsExample.md",
    },
  ],
};

export default ColorDemo;
