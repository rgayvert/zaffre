import { SVG, SVGLine, SVGPath, px, rect2D, SVGArrowhead, SVGDefs, zcolor } from "zaffre";

export const SVGMarkerExample1 = () => {
  const arrow = SVGArrowhead();
  const defs = SVGDefs().append(arrow);

  return SVG({ bounds: rect2D(0, 0, 300, 100), width: px(600), height: px(200) }).append(
    defs,
    SVGLine({
      x1: 10,
      y1: 10,
      x2: 90,
      y2: 90,
      stroke: zcolor.black,
      markerEnd: arrow, 
    }),
    SVGPath({
      d: "M 110 10 C 120 20, 130 20, 140 10 C 150 0, 160 0, 170 10 C 180 20, 190 20, 200 10",
      stroke: zcolor.black,
      fill: "none",
      markerStart: arrow,
      markerMid: arrow,
      markerEnd: arrow
    })
  );
}
