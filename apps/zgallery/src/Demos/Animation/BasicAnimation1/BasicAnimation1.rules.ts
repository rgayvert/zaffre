import { zborder, zcolor, zrounding, zspace, em } from "zaffre";
import { BasicModel1 } from "./BasicModel1";

export const rules = (model: BasicModel1) => {
  return {
    "BasicAnimation1": {
      gap: zspace.s6,
    },
    "container": {
      animations: [model.animation], // the animation
      rounding: zrounding.r4,
      background: zcolor.blue,
      border: zborder.thin,
      height: em(4),
      transformOrigin: "center",
      width: em(4),
    },
    "Switch": {
      controlSize: "xs",
    },
  };
};
