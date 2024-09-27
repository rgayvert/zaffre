import { ColorToken, Color, atom, colorFromHex, colorToken, hexToRGBA, rgbToHex, zutil } from "zaffre";
import { Atom, LocalData } from "zaffre";

export class ColorSelectorModel {

  currentHex: Atom<string>
  currentRawHex: Atom<string>; 
  currentHexRGB: Atom<string>; 
  colorToken: Atom<ColorToken>;
  red: Atom<number>;
  green: Atom<number>;
  blue: Atom<number>;
  hexLen: number;

  constructor(public currentRGBColor: Atom<Color>, public storageKey: string) {
    // NB: currentHex is the single-source-of-truth for this model. All other values derive from it, and all changes are made to it.
    const defaultHex = "#5588ee";
    this.hexLen = 7;
    this.currentHex = LocalData.instance.addAtom(this.storageKey, defaultHex); 
    this.currentRawHex = atom(this.currentHex.get(), { action: (val) => this.isValidHexColor(val) && this.setCurrentHexAndComps(val) });
    this.currentHexRGB = atom(this.currentHex.get().slice(0, this.hexLen), { action: () => this.hexRGBChanged() });
    currentRGBColor.set(colorFromHex(this.currentHex.get()));
    currentRGBColor.addAction((color) => this.currentHex.set(color.asHex()));

    this.colorToken = atom(() => colorToken({ color: this.currentRGBColor.get() }));
    this.red = atom(() => this.currentRGBColor.get().comp[0], { action: (val) => this.hexChanged(this.currentHex, 0, val) });
    this.green = atom(() => this.currentRGBColor.get().comp[1], { action: (val) => this.hexChanged(this.currentHex, 1, val) });
    this.blue = atom(() => this.currentRGBColor.get().comp[2], { action: (val) => this.hexChanged(this.currentHex, 2, val) });
  }

  isValidHexColor(hex: string): boolean {
    return hex.length === this.hexLen && !isNaN(Number('0x' + hex.substring(1)));
  }

  setCurrentHex(rgbaHex: string): void {
    const val = rgbaHex.substring(0, this.hexLen);
    this.currentHex.set(val);
    this.currentRawHex.set(val);
    this.currentRGBColor.set(colorFromHex(this.currentHex.get()));
  }

  setCurrentHexAndComps(rgbaHex: string): void {
    this.setCurrentHex(rgbaHex);
    const comp = zutil.sequence(0, 4).map((i) => parseInt(rgbaHex.substring(i * 2 + 1, i * 2 + 3), 16));
    this.red.set(comp[0]);
    this.green.set(comp[1]);
    this.blue.set(comp[2]);
  }

  // color picker change
  hexRGBChanged(): void {
    this.setCurrentHex(rgbToHex(hexToRGBA(this.currentHexRGB.get())));
  }

  hexChanged(hex: Atom<string>, compIndex: number, value: number): void {
    const rgba = hexToRGBA(hex.get());
    rgba[compIndex] = Math.round(value);
    hex.set(rgbToHex(rgba));
    this.setCurrentHex(hex.get());
  }

}
