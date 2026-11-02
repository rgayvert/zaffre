import { ch,HDivider, Page, atom, LabelOptions, ViewList, zcolor, zfont, zspace } from "zaffre";
import { Spacer, TextLabel, VStack } from "zaffre";
import { ThemeColorsGrid, ThemeSelector, ThemeTonalPalette, ThemeColorsModel } from "../Common";

export const ThemeColorsExample = () => {
  const model = new ThemeColorsModel();
  const palettes = atom(() => Object.entries(model.themePalettes.get()));

  const labelOptions: LabelOptions = {
    marginTop: zspace.s6,
    font: zfont.title_medium,
    color: zcolor.primary
  };
  const pageOptions = {
    maxWidth: ch(120), 
    theme: model.currentTheme,
    name: "ColorDemo",
  };

  return Page(pageOptions).append(
    VStack({ alignItems: "center", gap: zspace.s4, padding: zspace.s4 }).append(
      Spacer("s3"),
      ThemeSelector(model),
      Spacer("s4"),
      TextLabel("Theme Colors", labelOptions),
      HDivider(),
      ThemeColorsGrid(model.themeColorTokens),
      Spacer("s4"),
      TextLabel("Tonal Palettes", labelOptions),
      HDivider(),
      ViewList(
        palettes,
        (item, index) => index,
        ([name, palette]) => ThemeTonalPalette(palette, name)
      )
    )
  );
}
