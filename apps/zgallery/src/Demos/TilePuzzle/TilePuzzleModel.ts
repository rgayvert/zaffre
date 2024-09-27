import { zutil, point2D, Point2D } from "zaffre";
import { Tile } from "./Tile";

export class TilePuzzleModel {
  tiles: Tile[];
  blank: Tile;

  constructor(n: number) {
    const initialIndexes = zutil.randomSequence(0, n * n);
    this.tiles = Array<Tile>(n * n);
    for (let i = 0; i < n * n; i++) {
      this.tiles[i] = new Tile(n, i, initialIndexes[i]);
    }
    this.blank = this.tiles[n * n - 1];
  }
  tileAt(pt: Point2D): Tile {
    return this.tiles.find((tile) => tile.current.equals(pt))!;
  }
  tileClicked(tile: Tile): void {
    this.tileIsActive(tile) && this.moveTile(tile);
  }
  tileIsActive(tile: Tile): boolean {
    return tile.onSameRowAs(this.blank) || tile.inSameColumnAs(this.blank);
  }
  moveTile(tile: Tile): void {
    const newBlankLocation = tile.current;
    if (tile.onSameRowAs(this.blank)) {
      tile.x < this.blank.x ? this.pushRight(tile) : this.pushLeft(tile);
    } else {
      tile.y < this.blank.y ? this.pushDown(tile) : this.pushUp(tile);
    }
    this.blank.location.set(newBlankLocation);
  }
  pushLeft(tile: Tile): void {
    for (let x = this.blank.x + 1; x <= tile.x; x++) {
      this.tileAt(point2D(x, tile.y)).moveLeft();
    }
  }
  pushRight(tile: Tile): void {
    for (let x = this.blank.x - 1; x >= tile.x; x--) {
      this.tileAt(point2D(x, tile.y)).moveRight();
    }
  }
  pushUp(tile: Tile): void {
    for (let y = this.blank.y + 1; y <= tile.y; y++) {
      this.tileAt(point2D(tile.x, y)).moveUp();
    }
  }
  pushDown(tile: Tile): void {
    for (let y = this.blank.y - 1; y >= tile.y; y--) {
      this.tileAt(point2D(tile.x, y)).moveDown();
    }
  }
}
