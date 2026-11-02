import { pct, px, zborder, zcolor, zspace } from "zaffre";

export const fixedSizeContainerExampleRules = {
  "fixed-size-container": {
    //border: zborder.none,
    width: pct(80),
    background: zcolor.red
  },
  "fixed-size-child": {
    width: px(600),
    height: px(200),
    background: zcolor.blue,
    //position: "absolute",
  },
};
