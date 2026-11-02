import { addClass } from ":view";
import { Box, BoxOptions } from "../HTML";

//
// A ScrollPane is a simple scrolling container. If a view might need to scroll but does
// not have a fixed size, you can embed it in a scroll panel.
//
// TODO: should we break out horizontal/vertical scrolling?

export interface ScrollPaneOptions extends BoxOptions {}

export const ScrollPane = (inOptions: ScrollPaneOptions = {}) => {
  const options = addClass(inOptions, "ScrollPane");

  return Box(options);
};
