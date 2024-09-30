import { Box, BoxOptions, CenteredTextLabel, View, atom, calc, core } from "zaffre";
import { fractionOfWindowSize, px, calcAdd, calcMult } from "zaffre";
import { TilePuzzleModel } from "./TilePuzzleModel";
import { Tile } from "./Tile";

function Square(tile: Tile, model: TilePuzzleModel, n: number): View {
  const bw = 3;
  const w = calc(`(100% - ((${n} + 1) * ${bw}px)) / ${n}`);
  return CenteredTextLabel(tile.title(), {
    position: "absolute",
    left: atom(() => calcAdd(calcMult(w, tile.x), px((tile.x + 1) * bw))),
    top: atom(() => calcAdd(calcMult(w, tile.y), px((tile.y + 1) * bw))),
    background: atom(() =>
      tile.isBlank() ? core.color.transparent : tile.isHome() ? core.color.green : core.color.secondaryContainer
    ),
    fontSize: atom(() => fractionOfWindowSize(0.3 / n)),
    width: w,
    height: w,
    rounding: core.rounding.none,
    color: core.color.background.contrast,
    clickAction: () => model.tileClicked(tile),
    transition: tile.isBlank() ? "" : "all 0.3s",
    model: tile,
    componentName: "Square",
  });
}
export function BoxTilePuzzle(n: number): View {
  const model = new TilePuzzleModel(n);
  const boxOptions: BoxOptions = {
    background: core.color.blue,
    aspectRatio: 1.0,
    componentName: "TilePuzzle",
  };
  return Box(boxOptions).append(...model.tiles.map((tile) => Square(tile, model, n)));
}
