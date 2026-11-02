import { VStack, TextLabel, ViewList, Button, HStack } from "zaffre";
import { HelloModel4 } from "./HelloModel4";
import { helloWorld4Rules } from "./HelloWorld4.rules";

export const HelloWorld4 = () => {
  const model = new HelloModel4();

  return VStack({ rules: helloWorld4Rules(model), cls: "container" }).append(
    HStack({ cls: "row1" }).append(
      ViewList(
        model.values,
        (value) => value,
        (value) => TextLabel(`${value}`)
      )
    ),
    HStack({ cls: "row2" }).append(
      Button({ cls: "add-button" }),
      Button({ cls: "remove-button" }),
    )
  );
}
