import { core, pct, TextLabel, useHashRouting, View, VStack } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { EnsembleRoutingExample } from "./EnsembleRoutingExample";
import { LinkExample } from "./LinkExample";

export function RoutingDemo(): View {
  if (useHashRouting()) {
    return VStack({ width: pct(100) }).append(
      TextLabel("Note: this application is configured to use hash routing", {
        font: core.font.body_small,
        paddingBlock: core.space.s5,
      }),
      GalleryDemo(topic)
    );
  } else {
    return GalleryDemo(topic); 
  }
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Routing",
  sections: [
    {
      title: "Ensemble Routing",
      componentFn: EnsembleRoutingExample,
      sources: ["EnsembleRoutingExample.ts"],
      markdown: "EnsembleRoutingExample.md",
    },
    {
      title: "Links",
      componentFn: LinkExample,
      sources: ["LinkExample.ts"],
      markdown: "LinkExample.md",
    },
  ],
};

export default RoutingDemo;
