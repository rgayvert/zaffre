import { View, core, TextLabel, atom, Button, HStack, ch } from "zaffre";
import { counterAtom } from "zaffre";

export function CounterAtomExample(): View {
  const N = counterAtom(1);
  const N2 = atom(() => N.get() * 2);
  return HStack({ gap: core.space.s5 }).append(
    Button({
      label: "-",
      action: () => N.decrement(),
      rounding: core.rounding.pill,
    }),
    TextLabel(
      atom(() => `n=${N.get()},   n2=${N2.get()}`),
      {
        font: core.font.body_large,
        border: core.border.thin,
        paddingInline: core.space.s4,
        minWidth: ch(14),
        textPositionX: "center",
      }
    ),
    Button({
      label: "+",
      action: () => N.increment(),
      rounding: core.rounding.pill,
    }),
  );
}
