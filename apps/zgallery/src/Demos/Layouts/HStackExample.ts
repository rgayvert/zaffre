import { core, View, TextLabel, em, ch, Button, StackOptions, Icon, Spacer, HStack } from "zaffre";

export function HStackExample(): View {
  const options: StackOptions = {
    minWidth: ch(40),
    height: em(4),
    gap: core.space.s3,
    border: core.border.thin,
    padding: core.space.s3,
    alignItems: "center",
    justifyContent: "center",
  };

  return HStack(options).append(
    TextLabel("Text label"), 
    Button({ label: "Button" }), 
    Spacer(1), 
    Icon("icon.shopping-cart")
  );
}
