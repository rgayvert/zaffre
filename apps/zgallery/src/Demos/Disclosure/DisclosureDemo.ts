import { GalleryDemo, GalleryTopic } from "../Common";
import { DisclosureExample } from "./DisclosureExample";
import { DisclosureListExample } from "./DisclosureListExample";
import { AccordionExample } from "./AccordionExample";

export const LayoutsDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Disclosure",
  sections: [
    {
      title: "Disclosure",
      componentFn: DisclosureExample,
      sources: [["View", "DisclosureExample.ts"]],
      markdown: "DisclosureExample.md",
    },
    {
      title: "Disclosure List",
      componentFn: DisclosureListExample,
      sources: [["View", "DisclosureListExample.ts"]],
      markdown: "DisclosureListExample.md",
    },
    {
      title: "Accordion",
      componentFn: AccordionExample,
      sources: [["View", "AccordionExample.ts"]],
      markdown: "AccordionExample.md",
    },
  ],
};

export default LayoutsDemo;
