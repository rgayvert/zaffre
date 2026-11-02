import { atom, ColorInput, Color } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const ColorInputExample = () =>  {
  const color = atom(Color.fromHex("#3388DD"));
  return InputExampleBox(
    atom(() => `Color(${color.get().asHex()})`),
    undefined,
    ColorInput(color)
  );
}
