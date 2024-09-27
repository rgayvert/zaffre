import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { RegExExample } from "./RegExExample";

export function RegExDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/RegEx",
  sections: [
    {
      title: "RegEx Example",
      componentFn: RegExExample,
      sources: ["RegExExample.ts", "RegExModel.ts"],
      markdown: "RegExExample.md",
    },

  ],
};

export default RegExDemo;
