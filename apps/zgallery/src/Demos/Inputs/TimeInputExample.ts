import { atom, core, View, TimeInput, TimeOfDay } from "zaffre";
import { ValueBox } from "./ValueBox";

export function TimeInputExample(): View {
  const time = atom(new TimeOfDay(12, 34, 56));
  return ValueBox(
    atom(() => time.get().toString()), 
    undefined, 
    TimeInput(time, {
      border: core.border.thin.color(core.color.blue),
      font: core.font.title_medium,
    }),
  );
}
