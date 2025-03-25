import { BasicAction, Point2D, point2D, Rect2D, vector2D, atom, Vector2D } from ":foundation";

//
// An AnimationItem is an object which implements the step() method. 
//

export interface AnimationItem {
  step: (deltaT: number, elapsed: number) => void;
  begin?: BasicAction;
  end?: BasicAction;
}

//
// A SimpleAnimationItem is an AnimationItem with a 2D location and velocity. At each step
// it will update its location based on its velocity.
//

export class SimpleAnimationItem implements AnimationItem {
  location = atom(point2D(0, 0));
  velocity = atom(vector2D(0, 0));
  bounds?: Rect2D;
  speed = atom(() => this.velocity.get().magnitude());

  constructor(public initialLocation = point2D(0, 0), public initialVelocity = vector2D(0, 0)) {
    this.setToInitialValues();
  }
  getLocation(): Point2D {
    return this.location.get();
  }
  setLocation(pt: Point2D): void {
    this.location.set(pt.clampToRect(this.bounds));
  }
  getVelocity(): Vector2D {
    return this.velocity.get();
  }
  setVelocity(vx: number, vy: number): void {
    this.velocity.set(vector2D(vx, vy));
  }
  step(deltaT: number, elapsed: number): void {
    this.setLocation(this.location.get().add(this.velocity.get().scalarMultiply(deltaT)));
  }
  begin(): void {
    // hook
    this.setToInitialValues();
  }
  end(): void {
    // hook
    this.setToInitialValues();
  }
  setToInitialValues(): void {
    this.setLocation(this.initialLocation);
    this.velocity.set(this.initialVelocity);
  }
  transformPxLocation(): string {
    return `translate(${this.location.get().x}px, ${this.location.get().y}px)`;
  }
}
