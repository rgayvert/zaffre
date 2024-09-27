import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { GradientXExample } from "./GradientXExample";
import { GradientYExample } from "./GradientYExample";
import { GradientAngleExample } from "./GradientAngleExample";

export function GradientDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Gradient X",
      componentFn: GradientXExample,
      sources: ["GradientXExample.ts"],
      markdown: "GradientXExample.md",
    },
    {
      title: "Gradient Y",
      componentFn: GradientYExample,
      sources: ["GradientYExample.ts"],
      markdown: "GradientYExample.md",
    },
    {
      title: "Reactive Gradient Angle",
      componentFn: GradientAngleExample,
      sources: ["GradientAngleExample.ts"],
      markdown: "GradientAngleExample.md",
    },
  ],
};

export default GradientDemo;
