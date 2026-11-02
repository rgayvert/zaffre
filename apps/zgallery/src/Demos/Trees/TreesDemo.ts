import { GalleryDemo, GalleryTopic } from "../Common";
import { BasicTreeExample } from "./BasicTreeExample/BasicTreeExample";
import { BulletListExample } from "./BulletListExample/BulletListExample";

export const ListDemo = () => {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Trees",
  sections: [
    {
      title: "Basic Tree",
      componentFn: BasicTreeExample,
      sources: [
        ["View", "BasicTreeExample/BasicTreeExample.ts"],
        ["Rules", "BasicTreeExample/BasicTreeExample.rules.ts"]
      ],
      markdown: "BasicTreeExample/BasicTreeExample.md",
    },
    {
      title: "Bullet List",
      componentFn: BulletListExample,
      sources: [
        ["View", "BulletListExample/BulletListExample.ts"],
        ["Rules", "BulletListExample/BulletListExample.rules.ts"]
      ],
      markdown: "BulletListExample/BulletListExample.md",
    },
  ],
};

export default ListDemo;

