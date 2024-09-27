import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { CardinalPointsExample } from "./CardinalPointsExample";
import { TooltipPlacementExample } from "./TooltipPlacementExample";

export function PlacementDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Placement",
  sections: [
    {
      title: "Tooltip Placement",
      componentFn: TooltipPlacementExample,
      sources: ["TooltipPlacementExample.ts"],
      markdown: "TooltipPlacementExample.md",
    },
    {
      title: "Cardinal Points",
      componentFn: CardinalPointsExample,
      sources: ["CardinalPointsExample.ts"],
      markdown: "CardinalPointsExample.md",
    },
  ],
};

export default PlacementDemo;
