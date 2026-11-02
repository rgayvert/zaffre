import { VStack, TextInput, TextLabel, atom } from "zaffre";
import { hw1rules } from "./HelloWorld1.rules";

export const HelloWorld1 = () => {
  const text = atom("Hello World");
  return VStack({ rules: hw1rules(text), cls: "container" }).append(
    TextInput(text),
    TextLabel(text)
  );
};

// export const HelloWorld1 = () => {
//   const spec = new HW1();
//   return VStack(spec).append(
//     TextInput(spec.text),
//     TextLabel(spec.text)
//   );
// };