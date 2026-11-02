import { GalleryDemo, GalleryTopic } from "../Common";
import { PopoverExample } from "./PopoverExample";
import { DialogExample1 } from "./DialogExample1";
import { TooltipExample } from "./TooltipExample";
import { ToastExample } from "./ToastExample";

export const FloatingDemo = () => {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Floating",
  sections: [
    {
      title: "Tooltip",
      componentFn: TooltipExample,
      sources: [["View", "TooltipExample.ts"]],
      markdown: "TooltipExample.md",
    },
    {
      title: "Popovers",
      componentFn: PopoverExample,
      sources: [["View", "PopoverExample.ts"]],
      markdown: "PopoverExample.md",
    },
    {
      title: "Toast",
      componentFn: ToastExample,
      sources: [["View", "ToastExample.ts"]],
      markdown: "ToastExample.md",
    },
    {
      title: "Dialogs",
      componentFn: DialogExample1,
      sources: [["View", "DialogExample1.ts"]],
      markdown: "DialogExample1.md",
    },
  ],
};

export default FloatingDemo;

