import { ch, core, HDivider, HDividerOptions, Page, ColorToken, Theme, TextLabelOptions, atom } from "zaffre";
import { Spacer, TextLabel, VStack, View } from "zaffre";
import { ThemeColorsGrid } from "./ThemeColorsGrid";

export function OtherColorsExample(): View {
  const theme = Theme.current;
  const allColorTokens = Object.values(core.color);
  const semanticColorKeys = theme.semanticColorKeys();
  const semanticColorTokens = allColorTokens.filter((token) => semanticColorKeys.includes(token.key));
  const fixedColorKeys = theme.fixedColorKeys();
  const fixedColorTokens = allColorTokens.filter((token) => fixedColorKeys.includes(token.key));

  const textLabelOptions: TextLabelOptions = {
    marginTop: core.space.s6,
    font: core.font.title_medium,
    color: core.color.primary,
  };
  const dividerOptions: HDividerOptions = { paddingBlock: core.space.s1 };

  function Section(title: string, colors: ColorToken[]): View {
    return VStack({ alignItems: "center" }).append(
      TextLabel(title, textLabelOptions),
      HDivider(dividerOptions),
      ThemeColorsGrid(atom(colors)),
      Spacer(core.space.s5)
    );
  }
  return Page({ maxWidth: ch(120) }).append(
    VStack({ alignItems: "center" }).append(
      Section("Semantic Colors", semanticColorTokens),
      Section("Fixed Colors", fixedColorTokens)
    )
  );
}
