import { core, LabelBox, Slider, SegmentedButton, VStack, View } from "zaffre";
import { ThemeColorsModel } from "./ThemeColorsModel";
import { galleryThemeNames } from "../../Model/GalleryThemes";

export function ThemeSelector(model: ThemeColorsModel): View {
  return VStack({ alignItems: "center", gap: core.space.s5 }).append(
    LabelBox("Theme:").append(
      SegmentedButton(model.currentThemeName, galleryThemeNames, {
        rounding: core.rounding.none,
        font: core.font.body_small,
        tooltips: galleryThemeNames.map((themeName) => `Switch to ${themeName} theme`),
        ripple: true,
      })
    ),
    LabelBox("Mode:").append(
      SegmentedButton(model.colorMode, model.colorModeNames, {
        rounding: core.rounding.none,
        font: core.font.body_small,
      })
    ),
    LabelBox("Contrast:").append(Slider(model.contrastRatio.get(), { minVal: 1.0, maxVal: 21.0 }))
  );
}