import { GalleryDemo, GalleryTopic } from "../Common";
import { ImageFiltersExample } from "./ImageFiltersExample";

export const ImageFiltersDemo = () => {
  return GalleryDemo(topic);
};

const topic: GalleryTopic = {
  sourceDir: "/source/Demos/ImageFilters",
  sections: [
    {
      title: "Image Filters",
      componentFn: ImageFiltersExample,
      sources: [
        ["View", "ImageFiltersExample.ts"],
        ["Model", "ImageFiltersModel.ts"],
      ],
      markdown: "ImageFiltersExample.md",
    },
  ],
};

export default ImageFiltersDemo;
