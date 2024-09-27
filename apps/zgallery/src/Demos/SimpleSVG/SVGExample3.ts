import { SVG, View, core, SVGPath, point2D, SVGLine, SVGCircle, px } from "zaffre";

export function SVGExample3(): View {
  const paths = [
    "M 10 10 C 20 20, 40 20, 50 10",
    "M 70 10 C 70 20, 110 20, 110 10",
    "M 130 10 C 120 20, 180 20, 170 10",
    "M 10 60 C 20 80, 40 80, 50 60",
    "M 70 60 C 70 80, 110 80, 110 60",
    "M 130 60 C 120 80, 180 80, 170 60",
    "M 10 110 C 20 140, 40 140, 50 110",
    "M 70 110 C 70 140, 110 140, 110 110",
    "M 130 110 C 120 140, 180 140, 170 110",
  ];
  const blue2 = { stroke: core.color.black, fill: core.color.transparent, strokeWidth: 1.5 };
  const red2 = { stroke: core.color.red, strokeWidth: 1.5, strokeLinecap: "square" } as const;
  const redCircle = { r: 2.5, fill: core.color.red };

  function CurveWithControlPoints(path: string): View[] {
    const parts = path.split(" ");
    const startPt = point2D(parseInt(parts[1]), parseInt(parts[2]));
    const control1 = point2D(parseInt(parts[4]), parseInt(parts[5]));
    const control2 = point2D(parseInt(parts[6]), parseInt(parts[7]));
    const endPt = point2D(parseInt(parts[8]), parseInt(parts[9]));
    return [
      SVGPath({ d: path, ...blue2 }),
      SVGCircle({ c: startPt, ...redCircle }),
      SVGLine({ pt1: startPt, pt2: control1, ...red2 }),
      SVGCircle({ c: control1, ...redCircle }),
      SVGCircle({ c: control2, ...redCircle }),
      SVGLine({ pt1: endPt, pt2: control2, ...red2 }),
      SVGCircle({ c: endPt, ...redCircle }),
    ];
  }
  return SVG({ width: px(190), height: px(160), border: core.border.thin }).append(
    ...paths.map((path) => CurveWithControlPoints(path)).flat()
  );
}
