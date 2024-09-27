import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { BasicTreeExample } from "./BasicTreeExample";
import { BulletListExample } from "./BulletListExample";

export function ListDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Trees",
  sections: [
    {
      title: "Basic Tree",
      componentFn: BasicTreeExample,
      sources: ["BasicTreeExample.ts"],
      markdown: "BasicTreeExample.md",
    },
    {
      title: "Bullet List",
      componentFn: BulletListExample,
      sources: ["BulletListExample.ts"],
      markdown: "BulletListExample.md",
    },
  ],
};

export default ListDemo;

