import { GalleryDemo, GalleryTopic } from "../Common";
import { Pong } from "./Pong";

export const PongDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Pong",
  sections: [
    {
      title: "Pong",
      componentFn: Pong,
      sources: [
        ["Items", "PongItems.ts"],
        ["Model", "PongModel.ts"],
        ["View", "Pong.ts"],
      ],
      markdown: "Pong.md",
    },
  ],
};

export default PongDemo;
