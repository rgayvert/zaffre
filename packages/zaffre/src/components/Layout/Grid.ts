import { zget, atom, znumber, zstring } from ":foundation";
import { Box, BoxOptions } from "../HTML";
import { addClass, afterOptionsMerged } from ":view";

//
// A Grid component is a wrapper around a CSS grid.
//
// TODO: split off all of the Grid derivatives in a separate folder, and generalize how
// they are configured.
//
// Note: gap should be in pixels to ensure consistent grid lines
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

const convertGridAreas = (s: string): string => {
  if (s.includes(" ")) {
    return s;
  } else {
    return s
      .split(".")
      .map((a) => `"${a.replace(/./g, (ch) => `${ch} `).trim()}"`)
      .join(" ");
  }
};

// const s1 = convertGridAreas("h.n.c.s.a.f");
// const s2 = convertGridAreas("hh.nn.sc.af");
// const s3 = convertGridAreas("hhh.ncs.nca.fff");

export const Grid = (inOptions: GridOptions = {}) => {
  const options = addClass(inOptions, "Grid");
  options.display = "grid";

  afterOptionsMerged(options, () => {
    options.gridTemplateRows = options.templateRows;
    options.gridTemplateColumns = options.templateColumns;
    //options.gridTemplateAreas = () => convertGridAreas(zget(options.templateAreas) || "");
    if (options.nrows) {
      options.gridTemplateRows ??= atom(() => `repeat(${zget(options.nrows)}, 1fr)`);
    }
    if (options.ncolumns) {
      options.gridTemplateColumns ??= atom(() => `repeat(${zget(options.ncolumns)}, 1fr)`);
    }
  });

  return Box(options);
};
