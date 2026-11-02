import { addClass, Box, CenteredText, zutil } from "zaffre";
import { HoverAnimationModel } from "./HoverAnimationModel";
import { rules } from "./HoverAnimation1.rules";

// Adapted from developer.mozilla.org

export const HoverAnimation1 = () => {
  const model = new HoverAnimationModel();
  const options = addClass({}, "HoverAnimation1", rules(model));

  return Box(options).append(
    ...zutil.sequence(0, 6).map((i) => CenteredText(`${i + 1}`, { cls: `faceLabel[${i}]`}))
  );
}
