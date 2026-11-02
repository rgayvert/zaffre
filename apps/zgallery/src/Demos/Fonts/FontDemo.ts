import { GalleryDemo, GalleryTopic } from "../Common";
import { StandardFontsExample } from "./StandardFontsExample";
import { CustomFontsExample } from "./CustomFontsExample";
import { FluidFontsExample } from "./FluidFontsExample";

export const FontDemo = () => {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Fonts",
  sections: [
    {
      title: "Standard Fonts",
      componentFn: StandardFontsExample,
      sources: [["View", "StandardFontsExample.ts"]],
      markdown: "StandardFontsExample.md",
    },
    {
      title: "Custom Fonts",
      componentFn: CustomFontsExample,
      sources: [["View", "CustomFontsExample.ts"]],
      markdown: "CustomFontsExample.md",
    },
    {
      title: "Fluid Fonts",
      componentFn: FluidFontsExample,
      sources: [["View", "FluidFontsExample.ts"]],
      markdown: "FluidFontsExample.md",
    },

  ],
};

export default FontDemo;
