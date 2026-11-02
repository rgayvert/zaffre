import { GalleryDemo, GalleryTopic } from "../Common";
import { CustomColorsExample } from "./CustomColors";

export const CustomColorsDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Custom Colors",
      componentFn: CustomColorsExample,
      sources: [
        ["Grid", "ColorSpaceGrid.ts"],
        ["Selector", "ColorSelector.ts"],
        ["View", "CustomColorsExample.ts"],
      ],
      markdown: "CustomColorsExample.md",
    },
  ],
};

export default CustomColorsDemo;
