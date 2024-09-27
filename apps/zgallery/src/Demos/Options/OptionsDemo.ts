import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { BasicOptionsExample } from "./BasicOptionsExample";
import { LocalDefaultsExample } from "./LocalDefaultsExample";
import { DefaultsInheritanceExample } from "./DefaultsInheritanceExample";
import { ReactiveOptionsExample } from "./ReactiveOptionsExample";

export function OptionsDemo(): View {
  return GalleryDemo(topic);
}
 
const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Options",
  sections: [
    {
      title: "Basic Options", 
      componentFn: BasicOptionsExample,
      sources: ["BasicOptionsExample.ts"], 
      markdown: "BasicOptionsExample.md",
    },
    { 
      title: "Reactive Options",
      componentFn: ReactiveOptionsExample,
      sources: ["ReactiveOptionsExample.ts"],
      markdown: "ReactiveOptionsExample.md",
    },
    {
      title: "Defaults Inheritance",
      componentFn: DefaultsInheritanceExample,
      sources: ["DefaultsInheritanceExample.ts"],
      markdown: "DefaultsInheritanceExample.md",
    },
    {
      title: "Local Defaults",
      componentFn: LocalDefaultsExample, 
      sources: ["LocalDefaultsExample.ts"],
      markdown: "LocalDefaultsExample.md",
    },
  ],
};

export default OptionsDemo; 
 