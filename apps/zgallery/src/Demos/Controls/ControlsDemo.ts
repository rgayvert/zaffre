import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { SimpleButtonExample } from "./SimpleButtonExample";
import {  ButtonsWithIconsExample } from "./ButtonsWithIconsExample";
import { CheckboxExample } from "./CheckboxExample";
import { RadioButtonExample } from "./RadioButtonExample";
import { SegmentedButtonExample } from "./SegmentedButtonExample";
import { SwitchExample } from "./SwitchExample";
import { SliderExample } from "./SliderExample";
import { GaugeExample } from "./GaugeExample";
import { DotsExample } from "./DotsExample";

export function ControlsDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Controls",
  sections: [
    {
      title: "Simple Buttons",
      componentFn: SimpleButtonExample,
      sources: ["SimpleButtonExample.ts"],
      markdown: "SimpleButtonExample.md",
    },
    {
      title: "Buttons with Icons",
      componentFn: ButtonsWithIconsExample,
      sources: ["ButtonsWithIconsExample.ts"],
      markdown: "ButtonsWithIconsExample.md",
    },
    {
      title: "Checkbox Buttons",
      componentFn: CheckboxExample,
      sources: ["CheckboxExample.ts"],
      markdown: "CheckboxExample.md",
    },
    {
      title: "Radio Buttons",
      componentFn: RadioButtonExample,
      sources: ["RadioButtonExample.ts"],
      markdown: "RadioButtonExample.md",
    },
    {
      title: "Segmented Button",
      componentFn: SegmentedButtonExample,
      sources: ["SegmentedButtonExample.ts"],
      markdown: "SegmentedButtonExample.md",
    },
    {
      title: "Dots",
      componentFn: DotsExample,
      sources: ["DotsExample.ts"],
      markdown: "DotsExample.md",
    },
    {
      title: "Gauge",
      componentFn: GaugeExample,
      sources: ["GaugeExample.ts"],
      markdown: "GaugeExample.md",
    },
    {
      title: "Switch",
      componentFn: SwitchExample,
      sources: ["SwitchExample.ts"],
      markdown: "SwitchExample.md",
    },
    {
      title: "Slider",
      componentFn: SliderExample,
      sources: ["SliderExample.ts"],
      markdown: "SliderExample.md",
    },

  ],
};

export default ControlsDemo;
