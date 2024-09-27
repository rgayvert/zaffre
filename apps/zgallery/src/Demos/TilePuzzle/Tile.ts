import { atom, Atom, Point2D, point2D } from "zaffre";

function indexToPoint(index: number, n: number): Point2D {
  return point2D(index % n, Math.floor(index / n));
}

export class Tile {
  home: Point2D;
  location: Atom<Point2D>;
  constructor(public n: number, public index: number, public initialIndex: number) {
    this.home = indexToPoint(index, n);
    this.location = atom(indexToPoint(initialIndex, n));
  }
  title(): string {
    return this.isBlank() ? "" : this.index.toString();
  }
  get current(): Point2D {
    return this.location.get();
  }
  get x(): number {
    return this.current.x;
  }
  get y(): number {
    return this.current.y;
  }
  isBlank(): boolean {
    return this.index === this.n * this.n - 1;
  }
  isHome(): boolean {
    return this.home.equals(this.current);
  }
  onSameRowAs(tile: Tile): boolean {
    return this.current.y === tile.current.y;
  }
  inSameColumnAs(tile: Tile): boolean {
    return this.current.x === tile.current.x;
  }
  moveRight(): void {
    this.location.set(point2D(this.x + 1, this.y));
  }
  moveLeft(): void {
    this.location.set(point2D(this.x - 1, this.y));
  }
  moveDown(): void {
    this.location.set(point2D(this.x, this.y + 1));
  }
  moveUp(): void {
    this.location.set(point2D(this.x, this.y - 1));
  }
}
