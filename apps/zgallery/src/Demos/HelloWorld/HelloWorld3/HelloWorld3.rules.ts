import { space, zcolor, ch, px } from "zaffre";
import { HelloModel3 } from "./HelloModel3";

export const helloWorld3Rules = (model: HelloModel3) => ({
  "container": {
    maxWidth: ch(120),
    gap: space.s4,
  },
  "SVG": {
    bounds: model.svgBounds,
    width: () => px(model.svgBounds.get().width),
  },
  "SVGCircle": {
    stroke: zcolor.black,
    strokeWidth: 1,
    fill: zcolor.red,
    r: model.radius,
    c: model.center,
  },
  "SVGText": {
    dominantBaseline: "middle",
    textAnchor: "middle",
    pointerEvents: "none",
    fontSize: () => px(model.currentText.length),
    point: model.center,
  },
});
