import { Button, LabelBox, Spacer, TextInput, TextLabel, Switch, VStack, HStack } from "zaffre";
import { HelloModel2 } from "./HelloModel2";
import { helloWorld2Rules } from "./HelloWorld2.rules";

export const HelloWorld2 = () => {
  const model = new HelloModel2();
  return VStack({ rules: helloWorld2Rules(model), cls: "container" }).append(
    Spacer(1),
    TextInput(model.text),
    TextLabel(model.text, { cls: "sofia-text" }),
    HStack({ cls: "controls"}).append(
      Button(),
      LabelBox("Disabled").append(Switch(model.disabled)),
      LabelBox("Set on Input").append(Switch(model.setOnInput)),
    ),
  );
}
