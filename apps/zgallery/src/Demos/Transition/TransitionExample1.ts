import { Box, Button, Effect, TextLabel, HStack, VStack, View, core, ch } from "zaffre";
import { TransitionModel1 } from "./TransitionModel1";

// Create a box that contains an inner box whose visibility is controlled by the model.effectsHidden atom

function TransitionBox(model: TransitionModel1, effectName: string, effect: Effect): View {
  return VStack({ padding: core.space.s4, alignItems: "center", width: "fit-content" }).append(
    TextLabel(effectName, { font: core.font.title_medium.bold(), width: "fit-content" }),
    Box({
      border: core.border.thin,
      width: ch(11), 
      height: ch(11),
      padding: core.space.s1,
    }).append(
      Box({
        hidden: model.effectsHidden,      // the trigger
        rounding: core.rounding.r0,
        width: ch(10),
        height: ch(10),
        border: core.border.thin,
        overflow: "hidden",
        background: core.color.primary,
        effects: { hidden: effect },      // effect to use when visiblity changes
      })
    )
  );
}

// Create an HStack with four boxes and a button 

export function TransitionExample1(): View {
  const model = new TransitionModel1();
  return HStack({ alignItems: "center" }).append(
      ...[...model.simpleTransitionNames].map((effectName) => TransitionBox(model, effectName, model.effects.get(effectName)!)),
      Button({ marginInlineStart: core.space.s7, label: "Toggle", action: () => model.toggleHidden() })
  );
}
