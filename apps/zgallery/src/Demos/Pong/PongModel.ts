import { atom, vector2D, AnimationModel, zutil, rect2D, Rect2D, incrementAtom } from "zaffre";
import { PongBall, PongPaddle } from "./PongItems";

/**
 * Pong consists of:
 *   - a 640x480 box
 *   - a pair of rectangular paddles with a fixed x coordinate
 *   - a fixed-size ball that moves within the game box, and bounces off the paddles and the horizontal edges of the box
 *   - a set of fixed blocks in the middle that serve as starting points for the ball
 *   - a pair of scores to track the number of points won by each side
 * 
 *  The game is run as a simple animation model, where the ball and paddles are the only animation items.
 * 
 *  The rules are simple:
 *   - the ball starts moving horizontally from one of the middle blocks
 *   - if the ball hits a paddle, its velocity will change to simulate a bounce
 *   - the angle at which the balls bounces off a paddle will depend on where the impact point is on the paddle
 *   - the ball will bounce off the wall at the same angle as the impact
 *   - if the ball hits the left or right wall, the player on the opposite side gets a point
 *   - the game is over when one player gets 10 points
 * 
 *  Note that this model knows nothing about the UI. It provides one reactive value that the UI can use to 
 *  control the user paddle position.
*/

export class PongModel extends AnimationModel {
  // the starting blocks
  blocks = zutil.sequence(0, 15).map((i) => rect2D(312, i * 32 + 8, 16, 16));
  // the ball
  startingVelocity = vector2D(0.3, 0);
  ball = new PongBall(zutil.randomElement(this.blocks).origin, this.startingVelocity);
  // a pair of paddles; the one on the left is set to autoplay, and the one on the right has a y-value that is user-controlled
  userPaddleY = atom(200);
  paddles = [new PongPaddle(24, this.ball), new PongPaddle(616, this.ball, this.userPaddleY)];
  // scorekeeping
  scores = zutil.sequence(0, 2).map((i) => atom(0));
  gameOver = atom(() => this.scores[0].get() === 10 || this.scores[1].get() === 10, {
    action: (b) => b && this.stop(),
  });

  constructor() {
    super();
    this.setItems([this.ball, ...this.paddles]);
    this.ball.location.addAction(() => this.ballMoved());
  }
  start(): void {
    super.start();
    this.scores.forEach((score) => score.set(0));
  }
  // start the ball moving horizontally from a random block
  initializeBall(): void {
    this.ball.location.set(zutil.randomElement(this.blocks).origin);
    this.startingVelocity = this.startingVelocity.scalarMultiply(-1);
    this.ball.velocity.set(this.startingVelocity);
  }
  // 
  ballMoved(): void {
    const ballRect = this.ball.rect.get();
    if (ballRect.intersects(this.paddles[0].rect.get())) {
      // bounce off left paddle
      this.bounceOffPaddle(this.paddles[0], true, ballRect);
    } else if (ballRect.intersects(this.paddles[1].rect.get())) {
            // bounce off right paddle
      this.bounceOffPaddle(this.paddles[1], false, ballRect);
    } else if (ballRect.top < 0 || ballRect.bottom > 480) {
                  // bounce off top or bottom edge
      this.bounceOffWall();
    } else if (ballRect.left < 0) {
      // player 1 wins a point
      incrementAtom(this.scores[1]);
      this.initializeBall();
    } else if (ballRect.right > 640) {
      // player 2 wins a point
      incrementAtom(this.scores[0]);
      this.initializeBall();
    }
  }
  // wall bounce: x-velocity stays same, y-velocity is negated
  bounceOffWall(): void {
    const velocity = this.ball.velocity.get();
    this.ball.velocity.set(vector2D(velocity.x, -velocity.y));
  }
  // paddle bounce: change the angle of the ball's velocity based on the point of impact is on the paddle
  bounceOffPaddle(paddle: PongPaddle, isLeft: boolean, ballRect: Rect2D): void {
    const dy = (paddle.rect.get().center.y - ballRect.center.y) / paddle.rect.get().height;
    const maxAngle = Math.PI * 0.7;
    const velocity = this.ball.velocity.get();
    const angle = isLeft ? -dy * maxAngle : Math.PI + dy * maxAngle;
    this.ball.velocity.set(velocity.withAngle(angle));
  }
}
