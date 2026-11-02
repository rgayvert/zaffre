import { zstring, atom, resolveURI } from ":foundation";
import { addClass } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <video> element
//

export interface VideoOptions extends BoxOptions {
  //autoplay?: zboolean;
  //controls?: zboolean;
}

export const Video = (uri: zstring, inOptions: VideoOptions = {}) => {
  const options = addClass(inOptions, "Video");
  options.tag = "video";
  options.model = uri;

  options.controls = atom(true);
  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return Box(options);
};
