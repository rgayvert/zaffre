import { SVG, View, core, px, rect2D, SVGPolyline, SVGArrowhead, SVGDot, SVGDefs } from "zaffre";

export function SVGMarkerExample2(): View {
  const arrow = SVGArrowhead({ name: "arrow" });
  const dot = SVGDot({ fill: core.color.red });
  const defs = SVGDefs().append(arrow, dot);

  return SVG({ bounds: rect2D(0, 0, 100, 100), width: px(200), height: px(200) }).append(
    defs,
    SVGPolyline({
      points: "10,10 10,90 90,90",
      fill: "none",
      stroke: core.color.black,
      markerStart: arrow,
      markerEnd: arrow,
    }),
    SVGPolyline({
      points: "15,80 29,50 43,60 57,30 71,40 85,15",
      fill: "none",
      stroke: core.color.gray,
      marker: dot,
    })
  );
}
