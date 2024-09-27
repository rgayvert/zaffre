import { core, View, atom, px, ch } from "zaffre";
import { Gauge, Grid, toggleAtom, Switch, timerAtom } from "zaffre";

export function GaugeExample(): View {
  const percent1 = atom(60);
  const percent2 = atom(0);
  const counter = timerAtom((msec) => percent2.set(percent2.get() + 1), 100);
  const running = toggleAtom(false, { action: (b) => counter.toggle() });

  return Grid({ ncolumns: 3, gap: core.space.s7 }).append(
    // fixed gauge
    Gauge(60, {
      width: ch(20),
      doneColor: core.color.primary,
      pendingColor: core.color.secondary,
    }),
    // progress bar
    Gauge(percent2, {
      width: ch(20),
      minVal: -10,
      maxVal: 30,
      doneColor: core.color.yellow,
      pendingColor: core.color.green,
      innerMargin: px(2),
      rounding: core.rounding.r5,
    }),
    Switch(running, { widthInEm: 2.2 })
  );
}
