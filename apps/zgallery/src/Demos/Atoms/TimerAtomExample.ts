import { View, core, TextLabel, atom } from "zaffre";
import { Button, HStack, ch, VStack, TimerAtom } from "zaffre";
import { TimerAtomModel } from "./TimerAtomModel";

export function TimerAtomExample(): View { 
  const model = new TimerAtomModel();

  function TimerWithButton(timer: TimerAtom<string>): View {
    return HStack({ gap: core.space.s3 }).append(
      TextLabel(timer, {
        padding: core.space.s2,
        font: core.font.headline_medium,
      }),
      Button({
        label: atom(() => (timer.isRunning() ? "Stop" : "Start")),
        action: () => timer.toggle(),
        width: ch(10),
        rounding: core.rounding.pill,
        ripple: false,
      })
    );
  }
  return VStack().append(
    TextLabel(model.clock, {
      padding: core.space.s2,
      font: core.font.headline_medium,
    }),
    TimerWithButton(model.stopWatch),
    TimerWithButton(model.intervalTimer)
  );
}
