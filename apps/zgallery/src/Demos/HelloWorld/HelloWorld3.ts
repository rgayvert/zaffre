import { rect2D, SVG, SVGCircle, SVGText, TextInput, VStack, View, atom, core, px, point2D } from "zaffre";
import { HelloModel3 } from "./HelloModel3";

export function HelloWorld3(): View {
  const model = new HelloModel3();
  return VStack({ alignItems: "center", padding: core.space.s6 }).append(
    TextInput(model.text, {
      bundles: ["r3", "b1", "f-dm"],
      textAlign: "center",
      placeholder: "Enter some text",
    }),
    SVG({ bounds: rect2D(0, 0, 100, 100), width: px(250) }).append(
      SVGCircle({
        c: point2D(50, 50),
        r: model.textLength,
        stroke: core.color.black,
        strokeWidth: 1,
        fill: core.color.red,
      }),
      SVGText(model.textLengthString, {
        point: point2D(50, 50),
        fontSize: atom(() => px(model.currentText.length)),
        dominantBaseline: "middle",
        textAnchor: "middle",
        pointerEvents: "none",
      })
    )
  );
}
