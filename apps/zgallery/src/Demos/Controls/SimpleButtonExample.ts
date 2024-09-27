import { core, View, HStack, pct, Button, simpleInteractionEffects, transitions } from "zaffre";
import { VDivider, em, DownButton, counterAtom, TextLabel, atom, ch, Spacer } from "zaffre";

export function SimpleButtonExample(): View {
  const result = atom("");
  const downCount = counterAtom(0);

  return HStack({ gap: core.space.s5 }).append(
    Button({
      label: "Default",
      action: () => result.set("(default)"),
    }),
    Button({
      label: "Plain",
      action: () => result.set("(plain)"),
      effects: simpleInteractionEffects(),
      ripple: false,
      controlSize: "sm",
      rounding: core.rounding.pill,
    }),
    Button({
      label: "Filled",
      background: core.color.teal,
      action: () => result.set("(filled)"),
      effects: { clicked: transitions.push() },
      ripple: false,
    }),
    VDivider({ width: em(0.2), color: core.color.blue, height: pct(80) }),
    Button({
      label: "Outlined",
      border: core.border.thin,
      color: core.color.blue,
      background: core.color.background,
      events: { click: () => result.set("(outlined)") },
      effects: { clicked: transitions.bounce() },
      controlSize: "lg",
    }),
    DownButton({
      label: "Hold me down",
      downAction: () => downCount.increment(),
      border: core.border.thin,
      color: core.color.blue,
      background: core.color.background,
      controlSize: "med",
    }),
    TextLabel(
      atom(() => `${downCount.get()}`),
      {
        padding: core.space.s2,
        border: core.border.medium,
        textAlign: "end",
        minWidth: ch(4),
      }
    ),
    Spacer(core.space.s7),
    TextLabel(result, { padding: core.space.s2, font: core.font.body_small, minWidth: ch(12) }),
  );
}
