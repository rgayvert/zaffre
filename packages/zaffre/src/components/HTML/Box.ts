import { View, HTML, HTMLOptions, BV, restoreOptions } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";

//
// A Box is the most basic HTML component. Usually used as a simple container,
// sometimes with a border.
//

export interface BoxOptions extends HTMLOptions {}

defineComponentBundle<BoxOptions>("Box", "HTML", {
  position: "relative",
  background: core.color.background,
});

export function Box(inOptions: BV<BoxOptions> = {}): View {
  const options = mergeComponentOptions("Box", inOptions);
  return restoreOptions(HTML(options));
}
