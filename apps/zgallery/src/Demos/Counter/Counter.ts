import { BV, SVG, SVGContainerOptions, View, pct, px, restoreOptions, zboolean } from "zaffre";
import { defineComponentBundle, mergeComponentOptions } from "zaffre";
import { SVGTextLabel, SVGTextLabelOptions, rect2D, Rect2D, zstring } from "zaffre";
import { CounterModel } from "./CounterModel";

export interface CounterOptions extends SVGContainerOptions {
  rounded?: zboolean;
  min?: number;
  max?: number;
  initialValue?: number;
}
defineComponentBundle<CounterOptions>("Counter", "", {
  rounded: true,
  min: 0,
  max: 99,
  initialValue: 0,
  bounds: rect2D(0, 0, 100, 120),
  width: pct(100),
});

function CounterLabel(label: zstring, bounds: Rect2D, options: SVGTextLabelOptions): View {
  return SVGTextLabel(label, {
    ...options,
    x: bounds.x,
    y: bounds.y,
    width: px(bounds.width),
    height: px(bounds.height),
    cursor: "pointer",
  });
}

export function Counter(key: string, inOptions: BV<CounterOptions> = {}): View {
  const options = mergeComponentOptions("Counter", inOptions);
  const model = new CounterModel(key, options.min, options.max, options.initialValue);

  return restoreOptions(
    SVG(options).append(
      CounterLabel(model.countString, rect2D(10, 10, 80, 80), { ...options, vOffset: -6 }),
      CounterLabel("-", rect2D(25, 90, 20, 20), {
        ...options,
        disabled: model.mayNotDecrement,
        events: { click: () => model.decrement() },
      }),
      CounterLabel("+", rect2D(55, 90, 20, 20), {
        ...options,
        disabled: model.mayNotIncrement,
        events: { click: () => model.increment() },
      })
    )
  );
}
