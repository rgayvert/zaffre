import { SVGAvatar, zcolor, px, HStack, zspace } from "zaffre";

export const SVGExample7 = () => {
  return HStack({ gap: zspace.s6 }).append(
    SVGAvatar("AB", {
      width: px(64),
      height: px(64),
      bgColor: zcolor.red,
      textColor: zcolor.white,
      circular: true,
    }),
    SVGAvatar("CD", {
      width: px(32),
      height: px(32),
      bgColor: zcolor.blue,
      textColor: zcolor.white,
      circular: true,
    })
  );
}
