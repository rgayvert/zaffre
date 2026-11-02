import { em, OptionRules, pct, StackOptions } from "zaffre";
import { vmin, zborder, zcolor, zfont, zrounding, zspace } from "zaffre";
import { BoxOptions, ButtonOptions, place, standardHTMLInteractionEffects } from "zaffre";
import { WordleModel } from "./WordleModel";

export interface WordleOptions extends BoxOptions {}


const keyDown = (model: WordleModel, event: KeyboardEvent): void => {
  if (model.gameInProgress.get()) {
    model.keyClicked(event.key.toUpperCase());
  }
};

export const wordleRules = (model: WordleModel): OptionRules => ({
  "wordle": {
    height: pct(100),
    font: zfont.headline_medium,
    position: "relative",
    outline: zborder.none,
    padding: zspace.s5,
    onIntersectionVisible: (view) => view.focus(),
    events: {
      keyDown: (evt: KeyboardEvent): void => keyDown(model, evt),
    },
  } satisfies WordleOptions,
  "wordle>wordle-stack": {
    gap: zspace.s3,
    font: zfont.title_medium,
  } satisfies StackOptions,
  "wordle>new-game": {
    label: model.newGameButtonLabel,
    action: () => model.newGame(),
    padding: zspace.s2,
    font: zfont.title_medium,
    color: zcolor.darkgray,
    background: zcolor.lightgray,
    rounding: zrounding.pill,
  } satisfies ButtonOptions,
  "wordle>keyboardButton": {
    font: zfont.title_medium,
    borderRadius: vmin(1),
    border: zborder.thin,
    color: zcolor.black,
    minWidth: em(2),
    effects: standardHTMLInteractionEffects(),
  },
  "wordle>ToastStack": {
    placement: place.center,
    maxItems: 1,
    duration: 1500,
  },
  "wordle>Toast": {
    font: zfont.headline_large,
  },
  "wordle>wordle-keyboard": {
    gap: zspace.s3
  }
});
