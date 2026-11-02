import { Box, Button, Spacer, VStack, ToastStack, addClass } from "zaffre";
import { WordleModel } from "./WordleModel";
import { WordleGuesses } from "./WordleGuesses";
import { Keyboard } from "./Keyboard";
import { WordleOptions, wordleRules } from "./Wordle.rules";

export const Wordle = (inOptions: WordleOptions = {}) => {
  const model = new WordleModel();
  const wordleOptions = addClass(inOptions, "wordle", wordleRules(model));
  return Box(wordleOptions).append(
    VStack({ cls: "wordle-stack" }).append(
      WordleGuesses(model),
      Spacer("s5"),
      Keyboard(model, { cls: "wordle-keyboard" }),
      Spacer("s5"),
      Button({ cls: "new-game" }),
    ),
    ToastStack(model.toastItems),
  );
};
