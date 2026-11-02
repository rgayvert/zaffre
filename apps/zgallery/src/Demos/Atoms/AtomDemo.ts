import { GalleryDemo, GalleryTopic } from "../Common";
import { TimerAtomExample } from "./TimerAtom/TimerAtomExample";
import { APIAtomExample } from "./APIAtom/APIAtomExample";
import { AsyncAtomExample } from "./AsyncAtom/AsyncAtomExample";
import { FetchAtomExample } from "./FetchAtom/FetchAtomExample";
import { CounterAtomExample } from "./CounterAtom/CounterAtomExample";
import { CarouselAtomExample } from "./CarouselAtom/CarouselAtomExample";

export const MiscDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Atoms",
  sections: [
    {
      title: "Fetch Atom",
      componentFn: FetchAtomExample,
      sources: [["View", "FetchAtom/FetchAtomExample.ts"]],
      markdown: "FetchAtom/FetchAtomExample.md",
    },
    {
      title: "Counter Atom",
      componentFn: CounterAtomExample,
      sources: [
        ["View", "CounterAtom/CounterAtomExample.ts"],
        ["Rules", "CounterAtom/CounterAtomExample.rules.ts"],
      ],
      markdown: "CounterAtom/CounterAtomExample.md",
    },
    {
      title: "Carousel Atom",
      componentFn: CarouselAtomExample,
      sources: [
        ["View", "CarouselAtom/CarouselAtomExample.ts"],
        ["Rules", "CarouselAtom/CarouselAtomExample.rules.ts"],
      ],
      markdown: "CarouselAtom/CarouselAtomExample.md",
    },
    {
      title: "Timer Atom",
      componentFn: TimerAtomExample,
      sources: [
        ["View", "TimerAtom/TimerAtomExample.ts"],
        ["Model", "TimerAtom/TimerAtomModel.ts"],
        ["Rules", "TimerAtom/TimerAtomExample.rules.ts"],
      ],
      markdown: "TimerAtom/TimerAtomExample.md",
    },
    {
      title: "API Atom",
      componentFn: APIAtomExample,
      sources: [
        ["View", "APIAtom/APIAtomExample.ts"],
        ["Model", "APIAtom/WeatherModel.ts"],
      ],
      markdown: "APIAtom/APIAtomExample.md",
    },
    {
      title: "Async Atom",
      componentFn: AsyncAtomExample,
      sources: [["View", "AsyncAtom/AsyncAtomExample.ts"]],
      markdown: "AsyncAtom/AsyncAtomExample.md",
    },
  ],
};

export default MiscDemo;
