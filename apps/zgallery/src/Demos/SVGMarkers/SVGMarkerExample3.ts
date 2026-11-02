import { SVG, SVGPath, px, rect2D, SVGContextCircle, SVGDefs, zcolor } from "zaffre";

export const SVGMarkerExample3 = () => {
  const circle = SVGContextCircle();
  const defs = SVGDefs().append(circle);
  return SVG({ bounds: rect2D(0, 0, 50, 50), width: px(600), height: px(200) }).append(
    defs,
    SVGPath({
      d: "M 10,10 30,10 h 10",
      stroke: zcolor.black,
      marker: circle,
    }),
    SVGPath({
        d: "M 10,20 30,20 h 10",
        stroke: zcolor.blue,
        fill: zcolor.red,
        marker: circle,
      }),
      SVGPath({
        d: "M 10,30 30,30 h 10",
        stroke: zcolor.red,
        fill: "none",
        marker: circle,
      }),
      SVGPath({
        d: "M 10,40 30,40 h 10",
        stroke: zcolor.gray,
        fill: zcolor.blue,
        strokeWidth: 1.5,
        marker: circle,
      })
  );
}
