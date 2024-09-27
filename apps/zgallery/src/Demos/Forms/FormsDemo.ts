import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { BasicFormExample } from "./BasicFormExample";

export function FormsDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Forms",
  sections: [
    {
      title: "Basic Form",
      componentFn: BasicFormExample,
      sources: ["BasicFormExample.ts", "DemoUserRecord.ts", "DemoUserFields.ts"],
      markdown: "BasicFormExample.md",
    },

  ],
};

export default FormsDemo;
