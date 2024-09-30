import { SVG, SVGPath, View, core, px, rect2D, SVGContextCircle, SVGDefs } from "zaffre";

export function SVGMarkerExample3(): View {
  const circle = SVGContextCircle();
  const defs = SVGDefs().append(circle);
  return SVG({ bounds: rect2D(0, 0, 50, 50), width: px(600), height: px(200) }).append(
    defs,
    SVGPath({
      d: "M 10,10 30,10 h 10",
      stroke: core.color.black,
      marker: circle,
    }),
    SVGPath({
        d: "M 10,20 30,20 h 10",
        stroke: core.color.blue,
        fill: core.color.red,
        marker: circle,
      }),
      SVGPath({
        d: "M 10,30 30,30 h 10",
        stroke: core.color.red,
        fill: "none",
        marker: circle,
      }),
      SVGPath({
        d: "M 10,40 30,40 h 10",
        stroke: core.color.gray,
        fill: core.color.blue,
        strokeWidth: 1.5,
        marker: circle,
      })
  );
}
