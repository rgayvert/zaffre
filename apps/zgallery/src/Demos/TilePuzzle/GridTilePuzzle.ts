import { Button, Grid, GridOptions, atom, zcolor, fractionOfWindowSize } from "zaffre";
import { TilePuzzleModel } from "./TilePuzzleModel";
import { Tile } from "./Tile";

const Square = (tile: Tile, model: TilePuzzleModel, n: number) => {
  return Button({
    name: "Square",
    model: tile,
    label: tile.title(),
    background: () => (tile.isBlank() ? zcolor.transparent : tile.isHome() ? zcolor.green : zcolor.secondaryContainer),
    gridArea: () => `${tile.y + 1} / ${tile.x + 1}`,
    fontSize: () => fractionOfWindowSize(0.3 / n),
    action: () => model.tileClicked(tile),
  });
};
export const GridTilePuzzle = (n: number) => {
  const model = new TilePuzzleModel(n);
  const gridOptions: GridOptions = {
    name: "GridTilePuzzle",
    nrows: n,
    ncolumns: n,
  };
  return Grid(gridOptions).append(...model.tiles.map((tile) => Square(tile, model, n)));
};
