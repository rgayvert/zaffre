import { znumber, zstring, zget, atom } from ":foundation";
import { BV, View, defineBaseOptions, mergeComponentOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Grid component is a wrapper around a CSS grid.
//
// TODO: split off all of the Grid derivatives in a separate folder, and generalize how
// they are configured.
//

export interface GridOptions extends BoxOptions {
  nrows?: znumber;
  ncolumns?: znumber;
  templateRows?: zstring;
  templateColumns?: zstring;
  areaNames?: string[];
  areas?: zstring;
  templateAreas?: zstring;
}
defineBaseOptions<GridOptions>("Grid", "Box", {
  display: "grid",
});

export function Grid(inOptions: BV<GridOptions> = {}): View {
  const options = mergeComponentOptions("Grid", inOptions);

  options.gridTemplateRows = options.templateRows;
  options.gridTemplateColumns = options.templateColumns;
  options.gridTemplateAreas = options.templateAreas;
  if (options.nrows) {
    options.gridTemplateRows ??= atom(() => `repeat(${zget(options.nrows)}, 1fr)`);
  }
  if (options.ncolumns) {
    options.gridTemplateColumns ??= atom(() => `repeat(${zget(options.ncolumns)}, 1fr)`);
  }

  return Box(options);
}
