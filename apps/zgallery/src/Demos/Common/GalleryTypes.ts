import { ViewCreator } from "zaffre";

export type GallerySection = {
  componentFn: ViewCreator;
  title: string;
  sources: string[];
  markdown: string;
  preload?: boolean;
}
export type GalleryTopic = {
  sourceDir: string;
  sections: GallerySection[];
}