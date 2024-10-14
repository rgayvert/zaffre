import { rect2D, Rect2D, Rect4, atom, zget, Atom } from ":foundation";
import { View, resolveURI, backgroundToken, urlToken, px, BV, restoreOptions } from ":core";
import { defineComponentBundle, mergeComponentOptions } from ":core";
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
defineComponentBundle<SpriteOptions>("Sprite", "Box", {
  lazy: false,
});

export function Sprite(
  spriteName: Atom<string>,
  uri: string,
  spriteMap: SpriteMap,
  inOptions: BV<SpriteOptions> = {}
): View {
  const options = mergeComponentOptions("Sprite", inOptions);
  const url = resolveURI(uri);

  function r(): Rect2D {
    return rect2D(...(spriteMap.get(zget(spriteName)) || [0, 0, 0, 0]));
  }
  return restoreOptions(
    Box({
      ...options,
      width: atom(() => px(r().width)),
      height: atom(() => px(r().height)),
      background: atom(() => backgroundToken({ url: urlToken(url), position: `${r().x}px ${r().y}px` })),
    })
  );
}
