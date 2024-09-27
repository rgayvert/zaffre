import { SVG, View, core, SVGDefs, SVGLinearGradient, SVGStop, SVGRectangle, px, pct, rect2D } from "zaffre";

export function SVGExample5(): View {
  return SVG({ width: px(120), height: px(240), border: core.border.thin }).append(
    SVGDefs().append(
      SVGLinearGradient({ id: "Gradient1" }).append(
        SVGStop({ stopColor: core.color.red, offset: pct(0) }),
        SVGStop({ stopColor: core.color.black, stopOpacity: 0, offset: pct(50) }),
        SVGStop({ stopColor: core.color.blue, offset: pct(100) })
      ), 
      SVGLinearGradient({ id: "Gradient2", gradientTransform: "rotate(90)" }).append(
        SVGStop({ stopColor: core.color.green, offset: pct(0) }),
        SVGStop({ stopColor: core.color.black, stopOpacity: 0, offset: pct(50) }),
        SVGStop({ stopColor: core.color.blue, offset: pct(100) })
      )
    ),
    SVGRectangle({ rect: rect2D(10, 10, 100, 100), rx: 15, ry: 15, fill: "url(#Gradient1)" }),
    SVGRectangle({ rect: rect2D(10, 120, 100, 100), rx: 15, ry: 15, fill: "url(#Gradient2)" })
  );
}
