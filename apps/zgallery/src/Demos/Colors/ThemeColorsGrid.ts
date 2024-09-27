import { core, zutil, Box, ColorToken, Grid, View, pct, ch, CenteredTextLabel, Atom, ViewList } from "zaffre";

// A Grid with 4 columns which shows color palettes for the principle colors used in the current theme

export function ThemeColorsGrid(tokens: Atom<ColorToken[]>): View {

  function ThemeColorLabel(token: ColorToken): View {
    return CenteredTextLabel(zutil.camelCaseToWords(`${token.key}`).toLowerCase(), {
      background: token, 
      color: token.contrast, 
      minWidth: ch(17), 
      minHeight: ch(6), 
      font: core.font.body_small,
      border: core.border.thin,
    });
  }

  return Box({ width: pct(100) }).append(
    Grid({ nrows: 0, ncolumns: 4, gap: core.space.s2 }).append(
      ViewList(
        tokens, // atom(() => tokens),
        (token) => token.key,
        (token) => ThemeColorLabel(token)
      )
    )
  );
}