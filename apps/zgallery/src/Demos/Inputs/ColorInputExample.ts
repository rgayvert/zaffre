import { atom, View, ColorInput, Color } from "zaffre";
import { ValueBox } from "./ValueBox";

export function ColorInputExample(): View {
  const color = atom(Color.fromHex("#3388DD"));
  return ValueBox(
    atom(() => `Color(${color.get().asHex()})`),
    undefined,
    ColorInput(color)
  );
}
