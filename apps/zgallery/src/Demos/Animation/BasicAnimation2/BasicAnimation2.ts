import { addClass, TextBox } from "zaffre";
import { BasicModel2 } from "./BasicModel2";
import { rules } from "./BasicAnimation2.rules";

// Adapted from developer.mozilla.org

export const BasicAnimation2 = () => {
  const model = new BasicModel2();
  const options = addClass({}, "BasicAnimation2", rules(model) );
  return TextBox("spinning_newspaper", options);
}
