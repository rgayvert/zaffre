import { Box, BoxOptions, Grid, GridArea, GridOptions, LabelBox, DropDownButton, ViewList, zborder, zcolor, zspace, pickList, simpleMenuItemList } from "zaffre";
import { atom, ch, gridAreaToString, px, zutil, LocalData, VStack } from "zaffre";

const splitGridArea = (a: GridArea, level: number, maxLevel: number): GridArea[] => {
  if (level === maxLevel) {
    return [a];
  }
  if (a.r2 - a.r1 > a.c2 - a.c1) {
    const rsplit = a.r1 + Math.round((zutil.randomInt(20, 80) / 100) * (a.r2 - a.r1));
    return [
      ...splitGridArea({ ...a, r2: rsplit }, level + 1, maxLevel),
      ...splitGridArea({ ...a, r1: rsplit }, level + 1, maxLevel),
    ];
  } else {
    const csplit = a.c1 + Math.round((zutil.randomInt(20, 80) / 100) * (a.c2 - a.c1));
    return [
      ...splitGridArea({ ...a, c2: csplit }, level + 1, maxLevel),
      ...splitGridArea({ ...a, c1: csplit }, level + 1, maxLevel),
    ];
  }
}
export const MondrianGridExample = () => {
  const colors = [
    zcolor.red,
    zcolor.white,
    zcolor.blue,
    zcolor.yellow,
    zcolor.green,
    zcolor.black,
  ];
  const selectedLevel = LocalData.instance.addAtom("mondrian", "4");
  const levelList = simpleMenuItemList(zutil.sequence(2, 4).map((i) => i.toString()), selectedLevel);
  const areas = atom(() => splitGridArea({ r1: 1, c1: 1, r2: 33, c2: 33 }, 0, parseInt(selectedLevel.get())));
  const options: GridOptions = {
    nrows: 32,
    ncolumns: 32,
    border: zborder.thin,
    background: zcolor.gray,
    gap: px(1),
    width: ch(50),
    height: ch(50),
  };
  const boxOptions: BoxOptions = {
    background: zcolor.background,
    border: zborder.thin,
  };
  return VStack({ alignItems: "center", gap: zspace.s5 }).append(
    LabelBox("Level:").append(
      DropDownButton(levelList,
      { width: ch(5), padding: px(0) }
      )
    ),
    Grid(options).append(
      ViewList(
        areas,
        (a, _index) => a,
        (a, _index) => Box({ ...boxOptions, background: zutil.randomElement(colors), gridArea: gridAreaToString(a) })
      )
    )
  );
}
