import { atom, zutil, View, VStack, TextInput, TextLabel } from "zaffre";

export function HelloWorld1b(): View {
  const text = atom("Hello World");

  return VStack(["pad-6", "gap-6"]).append(
    TextInput(text, {
        bundles: ["pill", "b1", "ta-c", "f-dm"],
        placeholder: "Enter some text",
    }),
    TextLabel(text, {
      bundles: ["c-primary", "f-hm"],
      opacity: atom(() => zutil.clamp(text.get().length / 20, 0, 1)),
    })
  );
}
