import { BoxOptions, CenteredTextLabel, Grid, GridOptions, View, ch, core } from "zaffre";

export function SimpleGridExample(): View {
  const data = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const options: GridOptions = {
    nrows: data.length,
    ncolumns: Math.max(...data.map((row) => row.length)),
    border: core.border.thin,
    gap: core.space.s1,
    background: core.color.gray,
  };
  const boxOptions: BoxOptions = {
    width: ch(6),
    height: ch(6),
    background: core.color.background,
  };

  return Grid(options).append(
    ...data.map((row) => row.map((val) => CenteredTextLabel(val.toString(), boxOptions))).flat()
  );
}
