import { core, View, HStack, toggleAtom, LabelBox, Checkbox, Spacer, TextLabel, atom, ch, ToggleAtom } from "zaffre";

export function CheckboxExample(): View {
  const cbValueA = toggleAtom(false);
  const cbValueB = toggleAtom(false);
  const result = atom(() => `A: ${cbValueA.get()}, B: ${cbValueB.get()}`);

  function SampleCheckbox(label: string, value: ToggleAtom): View {
    return LabelBox(label, { side: "right" }).append(
      Checkbox(value, { font: core.font.headline_medium })
    );
  }

  return HStack({ gap: core.space.s5 }).append(
    SampleCheckbox("Option A", cbValueA),
    SampleCheckbox("Option B", cbValueB),
    Spacer(core.space.s7),
    TextLabel(result, { padding: core.space.s2, font: core.font.body_small, minWidth: ch(18) }),
  );
}
