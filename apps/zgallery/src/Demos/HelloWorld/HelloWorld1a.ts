import { atom, zutil, View, VStack, TextInput, TextLabel, defineBundle, } from "zaffre";
import { StackOptions, core, TextInputOptions, TextLabelOptions } from "zaffre";

defineBundle<StackOptions>("space6", {
  padding: core.space.s6,
  gap: core.space.s6,
});
defineBundle<TextInputOptions>("textinput1", {
  rounding: core.rounding.pill,      
  border: core.border.thin,
  textAlign: "center",
  font: core.font.display_medium,
  placeholder: "Enter some text",
});
defineBundle<TextLabelOptions>("textlabel1", {
  color: core.color.primary,
  font: core.font.headline_medium,
});


export function HelloWorld1a(): View {
  const text = atom("Hello World");

  return VStack("space6").append(
    TextInput(text, "textinput1"),
    TextLabel(text, {
      bundles: ["textlabel1"],
      opacity: atom(() => zutil.clamp(text.get().length / 20, 0, 1)),
    })
  );
}
