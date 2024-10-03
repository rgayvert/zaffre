import { core } from ":theme";
import { defineOptionBundles } from ":view";

defineOptionBundles([
  [
    "formatted-label-top",
    {
      placementPt: "xstart-ystart",
      labelOptions: {
        font: core.font.label_large.bold(),
        color: core.color.secondary,
      },
    },
  ],
  [
    "formatted-label-red",
    {
      border: core.border.thin,
      padding: core.space.s2,
      color: core.color.red,
    },
  ],
]);
