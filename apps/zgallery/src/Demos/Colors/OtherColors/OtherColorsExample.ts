import { Page, ColorToken } from "zaffre";
import { atom, zcolor, getCurrentTheme } from "zaffre";
import { Spacer, TextLabel, VStack } from "zaffre";
import { ThemeColorsGrid } from "../Common";
import { otherColorsExampleRules } from "./OtherColorsExample.rules";

export const OtherColorsExample = () => {
  const theme = getCurrentTheme();
  const allColorTokens = Object.values(zcolor).filter((val) => val instanceof ColorToken);
  const semanticColorKeys = theme.semanticColorKeys();
  const semanticColorTokens = allColorTokens.filter((token) => semanticColorKeys.includes(token.key));
  const fixedColorKeys = theme.fixedColorKeys();
  const fixedColorTokens = allColorTokens.filter((token) => fixedColorKeys.includes(token.key));
 
  const Section = (title: string, colors: ColorToken[]) => {
    return VStack().append(
      TextLabel(title),
      Spacer("s2"),
      ThemeColorsGrid(atom(colors)),
      Spacer("s7")
    );
  };
  return Page({ rules: otherColorsExampleRules }).append(
    VStack().append(
      Section("Semantic Colors", semanticColorTokens),
      Section("Fixed Colors", fixedColorTokens)
    )
  );
};
