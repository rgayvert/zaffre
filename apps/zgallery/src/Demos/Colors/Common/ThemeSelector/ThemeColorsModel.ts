import { ColorMode, ColorToken, atom, pickList, zcolor } from "zaffre";
import { CoreKeyColors, tonalPalettes } from "zaffre";
import { createGalleryThemeNamed, GalleryThemeKey, galleryThemeNames } from ":gallery";

export class ThemeColorsModel {
  // list of tone levels to show in a tonal palette
  palettePoints = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reverse();

  currentThemeName = atom<GalleryThemeKey>("green", {
    action: (val) => this.currentTheme.set(createGalleryThemeNamed(val, this.colorMode.get())),
  });
  themeNameList = pickList(this.currentThemeName, galleryThemeNames);

  currentTheme = atom(createGalleryThemeNamed("green"), {
    action: (theme) => theme.setColorMode(this.colorMode.get()),
  });
  contrastRatio = atom(() => this.currentTheme.get().colorContrastRatio);

  themePalettes = atom(() =>
    tonalPalettes(new Map(Array.from(this.currentTheme.get().keyColors())) as CoreKeyColors)
  );

  colorMode = atom(ColorMode.light, { action: () => this.toggleColorMode() });
  colorModeNames = [ColorMode.light, ColorMode.dark];
  colorModeList = pickList(this.colorMode, this.colorModeNames);
  toggleColorMode(): void {
    this.currentTheme.get().toggleColorMode();
  }

  // we want to show color tokens that are not fixed or semantic
  allColorTokens(): ColorToken[] {
    return Object.values(zcolor).filter((val) => val instanceof ColorToken);
  }
  themeColorTokensForCurrentTheme(): ColorToken[] {
    const fixedColorKeys = this.currentTheme.get().fixedColorKeys();
    const semanticColorKeys = this.currentTheme.get().semanticColorKeys();
    return this.allColorTokens().filter(
      (token) => !fixedColorKeys.includes(token.key) && !semanticColorKeys.includes(token.key)
    );
  }
  themeColorTokens = atom(() => this.themeColorTokensForCurrentTheme());
}
