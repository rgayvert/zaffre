import { atom, core, View, DateTimeInput, DateTimeFormatter } from "zaffre";
import { ValueBox } from "./ValueBox";

export function DateTimeInputExample(): View {
  const dateTime = atom(new Date("2023-07-21T07:15:00.000Z"));
  const formatter = DateTimeFormatter("YYYY-MM-DDThh:mm");
  return ValueBox(
    atom(() => formatter(dateTime.get())),
    undefined,
    DateTimeInput(dateTime, {
      border: core.border.thin.color(core.color.blue),
      font: core.font.title_medium,
    })
  );
}
