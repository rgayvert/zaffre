import { zstring, zboolean, atom } from ":foundation";
import { View, resolveURI, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <audio> element
//

export interface AudioOptions extends BoxOptions {
  autoplay?: zboolean;
}

defineComponentDefaults<AudioOptions>("Audio", "Box", {
  autoplay: true,
});

export function Audio(uri: zstring, inOptions: AudioOptions = {}): View {
  const options = mergeComponentDefaults("Audio", inOptions);

  options.componentName = "Audio";
  options.tag = "audio";
  options.controls = atom(true);
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return Box(options);
}
