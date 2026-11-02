import { rect2D, SVG, SVGCircle, SVGRectangle, SVGText, pct, px, zcolor } from "zaffre";

export const SVGExample1 = () => {
  return SVG({ bounds: rect2D(0, 0, 300, 200), width: pct(50) }).append(
    SVGRectangle({ width: "100%", height: "100%", fill: zcolor.red }),
    SVGCircle({ cx: 150, cy: 100, r: 80, fill: zcolor.green }),
    SVGText("SVG", { x: 150, y: 125, fontSize: px(60), textAnchor: "middle", fill: zcolor.white })
  );
}
 