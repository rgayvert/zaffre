import { ColorMode, ColorToken, atom, core } from "zaffre";
import { CoreKeyColors, tonalPalettes } from "zaffre";
import { createGalleryThemeNamed, galleryThemeKey } from "../../Model/GalleryThemes";

export class ThemeColorsModel {
  // list of tone levels to show in a tonal palette
  public palettePoints = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reverse();

  public currentThemeName = atom<galleryThemeKey>("green", {
    action: (val) => this.currentTheme.set(createGalleryThemeNamed(val, this.colorMode.get())),
  });

  public currentTheme = atom(createGalleryThemeNamed("green"), {
    action: (theme) => theme.setColorMode(this.colorMode.get()),
  });
  public contrastRatio = atom(() => this.currentTheme.get().colorContrastRatio);

  public themePalettes = atom(() =>
    tonalPalettes(new Map(Array.from(this.currentTheme.get().keyColors())) as CoreKeyColors)
  );

  public colorMode = atom(ColorMode.light, { action: () => this.toggleColorMode() });
  public colorModeNames = [ColorMode.light, ColorMode.dark];
  toggleColorMode(): void {
    this.currentTheme.get().toggleColorMode();
  }

  // we want to show color tokens that are not fixed or semantic
  public allColorTokens(): ColorToken[] {
    return Object.values(core.color);
  }
  public themeColorTokensForCurrentTheme(): ColorToken[] {
    const fixedColorKeys = this.currentTheme.get().fixedColorKeys();
    const semanticColorKeys = this.currentTheme.get().semanticColorKeys();
    return this.allColorTokens().filter(
      (token) => !fixedColorKeys.includes(token.key) && !semanticColorKeys.includes(token.key)
    );
  }
  themeColorTokens = atom(() => this.themeColorTokensForCurrentTheme());
}
