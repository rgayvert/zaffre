import { View, BV, restoreOptions, core, css_space } from ":core";
import { defineComponentBundle, mergeComponentOptions } from ":core";
import { Grid, GridOptions } from "./Grid";
import { Atom, atom } from ":foundation";

//
// A GridSidebar is a responsive layout intended to contain two children, a sidebar and a content view.
// The two views will be side-by-side when possible, otherwise the sidebar will appear above the content.
//


export interface GridSidebarOptions extends GridOptions {
  gap?: css_space
}
defineComponentBundle<GridSidebarOptions>("GridSidebar", "Grid", {
  gap: core.space.s3
});

export function GridSidebar(sidebarView: View, contentView: View, horizontal: Atom<boolean>, inOptions: BV<GridSidebarOptions> = {}): View {
  const options = mergeComponentOptions("GridSidebar", inOptions);

  return restoreOptions(Grid({
      templateRows: atom(() => horizontal.get() ? "auto" : "auto auto"),
      templateColumns: atom(() => horizontal.get() ? "auto auto" : "auto"),
      gap: options.gap
  }).append(
    sidebarView, contentView
  ));
}
