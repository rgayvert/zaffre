import { zspace, px, zcolor } from "zaffre";
import { SpriteAnimationModel } from "./SpriteAnimationModel";

export const rules = (model: SpriteAnimationModel) => {
  return {
    "SpriteAnimation1": {
      gap: zspace.s8,
    },
    "sprite-container": {
      width: px(200),
      height: px(40),
      background: zcolor.black,
      padding: px(4),
    },
    "Sprite": {
      transform: () => model.pacman.transformPxLocation(),
    },
    "Button": {
      label: "start",
      action: () => model.start(),
      disabled: () => model.isRunning,
    },
  };
};
