import { zget, atom, } from ":foundation";
import { pct, View } from ":core";
import { defineComponentDefaults, mergeComponentDefaults } from ":core";
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
defineComponentDefaults<SoftGridOptions>("SoftGrid", "Grid", {
  minColumnWidth: "60ch",
  width: pct(100),
  display: "grid",
});

export function SoftGrid(inOptions: SoftGridOptions = {}): View {
  const options = mergeComponentDefaults("SoftGrid", inOptions);

  function minWidth(): string {
    return zget(options.minColumnWidth) || "60ch";
  }
  options.templateColumns = atom(() => `repeat(auto-fit, minmax(min(${minWidth()}, 100%), 1fr))`);

  return Grid(options);
}
