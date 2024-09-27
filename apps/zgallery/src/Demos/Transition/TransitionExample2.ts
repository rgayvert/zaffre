import { core, Box, Button, CenterBox, Effect, TextLabel, VStack, View, HStack, css, ch } from "zaffre";
import { TransitionModel2 } from "./TransitionModel2";

function TextTransitionBox(model: TransitionModel2, effectName: string, effect: Effect): View {
  return VStack({ padding: core.space.s4, alignItems: "center", width: "fit-content" }).append(
    TextLabel(effectName, { font: core.font.title_medium.bold(), width: "fit-content" }),
    CenterBox({
      overflow: "hidden",
      border: core.border.thin,
      width: ch(11),
      height: ch(11),
    }).append(
      TextLabel(model.textLabel, {
        //width: ch(10),
        //height: ch(10),
        font: core.font.title_medium.bold(),
        overflow: "hidden",
        effects: { contentChanged: effect },
      })
    )
  );
}

export function TransitionExample2(): View {
  const model = new TransitionModel2();
  return HStack({ alignItems: "center" }).append(
      ...[...model.textTransitionNames].map((effectName) => TextTransitionBox(model, effectName, model.effects.get(effectName)!)),
      Button({ marginInlineStart: core.space.s7, label: "Toggle", action: () => model.toggleText() })
    );
}
