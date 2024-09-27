import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { CounterGridExample } from "./CounterGridExample";

export function CounterDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Counter",
  sections: [
    {
      title: "SVG Counters",
      componentFn: CounterGridExample,
      sources: ["CounterGridExample.ts", "Counter.ts", "CounterModel.ts"],
      markdown: "CounterGridExample.md",
    },

  ],
};

export default CounterDemo;
