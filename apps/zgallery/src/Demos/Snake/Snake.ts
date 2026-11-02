import { SimpleAnimationItem, ArrayAtom, Atom, BasicAction, Point2D, Rect2D, Vector2D, vector2D, atom } from "zaffre";

export interface SnakeSegment {
  isHead: Atom<boolean>;
  rect: Atom<Rect2D>;
}

export class Snake extends SimpleAnimationItem {
  elapsedTime = 0;
  interval = 150;

  constructor(
    public bounds: Rect2D,
    public blockSize: number,
    public segments: ArrayAtom<SnakeSegment>,
    public direction: Atom<Vector2D>,
    public pellet: Atom<Point2D>,
    public onHit: BasicAction,      // for scoring (currently unused)
    public onCrash: BasicAction
  ) {
    super();
  }

  get head(): SnakeSegment {
    return this.segments.at(0)!;
  }
  get tail(): SnakeSegment {
    return this.segments.at(-1)!;
  }
  indexOfSegment(segment: SnakeSegment): number | undefined {
    return this.segments.indexOf(segment);
  }
  meets(rect: Rect2D): boolean {
    return Boolean(this.segments.find((segment) => rect.intersects(segment.rect.get())));
  }
  setDirection(x: number, y: number): void {
    // only allow change of orientation
    const dir = this.direction.get();
    if (dir.x * x === 0 && dir.y * y === 0) {
      this.direction.set(vector2D(x, y));
    }
  }
  isOverPellet(): boolean {
    return this.head.rect.get().origin.equals(this.pellet.get().scalarMultiply(this.blockSize));
  }
  isCrash(newHead: Rect2D): boolean {
    return !this.bounds.contains(newHead);
  }

  step(deltaT: number): void {
    this.elapsedTime += deltaT;
    if (this.elapsedTime > this.interval) {
      const tail = this.tail;
      const oldTailRect = tail.rect.get();
      // move the tail to the head with an offset given by the direction
      const newHead = this.head.rect.get().translatedBy(this.direction.get().negated().scalarMultiply(this.blockSize));
      if (this.isCrash(newHead)) {
        this.onCrash();
      } else {
        this.head.isHead.set(false);
        tail.rect.set(newHead);
        tail.isHead.set(true);
        this.segments.set([tail, ...this.segments.get().slice(0, -1)]);
        this.elapsedTime = 0;
        // add a segment at the end if we're over the pellet
        if (this.isOverPellet()) {
          this.segments.push({
            isHead: atom(false),
            rect: atom(oldTailRect),
          });
          this.onHit();
        }
      }
    }
  }
}
