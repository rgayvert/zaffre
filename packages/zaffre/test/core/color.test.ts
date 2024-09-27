import { expect, test, describe } from "vitest";
import {
  convertColor,
  convertColorToRGB,
  colorFromHex,
  colorHSL,
  colorLAB,
  colorLCH,
  colorRGB,
  createColor,
  hexToRGBA,
  rgbToLAB,
} from ":uifoundation";

describe("colors", () => {
  const color1 = colorRGB(50, 100, 150);
  const color2 = colorLCH(41.2, 32.32, 269.7, 0.5);
  const color3 = colorLAB(41.2, -0.16, -32.32, 0.5);
  const color4 = colorHSL(209.99, 49.99, 39.21, 0.5);

  test("color1", () => {
    expect(color1.toCSS()).toEqual("rgb(50.00 100.00 150.00 / 1.00)");
    expect(color2.toCSS()).toEqual("lch(41.20% 32.32% 269.70 / 0.50)");
    expect(color3.toCSS()).toEqual("lab(41.20% -0.16 -32.32 / 0.50)");
    expect(color4.toCSS()).toEqual("hsl(209.99 49.99% 39.21% / 0.50)");
  });
});

describe("color conversions", () => {
  const hex1 = "#326496";
  const rgba1 = hexToRGBA(hex1);
  const color1 = colorFromHex(hex1, "rgb");
  const color2 = convertColor(color1, "lab");
  const color3 = convertColorToRGB(color2);

  const color3a = colorRGB(45, 23, 11);
  const color3b = convertColor(color3a, "hsl");
  const color3c = convertColor(color1, "hsl");

  const color3d = colorRGB(221, 19, 18);
  const color3e = convertColor(color3d, "hsl");
  const color3f = colorRGB(221, 18, 19);
  const color3g = convertColor(color3f, "hsl");

  const color4 = convertColor(color1, "hsl");
  const color4a = colorHSL(210, 50, 39.22);
  const color4b = convertColor(color4, "rgb");

  const color5 = convertColor(color1, "lch");
  const color5b = convertColor(color5, "rgb");

  const color6 = convertColor(color1, "oklab");
  const color6b = convertColor(color6, "rgb");

  test("color1", () => {
    expect(rgba1).toEqual([50, 100, 150, 255]);
    expect(color1.toCSS()).toEqual("rgb(50.00 100.00 150.00 / 1.00)");
    expect(color2.toCSS()).toEqual("lab(41.21% -0.16 -32.33 / 1.00)");
    expect(color3.toCSS()).toEqual("rgb(50.00 100.00 150.00 / 1.00)");

    expect(color3a.toCSS()).toEqual("rgb(45.00 23.00 11.00 / 1.00)");
    expect(color3b.toCSS()).toEqual("hsl(21.18 60.71% 10.98% / 1.00)");
    expect(color3c.toCSS()).toEqual("hsl(210.00 50.00% 39.22% / 1.00)");
    expect(color3e.toCSS()).toEqual("hsl(0.30 84.94% 46.86% / 1.00)");
    expect(color3g.toCSS()).toEqual("hsl(359.70 84.94% 46.86% / 1.00)");

    expect(color4.toCSS()).toEqual("hsl(210.00 50.00% 39.22% / 1.00)");
    expect(color4a.toCSS()).toEqual("hsl(210.00 50.00% 39.22% / 1.00)");
    expect(color4b.toCSS()).toEqual("rgb(50.00 100.00 150.00 / 1.00)");

    expect(color5.toCSS()).toEqual("lch(41.21% 32.33% 269.71 / 1.00)");
    expect(color5b.toCSS()).toEqual("rgb(50.00 100.00 150.00 / 1.00)");

    expect(color6.toCSS()).toEqual("oklab(0.49 -0.03 -0.09 / 1.00)");
    expect(color6b.toCSS()).toEqual("rgb(50.00 100.00 150.00 / 1.00)");
  });
});
