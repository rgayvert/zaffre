import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { ForceDirectedGraphExample } from "./ForceDirectedGraphExample";
import { SimpleGraphExample } from "./SimpleGraphExample";

export function GraphDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Graphs",
  sections: [
    {
      title: "Simple Graph",
      componentFn: SimpleGraphExample,
      sources: ["SimpleGraphExample.ts"],
      markdown: "SimpleGraphExample.md",
    },
    {
      title: "Force Directed Graph",
      componentFn: ForceDirectedGraphExample,
      sources: ["ForceDirectedGraphExample.ts"],
      markdown: "ForceDirectedGraphExample.md",
    },
  ],
};

export default GraphDemo;
