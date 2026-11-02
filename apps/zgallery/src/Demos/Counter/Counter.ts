import { SVG, SVGContainerOptions, addClass, px } from "zaffre";
import { SVGLabel, SVGLabelOptions, rect2D, Rect2D, zstring } from "zaffre";
import { CounterModel } from "./CounterModel";

export interface CounterOptions extends SVGContainerOptions {}

const CounterLabel = (label: zstring, bounds: Rect2D, inOptions: SVGLabelOptions) => {
  const options = addClass(inOptions, "Counter_Label");
  return SVGLabel(label, {
    ...options,
    x: bounds.x,
    y: bounds.y,
    width: px(bounds.width),
    height: px(bounds.height),
  });
};

export const Counter = (model: CounterModel, inOptions: CounterOptions = {}) => {
  const options = addClass(inOptions, "Counter");
  options.model = model;

  return SVG(options).append(
    CounterLabel(model.countString, rect2D(10, 10, 80, 80), {
      cls: "Counter_Count",
      vOffset: -6,
    }),
    CounterLabel("-", rect2D(25, 90, 20, 20), {
      cls: "Counter_Minus",
      disabled: model.mayNotDecrement,
      events: { click: () => model.decrement() },
    }),
    CounterLabel("+", rect2D(55, 90, 20, 20), {
      cls: "Counter_Plus",
      disabled: model.mayNotIncrement,
      events: { click: () => model.increment() },
    }),
  );
};
