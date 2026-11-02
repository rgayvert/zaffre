import { Button, CenterBox, Effect, TextLabel, VStack, HStack } from "zaffre";
import { TransitionModel2 } from "./TransitionModel2";
import { transitionExample2Rules } from "./TransitionExample2.rules";

const TextTransitionBox = (model: TransitionModel2, effectName: string, effect: Effect) => {
  return VStack().append(
    TextLabel(effectName, { cls: "effect-name" }),
    CenterBox().append(
      TextLabel(model.label, {
        name: "effect-label",
        effects: { contentChanged: effect },
      })
    )
  );
};

export const TransitionExample2 = () => {
  const model = new TransitionModel2();
  return HStack({ rules: transitionExample2Rules(model) }).append(
    ...[...model.textTransitionNames].map((effectName) =>
      TextTransitionBox(model, effectName, model.effects.get(effectName)!)
    ),
    Button({})
  );
};
 