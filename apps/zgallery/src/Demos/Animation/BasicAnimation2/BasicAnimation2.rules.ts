import { zborder, zspace, zfont } from "zaffre";
import { BasicModel2 } from "./BasicModel2";

export const rules = (model: BasicModel2) => {
  return {
    "BasicAnimation2": {
      animations: [model.newspaperAnimation], // the animation
      events: {
        click: () => model.runNewspaperAnimation(), // click triggers the animation
      },
      font: zfont.headline_small,
      border: zborder.thin,
      margin: zspace.s4,
      cursor: "pointer",
      overflow: "none"
    },
  };
};
