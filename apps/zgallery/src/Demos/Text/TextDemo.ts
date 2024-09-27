import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { URLTextExample } from "./URLTextExample";
import { TextExample1 } from "./TextExample1";
import { MarkdownExample } from "./MarkdownExample";

export function TextDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/Text",
  sections: [
    {
      title: "Text box with transform",
      componentFn: TextExample1,
      sources: ["TextExample1.ts"],
      markdown: "TextExample1.md",
    },
    {
      title: "URLText",
      componentFn: URLTextExample,
      sources: ["URLTextExample.ts"],
      markdown: "URLTextExample.md",
    },
    {
      title: "Markdown",
      componentFn: MarkdownExample,
      sources: ["MarkdownExample.ts"],
      markdown: "MarkdownExample.md",
    },
  ],
};

export default TextDemo;
