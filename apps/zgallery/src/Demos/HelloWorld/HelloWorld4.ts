import { View, VStack, TextLabel, ViewList, atom } from "zaffre";
import { Button, HStack } from "zaffre";
import { HelloModel4 } from "./HelloModel4";

export function HelloWorld4(): View {
  const model = new HelloModel4();

  return VStack("gap-5").append(
    HStack(["gap-4", "pad-4"]).append(
      ViewList(
        model.values,
        (value) => value,
        (value) => TextLabel(`${value}`, ["f-tm", "b1", "pad-2"])
      )
    ),
    HStack("gap-5").append(
      Button({ label: "Add", action: () => model.addValue() }),
      Button({ 
        label: "Remove", 
        disabled: atom(() => model.values.length === 1),
        action: () => model.removeValue() 
      })
    )
  );
}
