import { atom, core, View, MonthInput, Month } from "zaffre";
import { ValueBox } from "./ValueBox";

export function MonthInputExample(): View {
  const month = atom(new Month(2024, 5));
  return ValueBox(
    atom(() => month.get().toString()),
    undefined,
    MonthInput(month, {
      border: core.border.thin.color(core.color.blue),
      font: core.font.title_medium,
    })
  );
}
