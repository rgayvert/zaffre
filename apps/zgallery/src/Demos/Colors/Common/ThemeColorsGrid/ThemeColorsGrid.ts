import { zutil, ColorToken, Grid, addClass, GridOptions } from "zaffre";
import { CenteredText, Atom, ViewList } from "zaffre";

// A Grid with 4 columns which shows labeled color patches for the given color tokens

export interface ThemeColorsGridOptions extends GridOptions {}

export const ThemeColorsGrid = (tokens: Atom<ColorToken[]>, inOptions: ThemeColorsGridOptions = {}) => {
  const options = addClass(inOptions, "ThemeColorsGrid");
  options.model = tokens;

  const ThemeColorLabel = (token: ColorToken) => {
    return CenteredText(zutil.camelCaseToWords(`${token.key}`).toLowerCase(), {
      background: token,
      color: token.contrast,
    });
  };
  return Grid(options).append(
    ViewList(
      tokens,
      (token) => token.key,
      (token) => ThemeColorLabel(token)
    )
  );
};
