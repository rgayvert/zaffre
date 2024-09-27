import { Card, CardOptions, SoftGrid, View, core, lorem, transitions, zutil } from "zaffre";

class CardGridModel {
  cardData: CardOptions[] = zutil.sequence(0, 23).map((idx) => ({
    imageSrc: lorem.image(400, 300),
    title: lorem.words(2),
    subtitle: lorem.words(2),
    body: lorem.words(10, 20),
  }));
}

export function CardGrid(): View {
  const model = new CardGridModel();
  const hoverEffect = transitions.pullDownOverlay("in&out", "#44000000", "#44000025", 0.3, 0, "forwards");
  return SoftGrid({ minColumnWidth: "30ch", gap: core.space.s4, padding: core.space.s4 }).append(
    ...model.cardData.map((data) =>
      Card({
        ...data,
        elevation: 1,
        rounding: core.rounding.r3,
        effects: { hovered: hoverEffect },
      })
    )
  );
}
  