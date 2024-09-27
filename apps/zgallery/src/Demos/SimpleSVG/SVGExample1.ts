import { rect2D, SVG, SVGCircle, SVGRectangle, SVGText, View, core, pct, px } from "zaffre";

export function SVGExample1(): View {
  return SVG({ bounds: rect2D(0, 0, 300, 200), width: pct(50) }).append(
    SVGRectangle({ width: "100%", height: "100%", fill: core.color.red }),
    SVGCircle({ cx: 150, cy: 100, r: 80, fill: core.color.green }),
    SVGText("SVG", { x: 150, y: 125, fontSize: px(60), textAnchor: "middle", fill: core.color.white })
  );
}
