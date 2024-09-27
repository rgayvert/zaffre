import { atom, core, pct, ch, flexToken, zutil, CenteredTextLabel, ViewList } from "zaffre";
import { colorToken  } from "zaffre";
import { StackOptions, Spacer } from "zaffre";
import { HStack, TextLabel, View } from "zaffre";
import { TonalPalette } from "zaffre";

export function ThemeTonalPalette(palette: TonalPalette, label: string, options: StackOptions = {}): View {
  const palettePoints = zutil.sequence(0, 11, 10);

  function PaletteColorLabel(tone: number): View {
    const token = atom(() => colorToken({ color: palette.tone(tone) }));
    return CenteredTextLabel(`${tone}`, {
      flex: flexToken({ grow: 1 }),
      background: token,
      color: atom(() => tone < 50 ? core.color.white : core.color.black),
      minWidth: ch(4),
      font: core.font.body_medium,
      border: core.border.thin,
      componentName: "PaletteColorLabel",
    });
  }
  return HStack({ width: pct(100) }).append(
    TextLabel(label, { width: ch(8) }),
    Spacer(core.space.s4),
    ViewList(
      palettePoints,
      (pct) => pct,
      (pt) => PaletteColorLabel(pt)
    )
  );
}
