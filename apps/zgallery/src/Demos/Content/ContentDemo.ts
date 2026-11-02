import { GalleryDemo, GalleryTopic } from "../Common";
import { LabelExample } from "./LabelExample";
import { TextBoxExample } from "./TextBoxExample";
import { IconExample } from "./IconExample";
import { TextAreaExample } from "./TextAreaExample";
import { VideoExample } from "./VideoExample";
import { ImageExample } from "./ImageExample";
import { AudioExample } from "./AudioExample";
import { LinkExample } from "./LinkExample";
import { IFrameExample } from "./IFrameExample";
import { FormattedLabelExample } from "./FormattedLabelExample";
import { IconLabelExample } from "./IconLabelExample";
import { DropImageExample } from "./DropImageExample";
import { CenteredImageExample } from "./CenteredImageExample";

export const ContentDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Content",
  sections: [
    {
      title: "TextLabel",
      componentFn: LabelExample,
      sources: [["View", "LabelExample.ts"]],
      markdown: "LabelExample.md",
    },
    {
      title: "Formatted TextLabel",
      componentFn: FormattedLabelExample,
      sources: [["View", "FormattedLabelExample.ts"]],
      markdown: "FormattedLabelExample.md",
    },
    {
      title: "TextBox",
      componentFn: TextBoxExample,
      sources: [["View", "TextBoxExample.ts"]],
      markdown: "TextBoxExample.md",
    },
    {
      title: "Icons",
      componentFn: IconExample,
      sources: [["View", "IconExample.ts"]],
      markdown: "IconExample.md",
    },
    {
      title: "IconLabels",
      componentFn: IconLabelExample,
      sources: [["View", "IconLabelExample.ts"]],
      markdown: "IconLabelExample.md",
    },
    {
      title: "Links",
      componentFn: LinkExample,
      sources: [["View", "LinkExample.ts"]],
      markdown: "LinkExample.md",
    },
    {
      title: "TextLabel Area",
      componentFn: TextAreaExample,
      sources: [["View", "TextAreaExample.ts"]],
      markdown: "TextAreaExample.md",
    },
    {
      title: "Images",
      componentFn: ImageExample,
      sources: [["View", "ImageExample.ts"]],
      markdown: "ImageExample.md",
    },
    {
      title: "Centered Image",
      componentFn: CenteredImageExample,
      sources: [["View", "CenteredImageExample.ts"]],
      markdown: "CenteredImageExample.md",
    },
    {
      title: "Drop Image",
      componentFn: DropImageExample,
      sources: [["View", "DropImageExample.ts"]],
      markdown: "DropImageExample.md",
    },
    {
      title: "Audio",
      componentFn: AudioExample,
      sources: [["View", "AudioExample.ts"]],
      markdown: "AudioExample.md",
    },
    {
      title: "Video",
      componentFn: VideoExample,
      sources: [["View", "VideoExample.ts"]],
      markdown: "VideoExample.md",
    },
    {
      title: "IFrame",
      componentFn: IFrameExample,
      sources: [["View", "IFrameExample.ts"]],
      markdown: "IFrameExample.md",
    },
  ],
};

export default ContentDemo;
