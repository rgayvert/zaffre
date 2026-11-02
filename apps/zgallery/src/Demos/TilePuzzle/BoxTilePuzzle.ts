import { Box, BoxOptions, CenteredText, atom, calc, zcolor } from "zaffre";
import { fractionOfWindowSize, px, calcAdd, calcMult } from "zaffre";
import { TilePuzzleModel } from "./TilePuzzleModel";
import { Tile } from "./Tile";

const Square = (tile: Tile, model: TilePuzzleModel, n: number) => {
  const bw = 3;
  const w = calc(`(100% - ((${n} + 1) * ${bw}px)) / ${n}`);
  return CenteredText(tile.title(), {
    name: "Square",
    model: tile,
    position: "absolute",
    left: () => calcAdd(calcMult(w, tile.x), px((tile.x + 1) * bw)),
    top: () => calcAdd(calcMult(w, tile.y), px((tile.y + 1) * bw)),
    background: () => (tile.isBlank() ? zcolor.transparent : tile.isHome() ? zcolor.green : zcolor.secondaryContainer),
    fontSize: () => fractionOfWindowSize(0.3 / n),
    width: w,
    height: w,
    clickAction: () => model.tileClicked(tile),
    transition: tile.isBlank() ? "" : "all 0.3s",
  });
};
export const BoxTilePuzzle = (n: number) => {
  const model = new TilePuzzleModel(n);
  const boxOptions: BoxOptions = {
    name: "BoxTilePuzzle",
  };
  return Box(boxOptions).append(...model.tiles.map((tile) => Square(tile, model, n)));
};
