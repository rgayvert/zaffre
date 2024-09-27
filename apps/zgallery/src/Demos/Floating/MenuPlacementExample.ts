import { Button, Floating, HStack, SimpleMenu, View, atom } from "zaffre";
import { core, place, PlaceName, zutil } from "zaffre";

export function MenuPlacementExample(): View {
  const colorChoices = [core.color.primary, core.color.error, core.color.yellow, core.color.success];
  const sides: PlaceName[] = ["left", "top", "right", "bottom"];

  function ColorButton(side: PlaceName): View {
    const color = atom(zutil.randomElement(colorChoices));
    const buttonLabel = atom(() => `${side}: ${color.get().key}`);
    return Button({
      label: buttonLabel,
      background: color,
      color: atom(() => color.get().contrast),
      padding: core.space.s3,
      rounding: core.rounding.r2,
      ripple: false,
    }).append(
      Floating(
        SimpleMenu(color, colorChoices, (color) => color.key),
        { placement: place[side] }
      )
    );
  }
  return HStack({ gap: core.space.s8, justifyContent: "space-around" }).append(
    ...sides.map((side) => ColorButton(side))
  );
}
