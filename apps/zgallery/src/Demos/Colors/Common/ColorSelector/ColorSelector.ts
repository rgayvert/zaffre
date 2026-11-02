import { Atom, TextInput, Color, Spacer, addClass, StackOptions } from "zaffre";
import { TextLabel, HStack, LabelBox, Slider, VStack, Box, CenterBox, ColorInput } from "zaffre";
import { ColorSelectorModel } from "./ColorSelectorModel";
import { rules } from "./ColorSelector.rules";

/**
 * ColorSelector: a component that allows a color to be selected using either RGB sliders,
 * a color picker, or a hex value.
 *
 */

export interface ColorSelectorOptions extends StackOptions {
  storageKey?: string;
}

export const ColorSelector = (currentColor: Atom<Color>, inOptions: ColorSelectorOptions = {}) => {
  const model = new ColorSelectorModel(currentColor, inOptions.storageKey);
  const options = addClass(inOptions, "ColorSelector", rules(model));
  options.model = model;
  
  const LabeledSlider = (label: string, value: Atom<number>) => {
    return LabelBox(label).append(Slider(value));
  };

  return HStack(options).append(
    CenterBox().append(Box({ cls: "ColorSelector_ColorBox" }).append(ColorInput(model.currentRGBColor))),
    VStack().append(
      LabeledSlider("R", model.red),
      LabeledSlider("G", model.green),
      LabeledSlider("B", model.blue),
      Spacer("s2"),
      HStack().append(TextLabel("Hex:"), TextInput(model.currentRawHex), TextLabel("✗", { cls: "ColorSelector_InvalidLabel" }))
    )
  );
};
