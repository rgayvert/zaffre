import { rect2D, SVG, SVGCircle, SVGText, TextInput, VStack, View, atom, core, px } from "zaffre";
import { HelloModel3 } from "./HelloModel3";

export function HelloWorld3(): View {
  const model = new HelloModel3();
  return VStack({ alignItems: "center", padding: core.space.s6 }).append(
    TextInput(model.text, {
      rounding: core.rounding.r3,
      border: core.border.thin,
      textAlign: "center",
      font: core.font.display_medium,
      placeholder: "Enter some text",
    }),
    SVG({ bounds: rect2D(0, 0, 100, 100), width: px(250) }).append(
      SVGCircle({
        cx: 50,
        cy: 50,
        r: model.textLength,
        stroke: core.color.black,
        strokeWidth: 1,
        fill: core.color.red,
      }),
      SVGText(model.textLengthString, {
        x: 50,
        y: 50,
        fontSize: atom(() => px(model.currentText.length)),
        dominantBaseline: "middle",
        textAnchor: "middle",
        pointerEvents: "none",
      })
    )
  );
}
