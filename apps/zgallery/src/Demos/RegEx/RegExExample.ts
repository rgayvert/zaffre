import { pct, VStack, TextLabel, TextBox, TextInput, em, ZStyleSheet, TextBoxOptions, zborder, zspace } from "zaffre";
import { RegExModel } from "./RegExModel";

export const RegExExample = () => {
  ZStyleSheet.default.addRule(".regex-highlight", "border: 1px solid red");

  const model = new RegExModel();

  const textOptions: TextBoxOptions = {
    editable: true,
    padding: zspace.s3,
    border: zborder.thin,
    height: em(10),
    width: pct(100),
    overflowY: "scroll",
    pastePlainText: true,
    plainText: model.plainSourceText,
    whiteSpace: "pre-wrap",
  };
  return VStack({ alignItems: "start", width: pct(80), justifyContent: "start" }).append(
    TextLabel("TextLabel:"),
    TextBox(model.sourceText, textOptions),
    TextLabel("Pattern:"),
    TextInput(model.pattern, { border: zborder.thin, width: pct(100) }),
    TextLabel("Groups:"),
    TextBox(model.groupText, { whiteSpace: "pre-wrap", border: zborder.thin, width: pct(100), height: em(6) })
  );
};
