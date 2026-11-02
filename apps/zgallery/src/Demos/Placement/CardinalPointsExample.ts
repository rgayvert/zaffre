import { Box, HStack, TextBox, beforeAddedToDOM } from "zaffre";
import { cardinalPointsRules } from "./CardinalPointsExample.rules";
import { CardinalPointsModel } from "./CardinalPointsModel";


export const CardinalPointsExample = () => {
  const model = new CardinalPointsModel();
  const options = { rules: cardinalPointsRules(model) };

  beforeAddedToDOM(options, (view) => {
    model.view.set(view);
  });

  return HStack(options).append(
    Box({ cls: "outer-box" }).append(
      Box({ cls: "moving-box" }),
      TextBox("The red box will follow the cursor to the nearest cardinal point on the outer box", {
        cls: "text-box",
      })
    )
  );
};
