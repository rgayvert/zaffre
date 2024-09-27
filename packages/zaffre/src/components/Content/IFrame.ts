import { zstring } from ":foundation";
import { View, resolveURI, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// Simple wrapper around an HTML <iframe> element
//

export interface IFrameOptions extends BoxOptions {}
defineComponentDefaults<IFrameOptions>("IFrame", "Box", {});

export function IFrame(uri: zstring, inOptions: IFrameOptions = {}): View {
  const options = mergeComponentDefaults("IFrame", inOptions);

  options.componentName = "IFrame";
  options.tag = "iframe";
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => view.elt.setAttribute("src", resolveURI(uri));
  return Box(options);
}
