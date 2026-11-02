import { zborder, zfont, zspace } from "zaffre";
import { HelloModel4 } from "./HelloModel4";

export const helloWorld4Rules = (model: HelloModel4) => {
  return {
    "container": {
      gap: zspace.s5,
    },
    "TextLabel": {
      padding: zspace.s2,
      font: zfont.headline_small,
      border: zborder.thin,
    },
    "row1": {
      gap: zspace.s4,
      padding: zspace.s4,
    },
    "row2": {
      gap: zspace.s6,
    },
    "add-button": {
      label: "Add",
      action: () => model.addValue(),
    },
    "remove-button": {
      label: "Remove",
      disabled: () => model.values.length === 1,
      action: () => model.removeValue(),
    },
    "button-label": {
      font: zfont.label_medium.bold(),
    },
  };
};
