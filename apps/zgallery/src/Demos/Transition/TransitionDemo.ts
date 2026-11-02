import { GalleryDemo, GalleryTopic } from "../Common";
import { TransitionExample1, TransitionExample2, HoverTransitionsExample } from ".";

export const TransitionDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Transition",
  sections: [
    {
      title: "Simple Transitions",
      componentFn: TransitionExample1,
      sources: [
        ["View", "Transition1/TransitionExample1.ts"],
        ["Model", "Transition1/TransitionModel1.ts"],
        ["Rules", "Transition1/TransitionExample1.rules.ts"],
      ],
      markdown: "Transition1/TransitionExample1.md",
    },
    {
      title: "TextLabel Transitions",
      componentFn: TransitionExample2,
      sources: [
        ["View", "Transition2/TransitionExample2.ts"],
        ["Model", "Transition2/TransitionModel2.ts"],
        ["Rules", "Transition2/TransitionExample2.rules.ts"],
      ], 
      markdown: "Transition2/TransitionExample2.md",
    },
    {
      title: "Hover Transitions",
      componentFn: HoverTransitionsExample,
      sources: [
        ["View", "HoverTransition/HoverTransitionsExample.ts"],
        ["Model", "HoverTransition/HoverTransitionsModel.ts"],
        ["Rules", "HoverTransition/HoverTransitionsExample.rules.ts"],
      ],
      markdown: "HoverTransition/HoverTransitionsExample.md",
    },
  ],
};

export default TransitionDemo;
 