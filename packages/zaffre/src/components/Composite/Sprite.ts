import { rect2D, Rect2D, Rect4, zget, Atom, resolveURI } from ":foundation";
import { backgroundToken, urlToken, px, addClass } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Sprite is a box that displays a varying rectangular region of an image. This is commonly
// used in sprite animation, where the image associated with an object varies over time.
//
// The image is specified using a URI, which is used to create a background image to apply to the box.
// A SpriteMap must be supplied. This contains a mapping of string names to rectangles.
// To change the sprite image in the box, you simply change the value of spriteName.
//
// TODO: figure out if there is any value to a lazy option
//

export type SpriteMap = Map<string, Rect4>;

export interface SpriteOptions extends BoxOptions {
  lazy?: boolean;
}

export const Sprite = (spriteName: Atom<string>, uri: string, spriteMap: SpriteMap, inOptions: SpriteOptions = {}) => {
  const spriteOptions = addClass(inOptions, "Sprite");

  const url = resolveURI(uri);

  const r = (): Rect2D => {
    return rect2D(...(spriteMap.get(zget(spriteName)) || [0, 0, 0, 0]));
  };
  return Box({
    ...spriteOptions,
    width: () => px(r().width),
    height: () => px(r().height),
    background: () => backgroundToken({ url: urlToken(url), position: `${r().x}px ${r().y}px` }),
  });
};
