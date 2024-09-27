import { atom, ColorToken, core, colorToken, View } from "zaffre";
import { WordleModel } from "./WordleModel";
import { Keyboard } from "./Keyboard";


function colorOfKeyboardKey(model: WordleModel, key: string): ColorToken {
  return !model.gameInProgress.get()
    ? core.color.lightgray
    : model.keysSeenInCorrectSpot.get().has(key)
    ? core.color.green
    : model.keysSeenInWrongSpot.get().has(key)
    ? core.color.orange
    : model.unusedLetters.get().has(key)
    ? colorToken({ rgba: "#a4aec4" })
    : core.color.lightgray;
}

export function WordleKeyboard(model: WordleModel): View {
  return Keyboard({
    disabled: atom(() => !model.gameInProgress.get(), { name: "keyboard-disabled" }),
    action: (key) => model.keyClicked(key),
    keyBackground: (key: string) => colorOfKeyboardKey(model, key),
  });
}
