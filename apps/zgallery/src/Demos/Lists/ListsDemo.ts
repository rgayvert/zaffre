import { GalleryDemo, GalleryTopic } from "../Common";
import { ListBoxExample, VirtualListExample, TransferListExample } from ".";

export const ListDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Lists",
  sections: [
    {
      title: "List Box",
      componentFn: ListBoxExample,
      sources: [
        ["View", "ListBox/ListBoxExample.ts"],
        ["Rules", "ListBox/ListBoxExample.rules.ts"]
      ],
      markdown: "ListBox/ListBoxExample.md",
    },
    {
      title: "Virtual List",
      componentFn: VirtualListExample,
      sources: [
        ["View", "VirtualList/VirtualListExample.ts"],
        ["Model", "VirtualList/VirtualListExample.model.ts"],
        ["Rules", "VirtualList/VirtualListExample.rules.ts"],
      ],
      markdown: "VirtualList/VirtualListExample.md",
    },
    {
      title: "Transfer List",
      componentFn: TransferListExample,
      sources: [
        ["View", "TransferList/TransferListExample.ts"],
        ["Model", "TransferList/TransferListExample.model.ts"],
      ],
      markdown: "TransferList/TransferListExample.md",
    },
  ],
};

export default ListDemo;
