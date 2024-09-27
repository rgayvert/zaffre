import { zget, atom } from ":foundation";
import { core, ZWindow, css_space, View } from ":core";
import { Grid, GridOptions } from "./Grid";

//
// A GridLayout is a reactive layout that will use different grid regions based on window size (sm, med, lg).
//
// TODO: generalize this (don't relay on 3 window sizes) and make use of foundation GridArea geometry
//

export interface GridLayoutSpec {
  rows?: string;
  columns?: string;
  areas?: string;
  gap?: css_space;
}

export function GridLayout(
  smallGrid: GridLayoutSpec,
  mediumGrid: GridLayoutSpec,
  largeGrid: GridLayoutSpec,
  options: GridOptions = {}
): View {
  function gridRows(): string | undefined {
    return ZWindow.instance.break(zget(smallGrid.rows), zget(mediumGrid.rows), zget(largeGrid.rows));
  }
  function gridColumns(): string | undefined {
    return ZWindow.instance.break(zget(smallGrid.columns), zget(mediumGrid.columns), zget(largeGrid.columns));
  }
  function gridGap(): css_space | undefined {
    return ZWindow.instance.break(zget(smallGrid.gap), zget(mediumGrid.gap), zget(largeGrid.gap));
  }
  function gridAreas(): string | undefined {
    return ZWindow.instance.break(zget(smallGrid.areas), zget(mediumGrid.areas), zget(largeGrid.areas));
  }

  options.templateRows = atom(() => gridRows() || "");
  options.templateColumns = atom(() => gridColumns() || "");
  options.gap = gridGap() || core.space.s0;
  options.templateAreas = atom(() => gridAreas() || "");

  return Grid(options);
}
