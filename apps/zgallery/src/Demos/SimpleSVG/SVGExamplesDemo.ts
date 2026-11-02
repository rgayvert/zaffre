import { GalleryTopic, GalleryDemo } from "../Common";
import { SVGExample1 } from "./SVGExample1";
import { SVGExample2 } from "./SVGExample2";
import { SVGExample3 } from "./SVGExample3";
import { SVGExample4 } from "./SVGExample4";
import { SVGExample5 } from "./SVGExample5";
import { SVGExample6 } from "./SVGExample6";
import { SVGExample7 } from "./SVGExample7";
import { SVGExample8 } from "./SVGExample8";

export const SVGExamplesDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/SimpleSVG",
  sections: [
    {
      title: "Diagram",
      componentFn: SVGExample8,
      sources: [["View", "SVGExample8.ts"]],
      markdown: "SVGExample8.md",
    },
    {
      title: "Basic SVG Shapes",
      componentFn: SVGExample1,
      sources: [["View", "SVGExample1.ts"]],
      markdown: "SVGExample1.md",
    },
    {
      title: "More SVG Shapes",
      componentFn: SVGExample2,
      sources: [["View", "SVGExample2.ts"]],
      markdown: "SVGExample2.md",
    },
    {
      title: "SVG Paths",
      componentFn: SVGExample3,
      sources: [["View", "SVGExample3.ts"]],
      markdown: "SVGExample3.md",
    },
    {
      title: "SVG Group",
      componentFn: SVGExample4,
      sources: [["View", "SVGExample4.ts"]],
      markdown: "SVGExample4.md",
    },
    {
      title: "SVG Gradients",
      componentFn: SVGExample5,
      sources: [["View", "SVGExample5.ts"]],
      markdown: "SVGExample5.md",
    },
    {
      title: "SVG Image",
      componentFn: SVGExample6,
      sources: [["View", "SVGExample6.ts"]],
      markdown: "SVGExample6.md",
    },
    {
      title: "SVG Avatar",
      componentFn: SVGExample7,
      sources: [["View", "SVGExample7.ts"]],
      markdown: "SVGExample7.md",
    },
  ],
};

export default SVGExamplesDemo;
