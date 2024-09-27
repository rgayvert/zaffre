import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { SevenCounter } from "./SevenCounter";
import { SevenTempConverter } from "./SevenTempConverter";
import { SevenFlightBooker } from "./SevenFlightBooker";
import { SevenTimer } from "./SevenTimer";
import { SevenCRUD } from "./SevenCRUD";
import { SevenCircleDraw } from "./SevenCircleDraw";
import { SevenCells } from "./SevenCells";

export function SevenGUIsDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/SevenGUIs",
  sections: [
    {
      title: "1. Counter",
      componentFn: SevenCounter,
      sources: ["SevenCounter.ts"],
      markdown: "SevenCounter.md",
    },
    {
      title: "2. Temperature Converter",
      componentFn: SevenTempConverter,
      sources: ["SevenTempConverterModel.ts", "SevenTempConverter.ts"],
      markdown: "SevenTempConverter.md",
    },
    {
      title: "3. Flight Booker",
      componentFn: SevenFlightBooker,
      sources: ["SevenFlightBookerModel.ts", "SevenFlightBooker.ts"],
      markdown: "SevenFlightBooker.md",
    },
    {
      title: "4. Timer",
      componentFn: SevenTimer,
      sources: ["SevenTimerModel.ts", "SevenTimer.ts"],
      markdown: "SevenTimer.md",
    },
    {
      title: "5. CRUD",
      componentFn: SevenCRUD,
      sources: ["SevenCRUDModel.ts", "SevenCRUD.ts"],
      markdown: "SevenCRUD.md",
    },
    {
      title: "6. Circle Draw",
      componentFn: SevenCircleDraw,
      sources: ["SevenCircleDrawModel.ts", "SevenCircleDraw.ts"],
      markdown: "SevenCircleDraw.md",
    },
    {
      title: "7. Cells",
      componentFn: SevenCells,
      sources: ["SevenCells.ts"],
      markdown: "SevenCells.md",
    },
  ],
};

export default SevenGUIsDemo;
