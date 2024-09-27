import { atom, core, View, Week, WeekInput } from "zaffre";
import { ValueBox } from "./ValueBox";

export function WeekInputExample(): View {
  const week = atom(new Week(2024, 12));
  return ValueBox(
    atom(() => week.get().toString()),
    undefined,
    WeekInput(week, {
      border: core.border.thin.color(core.color.blue),
      font: core.font.title_medium,
    })
  );
}
