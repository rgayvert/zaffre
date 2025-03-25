import { Box, BoxOptions, Grid, GridArea, GridOptions, LabelBox, SimpleDropDownButton, ViewList } from "zaffre";
import { atom, ch, core, gridAreaToString, px, zutil, LocalData, VStack, View } from "zaffre";

function splitGridArea(a: GridArea, level: number, maxLevel: number): GridArea[] {
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
export function MondrianGridExample(): View {
  const colors = [
    core.color.red,
    core.color.white,
    core.color.blue,
    core.color.yellow,
    core.color.green,
    core.color.black,
  ];
  const level = LocalData.instance.addAtom("mondrian", "4");
  const areas = atom(() => splitGridArea({ r1: 1, c1: 1, r2: 33, c2: 33 }, 0, parseInt(level.get())));
  const options: GridOptions = {
    nrows: 32,
    ncolumns: 32,
    border: core.border.thin,
    background: core.color.gray,
    gap: px(1),
    width: ch(50),
    height: ch(50),
  };
  const boxOptions: BoxOptions = {
    background: core.color.background,
    border: core.border.thin,
  };
  return VStack({ alignItems: "center", gap: core.space.s5 }).append(
    LabelBox("Level:").append(
      SimpleDropDownButton(
        level,
        zutil.sequence(2, 4).map((i) => i.toString()),
        { width: ch(6), padding: px(0) }
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
