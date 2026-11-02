import { GalleryDemo, GalleryTopic } from "../Common";
import { counterDemoDefaults } from "./CounterDefaults";
import { CounterGrid } from "./CounterGrid";

export const CounterDemo = () => {
  return GalleryDemo(topic, { rules: counterDemoDefaults });
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Counter",
  sections: [
    {
      title: "SVG Counters",
      componentFn: CounterGrid,
      sources: [
        ["View", "CounterGridExample.ts"],
        ["Counter", "Counter.ts"],
        ["Model", "CounterModel.ts"],
        ["Rules", "Counter.rules.ts"],
      ],
      markdown: "CounterGridExample.md",
    },
  ],
};

export default CounterDemo;
