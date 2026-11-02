import { GalleryDemo, GalleryTopic } from "../Common";
import { SevenCounter } from "./SevenCounter";
import { SevenTempConverter } from "./SevenTempConverter";
import { SevenFlightBooker } from "./SevenFlightBooker";
import { SevenTimer } from "./SevenTimer";
import { SevenCRUD } from "./SevenCRUD";
import { SevenCircleDraw } from "./SevenCircleDraw";
import { SevenCells } from "./SevenCells";

export const SevenGUIsDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/SevenGUIs",
  sections: [
    {
      title: "1. Counter",
      componentFn: SevenCounter,
      sources: [["View", "SevenCounter.ts"]],
      markdown: "SevenCounter.md",
    },
    {
      title: "2. Temperature Converter",
      componentFn: SevenTempConverter,
      sources: [
        ["Model", "SevenTempConverterModel.ts"],
        ["View", "SevenTempConverter.ts"],
      ],
      markdown: "SevenTempConverter.md",
    },
    {
      title: "3. Flight Booker",
      componentFn: SevenFlightBooker,
      sources: [
        ["Model", "SevenFlightBookerModel.ts"],
        ["View", "SevenFlightBooker.ts"],
      ],
      markdown: "SevenFlightBooker.md",
    },
    {
      title: "4. Timer",
      componentFn: SevenTimer,
      sources: [
        ["Model", "SevenTimerModel.ts"],
        ["View", "SevenTimer.ts"],
      ],
      markdown: "SevenTimer.md",
    },
    {
      title: "5. CRUD",
      componentFn: SevenCRUD,
      sources: [
        ["Model", "SevenCRUDModel.ts"],
        ["View", "SevenCRUD.ts"],
      ],
      markdown: "SevenCRUD.md",
    },
    {
      title: "6. Circle Draw",
      componentFn: SevenCircleDraw,
      sources: [
        ["Model", "SevenCircleDrawModel.ts"],
        ["View", "SevenCircleDraw.ts"],
      ],
      markdown: "SevenCircleDraw.md",
    },
    {
      title: "7. Cells",
      componentFn: SevenCells,
      sources: [["View", "SevenCells.ts"]],
      markdown: "SevenCells.md",
    },
  ],
};

export default SevenGUIsDemo;
