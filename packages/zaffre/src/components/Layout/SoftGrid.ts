import { zget, atom } from ":foundation";
import { Grid } from "./Grid";
import { addClass } from ":view";
import { ch, css_length } from ":attributes";
import { GridOptions } from "./Grid";

//
// A SoftGrid is an intrinsically responsive layout that changes the number of columns in a
// grid to fit the available space.
//
// Adapted from https://every-layout.dev/layouts/grid/
//

export interface SoftGridOptions extends GridOptions {
  minColumnWidth?: css_length;
}


export const SoftGrid = (inOptions: SoftGridOptions = {}) => {
  const options = addClass(inOptions, "SoftGrid");

  const minWidth = (): css_length => {
    return zget(options.minColumnWidth) || ch(20);
  };
  options.templateColumns = atom(() => `repeat(auto-fit, minmax(min(${minWidth()}, 100%), 1fr))`);

  return Grid(options);
};
