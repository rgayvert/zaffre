import { SimpleAnimationItem, atom, vector2D, zutil, rect2D } from "zaffre";
import { point2D, Atom } from "zaffre";

/**
 * A ball is a 16x16 square with a location and velocity
 */
export class PongBall extends SimpleAnimationItem {
  rect = atom(() => rect2D(this.location.get().x, this.location.get().y, 16, 16));
}
/**
 * A paddle is a 16x80 rectangle that can only move vertically.
 * If userPaddleY is provided, the paddle will be moved by some user gesture (e.g., mouse move); otherwise,
 * the paddle will be moved automatically based on the ball location.
 */
export class PongPaddle extends SimpleAnimationItem {
  autoplay: boolean;
  rect = atom(() => rect2D(this.x, this.location.get().y, 16, 80));

  constructor(public x: number, public ball: PongBall, public userPaddleY?: Atom<number>) {
    super(point2D(x, 200));
    this.autoplay = !userPaddleY;
  }

  step(deltaT: number, elapsed: number): void {
    super.step(deltaT, elapsed);
    let targetY;
    const ballLoc = this.ball.location.get();
    const ballV = this.ball.velocity.get();
    if (this.autoplay) {
      // move at a fixed velocity toward where we think the ball will hit
      if (ballV.x > 0) {
        targetY = 240;
      } else {
        const yInt = ballLoc.y - (ballLoc.x * ballV.y) / ballV.x;
        targetY = yInt < 0 || yInt > 440 ? 240 : yInt;
      }
    } else {
      // follow the user gesture
      targetY = this.userPaddleY?.get();
    }
    if (targetY) {
      const dy = zutil.clamp(targetY, 20, 460) - this.rect.get().center.y;
      this.velocity.set(vector2D(0, zutil.clamp(dy * 0.01, -0.5, 0.5)));
    }
  }
}
