import { ch } from ":attributes";
import { BoxOptions, TextBoxOptions } from ":components";
import { point2D } from ":foundation";
import { zborder, zcolor, zspace } from ":theme";
import { OptionRules } from ":view";
import { CardinalPointsModel } from "./CardinalPointsModel";

export const cardinalPointsRules = (model: CardinalPointsModel): OptionRules => {
  return {
    "outer-box": {
      events: { pointerMove: (evt) => model.mousePt.set(point2D(evt.clientX, evt.clientY)) },
      width: ch(20),
      border: zborder.thin,
      margin: zspace.s4,
    } satisfies BoxOptions,
    "moving-box": {
      transition: "all 0.2s",
      width: ch(3),
      height: ch(3),
      background: zcolor.red,
      placement: model.boxPlace,
      position: "absolute",
    } satisfies BoxOptions,
    "text-box": {
      cursor: "default",
      padding: zspace.s4,
    } satisfies TextBoxOptions,
  };
};
