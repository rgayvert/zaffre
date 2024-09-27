import { core, View,TextLabel, VStack, em, ch, Button, StackOptions, Icon, Spacer } from "zaffre";

export function VStackExample(): View {
  const options: StackOptions = {
    width: ch(30),
    height: em(8),
    gap: core.space.s3,
    border: core.border.thin,
    padding: core.space.s3,
    alignItems: "center",
    justifyContent: "start",
  };

  return VStack(options).append(
    TextLabel("Text label"), 
    Button({ label: "Button" }),
    Spacer(core.space.s5), 
    Icon("icon.shopping-cart"), 
  );
}
