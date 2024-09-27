import { Button, Grid, HStack, SVGTextLabel, TextLabel, TextLabelList, VList, VStack, View, em } from "zaffre";
import { atom, core, zutil, ch, pct, vmin } from "zaffre";
import { TicTacToeModel } from "./TicTacToeModel";

export function TicTacToe(): View {
  const model = new TicTacToeModel();

  function SquareLabel(idx: number): View {
    return SVGTextLabel(model.squareValues[idx], {
      name: `square-${idx}`,
      events: { click: () => model.squareClicked(idx) },
      disabled: atom(() => model.squareIsDisabled(idx)),
      textColor: atom(() => (model.squareValues[idx].get() === "X" ? core.color.red : core.color.green)),
      vOffset: -8,
    });
  }
  function MoveList(): VList<string> {
    const labels = atom(() => model.moveList.get().map((_val, index) => `Go to Move ${index + 1}`));
    return TextLabelList(labels, (_item: string, index: number) => ({
      name: `goto-${index}`,
      selectionColor: core.color.tertiary,
      background: core.color.secondaryContainer,
      events: { click: () => model.goToMove(index) },
    }));
  }
  function NewGameButton(): View {
    return Button({
      label: "New Game",
      font: core.font.title_medium,
      rounding: core.rounding.r3,
      padding: core.space.s4,
      marginTop: core.space.s7,
      background: core.color.secondaryContainer,
      action: () => model.newGame(),
      hidden: atom(() => !model.gameOver()),
    });
  }
  return VStack({
    name: "TicTacToe",
    model: model,
    justifyContent: "start",
    height: pct(100),
    gap: core.space.s5,
  }).append(
    TextLabel("Tic-Tac-Toe", { name: "game-title", padding: core.space.s5, font: core.font.display_medium }),
    HStack({ gap: core.space.s7 }).append(
      Grid({ nrows: 3, ncolumns: 3, gap: core.space.s2, width: vmin(50) }).append(
        ...zutil.sequence(0, 9).map((idx) => SquareLabel(idx))
      ),
      VStack({
        justifyContent: "start",
        border: core.border.thin,
        minHeight: em(20),
        background: core.color.secondaryContainer,
      }).append(
        TextLabel("History", {
          name: "history-title",
          font: core.font.title_medium.bold(),
          background: core.color.secondaryContainer,
        }),
        VStack({ minWidth: ch(16), padding: core.space.s2, background: core.color.secondaryContainer }).append(
          MoveList()
        )
      )
    ),
    TextLabel(model.status, { name: "status", font: core.font.headline_medium }),
    NewGameButton()
  );
}
