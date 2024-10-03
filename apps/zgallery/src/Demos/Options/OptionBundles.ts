import { ch, pct } from ":attributes";
import { core } from ":theme";
import { defineOptionBundles } from ":view";

defineOptionBundles([
  [
    "medium-gap",
    {
      gap: core.space.s5,
    },
  ],
  [
    "small-box",
    {
      width: ch(6),
      height: ch(6),
    },
  ],
  [
    "blue-box",
    {
      background: core.color.red,
    },
  ],
  [
    "green-circle",
    {
      background: core.color.green,
      rounding: pct(50),
    },
  ],
]);
