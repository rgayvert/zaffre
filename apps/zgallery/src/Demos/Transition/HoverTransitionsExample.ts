import { Card, Ensemble, HStack, ListBox, Spacer, View, core } from "zaffre";
import { HoverTransitionsModel } from "./HoverTransitionsModel";

export function HoverTransitionsExample(): View {
  const model = new HoverTransitionsModel()

  function CardWithEffect(effectName: string): View {
    return Card({
      padding: core.space.s3,
      border: core.border.none,
      imageSrc: "image.yellow-rose",
      title: "yellow rose",
      effects: { hovered: model.effects.get(effectName) },    // chosen effect, applied to the overlay
    });
  }
  return HStack({ alignItems: "center" }).append(
    ListBox(model.effectNames, model.selectedEffectName, (effectName) => effectName, {
      padding: core.space.s2,
    }),
    Spacer(core.space.s9),
    Ensemble(model.selectedEffectName, (effectName) => CardWithEffect(effectName), {
      border: core.border.thin,
      padding: core.space.s3,
    })
  );
}
