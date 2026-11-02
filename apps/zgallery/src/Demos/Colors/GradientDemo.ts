import { GalleryDemo, GalleryTopic } from "../Common";
import { GradientXExample } from "./GradientX";
import { GradientYExample } from "./GradientY";
import { GradientAngleExample } from "./GradientAngle";

export const GradientDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Gradient X",
      componentFn: GradientXExample,
      sources: [["View", "GradientXExample.ts"]],
      markdown: "GradientXExample.md",
    },
    {
      title: "Gradient Y",
      componentFn: GradientYExample,
      sources: [["View", "GradientYExample.ts"]],
      markdown: "GradientYExample.md",
    },
    {
      title: "Reactive Gradient Angle",
      componentFn: GradientAngleExample,
      sources: [["View", "GradientAngleExample.ts"]],
      markdown: "GradientAngleExample.md",
    },
  ],
};

export default GradientDemo;
