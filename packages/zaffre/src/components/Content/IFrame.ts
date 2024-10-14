import { zstring } from ":foundation"; 
import { View, resolveURI, defineComponentBundle, mergeComponentOptions, BV, restoreOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <iframe> element
//

export interface IFrameOptions extends BoxOptions {}
defineComponentBundle<IFrameOptions>("IFrame", "Box", {});

export function IFrame(uri: zstring, inOptions: BV<IFrameOptions> = {}): View {
  const options = mergeComponentOptions("IFrame", inOptions);

  options.componentName = "IFrame";
  options.tag = "iframe";
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return restoreOptions(Box(options));
}
