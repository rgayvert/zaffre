import { View } from "zaffre";
import { GalleryTopic, GalleryDemo } from "../Common";
import { PendulumWavesExample } from "./PendulumWavesExample";

export function PendulumWavesDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = { 
  sourceDir: "/source/Demos/PendulumWaves",
  sections: [
    {
      title: "Pendulum Waves",
      componentFn: PendulumWavesExample,
      sources: ["PendulumWavesExample.ts"],
      markdown: "PendulumWavesExample.md",
    },
  ],
};

export default PendulumWavesDemo;
