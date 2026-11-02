import { SVG, SVGCircle, SVGText, TextInput, VStack } from "zaffre";
import { HelloModel3 } from "./HelloModel3";
import { helloWorld3Rules } from "./HelloWorld3.rules";

export const HelloWorld3 = () => {
  const model = new HelloModel3();

  return VStack({ rules: helloWorld3Rules(model), cls: "container" }).append(
    TextInput(model.text),
    SVG().append(
      SVGCircle(),
      SVGText(model.textLengthString)
    )
  );
}
