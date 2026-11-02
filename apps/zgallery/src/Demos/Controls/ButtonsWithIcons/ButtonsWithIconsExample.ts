import { HStack, Button, TextLabel, Spacer } from "zaffre";
import { buttonsWithIconsExampleRules } from "./ButtonsWithIconsExample.rules";
import { ButtonsWithIconsModel } from "./ButtonsWithIconsModel";

export const ButtonsWithIconsExample = () => {
  const model = new ButtonsWithIconsModel();

  return HStack({ rules: buttonsWithIconsExampleRules(model), cls: "container" }).append(
    Button({ cls: "button1" }),
    Button({ cls: "button2" }),
    Button({ cls: "button3" }),
    Button({ cls: "button4" }),
    Button({ cls: "button5" }),
    Spacer("s7"),
    TextLabel(model.result)
  );
};
