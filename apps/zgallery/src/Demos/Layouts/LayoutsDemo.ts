import { GalleryDemo, GalleryTopic } from "../Common";
import { VStackExample, HStackExample } from ".";
import { SidebarExample, ToolbarExample } from ".";
import { LabelBoxExample, CarouselExample, EnsembleExample } from ".";
import { StackExample, LoaderExample } from ".";
import { ContainerExample } from "./Container";
import { FixedSizeContainerExample } from "./FixedSizeContainer/FixedSizeContainerExample";

export const LayoutsDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Layouts",
  sections: [
    {
      title: "VStack",
      componentFn: VStackExample,
      sources: [
        ["View", "VStack/VStackExample.ts"],
        ["Rules", "VStack/VStackExample.rules.ts"],
      ],
      markdown: "VStack/VStackExample.md",
    },
    {
      title: "HStack",
      componentFn: HStackExample,
      sources: [
        ["View", "HStack/HStackExample.ts"],
        ["Rules", "HStack/HStackExample.rules.ts"],
      ],
      markdown: "HStack/HStackExample.md",
    },
    {
      title: "Stack",
      componentFn: StackExample,
      sources: [
        ["View", "Stack/StackExample.ts"],
        ["Rules", "Stack/StackExample.rules.ts"],
      ],
      markdown: "Stack/StackExample.md",
    },
    {
      title: "FixedSizeContainer",
      componentFn: FixedSizeContainerExample,
      sources: [["FixedSizeContainerExample.ts"]],
      markdown: "FixedSizeContainerExample.md",
    },
    {
      title: "Ensemble",
      componentFn: EnsembleExample,
      sources: [
        ["View", "Ensemble/EnsembleExample.ts"],
        ["Rules", "Ensemble/EnsembleExample.rules.ts"],
      ],
      markdown: "Ensemble/EnsembleExample.md",
    },
    {
      title: "Carousel",
      componentFn: CarouselExample,
      sources: [
        ["View", "Carousel/CarouselExample.ts"],
        ["Rules", "Carousel/CarouselExample.rules.ts"],
      ],
      markdown: "Carousel/CarouselExample.md",
    },
    {
      title: "LabelBox",
      componentFn: LabelBoxExample,
      sources: [
        ["View", "LabelBox/LabelBoxExample.ts"],
        ["Rules", "LabelBox/LabelBoxExample.rules.ts"],
      ],
      markdown: "LabelBox/LabelBoxExample.md",
    },
    {
      title: "Container",
      componentFn: ContainerExample,
      sources: [
        ["View", "Container/ContainerExample.ts"],
        ["Rules", "Container/ContainerExample.rules.ts"],
      ],
      markdown: "Container/ContainerExample.md",
    },
        {
      title: "Sidebar",
      componentFn: SidebarExample,
      sources: [
        ["View", "Sidebar/SidebarExample.ts"],
        ["Rules", "Sidebar/SidebarExample.rules.ts"],
      ],
      markdown: "Sidebar/SidebarExample.md",
    },
    {
      title: "Toolbar",
      componentFn: ToolbarExample,
      sources: [
        ["View", "Toolbar/ToolbarExample.ts"],
        ["Rules", "Toolbar/ToolbarExample.rules.ts"],
      ],
      markdown: "Toolbar/ToolbarExample.md",
    },
    {
      title: "Loader",
      componentFn: LoaderExample,
      sources: [
        ["View", "LoaderExample/LoaderExample.ts"],
        ["Rules", "LoaderExample/LoaderExample.rules"],
      ],
      markdown: "LoaderExample.md",
    },
  ],
};

export default LayoutsDemo;
