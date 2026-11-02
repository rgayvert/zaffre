import { HStack, Button, atom } from "zaffre";
import { VDivider, DownButton, TextLabel, Spacer } from "zaffre";
import { simpleButtonExampleRules } from "./SimpleButtonExample.rules";
import { SimpleButtonExampleModel } from "./SimpleButtonExampleModel";

export const SimpleButtonExample = () => {
  const model = new SimpleButtonExampleModel();

  return HStack({ rules: simpleButtonExampleRules(model) }).append(
    Button({ cls: "button1" }),
    Button({ cls: "button2" }),
    Button({ cls: "button3" }),
    VDivider(),
    Button({ cls: "button4" }),
    Button({ cls: "button5", disabled: atom(true) }),
    DownButton(),
    TextLabel(() => `${model.downCount.get()}`, { cls: "down-label" }),
    Spacer("s7"),
    TextLabel(model.result, { cls: "result-label" })
  );
};
