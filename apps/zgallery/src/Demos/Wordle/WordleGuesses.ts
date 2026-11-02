import { atom, zutil, CenteredText, HStack, VStack } from "zaffre";
import { WordleModel } from "./WordleModel";
import { backgroundOfLetterBox, colorOfLetterBox, wordleGuessesRules } from "./WordleGuesses.rules";

const LetterBox = (model: WordleModel, row: number, col: number) => {
  return CenteredText(model.guesses[row][col], {
    color: () => colorOfLetterBox(model, row, col),
    background: () => backgroundOfLetterBox(model, row, col),
  });
}

export const WordleGuesses = (model: WordleModel) => {
  return VStack({ rules: wordleGuessesRules }).append(
    ...zutil
      .sequence(0, model.numberOfGuesses)
      .map((row) =>
        HStack().append(
          ...zutil.sequence(0, model.wordLength).map((col) => LetterBox(model, row, col))
        )
      )
  );
}
