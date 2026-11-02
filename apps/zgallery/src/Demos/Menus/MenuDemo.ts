import { GalleryDemo, GalleryTopic } from "../Common";
import { AutocompleteExample } from "./AutocompleteExample";
import { DropDownExample } from "./DropDownExample";
import { MenuPlacementExample } from "./MenuPlacementExample";

export const MenuDemo = () => {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Demo",
  sections: [
    {
      title: "Drop-down button",
      componentFn: DropDownExample,
      sources: [["View", "DropDownExample.ts"]],
      markdown: "DropDownExample.md",
    },
    {
      title: "Menu Placement",
      componentFn: MenuPlacementExample,
      sources: [["View", "MenuPlacementExample.ts"]],
      markdown: "MenuPlacementExample.md",
    },
        {
      title: "Autocomplete",
      componentFn: AutocompleteExample,
      sources: [["AutocompleteExample.ts"]],
      markdown: "AutocompleteExample.md",
    },
  ],
};

export default MenuDemo;

