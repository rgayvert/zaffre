import { GalleryDemo, GalleryTopic } from "../Common";
import { RegExExample } from "./RegExExample";

export const RegExDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/RegEx",
  sections: [
    {
      title: "RegEx Example",
      componentFn: RegExExample,
      sources: [
        ["View", "RegExExample.ts"],
        ["Model", "RegExModel.ts"],
      ],
      markdown: "RegExExample.md",
    },
  ],
};

export default RegExDemo;
