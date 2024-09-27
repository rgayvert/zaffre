import { View } from "zaffre";
import { GalleryTopic, GalleryDemo } from "../Common";
import { SVGExample1 } from "./SVGExample1";
import { SVGExample2 } from "./SVGExample2";
import { SVGExample3 } from "./SVGExample3";
import { SVGExample4 } from "./SVGExample4";
import { SVGExample5 } from "./SVGExample5";
import { SVGExample6 } from "./SVGExample6";

export function SVGExamplesDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/SimpleSVG",
  sections: [
    {
      title: "Basic SVG Shapes",
      componentFn: SVGExample1,
      sources: ["SVGExample1.ts"],
      markdown: "SVGExample1.md",
    },
    {
      title: "More SVG Shapes",
      componentFn: SVGExample2,
      sources: ["SVGExample2.ts"],
      markdown: "SVGExample2.md",
    },
    {
      title: "SVG Paths",
      componentFn: SVGExample3,
      sources: ["SVGExample3.ts"],
      markdown: "SVGExample3.md",
    },
    {
      title: "SVG Group",
      componentFn: SVGExample4,
      sources: ["SVGExample4.ts"],
      markdown: "SVGExample4.md",
    },
    {
      title: "SVG Gradients",
      componentFn: SVGExample5,
      sources: ["SVGExample5.ts"],
      markdown: "SVGExample5.md",
    },
    {
      title: "SVG Image",
      componentFn: SVGExample6,
      sources: ["SVGExample6.ts"],
      markdown: "SVGExample6.md",
    },
  ],
};

export default SVGExamplesDemo;
