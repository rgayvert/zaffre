import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { OtherColorsExample } from "./OtherColorsExample";

export function OtherColorsDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Colors",
  sections: [
    {
      title: "Other Colors",
      componentFn: OtherColorsExample,
      sources: ["OtherColorsExample.ts"],
      markdown: "OtherColorsExample.md",
    },

  ],
};

export default OtherColorsDemo;
