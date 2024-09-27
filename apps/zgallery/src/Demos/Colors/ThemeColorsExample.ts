import { ch, core, HDivider, HDividerOptions, Page, atom, TextLabelOptions, ViewList } from "zaffre";
import { Spacer, TextLabel, VStack, View } from "zaffre";
import { ThemeColorsModel } from "./ThemeColorsModel";
import { ThemeColorsGrid } from "./ThemeColorsGrid";
import { ThemeTonalPalette } from "./ThemeTonalPalette";
import { ThemeSelector } from "./ThemeSelector";

export function ThemeColorsExample(): View {
  const model = new ThemeColorsModel();
  const palettes = atom(() => Object.entries(model.themePalettes.get()));

  const textLabelOptions: TextLabelOptions = {
    marginTop: core.space.s6,
    font: core.font.title_medium,
    color: core.color.primary
  };
  const dividerOptions: HDividerOptions = { paddingBlock: core.space.s1 };
  const pageOptions = {
    maxWidth: ch(120),
    theme: model.currentTheme,
    componentName: "ColorDemo",
  };

  return Page(pageOptions).append(
    VStack({ alignItems: "center", gap: core.space.s5, padding: core.space.s4 }).append(
      Spacer(core.space.s3),
      ThemeSelector(model),
      Spacer(core.space.s5),
      TextLabel("Theme Colors", textLabelOptions),
      HDivider(dividerOptions),
      ThemeColorsGrid(model.themeColorTokens),
      Spacer(core.space.s5),
      TextLabel("Tonal Palettes", textLabelOptions),
      HDivider(dividerOptions),
      ViewList(
        palettes,
        (item) => item,
        ([name, palette]) => ThemeTonalPalette(palette, name)
      )
    )
  );
}
