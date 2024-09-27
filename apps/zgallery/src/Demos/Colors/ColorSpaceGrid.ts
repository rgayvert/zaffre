import { Atom, Color, ViewList, ZColorSpace, atom, convertColor, core, mergeComponentDefaults } from "zaffre";
import { Grid, HTMLOptions, TextLabel, View } from "zaffre";

const colorSpaces = ["rgb", "lch", "lab", "hsl"] as const;

export function ColorSpaceGrid(rgbColor: Atom<Color>, inOptions: HTMLOptions = {}): View {

  function colorString(space: ZColorSpace): Atom<string> {
    return atom(() => convertColor(rgbColor.get(), space).toCSS());
  }
  const labelOptions = {
    padding: core.space.s3, background: core.color.background
  };

  const options = mergeComponentDefaults("ColorSpaceGrid", inOptions);

  return Grid({
    ...options,
    nrows: 4,
    border: core.border.thin,
    background: core.color.lightgray,
    gap: core.space.s1,
    gridAutoFlow: "column",
  }).append(
    ViewList(
      colorSpaces,
      (c) => c,
      (c) => TextLabel(c.toUpperCase(), labelOptions )
    ),
    ViewList(
      colorSpaces,
      (c) => `${c}-label`,
      (c) => TextLabel(colorString(c), { ...labelOptions, font: core.font.label_large })
    )
  );
}
