import { zget, znumber } from ":foundation";
import { Box, BoxOptions } from "../HTML";
import { addClass } from ":view";
import { pct } from ":attributes";

//
// A Gauge is a nested pair of boxes, where the length of the inner box (done) is a
// fraction of the outer box (pending). This is typically used to display a completion percentage.
//

export interface GaugeOptions extends BoxOptions {}

export const Gauge = (percent: znumber, inOptions: GaugeOptions = {}) => {
  const options = addClass(inOptions, "Gauge");
  options.model = percent;

  return Box(options).append(
    Box({
      cls: "Gauge.InnerBox",
      width: () => pct(zget(percent)),
    }),
  );
};
