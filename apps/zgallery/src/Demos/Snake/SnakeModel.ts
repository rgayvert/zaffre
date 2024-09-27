import { Atom, atom, arrayAtom, zutil, AnimationModel } from "zaffre";
import { Point2D, point2D, rect2D, Rect2D, Sz2D, Vector2D, vector2D } from "zaffre";
import { Snake, SnakeSegment } from "./Snake";

export class SnakeModel extends AnimationModel {
  blockSize = 28;
  nrows = 15;
  ncolumns = 21;
  bounds = rect2D(0, 0, this.ncolumns * this.blockSize, this.nrows * this.blockSize);
  initialLength = 5;
  snake: Snake;
  pellet: Atom<Point2D>;
  offscreenPoint = point2D(-100, -100);
  direction = atom(vector2D(0, 0));

  constructor() {
    super();
    this.pellet = atom(this.offscreenPoint);
    this.snake = new Snake(
      this.bounds,
      this.blockSize,
      arrayAtom([]),
      this.direction,
      this.pellet,
      () => this.placePellet(),
      () => this.onCrash()
    );
    this.setItems([this.snake]);
  }

  onCrash(): void {
    this.pause();
  }
  randomize(): void {
    this.direction.set(this.randomDirection());
    this.snake.segments.set(this.randomSegments(this.direction.get()));
    this.placePellet();
  }
  placePellet(): void {
    this.pellet.set(this.randomPelletPoint());
  }

  start(): void {
    this.randomize();
    super.start();
  }

  pelletCenter(): Atom<Point2D> {
    const r = this.blockSize / 2;
    return atom(() => point2D(this.pellet.get().x * this.blockSize + r, this.pellet.get().y * this.blockSize + r));
  }

  randomPointInBox(box: Rect2D): Point2D {
    return point2D(zutil.randomInt(box.left, box.right), zutil.randomInt(box.top, box.bottom));
  }
  randomDirection(): Vector2D {
    const x = zutil.randomInt(-1, 1);
    const y = x === 0 ? zutil.randomElement([-1, 1]) : 0;
    return vector2D(x, y);
  }
  randomPelletPoint(): Point2D {
    let d: number;
    let pt: Point2D;
    do {
      pt = this.randomPointInBox(rect2D(0, 0, this.ncolumns - 1, this.nrows - 1));
      d = Math.min(...this.snake.segments.map((segment) => segment.rect.get().center.distanceTo(pt)));
    } while (d < 4);
    return pt;
  }
  randomSegments(dir: Vector2D): SnakeSegment[] {
    const n = this.initialLength + 1;
    const start = this.randomPointInBox(rect2D(n, n, this.ncolumns - n * 2, this.nrows - n * 2));

    const initialHead: SnakeSegment = {
      isHead: atom(true),
      rect: atom(start.scalarMultiply(this.blockSize).extent(Sz2D(this.blockSize, this.blockSize))),
    };
    const segments = [initialHead];
    for (let i = 1; i < n - 1; i++) {
      const delta = dir.scalarMultiply(i);
      const segment: SnakeSegment = {
        isHead: atom(false),
        rect: atom(start.add(delta).scalarMultiply(this.blockSize).extent(Sz2D(this.blockSize, this.blockSize))),
      };
      segments.push(segment);
    }
    return segments;
  }

  turn(x: number, y: number): void {
    this.snake.setDirection(x, y);
  }
}
