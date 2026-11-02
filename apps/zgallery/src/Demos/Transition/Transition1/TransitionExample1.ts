import { Box, Button, Effect, TextLabel, HStack, VStack } from "zaffre";
import { TransitionModel1 } from "./TransitionModel1";
import { transitionBoxRules, transitionExample1Rules } from "./TransitionExample1.rules";

// Create an HStack with four boxes and a button

export const TransitionExample1 = () => {
  const model = new TransitionModel1();

  // Create a box that contains an inner box whose visibility is controlled by the model.effectsHidden atom

  const TransitionBox = (effectName: string, effect: Effect) => {
    return VStack({ rules: transitionBoxRules(model, effect) }).append(
      TextLabel(effectName),
      Box({ cls: "outer-box" }).append(Box({ cls: "inner-box" }))
    );
  };

  return HStack({ rules: transitionExample1Rules(model) }).append(
    ...[...model.simpleTransitionNames].map((effectName) => TransitionBox(effectName, model.effects.get(effectName)!)),
    Button()
  );
};
   