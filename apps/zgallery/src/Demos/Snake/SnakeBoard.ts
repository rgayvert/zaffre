import { View, Box, core, atom, Button, SVG, SVGRectangle, VStack, ch, ViewList } from "zaffre";
import { rect2D, pct, SVGCircle, StackOptions } from "zaffre";
import { SnakeModel } from "./SnakeModel";
import { SnakeSegment } from "./Snake";

export function SnakeBoard(): View {
  const model = new SnakeModel();

  function Segment(segment: SnakeSegment): View {
    return SVGRectangle({
      rect: rect2D(1, 1, model.blockSize - 2, model.blockSize - 2),
      rx: 8,
      ry: 8,
      fill: atom(() => segment.isHead.get() ? core.color.red : core.color.primary),
      transform: atom(() => `translate(${segment.rect.get().x}px, ${segment.rect.get().y}px`),
      model: segment,
    });
  }
  function Pellet(): View {
    return SVGCircle({
      c: model.pelletCenter(),
      r: model.blockSize / 2,
      fill: core.color.tertiary,
    });
  }

  function MainBox(): View {
    return SVGRectangle({
      rect: model.bounds,
      fill: core.color.primaryContainer,
    });
  }
  const boxOptions: StackOptions = {
    width: pct(90),
    maxWidth: ch(100),
    padding: core.space.s4,
    background: core.color.gray,
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

  return VStack({ width: pct(100), gap: core.space.s4, name: "Snake", model: model }).append(
    Button({
      label: atom(() => (model.isRunning ? "Stop" : "Start")),
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
