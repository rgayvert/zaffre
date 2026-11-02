import { Atom, Color, ViewList, ZColorSpace, GridOptions, addClass } from "zaffre";
import { atom, convertColor, Grid, TextLabel } from "zaffre";

const colorSpaces = ["rgb", "lch", "lab", "hsl"] as const;

export const ColorSpaceGrid = (rgbColor: Atom<Color>, inOptions: GridOptions = {}) => {
  const options = addClass(inOptions, "ColorSpaceGrid");
  const colorString = (space: ZColorSpace) => {
    return atom(() => convertColor(rgbColor.get(), space).toCSS());
  };
  return Grid(options).append(
    ViewList(
      colorSpaces,
      (c) => c,
      (c) => TextLabel(c.toUpperCase(), { cls: "ColorSpaceGrid_Space" })
    ),
    ViewList(
      colorSpaces,
      (c) => `${c}-label`,
      (c) => TextLabel(colorString(c), { cls: "ColorSpaceGrid_Desc" })
    )
  );
};
