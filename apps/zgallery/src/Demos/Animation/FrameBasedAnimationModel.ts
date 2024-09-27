import { BasicAnimator, SimpleAnimationItem, point2D, vector2D, AnimationModel } from "zaffre";

export class FrameBasedAnimationModel extends AnimationModel {
  // the animation items; each has a location (Point2D) and velocity (Vector2D)
  thing1 = new SimpleAnimationItem(point2D(0, 0), vector2D(0.1, 0));     // move right
  thing2 = new SimpleAnimationItem(point2D(180, 0), vector2D(-0.1, 0));  // move left

  basicAnimator(): BasicAnimator {
    return new BasicAnimator({ duration: 1500 });
  }
  constructor() {
    super();
    this.setItems([this.thing1, this.thing2]);
  }

}
