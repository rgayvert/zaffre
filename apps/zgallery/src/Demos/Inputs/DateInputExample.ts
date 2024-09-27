import { DateInput, atom, core, View, DateTimeFormatter } from "zaffre";
import { ValueBox } from "./ValueBox";

export function DateInputExample(): View {
  const date = atom(new Date(2024, 7, 21));
  return ValueBox(
    atom(() => DateTimeFormatter("YYYY-MM-DD")(date.get())),
    undefined, 
    DateInput(date, {
      border: core.border.thin.color(core.color.blue),
      rounding: core.rounding.r2,
      font: core.font.title_medium,
    }),
    DateInput(date, {
      border: core.border.thin.color(core.color.blue),
      rounding: core.rounding.r2,
      font: core.font.title_medium,
      useNativePickerIcon: false,
    })
  );
}
