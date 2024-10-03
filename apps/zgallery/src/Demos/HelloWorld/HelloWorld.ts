import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { HelloWorld0 } from "./HelloWorld0";
import { HelloWorld1 } from "./HelloWorld1";
import { HelloWorld2 } from "./HelloWorld2";
import { HelloWorld3 } from "./HelloWorld3";
import { HelloWorld4 } from "./HelloWorld4";
import { HelloWorld1a } from "./HelloWorld1a";
import { HelloWorld4a } from "./HelloWorld4a";

export function HelloWorld(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/HelloWorld",
  sections: [
    {
      title: "Hello World 0",
      componentFn: HelloWorld0,
      sources: ["HelloWorld0.ts"],
      markdown: "HelloWorld0.md"
    },
    {
      title: "Hello World 1",
      componentFn: HelloWorld1,
      sources: ["HelloWorld1.ts"],
      markdown: "HelloWorld1.md",
    },
    {
      title: "Hello World 1a",
      componentFn: HelloWorld1a,
      sources: ["HelloWorld1a.ts", "HelloWorldBundles.ts"],
      markdown: "HelloWorld1a.md",
    },
    {
      title: "Hello World 2", 
      componentFn: HelloWorld2,
      sources: ["HelloWorld2.ts", "HelloModel2.ts"],
      markdown: "HelloWorld2.md",
    },
    {
      title: "Hello World 3",
      componentFn: HelloWorld3,
      sources: ["HelloWorld3.ts", "HelloModel3.ts"],
      markdown: "HelloWorld3.md",
    },
    {
      title: "Hello World 4",
      componentFn: HelloWorld4,
      sources: ["HelloModel4.ts", "HelloWorld4.ts"],
      markdown: "HelloWorld4.md",
    },
    {
      title: "Hello World 4a",
      componentFn: HelloWorld4a,
      sources: ["HelloModel4a.ts", "HelloWorld4a.ts", "HelloWorldBundles.ts"],
      markdown: "HelloWorld4a.md",
    },

  ],
};

export default HelloWorld;
