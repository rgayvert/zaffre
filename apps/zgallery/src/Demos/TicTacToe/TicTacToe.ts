import { Button, Grid, HStack, SVGLabel, TextLabel, addClass, ViewList } from "zaffre";
import { VStack, zcolor, atom, zutil } from "zaffre";
import { TicTacToeModel } from "./TicTacToeModel";
import { TicTacToeOptions, ticTacToeRules } from "./TicTacToe.rules";

export const TicTacToe = (inOptions: TicTacToeOptions = {}) => {
  const model = new TicTacToeModel();
  const options = addClass(inOptions, "tic-tac-toe", ticTacToeRules(model));
  options.model = model;

  const SquareLabel = (idx: number) => {
    return SVGLabel(model.squareValues[idx], {
      events: { click: () => model.squareClicked(idx) },
      disabled: () => model.squareIsDisabled(idx),
      textColor: () => (model.squareValues[idx].get() === "X" ? zcolor.red : zcolor.green),
      vOffset: -8,
    });
  };

  const createMoveListItem = (item: string, index: number) => {
    return TextLabel(item, {
      events: { click: () => model.goToMove(index) },
      cls: "move-item",
    });
  }

  const MoveList = () => {
    const labels = atom(() => model.moveList.get().map((_val, index) => `Go to Move ${index + 1}`));
    return ViewList(
      labels, 
      (item) => item,
      (item, index) => createMoveListItem(item, index)
    )
  };

  return VStack(options).append(
    TextLabel("Tic-Tac-Toe", { cls: "title" }),
    HStack({ cls: "gap-s7" }).append(
      Grid({ cls: "grid" }).append(...zutil.sequence(0, 9).map((idx) => SquareLabel(idx))),
      VStack({ cls: "history-panel" }).append(
        TextLabel("History", { cls: "history-title" }),
        VStack({ cls: "history-container" }).append(MoveList()),
      ),
    ),
    TextLabel(model.status, { cls: "status" }),
    Button({ cls: "new-game-button" }),
  );
};
