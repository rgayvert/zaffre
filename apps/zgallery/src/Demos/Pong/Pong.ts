import { Box,atom, px, Button, SVG, SVGRectangle, ch, zcolor, zspace } from "zaffre";
import { VStack, rect2D, SVGText, zstring, pct, getSVGPointFromEvent } from "zaffre";
import { PongModel } from "./PongModel";
import { PongPaddle } from "./PongItems";

/**
 * The Pong UI
 *   - SVG components are used for all of the parts
 *   - the ball and paddles are SVGRectangles with reactive transforms
 *   - the score is shown with a pair of SVGText items
 *   - the user paddle position is controlled by tracking the pointer position
 *   - the SVG viewbox is 640x480
 *   - the SVG container is placed in a box with width=90%, so it scales with window size
 */
export const Pong = () => {
  const model = new PongModel();

  const PongBall = () => { 
    return SVGRectangle({
      rect: rect2D(0, 0, 16, 16),
      fill: zcolor.red,
      transform: () => `translate(${model.ball.location.get().x}px, ${model.ball.rect.get().y}px`,
    });
  }
  const PongPaddle = (paddle: PongPaddle) => {
    return SVGRectangle({
      rect: paddle.rect.get().translateToOrigin(),
      fill: zcolor.blue,
      transform: () => `translate(${paddle.rect.get().x}px, ${paddle.rect.get().y}px`,
    });
  }
  const ScoreBox = (score: zstring, index: number) => {
    return SVGText(score, {
      x: index === 0 ? 270 : 370,
      y: 64,
      fontSize: px(64),
      textAnchor: "middle",
      fill: zcolor.white,
    });
  }
  const MainBox = () => {
    return SVGRectangle({
      x: 0,
      y: 0,
      width: 640,
      height: 480,
      fill: zcolor.black,
      events: { pointerMove: (evt) => model.userPaddleY.set(getSVGPointFromEvent(evt).y) },
    });
  }

  return VStack({ width: pct(100), maxWidth: ch(120), gap: zspace.s4 }).append(
    Button({
      label: () => (model.isRunning ? "Stop" : "Start"),
      action: () => (model.isRunning ? model.stop() : model.start()),
    }),
    Box({ width: pct(90), padding: zspace.s4, background: zcolor.gray }).append(
      SVG({ width: pct(100), bounds: rect2D(0, 0, 640, 480) }).append(
        MainBox(),
        ...model.blocks.map((block) => SVGRectangle({ rect: block, fill: zcolor.white })),
        ...model.scores.map((score, idx) =>
          ScoreBox(
            atom(() => score.get().toString()),
            idx
          )
        ),
        PongBall(),
        ...model.paddles.map((paddle) => PongPaddle(paddle))
      )
    )
  );
}
