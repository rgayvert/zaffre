import { View, core, pct, VStack, TextLabel, TextBox, TextInput, em, ZStyleSheet, TextBoxOptions } from "zaffre";
import { RegExModel } from "./RegExModel";

export function RegExExample(): View {
 
  ZStyleSheet.default.addRule(".regex-highlight", "border: 1px solid red");

  const model = new RegExModel();

  const textOptions: TextBoxOptions = {
    editable: true,
    padding: core.space.s3,
    border: core.border.thin,
    height: em(10),
    width: pct(100),
    overflowY: "scroll",
    pastePlainText: true,
    plainText: model.plainSourceText,
    whiteSpace: "pre-wrap",
  };
  return VStack({ alignItems: "start", width: pct(80), justifyContent: "start" }).append(
    TextLabel("Text:"),
    TextBox(model.sourceText, textOptions),
    TextLabel("Pattern:"),
    TextInput(model.pattern, { border: core.border.thin, width: pct(100) }),
    TextLabel("Groups:"),
    TextBox(model.groupText, { whiteSpace: "pre-wrap", border: core.border.thin, width: pct(100), height: em(6) })
  );
}
