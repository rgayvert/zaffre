import { GalleryDemo, GalleryTopic } from "../Common";
import { YouTubeExample } from "./YouTubeExample";

export const YouTubeDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/YouTube",
  sections: [
    {
      title: "YouTube",
      componentFn: YouTubeExample,
      sources: [["View", "YouTubeExample.ts"]],
      markdown: "YouTubeExample.md",
    },
  ],
};

export default YouTubeDemo;
