import { Box, HStack, StackOptions, Switch, View, beforeAddedToDOM, core, em } from "zaffre";
import { ComponentAnimationModel1 } from "./ComponentAnimationModel1";

export function ComponentAnimationExample1(): View {
  const options: StackOptions = {
    gap: core.space.s6
  }
  // turn off the animation when this view becomes invisible
  beforeAddedToDOM(options, (view: View): void => {
    view.addIntersectionAction((visible) => !visible && model.running.set(false));
  });
  const model = new ComponentAnimationModel1();
  return HStack(options).append(
    Box({
      animations: [model.animation],         // the animation
      rounding: core.rounding.r4,
      background: core.color.blue,
      border: core.border.thin,
      height: em(4),
      transformOrigin: "center",
      width: em(4),
    }),
    Switch(model.running, { controlSize: "xs" }) // controls when the animation runs
  );
}
