import { CenterBox, Ensemble, HStack, ListBox, Spacer } from "zaffre";
import { HoverTransitionsModel } from "./HoverTransitionsModel";
import { hoverTransitionRules } from "./HoverTransitionsExample.rules";

export const HoverTransitionsExample = () => {
  const model = new HoverTransitionsModel();

  const BoxWithEffect = (effectName: string) => {
    //return ImageBox("image.yellow-rose", {
    return CenterBox({
      effects: { hovered: model.effects.get(effectName) }, // chosen effect, applied to the overlay
    });
  };

  return HStack({ rules: hoverTransitionRules }).append(
    ListBox(model.effectList),
    Spacer("s7"),
    Ensemble(model.effectList.lastSelection, (effectName) => BoxWithEffect(effectName))
  );
};
