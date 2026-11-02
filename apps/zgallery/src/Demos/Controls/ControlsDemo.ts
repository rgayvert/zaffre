import { GalleryDemo, GalleryTopic } from "../Common";
import { ButtonsWithIconsExample, CheckboxExample, DotsExample } from ".";
import { GaugeExample, RadioGroupExample, SegmentedButtonExample } from ".";
import { SimpleButtonExample, SliderExample, SwitchExample } from ".";
import { SearchBoxExample } from ".";

export const ControlsDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Controls",
  sections: [
    {
      title: "Simple Buttons",
      componentFn: SimpleButtonExample,
      sources: [
        ["View", "SimpleButton/SimpleButtonExample.ts"],
        ["Model", "SimpleButton/SimpleButtonExampleModel.ts"],
        ["Rules", "SimpleButton/SimpleButtonExample.rules.ts"]
      ],
      markdown: "SimpleButton/SimpleButtonExample.md",
    },
    {
      title: "Buttons with Icons",
      componentFn: ButtonsWithIconsExample,
      sources: [
        ["View", "ButtonsWithIcons/ButtonsWithIconsExample.ts"],
        ["Model", "ButtonsWithIcons/ButtonsWithIconsModel.ts"],
        ["Rules", "ButtonsWithIcons/ButtonsWithIconsExample.rules.ts"],
      ],
      markdown: "ButtonsWithIcons/ButtonsWithIconsExample.md",
    },
    {
      title: "Checkbox Buttons",
      componentFn: CheckboxExample,
      sources: [
        ["View", "Checkbox/CheckboxExample.ts"],
        ["Model", "Checkbox/CheckboxExampleModel.ts"],
        ["Rules", "Checkbox/CheckboxExample.rules.ts"],
      ],
      markdown: "Checkbox/CheckboxExample.md",
    },
    {
      title: "RadioGroup",
      componentFn: RadioGroupExample,
      sources: [
        ["View", "RadioGroup/RadioGroupExample.ts"],
        ["Rules", "RadioGroup/RadioGroupExample.rules.ts"],
      ],
      markdown: "RadioGroup/RadioGroupExample.md",
    },
    {
      title: "Segmented Button",
      componentFn: SegmentedButtonExample,
      sources: [
        ["View", "SegmentedButton/SegmentedButtonExample.ts"],
        ["Rules", "SegmentedButton/SegmentedButtonExample.rules.ts"],
      ],
      markdown: "SegmentedButton/SegmentedButtonExample.md",
    },
    {
      title: "Dots",
      componentFn: DotsExample,
      sources: [
        ["View", "Dots/DotsExample.ts"],
        ["Rules", "Dots/DotsExample.rules.ts"],
      ],
      markdown: "Dots/DotsExample.md",
    },
    {
      title: "Gauge",
      componentFn: GaugeExample,
      sources: [
        ["View", "Gauge/GaugeExample.ts"],
        ["Model", "Gauge/GaugeExampleModel.ts"],
        ["Rules", "Gauge/GaugeExample.rules.ts"],
      ],
      markdown: "Gauge/GaugeExample.md",
    },
    {
      title: "Switch",
      componentFn: SwitchExample,
      sources: [
        ["View", "Switch/SwitchExample.ts"],
        ["Rules", "Switch/SwitchExample.rules.ts"],
      ],
      markdown: "Switch/SwitchExample.md",
    },
    {
      title: "Slider",
      componentFn: SliderExample,
      sources: [
        ["View", "Slider/SliderExample.ts"],
        ["Rules", "Slider/SliderExample.rules.ts"],
      ],
      markdown: "Slider/SliderExample.md",
    },
        {
      title: "SearchBox",
      componentFn: SearchBoxExample,
      sources: [
        ["View", "SearchBox/SearchBoxExample.ts"],
        ["Rules", "SearchBox/SearchBoxExample.rules.ts"],
      ],
      markdown: "SearchBox/SearchBoxExample.md",
    },
  ],
};

export default ControlsDemo;
