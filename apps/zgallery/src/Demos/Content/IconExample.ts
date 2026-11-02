import { HStack, Icon, LabelBox, zcolor, zborder, zspace } from "zaffre";

export const IconExample = () => {
  return HStack({ alignItems: "center", gap: zspace.s6 }).append(
    LabelBox("Plain:").append(Icon("icon.shopping-cart")),
    LabelBox("Colored:").append(Icon("icon.shopping-cart", { color: zcolor.red })),
    LabelBox("Outlined:").append(Icon("icon.shopping-cart", { border: zborder.thin })),
    LabelBox("File:").append(Icon("icon.home", { border: zborder.thin, verticalAlign: "bottom" }))
  );
}
