import { px, SVG, SVGCircle, SVGEllipse, zcolor } from "zaffre";
import { SVGRectangle, SVGLine, SVGPolyline, SVGPolygon, SVGPath } from "zaffre";

export const SVGExample2 = () => {
  const black5 = { stroke: zcolor.black, fill: zcolor.transparent, strokeWidth: 5 };
  const red5 = { stroke: zcolor.red, fill: zcolor.transparent, strokeWidth: 5 };
  const orange5 = { stroke: zcolor.orange, fill: zcolor.transparent, strokeWidth: 5 };
  const green5 = { stroke: zcolor.green, fill: zcolor.transparent, strokeWidth: 5 };
  const blue5 = { fill: zcolor.transparent, stroke: zcolor.blue, strokeWidth: 5 };
  return SVG({ width: px(200), height: px(250) }).append(
    SVGRectangle({ x: 10, y: 10, width: 30, height: 30, ...black5 }),
    SVGRectangle({ x: 60, y: 10, rx: 10, ry: 10, width: 30, height: 30, ...black5 }),
    SVGCircle({ cx: 25, cy: 75, r: 20, ...red5 }),
    SVGEllipse({ cx: 75, cy: 75, rx: 20, ry: 5, ...red5 }),
    SVGLine({ x1: 10, x2: 50, y1: 110, y2: 150, stroke: zcolor.orange, strokeWidth: 5 }),
    SVGPolyline({ points: "60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145", ...orange5 }),
    SVGPolygon({ points: "50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180", ...green5 }),
    SVGPath({ d: "M20,230 Q40,205 50,230 T90,230", ...blue5 })
  );
}
