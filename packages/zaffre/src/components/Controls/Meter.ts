import { atom, zget, znumber } from ":foundation";
import { Box, BoxOptions } from "../HTML";
import { addClass } from ":view";
import { TextLabel } from "../Content";
import { pct } from ":attributes";

//
// A Gauge is a nested pair of boxes, where the length of the inner box (done) is a
// fraction of the outer box (pending). This is typically used to display a completion percentage.
//

export const Meter = (percent: znumber, inOptions: BoxOptions = {}) => {
  const options = addClass(inOptions, "Meter");
  options.model = percent;
  const w = atom(() => pct(zget(percent)));

  return Box(options).append(
    TextLabel("Storage Used", { cls: "Meter.TextLabel" }),
    TextLabel(() => `${zget(percent)}%`, { cls: "Meter.Value" }),
    Box({ cls: "Meter.Track" }).append(Box({ width: w, height: pct(100), cls: "Meter.Indicator" })),
  );
};
