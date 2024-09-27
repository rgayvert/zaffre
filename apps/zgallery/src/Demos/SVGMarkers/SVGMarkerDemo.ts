import { View } from "zaffre";
import { GalleryTopic, GalleryDemo } from "../Common";
import { SVGMarkerExample1 } from "./SVGMarkerExample1";
import { SVGMarkerExample2 } from "./SVGMarkerExample2";
import { SVGMarkerExample3 } from "./SVGMarkerExample3";

//
// Adapted from https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
//

export function SVGMarkerDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/SVGMarkers",
  sections: [
    {
      title: "Arrowheads",
      componentFn: SVGMarkerExample1,
      sources: ["SVGMarkerExample1.ts"],
      markdown: "SVGMarkerExample1.md",
    },
    {
        title: "Polymarkers",
        componentFn: SVGMarkerExample2,
        sources: ["SVGMarkerExample2.ts"],
        markdown: "SVGMarkerExample2.md",
      },
      {
        title: "Context fill and stroke",
        componentFn: SVGMarkerExample3,
        sources: ["SVGMarkerExample3.ts"],
        markdown: "SVGMarkerExample3.md",
      },
  ],
};

export default SVGMarkerDemo;
