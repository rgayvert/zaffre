import { core, View, VStack, TextLabel, ViewList, atom } from "zaffre";
import { Button, HStack } from "zaffre";
import { HelloModel4 } from "./HelloModel4";
import "./HelloWorldBundles";


export function HelloWorld4a(): View {
  const model = new HelloModel4();

  return VStack("vstack4").append(
    HStack("hstack4a").append(
      ViewList(
        model.values,
        (value) => value,
        (value) => TextLabel(`${value}`, "label4")
      )
    ),
    HStack("hstack4b").append(
      Button({ label: "Add", action: () => model.addValue() }),
      Button({ 
        label: "Remove", 
        disabled: atom(() => model.values.length === 1),
        action: () => model.removeValue() 
      })
    )
  );
}
