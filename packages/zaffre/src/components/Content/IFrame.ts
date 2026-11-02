import { zstring, resolveURI } from ":foundation";
import { addClass } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <iframe> element
//

export interface IFrameOptions extends BoxOptions {}

export const IFrame = (uri: zstring, inOptions: IFrameOptions = {}) => {
  const options = addClass(inOptions, "IFrame");
  options.tag = "iframe";
  options.model = uri;

  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return Box(options);
};
