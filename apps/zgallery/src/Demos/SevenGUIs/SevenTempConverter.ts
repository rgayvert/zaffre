import { core, em, Atom, LabelBox } from "zaffre";
import { View, TextLabel, CenterBox, HStack, NumberInput } from "zaffre";
import { SevenTempConverterModel } from "./SevenTempConverterModel";

export function SevenTempConverter(): View {
  const model = new SevenTempConverterModel();

  function TemperatureInput(label: string, val: Atom<number>): View {
    return LabelBox(label, { side: "right" }).append(
      NumberInput(val, {
        border: core.border.thin,
        decimalPlaces: 2,
        width: em(4),
      })
    );
  }
  return HStack({ gap: core.space.s5 }).append(
    TemperatureInput("Celcius", model.celsius),
    TextLabel(" = "),
    TemperatureInput("Fahrenheit", model.fahrenheit)
  );
}
