import { zstring, atom, zboolean, resolveURI, uriIsResource } from ":foundation";
import { addClass, loadSourceBlob } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <audio> element
//

export interface AudioOptions extends BoxOptions {
  autoplay?: zboolean;
}

export const Audio = (uri: zstring, inOptions: AudioOptions = {}) => {
  const options = addClass(inOptions, "Audio");
  options.tag = "audio";

  options.controls = atom(true);
  options.onApplyContent = async (view) => {
    if (uriIsResource(uri)) {
      loadSourceBlob(uri, view);
    } else {
      view.elt.setAttribute("src", resolveURI(uri));
    }
  }
  return Box(options);
}
