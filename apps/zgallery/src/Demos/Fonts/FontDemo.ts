import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { StandardFontsExample } from "./StandardFontsExample";
import { CustomFontsExample } from "./CustomFontsExample";
import { FluidFontsExample } from "./FluidFontsExample";

export function FontDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Fonts",
  sections: [
    {
      title: "Standard Fonts",
      componentFn: StandardFontsExample,
      sources: ["StandardFontsExample.ts"],
      markdown: "StandardFontsExample.md",
    },
    {
      title: "Custom Fonts",
      componentFn: CustomFontsExample,
      sources: ["CustomFontsExample.ts"],
      markdown: "CustomFontsExample.md",
    },
    {
      title: "Fluid Fonts",
      componentFn: FluidFontsExample,
      sources: ["FluidFontsExample.ts"],
      markdown: "FluidFontsExample.md",
    },

  ],
};

export default FontDemo;
