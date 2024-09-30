import { SVG, View, core, SVGPath, SVGGroup, SVGUse, SVGStrokeLinejoin, px, rect2D, point2D, Point2D } from "zaffre";

export function SVGExample4(): View {
  const black = { stroke: core.color.black, fill: core.color.transparent };
  const pink = { stroke: core.color.pink, strokeWidth: 0.1, fill: core.color.transparent };
  const tail = " a2,2 0,0,0 2,-3 a3,3 0 0 1 2,3.5";
  const pathDetail: { loc: Point2D, join: SVGStrokeLinejoin }[] = [
    { loc: point2D(1, 5), join: "miter" },
    { loc: point2D(7, 5), join: "round" },
    { loc: point2D(13, 5), join: "bevel" },
    { loc: point2D(3, 11), join: "miter-clip" },
    { loc: point2D(9, 11), join: "arcs" },
  ];

  function PathWithJoin(loc: Point2D, join: SVGStrokeLinejoin): View {
    return SVGPath({ d: `M${loc.x},${loc.y} ${tail}`, strokeLinejoin: join, ...black });
  }
  const highlight = SVGGroup().append(SVGPath({ d: `M1,5 ${tail}`, ...pink }));
  const offsets = [point2D(6, 0), point2D(12, 0), point2D(2, 6), point2D(8, 6) ];

  return SVG({ bounds: rect2D(0, 0, 18, 12), width: px(300), height: px(200), border: core.border.thin }).append(
    ...pathDetail.map((detail) => PathWithJoin(detail.loc, detail.join)),
    highlight,
    ...offsets.map((offset) => SVGUse(highlight, offset))
  );
}
