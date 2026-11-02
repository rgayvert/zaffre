import { GalleryDemo, GalleryTopic } from "../Common";
import { ContrastingColorsExample } from "./ContrastingColors";

export const ContrastingColorsDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Contrasting Colors",
      componentFn: ContrastingColorsExample,
      sources: [
        ["Model", "ContrastingColors/ContrastingColorsModel.ts"],
        ["View", "ContrastingColors/ContrastingColorsExample.ts"],
        ["Rules", "ContrastingColors/ContrastingColorsExample.rules.ts"],
        ["Selector", "Common/ColorSelector/ColorSelector.ts"],
      ],
      markdown: "ContrastingColors/ContrastingColorsExample.md",
    },
  ],
};

export default ContrastingColorsDemo;
