import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { WorkerExample } from "./WorkerExample";

export function WorkerDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Workers",
  sections: [
    {
      title: "Worker",
      componentFn: WorkerExample,
      sources: ["WorkerExample.ts"],
      markdown: "WorkerExample.md",
    },
  ],
};

export default WorkerDemo;
