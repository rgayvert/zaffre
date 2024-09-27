import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { VStackExample } from "./VStackExample";
import { HStackExample } from "./HStackExample";
import { SidebarExample } from "./SidebarExample";
import { ToolbarExample } from "./ToolbarExample";
import { LabelBoxExample } from "./LabelBoxExample";
import { CarouselExample } from "./CarouselExample";
import { EnsembleExample } from "./EnsembleExample";

export function LayoutsDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Layouts",
  sections: [
    {
      title: "VStack",
      componentFn: VStackExample,
      sources: ["VStackExample.ts"],
      markdown: "VStackExample.md",
    },
    {
      title: "HStack",
      componentFn: HStackExample,
      sources: ["HStackExample.ts"],
      markdown: "HStackExample.md",
    },
    {
      title: "Ensemble",
      componentFn: EnsembleExample,
      sources: ["EnsembleExample.ts"],
      markdown: "EnsembleExample.md",
    },
    {
      title: "Carousel",
      componentFn: CarouselExample,
      sources: ["CarouselExample.ts"],
      markdown: "CarouselExample.md",
    },
    {
      title: "LabelBox",
      componentFn: LabelBoxExample,
      sources: ["LabelBoxExample.ts"],
      markdown: "LabelBoxExample.md",
    },
    {
      title: "Sidebar",
      componentFn: SidebarExample,
      sources: ["SidebarExample.ts"],
      markdown: "SidebarExample.md",
    },
    {
      title: "Toolbar",
      componentFn: ToolbarExample,
      sources: ["ToolbarExample.ts"],
      markdown: "ToolbarExample.md",
    },

  ]
};

export default LayoutsDemo;
