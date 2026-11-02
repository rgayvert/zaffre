import { ch, pct, vmin } from ":attributes";
import { rect2D } from ":foundation";
import { zcolor, zspace } from ":theme";

export const counterDemoDefaults = {
  Counter: {
    bounds: rect2D(0, 0, 100, 120),
    width: pct(100),
  },
  Counter_Label: {
    rounded: true,
    textColor: zcolor.black,
    cursor: "pointer",
  },

  CounterGrid: {
    maxWidth: ch(100),
  },
  "CounterGrid>Grid": {
    nrows: 2,
    ncolumns: 2,
    gap: zspace.s2,
    width: vmin(70),
  },
  "CounterGrid>Counter_Label": {
    rounded: false,
  },
  "CounterGrid>Counter_Minus": {
    textColor: zcolor.red,
    rounded: true,
  },
  "CounterGrid>Counter_Plus": {
    textColor: zcolor.red,
  },
};
