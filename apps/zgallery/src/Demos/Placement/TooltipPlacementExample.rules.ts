import { Atom, em, Placement, zfont, zrounding, zspace } from "zaffre";

export const tooltipPlacementExampleRules = (tooltip: Atom<string>, place: Atom<Placement>) => {
  return {
    "example-top": {
      gap: zspace.s8,
      alignItems: "center",
    },
    "labelbox": {
      side: "top",
    },
    "ListBox": {
      font: zfont.body_medium,
      maxHeight: em(7),
      overflowY: "auto",
    },
    "ListBox>TextLabel": {
      padding: zspace.none,
      paddingInline: zspace.s2,
    },
    "hover-button": {
      label: "Hover to see Tooltip",
      tooltip: tooltip,
      tooltipPlacement: place,
      rounding: zrounding.none,
    },
  };
};
