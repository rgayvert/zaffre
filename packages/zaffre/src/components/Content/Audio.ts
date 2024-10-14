import { zstring, zboolean, atom } from ":foundation";
import { View, resolveURI, defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <audio> element
//

export interface AudioOptions extends BoxOptions {
  autoplay?: zboolean;
}

defineComponentBundle<AudioOptions>("Audio", "Box", {
  autoplay: true,
});

export function Audio(uri: zstring, inOptions: BV<AudioOptions> = {}): View {
  const options = mergeComponentOptions("Audio", inOptions);

  options.componentName = "Audio";
  options.tag = "audio";
  options.controls = atom(true);
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return restoreOptions(Box(options));
}
