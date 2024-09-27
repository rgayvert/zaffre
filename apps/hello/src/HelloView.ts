import { core, VStack, TextLabel, View, ch } from "zaffre";

export function Hello(): View {
  return VStack({ alignItems: "center", padding: core.space.s6, minWidth: ch(65) }).append(
    TextLabel("Hello World", {
      color: core.color.primary,
      font: core.font.headline_medium,
    })
  );
}

