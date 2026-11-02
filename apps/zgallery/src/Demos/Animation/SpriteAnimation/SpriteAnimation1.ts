import { Box, HStack, Sprite, Button, addClass } from "zaffre";
import { SpriteAnimationModel } from "./SpriteAnimationModel";
import { rules } from "./SpriteAnimation1.rules";

export const SpriteAnimation1 = () => {
  const model = new SpriteAnimationModel();
  const options = addClass({}, "SpriteAnimation1", rules(model));

  return HStack(options).append(
    Box({ cls: "sprite-container" }).append(Sprite(model.pacman.spriteName, model.spriteImageURI, model.spriteMap)),
    Button(),
  );
};
