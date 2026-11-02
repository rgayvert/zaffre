import { SimpleTree, TextLabel, VStack, addClass, StackOptions, afterOptionsMerged } from "zaffre";
import { GalleryModel, galleryTree } from "../Model";

//
// GalleryTree: the demo navigation tree component.
//
// This is used in two forms:
//   - a floating version, for a small window size; and
//   - a non-floating version, with an additional bottom label to show the app version number
//
// TODO:
//   - generalize this for use in other windows
//

export interface GalleryTreeOptions extends StackOptions {
  includeInfo?: boolean;
}

export const GalleryTree = (model: GalleryModel, inOptions: GalleryTreeOptions = {}) => {
  const options = addClass(inOptions, "GalleryTree");
  options.model = model;
  
  afterOptionsMerged(options, (view) => {
    const infoText = options.includeInfo ? TextLabel(`${import.meta.env.VITE_VERSION}`) : undefined;
    view.append(
      SimpleTree(galleryTree, model.selectedDemo, (val) => val?.data.title || ""),
      infoText,
    );
  });
  return VStack(options);
};
