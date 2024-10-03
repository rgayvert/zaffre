import { zstring, zboolean, atom } from ":foundation";
import { View, resolveURI, defineBaseOptions, mergeComponentOptions, BV } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <video> element
//

export interface VideoOptions extends BoxOptions {
  autoplay?: zboolean;
  controls?: zboolean;
}
defineBaseOptions<VideoOptions>("IFrame", "Box", {
  autoplay: true,
  controls: true,
});

export function Video(uri: zstring, inOptions: BV<VideoOptions> = {}): View {
  const options = mergeComponentOptions("Video", inOptions);

  options.componentName = "Video";
  options.tag = "video";
  options.controls = atom(true);
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return Box(options);
}
