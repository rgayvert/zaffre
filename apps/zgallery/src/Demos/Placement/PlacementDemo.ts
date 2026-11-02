import { GalleryDemo, GalleryTopic } from "../Common";
import { CardinalPointsExample } from "./CardinalPointsExample";
import { PlacedPairExample } from "./PlacedPairExample";
import { TooltipPlacementExample } from "./TooltipPlacementExample";

export const PlacementDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Placement",
  sections: [
    {
      title: "Tooltip Placement",
      componentFn: TooltipPlacementExample,
      sources: [
        ["View", "TooltipPlacementExample.ts"],
        ["Rules", "TooltipPlacementExample.rules.ts"],
      ],
      markdown: "TooltipPlacementExample.md",
    },
    {
      title: "Cardinal Points",
      componentFn: CardinalPointsExample,
      sources: [
        ["View", "CardinalPointsExample.ts"],
        ["Rules", "CardinalPointsExample.rules.ts"],
      ],
      markdown: "CardinalPointsExample.md",
    },
    {
      title: "PlacedPair",
      componentFn: PlacedPairExample,
      sources: [
        ["View", "PlacedPairExample.ts"],
        ["Rules", "PlacedPairExample.rules.ts"],
      ],
      markdown: "PlacedPairExample.md",
    },

  ],
};

export default PlacementDemo;
