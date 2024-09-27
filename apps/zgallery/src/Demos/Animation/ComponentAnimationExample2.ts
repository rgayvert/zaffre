import { View, TextBox, core } from "zaffre";
import { ComponentAnimationModel2 } from "./ComponentAnimationModel2";

// Adapted from developer.mozilla.org

export function ComponentAnimationExample2(): View {
  const model = new ComponentAnimationModel2();
  return TextBox("spinning_newspaper", {
    animations: [model.newspaperAnimation],          // the animation
    events: {
      click: () => model.runNewspaperAnimation(),    // click triggers the animation
    },
    font: core.font.headline_small,
    border: core.border.thin,
    margin: core.space.s4,
    cursor: "pointer",
  });
}
