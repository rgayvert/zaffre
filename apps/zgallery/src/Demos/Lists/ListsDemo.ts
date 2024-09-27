import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { ListBoxExample } from "./ListBoxExample";
import { VirtualListExample } from "./VirtualListExample";

export function ListDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Lists",
  sections: [
    {
      title: "List Box",
      componentFn: ListBoxExample,
      sources: ["ListBoxExample.ts"],
      markdown: "ListBoxExample.md",
    },
    {
      title: "Virtual List",
      componentFn: VirtualListExample,
      sources: ["VirtualListExample.ts"],
      markdown: "VirtualListExample.md",
    },

  ],
};

export default ListDemo;

