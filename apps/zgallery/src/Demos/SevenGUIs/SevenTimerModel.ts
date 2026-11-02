import { atom, zutil, timerAtom } from "zaffre";

export class SevenTimerModel {
  elapsedTime = atom(0, { action: (et) => this.elapsedTimeChanged(et) });
  timer = timerAtom((msec) => this.elapsedTime.set(msec / 1000), 0.1);
  duration = atom(10, { action: (dur) => this.durationChanged(dur) });
  percent = atom(() => (100 * this.elapsedTime.get()) / this.duration.get());
  elapsedLabel = atom(() => `${zutil.printRoundedTo(this.elapsedTime.get(), 1)}s`);

  elapsedTimeChanged(et: number): void {
    if (et >= this.duration.get()) {
      this.timer.pause();
    }
  }
  durationChanged(dur: number): void {
    if (this.elapsedTime.get() < this.duration.get()) {
      this.timer.resume();
    }
  }
  reset(): void {
    this.timer.restart();
  }
}
