import { SVG, SVGLine, SVGPath, View, core, px, rect2D, SVGArrowhead, SVGDefs } from "zaffre";

export function SVGMarkerExample1(): View {
  const arrow = SVGArrowhead();
  const defs = SVGDefs().append(arrow);

  return SVG({ bounds: rect2D(0, 0, 300, 100), width: px(600), height: px(200) }).append(
    defs,
    SVGLine({
      x1: 10,
      y1: 10,
      x2: 90,
      y2: 90,
      stroke: core.color.black,
      markerEnd: arrow, 
    }),
    SVGPath({
      d: "M 110 10 C 120 20, 130 20, 140 10 C 150 0, 160 0, 170 10 C 180 20, 190 20, 200 10",
      stroke: core.color.black,
      fill: "none",
      markerStart: arrow,
      markerMid: arrow,
      markerEnd: arrow
    })
  );
}
