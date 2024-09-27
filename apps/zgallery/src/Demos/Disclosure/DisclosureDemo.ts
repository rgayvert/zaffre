import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { DisclosureExample } from "./DisclosureExample";
import { DisclosureListExample } from "./DisclosureListExample";
import { AccordionExample } from "./AccordionExample";

export function LayoutsDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Disclosure",
  sections: [
    {
      title: "Disclosure",
      componentFn: DisclosureExample,
      sources: ["DisclosureExample.ts"],
      markdown: "DisclosureExample.md",
    },
    {
      title: "Disclosure List",
      componentFn: DisclosureListExample,
      sources: ["DisclosureListExample.ts"],
      markdown: "DisclosureListExample.md",
    },
    {
      title: "Accordion",
      componentFn: AccordionExample,
      sources: ["AccordionExample.ts"],
      markdown: "AccordionExample.md",
    },

  ]
};

export default LayoutsDemo;
