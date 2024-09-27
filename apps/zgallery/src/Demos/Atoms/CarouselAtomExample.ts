import { View, core, TextLabel, Button, HStack } from "zaffre";
import { carouselAtom } from "zaffre";

export function CarouselAtomExample(): View {
  const carousel = carouselAtom(["1", "2", "3", "4"], "2");
  return HStack({ gap: core.space.s5 }).append(
    Button({
      label: "<",
      action: () => carousel.previous(),
      rounding: core.rounding.pill,
    }),
    TextLabel(carousel, {
      font: core.font.body_large,
      border: core.border.thin,
      paddingInline: core.space.s4,
    }),
    Button({
      label: ">",
      action: () => carousel.next(),
      rounding: core.rounding.pill,
    })
  );
}
