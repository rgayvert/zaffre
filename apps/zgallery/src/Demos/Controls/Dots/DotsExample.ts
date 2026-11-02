import { addClass, Dots, zutil } from "zaffre";
import { dotsExampleRules } from "./DotsExample.rules";

export const DotsExample = () => {
  const options = addClass({}, "Dots1", dotsExampleRules);

  const randomVals = () => zutil.sequence(0, 5).map((i) => zutil.random(0, 1) < 0.5);
  const values = randomVals();

  return Dots(values, options);
};
