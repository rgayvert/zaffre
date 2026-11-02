import { zspace, px, zrounding, zcolor } from "zaffre";
import { FrameBasedAnimationModel } from "./FrameBasedAnimationModel";

const thing = {
  position: "absolute",
  width: px(20),
  height: px(20),
};

export const rules = (model: FrameBasedAnimationModel) => {
  return {
    "FrameBased1": {
      gap: zspace.s8,
    },
    "thing": {
      position: "absolute",
      width: px(20),
      height: px(20),
    },
    "thing-container": {
      width: px(200),
      height: px(20),
    },
    "thing1": {
      //...thing,
      rounding: zrounding.none,
      background: zcolor.primary,
      transform: () => `translate(${model.thing1.location.get().x}px, ${model.thing1.location.get().y}px)`,
    },
    "thing2": {
      //...thing,
      rounding: zrounding.circle,
      background: zcolor.red,
      transform: () => `translate(${model.thing2.location.get().x}px, ${model.thing2.location.get().y}px)`,
    },
    "Button": {
      label: "start",
      action: () => model.start(),
      disabled: () => model.isRunning,
    },
  };
};
