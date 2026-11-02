import { Button, HStack, VStack, TimerAtom, TextLabel, addClass } from "zaffre";
import { TimerAtomModel } from "./TimerAtomModel";
import { rules } from "./TimerAtomExample.rules";

export const TimerAtomExample = () => {
  const model = new TimerAtomModel();
  const options = addClass({}, "Timer1", rules);

  const TimerWithButton = (timer: TimerAtom<string>) => {
    return HStack().append(
      TextLabel(timer),
      Button({
        label: () => (timer.isRunning() ? "Stop" : "Start"),
        action: () => timer.toggle(),
      }),
    );
  };
  return VStack(options).append(TextLabel(model.clock), TimerWithButton(model.stopWatch), TimerWithButton(model.intervalTimer));
};
