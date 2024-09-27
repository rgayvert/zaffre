import { View, HTML, HTMLOptions } from ":core";
import { core, defineComponentDefaults, mergeComponentDefaults } from ":core";

//
// A Box is the most basic HTML component. Usually used as a simple container, 
// sometimes with a border.
//

export interface BoxOptions extends HTMLOptions {
}

defineComponentDefaults<BoxOptions>("Box", "HTML", {
  position: "relative",
  background: core.color.background,
});

export function Box(inOptions: BoxOptions = {}): View {
  const options = mergeComponentDefaults("Box", inOptions);
  return HTML(options);
}
