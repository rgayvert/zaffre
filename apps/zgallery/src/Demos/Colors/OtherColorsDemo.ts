import { GalleryDemo, GalleryTopic } from "../Common";
import { OtherColorsExample } from "./OtherColors";

export const OtherColorsDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Other Colors",
      componentFn: OtherColorsExample,
      sources: [
        ["View", "OtherColorsExample.ts"],
        ["Grid", "ThemeColorsGrid.ts"],
        ["Rules", "OtherColorsExample.rules.ts"],
      ],
      markdown: "OtherColorsExample.md",
    },
  ],
};

export default OtherColorsDemo;
