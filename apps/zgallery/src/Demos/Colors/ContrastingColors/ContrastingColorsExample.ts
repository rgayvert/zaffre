import { atom, TextLabel, VStack, Button, Spacer, DropDownButton, Grid, OptionRules } from "zaffre";
import { relativeLuminance, zutil, HStack, Atom, Color } from "zaffre";
import { ColorSelector } from "../Common";
import { ContrastingColorsModel } from "./ContrastingColorsModel";
import { contrastingColorsRules, luminanceRules2 } from "./ContrastingColorsExample.rules";

// #LuminanceSelector: color selector that also display luminance
const LuminanceSelector = (color: Atom<Color>, title: string, selectorRules?: OptionRules) => {
  const luminance = atom(() => `Relative Luminance: ${zutil.printRoundedTo(relativeLuminance(color.get()), 4)}`);

  return VStack({ cls: "luminance-selector" }).append(
    HStack({ cls: "gap-s4" }).append(
      TextLabel(title),
      ColorSelector(color, {
        storageKey: `contrastingcolors_${title.toLowerCase()}`,
        rules: selectorRules
      })
    ),
    TextLabel(luminance)
  );
};

export const ContrastingColorsExample = () => {
  const model = new ContrastingColorsModel();

  return Grid({ rules: contrastingColorsRules(model) }).append(
    LuminanceSelector(model.bgColor, "Background", ),
    LuminanceSelector(model.fgColor, "Foreground", luminanceRules2),
    VStack().append(
      HStack().append(
        // the current contrast level
        TextLabel(model.text),
        HStack({ cls: "color-box-row" }).append(
          // display the same text at different sizes
          TextLabel("Large", { cls: "color-box font-hm" }),
          TextLabel("Medium", { cls: "color-box font-bm" }),
          TextLabel("Small", { cls: "color-box font-ls" })
        )
      ),
      Spacer("s3"),
      // controls to automatically adjust the fg/bs to attempt to achieve the target contrast level
      HStack().append(
        TextLabel("Target Contrast:"),
        DropDownButton(model.targetContrastList),
        Button({ cls: "adjust-bg" }),
        Button({ cls: "adjust-fg" })
      )
    )
  );
};
