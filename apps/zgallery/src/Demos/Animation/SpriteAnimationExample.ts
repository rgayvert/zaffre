import { View, Box, core, HStack, atom, px, Sprite, Button } from "zaffre";
import { SpriteAnimationModel } from "./SpriteAnimationModel";

export function SpriteAnimationExample(): View {
  const model = new SpriteAnimationModel();

  return HStack({ gap: core.space.s8 }).append(
    Box({ width: px(200), height: px(40), background: core.color.black, padding: px(4) }).append(
      Sprite(model.pacman.spriteName, model.spriteImageURI, model.spriteMap, {
        transform: atom(() => model.pacman.transformPxLocation()),
      })
    ),
    Button({
      label: "start",
      action: () => model.start(),
      disabled: atom(() => model.isRunning),
    })
  );
}
