import { View, core, CenterBox, BoxOptions, addOptionEvents, pct, ch } from "zaffre";
import { defineComponentDefaults, mergeComponentDefaults } from "zaffre";
import { SolitaireModel } from "./SolitaireModel";
import { SolitaireHeader } from "./SolitaireHeader";
import { SolitaireGrid } from "./SolitaireGrid";

export interface SolitaireOptions extends BoxOptions {}

defineComponentDefaults<SolitaireOptions>("SolitaireGame", "Box", {
  width: pct(100),
  maxWidth: ch(100), 
  outline: core.border.none,
  onIntersectionVisible: (view) => view.focus(true),
});

export function SolitaireGame(inOptions: SolitaireOptions = {}): View {
  const options = mergeComponentDefaults("SolitaireGame", inOptions);
  const model = new SolitaireModel();
  addOptionEvents(options, {
    keyBindings: {
      "Space": () => model.turnTopStockCard(),
    },
  });
  model.deal();

  return CenterBox(options).append(SolitaireHeader(model), SolitaireGrid(model));
}
