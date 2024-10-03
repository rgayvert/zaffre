import { BV, View, ch, css, pct } from ":core";
import { defineBaseOptions, mergeComponentOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Page is primarily intended for top-level page layout.
//
// TODO
//  - should this be a stack?
//  - should this support "on this page"?
//

export interface PageOptions extends BoxOptions {}

defineBaseOptions<PageOptions>("Page", "Box", {
  width: pct(100),
  height: pct(100),
  maxWidth: ch(100), 
  margin: css("0 auto"),
});


export function Page(inOptions: BV<PageOptions> = {}): View {
  const options = mergeComponentOptions("Page", inOptions);

  return Box(options);
}

