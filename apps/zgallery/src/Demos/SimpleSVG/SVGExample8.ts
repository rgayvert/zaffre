import { rect2D, SVG, SVGRectangle, SVGText, pct, px } from "zaffre";
import { zcolor, ColorToken, SVGGroup, zborder, SVGArrowhead, SVGLine, SVGDefs } from "zaffre";

const Box2 = (
  x: number,
  y: number,
  label1: string,
  label2: string,
  bgColor: ColorToken,
  strokeColor: ColorToken,
  textColor: ColorToken,
  strokeWidth: number,
) => {
  return SVGGroup({ x: x + 20, y: y + 20 }).append(
    SVGRectangle({ width: 200, height: 100, x: 0, y: 0, fill: bgColor, stroke: strokeColor, strokeWidth }),
    SVGText(label1, { x: 100, y: 40, fontSize: px(30), textAnchor: "middle", fill: textColor }),
    SVGText(label2, { x: 100, y: 80, fontSize: px(30), textAnchor: "middle", fill: textColor }),
  );
};

const arrow = SVGArrowhead({ scale: 2.0 });
const defs = SVGDefs().append(arrow);

const Arrow2 = (x1: number, y1: number, x2: number, y2: number, dashed = false) => {
  return SVGLine({
    x1: x1 + 20,
    y1: y1 + 20,
    x2: x2 + 20,
    y2: y2 + 20,
    stroke: zcolor.black,
    markerEnd: arrow,
    strokeDasharray: dashed ? "5 5" : "",
  });
};

export const SVGExample8 = () => {
  const purple = zcolor.rgb("97288a");
  const lightBlue = zcolor.rgb("0090ff");
  const blueFill = zcolor.rgb("c1e1f8");
  const blueBorder = zcolor.rgb("20d6e3");
  const lightGreen = zcolor.rgb("3fd048");
  const greenFill = zcolor.rgb("d1f0c6");
  const greenBorder = zcolor.rgb("7ed460");
  const white = zcolor.rgb("FFF");
  const black = zcolor.rgb("000");
  const x1 = 0;
  const x2 = x1 + 300;
  const x3 = x2 + 300;
  const x4 = x3 + 300;
  const x5 = x4 + 300;
  const y1 = 0;
  const y2 = y1 + 50;
  const y3 = y2 + 75;
  const y4 = y3 + 75;
  const y5 = y4 + 125;

  return SVG({ bounds: rect2D(0, 0, 1440, 470), width: pct(90), border: zborder.thin }).append(
    defs,
    SVGRectangle({
      width: "100%",
      height: "100%",
      fill: zcolor.rgb("F8F8F8"),
    }),
    Box2(x1, y3, "1st Serves", "100", white, purple, purple, 4),

    Box2(x2, y2, "1st In", "25", white, lightBlue, lightBlue, 1),
    Arrow2(x1 + 200, y3 + 50, x2 - 5, y2 + 50, true),
    Arrow2(x2, y2 + 50, x2 + 200 - 5, y2 + 50, true),
    Box2(x2, y4, "1st Fault", "75", blueFill, blueBorder, black, 4),
    Arrow2(x1 + 200, y3 + 50, x2 - 5, y4 + 50),

    Box2(x3, y1, "1st Win | In", "22", blueFill, blueBorder, black, 4),
    Arrow2(x2 + 200, y2 + 50, x3 - 5, y1 + 50),
    Box2(x3, y3, "1st Lose | In", "3", blueFill, blueBorder, black, 4),
    Arrow2(x2 + 200, y2 + 50, x3 - 5, y3 + 50),

    Arrow2(x2 + 200, y4 + 50, x3 - 5, y5),
    Arrow2(x3, y5, x3 + 200 - 5, y5),
    Arrow2(x3 + 200, y5, x4 - 5, y4 + 50, true),
    Arrow2(x3 + 200, y5, x4 - 5, y5 + 50),

    Box2(x4, y4, "2nd In", "72", white, greenBorder, lightGreen, 1),
    Box2(x4, y5, "2nd Fault", "3", greenFill, greenBorder, black, 4),

    Arrow2(x4 + 200, y4 + 50, x5 - 5, y3 + 50),
    Arrow2(x4 + 200, y4 + 50, x5 - 5, y4 + 125),

    Box2(x5, y3, "2nd In | Win", "39", greenFill, greenBorder, black, 4),
    Box2(x5, y4 + 75, "2nd Lose | In", "33", greenFill, greenBorder, black, 4),
  );
};
