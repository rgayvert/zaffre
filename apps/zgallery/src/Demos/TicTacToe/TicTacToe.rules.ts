import { ch, em, OptionRules, pct, StackOptions } from "zaffre";
import { vmin, zborder, zcolor, zfont, zrounding, zspace, ButtonOptions } from "zaffre";
import { TicTacToeModel } from "./TicTacToeModel";

export interface TicTacToeOptions extends StackOptions {}

export const ticTacToeRules = (model: TicTacToeModel): OptionRules => ({
  "tic-tac-toe": {
    model: model,
    justifyContent: "start",
    height: pct(100),
    gap: zspace.s5,
  } satisfies TicTacToeOptions,

  "title": {
    padding: zspace.s5,
    font: zfont.display_medium,
  },
  "grid": {
    nrows: 3,
    ncolumns: 3,
    gap: zspace.s2,
    width: vmin(50),
  },

  "new-game-button": {
    label: "New Game",
    font: zfont.title_medium,
    rounding: zrounding.r3,
    padding: zspace.s4,
    marginTop: zspace.s7,
    background: zcolor.secondaryContainer,
    action: () => model.newGame(),
    hidden: () => !model.gameOver(),
  } satisfies ButtonOptions,

  "history-panel": {
    justifyContent: "start",
    border: zborder.thin,
    minHeight: em(20),
    background: zcolor.secondaryContainer,
  },
  "history-title": {
    font: zfont.title_medium.bold(),
    background: zcolor.secondaryContainer,
  },
  "history-container": {
    minWidth: ch(16),
    padding: zspace.s2,
    background: zcolor.secondaryContainer,
  },
  "move-item": {
    selectionColor: zcolor.tertiary,
    background: zcolor.secondaryContainer,
  },
  "status": {
    font: zfont.headline_medium,
  },
});
