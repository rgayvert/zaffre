import { SVG, View, core, SVGPath, SVGGroup, SVGUse, SVGStrokeLinejoin, px, rect2D } from "zaffre";

export function SVGExample4(): View {
  const black = { stroke: core.color.black, fill: core.color.transparent };
  const pink = { stroke: core.color.pink, strokeWidth: 0.1, fill: core.color.transparent };
  const tail = " a2,2 0,0,0 2,-3 a3,3 0 0 1 2,3.5";

  function PathWithJoin(loc: string, join: SVGStrokeLinejoin): View {
    return SVGPath({ d: `M${loc} ${tail}`, strokeLinejoin: join, ...black });
  }
  return SVG({ bounds: rect2D(0, 0, 18, 12), width: px(300), height: px(200), border: core.border.thin }).append(
    PathWithJoin("1,5", "miter"),
    PathWithJoin("7,5", "round"),
    PathWithJoin("13,5", "bevel"),
    PathWithJoin("3,11", "miter-clip"),
    PathWithJoin("9,11", "arcs"),
    SVGGroup({ id: "highlight" }).append(SVGPath({ d: `M1,5 ${tail}`, ...pink })),
    SVGUse({ href: "#highlight", x: 6 }),
    SVGUse({ href: "#highlight", x: 12 }),
    SVGUse({ href: "#highlight", x: 2, y: 6 }),
    SVGUse({ href: "#highlight", x: 8, y: 6 })
  );
}
