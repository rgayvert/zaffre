import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { BasicOptionsExample } from "./BasicOptionsExample";
import { OptionBundlesExample } from "./OptionBundlesExample";
import { InheritanceExample } from "./InheritanceExample";
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
      title: "Options Inheritance",
      componentFn: InheritanceExample,
      sources: ["InheritanceExample.ts"],
      markdown: "InheritanceExample.md",
    },
    {
      title: "Option Bundles",
      componentFn: OptionBundlesExample, 
      sources: ["OptionBundlesExample.ts", "OptionBundles.ts"],
      markdown: "OptionBundlesExample.md",
    },
  ],
};

export default OptionsDemo; 
 