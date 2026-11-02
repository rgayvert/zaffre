import { TextLabel, Box } from "zaffre";
import { helloWorld0Rules } from "./HelloWorld0.rules";

export const HelloWorld0 = () => {
  return Box({ rules: helloWorld0Rules, cls: "box" }).append(
    TextLabel("Hello World")
  );
}
