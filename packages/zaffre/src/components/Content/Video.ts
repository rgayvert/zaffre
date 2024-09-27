import { zstring, zboolean, atom } from ":foundation";
import { View, resolveURI, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <video> element
//

export interface VideoOptions extends BoxOptions {
  autoplay?: zboolean;
  controls?: zboolean;
}
defineComponentDefaults<VideoOptions>("IFrame", "Box", {
  autoplay: true,
  controls: true,
});

export function Video(uri: zstring, inOptions: VideoOptions = {}): View {
  const options = mergeComponentDefaults("Video", inOptions);

  options.componentName = "Video";
  options.tag = "video";
  options.controls = atom(true);
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return Box(options);
}
