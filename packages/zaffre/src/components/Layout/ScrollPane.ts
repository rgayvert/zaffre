import { BV, View, defineComponentBundle, mergeComponentOptions, restoreOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A ScrollPane is a simple scrolling container. If a view might need to scroll but does
// not have a fixed size, you can embed it in a scroll panel.
//
// TODO: should we break out horizontal/vertical scrolling?

export interface ScrollPaneOptions extends BoxOptions {}

defineComponentBundle<ScrollPaneOptions>("ScrollPane", "Box", {
  overflow: "auto",
});

export function ScrollPane(inOptions: BV<ScrollPaneOptions> = {}): View {
  const options = mergeComponentOptions("ScrollPane", inOptions);
  return restoreOptions(Box(options));
}
