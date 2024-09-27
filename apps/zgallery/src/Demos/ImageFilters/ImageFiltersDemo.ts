import { View } from "zaffre";
import { GalleryDemo, GalleryTopic } from "../Common";
import { ImageFiltersExample } from "./ImageFiltersExample";

export function ImageFiltersDemo(): View {
  return GalleryDemo(topic);
}

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/ImageFilters",
  sections: [
    {
      title: "Image Filters",
      componentFn: ImageFiltersExample,
      sources: ["ImageFiltersExample.ts", "ImageFiltersModel.ts"],
      markdown: "ImageFiltersExample.md",
    },

  ],
};

export default ImageFiltersDemo;
