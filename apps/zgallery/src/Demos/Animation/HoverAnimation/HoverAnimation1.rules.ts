import { zspace, px, zcolor, zfont, pct, AttributeEffect, zutil, colorToken } from "zaffre";
import { HoverAnimationModel } from "./HoverAnimationModel";

const faceLabel = (model: HoverAnimationModel, n: number) => {
  return {
      backfaceVisibility: "inherit",
      color: zcolor.white,
      font: zfont.display_medium,
      width: pct(100),
      height: pct(100),
      position: "absolute",
      background: colorToken({ rgba: model.faces[n][0] }),
      transform: model.faces[n][1]
    };
}
const faceLabels = (model: HoverAnimationModel) => {
  return Object.fromEntries(zutil.sequence(0, 6).map((i) => [`faceLabel[${i}]`, faceLabel(model, i)]));
}
export const rules = (model: HoverAnimationModel) => {
  return {
    ...faceLabels(model),

    "HoverAnimation1": {
      margin: zspace.s6,
      background: zcolor.none,
      width: px(100),
      height: px(100),
      transformStyle: "preserve-3d",
      transform: "rotate3d(1, 1, 1, 30deg)",
      transition: "transform 2.5s",
      effects: {
        hovered: new AttributeEffect({ transform: "rotate3d(1, 1, 1, 330deg)" }, "in&out"),
      },
    },
  };
};
