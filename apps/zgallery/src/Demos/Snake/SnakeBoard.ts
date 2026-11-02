import { Box,atom, Button, SVG, SVGRectangle, VStack, ch, ViewList, zcolor, zspace } from "zaffre";
import { rect2D, pct, SVGCircle, StackOptions } from "zaffre";
import { SnakeModel } from "./SnakeModel";
import { SnakeSegment } from "./Snake";

export const SnakeBoard = () => {
  const model = new SnakeModel();

  const Segment = (segment: SnakeSegment) => {
    return SVGRectangle({
      rect: rect2D(1, 1, model.blockSize - 2, model.blockSize - 2),
      rx: 8,
      ry: 8,
      fill: () => segment.isHead.get() ? zcolor.red : zcolor.primary,
      transform: () => `translate(${segment.rect.get().x}px, ${segment.rect.get().y}px`,
      model: segment,
    });
  }
  const Pellet = () => {
    return SVGCircle({
      c: model.pelletCenter(),
      r: model.blockSize / 2,
      fill: zcolor.tertiary,
    });
  }

  const MainBox = () => {
    return SVGRectangle({
      rect: model.bounds,
      fill: zcolor.primaryContainer,
    });
  }
  const boxOptions: StackOptions = {
    width: pct(90),
    maxWidth: ch(100),
    padding: zspace.s4,
    background: zcolor.gray,
    onIntersectionVisible: (view) => view.focus(),
    outline: "none",
    events: {
      keyBindings: {
        "ArrowUp": () => model.turn(0, 1),
        "ArrowDown": () => model.turn(0, -1),
        "ArrowLeft": () => model.turn(1, 0),
        "ArrowRight": () => model.turn(-1, 0),
      },
    },
  };

  return VStack({ width: pct(100), gap: zspace.s4, name: "Snake", model: model }).append(
    Button({
      label: () => (model.isRunning ? "Stop" : "Start"),
      action: () => (model.isRunning ? model.pause() : model.start()),
      preserveFocus: true,
    }),
    Box(boxOptions).append(
      SVG({ width: pct(100), bounds: model.bounds }).append(
        MainBox(),
        Pellet(),
        ViewList(
          model.snake.segments,
          (segment) => segment,
          (segment) => Segment(segment)
        )
      )
    )
  );
}
