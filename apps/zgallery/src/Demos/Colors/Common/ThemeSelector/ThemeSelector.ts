import { LabelBox, Slider, SegmentedButton, VStack, addClass, GridOptions } from "zaffre";
import { galleryThemeNames } from ":gallery";
import { ThemeColorsModel } from "./ThemeColorsModel";

export interface ThemeSelectorOptions extends GridOptions {}

export const ThemeSelector = (model: ThemeColorsModel, inOptions: ThemeSelectorOptions = {}) => {
  const options = addClass(inOptions, "ThemeSelector");
  options.model = model;

  return VStack(options).append(
    LabelBox("Theme:").append(
      SegmentedButton(model.themeNameList, {
        tooltips: galleryThemeNames.map((themeName) => `Switch to ${themeName} theme`),
      })
    ),
    LabelBox("Mode:").append(SegmentedButton(model.colorModeList)),
    LabelBox("Contrast:").append(Slider(model.contrastRatio.get(), {}))
  );
};
