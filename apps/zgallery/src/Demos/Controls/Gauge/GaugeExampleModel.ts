import { atom, timerAtom, toggleAtom } from ":foundation";

export class GaugeExampleModel {
  percent2 = atom(10);
  counter = timerAtom((_msec) => this.percent2.set(this.percent2.get() + 1), 100);
  running = toggleAtom(false, { action: (b) => this.counter.toggle() });
}
