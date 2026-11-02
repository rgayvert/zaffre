import { VStack, TextLabel } from "zaffre";
import { helloRules } from "./HelloView.rules";

export const Hello = () => {
  return VStack({ rules: helloRules }).append(
    TextLabel("Hello World")
  );
}

