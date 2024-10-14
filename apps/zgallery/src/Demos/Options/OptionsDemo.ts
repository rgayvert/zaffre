import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { BasicOptionsExample } from "./BasicOptionsExample";
import { OptionBundlesExample } from "./OptionBundlesExample";
import { InheritanceExample } from "./InheritanceExample";
import { ReactiveOptionsExample } from "./ReactiveOptionsExample";
import { OptionChainingExample } from "./OptionChainingExample";

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
      sources: ["OptionBundlesExample.ts"],
      markdown: "OptionBundlesExample.md",
    },
    {
      title: "Option Chaining",
      componentFn: OptionChainingExample, 
      sources: ["OptionChainingExample.ts"],
      markdown: "OptionChainingExample.md",
    },
    
  ],
};

export default OptionsDemo; 
 