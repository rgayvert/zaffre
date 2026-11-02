import { em, Atom, LabelBox, zborder, zspace } from "zaffre";
import { TextLabel, HStack, NumberInput } from "zaffre";
import { SevenTempConverterModel } from "./SevenTempConverterModel";

export const SevenTempConverter = () => {
  const model = new SevenTempConverterModel();

  const TemperatureInput = (label: string, val: Atom<number>) => {
    return LabelBox(label, { side: "right" }).append(
      NumberInput(val, {
        border: zborder.thin,
        decimalPlaces: 2,
        width: em(4),
      })
    );
  }
  return HStack({ gap: zspace.s5 }).append(
    TemperatureInput("Celcius", model.celsius),
    TextLabel(" = "),
    TemperatureInput("Fahrenheit", model.fahrenheit)
  );
}
