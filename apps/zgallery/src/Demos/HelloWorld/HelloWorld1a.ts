import { core, atom, zutil, View, VStack, TextInput, TextLabel, Spacer } from "zaffre";
import "./HelloWorldBundles";

export function HelloWorld1a(): View {
  const text = atom("Hello World");
  return VStack("vstack1").append(
    TextInput(text, "textinput1"),
    Spacer(core.space.s6),
    TextLabel(text, {
      bundles: ["textlabel1"],
      opacity: atom(() => zutil.clamp(text.get().length / 20, 0, 1)),
    })
  );
} 