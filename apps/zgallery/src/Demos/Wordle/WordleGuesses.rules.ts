import { zborder, zcolor, zfont, zspace, colorToken, em, vmin, transitions} from "zaffre";
import { WordleModel } from "./WordleModel";

export const colorOfLetterBox = (model: WordleModel, row: number, col: number) => {
  const ready = model.currentWord().length === model.wordLength;
  const valid = model.currentWordIsKnown();
  return row === model.currentRow.get() && ready && !valid ? zcolor.red : zcolor.black;
}

export const backgroundOfLetterBox = (model: WordleModel, row: number, col: number) => {
  const val = model.guesses[row][col].get();
  return row > model.matchedRow.get()
    ? zcolor.lightgray
    : model.wordToMatch[col] === val
    ? zcolor.green
    : val && model.wordToMatch.includes(val)
    ? zcolor.orange
    : colorToken({ rgba: "#a4aec4" });
}

export const wordleGuessesRules = {
  "VStack": {
    gap: zspace.s3,
  },
  "HStack": {
    justifyContent: "stretch",
    gap: zspace.s3,
  },
  "CenteredText": {
    font: zfont.headline_medium,
    width: em(1.5),
    height: em(1.5),
    border: zborder.thin,
    borderRadius: vmin(1),
    effects: { contentChanged: transitions.pop() },
  },
};
