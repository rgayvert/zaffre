import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { ContrastingColorsExample } from "./ContrastingColorsExample";

export function ContrastingColorsDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Contrasting Colors",
      componentFn: ContrastingColorsExample,
      sources: ["ContrastingColorsModel.ts", "ColorSelector.ts", "ContrastingColorsExample.ts"],
      markdown: "ContrastingColorsExample.md",
    },
  ],
};

export default ContrastingColorsDemo;
