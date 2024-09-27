import { SVG, View, core, SVGImageBox, px } from "zaffre";

export function SVGExample6(): View {
  return SVG({ width: px(300), height: px(200), border: core.border.thin }).append(SVGImageBox("image.flowers", { width: 300, height: 200 }));
}
