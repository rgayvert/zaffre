import { timerAtom, zutil } from "zaffre";

export class TimerAtomModel {
  clock = timerAtom(() => `Clock: ${new Date().toLocaleTimeString()}`, 1000, {
    runImmediately: true,
  });
  stopWatch = timerAtom((msec) => `Stopwatch: ${zutil.formatSeconds(msec / 1000)}`, 1000);
  intervalTimer = timerAtom(
    (msec) => `Interval Timer: ${zutil.formatSeconds(msec / 1000)}`,
    [1000, 2000, 3000, 4000, 5000]
  );
}
