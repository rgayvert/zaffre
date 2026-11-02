import { SVG, px, rect2D, SVGPolyline, SVGArrowhead, SVGDot, SVGDefs, zcolor } from "zaffre";

export const SVGMarkerExample2 = () => {
  const arrow = SVGArrowhead({ name: "arrow" });
  const dot = SVGDot({ fill: zcolor.red });
  const defs = SVGDefs().append(arrow, dot);

  return SVG({ bounds: rect2D(0, 0, 100, 100), width: px(200), height: px(200) }).append(
    defs,
    SVGPolyline({
      points: "10,10 10,90 90,90",
      fill: "none",
      stroke: zcolor.black,
      markerStart: arrow,
      markerEnd: arrow,
    }),
    SVGPolyline({
      points: "15,80 29,50 43,60 57,30 71,40 85,15",
      fill: "none",
      stroke: zcolor.gray,
      marker: dot,
    })
  );
}
