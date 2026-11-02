import { Box, HStack, Button, addClass } from "zaffre";
import { FrameBasedAnimationModel } from "./FrameBasedAnimationModel";
import { rules } from "./FrameBasedAnimation1.rules";

export const FrameBasedAnimationExample = () => {
  const model = new FrameBasedAnimationModel();
  const options = addClass({}, "FrameBased1", rules(model));

  return HStack(options).append(
    Box({ cls: "thing-container" }).append(
      Box({ cls: "thing1 thing" }),
      Box({ cls: "thing2 thing" }),
    ),
    Button()
  );
}
