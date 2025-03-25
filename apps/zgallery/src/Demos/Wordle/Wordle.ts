import { Box, Button, BoxOptions, Spacer, VStack, View, place } from "zaffre";
import { ToastStack, mergeComponentOptions, BV, restoreOptions } from "zaffre";
import { pct, addOptionEvents, core } from "zaffre";
import { defineComponentBundle } from "zaffre";
import { WordleModel } from "./WordleModel";
import { WordleGuesses } from "./WordleGuesses";
import { WordleKeyboard } from "./WordleKeyboard";

export interface WordleOptions extends BoxOptions {}

defineComponentBundle<WordleOptions>("Wordle", "Box", {
  height: pct(100),
  font: core.font.headline_medium,
  position: "relative",
  onIntersectionVisible: (view) => view.focus(),
  outline: core.border.none,
  padding: core.space.s5,
});

function keyDown(model: WordleModel, event: KeyboardEvent): void {
  if (model.gameInProgress.get()) {
    model.keyClicked(event.key.toUpperCase());
  }
}
function NewGameButton(model: WordleModel): View {
  return Button({
    label: model.newGameButtonLabel,
    padding: core.space.s2,
    font: core.font.title_medium,
    color: core.color.darkgray,
    background: core.color.lightgray,
    rounding: core.rounding.pill,
    action: () => model.newGame(),
  });
}

export function Wordle(inOptions: BV<WordleOptions> = {}): View {
  const options = mergeComponentOptions("Wordle", inOptions);
  const model = new WordleModel();
  options.model = model;
  addOptionEvents(options, { keyDown: (evt: KeyboardEvent): void => keyDown(model, evt) });

  return restoreOptions(
    Box(options).append(
      VStack({ gap: core.space.s3 }).append(
        WordleGuesses(model),
        Spacer(core.space.s5),
        WordleKeyboard(model),
        Spacer(core.space.s5),
        NewGameButton(model)
      ),
      ToastStack(model.toastItems, {
        placement: place.center,
        maxItems: 1,
        duration: 1500,
      })
    )
  );
}
