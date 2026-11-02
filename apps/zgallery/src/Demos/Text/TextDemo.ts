import { GalleryDemo, GalleryTopic } from "../Common";
import { URLTextExample } from "./URLTextExample";
import { TextExample1 } from "./TextExample1";
import { MarkdownExample } from "./MarkdownExample";

export const TextDemo = () => {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/TextLabel",
  sections: [
    {
      title: "TextLabel box with transform",
      componentFn: TextExample1,
      sources: [["View", "TextExample1.ts"]],
      markdown: "TextExample1.md",
    },
    {
      title: "URLText",
      componentFn: URLTextExample,
      sources: [["View", "URLTextExample.ts"]],
      markdown: "URLTextExample.md",
    },
    {
      title: "Markdown",
      componentFn: MarkdownExample,
      sources: [["View", "MarkdownExample.ts"]],
      markdown: "MarkdownExample.md",
    },
  ],
};

export default TextDemo;
