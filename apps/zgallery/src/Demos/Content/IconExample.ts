import { core, View, HStack, Icon, LabelBox } from "zaffre";

export function IconExample(): View {
  return HStack({ alignItems: "center", gap: core.space.s6 }).append(
    LabelBox("Plain:").append(Icon("icon.shopping-cart")),
    LabelBox("Colored:").append(Icon("icon.shopping-cart", { color: core.color.red })),
    LabelBox("Outlined:").append(Icon("icon.shopping-cart", { border: core.border.thin })),
    LabelBox("File:").append(Icon("icon.home"))
  );
}
