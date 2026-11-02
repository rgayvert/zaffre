import { Box, HStack, StackOptions, Switch, addClass, beforeAddedToDOM } from "zaffre";
import { BasicModel1 } from "./BasicModel1";
import { rules } from "./BasicAnimation1.rules";

/*
 * Note: intersection action turns off the animation when this view becomes invisible
 * (e.g., by scrolling; switching the page automatically interrupts running animations)

 */

export const BasicAnimation1 = (inOptions: StackOptions = {}) => {
  const model = new BasicModel1();
  const options = addClass(inOptions, "BasicAnimation1", rules(model));
  options.model = model;

  beforeAddedToDOM(options, (view): void => {
    view.addIntersectionAction((visible) => !visible && model.running.set(false));
  });
  
  return HStack(options).append(
    Box({ cls: "container", animations: [model.animation] }),
    Switch(model.running),
  );
};
