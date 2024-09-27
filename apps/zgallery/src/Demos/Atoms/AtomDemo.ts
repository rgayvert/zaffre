import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { TimerAtomExample } from "./TimerAtomExample";
import { APIAtomExample } from "./APIAtomExample";
import { AsyncAtomExample } from "./AsyncAtomExample";
import { FetchAtomExample } from "./FetchAtomExample";
import { CounterAtomExample } from "./CounterAtomExample";
import { CarouselAtomExample } from "./CarouselAtomExample";

export function MiscDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Atoms",
  sections: [
    {
      title: "Fetch Atom",
      componentFn: FetchAtomExample, 
      sources: ["FetchAtomExample.ts"],
      markdown: "FetchAtomExample.md",
    },
    {
      title: "Counter Atom",
      componentFn: CounterAtomExample,
      sources: ["CounterAtomExample.ts"],
      markdown: "CounterAtomExample.md",
    },
    {
      title: "Carousel Atom",
      componentFn: CarouselAtomExample,
      sources: ["CarouselAtomExample.ts"],
      markdown: "CarouselAtomExample.md",
    },
    {
      title: "Timer Atom",
      componentFn: TimerAtomExample,
      sources: ["TimerAtomModel.ts", "TimerAtomExample.ts"],
      markdown: "TimerAtomExample.md",
    },
    {
      title: "API Atom",
      componentFn: APIAtomExample,
      sources: ["APIAtomExample.ts"],
      markdown: "APIAtomExample.md",
    },
    {
      title: "Async Atom",
      componentFn: AsyncAtomExample,
      sources: ["AsyncAtomExample.ts"],
      markdown: "AsyncAtomExample.md",
    },


  ],
};


export default MiscDemo;
