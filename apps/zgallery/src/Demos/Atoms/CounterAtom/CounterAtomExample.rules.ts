import { zborder, zrounding, zspace, zfont, Atom, CounterAtom, ch } from "zaffre";

export const rules = (model: { N: CounterAtom; N2: Atom<number> }) => ({
  "CounterAtom1": {
    gap: zspace.s5,
  },
  "result": {
    font: zfont.body_large,
    border: zborder.thin,
    paddingInline: zspace.s4,
    minWidth: ch(14),
    textPositionX: "center",
  },
  "left-button": {
    label: "-",
    action: () => model.N.decrement(),
    rounding: zrounding.pill,
  },
  "right-button": {
    label: "+",
    action: () => model.N.increment(),
    rounding: zrounding.pill,
  },
});
