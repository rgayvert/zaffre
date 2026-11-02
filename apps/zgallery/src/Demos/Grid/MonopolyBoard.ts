import { BoxOptions, Grid, ch, zborder, zutil } from "zaffre";
import { TextLabel, GridArea, CenterBox, gridAreaToString } from "zaffre";

export const MonopolyBoard = () => {
  const boxOptions: BoxOptions = {
    width: ch(6),
    height: ch(6),
    border: zborder.thin,
  };
  let r = 1;
  let c = 1;
  let dr = 0;
  let dc = 1;
  const areas: GridArea[] = [];
  zutil.sequence(1, 16).forEach((i) => {
    areas.push({ r1: r, c1: c, r2: r + 1, c2: c + 1 });
    if (i === 5) {
      dr = 1;
      dc = 0;
    } else if (i === 9) {
      dr = 0;
      dc = -1;
    } else if (i === 13) {
      dr = -1;
      dc = 0;
    }
    r += dr;
    c += dc;
  });

  return Grid().append(
    ...areas.map((a, i) =>
      CenterBox({ ...boxOptions, gridArea: gridAreaToString(a) }).append(TextLabel(`${i}`))
    )
  );
};
