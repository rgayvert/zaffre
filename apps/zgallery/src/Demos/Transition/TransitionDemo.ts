import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { TransitionExample1 } from "./TransitionExample1";
import { TransitionExample2 } from "./TransitionExample2";
import { HoverTransitionsExample } from "./HoverTransitionsExample";

export function TransitionDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Transition",
  sections: [
    {
      title: "Simple Transitions",
      componentFn: TransitionExample1,
      sources: ["TransitionExample1.ts", "TransitionModel1.ts"],
      markdown: "TransitionExample1.md",
    },
    {
      title: "Text Transitions",
      componentFn: TransitionExample2,
      sources: ["TransitionExample2.ts", "TransitionModel2.ts"],
      markdown: "TransitionExample2.md",
    },
    {
      title: "Hover Transitions",
      componentFn: HoverTransitionsExample,
      sources: ["HoverTransitionsExample.ts"],
      markdown: "HoverTransitionsExample.md",
    },

  ],
};


export default TransitionDemo;
