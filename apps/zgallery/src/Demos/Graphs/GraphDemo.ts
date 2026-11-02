import { GalleryDemo, GalleryTopic } from "../Common";
import { ForceDirectedGraphExample } from "./ForceDirectedGraphExample";
import { SimpleGraphExample } from "./SimpleGraphExample";

export const GraphDemo = () => {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Graphs",
  sections: [
    {
      title: "Simple Graph",
      componentFn: SimpleGraphExample,
      sources: [["View", "SimpleGraphExample.ts"]],
      markdown: "SimpleGraphExample.md",
    },
    {
      title: "Force Directed Graph",
      componentFn: ForceDirectedGraphExample,
      sources: [["View", "ForceDirectedGraphExample.ts"]],
      markdown: "ForceDirectedGraphExample.md",
    },
  ],
};

export default GraphDemo;
