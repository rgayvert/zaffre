import { View, Box, core, atom, px, Button, SVG, SVGRectangle, ch } from "zaffre";
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
export function Pong(): View {
  const model = new PongModel();

  function PongBall(): View {
    return SVGRectangle({
      rect: rect2D(0, 0, 16, 16),
      fill: core.color.red,
      transform: atom(() => `translate(${model.ball.location.get().x}px, ${model.ball.rect.get().y}px`),
    });
  }
  function PongPaddle(paddle: PongPaddle): View {
    return SVGRectangle({
      rect: paddle.rect.get().translateToOrigin(),
      fill: core.color.blue,
      transform: atom(() => `translate(${paddle.rect.get().x}px, ${paddle.rect.get().y}px`),
    });
  }
  function ScoreBox(score: zstring, index: number): View {
    return SVGText(score, {
      x: index === 0 ? 270 : 370,
      y: 64,
      fontSize: px(64),
      textAnchor: "middle",
      fill: core.color.white,
    });
  }
  function MainBox(): View {
    return SVGRectangle({
      x: 0,
      y: 0,
      width: 640,
      height: 480,
      fill: core.color.black,
      events: { pointerMove: (evt) => model.userPaddleY.set(getSVGPointFromEvent(evt).y) },
    });
  }

  return VStack({ width: pct(100), maxWidth: ch(120), gap: core.space.s4 }).append(
    Button({
      label: atom(() => (model.isRunning ? "Stop" : "Start")),
      action: () => (model.isRunning ? model.stop() : model.start()),
    }),
    Box({ width: pct(90), padding: core.space.s4, background: core.color.gray }).append(
      SVG({ width: pct(100), bounds: rect2D(0, 0, 640, 480) }).append(
        MainBox(),
        ...model.blocks.map((block) => SVGRectangle({ rect: block, fill: core.color.white })),
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
