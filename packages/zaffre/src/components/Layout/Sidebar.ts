import { View, pct, px, css_flexBasis, css_length_pct, BV } from ":core";
import { HTMLOptions, defineBaseOptions, mergeComponentOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Sidebar is a responsive layout intended to contain two children, a sidebar and a content view. 
// The two views will be side-by-side when possible, otherwise the sidebar will appear above the content.
//

// Adapted from https://every-layout.dev/layouts/sidebar/

export interface SidebarOptions extends BoxOptions {
  sideWidth?: css_flexBasis;
  contentMinWidth?: css_length_pct;
}
defineBaseOptions<SidebarOptions>("Sidebar", "Box", {
  contentMinWidth: pct(50),
  display: "flex",
  flexWrap: "wrap",
});

export function Sidebar(inOptions: BV<SidebarOptions> = {}): View {
  const options = mergeComponentOptions("Sidebar", inOptions);

  options.afterAppendChild = (view: View, child: View): void => {
    const childOptions = <HTMLOptions>child.options;
    if (view.children.length === 1) {
      // first child
      childOptions.flexBasis = options.sideWidth;
      childOptions.flexGrow = 1;
    } else {
       // second child
       childOptions.flexBasis = px(0);
       childOptions.flexGrow = 999;
       childOptions.minInlineSize = pct(50);
    }
  };
  return Box(options);
}
