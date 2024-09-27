import { Grid, Page, View, ch, core, pct, vmin  } from "zaffre";
import { Counter } from "./Counter";

export function CounterGridExample(): View {
  return Page({ maxWidth: ch(100) }).append(
    Grid({ nrows: 2, ncolumns: 2, gap: core.space.s2, width: vmin(70) }).append(
      Counter("counter1"),
      Counter("counter2", { min: 10, max: 30, initialValue: 20 }),
      Counter("counter3", { rounded: false, min: 20, max: 60, initialValue: 30 }),
      Counter("counter4", { rounded: false, min: -9, max: 9, initialValue: 0 })
    )
  );
}
