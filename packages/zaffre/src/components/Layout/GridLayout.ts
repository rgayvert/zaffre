import { zget, atom } from ":foundation";
import { ZWindow, addClass, css_space, zspace } from ":core";
import { Grid } from "./Grid";
import { GridOptions } from "./Grid";

//
// A GridLayout is a reactive layout that will use different grid regions based on window size (sm, med, lg).
//
// TODO: generalize this (don't relay on 3 window sizes) and make use of foundation GridArea geometry
//

export interface GridLayoutOptions extends GridOptions {}


export interface GridLayoutSpec {
  rows?: string;
  columns?: string;
  templateAreas?: string;
  gap?: css_space;
}
interface GridLayoutModel {
  small: GridLayoutSpec;
  medium: GridLayoutSpec;
  large: GridLayoutSpec;
}

export const GridLayout = (model: GridLayoutModel, inOptions: GridLayoutOptions = {}) => {
  const options = addClass(inOptions, "GridLayout");
  options.model = model;

  const { small, medium, large } = model;

  const gridRows = (): string | undefined => {
    return ZWindow.instance.break(zget(small.rows), zget(medium.rows), zget(large.rows));
  };
  const gridColumns = (): string | undefined => {
    return ZWindow.instance.break(zget(small.columns), zget(medium.columns), zget(large.columns));
  };
  const gridGap = (): css_space | undefined => {
    return ZWindow.instance.break(zget(small.gap), zget(medium.gap), zget(large.gap));
  };
  const gridTemplateAreas = (): string | undefined => {
    return ZWindow.instance.break(zget(small.templateAreas), zget(medium.templateAreas), zget(large.templateAreas));
  };

  options.templateRows = atom(() => gridRows() || "");
  options.templateColumns = atom(() => gridColumns() || "");
  options.gap = gridGap() || zspace.s0;
  options.templateAreas = atom(() => gridTemplateAreas() || "");

  return Grid(options);
};
