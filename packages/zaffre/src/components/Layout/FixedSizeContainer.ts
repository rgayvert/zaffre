import { addClass, beforeAddedToDOM } from ":core";
import { Box, BoxOptions } from "../HTML";

export const FixedSizeContainer = (inOptions: BoxOptions = {}) => {
  const options = addClass(inOptions, "FixedSizeContainer");

  beforeAddedToDOM(options, (view): void => {
    let aspectRatio = 0;
    view.addResizeAction(() => {
      const child = view.children.at(0);
      if (child) {
        child.elt.style.position = "absolute";
        if (!aspectRatio) {
          aspectRatio = child.width / child.height;
        }
        view.setHeight(view.width / (aspectRatio || 1));
        child.setWidth(view.width);
        child.setHeight(view.height);
      }
    });
  });

  return Box(options);
};
