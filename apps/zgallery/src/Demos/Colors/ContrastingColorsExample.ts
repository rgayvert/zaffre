import { atom, core, TextLabel, VStack, View, Button, DropDownButton, ch, Spacer } from "zaffre";
import { relativeLuminance, zutil, HStack, Atom, Color, zstring, ColorToken, FontToken } from "zaffre";
import { ColorSelector } from "./ColorSelector";
import { ContrastingColorsModel } from "./ContrastingColorsModel";

// #LuminanceSelector: color selector that also display luminance
function LuminanceSelector(color: Atom<Color>, title: string): View {
  const luminance = atom(() => `Relative Luminance: ${zutil.printRoundedTo(relativeLuminance(color.get()), 4)}`);

  return VStack({ gap: core.space.s7, padding: core.space.s6, name: "ContrastingColors" }).append(
    HStack({ gap: core.space.s8 }).append(
      TextLabel(title, { font: core.font.title_medium }),
      ColorSelector(color, `contrastingcolors_${title.toLowerCase()}`)
    ),
    TextLabel(luminance, { font: core.font.title_medium }),
  );
}
// A simple borderless label
function ColorBox(label: zstring, foreground: Atom<ColorToken>, font: FontToken): View {
  return TextLabel(label, {
    font: font,
    color: foreground,
  });
}

export function ContrastingColorsExample(): View {

  const model = new ContrastingColorsModel();

  return VStack({ gap: core.space.s5, padding: core.space.s6, name: "ContrastingColors" }).append(
    LuminanceSelector(model.bgColor, "Background"),
    LuminanceSelector(model.fgColor, "Foreground"),
    HStack({ gap: core.space.s5 }).append(
      // the current contrast level
      TextLabel(model.text, { font: core.font.title_medium }),
      HStack({ padding: core.space.s5, gap: core.space.s7, border: core.border.thin, background: model.bgToken }).append(
        // display same text at different sizes
        ColorBox("Large", model.fgToken, core.font.headline_medium),
        ColorBox("Medium", model.fgToken, core.font.body_medium),
        ColorBox("Small", model.fgToken, core.font.label_small)
      )
    ),
    Spacer(core.space.s3),
    // constrols to automatically adjust the fg/bs to attempt to achieve the target contrast level
    HStack({ gap: core.space.s5 }).append(
      TextLabel("Target Contrast:", { font: core.font.title_medium }),
      DropDownButton(model.targetContrast, model.targetChoices, { width: ch(10) }),
      Button({ label: "Adjust BG", action: () => model.adjustBackground(), rounding: core.rounding.pill }), 
      Button({ label: "Adjust FG", action: () => model.adjustForeground(), rounding: core.rounding.pill })  
    )
  );
}
