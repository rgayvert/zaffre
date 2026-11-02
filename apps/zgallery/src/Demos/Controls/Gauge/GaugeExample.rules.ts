import { ch, GaugeOptions, zborder, zcolor, zrounding, zspace } from "zaffre";

export const gaugeExampleRules = {
  "Switch": {
    widthInEm: 2.2,
  },
  "fixed": {
    background: zcolor.primary,
    border: zborder.thin,
  },
  "progress": {
    background: zcolor.green,
    border: zborder.thin,
    rounding: zrounding.r5,
    width: ch(30),
  } satisfies GaugeOptions,
  "inner-box": {
    background: zcolor.yellow,
  },
};
