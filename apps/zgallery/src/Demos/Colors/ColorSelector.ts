import { Atom, TextInput, Color, atom, ch, core, borderToken, em, messageAtom, pct, Spacer } from "zaffre";
import { TextLabel, HStack, LabelBox, Slider, VStack, Box, CenterBox, ColorInput, View } from "zaffre";
import { ColorSelectorModel } from "./ColorSelectorModel";

/**
 * ColorSelector: a component that allows a color to be selected using either RGB sliders, a color picker, or a hex value.
 * 
 */

export function ColorSelector(currentColor: Atom<Color>, storageKey: string): View {
  const model = new ColorSelectorModel(currentColor, storageKey);
  // trigger to display the color picker when the box is clicked
  const pickTrigger = messageAtom(true);

  // sliders for RGB values
  function RGBSlider(label: string, value: Atom<number>): View {
    return LabelBox(label).append(Slider(value, { minVal: 0, maxVal: 255, round: true, width: ch(15), radiusRatio: 20 }));
  }

  // feedback for hex input
  const hexIsValid = atom(() => model.isValidHexColor(model.currentRawHex.get()));
  const validBorder = core.border.thin;
  const invalidBorder = borderToken({ color: core.color.error, width: em(0.1) });

  return HStack({ gap: core.space.s2, model: model, name: "ColorSelector" }).append(
    CenterBox({ height: em(8), width: em(8) }).append(
      Box({
        position: "absolute",
        border: core.border.thin,
        padding: core.space.s2,
        background: model.colorToken,
        height: pct(100),
        width: pct(100),
        clickAction: () => pickTrigger.set(true),
      }).append(ColorInput(model.currentRGBColor, { 
        pickTrigger: pickTrigger, 
        opacity: 0,
      }))
    ),
    VStack({ width: ch(32) }).append(
      RGBSlider("R", model.red),
      RGBSlider("G", model.green),
      RGBSlider("B", model.blue),
      Spacer(em(1)),
      HStack({ gap: core.space.s3 }).append(
        TextLabel("Hex:"),
        TextInput(model.currentRawHex, {
          textTransform: "lowercase",
          width: ch(8),
          border: atom(() => (hexIsValid.get() ? validBorder : invalidBorder)),
          valid: hexIsValid,
        }),
        TextLabel("✗", { hidden: atom(() => hexIsValid.get()) })
      )
    )
  );
}
