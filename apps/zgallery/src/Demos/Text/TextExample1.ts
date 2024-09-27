import { View, core, em, ScrollPane, TextBox, pct, atom, lorem, VStack, HStack, RadioButtons } from "zaffre";

export function TextExample1(): View {
  const content = atom(lorem.sentences(200));
  const capitalized = atom("normal");
  function capitalize(s: string): string {
    return capitalized.get() === "capitalized" ? s.toUpperCase() : s;
  }
  return VStack({ gap: core.space.s5 }).append(
    ScrollPane({ width: pct(100), height: pct(100) }).append(
      TextBox(content, {
        border: core.border.thin,
        padding: core.space.s4,
        height: em(12),
        textTransformFn: capitalize,
      })
    ),
    HStack().append(
      RadioButtons(capitalized, ["normal", "capitalized"])
    )
  );
}
