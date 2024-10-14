import { zget, atom, } from ":foundation";
import { BV, pct, restoreOptions, View } from ":core";
import { defineComponentBundle, mergeComponentOptions } from ":core";
import { Grid, GridOptions } from "./Grid";

//
// A SoftGrid is an intrinsically responsive layout that changes the number of columns in a
// grid to fit the available space.
//
// Adapted from https://every-layout.dev/layouts/grid/
// 

export interface SoftGridOptions extends GridOptions {
  minColumnWidth?: string;
}
defineComponentBundle<SoftGridOptions>("SoftGrid", "Grid", {
  minColumnWidth: "60ch",
  width: pct(100),
  display: "grid",
});

export function SoftGrid(inOptions: BV<SoftGridOptions> = {}): View {
  const options = mergeComponentOptions("SoftGrid", inOptions);

  function minWidth(): string {
    return zget(options.minColumnWidth) || "60ch";
  }
  options.templateColumns = atom(() => `repeat(auto-fit, minmax(min(${minWidth()}, 100%), 1fr))`);

  return restoreOptions(Grid(options));
}
