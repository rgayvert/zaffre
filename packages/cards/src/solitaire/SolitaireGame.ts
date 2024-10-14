import { View, core, CenterBox, BoxOptions, addOptionEvents, pct, ch, BV, restoreOptions } from "zaffre";
import { defineComponentBundle, mergeComponentOptions } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";
import { SolitaireHeader } from "./SolitaireHeader";
import { SolitaireGrid } from "./SolitaireGrid";

export interface SolitaireOptions extends BoxOptions {}

defineComponentBundle<SolitaireOptions>("SolitaireGame", "Box", {
  width: pct(100),
  maxWidth: ch(100),
  outline: core.border.none,
  onIntersectionVisible: (view) => view.focus(true),
});

export function SolitaireGame(inOptions: BV<SolitaireOptions> = {}): View {
  const options = mergeComponentOptions("SolitaireGame", inOptions);
  const model = new SolitaireModel();
  addOptionEvents(options, {
    keyBindings: {
      "Space": () => model.turnTopStockCard(),
    },
  });
  model.deal();

  return restoreOptions(CenterBox(options).append(SolitaireHeader(model), SolitaireGrid(model)));
}
