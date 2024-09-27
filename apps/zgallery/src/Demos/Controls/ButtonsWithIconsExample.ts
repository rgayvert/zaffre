import { core, View, HStack, Button, atom, toggleAtom, TextLabel, Spacer, ch, downloadText } from "zaffre";

export function ButtonsWithIconsExample(): View {
  const storeOpen = toggleAtom(true);
  const result = atom("");
  const iconName = "icon.shopping-cart";

  return HStack({ gap: core.space.s5, font: core.font.title_medium }).append(
    Button({ leadingIconURI: iconName, action: () => result.set("(icon)"), paddingBlock: core.space.s1 }),
    Button({ leadingIconURI: iconName, label: "Shop", action: () => result.set("(icon-left)") }),
    Button({ trailingIconURI: iconName, label: "Shop", action: () => result.set("(icon-right)") }),
    Button({
      gap: core.space.s3,
      leadingIconURI: iconName,
      label: atom(() => (storeOpen.get() ? "Open" : "Closed")),
      trailingIconURI: atom(() => (storeOpen.get() ? "icon.done" : "icon.close")),
      action: () => {
        storeOpen.toggle();
        result.set(`(${storeOpen.get() ? "open" : "closed"})`);
      }
    }),
    Button({
      leadingIconURI: "icon.download",
      controlSize: "xl",
      action: () => downloadText("Hey, now", "file.txt"),
    }),
    Spacer(core.space.s7),
    TextLabel(result, { padding: core.space.s2, font: core.font.body_small, minWidth: ch(12) })
  );
}
