import { GalleryDemo, GalleryTopic } from "../Common";
import { ResponsiveGridLayoutExample } from "./ResponsiveGridLayoutExample";
import { SimpleGridExample } from "./SimpleGridExample";
import { MondrianGridExample } from "./MondrianGridExample";
import { MonopolyBoard } from "./MonopolyBoard";

export const GridLayoutDemo = () => {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Grid",
  sections: [
    {
      title: "Simple Grid",
      componentFn: SimpleGridExample,
      sources: [["View", "SimpleGridExample.ts"]],
      markdown: "SimpleGridExample.md",
    },
    {
      title: "Responsive Grid Layout",
      componentFn: ResponsiveGridLayoutExample,
      sources: [["View", "ResponsiveGridLayoutExample.ts"]],
      markdown: "ResponsiveGridLayoutExample.md",
    },
    {
      title: "Mondrian Grid",
      componentFn: MondrianGridExample,
      sources: [["View", "MondrianGridExample.ts"]],
      markdown: "MondrianGridExample.md",
    },
      {
      title: "Monopoly Board",
      componentFn: MonopolyBoard,
      sources: [["View", "MonopolyBoard.ts"]],
      markdown: "MonopolyBoard.md",
    },
  ],
};

export default GridLayoutDemo;
