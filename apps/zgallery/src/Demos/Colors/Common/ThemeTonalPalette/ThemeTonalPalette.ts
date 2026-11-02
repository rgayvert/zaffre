import { atom, pct, ch, flexToken, zutil, CenteredText, ViewList, zcolor, zborder, zfont } from "zaffre";
import { colorToken, StackOptions, Spacer, HStack, TextLabel, TonalPalette } from "zaffre";

export const ThemeTonalPalette = (palette: TonalPalette, label: string, options: StackOptions = {}) => {
  const palettePoints = zutil.sequence(0, 11, 10);

  const PaletteColorLabel = (tone: number) => {
    const token = atom(() => colorToken({ color: palette.tone(tone) }));
    return CenteredText(`${tone}`, {
      flex: flexToken({ grow: 1 }),
      background: token,
      color: () => tone < 50 ? zcolor.white : zcolor.black,
      minWidth: ch(4),
      font: zfont.body_medium,
      border: zborder.thin,
      name: "PaletteColorLabel",
    });
  }
  return HStack({ width: pct(100) }).append(
    TextLabel(label, { width: ch(8) }),
    Spacer("s4"),
    ViewList(
      palettePoints,
      (pct) => pct,
      (pt) => PaletteColorLabel(pt)
    )
  );
}
