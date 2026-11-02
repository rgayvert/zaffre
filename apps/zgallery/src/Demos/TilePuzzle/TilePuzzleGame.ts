import { Atom, pickList, PickList, DropDownButton, Ensemble, HStack, LabelBox, Page, zfont, zspace, menuItemList, simpleMenuItemList, MenuItemList } from "zaffre";
import { Spacer, VStack, atom, ch, pct, zutil } from "zaffre";
import { GridTilePuzzle } from "./GridTilePuzzle";
import { BoxTilePuzzle } from "./BoxTilePuzzle";

export const TilePuzzleGame = () => {
  const sizeChoices = zutil.sequence(3, 4).map((n) => `${n} x ${n}`);
  const selectedSize = atom("3 x 3");
  const sizeList = simpleMenuItemList(sizeChoices, selectedSize);
  const typeChoices = ["Box", "Grid"];
  const selectedType = atom("Box");
  const typeList = simpleMenuItemList(typeChoices, selectedType);
  const sizeAndType = atom(() => `${sizeList.get()}-${typeList.get()}`);
  //const menuOptions = { font: zfont.title_medium, padding: zspace.s2, rounding: zrounding.pill };
  const labelOptions = { font: zfont.title_medium };

  const TilePuzzle = (key: string) => {
    const [sz, type] = key.split("-");
    const size = parseInt(sz);
    return type === "Box" ? BoxTilePuzzle(size) : GridTilePuzzle(size);
  };
  const MenuWithLabel = (label: string, menuItemList: MenuItemList<string>) => {
    return LabelBox(label, labelOptions).append(DropDownButton(menuItemList));
  };
  return Page({ maxWidth: ch(100), width: pct(90) }).append(
    VStack({ width: pct(100), alignItems: "center" }).append(
      HStack({ gap: zspace.s4 }).append(MenuWithLabel("Size:", sizeList), MenuWithLabel("Type:", typeList)),
      Spacer("s5"),
      Ensemble(sizeAndType, (key) => TilePuzzle(key))
    )
  );
};
