import { ch, pct, zspace } from "zaffre";

export const sliderExampleRules = {
  "HStack": {
    width: pct(100),
    gap: zspace.s3,
  },
  "Slider": {
    minVal: 0,
    maxVal: 100,
    width: pct(50),
    radiusRatio: 90,
  },
  "TextLabel": {
    minWidth: ch(2)
  }
};
