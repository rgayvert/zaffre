import { GalleryDemo, GalleryTopic } from "../Common";
import { DateInputExample } from "./DateInputExample";
import { TimeInputExample } from "./TimeInputExample";
import { ColorInputExample } from "./ColorInputExample";
import { TextInputExample } from "./TextInputExample";
import { EmailInputExample } from "./EmailInputExample";
import { FileInputExample } from "./FileInputExample";
import { PasswordInputExample } from "./PasswordInputExample";
import { NumberInputExample } from "./NumberInputExample";
import { TelephoneInputExample } from "./TelephoneInputExample";
import { URLInputExample } from "./URLInputExample";
import { DateTimeInputExample } from "./DateTimeInputExample";
import { WeekInputExample } from "./WeekInputExample";
import { MonthInputExample } from "./MonthInputExample";
import { NumericInputExample } from "./NumericInputExample";
import { ImageInputExample } from "./ImageInputExample";

export const InputsDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Inputs",
  sections: [
    {
      title: "TextLabel Input",
      componentFn: TextInputExample,
      sources: [
        ["View", "TextInputExample.ts"],
        ["InputExampleBox", "InputExampleBox.ts"],
        ["Rules", "InputExampleBox.rules.ts"],
      ],
      markdown: "TextInputExample.md",
    },
    {
      title: "Email Input",
      componentFn: EmailInputExample,
      sources: [["View", "EmailInputExample.ts"]],
      markdown: "EmailInputExample.md",
    },
    {
      title: "Password Input",
      componentFn: PasswordInputExample,
      sources: [["View", "PasswordInputExample.ts"]],
      markdown: "PasswordInputExample.md",
    },
    {
      title: "Telephone Input",
      componentFn: TelephoneInputExample,
      sources: [["View", "TelephoneInputExample.ts"]],
      markdown: "TelephoneInputExample.md",
    },
    {
      title: "URL Input",
      componentFn: URLInputExample,
      sources: [["View", "URLInputExample.ts"]],
      markdown: "URLInputExample.md",
    },
    {
      title: "Number Input",
      componentFn: NumberInputExample,
      sources: [["View", "NumberInputExample.ts"]],
      markdown: "NumberInputExample.md",
    },
    {
      title: "Numeric Input",
      componentFn: NumericInputExample,
      sources: [["View", "NumericInputExample.ts"]],
      markdown: "NumericInputExample.md",
    },
    {
      title: "Color Input",
      componentFn: ColorInputExample,
      sources: [["View", "ColorInputExample.ts"]],
      markdown: "ColorInputExample.md",
    },
    {
      title: "File Input",
      componentFn: FileInputExample,
      sources: [["View", "FileInputExample.ts"]],
      markdown: "FileInputExample.md",
    },
    {
      title: "Date Input",
      componentFn: DateInputExample,
      sources: [["View", "DateInputExample.ts"]],
      markdown: "DateInputExample.md",
    },
    {
      title: "DateTime Input",
      componentFn: DateTimeInputExample,
      sources: [["View", "DateTimeInputExample.ts"]],
      markdown: "DateTimeInputExample.md",
    },
    {
      title: "Time Input",
      componentFn: TimeInputExample,
      sources: [["View", "TimeInputExample.ts"]],
      markdown: "TimeInputExample.md",
    },
    {
      title: "Week Input",
      componentFn: WeekInputExample,
      sources: [["View", "WeekInputExample.ts"]],
      markdown: "WeekInputExample.md",
    },
    {
      title: "Month Input",
      componentFn: MonthInputExample,
      sources: [["View", "MonthInputExample.ts"]],
      markdown: "MonthInputExample.md",
    },
    {
      title: "Image Input",
      componentFn: ImageInputExample,
      sources: [["View", "ImageInputExample.ts"]],
      markdown: "ImageInputExample.md",
    },
  ],
};

export default InputsDemo;
