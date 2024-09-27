import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { ResponsiveGridLayoutExample } from "./ResponsiveGridLayoutExample";
import { SimpleGridExample } from "./SimpleGridExample";
import { MondrianGridExample } from "./MondrianGridExample";

export function GridLayoutDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Grid",
  sections: [
    {
      title: "Simple Grid",
      componentFn: SimpleGridExample,
      sources: ["SimpleGridExample.ts"],
      markdown: "SimpleGridExample.md",
    },
    {
      title: "Responsive Grid Layout",
      componentFn: ResponsiveGridLayoutExample,
      sources: ["ResponsiveGridLayoutExample.ts"],
      markdown: "ResponsiveGridLayoutExample.md",
    },
    {
      title: "Mondrian Grid",
      componentFn: MondrianGridExample,
      sources: ["MondrianGridExample.ts"],
      markdown: "MondrianGridExample.md",
    },
  ],
};

export default GridLayoutDemo;
