import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { HelloWorld0 } from "./HelloWorld0";
import { HelloWorld1 } from "./HelloWorld1";
import { HelloWorld2 } from "./HelloWorld2";
import { HelloWorld3 } from "./HelloWorld3";
import { HelloWorld4 } from "./HelloWorld4";
import { HelloWorld1a } from "./HelloWorld1a";
import { HelloWorld1b } from "./HelloWorld1b";

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
      sources: ["HelloWorld1a.ts"],
      markdown: "HelloWorld1a.md",
    },
    {
      title: "Hello World 1b",
      componentFn: HelloWorld1b,
      sources: ["HelloWorld1b.ts"],
      markdown: "HelloWorld1b.md",
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

  ],
};

export default HelloWorld;
