import { GalleryDemo, GalleryTopic } from "../Common";
import { HelloWorld0, HelloWorld1, HelloWorld2, HelloWorld3, HelloWorld4 } from ".";
import { helloWorldRules } from "./HelloWorld.rules";

export const HelloWorld = () => {
  return GalleryDemo(topic, { rules: helloWorldRules });
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/HelloWorld",
  sections: [
    {
      title: "Hello World 0",
      componentFn: HelloWorld0,
      sources: [
        ["View", "HelloWorld0/HelloWorld0.ts"],
        ["Rules", "HelloWorld0/HelloWorld0.rules.ts"],
      ],
      markdown: "HelloWorld0/HelloWorld0.md",
    },
    {
      title: "Hello World 1",
      componentFn: HelloWorld1,
      sources: [
        ["View", "HelloWorld1/HelloWorld1.ts"],
        ["Rules", "HelloWorld1/HelloWorld1.rules.ts"],
        ["Inherited Rules", "HelloWorld.rules.ts"],
      ],
      markdown: "HelloWorld1/HelloWorld1.md",
    },
    {
      title: "Hello World 2",
      componentFn: HelloWorld2,
      sources: [
        ["View", "HelloWorld2/HelloWorld2.ts"],
        ["Model", "HelloWorld2/HelloModel2.ts"],
        ["Rules", "HelloWorld2/HelloWorld2.rules.ts"],
      ],
      markdown: "HelloWorld2/HelloWorld2.md",
    },
    {
      title: "Hello World 3",
      componentFn: HelloWorld3,
      sources: [
        ["View", "HelloWorld3/HelloWorld3.ts"],
        ["Model", "HelloWorld3/HelloModel3.ts"],
        ["Rules", "HelloWorld3/HelloWorld3.rules.ts"],
      ],
      markdown: "HelloWorld3/HelloWorld3.md",
    },
    {
      title: "Hello World 4",
      componentFn: HelloWorld4,
      sources: [
        ["View", "HelloWorld4/HelloWorld4.ts"],
        ["Model", "HelloWorld4/HelloModel4.ts"],
        ["Rules", "HelloWorld4/HelloWorld4.rules.ts"],
      ],
      markdown: "HelloWorld4/HelloWorld4.md",
    },
  ],
};

export default HelloWorld;
