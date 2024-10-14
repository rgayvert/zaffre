import { atom, znumber, zget } from ":foundation";
import { ch, css_color, em, pct, View, css_space, px, BV, restoreOptions } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A A Gauge is a nested pair of boxes, where the length of the inner box (done) is a
// fraction of the outer box (pending). This is typically used to display a completion percentage.
//

interface GaugeOptions extends BoxOptions {
  doneColor?: css_color;
  pendingColor?: css_color;
  minVal?: number;
  maxVal?: number;
  innerMargin?: css_space;
}
defineComponentBundle<GaugeOptions>("Gauge", "Box", {
  width: ch(20),
  height: em(1),
  innerMargin: px(0),
  minVal: 0,
  maxVal: 100,
  doneColor: core.color.primary,
  pendingColor: core.color.primaryContainer,
});

export function Gauge(value: znumber, inOptions: BV<GaugeOptions> = {}): View {
  const options = mergeComponentOptions("Gauge", inOptions);
  options.background = options.pendingColor;
  options.padding = options.innerMargin;
  function getPercent(): number {
    const val = (zget(value) - options.minVal!) % (options.maxVal! - options.minVal!);
    return (val / (options.maxVal! - options.minVal!)) * 100;
  }
  return restoreOptions(
    Box(options).append(
      Box({
        width: atom(() => pct(getPercent())),
        height: pct(100),
        background: options.doneColor,
        rounding: options.rounding,
      })
    )
  );
}
