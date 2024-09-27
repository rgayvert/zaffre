import { SVG, View, core, px, rect2D, SVGPolyline, SVGArrowhead, SVGDot } from "zaffre";

export function SVGMarkerExample2(): View {
  return SVG({ bounds: rect2D(0, 0, 100, 100), width: px(200), height: px(200) }).append(
    SVGArrowhead("arrow"),
    SVGDot("dot", { fill: core.color.red }),
    SVGPolyline({
      points: "10,10 10,90 90,90",
      fill: "none",
      stroke: core.color.black,
      markerStart: "url(#arrow)",
      markerEnd: "url(#arrow)",
    }),
    SVGPolyline({
      points: "15,80 29,50 43,60 57,30 71,40 85,15",
      fill: "none",
      stroke: core.color.gray,
      markerStart: "url(#dot)",
      markerMid: "url(#dot)",
      markerEnd: "url(#dot)",
    })
  );
}
