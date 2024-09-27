import { core, View, HStack, toggleAtom, Switch, Spacer, TextLabel, atom, ch } from "zaffre";

export function SwitchExample(): View {
  const switchValue = toggleAtom(false);

  return HStack({ gap: core.space.s4 }).append(
    Switch(switchValue, { controlSize: "sm" }),
    Switch(switchValue),
    Switch(switchValue, { controlSize: "lg" }),
    Spacer(core.space.s7),
    TextLabel(
      atom(() => `Value: ${switchValue.get()}`),
      { padding: core.space.s2, font: core.font.body_small, minWidth: ch(18) }
    )
  );
}
