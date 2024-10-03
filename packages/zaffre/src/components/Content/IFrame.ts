import { zstring } from ":foundation";
import { View, resolveURI, defineBaseOptions, mergeComponentOptions, BV } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <iframe> element
//

export interface IFrameOptions extends BoxOptions {}
defineBaseOptions<IFrameOptions>("IFrame", "Box", {});

export function IFrame(uri: zstring, inOptions: BV<IFrameOptions> = {}): View {
  const options = mergeComponentOptions("IFrame", inOptions);

  options.componentName = "IFrame";
  options.tag = "iframe";
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return Box(options);
}
