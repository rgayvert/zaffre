import { LocalData, atom, t, zutil } from "zaffre";

type tttPlayerName = "X" | "O";

export class TicTacToeModel {
  player1: tttPlayerName = "X";
  player2: tttPlayerName = "O";
  squareValues = zutil.sequence(0, 9).map((_idx) => atom(""));
  moveList = LocalData.instance.addAtom("moveList", <number[]>[], (list) => this.moveListChanged(list));
  winner = atom(() => this.getWinner());
  nextPlayer = atom(() => this.getNextPlayer());
  status = atom(() => this.getStatus());

  squareIsDisabled(index: number): boolean {
    return Boolean(this.getWinner() || this.squareValues[index].get());
  }
  moveListChanged(newMoveList: number[]): void {
    this.squareValues.forEach((squareVal, squareIndex) => {
      const moveIndex = newMoveList.indexOf(squareIndex);
      squareVal.set(moveIndex === -1 ? "" : this.playerOnMove(moveIndex));
    });
  }
  playerOnMove(index: number): tttPlayerName {
    return index % 2 == 0 ? this.player1 : this.player2;
  }
  getNextPlayer(): tttPlayerName | undefined {
    return this.winner.get() ? undefined : this.playerOnMove(this.moveList.get().length);
  }
  getStatus(): string {
    const winner = this.winner.get();
    return winner ? `Winner: ${winner}` : this.gameOver() ? "Draw" : `${t("Next player:")} ${this.getNextPlayer()}`;
  }
  gameOver(): boolean {
    return Boolean(this.winner.get()) || this.moveList.get().length === 9;
  }
  squareClicked(index: number): void {
    this.squareValues[index].set(this.getNextPlayer() || "");
    this.moveList.set([...this.moveList.get(), index]);
  }
  goToMove(index: number): void {
    this.moveList.set(this.moveList.get().slice(0, index));
  }
  newGame(): void {
    this.moveList.set([]);
  }
  getWinner(): tttPlayerName | undefined {
    const moves = this.moveList.get();
    const squareVals = zutil.sequence(0, 9).map((_x, idx) => {
      const pos = moves.indexOf(idx);
      return pos === -1 ? undefined : pos % 2 === 0 ? this.player1 : this.player2;
    });
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squareVals[a] && squareVals[a] === squareVals[b] && squareVals[a] === squareVals[c]) {
        return squareVals[a];
      }
    }
    return undefined;
  }
}
