import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { TextLabelExample } from "./TextLabelExample";
import { TextBoxExample } from "./TextBoxExample";
import { IconExample } from "./IconExample";
import { TextAreaExample } from "./TextAreaExample";
import { VideoExample } from "./VideoExample";
import { ImageExample } from "./ImageExample";
import { AudioExample } from "./AudioExample";
import { LinkExample } from "./LinkExample";
import { IFrameExample } from "./IFrameExample";
import { FormattedLabelExample } from "./FormattedLabelExample";


export function ContentDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Content",
  sections: [
    { 
      title: "Text Label",
      componentFn: TextLabelExample,
      sources: ["TextLabelExample.ts"],
      markdown: "TextLabelExample.md",
    },
    {
      title: "Formatted Label",
      componentFn: FormattedLabelExample,
      sources: ["FormattedLabelExample.ts"],
      markdown: "FormattedLabelExample.md",
    },
    {
      title: "TextBox",
      componentFn: TextBoxExample,
      sources: ["TextBoxExample.ts"],
      markdown: "TextBoxExample.md",
    },
    {
      title: "Icons",
      componentFn: IconExample,
      sources: ["IconExample.ts"],
      markdown: "IconExample.md",
    },
    {
      title: "Links",
      componentFn: LinkExample,
      sources: ["LinkExample.ts"],
      markdown: "LinkExample.md",
    },
    {
      title: "Text Area",
      componentFn: TextAreaExample,
      sources: ["TextAreaExample.ts"],
      markdown: "TextAreaExample.md",
    },
    {
      title: "Images",
      componentFn: ImageExample,
      sources: ["ImageExample.ts"],
      markdown: "ImageExample.md",
    },
    {
      title: "Audio",
      componentFn: AudioExample,
      sources: ["AudioExample.ts"],
      markdown: "AudioExample.md",
    },
    {
      title: "Video",
      componentFn: VideoExample,
      sources: ["VideoExample.ts"],
      markdown: "VideoExample.md",
    },
    {
      title: "IFrame",
      componentFn: IFrameExample,
      sources: ["IFrameExample.ts"],
      markdown: "IFrameExample.md",
    },

  ]};

  export default ContentDemo;
