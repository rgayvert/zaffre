import { Box, CenteredTextLabel, ColorToken, HStack, View, VStack } from "zaffre";
import { colorToken, em, vmin, atom, core, transitions, zutil } from "zaffre";
import { WordleModel } from "./WordleModel";

function colorOfLetterBox(model: WordleModel, row: number, col: number): ColorToken {
  const ready = model.currentWord().length === model.wordLength;
  const valid = model.currentWordIsKnown();
  return row === model.currentRow.get() && ready && !valid ? core.color.red : core.color.black;
}
function backgroundOfLetterBox(model: WordleModel, row: number, col: number): ColorToken {
  const val = model.guesses[row][col].get();
  return row > model.matchedRow.get()
    ? core.color.lightgray
    : model.wordToMatch[col] === val
    ? core.color.green
    : val && model.wordToMatch.includes(val)
    ? core.color.orange
    : colorToken({ rgba: "#a4aec4" });
}

function LetterBox(model: WordleModel, row: number, col: number): View {
  return CenteredTextLabel(model.guesses[row][col], {
    font: core.font.headline_medium,
    width: em(1.5),
    height: em(1.5),
    border: core.border.thin,
    borderRadius: vmin(1),
    color: atom(() => colorOfLetterBox(model, row, col)),
    effects: { contentChanged: transitions.pop() },
    background: atom(() => backgroundOfLetterBox(model, row, col)),
  });
}

export function WordleGuesses(model: WordleModel): View {
  return VStack({ gap: core.space.s3 }).append(
    ...zutil
      .sequence(0, model.numberOfGuesses)
      .map((row) =>
        HStack({ justifyContent: "stretch", gap: core.space.s3 }).append(
          ...zutil.sequence(0, model.wordLength).map((col) => LetterBox(model, row, col))
        )
      )
  );
}
