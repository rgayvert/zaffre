import { zget, zstring, resolveURI } from ":foundation";
import { Box, BoxOptions } from "../HTML";
import { addClass } from ":view";

export interface CenteredImageBoxOptions extends BoxOptions {}

export const CenteredImageBox = (uri: zstring, inOptions: CenteredImageBoxOptions = {}) => {
  const options = addClass(inOptions, "CenteredImageBox");

  return Box(options).append(Box({ cls: "CenteredImageBox.Image", backgroundImage: () => `url(${resolveURI(zget(uri))})` }));
};
