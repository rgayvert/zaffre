import { GalleryDemo, GalleryTopic } from "../Common";
import { WorkerExample } from "./WorkerExample";

export const WorkerDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Workers",
  sections: [
    {
      title: "Worker",
      componentFn: WorkerExample,
      sources: [["View", "WorkerExample.ts"]],
      markdown: "WorkerExample.md",
    },
  ],
};

export default WorkerDemo;
