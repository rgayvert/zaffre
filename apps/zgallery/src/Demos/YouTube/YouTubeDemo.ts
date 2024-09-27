import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { YouTubeExample } from "./YouTubeExample";

export function YouTubeDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/YouTube",
  sections: [
    {
      title: "YouTube",
      componentFn: YouTubeExample,
      sources: ["YouTubeExample.ts"],
      markdown: "YouTubeExample.md",
    },

  ],
};

export default YouTubeDemo;
