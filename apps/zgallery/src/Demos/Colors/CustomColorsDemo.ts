import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { CustomColorsExample } from "./CustomColorsExample";

export function CustomColorsDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Custom Colors",
      componentFn: CustomColorsExample,
      sources: ["ColorSpaceGrid.ts", "ColorSelector.ts", "CustomColorsExample.ts"],
      markdown: "CustomColorsExample.md",
    },
  ],
};


export default CustomColorsDemo;
