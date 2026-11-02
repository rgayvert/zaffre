import { addClass, css_space } from ":core";
import { Grid } from "./Grid";
import { Atom } from ":foundation";
import { GridOptions } from "./Grid";

//
// A GridSidebar is a responsive layout intended to contain two children, a sidebar and a content view.
// The two views will be side-by-side when possible, otherwise the sidebar will appear above the content.
//

export interface GridSidebarOptions extends GridOptions {
  gap?: css_space;
}

export const GridSidebar = (horizontal: Atom<boolean>, inOptions: GridSidebarOptions = {}) => {
  const options = addClass(inOptions, "GridSidebar");
  options.model = horizontal;
  options.templateRows = () => (horizontal.get() ? "auto" : "auto auto");
  options.templateColumns = () => (horizontal.get() ? "auto auto" : "auto");
  //options.gap ||= zspace.s6

  return Grid(options);
};
