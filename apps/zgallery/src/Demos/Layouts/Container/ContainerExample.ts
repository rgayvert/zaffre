import { Box, Container, atom, View, HStack, VStack, Button, addClass } from "zaffre";
import { containerExampleRules } from "./ContainerExample.rules";

export const ContainerExample = () => {
  const options = addClass({}, "container-top", containerExampleRules);
  const child = atom<View | undefined>(undefined);
  const box1 = Box({ cls: "box1" });
  const box2 = Box({ cls: "box2" });

  return HStack(options).append(
    Container(child),
    VStack({ cls: "button-stack" }).append(
      Button({ cls: "button", label: "Blue", action: () => child.set(box1) }),
      Button({ cls: "button", label: "Red", action: () => child.set(box2) }),
    ),
  );
};
