import { HStack, MenuButton, atom, pickList, point2D, simpleMenuItemList, zcolor, zrounding, zspace } from "zaffre";
import { place, PlaceName, zutil } from "zaffre";

export const MenuPlacementExample = () => {
  const colorChoices = [zcolor.primary, zcolor.error, zcolor.yellow, zcolor.success];
  const sides: PlaceName[] = ["left", "top", "right", "bottom"];

  const offsetForSide = (side: PlaceName) => {
    const d = 4;
    return side === "left"
      ? point2D(-d, 0)
      : side === "top"
      ? point2D(0, -d)
      : side === "right"
      ? point2D(d, 0)
      : point2D(0, d);
  };

  const ColorButton = (side: PlaceName) => {
    const selectedColor = atom(zutil.randomElement(colorChoices));
    const colorList = simpleMenuItemList(colorChoices, selectedColor, (color) => color?.key || "");
    const buttonLabel = atom(() => `${side}: ${selectedColor.get().key}`);
    return MenuButton(colorList, {
      initialValue: selectedColor.get(),
      label: buttonLabel,
      background: selectedColor,
      color: () => selectedColor.get().contrast,
      padding: zspace.s3,
      rounding: zrounding.r2,
      //ripple: false,
      menuPlacement: { ...place[side], offset: offsetForSide(side) },
    });
  };
  return HStack({ gap: zspace.s8, justifyContent: "space-around" }).append(...sides.map((side) => ColorButton(side)));
};
