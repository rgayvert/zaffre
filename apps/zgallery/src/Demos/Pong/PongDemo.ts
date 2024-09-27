import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { Pong } from "./Pong";

export function PongDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Pong",
  sections: [ 
    {
      title: "Pong",
      componentFn: Pong,
      sources: ["PongItems.ts", "PongModel.ts", "Pong.ts"],
      markdown: "Pong.md",
    }
  ],
};

export default PongDemo;
