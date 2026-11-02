import { BoxOptions, CenteredText, Grid, GridOptions, ch, zcolor,zborder, px } from "zaffre";

export const SimpleGridExample = () => {
  const data = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const options: GridOptions = {
    nrows: data.length,
    ncolumns: Math.max(...data.map((row) => row.length)),
    border: zborder.thin,
    gap: px(1),
    background: zcolor.gray,
  };
  const boxOptions: BoxOptions = {
    width: ch(6),
    height: ch(6),
    background: zcolor.background,
  };

  return Grid(options).append(
    ...data.map((row) => row.map((val) => CenteredText(val.toString(), { ...boxOptions }))).flat()
  );
}
